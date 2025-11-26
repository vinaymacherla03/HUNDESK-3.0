
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { ResumeData, SkillCategory, SuggestedSkill, Project, KeywordAnalysis, AuditResult, JobListing, InterviewQuestion, InterviewFeedback } from '../types';
import { scheduler } from '../utils/scheduler';
import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// --- Cache Utilities ---

// Simple 53-bit hash function to generate cache keys from input data
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

const getCachedResult = async (operation: string, input: any) => {
    if (!db) return null;
    try {
        const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
        const hash = cyrb53(inputStr).toString();
        const key = `${operation}_${hash}`;
        const docRef = doc(db, 'ai_cache', key);
        const snap = await getDoc(docRef);
        
        if (snap.exists()) {
            const data = snap.data();
            // Optional: Check for expiration (e.g., 30 days)
            // if (Date.now() - data.createdAt > 30 * 24 * 60 * 60 * 1000) return null;
            console.log(`[GeminiService] Cache Hit for ${operation}`);
            return data.result;
        }
    } catch (e) {
        console.warn(`[GeminiService] Cache lookup failed for ${operation}`, e);
    }
    return null;
};

const setCachedResult = async (operation: string, input: any, result: any) => {
    if (!db) return;
    try {
        const inputStr = typeof input === 'string' ? input : JSON.stringify(input);
        const hash = cyrb53(inputStr).toString();
        const key = `${operation}_${hash}`;
        const docRef = doc(db, 'ai_cache', key);
        await setDoc(docRef, {
            result,
            createdAt: Date.now(),
            operation
        });
        console.log(`[GeminiService] Cache Saved for ${operation}`);
    } catch (e) {
        console.warn(`[GeminiService] Cache save failed for ${operation}`, e);
    }
    return null;
};

// --- End Cache Utilities ---

// Helper to parse JSON from AI responses that might contain Markdown code blocks
export const parseJsonResult = (text: string): any => {
    if (!text) return {};
    try {
        let cleanText = text.trim();
        
        // 1. Try regex for markdown json block
        const jsonBlockMatch = cleanText.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (jsonBlockMatch) {
            cleanText = jsonBlockMatch[1].trim();
        } else {
            // 2. Fallback: Locate outer braces to handle chatty intros/outros
            const firstOpen = cleanText.indexOf('{');
            const lastClose = cleanText.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
                cleanText = cleanText.substring(firstOpen, lastClose + 1);
            }
        }
        
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON from AI response. Raw text:", text);
        // Return empty structure to prevent app crash, let UI handle empty state
        return {};
    }
};

const grammarSchema = {
    type: Type.OBJECT,
    properties: {
        corrected: { type: Type.STRING, description: "The text with all grammar, spelling, and punctuation errors fixed. If the original is correct, this should match the original." },
        issues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    original: { type: Type.STRING, description: "The specific text segment containing the error." },
                    suggestion: { type: Type.STRING, description: "The corrected text segment." },
                    reason: { type: Type.STRING, description: "A very brief reason (e.g., 'Spelling', 'Grammar')." }
                },
                required: ['original', 'suggestion', 'reason']
            }
        }
    },
    required: ['corrected', 'issues']
};

export const validateGrammar = async (text: string): Promise<{ corrected: string; issues: any[] } | null> => {
    if (!process.env.API_KEY || !text || text.trim().length < 10) return null;

    // Grammar check is highly interactive and specific to current edit state, 
    // so we skip caching for immediate feedback loop unless identical (which browser might handle).
    // We could add short-term caching here if needed.

    const prompt = `
    Act as a professional editor. Check the following text for grammar, spelling, and punctuation errors.
    - Return the CORRECTED full text.
    - List specific issues found.
    - If the text is already correct, 'corrected' should be the same as the input, and 'issues' should be empty.
    - Ignore sentence fragments if they are typical for resumes (e.g., "Managed a team" instead of "I managed a team").
    
    Text:
    "${text}"
    `;

    try {
        const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: grammarSchema
            },
        }));

        const jsonText = response.text?.trim();
        if (!jsonText) return null;
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Grammar check failed:", error);
        return null;
    }
};

