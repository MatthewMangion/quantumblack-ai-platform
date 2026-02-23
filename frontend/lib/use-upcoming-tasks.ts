import { useMemo } from 'react';
import { useClients } from '@/lib/client-context';
import { projects, workshops } from '@/lib/mock-data';

export type TaskUrgency = 'overdue' | 'soon' | 'upcoming';

export interface UpcomingTask {
    id: string;
    type: 'deliverable' | 'milestone' | 'workshop';
    title: string;
    dueDate: string; // YYYY-MM-DD
    clientName?: string;
    phaseName?: string;
    urgency: TaskUrgency;
    daysFromNow: number;
}

function getUrgency(daysFromNow: number): TaskUrgency {
    if (daysFromNow < 0) return 'overdue';
    if (daysFromNow < 7) return 'soon';
    return 'upcoming';
}

function daysDiff(dateStr: string, today: Date): number {
    const due = new Date(dateStr);
    due.setHours(0, 0, 0, 0);
    const t = new Date(today);
    t.setHours(0, 0, 0, 0);
    return Math.round((due.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
}

export function useUpcomingTasks(limit = 8): UpcomingTask[] {
    const { allClients, allPhases } = useClients();

    return useMemo(() => {
        const today = new Date();
        const tasks: UpcomingTask[] = [];

        // --- Deliverables from engagement phases ---
        for (const phase of allPhases) {
            const client = allClients.find(c => c.id === phase.clientId);
            for (const deliverable of phase.deliverables) {
                if (
                    deliverable.status === 'delivered' ||
                    deliverable.status === 'not_included'
                ) continue;

                const daysFromNow = daysDiff(deliverable.dueDate, today);
                tasks.push({
                    id: `d-${deliverable.id}`,
                    type: 'deliverable',
                    title: deliverable.title,
                    dueDate: deliverable.dueDate,
                    clientName: client?.name,
                    phaseName: phase.title,
                    urgency: getUrgency(daysFromNow),
                    daysFromNow,
                });
            }
        }

        // --- Milestones from projects ---
        for (const project of projects) {
            const client = allClients.find(c => c.id === project.clientId);
            for (const milestone of project.milestones) {
                if (milestone.completed) continue;

                const daysFromNow = daysDiff(milestone.dueDate, today);
                tasks.push({
                    id: `m-${milestone.id}`,
                    type: 'milestone',
                    title: milestone.title,
                    dueDate: milestone.dueDate,
                    clientName: client?.name,
                    phaseName: project.name,
                    urgency: getUrgency(daysFromNow),
                    daysFromNow,
                });
            }
        }

        // --- Upcoming workshops ---
        for (const workshop of workshops) {
            if (workshop.status !== 'upcoming') continue;

            const daysFromNow = daysDiff(workshop.date, today);
            tasks.push({
                id: `w-${workshop.id}`,
                type: 'workshop',
                title: workshop.title,
                dueDate: workshop.date,
                phaseName: workshop.category,
                urgency: getUrgency(daysFromNow),
                daysFromNow,
            });
        }

        // Sort ascending by dueDate (overdue first, then soonest first)
        tasks.sort((a, b) => a.daysFromNow - b.daysFromNow);

        return tasks.slice(0, limit);
    }, [allClients, allPhases]);
}
