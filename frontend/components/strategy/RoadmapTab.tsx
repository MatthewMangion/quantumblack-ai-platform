'use client';

import StatusDropdown from '@/components/StatusDropdown';
import { phaseStatusConfig, activityStatusOptions, deliverableStatusOptions } from '@/lib/constants';
import type { EngagementPhaseData, PhaseStatus, Deliverable } from '@/lib/types';
import {
    Search, Layers, Rocket, Shield, CircleDot, Package, ChevronRight,
    ChevronDown, CalendarDays, Coins, Activity, CheckCircle2, Milestone, Clock
} from 'lucide-react';
import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phaseIcons = [Search, Layers, Rocket, Shield];

function computePhaseProgress(phase: EngagementPhaseData): { progress: number; status: PhaseStatus } {
    const includedActivities = phase.activities.filter(a => a.status !== 'not_included');
    const includedDeliverables = phase.deliverables.filter(d => d.status !== 'not_included');
    const total = includedActivities.length + includedDeliverables.length;
    if (total === 0) return { progress: 100, status: 'completed' };

    const doneCount =
        includedActivities.filter(a => a.status === 'completed').length +
        includedDeliverables.filter(d => d.status === 'delivered').length;
    const progress = Math.round((doneCount / total) * 100);

    if (progress === 100) return { progress, status: 'completed' };
    if (
        doneCount > 0 ||
        includedActivities.some(a => a.status === 'in_progress') ||
        includedDeliverables.some(d => d.status === 'in_progress' || d.status === 'in_review')
    ) return { progress, status: 'in_progress' };
    return { progress, status: 'not_started' };
}

interface RoadmapTabProps {
    clientEngagementPhases: EngagementPhaseData[];
    setAllPhases: React.Dispatch<React.SetStateAction<EngagementPhaseData[]>>;
}