export const enhanceResume = async (resumeText: string, jobDesc: string, jobTitle: string): Promise<ResumeData> => {
    const cacheKey = { resumeText, jobDesc, jobTitle };
    const cached = await getCachedResult('enhanceResume', cacheKey);
    if (cached) return cached;

    const prompt = `
    Act as an expert resume writer. 
    Analyze the following raw resume text and structure it into a professional JSON format.
    
    Target Job Title: ${jobTitle}
    Target Job Description: ${jobDesc}
    
    Raw Resume Text:
    "${resumeText}"
    
    Instructions:
    1. Parse all contact info, experience, education, skills, projects, etc.
    2. ENHANCE the content:
       - Rewrite bullet points to be achievement-oriented (X-Y-Z formula) if possible.
       - Tailor the summary and skills to the Target Job Description and Job Title.
       - Fix grammar and spelling.
       - Ensure the tone is professional and active.
    3. If specific fields are missing in the source text (like dates or locations), make a best guess or leave empty strings, but do not invent experiences.
    4. Generate unique IDs for all list items (experience, education, skills, etc.).
    5. Return ONLY the JSON matching the schema.
    `;

    const resumeSchema = {
        type: Type.OBJECT,
        properties: {
            fullName: { type: Type.STRING },
            title: { type: Type.STRING },
            contactInfo: {
                type: Type.OBJECT,
                properties: {
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    linkedin: { type: Type.STRING },
                    location: { type: Type.STRING },
                    github: { type: Type.STRING },
                    portfolio: { type: Type.STRING },
                },
                required: ['email', 'location'],
            },
            summary: { type: Type.STRING },
            experience: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        role: { type: Type.STRING },
                        company: { type: Type.STRING },
                        location: { type: Type.STRING },
                        dates: { type: Type.STRING },
                        description: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['role', 'company', 'description']
                }
            },
            education: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        degree: { type: Type.STRING },
                        institution: { type: Type.STRING },
                        location: { type: Type.STRING },
                        graduationDate: { type: Type.STRING },
                        relevantCoursework: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['degree', 'institution']
                }
            },
            skills: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    name: { type: Type.STRING },
                                    proficiency: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
                                },
                                required: ['name', 'proficiency']
                            }
                        }
                    },
                    required: ['name', 'skills']
                }
            },
            projects: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        role: { type: Type.STRING },
                        startDate: { type: Type.STRING },
                        endDate: { type: Type.STRING },
                        description: { type: Type.ARRAY, items: { type: Type.STRING } },
                        technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                        link: { type: Type.STRING }
                    },
                    required: ['name']
                }
            },
            certifications: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        issuer: { type: Type.STRING },
                        date: { type: Type.STRING }
                    },
                    required: ['name']
                }
            },
            awards: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        issuer: { type: Type.STRING },
                        date: { type: Type.STRING }
                    },
                    required: ['name']
                }
            }
        },
        required: ['fullName', 'title', 'contactInfo', 'summary', 'experience', 'education', 'skills']
    };

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: resumeSchema,
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
        },
    }));

    const parsed = parseJsonResult(response.text || '');
    if (!parsed) throw new Error("AI did not return a valid resume structure.");

    // Ensure IDs are present and unique
    const addIds = (items: any[]) => items?.map((item: any) => ({
        ...item,
        id: item.id || `id-${Date.now()}-${Math.random().toString(36).substring(7)}`
    })) || [];

    const enhancedData: ResumeData = {
        ...parsed,
        experience: addIds(parsed.experience),
        education: addIds(parsed.education),
        projects: addIds(parsed.projects),
        certifications: addIds(parsed.certifications),
        awards: addIds(parsed.awards),
        skills: parsed.skills?.map((cat: SkillCategory) => ({
            ...cat,
            id: cat.id || `id-cat-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            skills: addIds(cat.skills)
        })) || []
    };

    await setCachedResult('enhanceResume', cacheKey, enhancedData);
    return enhancedData;
};

export const compactResumeContent = async (resumeData: ResumeData): Promise<ResumeData> => {
    const cacheKey = { type: 'compact', resumeData };
    const cached = await getCachedResult('compactResumeContent', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an expert resume editor. Your task is to condense the provided resume content to be as concise as possible while retaining all key information and impact.
    Focus on:
    - Eliminating redundant words and phrases.
    - Shortening sentences without losing meaning.
    - Ensuring bullet points are action-oriented and brief.
    - Keeping the overall message clear and powerful.
    
    Return the FULL, condensed resume data in JSON format, ensuring all original fields are present, but with modified (shorter) string values where appropriate.

    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    `;

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.7,
        },
    }));
    
    const parsed = parseJsonResult(response.text || '');
    if (!parsed) throw new Error("AI did not return a valid compact resume.");

    await setCachedResult('compactResumeContent', cacheKey, parsed);
    return parsed;
};

