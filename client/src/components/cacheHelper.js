export const getCachedOrFallback = (key, fallback) => {
    try {
        const cached = localStorage.getItem(key);
        if (cached) {
            return JSON.parse(cached);
        }
    } catch (e) {
        console.error("Cache read error for key " + key, e);
    }
    return fallback;
};

export const setCache = (key, data) => {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error("Cache write error for key " + key, e);
    }
};
