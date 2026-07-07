import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Zap, Bot, Search, AlertCircle, FileText, Mic, Globe,
  ArrowRight, Star, Users, Shield, ChevronDown, Check,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Bot,
    title: 'AI Civic Assistant',
    description: 'Conversational AI powered by Gemini — answers all your government queries instantly.',
    color: '#FF8A00',
  },
  {
    icon: Search,
    title: 'Scheme Finder',
    description: 'Discover schemes, scholarships, and subsidies tailored to your profile.',
    color: '#16C784',
  },
  {
    icon: AlertCircle,
    title: 'Complaint Tracker',
    description: 'Register civic issues and track resolution in real-time with timeline view.',
    color: '#3B82F6',
  },
  {
    icon: FileText,
    title: 'Document Assistant',
    description: 'Step-by-step guidance for Passport, PAN, Aadhaar, and 20+ government documents.',
    color: '#8B5CF6',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Speak in any Indian language — our AI understands and responds in your language.',
    color: '#EC4899',
  },
  {
    icon: Globe,
    title: 'Multilingual',
    description: 'Available in 7 Indian languages: Hindi, Tamil, Telugu, Bengali, Marathi, Kannada.',
    color: '#F59E0B',
  },
];

const STATS = [
  { value: '500+', label: 'Government Schemes', color: '#FF8A00' },
  { value: '7', label: 'Indian Languages', color: '#16C784' },
  { value: '28+', label: 'States Covered', color: '#3B82F6' },
  { value: '1M+', label: 'Citizens Served', color: '#8B5CF6' },
];

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ background: '#0B1020' }}>
      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(11,16,32,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,138,0,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center glow-saffron"
            style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <div className="text-base font-bold text-white">BharatSathi AI</div>
            <div className="text-[10px] text-saffron-500 leading-tight">Intelligent Civic Companion</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary flex items-center gap-2">
              Go to Dashboard <ArrowRight size={15} />
            </Link>
          ) : (
            <>
              <Link to="/auth" className="btn-secondary hidden sm:flex">Sign In</Link>
              <Link to="/auth" className="btn-primary flex items-center gap-2">
                Get Started <ArrowRight size={15} />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: [' #FF8A00', '#16C784', '#3B82F6'][i % 3],
                animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            />
          ))}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #FF8A00, transparent)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, #16C784, transparent)', filter: 'blur(80px)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-3"
            style={{ background: 'radial-gradient(circle, #3B82F6, transparent)', filter: 'blur(100px)' }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(255,138,0,0.1)', border: '1px solid rgba(255,138,0,0.2)', color: '#FF8A00' }}>
            <Zap size={12} />
            Powered by Gemini AI · Made for Bharat
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 text-balance">
            Your Intelligent<br />
            <span className="gradient-text">Civic Companion</span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Access government schemes, report public issues, get personalized AI assistance — 
            all in your language. Bridging citizens with governance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to={user ? '/dashboard' : '/auth'}
              className="btn-primary flex items-center gap-2 px-8 py-4 text-base rounded-xl glow-saffron"
            >
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link
              to="/assistant"
              className="btn-secondary flex items-center gap-2 px-8 py-4 text-base rounded-xl"
            >
              <Bot size={18} /> Try AI Assistant
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-1.5"><Shield size={14} className="text-saffron-500" /> Secure & Private</div>
            <div className="flex items-center gap-1.5"><Star size={14} className="text-saffron-500" /> Government Verified Data</div>
            <div className="flex items-center gap-1.5"><Users size={14} className="text-saffron-500" /> 1M+ Citizens Trust Us</div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={24} className="text-white/30" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label, color }) => (
              <div key={label} className="glass-card glass-card-hover p-6 text-center">
                <div className="text-4xl font-black mb-2" style={{ color }}>{value}</div>
                <div className="text-sm text-white/50">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Everything a Citizen Needs</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              From discovering government benefits to tracking complaints — BharatSathi is your complete civic platform.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color }) => (
              <div key={title} className="glass-card glass-card-hover p-6 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-white/50">Simple steps to access all civic services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and complete your profile with state, age, and occupation.' },
              { step: '02', title: 'Discover Schemes', desc: 'Our AI recommends personalized schemes based on your eligibility.' },
              { step: '03', title: 'Take Action', desc: 'Apply, track complaints, or chat with AI — all from one dashboard.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black mx-auto mb-4"
                  style={{ background: 'linear-gradient(135deg, rgba(255,138,0,0.15), rgba(255,138,0,0.05))', border: '1px solid rgba(255,138,0,0.2)', color: '#FF8A00' }}>
                  {step}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"
              style={{ background: 'radial-gradient(circle at 50% 50%, #FF8A00, transparent)' }} />
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to access your <span className="gradient-text">civic rights?</span>
              </h2>
              <p className="text-white/50 mb-8">
                Join over a million citizens already using BharatSathi AI.
              </p>
              <Link
                to={user ? '/dashboard' : '/auth'}
                className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-base rounded-xl glow-saffron"
              >
                Start for Free <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
            <Zap size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">BharatSathi AI</span>
        </div>
        <p className="text-xs text-white/30">
          Ek Bharat, Shreshtha Bharat · Empowering Every Citizen with AI
        </p>
        <p className="text-xs text-white/20 mt-1">© 2024 BharatSathi AI. Built with ❤️ for Bharat</p>
      </footer>
    </div>
  );
}
