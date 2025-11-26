
import { ResumeData, JobListing } from '../types';
import { internalJobApi } from './internalJobApi';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface JobSearchParams {
    query: string;
    location: string;
    filters: {
        remote: boolean;
        salary: string;
        experience: string;
    };
    page?: number;
}

export interface JobSearchResult {
    marketSummary: string;
    jobs: JobListing[];
    source: 'cache' | 'live';
    cachedAt?: number;
}

const CACHE_COLLECTION = 'job_searches';
const CACHE_DURATION_MS = 21 * 24 * 60 * 60 * 1000; // 21 Days (3 Weeks)

// Simple 53-bit hash function (cyrb53) to generate collision-resistant short keys
const cyrb53 = (str: string, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

export class JobService {
    // L1 Memory Cache for instant session retrieval
    private static memoryCache = new Map<string, JobSearchResult>();
    
    // In-flight request deduplication map to prevent redundant simultaneous fetches
    private static inFlightRequests = new Map<string, Promise<JobSearchResult>>();
    
    private static generateCacheKey(resumeData: ResumeData, params: JobSearchParams): string {
        // Normalize inputs to ensure cache hits on similar queries
        const keyData = {
            profile: resumeData.title?.trim().toLowerCase() || 'general',
            q: params.query.trim().toLowerCase(),
            l: params.location.trim().toLowerCase(),
            r: params.filters.remote,
            s: params.filters.salary,
            e: params.filters.experience,
            p: params.page || 1
        };
        // Generate hash
        const hash = cyrb53(JSON.stringify(keyData));
        return `search_v6_${hash}`;
    }

    static async search(resumeData: ResumeData, params: JobSearchParams): Promise<JobSearchResult> {
        // 1. Input Validation
        const page = Math.max(1, Math.floor(Number(params.page) || 1));
        
        if(params.query.length > 200) {
            throw new Error("Query too long");
        }

        const cacheKey = this.generateCacheKey(resumeData, { ...params, page });

        // 2. L1 Cache Check (Memory)
        if (this.memoryCache.has(cacheKey)) {
            const cached = this.memoryCache.get(cacheKey)!;
            if (Date.now() - (cached.cachedAt || 0) < CACHE_DURATION_MS) {
                console.log("[JobService] L1 Cache Hit (Memory)");
                return { ...cached, source: 'cache' };
            }
        }

        // 3. In-Flight Deduplication
        // If a request for this key is already pending, return that promise instead of starting a new one.
        if (this.inFlightRequests.has(cacheKey)) {
            console.log("[JobService] Deduplicating in-flight request");
            return this.inFlightRequests.get(cacheKey)!;
        }

        const fetchPromise = (async (): Promise<JobSearchResult> => {
            try {
                // 4. L2 Cache Check (Firestore - Central Database)
                if (db) {
                    try {
                        const docRef = doc(db, CACHE_COLLECTION, cacheKey);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            const data = docSnap.data() as JobSearchResult;
                            const age = Date.now() - (data.cachedAt || 0);
                            
                            if (age < CACHE_DURATION_MS) {
                                console.log("[JobService] L2 Cache Hit (Central DB)");
                                this.memoryCache.set(cacheKey, { ...data, source: 'cache' });
                                return { ...data, source: 'cache' };
                            }
                        }
                    } catch (e) {
                        console.warn("[JobService] L2 Cache lookup failed", e);
                    }
                }

                // 5. Live Fetch via Internal API
                console.log("[JobService] Fetching live data...");
                const results = await internalJobApi.searchJobs(resumeData, { ...params, page });
                
                const timestamp = Date.now();
                const finalResult: JobSearchResult = { ...results, source: 'live', cachedAt: timestamp };

                // Update L1 Cache
                this.memoryCache.set(cacheKey, finalResult);

                // 6. Save to L2 Cache (Central Database)
                if (db) {
                    try {
                        const docRef = doc(db, CACHE_COLLECTION, cacheKey);
                        // Fire and forget the save to not block UI
                        setDoc(docRef, finalResult).then(() => {
                            console.log("[JobService] Saved results to Central DB");
                        }).catch(e => {
                            console.warn("[JobService] Failed to update L2 cache", e);
                        });
                    } catch (e) {
                        console.warn("[JobService] DB Error", e);
                    }
                }

                return finalResult;
            } finally {
                // Clean up in-flight request
                this.inFlightRequests.delete(cacheKey);
            }
        })();

        this.inFlightRequests.set(cacheKey, fetchPromise);
        return fetchPromise;
    }
}
