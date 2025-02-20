    export function parseJson(input) {
        // If input is already an object or array, return it
        if (typeof input === 'object' && input !== null) return input;
        
        // If input is a string, try to parse it
        if (typeof input === 'string' && input.trim()) {
        try {
            // First, try to parse as JSON
            return JSON.parse(input);
        } catch {
            try {
            // If first parse fails, try parsing escaped JSON
            return JSON.parse(input.replace(/\\"/g, '"'));
            } catch {
            // If parsing fails, return the original input
            return input;
            }
        }
        }
        
        // If input is undefined or null, return an empty array
        return [];
    }