'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { clients as initialClients, engagementPhases as initialPhases } from '@/lib/mock-data';
import { getAllDocuments, putDocument, deleteDocument as deleteDocFromDB } from '@/lib/indexed-db';
import { useToast } from '@/lib/toast-context';
import type { ClientProfile, EngagementPhaseData, ClientDocument } from '@/lib/types';

interface ClientContextValue {
    allClients: ClientProfile[];
    allPhases: EngagementPhaseData[];
    addClient: (client: ClientProfile, phases: EngagementPhaseData[]) => void;
    setAllPhases: React.Dispatch<React.SetStateAction<EngagementPhaseData[]>>;
    clientDocuments: ClientDocument[];
    addDocument: (doc: ClientDocument) => void;
    removeDocument: (id: string) => void;
    getClientDocuments: (clientId: string) => ClientDocument[];
    selectedClientId: string | null;
    setSelectedClientId: React.Dispatch<React.SetStateAction<string | null>>;
}

const ClientContext = createContext<ClientContextValue | null>(null);

export function ClientProvider({ children }: { children: ReactNode }) {
    const { toast } = useToast();
    const [allClients, setAllClients] = useState<ClientProfile[]>(initialClients);
    const [allPhases, setAllPhases] = useState<EngagementPhaseData[]>(initialPhases);
    const [clientDocuments, setClientDocuments] = useState<ClientDocument[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClients[0]?.id ?? null);

    // Load documents from IndexedDB on mount
    useEffect(() => {
        getAllDocuments()
            .then(setClientDocuments)
            .catch(() => {
                toast('Could not load documents — storage unavailable', 'error');
            });
    }, []);

    const addClient = useCallback((client: ClientProfile, phases: EngagementPhaseData[]) => {
        const duplicate = allClients.some(c => c.name.toLowerCase() === client.name.toLowerCase());
        if (duplicate) return;
        setAllClients(prev => [...prev, client]);
        setAllPhases(prev => [...prev, ...phases]);
    }, [allClients]);

    const addDocument = useCallback((doc: ClientDocument) => {
        setClientDocuments(prev => [doc, ...prev]);
        putDocument(doc).catch(() => {
            toast('Document saved locally but not persisted', 'warning');
        });
    }, [toast]);

    const removeDocument = useCallback((id: string) => {
        setClientDocuments(prev => prev.filter(d => d.id !== id));
        deleteDocFromDB(id).catch(() => {
            toast('Document removed locally but delete may not persist', 'warning');
        });
    }, [toast]);

    const getClientDocuments = useCallback((clientId: string) => {
        return clientDocuments.filter(d => d.clientId === clientId);
    }, [clientDocuments]);

    return (
        <ClientContext.Provider value={{
            allClients, allPhases, addClient, setAllPhases,
            clientDocuments, addDocument, removeDocument, getClientDocuments,
            selectedClientId, setSelectedClientId
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
