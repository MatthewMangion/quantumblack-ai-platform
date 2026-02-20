'use client';

import TopBar from '@/components/layout/TopBar';
import { useToast } from '@/lib/toast-context';
import { workshops } from '@/lib/mock-data';
import {
    Plus,
    Calendar,
    Clock,
    Users,
    Star,
    CheckCircle2,
    ChevronRight,
    GraduationCap,
    PlayCircle,
    Award,
    Filter
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig: Record<string, { color: string, bg: string, label: string }> = {
    upcoming: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', label: 'Upcoming' },
    in_progress: { color: '#059669', bg: 'rgba(5, 150, 105, 0.12)', label: 'In Progress' },
    completed: { color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', label: 'Completed' },
    cancelled: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', label: 'Cancelled' },
};

const categoryColors: Record<string, string> = {
    Leadership: '#10b981',
    Technical: '#059669',
    Governance: '#047857',
    Department: '#f59e0b',
};

export default function WorkshopsPage() {
    const { toast } = useToast();
    const [selectedWorkshop, setSelectedWorkshop] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('all');
    const [showAdvFilter, setShowAdvFilter] = useState(false);

    const activeWorkshop = workshops.find(w => w.id === selectedWorkshop);
    const filteredWorkshops = filter === 'all' ? workshops : workshops.filter(w => w.status === filter);

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title="Workshop & Training"
                subtitle="Schedule, manage, and track AI training programmes"
                actions={
                    <button className="btn-primary" onClick={() => toast('Workshop creation coming soon')}>
                        <Plus className="w-4 h-4" />
                        Create Workshop
                    </button>
                }
            />

            <main className="flex-1 p-8 space-y-6">
                {!selectedWorkshop ? (
                    <>
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Workshops', value: workshops.length, icon: GraduationCap, color: '#10b981' },
                                { label: 'Upcoming Sessions', value: workshops.filter(w => w.status === 'upcoming').length, icon: Calendar, color: '#10b981' },
                                { label: 'Completed', value: workshops.filter(w => w.status === 'completed').length, icon: CheckCircle2, color: '#10b981' },
                                { label: 'Total Enrolled', value: workshops.reduce((sum, w) => sum + w.enrolled, 0), icon: Users, color: '#10b981' },
                            ].map((m) => (
                                <div key={m.label} className="glass-card p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                                            style={{ background: `${m.color}15`, border: `1px solid ${m.color}20`, color: m.color }}
                                        >
                                            <m.icon className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{m.value}</p>
                                    <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">{m.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Filter Bar */}
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                {['all', 'upcoming', 'in_progress', 'completed', 'cancelled'].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${filter === f
                                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                                                : 'text-neutral-600 border-transparent hover:text-neutral-400'
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowAdvFilter(f => !f)} className="btn-secondary text-[10px] py-1.5"><Filter className="w-3 h-3" /> Advanced Filter</button>
                        </div>

                        <AnimatePresence>
                            {showAdvFilter && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="glass-card p-4 flex items-center gap-3 overflow-hidden"
                                >
                                    <span className="text-xs font-medium text-neutral-500">Category:</span>
                                    {['All', 'Leadership', 'Technical', 'Governance', 'Department'].map(c => (
                                        <button key={c} className="text-xs px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-all">
                                            {c}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Workshop List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredWorkshops.map((workshop) => {
                                const status = statusConfig[workshop.status];
                                const catColor = categoryColors[workshop.category] || '#10b981';
                                const enrolledPct = (workshop.enrolled / workshop.capacity) * 100;

                                return (
                                    <motion.div
                                        key={workshop.id}
                                        layoutId={workshop.id}
                                        onClick={() => setSelectedWorkshop(workshop.id)}
                                        className="glass-card p-6 group cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex gap-2">
                                                <span className="badge" style={{ background: status.bg, color: status.color, borderColor: `${status.color}20` }}>{status.label}</span>
                                                <span className="badge" style={{ background: `${catColor}10`, color: catColor, borderColor: `${catColor}20` }}>{workshop.category}</span>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-1 transition-all" />
                                        </div>

                                        <h3 className="text-base font-bold text-white mb-2 leading-tight">{workshop.title}</h3>
                                        <p className="text-xs text-neutral-500 line-clamp-2 mb-6">{workshop.description}</p>

                                        <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>{workshop.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>{workshop.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>{workshop.instructor}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Award className="w-3.5 h-3.5 text-emerald-400" />
                                                <span>{workshop.enrolled}/{workshop.capacity} Enrolled</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${enrolledPct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${enrolledPct}%` }} />
                                            </div>
                                            <p className="text-[9px] text-neutral-700 text-right font-bold uppercase tracking-tighter">{Math.round(enrolledPct)}% Capacity Reached</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </>
                ) : activeWorkshop ? (
                    /* Workshop Detail View */
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                        <button
                            onClick={() => setSelectedWorkshop(null)}
                            className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            ← Back to Workshops
                        </button>

                        <div className="glass-card p-8">
                            <div className="flex items-start justify-between mb-8">
                                <div>
                                    <div className="flex gap-2 mb-3">
                                        <span className="badge" style={{ background: statusConfig[activeWorkshop.status].bg, color: statusConfig[activeWorkshop.status].color }}>{statusConfig[activeWorkshop.status].label}</span>
                                        <span className="badge" style={{ background: `${categoryColors[activeWorkshop.category]}10`, color: categoryColors[activeWorkshop.category] }}>{activeWorkshop.category}</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white tracking-tight">{activeWorkshop?.title}</h2>
                                    <p className="text-sm text-neutral-500 mt-2 max-w-2xl">{activeWorkshop?.description}</p>
                                </div>
                                <button className="btn-primary" onClick={() => toast(`Session started: ${activeWorkshop?.title}`)}>
                                    <PlayCircle className="w-4 h-4" /> Start Session
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-neutral-800">
                                {[
                                    { label: 'Schedule', value: activeWorkshop?.date, icon: Calendar },
                                    { label: 'Duration', value: activeWorkshop?.duration, icon: Clock },
                                    { label: 'Instructor', value: activeWorkshop?.instructor, icon: Users },
                                    { label: 'Capacity', value: `${activeWorkshop?.enrolled}/${activeWorkshop?.capacity}`, icon: Award },
                                ].map(stat => (
                                    <div key={stat.label}>
                                        <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                            <stat.icon className="w-3 h-3 text-emerald-400" /> {stat.label}
                                        </p>
                                        <p className="text-sm text-white font-semibold">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-8">
                                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                                    <span className="dot-indicator" />
                                    Attendance Tracker
                                </h3>
                                <div className="glass-card overflow-hidden bg-transparent border-neutral-800">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest border-b border-neutral-800">
                                                <th className="px-6 py-4">Participant</th>
                                                <th className="px-6 py-4">Department</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Feedback</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-800/50">
                                            {activeWorkshop?.attendees.map(attendee => (
                                                <tr key={attendee.id} className="hover:bg-neutral-800/30">
                                                    <td className="px-6 py-4">
                                                        <p className="text-xs font-semibold text-white">{attendee.name}</p>
                                                        <p className="text-[10px] text-neutral-600">{attendee.email}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-neutral-500">{attendee.department}</td>
                                                    <td className="px-6 py-4">
                                                        <div className={`w-2 h-2 rounded-full ${attendee.attended ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-neutral-700'}`} />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {attendee.feedbackScore ? (
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                                                                <Star className="w-3 h-3 fill-current" /> {attendee.feedbackScore}
                                                            </div>
                                                        ) : <span className="text-[10px] text-neutral-700 font-bold uppercase">—</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </main>
        </div>
    );
}