export default memo(function RoadmapTab({ clientEngagementPhases, setAllPhases }: RoadmapTabProps) {
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

    const updateActivityStatus = useCallback((phaseId: string, activityId: string, newStatus: PhaseStatus) => {
        setAllPhases(prev => prev.map(p =>
            p.id === phaseId
                ? { ...p, activities: p.activities.map(a => a.id === activityId ? { ...a, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : a.completedDate } : a) }
                : p
        ));
    }, [setAllPhases]);

    const updateDeliverableStatus = useCallback((phaseId: string, deliverableId: string, newStatus: Deliverable['status']) => {
        setAllPhases(prev => prev.map(p =>
            p.id === phaseId
                ? { ...p, deliverables: p.deliverables.map(d => d.id === deliverableId ? { ...d, status: newStatus, deliveredDate: newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : d.deliveredDate } : d) }
                : p
        ));
    }, [setAllPhases]);

    const phaseComputed = useMemo(() => {
        const map = new Map<string, { progress: number; status: PhaseStatus }>();
        clientEngagementPhases.forEach(p => map.set(p.id, computePhaseProgress(p)));
        return map;
    }, [clientEngagementPhases]);

    const stats = useMemo(() => {
        const allDeliverables = clientEngagementPhases.flatMap(p => p.deliverables).filter(d => d.status !== 'not_included');
        const delivered = allDeliverables.filter(d => d.status === 'delivered').length;
        const allActivities = clientEngagementPhases.flatMap(p => p.activities).filter(a => a.status !== 'not_included');
        const completedActivities = allActivities.filter(a => a.status === 'completed').length;

        const totalInvestment = clientEngagementPhases
            .filter(p => !p.investment.includes('TBD'))
            .reduce((sum, p) => {
                const amount = p.investment.replace(/[£€,]/g, '');
                return sum + (parseFloat(amount) || 0);
            }, 0);

        const investmentStr = totalInvestment > 0
            ? `£${totalInvestment.toLocaleString()}${clientEngagementPhases.some(p => p.investment.includes('TBD')) ? '+' : ''}`
            : 'TBD';

        const overallProgress = clientEngagementPhases.length > 0
            ? Math.round(Array.from(phaseComputed.values()).reduce((acc, c) => acc + c.progress, 0) / clientEngagementPhases.length)
            : 0;

        return {
            totalDeliverables: allDeliverables.length,
            deliveredCount: delivered,
            totalActivities: allActivities.length,
            completedActivities,
            totalInvestment: investmentStr,
            overallProgress,
        };
    }, [clientEngagementPhases, phaseComputed]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Overall Progress', value: `${stats.overallProgress}%`, icon: Activity, color: '#10b981' },
                    { label: 'Activities Done', value: `${stats.completedActivities}/${stats.totalActivities}`, icon: CheckCircle2, color: '#10b981' },
                    { label: 'Deliverables', value: `${stats.deliveredCount}/${stats.totalDeliverables}`, icon: Package, color: '#10b981' },
                    { label: 'Total Investment', value: stats.totalInvestment, icon: Coins, color: '#10b981' },
                ].map((m) => (
                    <div key={m.label} className="glass-card p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-800 border border-neutral-700">
                                <m.icon className="w-4 h-4" style={{ color: m.color }} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-white">{m.value}</p>
                        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{m.label}</p>
                    </div>
                ))}
            </div>

            {/* Phase Timeline */}
            {clientEngagementPhases.length > 0 ? (
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                        <span className="dot-indicator" />
                        Engagement Phases
                    </h3>

                    <div className="space-y-0">
                        {clientEngagementPhases.map((phase, idx) => {
                            const PhaseIcon = phaseIcons[idx % phaseIcons.length];
                            const computed = phaseComputed.get(phase.id) ?? { progress: 0, status: 'not_started' as PhaseStatus };
                            const pStatus = phaseStatusConfig[computed.status];
                            const isExpanded = expandedPhase === phase.id;

                            return (
                                <div key={phase.id} className="relative">
                                    {idx < clientEngagementPhases.length - 1 && (
                                        <div className="absolute left-[23px] top-[56px] w-px bg-neutral-800" style={{ height: 'calc(100% - 28px)' }} />
                                    )}

                                    <div
                                        className="glass-card p-6 mb-4 cursor-pointer group"
                                        onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className="w-[46px] h-[46px] min-w-[46px] rounded-2xl flex items-center justify-center relative z-10"
                                                style={{ background: pStatus.bg, border: `1px solid ${pStatus.color}25` }}
                                            >
                                                <PhaseIcon className="w-5 h-5" style={{ color: pStatus.color }} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Phase {phase.phaseNumber}</span>
                                                        <span className="badge" style={{ background: pStatus.bg, color: pStatus.color, borderColor: `${pStatus.color}20` }}>{pStatus.label}</span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                                                            <CalendarDays className="w-3 h-3 text-emerald-400" />
                                                            {phase.timeline}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                                                            <Coins className="w-3 h-3 text-emerald-400" />
                                                            {phase.investment}
                                                        </span>
                                                        {isExpanded
                                                            ? <ChevronDown className="w-4 h-4 text-neutral-600" />
                                                            : <ChevronRight className="w-4 h-4 text-neutral-600 group-hover:text-neutral-400 transition-colors" />
                                                        }
                                                    </div>
                                                </div>
                                                <h3 className="text-base font-bold text-white mb-1">{phase.title}</h3>
                                                <p className="text-xs text-neutral-500 mb-4">{phase.subtitle}</p>

                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{ background: pStatus.color }}
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${computed.progress}%` }}
                                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-neutral-500">{computed.progress}%</span>
                                                </div>

                                                <div className="flex flex-wrap gap-1.5 mt-4">
                                                    {phase.keyServices.map(service => (
                                                        <span key={service} className="text-[9px] font-bold text-neutral-600 bg-neutral-800/80 px-2 py-0.5 rounded border border-neutral-700/50">
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                <CircleDot className="w-3 h-3 text-emerald-400" />
                                                                Activities
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {phase.activities.map(activity => {
                                                                    const aStatus = phaseStatusConfig[activity.status];
                                                                    return (
                                                                        <div key={activity.id} className={`flex items-start gap-3 p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/50 ${activity.status === 'not_included' ? 'opacity-40' : ''}`}>
                                                                            <div
                                                                                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                                                                style={{ background: aStatus.color, boxShadow: activity.status === 'completed' ? `0 0 8px ${aStatus.color}50` : 'none' }}
                                                                            />
                                                                            <div className="min-w-0 flex-1">
                                                                                <div className="flex items-start justify-between gap-2">
                                                                                    <div>
                                                                                        <p className={`text-xs font-semibold text-white ${activity.status === 'not_included' ? 'line-through' : ''}`}>{activity.title}</p>
                                                                                        <p className="text-[10px] text-neutral-600 mt-0.5 line-clamp-2">{activity.description}</p>
                                                                                    </div>
                                                                                    <StatusDropdown
                                                                                        value={activity.status}
                                                                                        options={activityStatusOptions}
                                                                                        onChange={(s) => updateActivityStatus(phase.id, activity.id, s)}
                                                                                    />
                                                                                </div>
                                                                                {activity.completedDate && (
                                                                                    <p className="text-[9px] text-emerald-500/70 font-bold mt-1 uppercase tracking-wider">Completed {activity.completedDate}</p>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                                                <Package className="w-3 h-3 text-emerald-400" />
                                                                Deliverables
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {phase.deliverables.map(deliverable => (
                                                                    <div key={deliverable.id} className={`p-3 rounded-xl bg-neutral-900/50 border border-neutral-800/50 ${deliverable.status === 'not_included' ? 'opacity-40' : ''}`}>
                                                                        <div className="flex items-start justify-between mb-1">
                                                                            <p className={`text-xs font-semibold text-white ${deliverable.status === 'not_included' ? 'line-through' : ''}`}>{deliverable.title}</p>
                                                                            <StatusDropdown
                                                                                value={deliverable.status}
                                                                                options={deliverableStatusOptions}
                                                                                onChange={(s) => updateDeliverableStatus(phase.id, deliverable.id, s)}
                                                                            />
                                                                        </div>
                                                                        <p className="text-[10px] text-neutral-600 line-clamp-2">{deliverable.description}</p>
                                                                        <div className="flex items-center gap-3 mt-2">
                                                                            <span className="text-[9px] text-neutral-700 font-bold flex items-center gap-1">
                                                                                <Clock className="w-2.5 h-2.5" /> Due: {deliverable.dueDate}
                                                                            </span>
                                                                            {deliverable.deliveredDate && (
                                                                                <span className="text-[9px] text-emerald-500/70 font-bold flex items-center gap-1">
                                                                                    <CheckCircle2 className="w-2.5 h-2.5" /> {deliverable.deliveredDate}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="glass-card p-12 text-center">
                    <Milestone className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Engagement Phases</h3>
                    <p className="text-sm text-neutral-500">This client does not have any strategy engagement phases yet.</p>
                </div>
            )}
        </motion.div>
    );
});

