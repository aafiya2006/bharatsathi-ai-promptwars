import { useState } from 'react';
import { Globe, Bell, Shield, LogOut, ChevronRight, Save, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { LANGUAGES } from '../data/constants';
import { Language } from '../types';

export default function SettingsPage() {
  const { user, updateProfile, signOut } = useAuth();
  const { t, language } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const isDemo = !user;

  async function handleLangChange(lang: Language) {
    if (user) {
      await updateProfile({ language: lang });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  const sections = [
    {
      title: 'Language & Region',
      icon: Globe,
      color: '#FF8A00',
      content: (
        <div>
          <p className="text-xs text-white/50 mb-3">Choose your preferred language for the app interface and AI responses.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLangChange(lang.code)}
                className={`p-3 rounded-xl text-left transition-all ${
                  language === lang.code
                    ? 'border-saffron-500'
                    : 'border-white/8 hover:border-white/20'
                }`}
                style={{
                  background: language === lang.code ? 'rgba(255,138,0,0.1)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${language === lang.code ? '#FF8A00' : 'rgba(255,255,255,0.08)'}`,
                }}
              >
                <div className="text-sm font-medium" style={{ color: language === lang.code ? '#FF8A00' : 'rgba(241,245,249,0.7)' }}>
                  {lang.nativeName}
                </div>
                <div className="text-xs text-white/30">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: '#16C784',
      content: (
        <div className="space-y-3">
          {[
            { label: 'Complaint status updates', desc: 'Get notified when your complaint status changes' },
            { label: 'New schemes available', desc: 'Alert when new schemes match your profile' },
            { label: 'Application reminders', desc: 'Deadline reminders for schemes' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <div className="text-sm text-white/80">{item.label}</div>
                <div className="text-xs text-white/40">{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-10 h-5.5 rounded-full relative transition-all ${notifications ? 'bg-saffron-500' : 'bg-white/10'}`}
                style={{ width: 44, height: 24 }}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Privacy & Security',
      icon: Shield,
      color: '#3B82F6',
      content: (
        <div className="space-y-2">
          {[
            'Your data is encrypted and stored securely',
            'We never share your personal information with third parties',
            'AI conversations are used only to improve your experience',
            'You can request data deletion at any time',
          ].map(item => (
            <div key={item} className="flex items-start gap-2 py-1">
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#3B82F6' }} />
              <span className="text-sm text-white/60">{item}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <AppLayout title={t('settings')} subtitle="App preferences and account settings">
      <div className="max-w-2xl mx-auto space-y-4">
        {isDemo && (
          <div className="px-4 py-3 rounded-xl flex items-center gap-2 text-sm"
            style={{ background: 'rgba(255,138,0,0.08)', border: '1px solid rgba(255,138,0,0.2)' }}>
            <Lock size={14} className="text-saffron-500 flex-shrink-0" />
            <span className="text-white/70">
              Settings are read-only in demo mode. <Link to="/auth" className="text-saffron-500 hover:underline font-medium">Sign in</Link> to save preferences.
            </span>
          </div>
        )}

        {saved && (
          <div className="p-3 rounded-xl text-sm text-emerald-400 flex items-center gap-2"
            style={{ background: 'rgba(22,199,132,0.1)', border: '1px solid rgba(22,199,132,0.2)' }}>
            <Save size={14} /> Settings saved!
          </div>
        )}

        {sections.map(({ title, icon: Icon, color, content }) => (
          <div key={title} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
            </div>
            {content}
          </div>
        ))}

        {/* Account actions */}
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Account</h3>
          <div className="space-y-2">
            {user ? (
              <button
                onClick={signOut}
                className="w-full flex items-center justify-between p-3 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition-colors"
                style={{ border: '1px solid rgba(239,68,68,0.1)' }}
              >
                <div className="flex items-center gap-2">
                  <LogOut size={16} />
                  Sign Out
                </div>
                <ChevronRight size={14} />
              </button>
            ) : (
              <Link
                to="/auth"
                className="w-full flex items-center justify-between p-3 rounded-xl text-sm text-saffron-500 hover:bg-saffron-500/5 transition-colors"
                style={{ border: '1px solid rgba(255,138,0,0.15)' }}
              >
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  Sign in to unlock all features
                </div>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>

        {/* App info */}
        <div className="text-center py-4">
          <p className="text-xs text-white/20">BharatSathi AI v1.0.0</p>
          <p className="text-xs text-white/15 mt-0.5">Ek Bharat, Shreshtha Bharat</p>
        </div>
      </div>
    </AppLayout>
  );
}