export const generateAgentSuggestion = async (
    type: 'WRITE_SUMMARY' | 'REWRITE_EXPERIENCE_BULLET_WITH_REASON' | 'COMPACT_EXPERIENCE_BULLET_WITH_REASON' | 'GET_SKILL_SUGGESTIONS',
    context: {
        resume?: ResumeData;
        jobDescription?: string;
        currentSummary?: string;
        bulletPoint?: string;
    }
): Promise<string | { rewritten: string; reason: string } | string[]> => {
    const cacheKey = { type, context };
    const cached = await getCachedResult('generateAgentSuggestion', cacheKey);
    if (cached) return cached;

    let prompt = '';
    let responseSchema: any;
    let model = "gemini-3-pro-preview";

    switch (type) {
        case 'WRITE_SUMMARY':
            prompt = `
            You are an expert resume writer. Write a concise, impactful 3-4 sentence professional summary based on the following resume data.
            Tailor it slightly towards the job description if provided.
            Focus on achievements and key skills, using first-person implied (no "I").
            
            Resume: ${JSON.stringify(context.resume)}
            ${context.jobDescription ? `Job Description: ${context.jobDescription}` : ''}
            `;
            responseSchema = { type: Type.STRING, description: "The rewritten professional summary." };
            break;
        case 'REWRITE_EXPERIENCE_BULLET_WITH_REASON':
            prompt = `
            You are an expert resume writer. Rewrite the following experience bullet point to be more impactful and achievement-oriented (X-Y-Z formula: Accomplished X as measured by Y, by doing Z).
            Provide a brief reason why your suggestion is better. Tailor it towards the job description if provided.
            
            Original Bullet Point: "${context.bulletPoint}"
            ${context.jobDescription ? `Job Description: ${context.jobDescription}` : ''}
            `;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    rewritten: { type: Type.STRING, description: "The rewritten, impactful bullet point." },
                    reason: { type: Type.STRING, description: "A brief explanation of why the rewritten bullet point is better." }
                },
                required: ['rewritten', 'reason']
            };
            break;
        case 'COMPACT_EXPERIENCE_BULLET_WITH_REASON':
            prompt = `
            You are an expert resume writer. Condense the following experience bullet point to be more concise while retaining its core impact.
            Provide a brief reason why your suggestion is better.
            
            Original Bullet Point: "${context.bulletPoint}"
            `;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    rewritten: { type: Type.STRING, description: "The rewritten, more concise bullet point." },
                    reason: { type: Type.STRING, description: "A brief explanation of why the rewritten bullet point is more concise." }
                },
                required: ['rewritten', 'reason']
            };
            break;
        case 'GET_SKILL_SUGGESTIONS':
            if (!context.jobDescription) throw new Error("Job description is required for skill suggestions.");
            prompt = `
            You are an AI career coach. Based on the following job description, suggest 5-10 technical and soft skills that are highly relevant.
            Return only a comma-separated list of skills. Do not add any introductory or concluding remarks.
            
            Job Description: "${context.jobDescription}"
            `;
            responseSchema = { type: Type.STRING, description: "A comma-separated list of suggested skills." };
            model = "gemini-2.5-flash"; // Use a lighter model for simpler tasks
            break;
    }

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            temperature: 0.7,
        },
    }));

    const parsed = parseJsonResult(response.text || '');
    if (!parsed) throw new Error(`AI did not return a valid response for ${type}.`);

    await setCachedResult('generateAgentSuggestion', cacheKey, parsed);
    return parsed;
};

