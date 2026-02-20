'use client';

import TopBar from '@/components/layout/TopBar';
import { useToast } from '@/lib/toast-context';
import { surveyQuestions, surveyResponses } from '@/lib/mock-data';
import {
    Users,
    BarChart4,
    Radar as RadarIcon,
    PieChart,
    Settings2,
    Plus,
    Send,
    CheckCircle2,
    TrendingUp,
    BrainCircuit
} from 'lucide-react';
import { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Cell
} from 'recharts';
import { motion } from 'framer-motion';

type TabType = 'dashboard' | 'builder';

export default function PeopleDiscoveryPage() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const { toast } = useToast();

    // Calculate stats from responses
    const stats = useMemo(() => {
        const departments = Array.from(new Set(surveyResponses.map(r => r.department)));
        const avgReadiness = surveyResponses.length > 0
            ? surveyResponses.reduce((acc, r) => acc + (r.answers.sq4 as number || 0), 0) / surveyResponses.length
            : 0;

        // Readiness by department for bar chart
        const readinessData = departments.map(dept => {
            const deptResponses = surveyResponses.filter(r => r.department === dept);
            const score = deptResponses.reduce((acc, r) => acc + (r.answers.sq4 as number || 0), 0) / deptResponses.length;
            return { name: dept, score: parseFloat(score.toFixed(1)) };
        }).sort((a, b) => b.score - a.score);

        // Radar chart data (mocking literacy/training interest/risk awareness/readiness)
        const radarData = [
            { subject: 'AI Literacy', A: 3.2, fullMark: 5 },
            { subject: 'Readiness', A: avgReadiness, fullMark: 5 },
            { subject: 'Risk Awareness', A: 4.1, fullMark: 5 },
            { subject: 'Training Interest', A: 4.5, fullMark: 5 },
        ];

        const deptResponseCounts = Object.fromEntries(
            departments.map(dept => [dept, surveyResponses.filter(r => r.department === dept).length])
        );

        return {
            totalResponses: surveyResponses.length,
            avgReadiness: avgReadiness.toFixed(1),
            readinessData,
            radarData,
            deptCount: departments.length,
            deptResponseCounts
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <TopBar
                title="People Discovery"
                subtitle="AI readiness surveys and stakeholder insights"
                actions={
                    <button className="btn-primary" onClick={() => toast('Survey deployed successfully')}>
                        <Send className="w-4 h-4" />
                        Deploy Survey
                    </button>
                }
            />

            <main className="flex-1 p-8 space-y-8">
                {/* Navigation Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 w-fit">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'text-neutral-500 hover:text-white border border-transparent'
                            }`}
                    >
                        <BarChart4 className="w-4 h-4" /> Survey Results
                    </button>
                    <button
                        onClick={() => setActiveTab('builder')}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'builder'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                                : 'text-neutral-500 hover:text-white border border-transparent'
                            }`}
                    >
                        <Plus className="w-4 h-4" /> Survey Builder
                    </button>
                </div>

                {activeTab === 'dashboard' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                        {/* KPI Row */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Responses', value: stats.totalResponses, icon: Users, color: '#10b981' },
                                { label: 'Response Rate', value: `${Math.round((stats.totalResponses / 150) * 100)}%`, icon: TrendingUp, color: '#10b981' },
                                { label: 'Departments', value: stats.deptCount, icon: BrainCircuit, color: '#10b981' },
                                { label: 'Avg. Readiness', value: `${stats.avgReadiness}/5`, icon: BarChart4, color: '#10b981' },
                            ].map((m) => (
                                <div key={m.label} className="glass-card p-5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-800 border border-neutral-700">
                                            <m.icon className="w-4 h-4" style={{ color: m.color }} />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold text-white">{m.value}</p>
                                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{m.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* Bar Chart */}
                            <div className="lg:col-span-3 glass-card p-6">
                                <h3 className="text-sm font-bold mb-8 tracking-tight uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                                    <span className="dot-indicator" />
                                    Readiness by Department
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart layout="vertical" data={stats.readinessData} margin={{ left: 20 }}>
                                            <XAxis type="number" hide domain={[0, 5]} />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#737373', fontSize: 11, fontWeight: 500 }}
                                                width={80}
                                            />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                                contentStyle={{ background: '#111111', border: '1px solid #1c1c1c', borderRadius: '12px', fontSize: '11px' }}
                                            />
                                            <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                                                {stats.readinessData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#10b981', '#059669', '#047857', '#34d399', '#6ee7b7'][index % 5]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Radar Chart */}
                            <div className="lg:col-span-2 glass-card p-6">
                                <h3 className="text-sm font-bold mb-8 tracking-tight uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                                    <span className="dot-indicator" />
                                    Organisation-Wide Readiness
                                </h3>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radarData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#737373', fontSize: 10, fontWeight: 500 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 5]} hide />
                                            <Radar
                                                name="Organisation"
                                                dataKey="A"
                                                stroke="#10b981"
                                                fill="#10b981"
                                                fillOpacity={0.2}
                                            />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Department Table */}
                        <div className="glass-card overflow-hidden">
                            <div className="px-6 py-4 border-b border-neutral-800">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <span className="dot-indicator" />
                                    Department Breakdown
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest border-b border-neutral-800">
                                            <th className="px-6 py-4">Department</th>
                                            <th className="px-6 py-4">Responses</th>
                                            <th className="px-6 py-4">Readiness Score</th>
                                            <th className="px-6 py-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {stats.readinessData.map((dept) => (
                                            <tr key={dept.name} className="hover:bg-neutral-800/30 transition-colors">
                                                <td className="px-6 py-4 text-xs font-semibold text-white">{dept.name}</td>
                                                <td className="px-6 py-4 text-xs text-neutral-500">{stats.deptResponseCounts[dept.name] || 0}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs font-bold text-white">{dept.score}</span>
                                                        <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-emerald-500" style={{ width: `${dept.score / 5 * 100}%` }} />
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`badge ${dept.score > 4 ? 'badge-success' : dept.score > 2 ? 'badge-info' : 'badge-warning'}`}>
                                                        {dept.score > 4 ? 'High' : dept.score > 2 ? 'Moderate' : 'Low'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'builder' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Readiness Survey Builder</h2>
                            <div className="flex gap-2">
                                <button className="btn-secondary text-xs" onClick={() => toast('Template loaded')}>Load Template</button>
                                <button className="btn-primary" onClick={() => toast('Question editor coming soon')}>
                                    <Plus className="w-4 h-4" /> Add Question
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {surveyQuestions.map((q, idx) => (
                                <div key={q.id} className="glass-card p-6 flex items-start justify-between group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center font-bold text-neutral-500 text-xs">
                                            {idx + 1}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-white">{q.text}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">{q.type}</span>
                                                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                                                <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">{q.category}</span>
                                                {q.required && <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Required</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => toast(`Settings for question ${idx + 1}`)} className="p-2 rounded-lg opacity-0 group-hover:opacity-100 bg-neutral-800 hover:bg-neutral-700 text-neutral-500 hover:text-white transition-all">
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
}