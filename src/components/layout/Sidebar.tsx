import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Bot, FileText, AlertCircle, Search,
  Mic, BarChart3, User, Settings, LogOut, ChevronLeft, ChevronRight,
  Zap, Bell,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { path: '/assistant', icon: Bot, key: 'aiAssistant' },
  { path: '/schemes', icon: Search, key: 'schemeFinder' },
  { path: '/complaints', icon: AlertCircle, key: 'complaints' },
  { path: '/documents', icon: FileText, key: 'documentAssistant' },
  { path: '/voice', icon: Mic, key: 'voiceAssistant' },
  { path: '/analytics', icon: BarChart3, key: 'analytics' },
];

const BOTTOM_ITEMS = [
  { path: '/profile', icon: User, key: 'profile' },
  { path: '/settings', icon: Settings, key: 'settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
      style={{
        background: 'rgba(11, 16, 32, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255, 138, 0, 0.1)',
      }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 glow-saffron"
          style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-sm font-bold text-white leading-tight">{t('appName')}</div>
            <div className="text-[10px] text-saffron-500 leading-tight">AI Civic Companion</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-12 w-6 h-6 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-colors"
        style={{ background: '#0f1629', border: '1px solid rgba(255,138,0,0.2)' }}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, key }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${isActive(path) ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? t(key) : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{t(key)}</span>}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 border-t border-white/5 space-y-1">
        {BOTTOM_ITEMS.map(({ path, icon: Icon, key }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-link ${isActive(path) ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`}
            title={collapsed ? t(key) : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{t(key)}</span>}
          </Link>
        ))}

        {/* User info */}
        {!collapsed && (
          <div className="mt-3 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF8A00, #16C784)' }}>
                {profile?.full_name?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-white/90 truncate">
                  {profile?.full_name || 'Citizen'}
                </div>
                <div className="text-[10px] text-white/40 truncate">{profile?.state || 'India'}</div>
              </div>
              <button
                onClick={signOut}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
