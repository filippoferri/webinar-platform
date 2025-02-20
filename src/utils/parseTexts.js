        export function parseTexts(texts) {
    // If texts is already an array, return it
    if (Array.isArray(texts)) return texts;
    
    // If texts is a non-empty string, try to parse it
    if (typeof texts === 'string' && texts.trim()) {
        try {
        const parsed = JSON.parse(texts);
        return Array.isArray(parsed) ? parsed : [];
        } catch {
        // If JSON parsing fails, return the original string as a single-item array
        return [texts];
        }
    }
    
    // If texts is undefined, null, or an empty string, return an empty array
    return [];
    }