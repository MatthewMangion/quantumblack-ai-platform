'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/lib/sidebar-context';
import { useToast } from '@/lib/toast-context';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    FileText,
    GraduationCap,
    Settings,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    LogOut
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'People Discovery', href: '/people-discovery', icon: ClipboardList },
    { name: 'Strategy', href: '/strategy', icon: FileText },
    { name: 'Workshops', href: '/workshops', icon: GraduationCap },
];

export default function Sidebar() {
    const { collapsed, toggleCollapsed } = useSidebar();
    const { toast } = useToast();
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                'fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out',
                'bg-black border-r border-[#1c1c1c]',
                collapsed ? 'w-[72px]' : 'w-[260px]'
            )}
        >
            {/* Header / Logo */}
            <div className="h-20 flex items-center px-6 relative">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 min-w-[36px] bg-emerald-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className={cn(
                        'flex flex-col transition-opacity duration-300',
                        collapsed ? 'opacity-0' : 'opacity-100'
                    )}>
                        <span className="text-sm font-bold tracking-tight text-white leading-tight">QuantumBlack AI</span>
                        <span className="text-[10px] text-neutral-600 font-medium tracking-wider uppercase">Advisory Platform</span>
                    </div>
                </div>

                <button
                    onClick={toggleCollapsed}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-emerald-500 transition-colors z-10"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group overflow-hidden relative',
                                isActive
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50'
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500 rounded-r-full" />
                            )}
                            <item.icon className={cn(
                                'w-5 h-5 min-w-[20px] transition-colors',
                                isActive ? 'text-emerald-400' : 'group-hover:text-neutral-200'
                            )} />
                            <span className={cn(
                                'text-sm font-medium transition-opacity duration-300 whitespace-nowrap',
                                collapsed ? 'opacity-0' : 'opacity-100'
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / User */}
            <div className="p-3 border-t border-neutral-800 space-y-1">
                <Link
                    href="/settings"
                    className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/50 transition-all group overflow-hidden',
                        pathname === '/settings' && 'bg-neutral-800 text-white'
                    )}
                >
                    <Settings className="w-5 h-5 min-w-[20px]" />
                    <span className={cn(
                        'text-sm font-medium transition-opacity duration-300',
                        collapsed ? 'opacity-0' : 'opacity-100'
                    )}>
                        Settings
                    </span>
                </Link>
                <button
                    onClick={() => toast('Logged out successfully')}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all group overflow-hidden"
                >
                    <LogOut className="w-5 h-5 min-w-[20px]" />
                    <span className={cn(
                        'text-sm font-medium transition-opacity duration-300',
                        collapsed ? 'opacity-0' : 'opacity-100'
                    )}>
                        Logout
                    </span>
                </button>

                {/* User Card */}
                <div className={cn(
                    'mt-4 p-3 rounded-2xl bg-neutral-800/50 border border-neutral-800 transition-all overflow-hidden',
                    collapsed ? 'p-1 bg-transparent border-transparent' : 'p-3'
                )}>
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 min-w-[36px] rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center font-bold text-emerald-400 text-sm">
                            AM
                        </div>
                        {!collapsed && (
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold text-white truncate">Alex Morgan</span>
                                <span className="text-[10px] text-neutral-600 font-medium">Consultant</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}