export const runResumeAudit = async (resumeData: ResumeData): Promise<AuditResult> => {
    const cacheKey = { type: 'audit', resumeData };
    const cached = await getCachedResult('runResumeAudit', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an expert ATS (Applicant Tracking System) and HR consultant.
    Perform a comprehensive audit of the following resume data.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}
    
    Provide:
    1. An 'overallScore' out of 100, reflecting general ATS compatibility, impact, and clarity.
    2. A 'feedback' array with specific, actionable suggestions for improvement. Each item should have:
       - 'category': 'Impact', 'Quantification', 'Conciseness', 'Skills', 'Formatting'
       - 'message': A clear, concise message describing the issue and an improvement idea.
       - 'contextPath' (optional): A JSON path (e.g., 'experience[1].description[2]') to the problematic field, if applicable.
       - 'suggestion' (optional): A direct rewrite suggestion for the text at 'contextPath'.
    
    Focus on:
    - Strong action verbs.
    - Quantifiable achievements.
    - Tailoring to a generic professional role (since no specific JD is provided).
    - Clarity and conciseness.
    - Missing common professional sections.
    `;

    const auditSchema = {
        type: Type.OBJECT,
        properties: {
            overallScore: { type: Type.NUMBER, description: "Overall score out of 100 for resume quality." },
            feedback: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING, enum: ['Impact', 'Quantification', 'Conciseness', 'Skills', 'Formatting'] },
                        message: { type: Type.STRING, description: "Actionable feedback message." },
                        contextPath: { type: Type.STRING, description: "JSON path to the relevant field, e.g., 'experience[0].description[1]'." },
                        suggestion: { type: Type.STRING, description: "A concrete suggestion or rewrite for the contextPath." },
                    },
                    required: ['category', 'message']
                }
            }
        },
        required: ['overallScore', 'feedback']
    };

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: auditSchema,
            temperature: 0.7,
        },
    }));

    const parsed = parseJsonResult(response.text || '');
    if (!parsed) throw new Error("AI did not return a valid audit result.");

    await setCachedResult('runResumeAudit', cacheKey, parsed);
    return parsed;
};

export const generateCoverLetter = async (resumeData: ResumeData, jobDescription: string): Promise<string> => {
    if (!jobDescription.trim()) throw new Error("Job description is required to generate a cover letter.");

    const cacheKey = { type: 'coverLetter', resumeData, jobDescription };
    const cached = await getCachedResult('generateCoverLetter', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an expert career coach. Write a compelling cover letter based on the provided resume data and job description.
    
    Instructions:
    - Address it generically (e.g., "Hiring Manager" or "Hiring Team").
    - Tailor the content to highlight relevant skills and experiences from the resume that directly match the job description.
    - Use a professional, enthusiastic, and concise tone.
    - Keep it to 3-4 paragraphs.
    - Do not invent information not present in the resume.
    - Ensure it is ready to be sent.

    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Job Description:
    ${jobDescription}
    `;

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            temperature: 0.8,
            maxOutputTokens: 1000,
            thinkingConfig: { thinkingBudget: 100 },
        },
    }));

    const text = response.text || '';
    if (!text) throw new Error("AI did not generate a cover letter.");

    await setCachedResult('generateCoverLetter', cacheKey, text);
    return text;
};

