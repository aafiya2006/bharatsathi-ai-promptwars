import { useState } from 'react';
import { FileText, CheckCircle, Clock, ChevronRight, Search, ArrowRight } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useTranslation } from '../hooks/useTranslation';
import { DOCUMENT_GUIDES } from '../data/schemes';

const DOCUMENT_TYPES = [
  { id: 'passport', name: 'Passport', icon: '🛂', description: 'Indian Passport application and renewal' },
  { id: 'voter_id', name: 'Voter ID', icon: '🗳️', description: 'Electoral Photo Identity Card (EPIC)' },
  { id: 'pan_card', name: 'PAN Card', icon: '💳', description: 'Permanent Account Number card' },
  { id: 'aadhaar', name: 'Aadhaar Card', icon: '🪪', description: 'Unique Identification Authority of India' },
  { id: 'driving_license', name: 'Driving License', icon: '🚗', description: 'Motor vehicle driving license' },
  { id: 'birth_certificate', name: 'Birth Certificate', icon: '📜', description: 'Official birth registration certificate' },
];

export default function DocumentAssistantPage() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'documents' | 'steps' | 'timeline'>('documents');

  const filtered = DOCUMENT_TYPES.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const guide = selected ? DOCUMENT_GUIDES[selected] : null;
  const doc = selected ? DOCUMENT_TYPES.find(d => d.id === selected) : null;

  return (
    <AppLayout title={t('documentAssistant')} subtitle="Step-by-step document application guides">
      <div className="max-w-5xl mx-auto">
        {!selected ? (
          <>
            {/* Search */}
            <div className="relative mb-6">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search documents... e.g. "Passport", "Voter ID"'
                className="input-field pl-9 max-w-lg"
              />
            </div>

            {/* Common queries */}
            <div className="glass-card p-5 mb-6">
              <h3 className="text-sm font-semibold text-white mb-3">Common Questions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  'What documents are required for Passport?',
                  'What documents are needed for Voter ID?',
                  'How to apply for PAN Card?',
                  'Documents needed for Driving License?',
                ].map(q => (
                  <button
                    key={q}
                    onClick={() => {
                      const match = DOCUMENT_TYPES.find(d => q.toLowerCase().includes(d.name.toLowerCase().split(' ')[0]));
                      if (match) setSelected(match.id);
                    }}
                    className="flex items-center gap-2 p-3 rounded-xl text-sm text-white/70 hover:text-white transition-all text-left"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <ChevronRight size={14} className="text-saffron-500 flex-shrink-0" />
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Document grid */}
            <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">Select a Document</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(doc => (
                <button
                  key={doc.id}
                  onClick={() => setSelected(doc.id)}
                  className="glass-card glass-card-hover p-6 text-left group"
                >
                  <div className="text-3xl mb-3">{doc.icon}</div>
                  <h3 className="text-sm font-semibold text-white mb-1 group-hover:text-saffron-500 transition-colors">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-white/50">{doc.description}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-saffron-500">
                    View Guide <ArrowRight size={12} />
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : guide && doc ? (
          <div className="animate-fade-in">
            {/* Back button */}
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors"
            >
              ← Back to Documents
            </button>

            {/* Document header */}
            <div className="glass-card p-6 mb-6"
              style={{ borderColor: 'rgba(255,138,0,0.2)', background: 'linear-gradient(135deg, rgba(255,138,0,0.08), rgba(22,199,132,0.04))' }}>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{doc.icon}</div>
                <div>
                  <h2 className="text-xl font-bold text-white">{doc.name}</h2>
                  <p className="text-sm text-white/50 mt-0.5">{doc.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-saffron-500">
                    <Clock size={12} />
                    Processing Time: {guide.timeline}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 p-1 rounded-xl"
              style={{ background: 'rgba(15,22,41,0.8)', width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
              {([
                { id: 'documents', label: 'Required Documents' },
                { id: 'steps', label: 'Application Steps' },
                { id: 'timeline', label: 'Timeline' },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id ? 'text-white' : 'text-white/40 hover:text-white/60'
                  }`}
                  style={activeTab === tab.id ? { background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' } : {}}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'documents' && (
              <div className="glass-card p-6 animate-fade-in">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-saffron-500" />
                  Documents Checklist
                </h3>
                <div className="space-y-3">
                  {guide.documents.map((doc, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(22,199,132,0.1)', border: '1px solid rgba(22,199,132,0.2)' }}>
                        <CheckCircle size={14} className="text-emerald-500" />
                      </div>
                      <span className="text-sm text-white/80">{doc}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl"
                  style={{ background: 'rgba(255,138,0,0.08)', border: '1px solid rgba(255,138,0,0.2)' }}>
                  <p className="text-xs text-saffron-500">
                    💡 Tip: Always carry both original documents and self-attested photocopies. Keep digital copies on DigiLocker.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'steps' && (
              <div className="glass-card p-6 animate-fade-in">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-emerald-500" />
                  Application Steps
                </h3>
                <div className="space-y-4">
                  {guide.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #FF8A00, #ea7c00)', color: 'white' }}>
                          {i + 1}
                        </div>
                        {i < guide.steps.length - 1 && (
                          <div className="w-px flex-1 bg-saffron-500/20 mt-2" />
                        )}
                      </div>
                      <div className={`flex-1 ${i < guide.steps.length - 1 ? 'pb-4' : ''}`}>
                        <p className="text-sm text-white/80 leading-relaxed pt-1.5">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="glass-card p-6 animate-fade-in">
                <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-blue-400" />
                  Processing Timeline
                </h3>
                <div className="p-4 rounded-xl mb-4"
                  style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                  <div className="text-lg font-bold text-blue-400">{guide.timeline}</div>
                  <div className="text-xs text-white/50 mt-1">Approximate processing time</div>
                </div>
                <div className="space-y-3">
                  {guide.steps.slice(0, 4).map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-saffron-500 flex-shrink-0" />
                      <div className="flex-1 text-sm text-white/70">{step}</div>
                      <div className="text-xs text-white/30">Day {(i + 1) * 3}-{(i + 2) * 3}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl"
                  style={{ background: 'rgba(22,199,132,0.08)', border: '1px solid rgba(22,199,132,0.2)' }}>
                  <p className="text-xs text-emerald-500">
                    ✅ Track your application status online at the respective official portal. Always save your application/acknowledgment number.
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
