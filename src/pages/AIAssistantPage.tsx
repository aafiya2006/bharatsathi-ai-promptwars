import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RotateCcw, Copy, Check } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTED_QUERIES = [
  'What government schemes am I eligible for?',
  'How to apply for PM-KISAN scheme?',
  'Documents needed for Aadhaar card',
  'How to file an RTI application?',
  'What is PM Ujjwala Yojana?',
  'How to apply for Ayushman Bharat?',
];

const SESSION_ID = () => `session_${Date.now()}`;

export default function AIAssistantPage() {
  const { user, profile } = useAuth();
  const { t, language } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(SESSION_ID);
  const [copied, setCopied] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: `Namaste! 🙏 I'm BharatSathi AI, your intelligent civic companion. I can help you with:\n\n• **Government Schemes** — Find schemes you're eligible for\n• **Document Guidance** — Step-by-step application guides\n• **Complaint Filing** — Help you draft and track issues\n• **Scheme Details** — PM-KISAN, Ayushman Bharat, PMAY & more\n• **Rights & Laws** — Know your rights as a citizen\n\nHow can I assist you today?`,
      timestamp: new Date(),
    }]);
  }, []);

  async function sendMessage(text?: string) {
    const query = text || input.trim();
    if (!query || loading) return;
    setInput('');

    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: query,
            language,
            profile: {
              state: profile?.state,
              occupation: profile?.occupation,
              income_range: profile?.income_range,
              age: profile?.age,
              gender: profile?.gender,
            },
            history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          }),
        }
      );

      let assistantContent = '';
      if (!res.ok) {
        assistantContent = getLocalResponse(query);
      } else {
        const data = await res.json();
        assistantContent = data.response || data.error || getLocalResponse(query);
      }

      const assistantMsg: Message = {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);

      // Save to database
      if (user) {
        await supabase.from('chat_history').insert([
          { user_id: user.id, session_id: sessionId, role: 'user', content: query, language },
          { user_id: user.id, session_id: sessionId, role: 'assistant', content: assistantContent, language },
        ]);
      }
    } catch {
      const fallback = getLocalResponse(query);
      setMessages(prev => [...prev, {
        id: `a_${Date.now()}`,
        role: 'assistant',
        content: fallback,
        timestamp: new Date(),
      }]);
    }
    setLoading(false);
  }

  function getLocalResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('pm-kisan') || q.includes('kisan')) {
      return '**PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**\n\nThis scheme provides financial support of **₹6,000 per year** to eligible farmer families in three equal installments of ₹2,000 each.\n\n**Eligibility:**\n- Small and marginal farmers\n- Landholding up to 2 hectares\n\n**How to Apply:**\n1. Visit pmkisan.gov.in\n2. Click "Farmer Corner" → "New Farmer Registration"\n3. Enter Aadhaar number and bank details\n4. Submit and get registration number\n\n**Documents Required:**\n- Aadhaar Card\n- Land ownership records (Khatian/ROR)\n- Bank account passbook';
    }
    if (q.includes('ayushman') || q.includes('pmjay') || q.includes('health insurance')) {
      return '**Ayushman Bharat PM-JAY**\n\nProvides health insurance coverage of **₹5 lakh per family per year** for secondary and tertiary care hospitalization.\n\n**Eligibility:**\n- Bottom 40% of India\'s population (as per SECC 2011 data)\n- Socially vulnerable families\n\n**How to Check Eligibility:**\n1. Visit pmjay.gov.in\n2. Click "Am I Eligible?"\n3. Enter mobile number or ration card / RSBY URN\n\n**Benefits:**\n- 1,393+ medical packages\n- Pre and post-hospitalization coverage\n- Cashless treatment at empanelled hospitals';
    }
    if (q.includes('passport') || q.includes('documents')) {
      return '**Documents for Passport Application**\n\n**Required Documents:**\n1. Proof of Date of Birth (Birth Certificate / Matric Certificate)\n2. Proof of Address (Aadhaar / Voter ID / Utility Bill)\n3. Identity Proof (Aadhaar Card recommended)\n4. 4 passport-size photos (4.5cm × 3.5cm, white background)\n\n**Steps:**\n1. Register on passportindia.gov.in\n2. Fill online application\n3. Pay fee (₹1,500 for normal, ₹3,500 for Tatkaal)\n4. Book appointment at PSK\n5. Visit PSK with original documents\n\n**Processing Time:**\n- Normal: 30-45 days\n- Tatkaal: 7-14 days';
    }
    if (q.includes('scheme') || q.includes('yojana') || q.includes('benefit')) {
      return '**Popular Government Schemes for Citizens**\n\nBased on your profile, here are some key schemes:\n\n🌾 **Agriculture:** PM-KISAN (₹6,000/year), Pradhan Mantri Fasal Bima Yojana\n\n🏥 **Health:** Ayushman Bharat (₹5 lakh insurance), Janani Suraksha Yojana\n\n🏠 **Housing:** PMAY-Gramin (₹1.2L for rural housing), PMAY-Urban\n\n📚 **Education:** National Scholarship Portal, Mid-Day Meal Scheme\n\n💼 **Employment:** Skill India, PM MUDRA Yojana (loans up to ₹10L)\n\n🔥 **Energy:** PM Ujjwala Yojana (free LPG connection)\n\nWould you like detailed information about any specific scheme?';
    }
    return '**BharatSathi AI Assistant**\n\nI can help you with:\n\n• Government scheme eligibility and application process\n• Document requirements for passport, Aadhaar, PAN, voter ID\n• RTI filing and citizen rights\n• Complaint registration guidance\n• State-specific schemes and benefits\n\nPlease ask me a specific question about government services, and I\'ll provide detailed guidance. You can also try one of the suggested queries below!';
  }

  function copyMessage(id: string, content: string) {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  function renderContent(content: string) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  }

  return (
    <AppLayout title={t('aiAssistant')} subtitle="Powered by Gemini AI">
      <div className="max-w-4xl mx-auto h-[calc(100vh-10rem)] flex flex-col">
        {/* Chat area */}
        <div className="flex-1 glass-card overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fade-in`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-saffron-500 to-saffron-600'
                    : 'bg-gradient-to-br from-blue-500 to-blue-600'
                }`}>
                  {msg.role === 'assistant' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white" />}
                </div>
                <div className={`max-w-[78%] group ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-tr-sm'
                        : 'text-white/90 rounded-tl-sm'
                    }`}
                    style={msg.role === 'user'
                      ? { background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }
                      : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }
                    }
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => copyMessage(msg.id, msg.content)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-white/30 hover:text-white/60 flex items-center gap-1 transition-all"
                    >
                      {copied === msg.id ? <Check size={11} /> : <Copy size={11} />}
                      {copied === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                  <div className="text-[10px] text-white/20 px-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 animate-fade-in">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
                  <Bot size={16} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-saffron-500 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested queries */}
          {messages.length <= 1 && (
            <div className="px-4 pb-3 flex flex-wrap gap-2">
              {SUGGESTED_QUERIES.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105"
                  style={{ background: 'rgba(255,138,0,0.08)', border: '1px solid rgba(255,138,0,0.2)', color: '#FF8A00' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={t('askAnything')}
                className="input-field flex-1"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="btn-primary px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5 text-xs text-white/30">
                <Sparkles size={11} />
                Powered by Gemini AI
              </div>
              <button
                onClick={() => setMessages([{
                  id: 'welcome2',
                  role: 'assistant',
                  content: 'Chat cleared. How can I help you?',
                  timestamp: new Date(),
                }])}
                className="text-xs text-white/30 hover:text-white/50 flex items-center gap-1"
              >
                <RotateCcw size={11} /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
