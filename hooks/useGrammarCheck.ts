
import { useState, useEffect, useCallback, useRef } from 'react';
import { validateGrammar } from '../services/geminiService';

export const useGrammarCheck = (text: string, enabled: boolean = false) => {
    const [isChecking, setIsChecking] = useState(false);
    const [result, setResult] = useState<{ corrected: string; issues: any[] } | null>(null);
    const [lastCheckedText, setLastCheckedText] = useState('');
    
    // Use a ref to track if the component is mounted
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        // Don't check empty, short, or already checked text
        if (!enabled || !text || text.trim().length < 10 || text === lastCheckedText) return;

        // Clear previous results if text changed significantly
        if (result && text !== result.corrected) {
             setResult(null);
        }

        const timeoutId = setTimeout(async () => {
            if (!isMounted.current) return;
            
            setIsChecking(true);
            try {
                const data = await validateGrammar(text);
                if (isMounted.current) {
                    setLastCheckedText(text);
                    // Only set result if correction is different from original
                    if (data && data.corrected !== text) {
                        setResult(data);
                    } else {
                        setResult(null);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                 if (isMounted.current) setIsChecking(false);
            }
        }, 2000); // Increased debounce to avoid 429

        return () => clearTimeout(timeoutId);
    }, [text, lastCheckedText, enabled]);

    const clearParams = useCallback(() => {
        setResult(null);
        setLastCheckedText(text); // Assume current state is accepted as "checked"
    }, [text]);

    return { isChecking, result, clearParams };
};
