'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Bell, Users, Briefcase, GraduationCap, FileText, Target, Menu } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { useSearch, type SearchResult } from '@/lib/search-context';
import { useSidebar } from '@/lib/sidebar-context';

interface TopBarProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

const typeIcons: Record<SearchResult['type'], React.ReactNode> = {
    client: <Users className="w-3.5 h-3.5 text-emerald-400" />,
    project: <Briefcase className="w-3.5 h-3.5 text-emerald-400" />,
    workshop: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />,
    document: <FileText className="w-3.5 h-3.5 text-emerald-400" />,
    usecase: <Target className="w-3.5 h-3.5 text-emerald-400" />,
};

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
    const { toast } = useToast();
    const { setMobileOpen } = useSidebar();
    const { query, setQuery, results, isOpen, setIsOpen } = useSearch();
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setIsOpen]);

    // Cmd+K / Ctrl+K shortcut to focus search
    useEffect(() => {
        function handleGlobalKey(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 50);
            }
        }
        document.addEventListener('keydown', handleGlobalKey);
        return () => document.removeEventListener('keydown', handleGlobalKey);
    }, [setIsOpen]);

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        router.push(result.href);
    };

    return (
        <header className="h-16 md:h-20 border-b border-[#1c1c1c] px-4 md:px-8 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-40">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation"
                    className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-all md:hidden"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-lg md:text-xl font-bold text-white tracking-tight">{title}</h1>
                    {subtitle && <p className="text-xs text-neutral-500 font-medium hidden sm:block">{subtitle}</p>}
                </div>
            </div>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div ref={searchRef} role="search" aria-label="Global search" className={`relative flex items-center transition-all duration-300 ${isOpen ? 'w-80' : 'w-10'}`}>
                    <Search
                        className="w-5 h-5 text-neutral-500 absolute left-2.5 z-10 cursor-pointer hover:text-white transition-colors"
                        onClick={() => { setIsOpen(!isOpen); setTimeout(() => inputRef.current?.focus(), 50); }}
                        aria-hidden="true"
                    />
                    {!isOpen && (
                        <kbd className="hidden md:inline-flex absolute left-10 items-center px-1.5 py-0.5 rounded text-[9px] font-mono text-neutral-600 bg-neutral-800 border border-neutral-700">
                            ⌘K
                        </kbd>
                    )}
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search projects, clients, docs..."
                        aria-label="Search projects, clients, and documents"
                        aria-expanded={isOpen && !!query.trim()}
                        role="combobox"
                        aria-autocomplete="list"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') { setIsOpen(false); (e.target as HTMLInputElement).blur(); }
                        }}
                        className={`w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    />

                    {/* Results dropdown */}
                    {isOpen && query.trim() && (
                        <div role="listbox" aria-label="Search results" className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden z-50">
                            {results.length > 0 ? (
                                <div className="max-h-[320px] overflow-y-auto">
                                    {results.map((result) => (
                                        <button
                                            key={`${result.type}-${result.id}`}
                                            onClick={() => handleSelect(result)}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-800 transition-colors text-left"
                                        >
                                            {typeIcons[result.type]}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs font-semibold text-white truncate">{result.title}</p>
                                                <p className="text-[10px] text-neutral-500">{result.subtitle}</p>
                                            </div>
                                            <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{result.type}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-4 py-6 text-center">
                                    <p className="text-xs text-neutral-500">No results found for &ldquo;{query}&rdquo;</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Notifications */}
                <button onClick={() => toast('No new notifications', 'info')} aria-label="Notifications" className="relative p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" aria-hidden="true" />
                </button>

                {/* Custom Actions */}
                {actions && (
                    <div className="hidden sm:flex items-center gap-3 border-l border-neutral-800 pl-6 h-8">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
}
