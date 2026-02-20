import {
    ClientProfile,
    Project,
    Milestone,
    Document,
    ActivityItem,

    SurveyQuestion,
    SurveyResponse,
    Workshop,
    StrategyDocument,
    UseCase,
    DashboardMetrics,
    User,
    EngagementPhaseData,
} from './types';

// ===== CURRENT USER =====
export const currentUser: User = {
    id: 'u1',
    name: 'Alex Morgan',
    email: 'alex@quantumblack.ai',
    role: 'consultant',
    avatar: '',
    organization: 'QuantumBlack AI Advisory',
    createdAt: '2024-01-15',
};

// ===== CLIENTS =====
export const clients: ClientProfile[] = [
    {
        id: 'c1',
        name: 'Meridian Financial Group',
        industry: 'Financial Services',
        size: '5,000–10,000 employees',
        contacts: [
            { id: 'ct1', name: 'Sarah Chen', role: 'CTO', email: 'sarah.chen@meridian.com', isPrimary: true },
            { id: 'ct2', name: 'James Rodriguez', role: 'VP of Innovation', email: 'james.r@meridian.com', isPrimary: false },
        ],
        strategicGoals: [
            'Automate compliance reporting',
            'Deploy AI-driven fraud detection',
            'Improve customer onboarding with AI',
        ],
        createdAt: '2025-06-12',
    },
    {
        id: 'c2',
        name: 'NovaCare Health Systems',
        industry: 'Healthcare',
        size: '2,000–5,000 employees',
        contacts: [
            { id: 'ct3', name: 'Dr. Emily Park', role: 'Chief Medical Officer', email: 'epark@novacare.org', isPrimary: true },
            { id: 'ct4', name: 'Tom Bradley', role: 'IT Director', email: 'tbradley@novacare.org', isPrimary: false },
        ],
        strategicGoals: [
            'Implement predictive patient scheduling',
            'AI-assisted diagnostics support',
            'Reduce administrative burden with automation',
        ],
        createdAt: '2025-09-01',
    },
    {
        id: 'c3',
        name: 'Atlas Manufacturing Co.',
        industry: 'Manufacturing',
        size: '10,000+ employees',
        contacts: [
            { id: 'ct5', name: 'Michael Torres', role: 'COO', email: 'mtorres@atlasmanuf.com', isPrimary: true },
        ],
        strategicGoals: [
            'Predictive maintenance across production lines',
            'Supply chain optimization with ML',
            'Quality control automation',
        ],
        createdAt: '2025-11-20',
    },
];

// ===== PROJECTS =====
export const projects: Project[] = [
    {
        id: 'p1',
        clientId: 'c1',
        name: 'AI Readiness & Strategy Programme',
        description: 'Full AI maturity assessment and strategic roadmap for Meridian Financial Group.',
        phase: 'strategy',
        startDate: '2025-07-01',
        endDate: '2026-03-31',
        progress: 62,
        milestones: [
            { id: 'm1', title: 'Discovery Kickoff', description: 'Initial stakeholder alignment', dueDate: '2025-07-15', completed: true, phase: 'discovery' },
            { id: 'm2', title: 'Technology Audit Complete', description: 'Full tech landscape review', dueDate: '2025-08-30', completed: true, phase: 'assessment' },
            { id: 'm3', title: 'AI Readiness Survey Deployed', description: 'Organisation-wide survey', dueDate: '2025-09-15', completed: true, phase: 'assessment' },
            { id: 'm4', title: 'Strategy Draft v1', description: 'First draft of AI strategy document', dueDate: '2025-11-30', completed: true, phase: 'strategy' },
            { id: 'm5', title: 'Leadership Workshop', description: 'AI strategy workshop with C-suite', dueDate: '2026-01-20', completed: false, phase: 'strategy' },
            { id: 'm6', title: 'Final Strategy Delivery', description: 'Sign-off on AI strategy and roadmap', dueDate: '2026-03-15', completed: false, phase: 'strategy' },
        ],
    },
    {
        id: 'p2',
        clientId: 'c2',
        name: 'Healthcare AI Discovery',
        description: 'Initial discovery and readiness assessment for NovaCare Health Systems.',
        phase: 'assessment',
        startDate: '2025-10-01',
        endDate: '2026-06-30',
        progress: 35,
        milestones: [
            { id: 'm7', title: 'Stakeholder Interviews', description: 'One-on-one interviews with leadership', dueDate: '2025-10-30', completed: true, phase: 'discovery' },
            { id: 'm8', title: 'Tech Audit Kickoff', description: 'Begin technology landscape review', dueDate: '2025-11-15', completed: true, phase: 'assessment' },
            { id: 'm9', title: 'AI Literacy Survey', description: 'Deploy readiness survey to staff', dueDate: '2026-01-10', completed: false, phase: 'assessment' },
            { id: 'm10', title: 'Gap Analysis Report', description: 'Identify key gaps and opportunities', dueDate: '2026-03-01', completed: false, phase: 'assessment' },
        ],
    },
    {
        id: 'p3',
        clientId: 'c3',
        name: 'Manufacturing AI Opportunity Scan',
        description: 'Quick-scan engagement to identify top AI use cases for Atlas Manufacturing.',
        phase: 'discovery',
        startDate: '2026-01-15',
        endDate: '2026-04-30',
        progress: 10,
        milestones: [
            { id: 'm11', title: 'Engagement Kickoff', description: 'Project launch and scoping', dueDate: '2026-01-20', completed: true, phase: 'discovery' },
            { id: 'm12', title: 'Plant Tour & Interviews', description: 'On-site discovery sessions', dueDate: '2026-02-28', completed: false, phase: 'discovery' },
        ],
    },
];

