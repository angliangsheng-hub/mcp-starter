import React from 'react';
import { TrendingUp, PieChart, ShieldCheck, Flame, Compass } from 'lucide-react';

interface CryptoDominanceProps {
  theme: 'dark' | 'light';
  onSelectCoin: (coinSymbol: string) => void;
}

export const CryptoDominance: React.FC<CryptoDominanceProps> = ({ theme, onSelectCoin }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Market Cap */}
      <div className={`rounded-xl border p-4 transition-colors ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#787b86]">
          <span>Crypto Market Cap</span>
          <PieChart className="w-4 h-4 text-[#2962ff]" />
        </div>
        <div className={`text-xl font-extrabold tracking-tight mt-2 tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          $2.42 Trillion
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#089981]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+2.84% (24h)</span>
        </div>
      </div>

      {/* 24h Trading Volume */}
      <div className={`rounded-xl border p-4 transition-colors ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#787b86]">
          <span>24h Global Volume</span>
          <Flame className="w-4 h-4 text-amber-500" />
        </div>
        <div className={`text-xl font-extrabold tracking-tight mt-2 tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          $94.85 Billion
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-[#089981]">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+14.2% activity</span>
        </div>
      </div>

      {/* Bitcoin & Ethereum Dominance */}
      <div className={`rounded-xl border p-4 transition-colors ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#787b86]">
          <span>Bitcoin Dominance</span>
          <Compass className="w-4 h-4 text-[#f7931a]" />
        </div>
        <div className="flex items-baseline justify-between mt-2">
          <span className={`text-xl font-extrabold tracking-tight tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            58.2%
          </span>
          <span className="text-xs text-[#787b86]">ETH: 14.5%</span>
        </div>
        {/* Dominance dual bar */}
        <div className="w-full h-2 rounded-full overflow-hidden flex gap-0.5 mt-2 bg-[#131722]">
          <div className="bg-[#f7931a] h-full" style={{ width: '58.2%' }} title="BTC 58.2%" />
          <div className="bg-[#627eea] h-full" style={{ width: '14.5%' }} title="ETH 14.5%" />
          <div className="bg-[#10b981] h-full" style={{ width: '27.3%' }} title="Others 27.3%" />
        </div>
      </div>

      {/* Fear & Greed Index */}
      <div className={`rounded-xl border p-4 transition-colors ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between text-xs text-[#787b86]">
          <span>Sentiment Index</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-xl font-extrabold text-[#089981] tabular-nums">71</span>
          <span className="text-xs font-bold text-[#089981]">Greed</span>
        </div>
        <div className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
          Previous: 68 (Greed) · Last month: 54
        </div>
      </div>
    </div>
  );
};
