'use client';

import StatusDropdown from '@/components/StatusDropdown';
import { documentStatusOptions, typeLabels } from '@/lib/constants';
import type { StrategyDocument } from '@/lib/types';
import { FileText, Edit3, Eye, CheckCircle2, Clock, FileDown, ArrowUpRight } from 'lucide-react';
import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/lib/toast-context';
import DOMPurify from 'dompurify';

interface DocumentsTabProps {
    clientStrategyDocuments: StrategyDocument[];
    setAllDocuments: React.Dispatch<React.SetStateAction<StrategyDocument[]>>;
}

const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
    draft: { color: '#f59e0b', label: 'Draft', icon: <Edit3 className="w-3 h-3" /> },
    review: { color: '#10b981', label: 'In Review', icon: <Eye className="w-3 h-3" /> },
    approved: { color: '#10b981', label: 'Approved', icon: <CheckCircle2 className="w-3 h-3" /> },
};

export default memo(function DocumentsTab({ clientStrategyDocuments, setAllDocuments }: DocumentsTabProps) {
    const { toast } = useToast();
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

    const activeDocument = clientStrategyDocuments.find(d => d.id === selectedDoc);

    const updateDocumentStatus = useCallback((docId: string, newStatus: StrategyDocument['status']) => {
        setAllDocuments(prev => prev.map(d =>
            d.id === docId ? { ...d, status: newStatus } : d
        ));
    }, [setAllDocuments]);

    if (selectedDoc && activeDocument) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => setSelectedDoc(null)}
                            className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-widest mb-2 block"
                        >
                            ← Back to Documents
                        </button>
                        <h2 className="text-lg font-bold text-white">{activeDocument.title}</h2>
                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                            <span>{typeLabels[activeDocument.type]}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                            <span>v{activeDocument.version}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-700" />
                            <StatusDropdown
                                value={activeDocument.status}
                                options={documentStatusOptions}
                                onChange={(s) => updateDocumentStatus(activeDocument.id, s)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="btn-secondary text-xs" onClick={() => toast('Preview coming soon', 'info')}>Preview</button>
                        <button className="btn-primary text-xs" onClick={() => toast('PDF exported successfully')}>
                            <FileDown className="w-4 h-4" /> Export PDF
                        </button>
                    </div>
                </div>

                <div className="glass-card p-8 min-h-[500px]">
                    <div
                        className="prose prose-invert max-w-none text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeDocument.content) }}
                        style={{ color: 'var(--color-text-secondary)' }}
                    />
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            {clientStrategyDocuments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {clientStrategyDocuments.map((doc) => {
                        const status = statusConfig[doc.status];
                        return (
                            <button
                                key={doc.id}
                                onClick={() => setSelectedDoc(doc.id)}
                                className="glass-card p-6 text-left group cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                                        style={{ background: `${status.color}15`, border: `1px solid ${status.color}25` }}
                                    >
                                        <FileText className="w-5 h-5" style={{ color: status.color }} />
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-neutral-700 group-hover:text-emerald-400 transition-colors" />
                                </div>
                                <h3 className="text-sm font-semibold text-white mb-1">{doc.title}</h3>
                                <p className="text-xs text-neutral-500 mb-3">{typeLabels[doc.type]}</p>

                                <div className="flex items-center gap-3 text-xs text-neutral-600">
                                    <StatusDropdown
                                        value={doc.status}
                                        options={documentStatusOptions}
                                        onChange={(s) => updateDocumentStatus(doc.id, s)}
                                    />
                                    <span>v{doc.version}</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {doc.lastModified}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <FileText className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Documents</h3>
                    <p className="text-sm text-neutral-500">No strategy documents available for this client yet.</p>
                </div>
            )}
        </motion.div>
    );
});
