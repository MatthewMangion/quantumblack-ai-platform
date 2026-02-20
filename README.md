
# SeyAI AI Advisory Platform

An internal web application built for AI consulting teams to manage client engagements, track project delivery, conduct organisational AI readiness assessments, develop strategy documents, and coordinate training workshops — all from a single unified platform.

## What This Platform Does

The SeyAI AI Advisory Platform is a **client engagement management system** designed for AI strategy consultants. It provides a structured workflow that guides consulting teams through the full lifecycle of an AI advisory engagement — from initial discovery through to execution and governance.

### Dashboard

The main dashboard provides an at-a-glance overview of the practice:

- **Key metrics** — active clients, ongoing projects, surveys completed, workshops delivered, documents created, and average client satisfaction
- **Active projects** — progress tracking with milestone completion and phase indicators
- **Recent activity feed** — timeline of milestones hit, documents uploaded, surveys launched, and client feedback
- **Quick actions** — shortcuts for common tasks like uploading documents, starting surveys, booking workshops, or onboarding new clients

### Client Workspaces

Each client gets a dedicated workspace containing:

- **Client profile** — industry, organisation size, key contacts, and strategic goals
- **Engagement phases** — a structured 4-phase engagement model (Discovery, Strategy, Pilot Planning, Execution) with activities, deliverables, timelines, and investment tracking per phase
- **Project timeline** — visual milestone tracker showing progress through the engagement
- **Document library** — upload, download, and manage client-specific files (deliverables, meeting notes, reports, templates)

New clients can be onboarded through a modal that captures company details, contacts, strategic goals, and allows consultants to select which engagement phases to include.

### People Discovery

A survey and analytics module for assessing organisational AI readiness:

- **Survey builder** — create surveys with Likert scales, multiple choice, yes/no, and open text questions across categories like AI Literacy, Current Usage, Readiness, and Risk Perception
- **Analytics dashboard** — visualise survey results with bar charts (readiness by department), radar charts (category scores), and summary statistics
- **Department breakdown** — compare AI readiness across Engineering, Marketing, Sales, Finance, HR, Operations, Legal, and Executive teams

### Strategy & Deliverables

A workspace for creating and managing strategy documents and use cases:

- **Strategy documents** — rich text documents including AI Readiness Reports, AI Strategy documents, Usage Policies, Education Plans, and Use Case Roadmaps, with version tracking and approval workflows (Draft, Review, Approved)
- **Use case management** — catalogue and prioritise AI use cases with impact/effort scoring, complexity ratings, department assignment, and status tracking (Identified, Evaluated, Approved, In Progress, Completed)
- **Engagement phase tracker** — detailed view of each engagement phase showing activities, deliverables, key services, progress, and status with interactive status updates

### Workshops & Training

A module for scheduling and managing AI training programmes:

- **Workshop catalogue** — browse upcoming, in-progress, and completed workshops across categories (Leadership, Technical, Governance, Department-specific)
- **Session details** — capacity tracking, instructor assignment, duration, and scheduling
- **Attendee management** — enrolment tracking, attendance records, and feedback scores

## Example Clients

The platform comes pre-loaded with three demo client engagements that illustrate different stages of the advisory lifecycle:

| Client | Industry | Phase | Description |
|--------|----------|-------|-------------|
| Meridian Financial Group | Financial Services | Strategy | AI strategy for fraud detection, compliance automation, and customer onboarding |
| NovaCare Health Systems | Healthcare | Assessment | Discovery and readiness assessment for predictive scheduling and clinical AI |
| Atlas Manufacturing Co. | Manufacturing | Discovery | Opportunity scan for predictive maintenance, supply chain, and quality control |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router and Turbopack
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS 4, Framer Motion
- **Charts**: Recharts
- **Rich Text**: Tiptap editor
- **Icons**: Lucide React
- **State Management**: React Context (client data, sidebar, toast notifications)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev -- -p 8080
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
  app/
    page.tsx                    # Dashboard
    layout.tsx                  # Root layout with providers
    clients/page.tsx            # Client workspaces
    people-discovery/page.tsx   # Survey analytics & builder
    strategy/page.tsx           # Strategy docs & use cases
    workshops/page.tsx          # Training management
  components/
    layout/
      Sidebar.tsx               # Navigation sidebar
      TopBar.tsx                # Page header bar
      MainContent.tsx           # Content wrapper
    AddClientModal.tsx          # New client onboarding form
    DocumentUploadModal.tsx     # File upload dialog
  lib/
    types.ts                    # TypeScript type definitions
    mock-data.ts                # Demo data for all modules
    client-context.tsx          # Client state management
    sidebar-context.tsx         # Sidebar collapse state
    toast-context.tsx           # Toast notification system
```
