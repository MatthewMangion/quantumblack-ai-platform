'use client';

import TopBar from '@/components/layout/TopBar';
import AddClientModal from '@/components/AddClientModal';
import { strategyDocuments as initialStrategyDocuments, useCases as initialUseCases } from '@/lib/mock-data';
import { useClients } from '@/lib/client-context';
import { useToast } from '@/lib/toast-context';
import type { ClientProfile, EngagementPhaseData, Deliverable, StrategyDocument, UseCase, PhaseStatus } from '@/lib/types';
import {
    FileText,
    Edit3,
    Eye,
    CheckCircle2,
    Clock,
    FileDown,
    Grid3X3,
    List,
    ArrowUpRight,
    TrendingUp,
    Target,
    Milestone,
    Package,
    ChevronRight,
    ChevronDown,
    Layers,
    Shield,
    GraduationCap,
    Rocket,
    Search,
    CircleDot,
    CalendarDays,
    Coins,
    Activity,
    BookOpen,
    Building2,
    ChevronUp,
    Plus
} from 'lucide-react';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---- Status Dropdown Component ----
function StatusDropdown<T extends string>({
    value,
    options,
    onChange,
}: {
    value: T;
    options: { value: T; label: string; color: string }[];
    onChange: (newStatus: T) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const current = options.find(o => o.value === value)!;

    return (
        <div ref={ref} className="relative inline-block">
            <button
                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                className="badge flex items-center gap-1.5 cursor-pointer hover:brightness-125 transition-all"
                style={{ background: `${current.color}12`, color: current.color, borderColor: `${current.color}20` }}
            >
                {current.label}
                <ChevronUp className={`w-3 h-3 transition-transform ${open ? '' : 'rotate-180'}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-50 mt-1 right-0 min-w-[140px] bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl overflow-hidden"
                    >
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(opt.value);
                                    setOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-semibold transition-colors hover:bg-neutral-800 ${opt.value === value ? 'bg-neutral-800/60' : ''}`}
                                style={{ color: opt.color }}
                            >
                                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: opt.color }} />
                                {opt.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

type TabType = 'roadmap' | 'deliverables' | 'usecases' | 'documents';

const phaseIcons = [Search, Layers, Rocket, Shield];

const phaseStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
    completed: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', label: 'Completed' },
    in_progress: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', label: 'In Progress' },
    upcoming: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', label: 'Upcoming' },
    not_started: { color: '#737373', bg: 'rgba(115, 115, 115, 0.08)', label: 'Not Started' },
    not_included: { color: '#525252', bg: 'rgba(82, 82, 82, 0.08)', label: 'Not Included' },
};

// Auto-compute phase progress & status from children
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

const complexityColors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
};

// Status option sets
const activityStatusOptions: { value: PhaseStatus; label: string; color: string }[] = [
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
    { value: 'upcoming', label: 'Upcoming', color: '#6366f1' },
    { value: 'not_started', label: 'Not Started', color: '#737373' },
    { value: 'not_included', label: 'Not Included', color: '#525252' },
];

const deliverableStatusOptions: { value: Deliverable['status']; label: string; color: string }[] = [
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'in_review', label: 'In Review', color: '#f59e0b' },
    { value: 'in_progress', label: 'In Progress', color: '#6366f1' },
    { value: 'not_started', label: 'Not Started', color: '#525252' },
    { value: 'not_included', label: 'Not Included', color: '#525252' },
];

const useCaseStatusOptions: { value: UseCase['status']; label: string; color: string }[] = [
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'in_progress', label: 'In Progress', color: '#3b82f6' },
    { value: 'approved', label: 'Approved', color: '#10b981' },
    { value: 'evaluated', label: 'Evaluated', color: '#f59e0b' },
    { value: 'identified', label: 'Identified', color: '#737373' },
];

const documentStatusOptions: { value: StrategyDocument['status']; label: string; color: string }[] = [
    { value: 'approved', label: 'Approved', color: '#10b981' },
    { value: 'review', label: 'In Review', color: '#f59e0b' },
    { value: 'draft', label: 'Draft', color: '#737373' },
];