// ===== DOCUMENTS =====
export const documents: Document[] = [
    { id: 'd1', name: 'AI Strategy Draft v1.docx', type: 'deliverable', size: '2.4 MB', uploadedBy: 'Alex Morgan', uploadedAt: '2025-11-28' },
    { id: 'd2', name: 'Technology Audit Report.pdf', type: 'report', size: '1.8 MB', uploadedBy: 'Alex Morgan', uploadedAt: '2025-08-30' },
    { id: 'd3', name: 'Stakeholder Interview Summary.pdf', type: 'meeting_notes', size: '890 KB', uploadedBy: 'Jordan Lee', uploadedAt: '2025-10-15' },
    { id: 'd4', name: 'AI Readiness Survey Results.xlsx', type: 'report', size: '1.2 MB', uploadedBy: 'Alex Morgan', uploadedAt: '2025-10-05' },
    { id: 'd5', name: 'Workshop Materials - AI Foundations.zip', type: 'reference', size: '15.3 MB', uploadedBy: 'Dana Kim', uploadedAt: '2025-12-10' },
    { id: 'd6', name: 'AI Usage Policy Template.docx', type: 'template', size: '540 KB', uploadedBy: 'Alex Morgan', uploadedAt: '2025-09-20' },
];

// ===== ACTIVITY FEED =====
export const activityFeed: ActivityItem[] = [
    { id: 'a1', type: 'milestone', title: 'Strategy Draft v1 Completed', description: 'First draft ready for review by Meridian leadership team.', user: 'Alex Morgan', timestamp: '2025-11-28T14:30:00Z' },
    { id: 'a2', type: 'document', title: 'Technology Audit Report Uploaded', description: 'Complete tech landscape summary for Meridian.', user: 'Alex Morgan', timestamp: '2025-08-30T10:15:00Z' },
    { id: 'a3', type: 'survey', title: 'AI Readiness Survey Launched', description: 'Survey sent to 350 employees at Meridian Financial.', user: 'Jordan Lee', timestamp: '2025-09-15T09:00:00Z' },
    { id: 'a4', type: 'comment', title: 'Feedback on Strategy Draft', description: 'Sarah Chen requested edits to Section 3 — Use Case Prioritisation.', user: 'Sarah Chen', timestamp: '2025-12-02T16:45:00Z' },
    { id: 'a5', type: 'update', title: 'NovaCare Engagement Started', description: 'New client engagement kicked off with stakeholder interviews.', user: 'Alex Morgan', timestamp: '2025-10-01T08:00:00Z' },
];

// ===== SURVEY QUESTIONS =====
export const surveyQuestions: SurveyQuestion[] = [
    { id: 'sq1', text: 'How familiar are you with AI and machine learning concepts?', type: 'likert', category: 'AI Literacy', required: true },
    { id: 'sq2', text: 'Do you currently use any AI-powered tools in your daily work?', type: 'yes_no', category: 'Current Usage', required: true },
    { id: 'sq3', text: 'Which AI tools do you use? (Select all that apply)', type: 'multiple_choice', category: 'Current Usage', options: ['ChatGPT', 'Microsoft Copilot', 'Google Gemini', 'Jasper AI', 'Custom internal tools', 'None'], required: false },
    { id: 'sq4', text: 'How would you rate your department\'s readiness to adopt AI solutions?', type: 'likert', category: 'Readiness', required: true },
    { id: 'sq5', text: 'What is your biggest concern about AI adoption in your work?', type: 'open_text', category: 'Attitudes', required: false },
    { id: 'sq6', text: 'How confident are you in your organisation\'s data privacy practices?', type: 'likert', category: 'Risk Perception', required: true },
    { id: 'sq7', text: 'Would you be interested in AI training workshops?', type: 'yes_no', category: 'Opportunities', required: true },
    { id: 'sq8', text: 'What department do you work in?', type: 'multiple_choice', category: 'Demographics', options: ['Engineering', 'Marketing', 'Sales', 'Finance', 'HR', 'Operations', 'Legal', 'Executive'], required: true },
];

// ===== SURVEY RESPONSES (for dashboard) =====
export const surveyResponses: SurveyResponse[] = [
    { id: 'sr1', surveyId: 's1', department: 'Engineering', answers: { sq1: 4, sq2: 'yes', sq4: 4, sq6: 3, sq7: 'yes' }, submittedAt: '2025-09-20' },
    { id: 'sr2', surveyId: 's1', department: 'Marketing', answers: { sq1: 2, sq2: 'yes', sq4: 2, sq6: 3, sq7: 'yes' }, submittedAt: '2025-09-21' },
    { id: 'sr3', surveyId: 's1', department: 'Sales', answers: { sq1: 3, sq2: 'no', sq4: 3, sq6: 4, sq7: 'yes' }, submittedAt: '2025-09-22' },
    { id: 'sr4', surveyId: 's1', department: 'Finance', answers: { sq1: 2, sq2: 'no', sq4: 2, sq6: 4, sq7: 'no' }, submittedAt: '2025-09-22' },
    { id: 'sr5', surveyId: 's1', department: 'HR', answers: { sq1: 1, sq2: 'no', sq4: 1, sq6: 2, sq7: 'yes' }, submittedAt: '2025-09-23' },
    { id: 'sr6', surveyId: 's1', department: 'Operations', answers: { sq1: 3, sq2: 'yes', sq4: 3, sq6: 3, sq7: 'yes' }, submittedAt: '2025-09-23' },
    { id: 'sr7', surveyId: 's1', department: 'Engineering', answers: { sq1: 5, sq2: 'yes', sq4: 5, sq6: 4, sq7: 'yes' }, submittedAt: '2025-09-24' },
    { id: 'sr8', surveyId: 's1', department: 'Legal', answers: { sq1: 2, sq2: 'no', sq4: 2, sq6: 5, sq7: 'no' }, submittedAt: '2025-09-24' },
    { id: 'sr9', surveyId: 's1', department: 'Executive', answers: { sq1: 3, sq2: 'yes', sq4: 4, sq6: 3, sq7: 'yes' }, submittedAt: '2025-09-25' },
    { id: 'sr10', surveyId: 's1', department: 'Marketing', answers: { sq1: 3, sq2: 'yes', sq4: 3, sq6: 3, sq7: 'yes' }, submittedAt: '2025-09-25' },
];

