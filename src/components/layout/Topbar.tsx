import { useState } from 'react';
import { Bell, Globe, X, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES } from '../../data/constants';
import { Language } from '../../types';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  const { profile, user, updateProfile } = useAuth();
  const { language } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  function handleLanguageChange(lang: Language) {
    if (user) {
      updateProfile({ language: lang });
    }
    setShowLangMenu(false);
  }

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <header
      className="sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center justify-between"
      style={{
        background: 'rgba(11, 16, 32, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 138, 0, 0.08)',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-bold text-white leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-white/50 hidden sm:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        {/* Language selector */}
        <div className="relative">
          <button
            onClick={() => { setShowLangMenu(!showLangMenu); setShowNotifs(false); }}
            className="flex items-center gap-1.5 px-2 md:px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Globe size={15} />
            <span className="hidden md:block">{currentLang?.nativeName}</span>
          </button>
          {showLangMenu && (
            <div
              className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden shadow-2xl z-50"
              style={{ background: '#141c35', border: '1px solid rgba(255,138,0,0.2)' }}
            >
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                    language === lang.code ? 'text-saffron-500 bg-saffron-500/10' : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{lang.nativeName}</span>
                  <span className="text-xs text-white/30">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowLangMenu(false); }}
            className="relative p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-saffron-500"></span>
          </button>
          {showNotifs && (
            <div
              className="absolute right-0 top-full mt-2 w-72 rounded-xl overflow-hidden shadow-2xl z-50"
              style={{ background: '#141c35', border: '1px solid rgba(255,138,0,0.2)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button onClick={() => setShowNotifs(false)}>
                  <X size={14} className="text-white/40" />
                </button>
              </div>
              <div className="p-3 space-y-2">
                <div className="p-3 rounded-lg" style={{ background: 'rgba(255,138,0,0.08)' }}>
                  <div className="text-xs font-medium text-saffron-500">Welcome to BharatSathi!</div>
                  <div className="text-xs text-white/50 mt-0.5">Explore government schemes tailored for you.</div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(22,199,132,0.08)' }}>
                  <div className="text-xs font-medium text-emerald-500">New Scheme Available</div>
                  <div className="text-xs text-white/50 mt-0.5">PM Vishwakarma Yojana is now open for applications.</div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'rgba(59,130,246,0.08)' }}>
                  <div className="text-xs font-medium text-blue-400">Complaint Update</div>
                  <div className="text-xs text-white/50 mt-0.5">Your demo complaint #BS12345 is In Progress.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
          style={{ background: user ? 'linear-gradient(135deg, #FF8A00, #16C784)' : 'rgba(255,255,255,0.1)' }}
          title={user ? (profile?.full_name || 'Account') : 'Guest'}
        >
          {user ? (profile?.full_name?.[0]?.toUpperCase() || 'C') : 'G'}
        </div>
      </div>
    </header>
  );
}
