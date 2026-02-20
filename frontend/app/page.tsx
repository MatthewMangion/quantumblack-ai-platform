'use client';

import { useRouter } from 'next/navigation';
import TopBar from '@/components/layout/TopBar';
import { useToast } from '@/lib/toast-context';
import { dashboardMetrics, projects, activityFeed, currentUser, clients } from '@/lib/mock-data';
import { useClients } from '@/lib/client-context';
import {
  Users,
  Briefcase,
  BarChart3,
  GraduationCap,
  FileText,
  TrendingUp,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { allClients } = useClients();

  const metricCards = [
    { label: 'Active Clients', value: allClients.length, icon: Users, color: '#10b981', href: '/clients' },
    { label: 'Ongoing Projects', value: dashboardMetrics.ongoingProjects, icon: Briefcase, color: '#10b981', href: '/clients' },
    { label: 'Surveys Completed', value: dashboardMetrics.surveysCompleted, icon: BarChart3, color: '#10b981', href: '/people-discovery' },
    { label: 'Workshops Delivered', value: dashboardMetrics.workshopsDelivered, icon: GraduationCap, color: '#10b981', href: '/workshops' },
    { label: 'Documents Created', value: dashboardMetrics.documentsCreated, icon: FileText, color: '#10b981', href: '/strategy' },
    { label: 'Avg. Satisfaction', value: `${dashboardMetrics.avgClientSatisfaction}/5`, icon: TrendingUp, color: '#10b981', href: '/clients' },
  ];

  const quickActions = [
    { label: 'Upload Doc', icon: Plus, action: () => toast('Document upload coming soon') },
    { label: 'Start Survey', icon: TrendingUp, action: () => router.push('/people-discovery') },
    { label: 'Book Workshop', icon: Calendar, action: () => router.push('/workshops') },
    { label: 'New Client', icon: Users, action: () => router.push('/clients') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        actions={
          <button className="btn-primary" onClick={() => toast('New project creation coming soon')}>
            <Plus className="w-4 h-4" />
            New Project
          </button>
        }
      />

      <main className="flex-1 p-8 space-y-8">
        {/* Metric Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        >
          {metricCards.map((metric) => (
            <motion.div
              key={metric.label}
              variants={fadeIn}
              onClick={() => router.push(metric.href)}
              className="glass-card p-5 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${metric.color}15`, border: `1px solid ${metric.color}25` }}
                >
                  <metric.icon className="w-5 h-5" style={{ color: metric.color }} />
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-700 group-hover:text-neutral-400 transition-colors" />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-white tracking-tight">{metric.value}</p>
                <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">{metric.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            {...fadeIn}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span className="dot-indicator" />
                Active Projects
              </h2>
              <button onClick={() => router.push('/clients')} className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">View all →</button>
            </div>

            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="glass-card p-6 border-l-4 border-l-emerald-500">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-white mb-1">{project.name}</h3>
                      <p className="text-sm text-neutral-500">{clients.find(c => c.id === project.clientId)?.name ?? 'Unknown Client'}</p>
                    </div>
                    <span className="badge badge-info">{project.phase}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="font-medium">Progress</span>
                      <span className="font-bold text-white">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mt-6 pt-6 border-t border-neutral-800">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{project.milestones.filter(m => m.completed).length}/{project.milestones.length} milestones</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="w-4 h-4" />
                      <span>{project.startDate} — {project.endDate || 'Ongoing'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            className="space-y-4"
            {...fadeIn}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span className="dot-indicator" />
              Recent Activity
            </h2>
            <div className="glass-card p-6 space-y-6">
              {activityFeed.map((activity, idx) => (
                <div key={activity.id} className="flex gap-4 relative">
                  {idx !== activityFeed.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-neutral-800" />
                  )}
                  <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                    {activity.type === 'milestone' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {activity.type === 'document' && <FileText className="w-4 h-4 text-emerald-400" />}
                    {activity.type === 'survey' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
                    {activity.type === 'comment' && <Clock className="w-4 h-4 text-neutral-500" />}
                    {activity.type === 'update' && <Zap className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-white leading-snug">{activity.title}</p>
                    <p className="text-xs text-neutral-500 line-clamp-2">{activity.description}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-medium text-neutral-600">{activity.user}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-700" />
                      <span className="text-[10px] font-medium text-neutral-600">{new Date(activity.timestamp).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => toast('Full audit trail coming soon')} className="w-full btn-secondary text-xs py-2">View Full Audit Trail</button>
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <span className="dot-indicator" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button key={action.label} onClick={action.action} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700 transition-all group">
                    <action.icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-semibold text-neutral-300">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}