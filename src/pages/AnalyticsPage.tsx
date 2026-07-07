import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, AlertCircle, MessageSquare, Star } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Stats {
  totalComplaints: number;
  resolvedComplaints: number;
  savedSchemes: number;
  chatSessions: number;
  categoryBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
}

const POPULAR_SERVICES = [
  { name: 'PM-KISAN', queries: 2847, growth: '+12%', color: '#FF8A00' },
  { name: 'Ayushman Bharat', queries: 2341, growth: '+8%', color: '#16C784' },
  { name: 'PMAY Housing', queries: 1956, growth: '+23%', color: '#3B82F6' },
  { name: 'Passport', queries: 1823, growth: '+5%', color: '#8B5CF6' },
  { name: 'Voter ID', queries: 1654, growth: '+3%', color: '#EC4899' },
  { name: 'PM MUDRA', queries: 1432, growth: '+18%', color: '#F59E0B' },
];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalComplaints: 0,
    resolvedComplaints: 0,
    savedSchemes: 0,
    chatSessions: 0,
    categoryBreakdown: {},
    statusBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchStats() {
      const [complaintsRes, schemesRes, chatRes] = await Promise.all([
        supabase.from('complaints').select('status, category').eq('user_id', user!.id),
        supabase.from('saved_schemes').select('id').eq('user_id', user!.id),
        supabase.from('chat_history').select('session_id').eq('user_id', user!.id).eq('role', 'user'),
      ]);

      const complaints = complaintsRes.data || [];
      const categoryBreakdown: Record<string, number> = {};
      const statusBreakdown: Record<string, number> = {};
      complaints.forEach(c => {
        categoryBreakdown[c.category] = (categoryBreakdown[c.category] || 0) + 1;
        statusBreakdown[c.status] = (statusBreakdown[c.status] || 0) + 1;
      });

      const uniqueSessions = new Set((chatRes.data || []).map((c: any) => c.session_id));

      setStats({
        totalComplaints: complaints.length,
        resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
        savedSchemes: (schemesRes.data || []).length,
        chatSessions: uniqueSessions.size,
        categoryBreakdown,
        statusBreakdown,
      });
      setLoading(false);
    }
    fetchStats();
  }, [user]);

  const resolutionRate = stats.totalComplaints > 0
    ? Math.round((stats.resolvedComplaints / stats.totalComplaints) * 100)
    : 0;

  return (
    <AppLayout title="Analytics" subtitle="Your civic activity insights">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Personal stats */}
        <div>
          <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Your Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Complaints', value: stats.totalComplaints, icon: AlertCircle, color: '#3B82F6' },
              { label: 'Resolved', value: stats.resolvedComplaints, icon: TrendingUp, color: '#16C784' },
              { label: 'Saved Schemes', value: stats.savedSchemes, icon: Star, color: '#FF8A00' },
              { label: 'AI Chats', value: stats.chatSessions, icon: MessageSquare, color: '#8B5CF6' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}15` }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                </div>
                <div className="text-2xl font-black mb-1" style={{ color }}>
                  {loading ? '—' : value}
                </div>
                <div className="text-xs text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution rate */}
        {stats.totalComplaints > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Complaint Resolution Rate</h3>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-4xl font-black" style={{ color: resolutionRate >= 50 ? '#16C784' : '#FF8A00' }}>
                {resolutionRate}%
              </div>
              <div className="text-sm text-white/50">
                {stats.resolvedComplaints} of {stats.totalComplaints} complaints resolved
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${resolutionRate}%`,
                  background: resolutionRate >= 50 ? 'linear-gradient(90deg, #16C784, #059669)' : 'linear-gradient(90deg, #FF8A00, #ea7c00)',
                }}
              />
            </div>
          </div>
        )}

        {/* Complaint status breakdown */}
        {Object.keys(stats.statusBreakdown).length > 0 && (
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Status Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                const colors: Record<string, string> = {
                  Pending: '#F59E0B', 'In Progress': '#3B82F6', Resolved: '#16C784', Rejected: '#EF4444'
                };
                const color = colors[status] || '#6B7280';
                const pct = Math.round((count / stats.totalComplaints) * 100);
                return (
                  <div key={status}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color }}>{status}</span>
                      <span className="text-white/50">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Platform-wide: Popular services */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-saffron-500" />
            <h3 className="text-sm font-semibold text-white">Most Searched Services (Platform)</h3>
          </div>
          <div className="space-y-3">
            {POPULAR_SERVICES.map((service, i) => {
              const maxQ = POPULAR_SERVICES[0].queries;
              const pct = Math.round((service.queries / maxQ) * 100);
              return (
                <div key={service.name} className="flex items-center gap-3">
                  <div className="w-6 text-xs text-white/30 font-mono">{String(i + 1).padStart(2, '0')}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-white">{service.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/40">{service.queries.toLocaleString()}</span>
                        <span className="text-xs font-medium" style={{ color: service.color }}>{service.growth}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: service.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-saffron-500" /> Platform Insights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Registered Users', value: '1,24,537', sub: '+2.3K this week', color: '#FF8A00' },
              { label: 'Complaints Filed Today', value: '8,392', sub: 'Avg. 3.2hr response', color: '#16C784' },
              { label: 'Schemes Accessed', value: '52,104', sub: 'This month', color: '#3B82F6' },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="p-4 rounded-xl" style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                <div className="text-xl font-bold mb-0.5" style={{ color }}>{value}</div>
                <div className="text-xs font-medium text-white/70 mb-0.5">{label}</div>
                <div className="text-xs text-white/40">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
