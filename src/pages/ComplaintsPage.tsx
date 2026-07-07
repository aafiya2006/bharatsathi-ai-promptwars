import { useState, useEffect } from 'react';
import { Plus, AlertCircle, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import { Complaint, ComplaintUpdate } from '../types';
import { COMPLAINT_CATEGORIES } from '../data/constants';

function genTicket() {
  return `BS${Date.now().toString().slice(-8)}`;
}

const STATUS_TIMELINE = ['Pending', 'In Progress', 'Resolved'];

export default function ComplaintsPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updates, setUpdates] = useState<Record<string, ComplaintUpdate[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Roads & Infrastructure',
    location: '',
    priority: 'Medium',
  });

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  async function fetchComplaints() {
    const { data } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setComplaints(data || []);
    setLoading(false);
  }

  async function fetchUpdates(complaintId: string) {
    if (updates[complaintId]) return;
    const { data } = await supabase
      .from('complaint_updates')
      .select('*')
      .eq('complaint_id', complaintId)
      .order('created_at', { ascending: true });
    setUpdates(prev => ({ ...prev, [complaintId]: data || [] }));
  }

  async function submitComplaint() {
    if (!form.title.trim() || !form.description.trim()) return;
    setSubmitting(true);
    const ticketNumber = genTicket();
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        user_id: user!.id,
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
        priority: form.priority,
        ticket_number: ticketNumber,
        status: 'Pending',
      })
      .select()
      .single();

    if (data && !error) {
      await supabase.from('complaint_updates').insert({
        complaint_id: data.id,
        status: 'Pending',
        message: 'Your complaint has been registered successfully. Ticket #' + ticketNumber,
      });
      setComplaints(prev => [data, ...prev]);
      setForm({ title: '', description: '', category: 'Roads & Infrastructure', location: '', priority: 'Medium' });
      setShowForm(false);
    }
    setSubmitting(false);
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchUpdates(id);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock size={14} className="text-yellow-400" />;
      case 'In Progress': return <AlertCircle size={14} className="text-blue-400" />;
      case 'Resolved': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'Rejected': return <XCircle size={14} className="text-red-400" />;
      default: return <Clock size={14} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'In Progress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      case 'Rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  };

  const filtered = filterStatus === 'All' ? complaints : complaints.filter(c => c.status === filterStatus);

  return (
    <AppLayout title={t('complaints')} subtitle="Register and track your civic complaints">
      <div className="max-w-4xl mx-auto">
        {/* Header actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          {/* Filter pills */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  filterStatus === s ? 'text-white' : 'text-white/50 hover:text-white/70'
                }`}
                style={filterStatus === s
                  ? { background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }
                  : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                {s}
                {s !== 'All' && (
                  <span className="ml-1 opacity-60">({complaints.filter(c => c.status === s).length})</span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={16} /> File Complaint
          </button>
        </div>

        {/* New complaint form */}
        {showForm && (
          <div className="glass-card p-6 mb-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-white">New Complaint</h3>
              <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block">Complaint Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field"
                  placeholder="Brief title for your complaint"
                />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="input-field">
                  {COMPLAINT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1.5 block">Priority</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="input-field">
                  {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block">Location</label>
                <input
                  value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="input-field"
                  placeholder="Address or area (optional)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-white/50 mb-1.5 block">Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-field resize-none"
                  rows={4}
                  placeholder="Describe the issue in detail..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4 justify-end">
              <button onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
              <button
                onClick={submitComplaint}
                disabled={submitting || !form.title.trim() || !form.description.trim()}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Submit Complaint
              </button>
            </div>
          </div>
        )}

        {/* Complaints list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <AlertCircle size={48} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">
              {filterStatus === 'All' ? 'No complaints filed yet' : `No ${filterStatus} complaints`}
            </p>
            {filterStatus === 'All' && (
              <button onClick={() => setShowForm(true)} className="btn-primary mt-4">
                File Your First Complaint
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(complaint => (
              <div key={complaint.id} className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleExpand(complaint.id)}
                  className="w-full p-5 text-left flex items-center gap-4 hover:bg-white/2 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate">{complaint.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusClass(complaint.status)}`}>
                        {getStatusIcon(complaint.status)} {complaint.status}
                      </span>
                      {complaint.priority === 'High' || complaint.priority === 'Critical' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-400/20">
                          {complaint.priority}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/40">
                      <span>{complaint.category}</span>
                      {complaint.location && <span>· {complaint.location}</span>}
                      <span>· {new Date(complaint.created_at).toLocaleDateString()}</span>
                      {complaint.ticket_number && <span className="text-saffron-500">#{complaint.ticket_number}</span>}
                    </div>
                  </div>
                  {expandedId === complaint.id ? <ChevronUp size={16} className="text-white/40 flex-shrink-0" /> : <ChevronDown size={16} className="text-white/40 flex-shrink-0" />}
                </button>

                {expandedId === complaint.id && (
                  <div className="border-t border-white/5 p-5 animate-slide-up">
                    {/* Description */}
                    <p className="text-sm text-white/70 mb-6">{complaint.description}</p>

                    {/* Timeline */}
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">Status Timeline</h4>

                      {/* Visual timeline progress */}
                      <div className="flex items-center mb-6">
                        {STATUS_TIMELINE.map((step, idx) => {
                          const currentIdx = STATUS_TIMELINE.indexOf(complaint.status);
                          const isCompleted = idx <= currentIdx;
                          const isActive = idx === currentIdx;
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className={`flex flex-col items-center ${idx > 0 ? 'flex-1' : ''}`}>
                                {idx > 0 && (
                                  <div className={`h-0.5 w-full mb-3 transition-all ${isCompleted ? 'bg-saffron-500' : 'bg-white/10'}`} />
                                )}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                  isActive ? 'bg-saffron-500 text-white glow-saffron' :
                                  isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/10 text-white/30'
                                }`}>
                                  {isCompleted && !isActive ? '✓' : idx + 1}
                                </div>
                                <div className={`text-xs mt-1 font-medium ${isActive ? 'text-saffron-500' : isCompleted ? 'text-emerald-500' : 'text-white/30'}`}>
                                  {step}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Update log */}
                      {(updates[complaint.id] || []).length > 0 && (
                        <div className="space-y-3">
                          {(updates[complaint.id] || []).map((u, i) => (
                            <div key={u.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className={`w-2 h-2 rounded-full mt-1 ${i === 0 ? 'bg-saffron-500' : 'bg-white/20'}`} />
                                {i < (updates[complaint.id] || []).length - 1 && (
                                  <div className="w-px flex-1 bg-white/10 mt-1" />
                                )}
                              </div>
                              <div className="flex-1 pb-3">
                                <div className="text-xs font-medium text-white/80">{u.message}</div>
                                <div className="text-xs text-white/30 mt-0.5">
                                  {new Date(u.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
