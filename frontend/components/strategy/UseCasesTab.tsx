'use client';

import StatusDropdown from '@/components/StatusDropdown';
import { complexityColors, useCaseStatusOptions } from '@/lib/constants';
import type { UseCase } from '@/lib/types';
import { Grid3X3, List, Target, TrendingUp, Clock } from 'lucide-react';
import { useState, useCallback, memo } from 'react';
import { motion } from 'framer-motion';

interface UseCasesTabProps {
    clientUseCases: UseCase[];
    setAllUseCases: React.Dispatch<React.SetStateAction<UseCase[]>>;
}

export default memo(function UseCasesTab({ clientUseCases, setAllUseCases }: UseCasesTabProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const updateUseCaseStatus = useCallback((useCaseId: string, newStatus: UseCase['status']) => {
        setAllUseCases(prev => prev.map(uc =>
            uc.id === useCaseId ? { ...uc, status: newStatus } : uc
        ));
    }, [setAllUseCases]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">{clientUseCases.length} identified AI use cases for prioritisation</p>
                <div className="flex gap-1 p-0.5 rounded-lg bg-neutral-900 border border-neutral-800">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-emerald-500/15 text-emerald-400' : 'text-neutral-600'}`}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-emerald-500/15 text-emerald-400' : 'text-neutral-600'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {clientUseCases.length > 0 && (
                <>
                    <div className="glass-card p-6">
                        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="dot-indicator" />
                            Prioritisation Matrix (Impact vs Effort)
                        </h3>
                        <div className="relative h-[300px] border border-neutral-800 rounded-xl bg-neutral-900/50 overflow-hidden">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] text-neutral-700 font-bold uppercase tracking-widest">Impact ↑</div>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-neutral-700 font-bold uppercase tracking-widest">Effort →</div>
                            <div className="absolute top-4 left-4 text-[9px] text-emerald-500/40 font-bold uppercase tracking-tighter">Quick Wins</div>
                            <div className="absolute top-4 right-4 text-[9px] text-emerald-500/30 font-bold uppercase tracking-tighter">Strategic Bets</div>
                            <div className="absolute bottom-4 left-4 text-[9px] text-neutral-700 font-bold uppercase tracking-tighter">Low Value</div>
                            <div className="absolute bottom-4 right-4 text-[9px] text-amber-500/40 font-bold uppercase tracking-tighter">Major Projects</div>

                            <div className="absolute top-1/2 left-0 w-full h-px bg-neutral-800" />
                            <div className="absolute left-1/2 top-0 w-px h-full bg-neutral-800" />

                            {clientUseCases.map((uc) => (
                                <motion.div
                                    key={uc.id}
                                    className="absolute w-3 h-3 rounded-full cursor-pointer hover:scale-150 transition-transform group"
                                    style={{
                                        left: `${(uc.effort / 10) * 85 + 7}%`,
                                        bottom: `${(uc.impact / 10) * 75 + 12}%`,
                                        background: complexityColors[uc.complexity],
                                        boxShadow: `0 0 10px ${complexityColors[uc.complexity]}40`
                                    }}
                                >
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                        <div className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 whitespace-nowrap text-[10px] text-white font-bold">
                                            {uc.title}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-3"}>
                        {clientUseCases.map((uc) => (
                            <div key={uc.id} className="glass-card p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="text-sm font-bold text-white leading-tight">{uc.title}</h4>
                                    <span className="badge" style={{ background: `${complexityColors[uc.complexity]}10`, color: complexityColors[uc.complexity], borderColor: `${complexityColors[uc.complexity]}20` }}>{uc.complexity}</span>
                                </div>
                                <p className="text-xs text-neutral-500 line-clamp-2 mb-3">{uc.description}</p>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">Status:</span>
                                    <StatusDropdown
                                        value={uc.status}
                                        options={useCaseStatusOptions}
                                        onChange={(s) => updateUseCaseStatus(uc.id, s)}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {uc.tags.map(tag => (
                                        <span key={tag} className="text-[9px] font-bold text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded border border-neutral-700">#{tag}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                                    <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">{uc.department}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400"><TrendingUp className="w-3 h-3" /> {uc.impact}</div>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400"><Clock className="w-3 h-3" /> {uc.effort}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {clientUseCases.length === 0 && (
                <div className="glass-card p-12 text-center">
                    <Target className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Use Cases</h3>
                    <p className="text-sm text-neutral-500">No AI use cases identified for this client yet.</p>
                </div>
            )}
        </motion.div>
    );
});
