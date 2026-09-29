import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Archive, X, Wand2 } from 'lucide-react';
import { vaultItems, vaultCategories, vaultEras } from '../data/vaultData';
import { VaultCard } from '../components/VaultCard';

export const VaultPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEra, setSelectedEra] = useState('All');

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return vaultItems.filter((item) => {
      const matchesSearch =
        !term ||
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term);
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesEra = selectedEra === 'All' || item.era === selectedEra;
      return matchesSearch && matchesCategory && matchesEra;
    });
  }, [searchTerm, selectedCategory, selectedEra]);

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'All' || selectedEra !== 'All';

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedEra('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-retro-amber text-xs font-mono font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>THE NOSTALGIA VAULT</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white">
          RELIVE THE CLASSICS
        </h1>
        <p className="text-slate-400 text-sm sm:text-base mt-3">
          Find the movies, shows, cartoons and games that made your childhood unforgettable.
        </p>

        {/* Search bar */}
        <div className="relative mt-6 max-w-md mx-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your childhood..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0F131D] border border-slate-700/80 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-retro-amber focus:ring-1 focus:ring-retro-amber transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col items-center gap-4 mb-10">
        {/* Category filters */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          {vaultCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-retro-amber text-slate-950 font-bold shadow-glow-amber'
                  : 'bg-[#0F131D] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Era filters */}
        <div className="flex items-center gap-1 bg-[#0F131D] p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedEra('All')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
              selectedEra === 'All'
                ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ALL ERAS
          </button>
          {vaultEras.map((era) => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                selectedEra === era
                  ? 'bg-retro-cyan/20 text-retro-cyan border border-retro-cyan/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {era}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/30 transition-all"
          >
            <X className="w-3.5 h-3.5" />
            Clear Filters
          </button>
        )}
      </div>

      {/* Content grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <VaultCard key={item.title} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-[#0F131D]/40 border border-dashed border-slate-800 max-w-xl mx-auto p-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-retro-amber flex items-center justify-center mx-auto mb-3">
            <Archive className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-200">Nothing found in the vault</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try a different search term, or clear your filters to see everything.
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-retro-amber text-slate-950 font-bold text-xs shadow-glow-amber hover:bg-amber-400 transition-all"
          >
            <X className="w-4 h-4" />
            <span>Clear Filters</span>
          </button>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="relative mt-16 rounded-3xl bg-gradient-to-r from-[#181120] via-[#101422] to-[#1B190E] border border-retro-amber/40 p-8 sm:p-12 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-retro-amber/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
            CAN'T FIND YOUR CHILDHOOD?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Tell us what you remember and we'll add it to the vault.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-retro-amber via-retro-orange to-retro-pink text-slate-950 font-display font-bold text-sm tracking-wide shadow-glow-amber hover:opacity-95 transition-all"
          >
            <Wand2 className="w-4 h-4" />
            <span>Suggest a Memory</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
