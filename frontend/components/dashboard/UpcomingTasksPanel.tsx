'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUpcomingTasks, type UpcomingTask } from '@/lib/use-upcoming-tasks';
import { Package, Milestone, GraduationCap, AlertCircle, Clock, CalendarCheck } from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

function relativeLabel(daysFromNow: number): string {
    if (daysFromNow === 0) return 'Today';
    if (daysFromNow === 1) return 'Tomorrow';
    if (daysFromNow === -1) return '1 day overdue';
    if (daysFromNow < 0) return `${Math.abs(daysFromNow)} days overdue`;
    return `in ${daysFromNow} days`;
}

const urgencyStyles = {
    overdue: {
        dot: 'bg-red-500',
        chip: 'bg-red-500/10 text-red-400 border-red-500/20',
        border: 'border-l-red-500',
    },
    soon: {
        dot: 'bg-amber-400',
        chip: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
        border: 'border-l-amber-400',
    },
    upcoming: {
        dot: 'bg-emerald-500',
        chip: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        border: 'border-l-emerald-500',
    },
} as const;

const typeConfig: Record<
    UpcomingTask['type'],
    { label: string; Icon: React.ElementType; href: string; color: string }
> = {
    deliverable: { label: 'Deliverable', Icon: Package, href: '/strategy', color: 'text-sky-400' },
    milestone: { label: 'Milestone', Icon: Milestone, href: '/strategy', color: 'text-violet-400' },
    workshop: { label: 'Workshop', Icon: GraduationCap, href: '/workshops', color: 'text-amber-400' },
};

// ── row ───────────────────────────────────────────────────────────────────────

function TaskRow({ task, onClick }: { task: UpcomingTask; onClick: () => void }) {
    const u = urgencyStyles[task.urgency];
    const t = typeConfig[task.type];

    return (
        <button
            onClick={onClick}
            className={`w-full text-left flex items-start gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 border-l-2 ${u.border} hover:bg-neutral-800/70 transition-all group`}
        >
            {/* Type icon */}
            <div className="mt-0.5 flex-shrink-0">
                <t.Icon className={`w-4 h-4 ${t.color}`} />
            </div>

            {/* Detail */}
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate leading-snug">{task.title}</p>
                <p className="text-[10px] text-neutral-500 mt-0.5 truncate">
                    {task.clientName ? `${task.clientName} · ` : ''}{task.phaseName ?? t.label}
                </p>
            </div>

            {/* Urgency chip */}
            <span
                className={`flex-shrink-0 text-[9px] font-bold border rounded-full px-2 py-0.5 uppercase tracking-wider whitespace-nowrap ${u.chip}`}
            >
                {relativeLabel(task.daysFromNow)}
            </span>
        </button>
    );
}

// ── panel ─────────────────────────────────────────────────────────────────────

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
};

export default function UpcomingTasksPanel() {
    const tasks = useUpcomingTasks(8);
    const router = useRouter();

    const overdueCount = tasks.filter(t => t.urgency === 'overdue').length;

    return (
        <motion.div
            className="glass-card p-6 space-y-4"
            {...fadeIn}
            transition={{ delay: 0.35 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="dot-indicator" />
                    Upcoming Tasks
                </h3>
                {overdueCount > 0 && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-2 py-0.5">
                        <AlertCircle className="w-3 h-3" />
                        {overdueCount} overdue
                    </span>
                )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-neutral-600">
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />Overdue</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />&lt;7 days</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />Upcoming</span>
            </div>

            {/* Task List */}
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <CalendarCheck className="w-8 h-8 text-emerald-500/40 mb-2" />
                    <p className="text-xs font-semibold text-neutral-400">All clear!</p>
                    <p className="text-[10px] text-neutral-600 mt-0.5">No upcoming tasks due soon.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {tasks.map((task) => (
                        <TaskRow
                            key={task.id}
                            task={task}
                            onClick={() => router.push(typeConfig[task.type].href)}
                        />
                    ))}
                </div>
            )}

            {/* Footer */}
            <button
                onClick={() => router.push('/strategy')}
                className="w-full flex items-center justify-center gap-1.5 text-[10px] font-semibold text-neutral-500 hover:text-emerald-400 transition-colors pt-1"
            >
                <Clock className="w-3 h-3" />
                View all in Strategy
            </button>
        </motion.div>
    );
}
