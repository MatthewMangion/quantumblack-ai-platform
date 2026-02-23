'use client';

import type { ClientProfile } from '@/lib/types';
import { projects } from '@/lib/mock-data';
import {
    Filter, Users as UsersIcon, Briefcase, ArrowUpRight,
    Layers, Calendar
} from 'lucide-react';
import { useState, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ClientListViewProps {
    clients: ClientProfile[];
    onSelectClient: (id: string) => void;
}

export default memo(function ClientListView({ clients, onSelectClient }: ClientListViewProps) {
    const [showFilter, setShowFilter] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-500">Showing {clients.length} clients</span>
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
                {clients.map((client) => (
                    <motion.div
                        key={client.id}
                        layoutId={client.id}
                        onClick={() => onSelectClient(client.id)}
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
    );
});
