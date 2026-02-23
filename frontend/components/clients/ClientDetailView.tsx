'use client';

import type { ClientProfile, ClientDocument } from '@/lib/types';
import { projects } from '@/lib/mock-data';
import { useToast } from '@/lib/toast-context';
import {
    FileText, MoreVertical, CheckCircle2,
    Upload, Download, Trash2
} from 'lucide-react';
import { memo } from 'react';
import { motion } from 'framer-motion';

interface ClientDetailViewProps {
    client: ClientProfile;
    documents: ClientDocument[];
    onBack: () => void;
    onUpload: () => void;
    onDownload: (doc: ClientDocument) => void;
    onDelete: (id: string) => void;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default memo(function ClientDetailView({ client, documents, onBack, onUpload, onDownload, onDelete }: ClientDetailViewProps) {
    const { toast } = useToast();
    const clientProjects = projects.filter(p => p.clientId === client.id);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
        >
            <button
                onClick={onBack}
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
                                <p className="text-sm text-white font-medium">{client.industry}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-600 mb-1">Organization Size</p>
                                <p className="text-sm text-white font-medium">{client.size}</p>
                            </div>
                            <div>
                                <p className="text-xs text-neutral-600 mb-4">Key Contacts</p>
                                <div className="space-y-3">
                                    {client.contacts.map(contact => (
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
                            {client.strategicGoals.map((goal, i) => (
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
                            {clientProjects[0]?.milestones.map((milestone) => (
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
                            <button onClick={onUpload} className="btn-primary text-[10px] py-1.5 px-3">
                                <Upload className="w-3 h-3" /> Upload
                            </button>
                        </div>

                        {documents.length === 0 ? (
                            <div className="text-center py-10">
                                <FileText className="w-10 h-10 text-neutral-700 mx-auto mb-3" />
                                <p className="text-sm text-neutral-500 font-medium">No documents yet</p>
                                <p className="text-[10px] text-neutral-600 mt-1">Upload files to keep them saved for future reference</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {documents.map(doc => (
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
                                                onClick={(e) => { e.stopPropagation(); onDownload(doc); }}
                                                className="p-1.5 rounded-lg hover:bg-neutral-700 text-neutral-500 hover:text-emerald-400 transition-all"
                                                title="Download"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
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
    );
});
