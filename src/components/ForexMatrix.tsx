import React from 'react';
import { ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';

interface ForexMatrixProps {
  theme: 'dark' | 'light';
  onSelectPair: (pairSymbol: string) => void;
}

export const ForexMatrix: React.FC<ForexMatrixProps> = ({ theme, onSelectPair }) => {
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF'];

  // Cross rates matrix
  const rates: Record<string, Record<string, { rate: string; change: number }>> = {
    USD: {
      USD: { rate: '1.0000', change: 0.00 },
      EUR: { rate: '0.9181', change: 0.26 },
      GBP: { rate: '0.7654', change: -0.14 },
      JPY: { rate: '149.32', change: 0.30 },
      AUD: { rate: '1.4880', change: 0.18 },
      CAD: { rate: '1.3812', change: -0.05 },
      CHF: { rate: '0.8645', change: 0.22 },
    },
    EUR: {
      USD: { rate: '1.0892', change: -0.26 },
      EUR: { rate: '1.0000', change: 0.00 },
      GBP: { rate: '0.8337', change: -0.40 },
      JPY: { rate: '162.63', change: 0.04 },
      AUD: { rate: '1.6208', change: -0.08 },
      CAD: { rate: '1.5044', change: -0.31 },
      CHF: { rate: '0.9416', change: -0.04 },
    },
    GBP: {
      USD: { rate: '1.3065', change: 0.14 },
      EUR: { rate: '1.1995', change: 0.40 },
      GBP: { rate: '1.0000', change: 0.00 },
      JPY: { rate: '195.09', change: 0.44 },
      AUD: { rate: '1.9442', change: 0.32 },
      CAD: { rate: '1.8045', change: 0.09 },
      CHF: { rate: '1.1294', change: 0.36 },
    },
    JPY: {
      USD: { rate: '0.0067', change: -0.30 },
      EUR: { rate: '0.0061', change: -0.04 },
      GBP: { rate: '0.0051', change: -0.44 },
      JPY: { rate: '1.0000', change: 0.00 },
      AUD: { rate: '0.0100', change: -0.12 },
      CAD: { rate: '0.0092', change: -0.35 },
      CHF: { rate: '0.0058', change: -0.08 },
    }
  };

  const currencyStrength = [
    { currency: 'USD', strength: 78, change: '+1.4%', status: 'Strong Bullish' },
    { currency: 'GBP', strength: 65, change: '+0.8%', status: 'Bullish' },
    { currency: 'CHF', strength: 58, change: '+0.2%', status: 'Neutral' },
    { currency: 'CAD', strength: 49, change: '-0.3%', status: 'Neutral' },
    { currency: 'AUD', strength: 44, change: '-0.7%', status: 'Bearish' },
    { currency: 'EUR', strength: 38, change: '-1.1%', status: 'Bearish' },
    { currency: 'JPY', strength: 22, change: '-2.3%', status: 'Strong Bearish' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Forex Cross Rates Matrix */}
      <div className={`lg:col-span-2 rounded-xl border p-5 transition-colors ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2962ff]" />
            <h3 className={`text-sm font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              Forex Cross Rates Matrix
            </h3>
          </div>
          <span className={`text-[11px] ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
            Real-time FX Interbank Rates
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'border-[#2a2e39] text-[#787b86]' : 'border-slate-200 text-slate-500'}`}>
                <th className="py-2 px-3 text-left font-bold">Base \ Quote</th>
                {currencies.map(c => (
                  <th key={c} className="py-2 px-3 font-bold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-inherit">
              {['USD', 'EUR', 'GBP', 'JPY'].map(base => (
                <tr key={base} className={theme === 'dark' ? 'hover:bg-[#2a2e39]/40' : 'hover:bg-slate-50'}>
                  <td className={`py-3 px-3 text-left font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {base}
                  </td>
                  {currencies.map(quote => {
                    if (base === quote) {
                      return (
                        <td key={quote} className={`py-3 px-3 font-mono font-medium ${
                          theme === 'dark' ? 'text-[#787b86] bg-[#131722]/50' : 'text-slate-400 bg-slate-50'
                        }`}>
                          1.0000
                        </td>
                      );
                    }
                    const cell = rates[base]?.[quote] || { rate: '—', change: 0 };
                    const isUp = cell.change > 0;
                    const pairSym = `${base}${quote}`;

                    return (
                      <td 
                        key={quote} 
                        onClick={() => onSelectPair(pairSym)}
                        className={`py-3 px-3 tabular-nums font-mono cursor-pointer transition-colors ${
                          isUp ? 'hover:bg-[#089981]/20' : 'hover:bg-[#f23645]/20'
                        }`}
                        title={`View ${pairSym} chart`}
                      >
                        <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {cell.rate}
                        </div>
                        <div className={`text-[10px] font-bold ${isUp ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isUp ? '+' : ''}{cell.change.toFixed(2)}%
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Currency Strength Meter */}
      <div className={`rounded-xl border p-5 transition-colors ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-sm font-extrabold tracking-tight mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Currency Relative Strength
        </h3>

        <div className="space-y-3">
          {currencyStrength.map((item) => (
            <div key={item.currency} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>{item.currency}</span>
                  <span className={`text-[10px] ${
                    item.status.includes('Bullish') ? 'text-[#089981]' : item.status.includes('Bearish') ? 'text-[#f23645]' : 'text-amber-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono tabular-nums text-xs font-semibold">
                  <span className={item.change.startsWith('+') ? 'text-[#089981]' : 'text-[#f23645]'}>
                    {item.change}
                  </span>
                  <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>
                    {item.strength}%
                  </span>
                </div>
              </div>

              {/* Progress meter bar */}
              <div className={`w-full h-2 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-[#131722]' : 'bg-slate-100'
              }`}>
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.strength > 60 ? 'bg-[#089981]' : item.strength > 40 ? 'bg-amber-500' : 'bg-[#f23645]'
                  }`}
                  style={{ width: `${item.strength}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
