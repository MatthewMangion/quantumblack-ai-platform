'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';
import { phaseTemplates } from '@/lib/mock-data';
import type { ClientProfile, EngagementPhaseData } from '@/lib/types';
import { useClients } from '@/lib/client-context';
import { useFocusTrap } from '@/lib/use-focus-trap';
import ClientDetailsStep from './add-client/ClientDetailsStep';
import SelectServicesStep from './add-client/SelectServicesStep';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AddClientModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: { client: ClientProfile; phases: EngagementPhaseData[] }) => void;
}

const sizeOptions = ['1–50', '50–200', '200–1,000', '1,000–5,000', '5,000–10,000', '10,000+'];

export default function AddClientModal({ open, onClose, onSubmit }: AddClientModalProps) {
    const { allClients } = useClients();
    const trapRef = useFocusTrap<HTMLDivElement>(open);
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

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    const isEmailValid = EMAIL_REGEX.test(contactEmail.trim());
    const isDuplicate = allClients.some(c => c.name.toLowerCase() === clientName.trim().toLowerCase());
    const isStep1Valid = clientName.trim() && !isDuplicate && industry.trim() && contactName.trim() && contactRole.trim() && isEmailValid;

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
                        ref={trapRef}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        role="dialog"
                        aria-modal="true"
                        aria-label="New Client"
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
                                    >
                                        <ClientDetailsStep
                                            clientName={clientName} setClientName={setClientName}
                                            industry={industry} setIndustry={setIndustry}
                                            size={size} setSize={setSize}
                                            contactName={contactName} setContactName={setContactName}
                                            contactRole={contactRole} setContactRole={setContactRole}
                                            contactEmail={contactEmail} setContactEmail={setContactEmail}
                                            goals={goals} setGoals={setGoals}
                                            sizeOptions={sizeOptions}
                                            emailError={contactEmail.trim() && !isEmailValid ? 'Enter a valid email address' : undefined}
                                            duplicateError={clientName.trim() && isDuplicate ? 'A client with this name already exists' : undefined}
                                        />
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <SelectServicesStep
                                            clientName={clientName}
                                            selectedPhases={selectedPhases}
                                            selectedServices={selectedServices}
                                            togglePhase={togglePhase}
                                            toggleService={toggleService}
                                        />
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