// ===== WORKSHOPS =====
export const workshops: Workshop[] = [
    {
        id: 'w1',
        title: 'AI Foundations for Leaders',
        description: 'An executive-level overview of AI capabilities, limitations, and strategic implications.',
        category: 'Leadership',
        date: '2026-02-15',
        duration: '3 hours',
        capacity: 25,
        enrolled: 22,
        instructor: 'Alex Morgan',
        status: 'upcoming',
        materials: [],
        attendees: [
            { id: 'wa1', name: 'Sarah Chen', email: 'sarah.chen@meridian.com', department: 'Executive', attended: false },
            { id: 'wa2', name: 'James Rodriguez', email: 'james.r@meridian.com', department: 'Innovation', attended: false },
        ],
    },
    {
        id: 'w2',
        title: 'Prompt Engineering Fundamentals',
        description: 'Hands-on workshop covering prompt design patterns, chain-of-thought reasoning, and practical applications.',
        category: 'Technical',
        date: '2026-02-22',
        duration: '4 hours',
        capacity: 30,
        enrolled: 28,
        instructor: 'Dana Kim',
        status: 'upcoming',
        materials: [],
        attendees: [],
    },
    {
        id: 'w3',
        title: 'AI Ethics & Responsible Use',
        description: 'Framework for responsible AI adoption including bias, fairness, transparency, and governance.',
        category: 'Governance',
        date: '2026-01-10',
        duration: '2 hours',
        capacity: 40,
        enrolled: 35,
        instructor: 'Alex Morgan',
        status: 'completed',
        materials: [],
        attendees: [
            { id: 'wa3', name: 'Tom Bradley', email: 'tbradley@novacare.org', department: 'IT', attended: true, feedbackScore: 4.5 },
        ],
    },
    {
        id: 'w4',
        title: 'AI for Marketing Teams',
        description: 'Practical AI applications for marketing: content generation, analytics, personalisation, and campaign optimisation.',
        category: 'Department',
        date: '2026-03-05',
        duration: '3 hours',
        capacity: 20,
        enrolled: 12,
        instructor: 'Jordan Lee',
        status: 'upcoming',
        materials: [],
        attendees: [],
    },
];

