import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

// All pages are publicly accessible for demo/judging purposes.
// Auth state is read inside each page — logged-in users get persisted data,
// guests get demo data. No hard redirects to /auth.
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/schemes" element={<SchemeFinderPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/documents" element={<DocumentAssistantPage />} />
          <Route path="/voice" element={<VoiceAssistantPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
