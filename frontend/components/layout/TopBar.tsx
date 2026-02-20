'use client';

import { useState } from 'react';
import { Search, Bell } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface TopBarProps {
    title: string;
    subtitle?: string;
    actions?: React.ReactNode;
}

export default function TopBar({ title, subtitle, actions }: TopBarProps) {
    const [searchOpen, setSearchOpen] = useState(false);
    const { toast } = useToast();

    return (
        <header className="h-20 border-b border-[#1c1c1c] px-8 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-40">
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
                {subtitle && <p className="text-xs text-neutral-500 font-medium">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className={`relative flex items-center transition-all duration-300 ${searchOpen ? 'w-64' : 'w-10'}`}>
                    <Search
                        className="w-5 h-5 text-neutral-500 absolute left-2.5 z-10 cursor-pointer hover:text-white transition-colors"
                        onClick={() => setSearchOpen(!searchOpen)}
                    />
                    <input
                        type="text"
                        placeholder="Search projects, clients, docs..."
                        className={`w-full bg-neutral-900 border border-neutral-700 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all ${searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    />
                </div>

                {/* Notifications */}
                <button onClick={() => toast('No new notifications')} className="relative p-2 rounded-xl bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border-2 border-black" />
                </button>

                {/* Custom Actions */}
                {actions && (
                    <div className="flex items-center gap-3 border-l border-neutral-800 pl-6 h-8">
                        {actions}
                    </div>
                )}
            </div>
        </header>
    );
}