// ===== ENGAGEMENT PHASES =====
export const engagementPhases: EngagementPhaseData[] = [
    // --- Meridian Financial Group (c1) — Strategy phase, most advanced ---
    {
        id: 'ep-c1-1',
        clientId: 'c1',
        phaseNumber: 1,
        title: 'Discovery & Foundation',
        subtitle: 'Assess current AI readiness, gather stakeholder insights, and establish a baseline',
        timeline: 'Jul – Aug 2025',
        investment: '£12,000',
        status: 'completed',
        progress: 100,
        activities: [
            { id: 'a-c1-1-1', title: 'Leadership Interviews', description: '1-on-1 interviews with CTO, VP Innovation, and department heads across Risk, Compliance, and Customer Service', status: 'completed', completedDate: '2025-07-25' },
            { id: 'a-c1-1-2', title: 'AI Readiness Survey', description: 'Organisation-wide survey deployed to 350 employees measuring AI literacy, tool usage, and readiness', status: 'completed', completedDate: '2025-08-10' },
            { id: 'a-c1-1-3', title: 'Stakeholder Discovery Workshops', description: 'Interactive sessions with cross-functional teams to map processes and identify quick wins', status: 'completed', completedDate: '2025-08-20' },
            { id: 'a-c1-1-4', title: 'Technology & Data Landscape Review', description: 'Audit of Salesforce, SAP, Snowflake, and Microsoft 365 ecosystem for AI integration readiness', status: 'completed', completedDate: '2025-08-28' },
        ],
        deliverables: [
            { id: 'd-c1-1-1', title: 'AI Readiness Report', description: 'Comprehensive maturity assessment covering people, processes, technology, and data foundations', phaseId: 'ep-c1-1', status: 'delivered', dueDate: '2025-08-30', deliveredDate: '2025-08-28', documentId: 'sd-c1-1' },
            { id: 'd-c1-1-2', title: 'Stakeholder Interview Summary', description: 'Synthesised findings from leadership interviews highlighting strategic themes and concerns', phaseId: 'ep-c1-1', status: 'delivered', dueDate: '2025-08-15', deliveredDate: '2025-08-12' },
            { id: 'd-c1-1-3', title: 'Technology Audit Report', description: 'Full tech landscape review with gap analysis and AI integration opportunities', phaseId: 'ep-c1-1', status: 'delivered', dueDate: '2025-08-30', deliveredDate: '2025-08-30' },
        ],
        keyServices: ['Leadership Interviews', 'AI Readiness Survey', 'Discovery Workshops', 'Technology Audit'],
    },
    {
        id: 'ep-c1-2',
        clientId: 'c1',
        phaseNumber: 2,
        title: 'Strategy & Roadmap Development',
        subtitle: 'Develop the AI strategy, internal policy framework, and prioritised use case roadmap',
        timeline: 'Sep – Nov 2025',
        investment: '£8,000',
        status: 'completed',
        progress: 100,
        activities: [
            { id: 'a-c1-2-1', title: 'AI Strategy Development', description: 'Crafting a 24-month strategic AI roadmap for fraud detection, compliance, and customer experience', status: 'completed', completedDate: '2025-10-30' },
            { id: 'a-c1-2-2', title: 'Internal AI Usage Policy', description: 'Drafting governance framework covering data handling, approved tools, and compliance with FCA regulations', status: 'completed', completedDate: '2025-11-10' },
            { id: 'a-c1-2-3', title: 'Use Case Prioritisation', description: 'Systematic ranking of 6 AI use cases based on impact, feasibility, and regulatory considerations', status: 'completed', completedDate: '2025-10-15' },
            { id: 'a-c1-2-4', title: 'C-Suite Alignment Workshop', description: 'Strategy validation session with CEO, CTO, and CFO to align on investment priorities', status: 'completed', completedDate: '2025-11-20' },
        ],
        deliverables: [
            { id: 'd-c1-2-1', title: 'AI Strategy Document (Draft)', description: '24-month strategic AI roadmap with vision, pillars, milestones, and investment plan', phaseId: 'ep-c1-2', status: 'delivered', dueDate: '2025-11-15', deliveredDate: '2025-11-12' },
            { id: 'd-c1-2-2', title: 'AI Usage Policy', description: 'Internal policy framework covering responsible use, approved tools, and regulatory compliance', phaseId: 'ep-c1-2', status: 'delivered', dueDate: '2025-11-15', deliveredDate: '2025-11-14' },
            { id: 'd-c1-2-3', title: 'Prioritised Use Case Matrix', description: 'Ranked list of AI use cases with impact/effort scoring and implementation recommendations', phaseId: 'ep-c1-2', status: 'delivered', dueDate: '2025-10-31', deliveredDate: '2025-10-28' },
        ],
        keyServices: ['AI Strategy Development', 'Policy Framework Design', 'Use Case Prioritisation', 'C-Suite Alignment'],
    },
    {
        id: 'ep-c1-3',
        clientId: 'c1',
        phaseNumber: 3,
        title: 'Pilot & Implementation Planning',
        subtitle: 'Define pilot projects, build change management plan, and design the education programme',
        timeline: 'Dec 2025 – Feb 2026',
        investment: '£6,000',
        status: 'in_progress',
        progress: 45,
        activities: [
            { id: 'a-c1-3-1', title: 'Fraud Detection Pilot Scoping', description: 'Defining scope, success metrics, and data requirements for the real-time fraud detection ML pilot', status: 'in_progress' },
            { id: 'a-c1-3-2', title: 'Compliance Automation Pilot Scoping', description: 'NLP-powered regulatory document analysis pilot with Legal and Compliance teams', status: 'in_progress' },
            { id: 'a-c1-3-3', title: 'Change Management Planning', description: 'Developing communications, training, and adoption support across 5,000+ employees', status: 'upcoming' },
            { id: 'a-c1-3-4', title: 'AI Leadership Workshop', description: 'Executive workshop on AI strategy execution and governance responsibilities', status: 'upcoming' },
        ],
        deliverables: [
            { id: 'd-c1-3-1', title: 'Final AI Strategy & Policy', description: 'Board-approved AI Strategy and Usage Policy documents', phaseId: 'ep-c1-3', status: 'in_review', dueDate: '2026-01-31' },
            { id: 'd-c1-3-2', title: 'Pilot Project Plans', description: 'Detailed implementation plans for fraud detection and compliance automation pilots', phaseId: 'ep-c1-3', status: 'in_progress', dueDate: '2026-02-15' },
            { id: 'd-c1-3-3', title: 'Education Programme Outline', description: 'Tiered AI training programme for executives, managers, and operational staff', phaseId: 'ep-c1-3', status: 'not_started', dueDate: '2026-02-28' },
        ],
        keyServices: ['Pilot Scoping', 'Change Management', 'Education Design', 'Leadership Workshops'],
    },
    {
        id: 'ep-c1-4',
        clientId: 'c1',
        phaseNumber: 4,
        title: 'Execution & Governance',
        subtitle: 'Launch pilots, establish AI governance committee, and roll out the education programme',
        timeline: 'Mar – Jun 2026',
        investment: '£10,000',
        status: 'not_started',
        progress: 0,
        activities: [
            { id: 'a-c1-4-1', title: 'Fraud Detection Pilot Launch', description: 'Deploy ML models for real-time transaction monitoring in a controlled environment', status: 'not_started' },
            { id: 'a-c1-4-2', title: 'AI Governance Committee', description: 'Establish cross-functional governance committee with CTO, CLO, and CISO', status: 'not_started' },
            { id: 'a-c1-4-3', title: 'Education Programme Rollout', description: 'Deliver AI training across all departments starting with leadership tier', status: 'not_started' },
            { id: 'a-c1-4-4', title: 'Performance Monitoring', description: 'Track pilot KPIs, model performance metrics, and business impact indicators', status: 'not_started' },
        ],
        deliverables: [
            { id: 'd-c1-4-1', title: 'Pilot Launch Report', description: 'Post-launch assessment of fraud detection pilot with metrics and learnings', phaseId: 'ep-c1-4', status: 'not_started', dueDate: '2026-05-31' },
            { id: 'd-c1-4-2', title: 'AI Governance Framework', description: 'Committee charter, decision framework, risk escalation paths, and audit procedures', phaseId: 'ep-c1-4', status: 'not_started', dueDate: '2026-04-30' },
            { id: 'd-c1-4-3', title: 'Training Completion Report', description: 'Training delivery records, satisfaction scores, and competency assessments', phaseId: 'ep-c1-4', status: 'not_started', dueDate: '2026-06-30' },
        ],
        keyServices: ['Pilot Execution Support', 'Governance Setup', 'Training Delivery', 'Performance Monitoring'],
    },

    // --- NovaCare Health Systems (c2) — Assessment phase, mid-engagement ---
    {
        id: 'ep-c2-1',
        clientId: 'c2',
        phaseNumber: 1,
        title: 'Discovery & Foundation',
        subtitle: 'Understand healthcare AI landscape, regulatory constraints, and stakeholder priorities',
        timeline: 'Oct – Nov 2025',
        investment: '£8,000',
        status: 'completed',
        progress: 100,
        activities: [
            { id: 'a-c2-1-1', title: 'Clinical Leadership Interviews', description: 'Interviews with CMO, IT Director, and department heads across clinical and admin functions', status: 'completed', completedDate: '2025-10-25' },
            { id: 'a-c2-1-2', title: 'AI Readiness Survey', description: 'Survey deployed to 2,000+ staff covering AI awareness, clinical workflow understanding, and training needs', status: 'completed', completedDate: '2025-11-08' },
            { id: 'a-c2-1-3', title: 'Clinical Workflow Mapping', description: 'Detailed mapping of patient scheduling, diagnostic, and administrative workflows for AI opportunity identification', status: 'completed', completedDate: '2025-11-15' },
            { id: 'a-c2-1-4', title: 'Healthcare IT Audit', description: 'Review of EHR systems, PACS integration, HL7/FHIR compliance, and data governance practices', status: 'completed', completedDate: '2025-11-20' },
        ],
        deliverables: [
            { id: 'd-c2-1-1', title: 'AI Readiness Report', description: 'Healthcare-specific maturity assessment covering clinical workflows, data readiness, and regulatory compliance', phaseId: 'ep-c2-1', status: 'delivered', dueDate: '2025-11-30', deliveredDate: '2025-11-28', documentId: 'sd-c2-1' },
            { id: 'd-c2-1-2', title: 'Clinical Workflow Analysis', description: 'Detailed process maps with AI intervention points across patient scheduling, diagnostics, and admin', phaseId: 'ep-c2-1', status: 'delivered', dueDate: '2025-11-25', deliveredDate: '2025-11-22' },
        ],
        keyServices: ['Clinical Interviews', 'AI Readiness Survey', 'Workflow Mapping', 'Healthcare IT Audit'],
    },
    {
        id: 'ep-c2-2',
        clientId: 'c2',
        phaseNumber: 2,
        title: 'Strategy & Roadmap Development',
        subtitle: 'Develop healthcare AI strategy with focus on patient outcomes, operational efficiency, and compliance',
        timeline: 'Dec 2025 – Feb 2026',
        investment: '£6,000',
        status: 'in_progress',
        progress: 30,
        activities: [
            { id: 'a-c2-2-1', title: 'Healthcare AI Strategy Development', description: 'Building an AI roadmap aligned with patient safety, clinical efficiency, and NHS/regulatory requirements', status: 'in_progress' },
            { id: 'a-c2-2-2', title: 'Clinical AI Use Case Prioritisation', description: 'Evaluating patient scheduling, diagnostics support, and admin automation use cases', status: 'in_progress' },
            { id: 'a-c2-2-3', title: 'Data Governance Framework', description: 'Designing data governance policies for patient data, GDPR compliance, and AI model validation', status: 'upcoming' },
            { id: 'a-c2-2-4', title: 'Clinical Board Alignment', description: 'Presenting strategy options to clinical governance board for direction and approval', status: 'not_started' },
        ],
        deliverables: [
            { id: 'd-c2-2-1', title: 'Healthcare AI Strategy (Draft)', description: 'AI strategy document covering clinical AI, operational AI, and responsible AI principles', phaseId: 'ep-c2-2', status: 'in_progress', dueDate: '2026-02-15' },
            { id: 'd-c2-2-2', title: 'Use Case Priority Matrix', description: 'Healthcare-specific use case ranking with clinical impact, patient safety, and regulatory considerations', phaseId: 'ep-c2-2', status: 'in_progress', dueDate: '2026-01-31' },
            { id: 'd-c2-2-3', title: 'Data Governance Policy', description: 'Patient data handling framework for AI training, inference, and clinical decision support', phaseId: 'ep-c2-2', status: 'not_started', dueDate: '2026-02-28' },
        ],
        keyServices: ['AI Strategy Development', 'Clinical Use Case Analysis', 'Data Governance', 'Clinical Board Alignment'],
    },
    {
        id: 'ep-c2-3',
        clientId: 'c2',
        phaseNumber: 3,
        title: 'Pilot & Implementation Planning',
        subtitle: 'Plan pilot deployments for patient scheduling AI and clinical decision support tools',
        timeline: 'Q2 2026',
        investment: '£5,000',
        status: 'not_started',
        progress: 0,
        activities: [
            { id: 'a-c2-3-1', title: 'Predictive Scheduling Pilot Design', description: 'Design ML pilot for optimising appointment scheduling and reducing no-show rates', status: 'not_started' },
            { id: 'a-c2-3-2', title: 'Clinical AI Training Programme', description: 'Design training for clinicians on AI-assisted tools, limitations, and responsible use', status: 'not_started' },
            { id: 'a-c2-3-3', title: 'Vendor Assessment', description: 'Evaluate healthcare AI vendors for EHR integration, clinical validation, and regulatory compliance', status: 'not_started' },
        ],
        deliverables: [
            { id: 'd-c2-3-1', title: 'Pilot Project Plans', description: 'Implementation plans for scheduling AI pilot with clinical validation criteria', phaseId: 'ep-c2-3', status: 'not_started', dueDate: '2026-05-31' },
            { id: 'd-c2-3-2', title: 'Clinical AI Education Plan', description: 'Training programme for clinical and administrative staff on AI tools', phaseId: 'ep-c2-3', status: 'not_started', dueDate: '2026-06-15' },
        ],
        keyServices: ['Pilot Design', 'Clinical Training', 'Vendor Assessment', 'Regulatory Compliance'],
    },

    // --- Atlas Manufacturing Co. (c3) — Discovery phase, early engagement ---
    {
        id: 'ep-c3-1',
        clientId: 'c3',
        phaseNumber: 1,
        title: 'Discovery & Opportunity Scan',
        subtitle: 'Rapid assessment of manufacturing AI opportunities across production, supply chain, and quality',
        timeline: 'Jan – Mar 2026',
        investment: '£15,000',
        status: 'in_progress',
        progress: 25,
        activities: [
            { id: 'a-c3-1-1', title: 'Executive Alignment', description: 'Engagement kickoff with COO and leadership team to define scope and success criteria', status: 'completed', completedDate: '2026-01-22' },
            { id: 'a-c3-1-2', title: 'Plant Tour & Interviews', description: 'On-site visits to 3 production facilities for operational assessment and stakeholder interviews', status: 'in_progress' },
            { id: 'a-c3-1-3', title: 'IoT & Data Infrastructure Review', description: 'Assessment of sensor networks, SCADA systems, MES integration, and data lake capabilities', status: 'upcoming' },
            { id: 'a-c3-1-4', title: 'AI Readiness Survey', description: 'Survey across engineering, operations, and quality teams on AI awareness and adoption readiness', status: 'not_started' },
        ],
        deliverables: [
            { id: 'd-c3-1-1', title: 'AI Opportunity Assessment', description: 'Rapid scan of AI opportunities across predictive maintenance, supply chain, and quality control', phaseId: 'ep-c3-1', status: 'in_progress', dueDate: '2026-03-15' },
            { id: 'd-c3-1-2', title: 'Technology Landscape Report', description: 'IoT infrastructure review with AI readiness scoring across 3 facilities', phaseId: 'ep-c3-1', status: 'not_started', dueDate: '2026-03-31' },
            { id: 'd-c3-1-3', title: 'Executive Summary & Recommendations', description: 'High-level findings with recommended next steps and investment considerations', phaseId: 'ep-c3-1', status: 'not_started', dueDate: '2026-04-15' },
        ],
        keyServices: ['Executive Alignment', 'Plant Assessments', 'IoT Infrastructure Review', 'AI Readiness Survey'],
    },
    {
        id: 'ep-c3-2',
        clientId: 'c3',
        phaseNumber: 2,
        title: 'Strategy & Use Case Definition',
        subtitle: 'Develop manufacturing AI strategy focused on predictive maintenance and supply chain optimisation',
        timeline: 'Q2 2026',
        investment: 'TBD',
        status: 'not_started',
        progress: 0,
        activities: [
            { id: 'a-c3-2-1', title: 'Manufacturing AI Strategy', description: 'Build an Industry 4.0 aligned AI strategy covering predictive maintenance, quality, and supply chain', status: 'not_started' },
            { id: 'a-c3-2-2', title: 'Use Case Prioritisation', description: 'Rank manufacturing AI use cases by ROI, technical feasibility, and operational impact', status: 'not_started' },
            { id: 'a-c3-2-3', title: 'Data Pipeline Architecture', description: 'Design data pipelines from IoT sensors to ML models for real-time and batch processing', status: 'not_started' },
        ],
        deliverables: [
            { id: 'd-c3-2-1', title: 'Manufacturing AI Strategy', description: 'Strategic roadmap for Industry 4.0 AI adoption across all production facilities', phaseId: 'ep-c3-2', status: 'not_started', dueDate: '2026-06-30' },
            { id: 'd-c3-2-2', title: 'Use Case Roadmap', description: 'Prioritised pipeline of manufacturing AI use cases with implementation timeline', phaseId: 'ep-c3-2', status: 'not_started', dueDate: '2026-06-30' },
        ],
        keyServices: ['AI Strategy Development', 'Use Case Prioritisation', 'Data Architecture', 'Industry 4.0 Advisory'],
    },
];

