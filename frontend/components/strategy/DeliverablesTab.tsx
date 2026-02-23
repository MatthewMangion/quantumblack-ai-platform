'use client';

import StatusDropdown from '@/components/StatusDropdown';
import { deliverableStatusOptions } from '@/lib/constants';
import type { EngagementPhaseData, Deliverable } from '@/lib/types';
import { Package, CheckCircle2, Clock } from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

interface DeliverablesTabProps {
    clientEngagementPhases: EngagementPhaseData[];
    setAllPhases: React.Dispatch<React.SetStateAction<EngagementPhaseData[]>>;
}

export default memo(function DeliverablesTab({ clientEngagementPhases, setAllPhases }: DeliverablesTabProps) {
    const [deliverableFilter, setDeliverableFilter] = useState<string>('all');

    const updateDeliverableStatus = useCallback((phaseId: string, deliverableId: string, newStatus: Deliverable['status']) => {
        setAllPhases(prev => prev.map(p =>
            p.id === phaseId
                ? { ...p, deliverables: p.deliverables.map(d => d.id === deliverableId ? { ...d, status: newStatus, deliveredDate: newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : d.deliveredDate } : d) }
                : p
        ));
    }, [setAllPhases]);

    const allDeliverables = useMemo(() => {
        return clientEngagementPhases.flatMap(p =>
            p.deliverables.map(d => ({ ...d, phaseName: p.title, phaseNumber: p.phaseNumber }))
        );
    }, [clientEngagementPhases]);

    const stats = useMemo(() => {
        const included = allDeliverables.filter(d => d.status !== 'not_included');
        return {
            total: included.length,
            delivered: included.filter(d => d.status === 'delivered').length,
            inProgress: allDeliverables.filter(d => d.status === 'in_progress' || d.status === 'in_review').length,
            notStarted: allDeliverables.filter(d => d.status === 'not_started').length,
        };
    }, [allDeliverables]);

    const filteredDeliverables = deliverableFilter === 'all'
        ? allDeliverables
        : allDeliverables.filter(d => d.status === deliverableFilter);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Deliverables', value: stats.total },
                    { label: 'Delivered', value: stats.delivered },
                    { label: 'In Progress', value: stats.inProgress },
                    { label: 'Not Started', value: stats.notStarted },
                ].map((m) => (
                    <div key={m.label} className="glass-card p-5">
                        <p className="text-2xl font-bold text-white">{m.value}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{m.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                {['all', 'delivered', 'in_review', 'in_progress', 'not_started', 'not_included'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setDeliverableFilter(f)}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${deliverableFilter === f
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                            : 'text-neutral-600 border-transparent hover:text-neutral-400'
                            }`}
                    >
                        {f.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {filteredDeliverables.length > 0 ? (
                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest border-b border-neutral-800">
                                    <th className="px-6 py-4">Deliverable</th>
                                    <th className="px-6 py-4">Phase</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Delivered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {filteredDeliverables.map((d) => (
                                    <tr key={d.id} className={`hover:bg-neutral-800/30 transition-colors ${d.status === 'not_included' ? 'opacity-40' : ''}`}>
                                        <td className="px-6 py-4">
                                            <p className={`text-xs font-semibold text-white ${d.status === 'not_included' ? 'line-through' : ''}`}>{d.title}</p>
                                            <p className="text-[10px] text-neutral-600 line-clamp-1 mt-0.5">{d.description}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                                                Phase {d.phaseNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500">{d.dueDate}</td>
                                        <td className="px-6 py-4">
                                            <StatusDropdown
                                                value={d.status}
                                                options={deliverableStatusOptions}
                                                onChange={(s) => updateDeliverableStatus(d.phaseId, d.id, s)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-500">
                                            {d.deliveredDate ? (
                                                <span className="text-emerald-400 flex items-center gap-1 text-[10px] font-bold">
                                                    <CheckCircle2 className="w-3 h-3" /> {d.deliveredDate}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-700">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Package className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Deliverables</h3>
                    <p className="text-sm text-neutral-500">No deliverables found for the selected filter.</p>
                </div>
            )}
        </motion.div>
    );
});
