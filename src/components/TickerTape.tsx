import React from 'react';
import { MarketSymbol } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerTapeProps {
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
  theme: 'dark' | 'light';
  updatedSymbol?: string;
}

export const TickerTape: React.FC<TickerTapeProps> = ({
  symbols,
  onSelectSymbol,
  theme,
  updatedSymbol,
}) => {
  // Take premier marquee symbols
  const primaryTickers = symbols.filter(s => 
    ['SPX', 'NDX', 'DJI', 'BTCUSD', 'ETHUSD', 'NVDA', 'AAPL', 'XAUUSD', 'CL1!', 'EURUSD', 'US10Y'].includes(s.symbol)
  );

  return (
    <div className={`w-full overflow-hidden border-b select-none ${
      theme === 'dark' 
        ? 'bg-[#1e222d] border-[#2a2e39]' 
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex animate-ticker py-2">
        {/* Double the list for seamless continuous infinite marquee */}
        {[...primaryTickers, ...primaryTickers].map((item, index) => {
          const isPositive = item.change >= 0;
          const isJustUpdated = updatedSymbol === item.symbol;
          
          return (
            <button
              key={`${item.symbol}-${index}`}
              onClick={() => onSelectSymbol(item)}
              className={`flex items-center gap-2.5 px-4 py-1 mx-1 rounded text-xs transition-colors group cursor-pointer ${
                theme === 'dark'
                  ? 'hover:bg-[#2a2e39]/80'
                  : 'hover:bg-slate-200/70'
              } ${isJustUpdated ? (isPositive ? 'tick-up' : 'tick-down') : ''}`}
            >
              {/* Symbol Badge / Letter */}
              <div 
                className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                style={{ backgroundColor: item.logoColor }}
              >
                {item.logoLetter}
              </div>

              <div className="flex flex-col text-left">
                <span className={`font-bold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {item.symbol}
                </span>
                <span className="text-[10px] text-[#787b86] truncate max-w-[80px]">
                  {item.name}
                </span>
              </div>

              <div className="flex flex-col items-end tabular-nums">
                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {item.category === 'bonds' ? `${item.price.toFixed(3)}%` : `$${item.price.toLocaleString(undefined, { minimumFractionDigits: item.price < 10 ? 3 : 2, maximumFractionDigits: item.price < 10 ? 3 : 2 })}`}
                </span>
                <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${
                  isPositive ? 'text-[#089981]' : 'text-[#f23645]'
                }`}>
                  {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  <span>{isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                </div>
              </div>

              {/* Mini Sparkline Preview */}
              <svg className="w-12 h-5 stroke-current fill-none ml-1 hidden sm:block opacity-75 group-hover:opacity-100" viewBox="0 0 50 20">
                <polyline
                  fill="none"
                  stroke={isPositive ? '#089981' : '#f23645'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={item.sparkline.map((val, idx) => {
                    const min = Math.min(...item.sparkline);
                    const max = Math.max(...item.sparkline);
                    const range = max - min || 1;
                    const x = (idx / (item.sparkline.length - 1)) * 48 + 1;
                    const y = 18 - ((val - min) / range) * 16;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </svg>

              <div className={`w-[1px] h-6 ml-2 ${theme === 'dark' ? 'bg-[#2a2e39]' : 'bg-slate-200'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};