export default function StrategyPage() {
    const { allClients, allPhases, setAllPhases, addClient } = useClients();
    const { toast } = useToast();
    const [selectedClientId, setSelectedClientId] = useState<string>(allClients[0]?.id ?? '');
    const [activeTab, setActiveTab] = useState<TabType>('roadmap');
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [deliverableFilter, setDeliverableFilter] = useState<string>('all');
    const [showAddModal, setShowAddModal] = useState(false);

    // Reset deliverable filter when switching clients
    useEffect(() => {
        setDeliverableFilter('all');
    }, [selectedClientId]);

    // Local state for documents and use cases (not shared across pages)
    const [allDocuments, setAllDocuments] = useState<StrategyDocument[]>(initialStrategyDocuments);
    const [allUseCases, setAllUseCases] = useState<UseCase[]>(initialUseCases);

    const selectedClient = allClients.find(c => c.id === selectedClientId)!;

    const handleAddClient = (data: { client: ClientProfile; phases: EngagementPhaseData[] }) => {
        addClient(data.client, data.phases);
        setSelectedClientId(data.client.id);
        setExpandedPhase(null);
        setSelectedDoc(null);
    };

    // Filter data by selected client
    const clientEngagementPhases = useMemo(() =>
        allPhases.filter(p => p.clientId === selectedClientId),
    [selectedClientId, allPhases]);

    const clientStrategyDocuments = useMemo(() =>
        allDocuments.filter(d => d.clientId === selectedClientId),
    [selectedClientId, allDocuments]);

    const clientUseCases = useMemo(() =>
        allUseCases.filter(u => u.clientId === selectedClientId),
    [selectedClientId, allUseCases]);

    const activeDocument = clientStrategyDocuments.find(d => d.id === selectedDoc);

    // ---- Status Change Handlers ----
    const updateActivityStatus = useCallback((phaseId: string, activityId: string, newStatus: PhaseStatus) => {
        setAllPhases(prev => prev.map(p =>
            p.id === phaseId
                ? { ...p, activities: p.activities.map(a => a.id === activityId ? { ...a, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : a.completedDate } : a) }
                : p
        ));
    }, []);

    const updateDeliverableStatus = useCallback((phaseId: string, deliverableId: string, newStatus: Deliverable['status']) => {
        setAllPhases(prev => prev.map(p =>
            p.id === phaseId
                ? { ...p, deliverables: p.deliverables.map(d => d.id === deliverableId ? { ...d, status: newStatus, deliveredDate: newStatus === 'delivered' ? new Date().toISOString().split('T')[0] : d.deliveredDate } : d) }
                : p
        ));
    }, []);

    const updateUseCaseStatus = useCallback((useCaseId: string, newStatus: UseCase['status']) => {
        setAllUseCases(prev => prev.map(uc =>
            uc.id === useCaseId ? { ...uc, status: newStatus } : uc
        ));
    }, []);

    const updateDocumentStatus = useCallback((docId: string, newStatus: StrategyDocument['status']) => {
        setAllDocuments(prev => prev.map(d =>
            d.id === docId ? { ...d, status: newStatus } : d
        ));
    }, []);

    // Compute progress & status for each phase
    const phaseComputed = useMemo(() => {
        const map = new Map<string, { progress: number; status: PhaseStatus }>();
        clientEngagementPhases.forEach(p => map.set(p.id, computePhaseProgress(p)));
        return map;
    }, [clientEngagementPhases]);

    // Aggregate stats for selected client
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

    const allDeliverables = useMemo(() => {
        return clientEngagementPhases.flatMap(p =>
            p.deliverables.map(d => ({ ...d, phaseName: p.title, phaseNumber: p.phaseNumber }))
        );
    }, [clientEngagementPhases]);

    const filteredDeliverables = deliverableFilter === 'all'
        ? allDeliverables
        : allDeliverables.filter(d => d.status === deliverableFilter);

    const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
        { key: 'roadmap', label: 'Roadmap', icon: <Milestone className="w-4 h-4" /> },
        { key: 'deliverables', label: 'Deliverables', icon: <Package className="w-4 h-4" /> },
        { key: 'usecases', label: 'Use Cases', icon: <Target className="w-4 h-4" /> },
        { key: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
    ];

    const statusConfig: Record<string, { color: string; label: string; icon: React.ReactNode }> = {
        draft: { color: '#f59e0b', label: 'Draft', icon: <Edit3 className="w-3 h-3" /> },
        review: { color: '#10b981', label: 'In Review', icon: <Eye className="w-3 h-3" /> },
        approved: { color: '#10b981', label: 'Approved', icon: <CheckCircle2 className="w-3 h-3" /> },
    };

    const typeLabels: Record<string, string> = {
        ai_strategy: 'AI Strategy',
        usage_policy: 'Usage Policy',
        education_plan: 'Education Plan',
        use_case_roadmap: 'Use Case Roadmap',
    };

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title="Strategy & Engagement"
                subtitle="AI Strategy — Client engagement roadmap, deliverables & documents"
                actions={
                    <button className="btn-primary" onClick={() => toast('Report exported successfully')}>
                        <FileDown className="w-4 h-4" />
                        Export Report
                    </button>
                }
            />

            <main className="flex-1 p-8 space-y-6">
                {/* Client Selector */}
                <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-neutral-500" />
                    <div className="flex gap-2">
                        {allClients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => {
                                    setSelectedClientId(client.id);
                                    setExpandedPhase(null);
                                    setSelectedDoc(null);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedClientId === client.id
                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                        : 'text-neutral-500 hover:text-neutral-300 bg-neutral-900 border border-neutral-800'
                                    }`}
                            >
                                <div className="flex flex-col items-start">
                                    <span>{client.name}</span>
                                    <span className="text-[9px] font-medium text-neutral-600 uppercase tracking-wider">{client.industry}</span>
                                </div>
                            </button>
                        ))}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-3 py-2 rounded-lg text-neutral-500 hover:text-emerald-400 bg-neutral-900 border border-neutral-800 hover:border-emerald-500/25 transition-all flex items-center gap-1.5"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => { setActiveTab(tab.key); setSelectedDoc(null); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.key
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ==================== ROADMAP TAB ==================== */}
                {activeTab === 'roadmap' && (
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
                                                    <div className="absolute left-[23px] top-[56px] w-px bg-neutral-800" style={{ height: isExpanded ? 'calc(100% - 28px)' : 'calc(100% - 28px)' }} />
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
                                                                            {phase.deliverables.map(deliverable => {
                                                                                return (
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
                                                                                );
                                                                            })}
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
                )}

                {/* ==================== DELIVERABLES TAB ==================== */}
                {activeTab === 'deliverables' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Deliverables', value: stats.totalDeliverables },
                                { label: 'Delivered', value: stats.deliveredCount },
                                { label: 'In Progress', value: allDeliverables.filter(d => d.status === 'in_progress' || d.status === 'in_review').length },
                                { label: 'Not Started', value: allDeliverables.filter(d => d.status === 'not_started').length },
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
                                            {filteredDeliverables.map((d) => {
                                                return (
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
                                                );
                                            })}
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
                )}

                {/* ==================== USE CASES TAB ==================== */}
                {activeTab === 'usecases' && (
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
                )}

                {/* ==================== DOCUMENTS TAB ==================== */}
                {activeTab === 'documents' && !selectedDoc && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                        {clientStrategyDocuments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {clientStrategyDocuments.map((doc) => {
                                    const status = statusConfig[doc.status];
                                    return (
                                        <button
                                            key={doc.id}
                                            onClick={() => { setSelectedDoc(doc.id); }}
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
                )}

                {activeTab === 'documents' && selectedDoc && activeDocument && (
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
                                <button className="btn-secondary text-xs" onClick={() => toast('Preview coming soon')}>Preview</button>
                                <button className="btn-primary text-xs" onClick={() => toast('PDF exported successfully')}>
                                    <FileDown className="w-4 h-4" /> Export PDF
                                </button>
                            </div>
                        </div>

                        <div className="glass-card p-8 min-h-[500px]">
                            <div
                                className="prose prose-invert max-w-none text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: activeDocument.content }}
                                style={{ color: 'var(--color-text-secondary)' }}
                            />
                        </div>
                    </motion.div>
                )}
            </main>

            <AddClientModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSubmit={handleAddClient}
            />
        </div>
    );
}
