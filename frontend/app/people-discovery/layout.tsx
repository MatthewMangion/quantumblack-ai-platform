import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'People Discovery',
    description: 'AI readiness surveys, analytics, and workforce insights.',
};

export default function PeopleDiscoveryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
