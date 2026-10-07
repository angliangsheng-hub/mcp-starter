import React, { useState } from 'react';
import { MarketSymbol } from '../types/market';
import { 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Bookmark, 
  ArrowUpDown, 
  SlidersHorizontal,
  Plus,
  Check
} from 'lucide-react';

interface MarketMoversTableProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onToggleWatchlist: (symbol: MarketSymbol) => void;
  watchlistSymbols: string[];
  theme: 'dark' | 'light';
  updatedSymbol?: string;
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  symbols,
  onSelectSymbol,
  onToggleWatchlist,
  watchlistSymbols,
  theme,
  updatedSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'gainers' | 'losers' | 'megacap' | 'dividend'>('gainers');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<'changePercent' | 'price' | 'volume' | 'name'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort items
  let filtered = symbols.filter(s => {
    const matchesSearch = s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  // Apply tab filters
  if (activeTab === 'gainers') {
    filtered = filtered.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
  } else if (activeTab === 'losers') {
    filtered = filtered.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
  } else if (activeTab === 'active') {
    filtered = filtered.sort((a, b) => b.volume.localeCompare(a.volume));
  } else if (activeTab === 'megacap') {
    filtered = filtered.filter(s => s.marketCap.includes('T') || s.marketCap.includes('B'));
  } else if (activeTab === 'dividend') {
    filtered = filtered.filter(s => s.dividendYield && s.dividendYield !== '—');
  }

  // Column Sort
  const handleSort = (field: 'changePercent' | 'price' | 'volume' | 'name') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sorted = [...filtered].sort((a, b) => {
    let modifier = sortOrder === 'asc' ? 1 : -1;
    if (sortField === 'changePercent') {
      return (a.changePercent - b.changePercent) * modifier;
    }
    if (sortField === 'price') {
      return (a.price - b.price) * modifier;
    }
    if (sortField === 'name') {
      return a.symbol.localeCompare(b.symbol) * modifier;
    }
    return 0;
  });

  return (
    <div className={`rounded-xl border p-5 transition-colors ${
      theme === 'dark' 
        ? 'bg-[#1e222d] border-[#2a2e39]' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-inherit">
        
        {/* Screener Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {[
            { id: 'gainers', label: 'Top Gainers' },
            { id: 'losers', label: 'Top Losers' },
            { id: 'active', label: 'Most Active' },
            { id: 'megacap', label: 'Market Leaders' },
            { id: 'dividend', label: 'High Dividend' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#2962ff] text-white shadow-sm'
                  : theme === 'dark'
                    ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className={`w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 ${
              theme === 'dark' ? 'text-[#787b86]' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Filter ticker or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-8 pr-3 py-1.5 text-xs rounded-md border w-44 sm:w-56 focus:outline-none focus:ring-1 focus:ring-[#2962ff] ${
                theme === 'dark'
                  ? 'bg-[#131722] border-[#2a2e39] text-white placeholder-[#787b86]'
                  : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
              }`}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className={`px-2.5 py-1.5 text-xs rounded-md border focus:outline-none ${
              theme === 'dark'
                ? 'bg-[#131722] border-[#2a2e39] text-[#d1d4dc]'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="all">All Assets</option>
            <option value="stocks">Stocks</option>
            <option value="crypto">Crypto</option>
            <option value="forex">Forex</option>
            <option value="indices">Indices</option>
            <option value="futures">Futures</option>
            <option value="bonds">Bonds</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider select-none ${
              theme === 'dark' ? 'border-[#2a2e39] text-[#787b86]' : 'border-slate-200 text-slate-500'
            }`}>
              <th 
                className="py-3 px-3 cursor-pointer hover:text-white"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  <span>Symbol / Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right">Change ($)</th>
              <th 
                className="py-3 px-3 text-right cursor-pointer hover:text-white"
                onClick={() => handleSort('changePercent')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change (%)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-center hidden md:table-cell">Technical Rating</th>
              <th className="py-3 px-3 text-right hidden sm:table-cell">Volume</th>
              <th className="py-3 px-3 text-right hidden lg:table-cell">Market Cap</th>
              <th className="py-3 px-3 text-right hidden xl:table-cell">P/E</th>
              <th className="py-3 px-3 text-center hidden sm:table-cell">7D Chart</th>
              <th className="py-3 px-3 text-center">Watch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit">
            {sorted.map((item) => {
              const isPositive = item.change >= 0;
              const isWatchlisted = watchlistSymbols.includes(item.symbol);
              const isJustUpdated = updatedSymbol === item.symbol;

              return (
                <tr
                  key={item.symbol}
                  onClick={() => onSelectSymbol(item)}
                  className={`group cursor-pointer transition-colors ${
                    theme === 'dark'
                      ? 'hover:bg-[#2a2e39]/50'
                      : 'hover:bg-slate-50'
                  } ${isJustUpdated ? (isPositive ? 'tick-up' : 'tick-down') : ''}`}
                >
                  {/* Symbol & Name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: item.logoColor }}
                      >
                        {item.logoLetter}
                      </div>
                      <div className="truncate max-w-[140px] sm:max-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                            {item.symbol}
                          </span>
                          <span className={`text-[10px] px-1 rounded ${
                            theme === 'dark' ? 'bg-[#2a2e39] text-[#787b86]' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {item.exchange}
                          </span>
                        </div>
                        <div className={`text-[11px] truncate ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-3 text-right tabular-nums font-mono font-semibold">
                    <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                      {item.category === 'bonds' ? `${item.price.toFixed(3)}%` : `$${item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 3 : 2, maximumFractionDigits: item.price < 10 ? 3 : 2 })}`}
                    </span>
                  </td>

                  {/* Change $ */}
                  <td className={`py-3 px-3 text-right tabular-nums font-mono font-semibold ${
                    isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}>
                    {isPositive ? '+' : ''}{item.change.toFixed(2)}
                  </td>

                  {/* Change % */}
                  <td className="py-3 px-3 text-right tabular-nums font-mono">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-bold text-xs ${
                      isPositive 
                        ? 'bg-[#089981]/15 text-[#089981]' 
                        : 'bg-[#f23645]/15 text-[#f23645]'
                    }`}>
                      {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </span>
                  </td>

                  {/* Technical Rating */}
                  <td className="py-3 px-3 text-center hidden md:table-cell">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      item.rating.includes('Buy')
                        ? 'bg-[#089981]/15 text-[#089981]'
                        : item.rating === 'Neutral'
                          ? 'bg-amber-500/15 text-amber-500'
                          : 'bg-[#f23645]/15 text-[#f23645]'
                    }`}>
                      {item.rating}
                    </span>
                  </td>

                  {/* Volume */}
                  <td className={`py-3 px-3 text-right tabular-nums font-mono hidden sm:table-cell ${
                    theme === 'dark' ? 'text-[#d1d4dc]' : 'text-slate-700'
                  }`}>
                    {item.volume}
                  </td>

                  {/* Market Cap */}
                  <td className={`py-3 px-3 text-right tabular-nums font-mono hidden lg:table-cell ${
                    theme === 'dark' ? 'text-[#d1d4dc]' : 'text-slate-700'
                  }`}>
                    {item.marketCap}
                  </td>

                  {/* P/E Ratio */}
                  <td className={`py-3 px-3 text-right tabular-nums font-mono hidden xl:table-cell ${
                    theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'
                  }`}>
                    {item.peRatio ? item.peRatio.toFixed(1) : '—'}
                  </td>

                  {/* Sparkline Chart */}
                  <td className="py-3 px-3 text-center hidden sm:table-cell">
                    <svg className="w-20 h-6 mx-auto stroke-current fill-none" viewBox="0 0 60 20">
                      <polyline
                        fill="none"
                        stroke={isPositive ? '#089981' : '#f23645'}
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        points={item.sparkline.map((val, idx) => {
                          const min = Math.min(...item.sparkline);
                          const max = Math.max(...item.sparkline);
                          const range = max - min || 1;
                          const x = (idx / (item.sparkline.length - 1)) * 58 + 1;
                          const y = 18 - ((val - min) / range) * 16;
                          return `${x},${y}`;
                        }).join(' ')}
                      />
                    </svg>
                  </td>

                  {/* Watchlist Action */}
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleWatchlist(item)}
                      className={`p-1.5 rounded transition-colors ${
                        isWatchlisted
                          ? 'text-[#2962ff] bg-[#2962ff]/10'
                          : theme === 'dark'
                            ? 'text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                            : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
                    >
                      {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className={`text-center py-12 ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-400'}`}>
          No financial assets match your search criteria.
        </div>
      )}
    </div>
  );
};
