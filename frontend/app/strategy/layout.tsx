import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Strategy & Engagement',
    description: 'AI strategy roadmap, deliverables, use cases, and documents.',
};

export default function StrategyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
