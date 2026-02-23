'use client';

import { useSidebar } from '@/lib/sidebar-context';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();

    return (
        <main
            className="min-h-screen transition-all duration-300 ease-in-out md:ml-[var(--sidebar-width)]"
            style={{ '--sidebar-width': collapsed ? '72px' : '260px' } as React.CSSProperties}
        >
            {children}
        </main>
    );
}
