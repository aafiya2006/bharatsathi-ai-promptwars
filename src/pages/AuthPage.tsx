import { useState, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { Zap, Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const { user, loading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B1020' }}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
            <Zap size={24} className="text-white" />
          </div>
          <div className="text-white/60 text-sm">Loading BharatSathi AI...</div>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setError(error.message);
    } else {
      if (!name.trim()) { setError('Please enter your name'); setSubmitting(false); return; }
      const { error } = await signUp(email, password, name);
      if (error) setError(error.message);
      else setSuccess('Account created! You can now sign in.');
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#0B1020' }}>
      {/* Left — Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1629, #0B1020)' }}>
        
        {/* Background particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle animate-float"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 ? '#FF8A00' : i % 3 === 1 ? '#16C784' : '#3B82F6',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #FF8A00, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #16C784, transparent)', filter: 'blur(60px)' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-saffron"
              style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">BharatSathi AI</div>
              <div className="text-xs text-saffron-500">Intelligent Civic Companion</div>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Empowering Every<br />
            <span className="gradient-text">Indian Citizen</span><br />
            with AI
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Access government schemes, track civic complaints, get personalized assistance — all in one place, powered by Gemini AI.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { label: 'Schemes', value: '500+', color: '#FF8A00' },
            { label: 'Languages', value: '7', color: '#16C784' },
            { label: 'Citizens', value: '1M+', color: '#3B82F6' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-card p-4 text-center">
              <div className="text-2xl font-bold mb-1" style={{ color }}>{value}</div>
              <div className="text-xs text-white/50">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <div className="text-lg font-bold text-white">BharatSathi AI</div>
              <div className="text-xs text-saffron-500">Intelligent Civic Companion</div>
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-white/50 text-sm mb-6">
              {mode === 'signin' ? 'Sign in to your BharatSathi account' : 'Join millions of citizens using BharatSathi'}
            </p>

            {/* Tab toggle */}
            <div className="flex rounded-lg p-1 mb-6" style={{ background: 'rgba(15,22,41,0.8)' }}>
              {(['signin', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    mode === m ? 'text-white shadow-sm' : 'text-white/40 hover:text-white/60'
                  }`}
                  style={mode === m ? { background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' } : {}}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg text-sm text-red-400"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 rounded-lg text-sm text-emerald-400"
                style={{ background: 'rgba(22,199,132,0.1)', border: '1px solid rgba(22,199,132,0.2)' }}>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-white/60 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="input-field pl-9"
                      placeholder="Your full name"
                      required={mode === 'signup'}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="input-field pl-9"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="input-field pl-9 pr-10"
                    placeholder={mode === 'signup' ? 'Min. 6 characters' : 'Your password'}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'signin' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-6">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
                className="text-saffron-500 hover:underline font-medium"
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-white/20 mt-4">
            Bharat Sarkar · Ek Bharat, Shreshtha Bharat
          </p>
        </div>
      </div>
    </div>
  );
}
