'use client';

import { phaseTemplates } from '@/lib/mock-data';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectServicesStepProps {
    clientName: string;
    selectedPhases: Record<string, boolean>;
    selectedServices: Record<string, Record<string, boolean>>;
    togglePhase: (key: string) => void;
    toggleService: (phaseKey: string, service: string) => void;
}

export default function SelectServicesStep({
    clientName,
    selectedPhases,
    selectedServices,
    togglePhase,
    toggleService,
}: SelectServicesStepProps) {
    return (
        <div className="space-y-4">
            <p className="text-xs text-neutral-500 mb-2">Select the engagement phases and services for <span className="text-white font-semibold">{clientName}</span></p>

            {phaseTemplates.map((template, idx) => {
                const isSelected = !!selectedPhases[template.key];
                return (
                    <div
                        key={template.key}
                        className={`rounded-xl border transition-all ${isSelected
                            ? 'border-emerald-500/30 bg-emerald-500/5'
                            : 'border-neutral-800 bg-neutral-900/50 hover:border-neutral-700'
                            }`}
                    >
                        <button
                            onClick={() => togglePhase(template.key)}
                            className="w-full flex items-center gap-4 p-4 text-left"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold border ${isSelected
                                ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                : 'bg-neutral-800 border-neutral-700 text-neutral-500'
                                }`}>
                                {isSelected ? <Check className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white">{template.title}</h4>
                                <p className="text-[10px] text-neutral-500 mt-0.5">{template.subtitle}</p>
                            </div>
                        </button>

                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 pt-0">
                                        <div className="flex flex-wrap gap-2">
                                            {template.services.map(svc => {
                                                const active = selectedServices[template.key]?.[svc];
                                                return (
                                                    <button
                                                        key={svc}
                                                        onClick={() => toggleService(template.key, svc)}
                                                        className={`text-[11px] font-semibold px-3 py-1.5 rounded-lg border transition-all ${active
                                                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                                                            : 'bg-neutral-800 text-neutral-500 border-neutral-700 hover:text-neutral-300'
                                                            }`}
                                                    >
                                                        {svc}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
}