// New: Generate Job Search Listings based on query
export const findMatchingJobs = async (
    resumeData: ResumeData,
    location: string,
    query: string,
    filters: { remote: boolean; salary: string; experience: string },
    page: number = 1
): Promise<{ marketSummary: string; jobs: JobListing[] }> => {
    const cacheKey = { type: 'jobSearch', resumeData, location, query, filters, page };
    const cached = await getCachedResult('findMatchingJobs', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an expert career consultant. Based on the user's resume and job search criteria, generate a list of relevant job postings and a brief market summary.
    
    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Search Criteria:
    Role/Keywords: ${query}
    Location: ${location}
    Remote: ${filters.remote ? 'Yes' : 'No'}
    Salary Preference: ${filters.salary || 'Any'}
    Experience Level: ${filters.experience || 'Any'}
    Page: ${page}

    Instructions:
    1. Provide a 'marketSummary' (2-3 sentences) about the current job market for the specified role and location.
    2. Generate 3-5 'jobs' listings relevant to the criteria. For each job:
        - Include realistic company names, roles, locations, links (placeholder if not real), and a 2-3 sentence summary.
        - Invent a 'postedAt' date (e.g., "2 days ago").
        - Generate a realistic 'matchScore' (0-100) based on how well the resume matches the job summary.
        - Identify 2-3 'missingSkills' from the resume based on the job summary.
        - Include 'jobType', 'benefits', 'qualifications', 'responsibilities', 'experienceLevel', 'industry', 'hiringManagerTraits', 'cultureNotes', and 'commonInterviewQuestions' if plausible.
        - Assign a unique, short 'id' (e.g., "job_123").
    3. Ensure all generated data is plausible and professional.
    4. Return ONLY the JSON structure matching the schema.
    `;

    const jobListingSchema = {
        type: Type.OBJECT,
        properties: {
            marketSummary: { type: Type.STRING, description: "A brief summary of the job market for the search criteria." },
            jobs: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        company: { type: Type.STRING },
                        role: { type: Type.STRING },
                        location: { type: Type.STRING },
                        salary: { type: Type.STRING },
                        link: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        matchScore: { type: Type.NUMBER, description: "A score out of 100 indicating how well the resume matches this job." },
                        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                        postedAt: { type: Type.STRING },
                        companyUrl: { type: Type.STRING },
                        jobType: { type: Type.STRING },
                        benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                        qualifications: { type: Type.ARRAY, items: { type: Type.STRING } },
                        responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                        experienceLevel: { type: Type.STRING },
                        industry: { type: Type.STRING },
                        hiringManagerTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cultureNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        commonInterviewQuestions: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ['id', 'company', 'role', 'location', 'link', 'summary', 'matchScore', 'missingSkills']
                }
            }
        },
        required: ['marketSummary', 'jobs']
    };

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: jobListingSchema,
            temperature: 0.9,
            maxOutputTokens: 1500,
            thinkingConfig: { thinkingBudget: 200 }
        },
    }));

    const parsed = parseJsonResult(response.text || '');
    if (!parsed || !Array.isArray(parsed.jobs)) {
        console.error("AI did not return a valid job listing structure. Raw response:", response.text);
        throw new Error("AI did not return a valid job listing structure. Please try again or refine your query.");
    }

    const resultsWithIds = parsed.jobs.map((job: JobListing) => ({
        ...job,
        id: job.id || `job_${cyrb53(JSON.stringify(job)).toString()}` // Ensure ID if missing
    }));

    const finalResult = { ...parsed, jobs: resultsWithIds };
    await setCachedResult('findMatchingJobs', cacheKey, finalResult);
    return finalResult;
};

// --- New functions required for JobMatchAnalyzer and AiAgent ---

export interface TailoredContent {
    tailoredSummary: string;
    suggestedSkills: string[];
}

// Mock implementation for analyzeKeywords
export const analyzeKeywords = async (resumeData: ResumeData, jobDescription: string): Promise<KeywordAnalysis> => {
    console.log("[GeminiService] Mock analyzeKeywords called");
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    return {
        presentKeywords: ['Apex', 'Lightning Web Components', 'Sales Cloud', 'Deployment Tools'],
        missingKeywords: ['Agile Leadership', 'Stakeholder Management', 'Cloud Security'],
    };
};

// Mock implementation for tailorResumeToJob
export const tailorResumeToJob = async (resumeData: ResumeData, jobDescription: string): Promise<TailoredContent> => {
    console.log("[GeminiService] Mock tailorResumeToJob called");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
    return {
        tailoredSummary: `Highly skilled Salesforce Developer with 6 years of experience, specializing in Apex, Lightning Web Components, and Sales Cloud to drive business efficiency. Proven ability to optimize CRM functionalities, integrate complex systems, and lead development teams, consistently delivering high-impact solutions.`,
        suggestedSkills: ['Agile Methodologies', 'Scrum', 'Data Migration', 'API Integration', 'CI/CD'],
    };
};

// Mock implementation for askCoachWithGoogleSearch
export const askCoachWithGoogleSearch = async (userQuery: string): Promise<{ text: string; sources?: { uri: string; title: string }[] }> => {
    console.log("[GeminiService] Mock askCoachWithGoogleSearch called with:", userQuery);
    await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay

    // Simple keyword-based mock responses
    if (userQuery.toLowerCase().includes('salary')) {
        return {
            text: "According to recent market data, a Senior Salesforce Developer in San Francisco typically earns between $150,000 and $220,000 annually, depending on experience and company size. Salaries for roles with leadership responsibilities can be higher.",
            sources: [{ uri: "https://www.salary.com/salesforce-dev", title: "Salary.com: Salesforce Developer" }]
        };
    } else if (userQuery.toLowerCase().includes('interview')) {
        return {
            text: "Common interview questions for Salesforce Developers include 'Describe a complex Apex trigger you've built and the challenges you faced,' 'How do you ensure code quality in Salesforce development?', and 'Explain your experience with Lightning Web Components.'",
            sources: [{ uri: "https://www.indeed.com/interview-questions", title: "Indeed: Salesforce Interview Qs" }]
        };
    } else if (userQuery.toLowerCase().includes('company culture')) {
        return {
            text: "Tech Solutions Inc. is known for its collaborative culture and strong emphasis on innovation. They frequently organize hackathons and offer professional development opportunities to their employees. Employee reviews often highlight a fast-paced but supportive environment.",
            sources: [{ uri: "https://www.glassdoor.com/tech-solutions", title: "Glassdoor: Tech Solutions Inc." }]
        };
    }
    return {
        text: "I'm sorry, I don't have enough information to answer that question from my current knowledge base or tools. Please try asking about resume content, common job search topics, or general career advice."
    };
};

// New: Generate Audio Brief for a job
export const generateAudioBrief = async (context: string): Promise<string> => {
    const cacheKey = { type: 'audioBrief', context };
    const cached = await getCachedResult('generateAudioBrief', cacheKey);
    if (cached) return cached;

    const prompt = `
    Generate a concise, engaging audio brief (like a podcast segment) summarizing the key aspects of the following job context.
    Focus on:
    - The role's main responsibilities.
    - Required skills and qualifications.
    - Potential challenges or opportunities.
    - How the user's resume (if provided) aligns or needs improvement.
    The output should be directly speakable text, no markdown or extra formatting. Keep it under 200 words.
    
    Context:
    ${context}
    `;

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts", // Text-to-speech model
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO], // Request audio output
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
            },
        },
    }));

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) throw new Error("AI did not generate audio data.");

    await setCachedResult('generateAudioBrief', cacheKey, audioData);
    return audioData;
};

// New: Chat interaction for Job Notebook
export const askNotebook = async (fullContext: string, userQuestion: string): Promise<string> => {
    const cacheKey = { type: 'askNotebook', fullContext, userQuestion };
    const cached = await getCachedResult('askNotebook', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an AI assistant designed to help a user understand a job based on provided context.
    The context includes a Job Description, Company Info, and the User's Resume.
    Answer the user's question concisely and accurately using ONLY the provided context.
    If you cannot find the answer in the context, state that you do not have enough information.
    Do not invent facts.

    --- CONTEXT ---
    ${fullContext}
    --- END CONTEXT ---

    User's Question: "${userQuestion}"
    `;

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            temperature: 0.6,
            maxOutputTokens: 500,
            thinkingConfig: { thinkingBudget: 100 },
        },
    }));

    const text = response.text || '';
    if (!text) throw new Error("AI did not provide an answer.");

    await setCachedResult('askNotebook', cacheKey, text);
    return text;
};

