import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Workshops & Training',
    description: 'Schedule, manage, and track AI training programmes.',
};

export default function WorkshopsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
