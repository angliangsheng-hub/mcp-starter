import React from 'react';
import { MarketSymbol } from '../types/market';
import { X, TrendingUp, TrendingDown, Trash2, ArrowRight } from 'lucide-react';

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  onRemoveFromWatchlist: (symbol: string) => void;
  theme: 'dark' | 'light';
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  onSelectSymbol,
  onRemoveFromWatchlist,
  theme,
}) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 z-50 w-80 shadow-2xl border-l flex flex-col transition-all ${
      theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-inherit">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2962ff]" />
          <h3 className={`font-extrabold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Watchlist ({watchlistSymbols.length})
          </h3>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded hover:bg-black/10 transition-colors ${
            theme === 'dark' ? 'text-[#787b86] hover:text-white' : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Symbol List */}
      <div className="flex-1 overflow-y-auto divide-y divide-inherit">
        {watchlistSymbols.length === 0 ? (
          <div className="text-center py-16 px-4">
            <p className="text-xs text-[#787b86]">
              Your watchlist is empty. Click the bookmark icon on any ticker to save it here.
            </p>
          </div>
        ) : (
          watchlistSymbols.map((item) => {
            const isPositive = item.change >= 0;

            return (
              <div
                key={item.symbol}
                onClick={() => onSelectSymbol(item)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors group ${
                  theme === 'dark' ? 'hover:bg-[#2a2e39]/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-7 h-7 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                    style={{ backgroundColor: item.logoColor }}
                  >
                    {item.logoLetter}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold text-xs ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        {item.symbol}
                      </span>
                      <span className="text-[10px] text-[#787b86]">{item.exchange}</span>
                    </div>
                    <div className="text-[10px] text-[#787b86] truncate max-w-[100px]">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right tabular-nums font-mono">
                    <div className={`text-xs font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {item.category === 'bonds' ? `${item.price.toFixed(3)}%` : `$${item.price.toFixed(2)}`}
                    </div>
                    <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                      isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                    }`}>
                      {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWatchlist(item.symbol);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-opacity"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className={`p-3 border-t text-[11px] text-center ${
        theme === 'dark' ? 'border-[#2a2e39] text-[#787b86] bg-[#181c27]' : 'border-slate-200 text-slate-500 bg-slate-50'
      }`}>
        <span>Syncs across all TradingView tabs</span>
      </div>
    </div>
  );
};
