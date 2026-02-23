'use client';

import { Plus, Trash2 } from 'lucide-react';

interface ClientDetailsStepProps {
    clientName: string;
    setClientName: (v: string) => void;
    industry: string;
    setIndustry: (v: string) => void;
    size: string;
    setSize: (v: string) => void;
    contactName: string;
    setContactName: (v: string) => void;
    contactRole: string;
    setContactRole: (v: string) => void;
    contactEmail: string;
    setContactEmail: (v: string) => void;
    goals: string[];
    setGoals: React.Dispatch<React.SetStateAction<string[]>>;
    sizeOptions: string[];
    emailError?: string;
    duplicateError?: string;
}

export default function ClientDetailsStep({
    clientName, setClientName,
    industry, setIndustry,
    size, setSize,
    contactName, setContactName,
    contactRole, setContactRole,
    contactEmail, setContactEmail,
    goals, setGoals,
    sizeOptions,
    emailError,
    duplicateError,
}: ClientDetailsStepProps) {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5 block">Client Name *</label>
                    <input
                        className={`input-base w-full ${duplicateError ? 'border-red-500/50' : ''}`}
                        placeholder="e.g. Acme Corporation"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                    />
                    {duplicateError && <p className="text-[10px] text-red-400 mt-1">{duplicateError}</p>}
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            className={`input-base w-full ${emailError ? 'border-red-500/50' : ''}`}
                            type="email"
                            placeholder="email@company.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                        />
                        {emailError && <p className="text-[10px] text-red-400 mt-1">{emailError}</p>}
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral-800 pt-5">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-bold text-white">Strategic Goals</h4>
                    <button
                        onClick={() => setGoals(prev => [...prev, ''])}
                        disabled={goals.length > 0 && !goals[goals.length - 1].trim()}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
        </div>
    );
}
