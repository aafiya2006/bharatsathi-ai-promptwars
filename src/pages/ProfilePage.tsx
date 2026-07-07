import { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, IndianRupee, Calendar, Camera, Save, Edit3 } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { INDIAN_STATES, OCCUPATIONS, INCOME_RANGES } from '../data/constants';

export default function ProfilePage() {
  const { profile, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    state: profile?.state || 'Maharashtra',
    occupation: profile?.occupation || 'Other',
    income_range: profile?.income_range || 'Below 1 Lakh',
    age: profile?.age?.toString() || '25',
    gender: profile?.gender || 'Male',
  });

  async function handleSave() {
    setSaving(true);
    await updateProfile({
      ...form,
      age: parseInt(form.age) || 25,
    });
    setSaving(false);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 3000);
  }

  const initials = (profile?.full_name || 'C').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <AppLayout title={t('profile')} subtitle="Manage your citizen profile">
      <div className="max-w-2xl mx-auto">
        {/* Avatar section */}
        <div className="glass-card p-6 mb-6 text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mx-auto"
              style={{ background: 'linear-gradient(135deg, #FF8A00, #16C784)' }}>
              {initials}
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: '#0f1629', border: '2px solid rgba(255,138,0,0.3)' }}>
              <Camera size={12} className="text-saffron-500" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-white">{profile?.full_name || 'Citizen'}</h2>
          <p className="text-sm text-white/50">{profile?.email}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(255,138,0,0.1)', color: '#FF8A00', border: '1px solid rgba(255,138,0,0.2)' }}>
              {profile?.state || 'India'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(22,199,132,0.1)', color: '#16C784', border: '1px solid rgba(22,199,132,0.2)' }}>
              {profile?.occupation || 'Citizen'}
            </span>
          </div>
        </div>

        {/* Profile form */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Personal Information</h3>
            <button
              onClick={() => editing ? handleSave() : setEditing(true)}
              className={editing ? 'btn-primary flex items-center gap-2' : 'btn-secondary flex items-center gap-2'}
              disabled={saving}
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : editing ? (
                <><Save size={14} /> Save Changes</>
              ) : (
                <><Edit3 size={14} /> Edit Profile</>
              )}
            </button>
          </div>

          {saved && (
            <div className="mb-4 p-3 rounded-lg text-sm text-emerald-400"
              style={{ background: 'rgba(22,199,132,0.1)', border: '1px solid rgba(22,199,132,0.2)' }}>
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <User size={11} /> Full Name
              </label>
              <input
                value={form.full_name}
                onChange={e => setForm(p => ({ ...p, full_name: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <Phone size={11} /> Phone Number
              </label>
              <input
                value={form.phone}
                onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <Calendar size={11} /> Age
              </label>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm(p => ({ ...p, age: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
                min={1} max={120}
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <User size={11} /> Gender
              </label>
              <select
                value={form.gender}
                onChange={e => setForm(p => ({ ...p, gender: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
                <option>Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <MapPin size={11} /> State
              </label>
              <select
                value={form.state}
                onChange={e => setForm(p => ({ ...p, state: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <Briefcase size={11} /> Occupation
              </label>
              <select
                value={form.occupation}
                onChange={e => setForm(p => ({ ...p, occupation: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-white/50 mb-1.5 flex items-center gap-1">
                <IndianRupee size={11} /> Annual Income Range
              </label>
              <select
                value={form.income_range}
                onChange={e => setForm(p => ({ ...p, income_range: e.target.value }))}
                disabled={!editing}
                className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {INCOME_RANGES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {editing && (
            <div className="flex gap-3 mt-5 justify-end">
              <button onClick={() => { setEditing(false); setForm({
                full_name: profile?.full_name || '',
                phone: profile?.phone || '',
                state: profile?.state || 'Maharashtra',
                occupation: profile?.occupation || 'Other',
                income_range: profile?.income_range || 'Below 1 Lakh',
                age: profile?.age?.toString() || '25',
                gender: profile?.gender || 'Male',
              }); }} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Info box */}
        <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-xs text-blue-400">
            Your profile information is used to personalize government scheme recommendations. Accurate information ensures better eligibility matching.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
