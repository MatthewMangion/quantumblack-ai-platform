'use client';

import dynamic from 'next/dynamic';
import TopBar from '@/components/layout/TopBar';
import AddClientModal from '@/components/AddClientModal';
import { strategyDocuments as initialStrategyDocuments, useCases as initialUseCases } from '@/lib/mock-data';
import { useClients } from '@/lib/client-context';
import { useToast } from '@/lib/toast-context';
import type { ClientProfile, EngagementPhaseData, StrategyDocument, UseCase } from '@/lib/types';
import { FileText, FileDown, Target, Milestone, Package, Building2, Plus } from 'lucide-react';
import { useState, useMemo } from 'react';

const Fallback = () => <div className="p-8 animate-pulse bg-neutral-900 rounded-xl h-64 border border-neutral-800" />;

const RoadmapTab = dynamic(() => import('@/components/strategy/RoadmapTab'), { ssr: false, loading: Fallback });
const DeliverablesTab = dynamic(() => import('@/components/strategy/DeliverablesTab'), { ssr: false, loading: Fallback });
const UseCasesTab = dynamic(() => import('@/components/strategy/UseCasesTab'), { ssr: false, loading: Fallback });
const DocumentsTab = dynamic(() => import('@/components/strategy/DocumentsTab'), { ssr: false, loading: Fallback });

type TabType = 'roadmap' | 'deliverables' | 'usecases' | 'documents';

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'roadmap', label: 'Roadmap', icon: <Milestone className="w-4 h-4" /> },
    { key: 'deliverables', label: 'Deliverables', icon: <Package className="w-4 h-4" /> },
    { key: 'usecases', label: 'Use Cases', icon: <Target className="w-4 h-4" /> },
    { key: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
];

export default function StrategyPage() {
    const { allClients, allPhases, setAllPhases, addClient, selectedClientId, setSelectedClientId } = useClients();
    const { toast } = useToast();
    const resolvedClientId = selectedClientId || allClients[0]?.id || '';
    const [activeTab, setActiveTab] = useState<TabType>('roadmap');
    const [showAddModal, setShowAddModal] = useState(false);

    const [allDocuments, setAllDocuments] = useState<StrategyDocument[]>(initialStrategyDocuments);
    const [allUseCases, setAllUseCases] = useState<UseCase[]>(initialUseCases);

    const handleAddClient = (data: { client: ClientProfile; phases: EngagementPhaseData[] }) => {
        addClient(data.client, data.phases);
        setSelectedClientId(data.client.id);
    };

    const clientEngagementPhases = useMemo(() =>
        allPhases.filter(p => p.clientId === resolvedClientId),
        [resolvedClientId, allPhases]);

    const clientStrategyDocuments = useMemo(() =>
        allDocuments.filter(d => d.clientId === resolvedClientId),
        [resolvedClientId, allDocuments]);

    const clientUseCases = useMemo(() =>
        allUseCases.filter(u => u.clientId === resolvedClientId),
        [resolvedClientId, allUseCases]);

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title="Strategy & Engagement"
                subtitle="AI Strategy — Client engagement roadmap, deliverables & documents"
                actions={
                    <button className="btn-primary" onClick={() => toast('Report exported successfully')}>
                        <FileDown className="w-4 h-4" />
                        Export Report
                    </button>
                }
            />

            <main className="flex-1 p-8 space-y-6">
                {allClients.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-20 text-center bg-neutral-900 border border-neutral-800 rounded-2xl">
                        <Building2 className="w-12 h-12 text-neutral-600 mb-4" />
                        <h2 className="text-xl font-semibold text-white">No Clients Yet</h2>
                        <p className="text-neutral-400 mt-2 mb-6 max-w-sm">Add your first client to start building AI strategy roadmaps and track engagements.</p>
                        <button className="btn-primary px-6" onClick={() => setShowAddModal(true)}>
                            <Plus className="w-4 h-4" />
                            New Client
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Client Selector */}
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-neutral-500" />
                            <div className="flex gap-2">
                                {allClients.map((client) => (
                                    <button
                                        key={client.id}
                                        onClick={() => setSelectedClientId(client.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${resolvedClientId === client.id
                                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                            : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900 border border-neutral-800'
                                            }`}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span>{client.name}</span>
                                            <span className="text-[9px] font-medium text-neutral-600 uppercase tracking-wider">{client.industry}</span>
                                        </div>
                                    </button>
                                ))}
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="px-3 py-2 rounded-lg text-neutral-500 hover:text-emerald-400 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/25 transition-all flex items-center gap-1.5"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 w-fit">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                        : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'roadmap' && (
                            <RoadmapTab
                                clientEngagementPhases={clientEngagementPhases}
                                setAllPhases={setAllPhases}
                            />
                        )}
                        {activeTab === 'deliverables' && (
                            <DeliverablesTab
                                clientEngagementPhases={clientEngagementPhases}
                                setAllPhases={setAllPhases}
                            />
                        )}
                        {activeTab === 'usecases' && (
                            <UseCasesTab
                                clientUseCases={clientUseCases}
                                setAllUseCases={setAllUseCases}
                            />
                        )}
                        {activeTab === 'documents' && (
                            <DocumentsTab
                                clientStrategyDocuments={clientStrategyDocuments}
                                setAllDocuments={setAllDocuments}
                            />
                        )}
                    </>
                )}
            </main>

            <AddClientModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddClient}
            />
        </div>
    );
}
