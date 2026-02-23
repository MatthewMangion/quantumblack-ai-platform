import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Client Workspaces',
    description: 'Manage client engagements, documents, and deliverables.',
};

export default function ClientsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
