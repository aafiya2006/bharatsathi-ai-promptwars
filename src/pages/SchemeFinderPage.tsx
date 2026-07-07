import { useState } from 'react';
import { Search, BookmarkPlus, BookmarkCheck, ExternalLink, Filter, Tag, ChevronDown } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import { GOVERNMENT_SCHEMES } from '../data/schemes';
import { INDIAN_STATES, OCCUPATIONS, INCOME_RANGES } from '../data/constants';
import { Scheme } from '../types';

const CATEGORIES = ['All', 'Agriculture', 'Health', 'Housing', 'Education', 'Finance', 'Employment', 'Women', 'Energy', 'Sanitation', 'Business', 'Social Security', 'Crafts'];

interface FilterState {
  age: string;
  gender: string;
  occupation: string;
  state: string;
  income: string;
}

export default function SchemeFinderPage() {
  const { user, profile } = useAuth();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    age: profile?.age?.toString() || '',
    gender: profile?.gender || '',
    occupation: profile?.occupation || '',
    state: profile?.state || '',
    income: profile?.income_range || '',
  });

  const filtered = GOVERNMENT_SCHEMES.filter(s => {
    if (category !== 'All' && s.category !== category) return false;
    if (search) {
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.includes(q));
    }
    return true;
  });

  async function toggleSave(scheme: Scheme) {
    if (!user) return;
    if (savedIds.has(scheme.id)) {
      await supabase.from('saved_schemes').delete().eq('user_id', user.id).eq('scheme_id', scheme.id);
      setSavedIds(prev => { const s = new Set(prev); s.delete(scheme.id); return s; });
    } else {
      await supabase.from('saved_schemes').insert({
        user_id: user.id,
        scheme_id: scheme.id,
        scheme_name: scheme.name,
        scheme_category: scheme.category,
        scheme_description: scheme.description,
      });
      setSavedIds(prev => new Set([...prev, scheme.id]));
    }
  }

  const getCategoryColor = (cat: string) => {
    const map: Record<string, string> = {
      Agriculture: '#16C784', Health: '#EF4444', Housing: '#3B82F6',
      Education: '#8B5CF6', Finance: '#F59E0B', Employment: '#EC4899',
      Women: '#F472B6', Energy: '#FF8A00', Sanitation: '#06B6D4',
      Business: '#10B981', 'Social Security': '#6366F1', Crafts: '#D97706',
    };
    return map[cat] || '#6B7280';
  };

  return (
    <AppLayout title={t('schemeFinder')} subtitle="Discover schemes you're eligible for">
      <div className="max-w-6xl mx-auto">
        {/* Search + filter bar */}
        <div className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search schemes, keywords..."
              className="input-field pl-9"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-2 ${showFilters ? 'bg-saffron-500/20' : ''}`}
          >
            <Filter size={15} /> Filters <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="glass-card p-5 mb-6 grid grid-cols-2 md:grid-cols-5 gap-4 animate-slide-up">
            <div>
              <label className="text-xs text-white/50 mb-1 block">Age</label>
              <input type="number" value={filters.age} onChange={e => setFilters(p => ({ ...p, age: e.target.value }))}
                className="input-field" placeholder="Your age" />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Gender</label>
              <select value={filters.gender} onChange={e => setFilters(p => ({ ...p, gender: e.target.value }))}
                className="input-field">
                <option value="">Any</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Occupation</label>
              <select value={filters.occupation} onChange={e => setFilters(p => ({ ...p, occupation: e.target.value }))}
                className="input-field">
                <option value="">Any</option>
                {OCCUPATIONS.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">State</label>
              <select value={filters.state} onChange={e => setFilters(p => ({ ...p, state: e.target.value }))}
                className="input-field">
                <option value="">Any State</option>
                {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/50 mb-1 block">Income</label>
              <select value={filters.income} onChange={e => setFilters(p => ({ ...p, income: e.target.value }))}
                className="input-field">
                <option value="">Any</option>
                {INCOME_RANGES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                category === cat
                  ? 'text-white'
                  : 'text-white/50 hover:text-white/80'
              }`}
              style={category === cat
                ? { background: 'linear-gradient(135deg, #FF8A00, #ea7c00)' }
                : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-sm text-white/40 mb-4">
          Showing <span className="text-saffron-500 font-medium">{filtered.length}</span> schemes
        </div>

        {/* Scheme cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(scheme => (
            <div key={scheme.id} className="glass-card glass-card-hover p-5 flex flex-col gap-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: `${getCategoryColor(scheme.category)}15`,
                        color: getCategoryColor(scheme.category),
                        border: `1px solid ${getCategoryColor(scheme.category)}30`,
                      }}
                    >
                      {scheme.category}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-white leading-tight">{scheme.name}</h3>
                </div>
                <button
                  onClick={() => toggleSave(scheme)}
                  className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${
                    savedIds.has(scheme.id) ? 'text-saffron-500' : 'text-white/30 hover:text-saffron-500'
                  }`}
                  title={savedIds.has(scheme.id) ? 'Unsave' : 'Save scheme'}
                >
                  {savedIds.has(scheme.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-white/60 leading-relaxed flex-1">{scheme.description}</p>

              {/* Benefits */}
              <div className="rounded-lg p-3" style={{ background: 'rgba(22,199,132,0.08)', border: '1px solid rgba(22,199,132,0.15)' }}>
                <div className="text-xs font-medium text-emerald-500 mb-0.5">Benefits</div>
                <div className="text-xs text-white/70">{scheme.benefits}</div>
              </div>

              {/* Eligibility */}
              <div className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <div className="text-xs font-medium text-blue-400 mb-0.5">Eligibility</div>
                <div className="text-xs text-white/70">{scheme.eligibility}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {scheme.tags.slice(0, 4).map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(241,245,249,0.4)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Tag size={9} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-xs text-white/30">{scheme.ministry}</span>
                {scheme.link && (
                  <a href={scheme.link} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-saffron-500 hover:underline flex items-center gap-1">
                    Apply <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search size={40} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/40">No schemes found matching your search</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }} className="text-saffron-500 text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