// ===== STRATEGY DOCUMENTS =====
export const strategyDocuments: StrategyDocument[] = [
    // Meridian Financial Group (c1)
    {
        id: 'sd-c1-1',
        clientId: 'c1',
        title: 'AI Readiness Report — Meridian Financial',
        type: 'ai_strategy',
        content: '<h1>AI Readiness Report</h1><h2>Executive Summary</h2><p>This report presents findings from the Discovery phase of the Meridian Financial Group AI Strategy engagement. Through leadership interviews with the CTO and VP of Innovation, a survey of 350 employees, and stakeholder workshops, we have established a comprehensive baseline of AI maturity.</p><h2>Key Findings</h2><ul><li><strong>AI Literacy:</strong> High awareness at C-suite level; moderate across engineering; limited in compliance and operations</li><li><strong>Technology Foundation:</strong> Strong Snowflake data platform and Microsoft 365 ecosystem; Salesforce CRM underutilising AI features; SAP ERP legacy constraints</li><li><strong>Data Readiness:</strong> Centralized analytics via Snowflake but ML pipelines not established</li><li><strong>Cultural Readiness:</strong> Innovation-positive culture with strong executive sponsorship from CTO</li></ul><h2>Recommendations</h2><ol><li>Prioritise fraud detection and compliance automation as first AI pilots</li><li>Enable Microsoft Copilot across the organisation as a quick win</li><li>Establish AI governance framework before scaling beyond pilots</li><li>Invest in ML operations infrastructure on Snowflake</li></ol>',
        version: 1,
        status: 'approved',
        lastModified: '2025-08-28',
        createdBy: 'Alex Morgan',
    },
    {
        id: 'sd-c1-2',
        clientId: 'c1',
        title: 'AI Strategy — Meridian Financial Group',
        type: 'ai_strategy',
        content: '<h1>AI Strategy — Meridian Financial Group</h1><h2>Vision</h2><p>To establish Meridian Financial as an AI-first financial services organisation, leveraging machine learning and automation to deliver superior fraud detection, regulatory compliance, and customer experience.</p><h2>Strategic Priorities</h2><ol><li><strong>Fraud Detection AI</strong> — Deploy ML models for real-time transaction monitoring</li><li><strong>Compliance Automation</strong> — NLP-powered regulatory document analysis and reporting</li><li><strong>Customer Onboarding</strong> — AI assistant for streamlined KYC processes</li></ol><h2>Roadmap</h2><p>Phase 1 (Q1–Q2 2026): Pilot launches for fraud detection and compliance automation<br/>Phase 2 (Q3–Q4 2026): Scale successful pilots and deploy customer onboarding AI</p>',
        version: 2,
        status: 'approved',
        lastModified: '2025-11-12',
        createdBy: 'Alex Morgan',
    },
    {
        id: 'sd-c1-3',
        clientId: 'c1',
        title: 'AI Usage Policy — Meridian Financial',
        type: 'usage_policy',
        content: '<h1>AI Usage Policy</h1><h2>Purpose</h2><p>This policy establishes guidelines for the responsible use of AI tools and systems across Meridian Financial Group, ensuring compliance with FCA regulations and data protection requirements.</p><h2>Scope</h2><p>Applies to all employees, contractors, and third-party vendors interacting with AI systems.</p><h2>Approved Tools</h2><p>Microsoft Copilot (approved), Internal fraud detection models (approved with governance oversight), ChatGPT (restricted — no client data)</p><h2>Data Handling</h2><p>Client financial data must not be input into external AI systems. All AI model outputs affecting customer decisions require human review.</p>',
        version: 2,
        status: 'approved',
        lastModified: '2025-11-14',
        createdBy: 'Alex Morgan',
    },
    // NovaCare Health Systems (c2)
    {
        id: 'sd-c2-1',
        clientId: 'c2',
        title: 'AI Readiness Report — NovaCare Health',
        type: 'ai_strategy',
        content: '<h1>AI Readiness Report — NovaCare Health Systems</h1><h2>Executive Summary</h2><p>This report presents findings from the Discovery phase for NovaCare Health Systems. The assessment covered clinical workflows, IT infrastructure, staff readiness, and regulatory considerations specific to healthcare AI adoption.</p><h2>Key Findings</h2><ul><li><strong>Clinical AI Awareness:</strong> CMO and IT Director are strong champions; clinical staff awareness is limited</li><li><strong>EHR Integration:</strong> Cerner-based EHR with HL7 interfaces; FHIR adoption in progress</li><li><strong>Data Readiness:</strong> Rich patient scheduling data; diagnostic imaging data needs governance improvements</li><li><strong>Regulatory Landscape:</strong> HIPAA and NHS Digital compliance requirements must shape all AI deployments</li></ul><h2>Recommendations</h2><ol><li>Start with predictive scheduling as lowest-risk, highest-impact pilot</li><li>Establish clinical AI data governance before diagnostic AI exploration</li><li>Design clinician-focused AI training programme</li></ol>',
        version: 1,
        status: 'approved',
        lastModified: '2025-11-28',
        createdBy: 'Alex Morgan',
    },
    {
        id: 'sd-c2-2',
        clientId: 'c2',
        title: 'Healthcare AI Strategy — NovaCare (Draft)',
        type: 'ai_strategy',
        content: '<h1>NovaCare Healthcare AI Strategy</h1><h2>Vision</h2><p>To enhance patient outcomes and operational efficiency through responsible AI adoption, starting with scheduling optimisation and administrative automation.</p><h2>Strategic Pillars</h2><ol><li><strong>Patient Experience:</strong> Predictive scheduling to reduce wait times and no-shows</li><li><strong>Clinical Support:</strong> AI-assisted diagnostics decision support (Phase 2)</li><li><strong>Operational Efficiency:</strong> Automate administrative burden to free clinical time</li><li><strong>Responsible Healthcare AI:</strong> Patient safety-first approach to all AI deployments</li></ol>',
        version: 1,
        status: 'draft',
        lastModified: '2026-01-15',
        createdBy: 'Alex Morgan',
    },
    // Atlas Manufacturing (c3) — early stage, limited docs
    {
        id: 'sd-c3-1',
        clientId: 'c3',
        title: 'AI Opportunity Scan — Atlas Manufacturing (In Progress)',
        type: 'ai_strategy',
        content: '<h1>AI Opportunity Scan — Atlas Manufacturing</h1><h2>Engagement Overview</h2><p>This document captures the initial findings from the Discovery phase for Atlas Manufacturing Co. The engagement is focused on identifying high-value AI opportunities across production, supply chain, and quality control.</p><h2>Preliminary Findings</h2><ul><li><strong>Predictive Maintenance:</strong> Significant opportunity — 3 production lines with IoT sensor infrastructure already in place</li><li><strong>Supply Chain:</strong> Complex multi-supplier network; ML forecasting could reduce inventory costs by 15-20%</li><li><strong>Quality Control:</strong> Manual inspection processes ripe for computer vision automation</li></ul><p><em>Full report in progress — pending plant tours and data infrastructure review.</em></p>',
        version: 1,
        status: 'draft',
        lastModified: '2026-01-25',
        createdBy: 'Alex Morgan',
    },
];

