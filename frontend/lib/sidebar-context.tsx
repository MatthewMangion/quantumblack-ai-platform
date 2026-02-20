'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarContextValue {
    collapsed: boolean;
    toggleCollapsed: () => void;
}

const SidebarContext = createContext<SidebarContextValue>({
    collapsed: false,
    toggleCollapsed: () => {},
});

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <SidebarContext.Provider value={{ collapsed, toggleCollapsed: () => setCollapsed(p => !p) }}>
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);
