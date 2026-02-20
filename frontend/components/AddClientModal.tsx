'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, ChevronRight, Check } from 'lucide-react';
import { phaseTemplates } from '@/lib/mock-data';
import type { ClientProfile, EngagementPhaseData } from '@/lib/types';

interface AddClientModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { client: ClientProfile; phases: EngagementPhaseData[] }) => void;
}

const sizeOptions = ['1–50', '50–200', '200–1,000', '1,000–5,000', '5,000–10,000', '10,000+'];

export default function AddClientModal({ open, onClose, onSubmit }: AddClientModalProps) {
    const [step, setStep] = useState(1);

    // Step 1 fields
    const [clientName, setClientName] = useState('');
    const [industry, setIndustry] = useState('');
    const [size, setSize] = useState(sizeOptions[2]);
    const [contactName, setContactName] = useState('');
    const [contactRole, setContactRole] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [goals, setGoals] = useState<string[]>(['']);

    // Step 2 fields
    const [selectedPhases, setSelectedPhases] = useState<Record<string, boolean>>({});
    const [selectedServices, setSelectedServices] = useState<Record<string, Record<string, boolean>>>({});

    const resetForm = () => {
        setStep(1);
        setClientName('');
        setIndustry('');
        setSize(sizeOptions[2]);
        setContactName('');
        setContactRole('');
        setContactEmail('');
        setGoals(['']);
        setSelectedPhases({});
        setSelectedServices({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const isStep1Valid = clientName.trim() && industry.trim() && contactName.trim() && contactRole.trim() && contactEmail.trim();

    const togglePhase = (key: string) => {
        setSelectedPhases(prev => {
            const next = { ...prev, [key]: !prev[key] };
            if (!next[key]) {
                setSelectedServices(s => {
                    const ns = { ...s };
                    delete ns[key];
                    return ns;
                });
            } else {
                const template = phaseTemplates.find(t => t.key === key)!;
                setSelectedServices(s => ({
                    ...s,
                    [key]: Object.fromEntries(template.services.map(svc => [svc, true])),
                }));
            }
            return next;
        });
    };

    const toggleService = (phaseKey: string, service: string) => {
        setSelectedServices(prev => ({
            ...prev,
            [phaseKey]: { ...prev[phaseKey], [service]: !prev[phaseKey]?.[service] },
        }));
    };

    const hasSelectedPhases = Object.values(selectedPhases).some(Boolean);

    const handleSubmit = () => {
        const clientId = `c${Date.now()}`;

        const client: ClientProfile = {
            id: clientId,
            name: clientName.trim(),
            industry: industry.trim(),
            size: `${size} employees`,
            contacts: [
                {
                    id: `ct${Date.now()}`,
                    name: contactName.trim(),
                    role: contactRole.trim(),
                    email: contactEmail.trim(),
                    isPrimary: true,
                },
            ],
            strategicGoals: goals.map(g => g.trim()).filter(Boolean),
            createdAt: new Date().toISOString().split('T')[0],
        };

        const phases: EngagementPhaseData[] = [];
        let phaseNum = 1;

        phaseTemplates.forEach((template) => {
            if (!selectedPhases[template.key]) return;

            const activeServices = Object.entries(selectedServices[template.key] || {})
                .filter(([, active]) => active)
                .map(([name]) => name);

            if (activeServices.length === 0) return;

            phases.push({
                id: `ep-${clientId}-${phaseNum}`,
                clientId,
                phaseNumber: phaseNum,
                title: template.title,
                subtitle: template.subtitle,
                timeline: 'TBD',
                investment: 'TBD',
                status: 'not_started',
                progress: 0,
                activities: activeServices.map((svc, i) => ({
                    id: `a-${clientId}-${phaseNum}-${i + 1}`,
                    title: svc,
                    description: '',
                    status: 'not_started' as const,
                })),
                deliverables: [],
                keyServices: activeServices,
            });
            phaseNum++;
        });

        onSubmit({ client, phases });
        handleClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
                            <div>
                                <h2 className="text-lg font-bold text-white">New Client</h2>
                                <p className="text-xs text-neutral-500 mt-0.5">
                                    Step {step} of 2 — {step === 1 ? 'Client Details' : 'Select Services'}
                                </p>
                            </div>
                            <button onClick={handleClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-500 hover:text-white transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Step indicators */}
                        <div className="flex gap-2 px-6 pt-4">
                            <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
                            <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-neutral-800'}`} />
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-5"
                                    >
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Client Name *</label>
                                                <input
                                                    className="input-base w-full"
                                                    placeholder="e.g. Acme Corporation"
                                                    value={clientName}
                                                    onChange={(e) => setClientName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Industry *</label>
                                                <input
                                                    className="input-base w-full"
                                                    placeholder="e.g. Financial Services"
                                                    value={industry}
                                                    onChange={(e) => setIndustry(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Organisation Size</label>
                                                <select
                                                    className="input-base w-full"
                                                    value={size}
                                                    onChange={(e) => setSize(e.target.value)}
                                                >
                                                    {sizeOptions.map(s => (
                                                        <option key={s} value={s}>{s} employees</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="border-t border-neutral-800 pt-5">
                                            <h4 className="text-xs font-bold text-white mb-3">Primary Contact</h4>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Name *</label>
                                                    <input
                                                        className="input-base w-full"
                                                        placeholder="Full name"
                                                        value={contactName}
                                                        onChange={(e) => setContactName(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Role *</label>
                                                    <input
                                                        className="input-base w-full"
                                                        placeholder="e.g. CTO"
                                                        value={contactRole}
                                                        onChange={(e) => setContactRole(e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Email *</label>
                                                    <input
                                                        className="input-base w-full"
                                                        type="email"
                                                        placeholder="email@company.com"
                                                        value={contactEmail}
                                                        onChange={(e) => setContactEmail(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-neutral-800 pt-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-xs font-bold text-white">Strategic Goals</h4>
                                                <button
                                                    onClick={() => setGoals(prev => [...prev, ''])}
                                                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" /> Add Goal
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {goals.map((goal, i) => (
                                                    <div key={i} className="flex items-center gap-2">
                                                        <input
                                                            className="input-base w-full"
                                                            placeholder={`Goal ${i + 1}`}
                                                            value={goal}
                                                            onChange={(e) => {
                                                                const next = [...goals];
                                                                next[i] = e.target.value;
                                                                setGoals(next);
                                                            }}
                                                        />
                                                        {goals.length > 1 && (
                                                            <button
                                                                onClick={() => setGoals(prev => prev.filter((_, idx) => idx !== i))}
                                                                className="p-2 rounded-lg hover:bg-neutral-800 text-neutral-600 hover:text-red-400 transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-4"
                                    >
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
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-neutral-800">
                            <button onClick={handleClose} className="btn-secondary text-xs">Cancel</button>
                            <div className="flex gap-2">
                                {step === 2 && (
                                    <button onClick={() => setStep(1)} className="btn-secondary text-xs">Back</button>
                                )}
                                {step === 1 && (
                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!isStep1Valid}
                                        className="btn-primary text-xs"
                                    >
                                        Next <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                                {step === 2 && (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!hasSelectedPhases}
                                        className="btn-primary text-xs"
                                    >
                                        Create Client
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