// ===== USE CASES =====
export const useCases: UseCase[] = [
    // Meridian Financial Group (c1)
    { id: 'uc-c1-1', clientId: 'c1', title: 'AI-Powered Fraud Detection', description: 'Real-time ML models to flag suspicious transactions across payment and trading systems.', department: 'Risk & Compliance', industry: 'Financial Services', complexity: 'high', impact: 9, effort: 8, status: 'approved', tags: ['ML', 'real-time', 'fraud'] },
    { id: 'uc-c1-2', clientId: 'c1', title: 'Automated Compliance Reporting', description: 'NLP to extract and summarise regulatory requirements from FCA and PRA publications.', department: 'Legal', industry: 'Financial Services', complexity: 'medium', impact: 7, effort: 5, status: 'approved', tags: ['NLP', 'compliance', 'automation'] },
    { id: 'uc-c1-3', clientId: 'c1', title: 'Customer Onboarding Assistant', description: 'Conversational AI for streamlined KYC verification and account setup.', department: 'Customer Service', industry: 'Financial Services', complexity: 'medium', impact: 8, effort: 6, status: 'evaluated', tags: ['chatbot', 'onboarding', 'KYC'] },
    { id: 'uc-c1-4', clientId: 'c1', title: 'Microsoft Copilot Rollout', description: 'Organisation-wide deployment of Microsoft Copilot for productivity enhancement.', department: 'All Departments', industry: 'Financial Services', complexity: 'low', impact: 6, effort: 2, status: 'in_progress', tags: ['copilot', 'productivity', 'quick-win'] },
    { id: 'uc-c1-5', clientId: 'c1', title: 'Credit Risk Scoring Enhancement', description: 'ML models to enhance credit risk assessment beyond traditional scoring methods.', department: 'Risk & Compliance', industry: 'Financial Services', complexity: 'high', impact: 8, effort: 7, status: 'identified', tags: ['ML', 'risk', 'credit'] },
    // NovaCare Health Systems (c2)
    { id: 'uc-c2-1', clientId: 'c2', title: 'Predictive Patient Scheduling', description: 'ML models to optimise appointment scheduling and reduce no-shows by 30%.', department: 'Operations', industry: 'Healthcare', complexity: 'medium', impact: 8, effort: 4, status: 'approved', tags: ['scheduling', 'prediction', 'healthcare'] },
    { id: 'uc-c2-2', clientId: 'c2', title: 'AI-Assisted Diagnostics Support', description: 'Clinical decision support system providing diagnostic suggestions based on patient history and imaging.', department: 'Clinical', industry: 'Healthcare', complexity: 'high', impact: 9, effort: 9, status: 'identified', tags: ['diagnostics', 'clinical', 'ML'] },
    { id: 'uc-c2-3', clientId: 'c2', title: 'Administrative Automation', description: 'Automate patient intake forms, referral processing, and discharge summaries using NLP.', department: 'Administration', industry: 'Healthcare', complexity: 'low', impact: 7, effort: 3, status: 'evaluated', tags: ['NLP', 'admin', 'automation'] },
    { id: 'uc-c2-4', clientId: 'c2', title: 'Patient Communication Bot', description: 'Automated appointment reminders, post-visit follow-ups, and FAQ handling via conversational AI.', department: 'Patient Services', industry: 'Healthcare', complexity: 'medium', impact: 7, effort: 5, status: 'identified', tags: ['chatbot', 'patient', 'communications'] },
    // Atlas Manufacturing Co. (c3)
    { id: 'uc-c3-1', clientId: 'c3', title: 'Predictive Maintenance', description: 'IoT sensor data + ML for equipment failure prediction across 3 production lines.', department: 'Production', industry: 'Manufacturing', complexity: 'high', impact: 9, effort: 7, status: 'identified', tags: ['IoT', 'ML', 'maintenance'] },
    { id: 'uc-c3-2', clientId: 'c3', title: 'Supply Chain Optimisation', description: 'ML forecasting for demand prediction, inventory optimisation, and supplier risk assessment.', department: 'Supply Chain', industry: 'Manufacturing', complexity: 'high', impact: 8, effort: 8, status: 'identified', tags: ['supply-chain', 'forecasting', 'optimisation'] },
    { id: 'uc-c3-3', clientId: 'c3', title: 'Computer Vision Quality Control', description: 'Automated visual inspection using computer vision to replace manual quality checks.', department: 'Quality', industry: 'Manufacturing', complexity: 'medium', impact: 8, effort: 6, status: 'identified', tags: ['computer-vision', 'quality', 'inspection'] },
    { id: 'uc-c3-4', clientId: 'c3', title: 'Energy Consumption Optimisation', description: 'ML-driven energy management to reduce production line power consumption by 10-15%.', department: 'Facilities', industry: 'Manufacturing', complexity: 'medium', impact: 6, effort: 4, status: 'identified', tags: ['energy', 'sustainability', 'ML'] },
];

