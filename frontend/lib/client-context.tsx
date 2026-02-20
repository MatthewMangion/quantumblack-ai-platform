'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { clients as initialClients, engagementPhases as initialPhases } from '@/lib/mock-data';
import type { ClientProfile, EngagementPhaseData, ClientDocument } from '@/lib/types';

const DOCS_STORAGE_KEY = 'qb-client-documents';

function loadDocuments(): ClientDocument[] {
    if (typeof window === 'undefined') return [];
    try {
        const raw = localStorage.getItem(DOCS_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

interface ClientContextValue {
    allClients: ClientProfile[];
    allPhases: EngagementPhaseData[];
    addClient: (client: ClientProfile, phases: EngagementPhaseData[]) => void;
    setAllPhases: React.Dispatch<React.SetStateAction<EngagementPhaseData[]>>;
    clientDocuments: ClientDocument[];
    addDocument: (doc: ClientDocument) => void;
    removeDocument: (id: string) => void;
    getClientDocuments: (clientId: string) => ClientDocument[];
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [allClients, setAllClients] = useState<ClientProfile[]>(initialClients);
    const [allPhases, setAllPhases] = useState<EngagementPhaseData[]>(initialPhases);
    const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>(() => loadDocuments());

    useEffect(() => {
        localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(clientDocuments));
    }, [clientDocuments]);

    const addClient = (client: ClientProfile, phases: EngagementPhaseData[]) => {
        setAllClients(prev => [...prev, client]);
        setAllPhases(prev => [...prev, ...phases]);
    };

    const addDocument = useCallback((doc: ClientDocument) => {
        setClientDocuments(prev => [doc, ...prev]);
    }, []);

    const removeDocument = useCallback((id: string) => {
        setClientDocuments(prev => prev.filter(d => d.id !== id));
    }, []);

    const getClientDocuments = useCallback((clientId: string) => {
        return clientDocuments.filter(d => d.clientId === clientId);
    }, [clientDocuments]);

    return (
        <ClientContext.Provider value={{
            allClients, allPhases, addClient, setAllPhases,
            clientDocuments, addDocument, removeDocument, getClientDocuments
        }}>
            {children}
        </ClientContext.Provider>
    );
}

export function useClients() {
    const ctx = useContext(ClientContext);
    if (!ctx) throw new Error('useClients must be used within a ClientProvider');
    return ctx;
}
