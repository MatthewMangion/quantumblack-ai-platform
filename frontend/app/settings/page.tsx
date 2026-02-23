'use client';

import TopBar from '@/components/layout/TopBar';
import { useToast } from '@/lib/toast-context';
import { useTheme } from '@/lib/theme-context';
import { useSidebar } from '@/lib/sidebar-context';
import { User, Bell, Shield, Palette, Moon, Sun, Monitor } from 'lucide-react';
import { useState } from 'react';

type ThemeOption = 'dark' | 'light' | 'system';

function ThemeButton({ value, current, label, icon: Icon, onClick }: {
    value: ThemeOption; current: ThemeOption; label: string; icon: typeof Moon; onClick: () => void;
}) {
    const active = value === current;
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'text-neutral-500 hover:text-neutral-200 bg-neutral-900 border border-neutral-800 hover:border-neutral-700'
            }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
}

function ToggleSwitch({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <button
            role="switch"
            aria-checked={enabled}
            aria-label={label}
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex items-center w-10 h-[22px] rounded-full transition-colors ${enabled ? 'bg-emerald-600' : 'bg-neutral-700'}`}
        >
            <span className={`inline-block w-[18px] h-[18px] bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
        </button>
    );
}

export default function SettingsPage() {
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const { collapsed, toggleCollapsed } = useSidebar();

    // Notification preferences (persisted in localStorage)
    const [emailNotifs, setEmailNotifs] = useState(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('qb-notif-email') !== 'false';
    });
    const [projectUpdates, setProjectUpdates] = useState(() => {
        if (typeof window === 'undefined') return true;
        return localStorage.getItem('qb-notif-projects') !== 'false';
    });
    const [weeklyDigest, setWeeklyDigest] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('qb-notif-digest') === 'true';
    });

    const saveNotifPref = (key: string, value: boolean, setter: (v: boolean) => void) => {
        setter(value);
        localStorage.setItem(key, String(value));
        toast('Notification preference saved');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title="Settings"
                subtitle="Manage your account and platform preferences"
            />

            <main className="flex-1 p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Profile */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Profile</h3>
                                <p className="text-[10px] text-neutral-500">Manage your personal information</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Display Name', value: 'Alex Morgan' },
                                { label: 'Email', value: 'alex.morgan@quantumblack.com' },
                                { label: 'Role', value: 'Consultant' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                                    <span className="text-xs text-neutral-500">{item.label}</span>
                                    <span className="text-xs text-white font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Bell className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Notifications</h3>
                                <p className="text-[10px] text-neutral-500">Configure how you receive alerts</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-white font-medium">Email Notifications</p>
                                    <p className="text-[10px] text-neutral-500">Receive updates via email</p>
                                </div>
                                <ToggleSwitch enabled={emailNotifs} onChange={(v) => saveNotifPref('qb-notif-email', v, setEmailNotifs)} label="Email notifications" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-white font-medium">Project Updates</p>
                                    <p className="text-[10px] text-neutral-500">Get notified on project changes</p>
                                </div>
                                <ToggleSwitch enabled={projectUpdates} onChange={(v) => saveNotifPref('qb-notif-projects', v, setProjectUpdates)} label="Project updates" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-white font-medium">Weekly Digest</p>
                                    <p className="text-[10px] text-neutral-500">Summary email every Monday</p>
                                </div>
                                <ToggleSwitch enabled={weeklyDigest} onChange={(v) => saveNotifPref('qb-notif-digest', v, setWeeklyDigest)} label="Weekly digest" />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Shield className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Security</h3>
                                <p className="text-[10px] text-neutral-500">Authentication and access controls</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Two-Factor Auth', value: 'Enabled' },
                                { label: 'Session Timeout', value: '30 minutes' },
                                { label: 'Last Login', value: 'Today, 09:15 AM' },
                            ].map(item => (
                                <div key={item.label} className="flex items-center justify-between py-2 border-b border-neutral-800 last:border-0">
                                    <span className="text-xs text-neutral-500">{item.label}</span>
                                    <span className="text-xs text-white font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Appearance */}
                    <div className="glass-card p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Palette className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Appearance</h3>
                                <p className="text-[10px] text-neutral-500">Customize the look and feel</p>
                            </div>
                        </div>
                        <div className="space-y-5">
                            {/* Theme Selector */}
                            <div>
                                <p className="text-xs text-neutral-500 mb-2 font-medium">Theme</p>
                                <div className="flex gap-2">
                                    <ThemeButton value="dark" current={theme} label="Dark" icon={Moon} onClick={() => { setTheme('dark'); toast('Theme set to Dark'); }} />
                                    <ThemeButton value="light" current={theme} label="Light" icon={Sun} onClick={() => { setTheme('light'); toast('Theme set to Light'); }} />
                                    <ThemeButton value="system" current={theme} label="System" icon={Monitor} onClick={() => { setTheme('system'); toast('Theme follows system preference'); }} />
                                </div>
                            </div>

                            {/* Sidebar Toggle */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-white font-medium">Compact Sidebar</p>
                                    <p className="text-[10px] text-neutral-500">Collapse sidebar to icons only</p>
                                </div>
                                <ToggleSwitch enabled={collapsed} onChange={toggleCollapsed} label="Compact sidebar" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
