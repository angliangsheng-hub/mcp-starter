import React from 'react';
import { Search, Bookmark, Sun, Moon, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import { MarketCategory } from '../types/market';

interface HeaderProps {
  currentCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  isWatchlistOpen: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  isWatchlistOpen,
  theme,
  onToggleTheme,
}) => {
  const categories: { id: MarketCategory; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'indices', label: 'Indices' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
    { id: 'heatmap', label: 'Heatmap' },
  ];

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${
      theme === 'dark' 
        ? 'bg-[#131722]/95 border-[#2a2e39] text-[#d1d4dc] backdrop-blur-md' 
        : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-md'
    }`}>
      {/* Top 3-Zone Navigation Bar */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        
        {/* Zone 1: TradingView Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectCategory('overview')}
            className="flex items-center gap-2.5 focus:outline-none group text-left"
            title="TradingView Markets"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2962ff] to-[#00bcd4] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M4 19h16v2H4v-2zm1-5h3v4H5v-4zm5-6h3v10h-3V8zm5-5h3v15h-3V3z" />
              </svg>
            </div>
            <div className="flex items-baseline">
              <span className={`text-lg font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                TradingView
              </span>
              <span className="ml-1 text-xs font-semibold text-[#2962ff] tracking-wide">
                MARKETS
              </span>
            </div>
          </button>

          {/* Regular market status badge */}
          <div className="hidden lg:flex items-center gap-1.5 ml-2 text-[11px] font-medium text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>US Markets Open</span>
          </div>
        </div>

        {/* Zone 2: Primary Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-[#2a2e39] text-white shadow-sm'
                      : 'bg-slate-100 text-[#2962ff] shadow-sm'
                    : theme === 'dark'
                      ? 'text-[#787b86] hover:text-[#d1d4dc] hover:bg-[#1e222d]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Search, Watchlist, Theme) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSearch}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-colors ${
              theme === 'dark'
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc] hover:border-[#363a45]'
                : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
            title="Search symbols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search market</span>
            <kbd className={`hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded ${
              theme === 'dark' ? 'bg-[#2a2e39] text-[#b2b5be]' : 'bg-white text-slate-600'
            }`}>
              ⌘K
            </kbd>
          </button>

          <button
            onClick={onToggleWatchlist}
            className={`relative flex items-center justify-center p-2 rounded-md border transition-colors ${
              isWatchlistOpen
                ? 'bg-[#2962ff] text-white border-[#2962ff]'
                : theme === 'dark'
                  ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title="Toggle Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2962ff] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-md border transition-colors ${
              theme === 'dark'
                ? 'bg-[#1e222d] border-[#2a2e39] text-[#787b86] hover:text-[#d1d4dc]'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Category Tab bar */}
      <div className={`md:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t ${
        theme === 'dark' ? 'border-[#2a2e39] bg-[#1a1e29]' : 'border-slate-200 bg-slate-50'
      }`}>
        {categories.map((cat) => {
          const isActive = currentCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded whitespace-nowrap ${
                isActive
                  ? 'bg-[#2962ff] text-white'
                  : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
