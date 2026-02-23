'use client';

import { useMemo } from 'react';

import dynamic from 'next/dynamic';
import TopBar from '@/components/layout/TopBar';
import { useClients } from '@/lib/client-context';
import { useToast } from '@/lib/toast-context';
import type { ClientProfile, EngagementPhaseData, ClientDocument } from '@/lib/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Fallback = () => <div className="p-8 animate-pulse bg-neutral-900 rounded-xl h-64 border border-neutral-800" />;

const AddClientModal = dynamic(() => import('@/components/AddClientModal'), { ssr: false });
const DocumentUploadModal = dynamic(() => import('@/components/DocumentUploadModal'), { ssr: false });
const ClientListView = dynamic(() => import('@/components/clients/ClientListView'), { ssr: false, loading: Fallback });
const ClientDetailView = dynamic(() => import('@/components/clients/ClientDetailView'), { ssr: false, loading: Fallback });

export default function ClientsPage() {
    const { allClients, addClient, getClientDocuments, addDocument, removeDocument, selectedClientId, setSelectedClientId } = useClients();
    const { toast } = useToast();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);

    const activeClient = useMemo(() =>
        allClients.find(c => c.id === selectedClientId),
        [allClients, selectedClientId]);

    const clientDocs = useMemo(() =>
        selectedClientId ? getClientDocuments(selectedClientId) : [],
        [getClientDocuments, selectedClientId]);

    const handleAddClient = (data: { client: ClientProfile; phases: EngagementPhaseData[] }) => {
        addClient(data.client, data.phases);
    };

    const handleUploadDocument = (doc: ClientDocument) => {
        addDocument(doc);
        toast('Document uploaded successfully');
    };

    const handleDeleteDocument = (id: string) => {
        removeDocument(id);
        toast('Document deleted', 'warning');
    };

    const downloadDocument = (doc: ClientDocument) => {
        const link = document.createElement('a');
        link.href = doc.data;
        link.download = doc.name;
        link.click();
    };

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title={selectedClientId ? `Workspace: ${activeClient?.name}` : "Client Workspaces"}
                subtitle={selectedClientId ? "Manage client engagements and deliverables" : "Overview of all active client partnerships"}
                actions={
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4" />
                        New Client
                    </button>
                }
            />

            <main className="flex-1 p-8">
                {allClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center bg-neutral-900 border border-neutral-800 rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                            <Plus className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">No Clients Found</h2>
                        <p className="text-neutral-400 mt-2 mb-6 max-w-sm">Create your first client repository to organize documents, manage strategies, and track deliverables.</p>
                        <button className="btn-primary px-6" onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4" />
                            New Client
                        </button>
                    </div>
                ) : !selectedClientId ? (
                    <ClientListView
                        clients={allClients}
                        onSelectClient={setSelectedClientId}
                    />
                ) : activeClient ? (
                    <ClientDetailView
                        client={activeClient}
                        documents={clientDocs}
                        onBack={() => setSelectedClientId(null)}
                        onUpload={() => setShowUploadModal(true)}
                        onDownload={downloadDocument}
                        onDelete={handleDeleteDocument}
                    />
                ) : null}
            </main>

            <AddClientModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddClient}
            />

            {selectedClientId && (
                <DocumentUploadModal
                    open={showUploadModal}
                    clientId={selectedClientId}
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUploadDocument}
                />
            )}
        </div>
    );
}
