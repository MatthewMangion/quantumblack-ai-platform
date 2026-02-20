// ========================================
// Core Data Types for AI Advisory Platform
// ========================================

// --- Users & Auth ---
export type UserRole = 'admin' | 'consultant' | 'client';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
    organization?: string;
    createdAt: string;
}

// --- Client & Workspace ---
export type EngagementPhase = 'discovery' | 'assessment' | 'strategy' | 'execution' | 'ongoing';

export interface ClientProfile {
    id: string;
    name: string;
    industry: string;
    size: string;
    logo?: string;
    contacts: Contact[];
    strategicGoals: string[];
    createdAt: string;
}

export interface Contact {
    id: string;
    name: string;
    role: string;
    email: string;
    phone?: string;
    isPrimary: boolean;
}

export interface Project {
    id: string;
    clientId: string;
    name: string;
    description: string;
    phase: EngagementPhase;
    startDate: string;
    endDate?: string;
    milestones: Milestone[];
    progress: number;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
    phase: EngagementPhase;
}

export interface Document {
    id: string;
    name: string;
    type: 'deliverable' | 'meeting_notes' | 'reference' | 'report' | 'template';
    size: string;
    uploadedBy: string;
    uploadedAt: string;
    url?: string;
}

export interface ActivityItem {
    id: string;
    type: 'milestone' | 'document' | 'comment' | 'update' | 'survey';
    title: string;
    description: string;
    user: string;
    timestamp: string;
    icon?: string;
}

// --- People Discovery ---
export interface SurveyQuestion {
    id: string;
    text: string;
    type: 'likert' | 'multiple_choice' | 'open_text' | 'yes_no';
    category: string;
    options?: string[];
    required: boolean;
}

export interface SurveyResponse {
    id: string;
    surveyId: string;
    respondent?: string;
    department: string;
    answers: Record<string, string | number>;
    submittedAt: string;
}

export interface Interview {
    id: string;
    stakeholderName: string;
    role: string;
    scheduledDate: string;
    status: 'scheduled' | 'completed' | 'cancelled';
    notes: InterviewNote[];
    themes: string[];
}

export interface InterviewNote {
    id: string;
    content: string;
    tag: 'pain_point' | 'opportunity' | 'resistance' | 'quick_win' | 'general';
    timestamp: string;
}

// --- Strategy ---
export interface StrategyDocument {
    id: string;
    clientId: string;
    title: string;
    type: 'ai_strategy' | 'usage_policy' | 'education_plan' | 'use_case_roadmap';
    content: string;
    version: number;
    status: 'draft' | 'review' | 'approved';
    lastModified: string;
    createdBy: string;
}

export interface UseCase {
    id: string;
    clientId: string;
    title: string;
    description: string;
    department: string;
    industry: string;
    complexity: 'low' | 'medium' | 'high';
    impact: number;
    effort: number;
    status: 'identified' | 'evaluated' | 'approved' | 'in_progress' | 'completed';
    tags: string[];
}

// --- Engagement Phases ---
export type PhaseStatus = 'completed' | 'in_progress' | 'upcoming' | 'not_started' | 'not_included';

export interface PhaseActivity {
    id: string;
    title: string;
    description: string;
    status: PhaseStatus;
    completedDate?: string;
}

export interface Deliverable {
    id: string;
    title: string;
    description: string;
    phaseId: string;
    status: 'not_started' | 'in_progress' | 'in_review' | 'delivered' | 'not_included';
    dueDate: string;
    deliveredDate?: string;
    documentId?: string;
}

export interface EngagementPhaseData {
    id: string;
    clientId: string;
    phaseNumber: number;
    title: string;
    subtitle: string;
    timeline: string;
    investment: string;
    status: PhaseStatus;
    progress: number;
    activities: PhaseActivity[];
    deliverables: Deliverable[];
    keyServices: string[];
}

// --- Workshops ---
export interface Workshop {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    duration: string;
    capacity: number;
    enrolled: number;
    instructor: string;
    status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
    materials: Document[];
    attendees: WorkshopAttendee[];
}

export interface WorkshopAttendee {
    id: string;
    name: string;
    email: string;
    department: string;
    attended: boolean;
    feedbackScore?: number;
    feedbackNotes?: string;
}

// --- Client Documents ---
export interface ClientDocument {
    id: string;
    clientId: string;
    name: string;
    type: string;
    size: number;
    data: string;
    uploadedAt: string;
    category: 'deliverable' | 'meeting_notes' | 'reference' | 'report' | 'template';
}

// --- Dashboard ---
export interface DashboardMetrics {
    activeClients: number;
    ongoingProjects: number;
    surveysCompleted: number;
    workshopsDelivered: number;
    documentsCreated: number;
    avgClientSatisfaction: number;
}
