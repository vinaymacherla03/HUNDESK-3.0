
import { ResumeData } from '../types';
import { findMatchingJobs } from './geminiService';

/**
 * Internal API for fetching jobs.
 * This acts as a facade to standardize job fetching logic across the application.
 * It currently wraps the Gemini service but could be expanded to hit a real backend.
 */
export const internalJobApi = {
    async searchJobs(resumeData: ResumeData, params: {
        query: string;
        location: string;
        filters: { remote: boolean; salary: string; experience: string };
        page?: number;
    }) {
        // Validate parameters before making the expensive call
        if (!params.query) throw new Error("Search query is required");

        console.log(`[Internal API] Fetching jobs for query: ${params.query}`);
        
        // Call the underlying service
        // In a real backend scenario, this would be `fetch('/api/jobs', ...)`
        const results = await findMatchingJobs(
            resumeData, 
            params.location, 
            params.query, 
            params.filters, 
            params.page || 1
        );

        return results;
    }
};
