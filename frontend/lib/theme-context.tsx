'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ResolvedTheme = 'dark' | 'light';

interface ThemeContextValue {
    theme: Theme;
    resolvedTheme: ResolvedTheme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: 'dark',
    resolvedTheme: 'dark',
    setTheme: () => {},
});

function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'dark';
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function resolveTheme(theme: Theme): ResolvedTheme {
    return theme === 'system' ? getSystemTheme() : theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('dark');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

    // Load saved theme on mount
    useEffect(() => {
        const saved = localStorage.getItem('qb-theme') as Theme | null;
        const initial = saved || 'dark';
        setThemeState(initial);
        setResolvedTheme(resolveTheme(initial));
    }, []);

    // Listen for system theme changes when using 'system'
    useEffect(() => {
        if (theme !== 'system') return;
        const mq = window.matchMedia('(prefers-color-scheme: light)');
        const handler = () => setResolvedTheme(getSystemTheme());
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, [theme]);

    // Apply theme class to <html>
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove('theme-dark', 'theme-light');
        root.classList.add(`theme-${resolvedTheme}`);
    }, [resolvedTheme]);

    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
        setResolvedTheme(resolveTheme(newTheme));
        localStorage.setItem('qb-theme', newTheme);
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
