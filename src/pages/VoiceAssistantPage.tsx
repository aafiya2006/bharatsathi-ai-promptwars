import { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, Send, Bot, Loader } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { LANGUAGES } from '../data/constants';
import { Language } from '../types';

export default function VoiceAssistantPage() {
  const { profile } = useAuth();
  const { language } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ q: string; a: string }>>([]);
  const [selectedLang, setSelectedLang] = useState<Language>(language as Language);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  const LANG_CODES: Record<Language, string> = {
    en: 'en-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN',
    bn: 'bn-IN', mr: 'mr-IN', kn: 'kn-IN',
  };

  function startListening() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }
    const rec = new SR();
    rec.lang = LANG_CODES[selectedLang];
    rec.continuous = false;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          setTranscript(e.results[i][0].transcript);
        } else {
          interim = e.results[i][0].transcript;
          setTranscript(interim);
        }
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }

  function stopListening() {
    recognitionRef.current?.stop();
    setIsListening(false);
  }

  function speakResponse(text: string) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '').replace(/[#*]/g, ''));
    utt.lang = LANG_CODES[selectedLang];
    utt.rate = 0.9;
    synthRef.current = utt;
    window.speechSynthesis.speak(utt);
  }

  async function sendQuery(text?: string) {
    const query = text || transcript;
    if (!query.trim() || loading) return;
    setLoading(true);
    setResponse('');

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
            language: selectedLang,
            profile: {
              state: profile?.state,
              occupation: profile?.occupation,
            },
            history: [],
          }),
        }
      );
      const data = res.ok ? await res.json() : {};
      const answer = data.response || 'I could not find an answer. Please try again.';
      setResponse(answer);
      setHistory(prev => [{ q: query, a: answer }, ...prev.slice(0, 4)]);
      speakResponse(answer);
    } catch {
      setResponse('Unable to connect. Please check your connection.');
    }
    setLoading(false);
  }

  return (
    <AppLayout title="Voice Assistant" subtitle="Speak to get instant answers">
      <div className="max-w-3xl mx-auto">
        {/* Language selector */}
        <div className="flex gap-2 flex-wrap mb-6">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedLang === lang.code ? 'text-white' : 'text-white/50 hover:text-white/70'
              }`}
              style={selectedLang === lang.code
                ? { background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {lang.nativeName}
            </button>
          ))}
        </div>

        {/* Voice button */}
        <div className="glass-card p-8 mb-6 text-center">
          <div className="relative inline-block mb-6">
            {/* Ripple effect when listening */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#FF8A00' }} />
                <div className="absolute -inset-4 rounded-full animate-ping opacity-10" style={{ background: '#FF8A00', animationDelay: '0.15s' }} />
              </>
            )}
            <button
              onClick={isListening ? stopListening : startListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 relative ${
                isListening ? 'scale-110' : 'hover:scale-105'
              }`}
              style={{
                background: isListening
                  ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                  : 'linear-gradient(135deg, #FF8A00, #ea7c00)',
                boxShadow: isListening
                  ? '0 0 40px rgba(239,68,68,0.4)'
                  : '0 0 30px rgba(255,138,0,0.3)',
              }}
            >
              {isListening ? <MicOff size={36} className="text-white" /> : <Mic size={36} className="text-white" />}
            </button>
          </div>

          <p className="text-sm text-white/60 mb-4">
            {isListening
              ? `Listening in ${LANGUAGES.find(l => l.code === selectedLang)?.nativeName}...`
              : `Tap to speak in ${LANGUAGES.find(l => l.code === selectedLang)?.name}`
            }
          </p>

          {/* Transcript input */}
          <div className="flex gap-3 max-w-lg mx-auto">
            <input
              value={transcript}
              onChange={e => setTranscript(e.target.value)}
              placeholder="Or type your question here..."
              className="input-field flex-1"
              onKeyDown={e => e.key === 'Enter' && sendQuery()}
            />
            <button
              onClick={() => sendQuery()}
              disabled={!transcript.trim() || loading}
              className="btn-primary px-4 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Response */}
        {(loading || response) && (
          <div className="glass-card p-6 mb-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }}>
                <Bot size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-white">BharatSathi AI</span>
              {response && (
                <button
                  onClick={() => speakResponse(response)}
                  className="ml-auto text-white/40 hover:text-saffron-500 transition-colors flex items-center gap-1 text-xs"
                >
                  <Volume2 size={14} /> Speak
                </button>
              )}
            </div>
            {loading ? (
              <div className="flex gap-1.5 items-center py-2">
                <Loader size={16} className="text-saffron-500 animate-spin" />
                <span className="text-sm text-white/60">Processing your query...</span>
              </div>
            ) : (
              <div
                className="text-sm text-white/80 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                }}
              />
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div>
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3">Recent Queries</h3>
            <div className="space-y-3">
              {history.map((item, i) => (
                <div key={i} className="glass-card p-4 cursor-pointer hover:border-saffron-500/30 transition-colors"
                  onClick={() => { setTranscript(item.q); setResponse(item.a); }}>
                  <div className="text-xs font-medium text-white/80 mb-1">Q: {item.q}</div>
                  <div className="text-xs text-white/40 truncate">A: {item.a.substring(0, 100)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-xl" style={{ background: 'rgba(255,138,0,0.06)', border: '1px solid rgba(255,138,0,0.15)' }}>
          <h4 className="text-xs font-semibold text-saffron-500 mb-2">How to use Voice Assistant</h4>
          <ul className="text-xs text-white/50 space-y-1">
            <li>• Select your preferred language above</li>
            <li>• Click the microphone button and speak clearly</li>
            <li>• Ask about government schemes, document requirements, or civic services</li>
            <li>• Click the "Speak" button to hear the AI response aloud</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
