import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Settings',
    description: 'Manage your account, notifications, and platform preferences.',
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
