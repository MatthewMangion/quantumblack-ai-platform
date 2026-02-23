import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of the provided value.
 * Updates only after the specified delay in milliseconds.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
