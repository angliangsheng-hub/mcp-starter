import React, { useState, useEffect, useRef } from 'react';
import { MarketSymbol } from '../types/market';
import { Search, X, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  theme: 'dark' | 'light';
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
  theme,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = symbols.filter(s =>
    s.symbol.toLowerCase().includes(query.toLowerCase()) ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        onSelectSymbol(filtered[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-xs"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-xl rounded-xl border shadow-2xl overflow-hidden transition-all ${
          theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-inherit gap-3">
          <Search className="w-4 h-4 text-[#2962ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search stock, crypto, forex, index, or commodity..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className={`w-full text-sm bg-transparent focus:outline-none ${
              theme === 'dark' ? 'text-white placeholder-[#787b86]' : 'text-slate-900 placeholder-slate-400'
            }`}
          />
          <button 
            onClick={onClose}
            className={`p-1 rounded text-xs ${theme === 'dark' ? 'text-[#787b86] hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-inherit">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#787b86]">
              No instruments found matching "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = item.change >= 0;

              return (
                <div
                  key={item.symbol}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? theme === 'dark' ? 'bg-[#2a2e39]' : 'bg-slate-100'
                      : 'hover:bg-inherit'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: item.logoColor }}
                    >
                      {item.logoLetter}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {item.symbol}
                        </span>
                        <span className={`text-[10px] px-1 rounded uppercase ${
                          theme === 'dark' ? 'bg-[#131722] text-[#787b86]' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#787b86] truncate max-w-xs">{item.name}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}>
                      {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                      <span>{isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className={`p-2.5 border-t text-[11px] flex items-center justify-between ${
          theme === 'dark' ? 'border-[#2a2e39] text-[#787b86] bg-[#181c27]' : 'border-slate-200 text-slate-500 bg-slate-50'
        }`}>
          <span>Navigate with <kbd className="px-1 rounded bg-black/20 font-mono">↑</kbd> <kbd className="px-1 rounded bg-black/20 font-mono">↓</kbd></span>
          <span>Select with <kbd className="px-1 rounded bg-black/20 font-mono">Enter</kbd></span>
        </div>
      </div>
    </div>
  );
};