// ===== PHASE TEMPLATES (for Add Client modal) =====
export const phaseTemplates = [
    {
        key: 'discovery',
        title: 'Discovery & Foundation',
        subtitle: 'Assess current AI readiness, gather stakeholder insights, and establish a baseline',
        services: [
            'Leadership Interviews',
            'AI Readiness Survey',
            'Stakeholder Discovery Workshops',
            'Technology & Data Landscape Review',
        ],
    },
    {
        key: 'strategy',
        title: 'Strategy & Roadmap Development',
        subtitle: 'Develop AI strategy, internal policy framework, and prioritised use case roadmap',
        services: [
            'AI Strategy Development',
            'Internal AI Usage Policy',
            'Use Case Prioritisation',
            'C-Suite Alignment Workshop',
        ],
    },
    {
        key: 'pilot',
        title: 'Pilot & Implementation Planning',
        subtitle: 'Define pilot projects, build change management plan, and design education programme',
        services: [
            'Pilot Scoping',
            'Change Management Planning',
            'Education Programme Design',
            'Leadership Workshops',
        ],
    },
    {
        key: 'execution',
        title: 'Execution & Governance',
        subtitle: 'Launch pilots, establish AI governance committee, and roll out education programme',
        services: [
            'Pilot Execution Support',
            'AI Governance Setup',
            'Training Delivery',
            'Performance Monitoring',
        ],
    },
];

// ===== DASHBOARD METRICS =====
export const dashboardMetrics: DashboardMetrics = {
    activeClients: 3,
    ongoingProjects: 3,
    surveysCompleted: 127,
    workshopsDelivered: 8,
    documentsCreated: 24,
    avgClientSatisfaction: 4.6,
};
