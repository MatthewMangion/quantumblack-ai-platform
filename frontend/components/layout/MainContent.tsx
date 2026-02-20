'use client';

import { useSidebar } from '@/lib/sidebar-context';

export default function MainContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useSidebar();

    return (
        <main
            className="min-h-screen transition-all duration-300 ease-in-out"
            style={{ marginLeft: collapsed ? 72 : 260 }}
        >
            {children}
        </main>
    );
}
