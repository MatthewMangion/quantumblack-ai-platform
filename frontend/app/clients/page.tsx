'use client';

import TopBar from '@/components/layout/TopBar';
import AddClientModal from '@/components/AddClientModal';
import DocumentUploadModal from '@/components/DocumentUploadModal';
import { projects } from '@/lib/mock-data';
import { useClients } from '@/lib/client-context';
import { useToast } from '@/lib/toast-context';
import type { ClientProfile, EngagementPhaseData, ClientDocument } from '@/lib/types';
import {
    Plus,
    Search,
    Filter,
    MapPin,
    Users as UsersIcon,
    Briefcase,
    ArrowUpRight,
    Clock,
    History,
    FileText,
    ChevronRight,
    MoreVertical,
    Calendar,
    Layers,
    CheckCircle2,
    Upload,
    Download,
    Trash2
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function ClientsPage() {
    const { allClients, addClient, getClientDocuments, addDocument, removeDocument } = useClients();
    const { toast } = useToast();
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const activeClient = allClients.find(c => c.id === selectedClient);
    const clientProjects = projects.filter(p => p.clientId === selectedClient);
    const clientDocs = selectedClient ? getClientDocuments(selectedClient) : [];

    const handleAddClient = (data: { client: ClientProfile; phases: EngagementPhaseData[] }) => {
        addClient(data.client, data.phases);
    };

    const handleUploadDocument = (doc: ClientDocument) => {
        addDocument(doc);
        toast('Document uploaded successfully');
    };

    const handleDeleteDocument = (id: string) => {
        removeDocument(id);
        toast('Document deleted');
    };

    const downloadDocument = (doc: ClientDocument) => {
        const link = document.createElement('a');
        link.href = doc.data;
        link.download = doc.name;
        link.click();
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title={selectedClient ? `Workspace: ${activeClient?.name}` : "Client Workspaces"}
                subtitle={selectedClient ? "Manage client engagements and deliverables" : "Overview of all active client partnerships"}
                actions={
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4" />
                        New Client
                    </button>
                }
            />

            <main className="flex-1 p-8">
                {!selectedClient ? (
                    /* CLIENT LIST VIEW */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-neutral-500">Showing {allClients.length} clients</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowFilter(f => !f)} className="btn-secondary text-xs py-1.5"><Filter className="w-3 h-3" /> Filter</button>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showFilter && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="glass-card p-4 flex items-center gap-3 overflow-hidden"
                                >
                                    <span className="text-xs font-medium text-neutral-500">Industry:</span>
                                    {['All', 'Financial Services', 'Healthcare', 'Technology'].map(f => (
                                        <button key={f} className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                                            {f}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {allClients.map((client) => (
                                <motion.div
                                    key={client.id}
                                    layoutId={client.id}
                                    onClick={() => setSelectedClient(client.id)}
                                    className="glass-card p-6 group cursor-pointer"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <Briefcase className="w-6 h-6 text-emerald-400" />
                                        </div>
                                        <ArrowUpRight className="w-5 h-5 text-neutral-700 group-hover:text-emerald-400 transition-colors" />
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-1">{client.name}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-xs text-neutral-500">{client.industry}</span>
                                        <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                        <span className="text-xs text-neutral-500">{client.size}</span>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-neutral-800">
                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                            <UsersIcon className="w-3.5 h-3.5" />
                                            <span>{client.contacts[0].name} — {client.contacts[0].role}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                            <Layers className="w-3.5 h-3.5" />
                                            <span>{projects.filter(p => p.clientId === client.id).length} active project{projects.filter(p => p.clientId === client.id).length !== 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>Since {new Date(client.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* CLIENT DETAIL WORKSPACE */
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <button
                            onClick={() => setSelectedClient(null)}
                            className="flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-white transition-colors"
                        >
                            ← Back to All Clients
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column: Info & Strategy */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="dot-indicator" />
                                        Client Profile
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-xs text-neutral-600 mb-1">Industry</p>
                                            <p className="text-sm text-white font-medium">{activeClient?.industry}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-600 mb-1">Organization Size</p>
                                            <p className="text-sm text-white font-medium">{activeClient?.size}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-600 mb-4">Key Contacts</p>
                                            <div className="space-y-3">
                                                {activeClient?.contacts.map(contact => (
                                                    <div key={contact.id} className="p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{contact.name}</p>
                                                            <p className="text-[10px] text-neutral-600">{contact.role}</p>
                                                        </div>
                                                        <button onClick={() => toast(`Contact options for ${contact.name}`)} className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-500 hover:text-white transition-all">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <span className="dot-indicator" />
                                        Strategic Goals
                                    </h3>
                                    <div className="space-y-3">
                                        {activeClient?.strategicGoals.map((goal, i) => (
                                            <div key={i} className="flex gap-3">
                                                <div className="w-5 h-5 rounded-full bg-emerald-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                </div>
                                                <p className="text-xs text-neutral-400 leading-relaxed font-medium">{goal}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Middle/Right Column: Timeline & Docs */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="glass-card p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                            <span className="dot-indicator" />
                                            Project Timeline
                                        </h3>
                                        <span className="badge badge-info">{clientProjects[0]?.phase} phase</span>
                                    </div>

                                    <div className="relative pl-6 border-l border-neutral-800 space-y-8">
                                        {clientProjects[0]?.milestones.map((milestone, idx) => (
                                            <div key={milestone.id} className="relative">
                                                <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#111111] ${milestone.completed ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-neutral-700'}`} />
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className={`text-sm font-bold ${milestone.completed ? 'text-white' : 'text-neutral-600'}`}>{milestone.title}</h4>
                                                        <span className="text-[10px] font-medium text-neutral-600">{milestone.dueDate}</span>
                                                    </div>
                                                    <p className="text-xs text-neutral-500">{milestone.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="glass-card p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                                            <span className="dot-indicator" />
                                            Document Library
                                        </h3>
                                        <button onClick={() => setShowUploadModal(true)} className="btn-primary text-[10px] py-1.5 px-3">
                                            <Upload className="w-3 h-3" /> Upload
                                        </button>
                                    </div>

                                    {clientDocs.length === 0 ? (
                                        <div className="text-center py-10">
                                            <FileText className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                                            <p className="text-sm text-neutral-500 font-medium">No documents yet</p>
                                            <p className="text-[10px] text-neutral-600 mt-1">Upload files to keep them saved for future reference</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {clientDocs.map(doc => (
                                                <div key={doc.id} className="p-4 rounded-xl bg-neutral-800/50 border border-neutral-800 hover:bg-neutral-800 transition-all group flex items-start gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                                        <FileText className="w-5 h-5 text-emerald-400" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[10px] text-neutral-600 uppercase">{doc.category.replace('_', ' ')}</span>
                                                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                                            <span className="text-[10px] text-neutral-600">{formatFileSize(doc.size)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); downloadDocument(doc); }}
                                                            className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-500 hover:text-emerald-400 transition-all"
                                                            title="Download"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc.id); }}
                                                            className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-500 hover:text-red-400 transition-all"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            <AddClientModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddClient}
            />

            {selectedClient && (
                <DocumentUploadModal
                    open={showUploadModal}
                    clientId={selectedClient}
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUploadDocument}
                />
            )}
        </div>
    );
}