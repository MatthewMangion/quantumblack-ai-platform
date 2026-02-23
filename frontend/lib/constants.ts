import type { PhaseStatus, Deliverable, UseCase, StrategyDocument } from './types';

// ---- Status Colors & Config ----

export const phaseStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
    completed: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', label: 'Completed' },
    in_progress: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', label: 'In Progress' },
    upcoming: { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', label: 'Upcoming' },
    not_started: { color: '#737373', bg: 'rgba(115, 115, 115, 0.08)', label: 'Not Started' },
    not_included: { color: '#525252', bg: 'rgba(82, 82, 82, 0.08)', label: 'Not Included' },
};

export const workshopStatusConfig: Record<string, { color: string; bg: string; label: string }> = {
    upcoming: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', label: 'Upcoming' },
    in_progress: { color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', label: 'In Progress' },
    completed: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', label: 'Completed' },
    cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Cancelled' },
};

export const complexityColors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
};

export const categoryColors: Record<string, string> = {
    Leadership: '#10b981',
    Technical: '#059669',
    Governance: '#047857',
    Department: '#f59e0b',
};

// ---- Status Dropdown Options ----

export const activityStatusOptions: { value: PhaseStatus; label: string; color: string }[] = [
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'in_progress', label: 'In Progress', color: '#f59e0b' },
    { value: 'upcoming', label: 'Upcoming', color: '#6366f1' },
    { value: 'not_started', label: 'Not Started', color: '#737373' },
    { value: 'not_included', label: 'Not Included', color: '#525252' },
];

export const deliverableStatusOptions: { value: Deliverable['status']; label: string; color: string }[] = [
    { value: 'delivered', label: 'Delivered', color: '#10b981' },
    { value: 'in_review', label: 'In Review', color: '#f59e0b' },
    { value: 'in_progress', label: 'In Progress', color: '#6366f1' },
    { value: 'not_started', label: 'Not Started', color: '#525252' },
    { value: 'not_included', label: 'Not Included', color: '#525252' },
];

export const useCaseStatusOptions: { value: UseCase['status']; label: string; color: string }[] = [
    { value: 'completed', label: 'Completed', color: '#10b981' },
    { value: 'in_progress', label: 'In Progress', color: '#3b82f6' },
    { value: 'approved', label: 'Approved', color: '#10b981' },
    { value: 'evaluated', label: 'Evaluated', color: '#f59e0b' },
    { value: 'identified', label: 'Identified', color: '#737373' },
];

export const documentStatusOptions: { value: StrategyDocument['status']; label: string; color: string }[] = [
    { value: 'approved', label: 'Approved', color: '#10b981' },
    { value: 'review', label: 'In Review', color: '#f59e0b' },
    { value: 'draft', label: 'Draft', color: '#737373' },
];

// ---- Document Type Labels ----

export const typeLabels: Record<string, string> = {
    ai_strategy: 'AI Strategy',
    usage_policy: 'Usage Policy',
    education_plan: 'Education Plan',
    use_case_roadmap: 'Use Case Roadmap',
};