// New: Generate Interview Questions
export const generateInterviewQuestions = async (resumeData: ResumeData, jobDescription: string): Promise<InterviewQuestion[]> => {
    if (!jobDescription.trim()) throw new Error("Job description is required to generate interview questions.");

    const cacheKey = { type: 'interviewQuestions', resumeData, jobDescription };
    const cached = await getCachedResult('generateInterviewQuestions', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an expert interviewer. Generate a list of 5-7 common interview questions tailored to the provided job description and the candidate's resume.
    For each question, provide:
    - 'type': 'Behavioral', 'Technical', 'General', or 'Situational'.
    - 'question': The question itself.
    - 'tip': A brief, actionable tip on how to answer effectively, considering the candidate's resume and the job requirements.

    Resume Data:
    ${JSON.stringify(resumeData, null, 2)}

    Job Description:
    ${jobDescription}

    Return ONLY the JSON structure matching the schema.
    `;

    const interviewQuestionsSchema = {
        type: Type.OBJECT,
        properties: {
            questions: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        type: { type: Type.STRING, enum: ['Behavioral', 'Technical', 'General', 'Situational'] },
                        question: { type: Type.STRING },
                        tip: { type: Type.STRING },
                    },
                    required: ['type', 'question', 'tip']
                }
            }
        },
        required: ['questions']
    };

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewQuestionsSchema,
            temperature: 0.8,
            maxOutputTokens: 1200,
            thinkingConfig: { thinkingBudget: 150 }
        },
    }));

    const parsed = parseJsonResult(response.text || '');
    if (!parsed || !Array.isArray(parsed.questions)) {
        throw new Error("AI did not return valid interview questions.");
    }

    const questionsWithIds = parsed.questions.map((q: InterviewQuestion) => ({
        ...q,
        id: q.id || `iq_${cyrb53(JSON.stringify(q)).toString()}`
    }));

    await setCachedResult('generateInterviewQuestions', cacheKey, questionsWithIds);
    return questionsWithIds;
};

// New: Evaluate Interview Answer
export const evaluateInterviewAnswer = async (question: string, userAnswer: string, role: string): Promise<InterviewFeedback> => {
    const cacheKey = { type: 'evaluateAnswer', question, userAnswer, role };
    const cached = await getCachedResult('evaluateInterviewAnswer', cacheKey);
    if (cached) return cached;

    const prompt = `
    You are an experienced interviewer. Evaluate the following candidate's answer to an interview question for a ${role} role.
    
    Question: "${question}"
    Candidate's Answer: "${userAnswer}"

    Provide:
    1. 'score': A score out of 10 for the answer's effectiveness, relevance, and structure.
    2. 'feedback': A brief summary of overall feedback.
    3. 'strengths': A list of 2-3 specific strengths of the answer.
    4. 'improvements': A list of 2-3 specific areas for improvement.
    5. 'refinedAnswer': A concise example of a refined answer for the given question and context.

    Focus on common interview best practices (e.g., STAR method for behavioral, clarity for technical).
    Return ONLY the JSON structure matching the schema.
    `;

    const feedbackSchema = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER, description: "Score out of 10 for the answer." },
            feedback: { type: Type.STRING, description: "Overall brief feedback." },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            refinedAnswer: { type: Type.STRING, description: "An example of a refined, better answer." },
        },
        required: ['score', 'feedback', 'strengths', 'improvements', 'refinedAnswer']
    };

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: feedbackSchema,
            temperature: 0.7,
            maxOutputTokens: 800,
            thinkingConfig: { thinkingBudget: 100 }
        },
    }));

    const parsed = parseJsonResult(response.text || '');
    if (!parsed) {
        throw new Error("AI did not return valid interview feedback.");
    }

    await setCachedResult('evaluateInterviewAnswer', cacheKey, parsed);
    return parsed;
};

export const generateProjectImage = async (project: Project): Promise<string> => {
    const cacheKey = { type: 'projectImage', project };
    const cached = await getCachedResult('generateProjectImage', cacheKey);
    if (cached) return cached;

    const prompt = `
    Generate a simple, abstract, and aesthetically pleasing placeholder image that represents the following project.
    Focus on conveying the general theme or technology without specific details. For example, if it's a "mobile app for fitness", think abstract shapes, clean lines, and relevant colors, not a screenshot.
    
    Project Name: "${project.name}"
    Project Description: "${project.description.join(' ')}"
    ${project.technologies && project.technologies.length > 0 ? `Technologies: ${project.technologies.join(', ')}` : ''}
    
    Output a professional, high-quality, abstract image.
    `;

    const response = await scheduler.add<GenerateContentResponse>(() => ai.models.generateContent({
        model: 'gemini-3-pro-image-preview', // High-quality image model
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            imageConfig: {
                aspectRatio: "16:9",
                imageSize: "1K"
            },
        },
    }));

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData && p.inlineData.mimeType.startsWith('image/'));
    if (!imagePart || !imagePart.inlineData) {
        throw new Error("AI did not return an image for the project.");
    }

    const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    await setCachedResult('generateProjectImage', cacheKey, imageUrl);
    return imageUrl;
};
