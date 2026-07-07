import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Search, AlertCircle, FileText, TrendingUp, Star, Bell, ArrowRight, Zap, CheckCircle } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import { Complaint, SavedScheme, Notification } from '../types';

const QUICK_ACTIONS = [
  { to: '/assistant', icon: Bot, label: 'AI Assistant', desc: 'Ask anything', color: '#FF8A00' },
  { to: '/schemes', icon: Search, label: 'Find Schemes', desc: 'Your eligibility', color: '#16C784' },
  { to: '/complaints', icon: AlertCircle, label: 'File Complaint', desc: 'Track issues', color: '#3B82F6' },
  { to: '/documents', icon: FileText, label: 'Documents', desc: 'Get guides', color: '#8B5CF6' },
];

export default function DashboardPage() {
  const { profile, user } = useAuth();
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [savedSchemes, setSavedSchemes] = useState<SavedScheme[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      const [complaintsRes, schemesRes, notifsRes] = await Promise.all([
        supabase.from('complaints').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('saved_schemes').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('notifications').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(5),
      ]);
      setComplaints(complaintsRes.data || []);
      setSavedSchemes(schemesRes.data || []);
      setNotifications(notifsRes.data || []);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <AppLayout title={t('dashboard')} subtitle="Your civic command center">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(255,138,0,0.15), rgba(22,199,132,0.08))', border: '1px solid rgba(255,138,0,0.2)' }}
      >
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-8 opacity-5">
          <Zap size={120} />
        </div>
        <div className="relative z-10">
          <div className="text-sm text-white/50 mb-1">{greeting()},</div>
          <h2 className="text-2xl font-bold text-white mb-1">
            {profile?.full_name || 'Citizen'} 👋
          </h2>
          <p className="text-sm text-white/50">
            {profile?.state || 'India'} · {profile?.occupation || 'Citizen'} · {profile?.language?.toUpperCase() || 'EN'}
          </p>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc, color }) => (
          <Link
            key={to}
            to={to}
            className="glass-card glass-card-hover p-5 flex flex-col gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{label}</div>
              <div className="text-xs text-white/40">{desc}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Complaints Filed', value: complaints.length, color: '#3B82F6' },
          { label: 'Schemes Saved', value: savedSchemes.length, color: '#16C784' },
          { label: 'Resolved Issues', value: complaints.filter(c => c.status === 'Resolved').length, color: '#FF8A00' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className="text-3xl font-black mb-1" style={{ color }}>{value}</div>
            <div className="text-xs text-white/50">{label}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent complaints */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-400" /> Recent Complaints
            </h3>
            <Link to="/complaints" className="text-xs text-saffron-500 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
            </div>
          ) : complaints.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle size={32} className="text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/40">No complaints yet</p>
              <Link to="/complaints" className="text-xs text-saffron-500 mt-1 inline-block hover:underline">
                File your first complaint →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {complaints.map(c => (
                <div key={c.id} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{c.title}</div>
                    <div className="text-xs text-white/40">{c.category} · {new Date(c.created_at).toLocaleDateString()}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ml-2 ${getStatusClass(c.status)}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved schemes */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Star size={16} className="text-saffron-500" /> Saved Schemes
            </h3>
            <Link to="/schemes" className="text-xs text-saffron-500 hover:underline flex items-center gap-1">
              Find more <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1,2,3].map(i => <div key={i} className="h-12 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />)}
            </div>
          ) : savedSchemes.length === 0 ? (
            <div className="text-center py-8">
              <Star size={32} className="text-white/20 mx-auto mb-2" />
              <p className="text-sm text-white/40">No saved schemes yet</p>
              <Link to="/schemes" className="text-xs text-saffron-500 mt-1 inline-block hover:underline">
                Discover schemes →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {savedSchemes.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(22,199,132,0.1)' }}>
                    <CheckCircle size={16} className="text-emerald-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{s.scheme_name}</div>
                    <div className="text-xs text-white/40">{s.scheme_category}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI recommendation */}
        <div
          className="glass-card p-5 lg:col-span-2"
          style={{ borderColor: 'rgba(255,138,0,0.2)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
              <Bot size={16} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AI Recommendation</h3>
              <p className="text-xs text-white/40">Based on your profile</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { scheme: 'PM-KISAN', reason: 'Based on your farmer occupation', color: '#FF8A00' },
              { scheme: 'Skill India', reason: 'Enhance your career prospects', color: '#16C784' },
              { scheme: 'Ayushman Bharat', reason: 'Free health coverage for you', color: '#3B82F6' },
            ].map(({ scheme, reason, color }) => (
              <div key={scheme} className="p-3 rounded-xl"
                style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                <div className="text-sm font-semibold mb-1" style={{ color }}>{scheme}</div>
                <div className="text-xs text-white/50">{reason}</div>
                <Link to="/schemes" className="text-xs mt-2 inline-flex items-center gap-1 hover:underline" style={{ color }}>
                  Explore <ArrowRight size={10} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
