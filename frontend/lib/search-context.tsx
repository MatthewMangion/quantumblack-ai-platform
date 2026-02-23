'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { clients, projects, workshops, strategyDocuments, useCases } from '@/lib/mock-data';
import { useDebounce } from '@/lib/use-debounce';

export interface SearchResult {
    type: 'client' | 'project' | 'workshop' | 'document' | 'usecase';
    id: string;
    title: string;
    subtitle: string;
    href: string;
}

interface SearchContextValue {
    query: string;
    setQuery: (q: string) => void;
    results: SearchResult[];
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const debouncedQuery = useDebounce(query, 150);

    const results = useMemo<SearchResult[]>(() => {
        const q = debouncedQuery.toLowerCase().trim();
        if (!q) return [];

        const matches: SearchResult[] = [];

        clients.forEach(c => {
            if (c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q)) {
                matches.push({ type: 'client', id: c.id, title: c.name, subtitle: c.industry, href: '/clients' });
            }
        });

        projects.forEach(p => {
            if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
                matches.push({ type: 'project', id: p.id, title: p.name, subtitle: `${p.phase} phase`, href: '/clients' });
            }
        });

        workshops.forEach(w => {
            if (w.title.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)) {
                matches.push({ type: 'workshop', id: w.id, title: w.title, subtitle: w.category, href: '/workshops' });
            }
        });

        strategyDocuments.forEach(d => {
            if (d.title.toLowerCase().includes(q)) {
                matches.push({ type: 'document', id: d.id, title: d.title, subtitle: d.type.replace(/_/g, ' '), href: '/strategy' });
            }
        });

        useCases.forEach(uc => {
            if (uc.title.toLowerCase().includes(q) || uc.description.toLowerCase().includes(q)) {
                matches.push({ type: 'usecase', id: uc.id, title: uc.title, subtitle: uc.department, href: '/strategy' });
            }
        });

        return matches.slice(0, 8);
    }, [debouncedQuery]);

    return (
        <SearchContext.Provider value={{ query, setQuery, results, isOpen, setIsOpen }}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const ctx = useContext(SearchContext);
    if (!ctx) throw new Error('useSearch must be used within a SearchProvider');
    return ctx;
}
