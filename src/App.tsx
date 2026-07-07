import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AIAssistantPage from './pages/AIAssistantPage';
import SchemeFinderPage from './pages/SchemeFinderPage';
import ComplaintsPage from './pages/ComplaintsPage';
import DocumentAssistantPage from './pages/DocumentAssistantPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { Zap } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1020' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
            style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
            <Zap size={24} className="text-white animate-pulse" />
          </div>
          <div className="text-white/50 text-sm">Loading BharatSathi AI...</div>
          <div className="mt-3 flex justify-center gap-1">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-saffron-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
      <Route path="/schemes" element={<ProtectedRoute><SchemeFinderPage /></ProtectedRoute>} />
      <Route path="/complaints" element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentAssistantPage /></ProtectedRoute>} />
      <Route path="/voice" element={<ProtectedRoute><VoiceAssistantPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
