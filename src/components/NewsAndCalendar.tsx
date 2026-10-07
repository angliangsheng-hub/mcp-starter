import React, { useState } from 'react';
import { NewsItem, EconomicEvent } from '../types/market';
import { Newspaper, Calendar, ExternalLink, Clock, AlertCircle } from 'lucide-react';

interface NewsAndCalendarProps {
  news: NewsItem[];
  events: EconomicEvent[];
  theme: 'dark' | 'light';
  onSelectSymbol: (symbol: string) => void;
}

export const NewsAndCalendar: React.FC<NewsAndCalendarProps> = ({
  news,
  events,
  theme,
  onSelectSymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'calendar'>('news');

  return (
    <div className={`rounded-xl border p-5 transition-colors ${
      theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header with Switcher Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-inherit">
        <div className="flex items-center gap-1 p-0.5 rounded-lg border bg-inherit">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'news'
                ? 'bg-[#2962ff] text-white shadow-xs'
                : theme === 'dark' ? 'text-[#787b86] hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Market News</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeTab === 'calendar'
                ? 'bg-[#2962ff] text-white shadow-xs'
                : theme === 'dark' ? 'text-[#787b86] hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Economic Calendar</span>
          </button>
        </div>

        <span className={`text-[11px] font-medium hidden sm:inline ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
          Live Financial Dispatch
        </span>
      </div>

      {/* Content View */}
      <div className="mt-4">
        {activeTab === 'news' ? (
          <div className="space-y-3.5">
            {news.map((item) => (
              <div 
                key={item.id} 
                className={`p-3 rounded-lg border transition-all ${
                  theme === 'dark' 
                    ? 'bg-[#131722]/60 border-[#2a2e39] hover:border-[#363a45]' 
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-[#787b86]">
                    <span className="font-semibold text-[#2962ff]">{item.source}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {item.timeAgo}
                    </span>
                  </div>

                  {/* Impact Tag */}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded capitalize ${
                    item.impact === 'bullish' 
                      ? 'bg-[#089981]/15 text-[#089981]' 
                      : item.impact === 'bearish'
                        ? 'bg-[#f23645]/15 text-[#f23645]'
                        : 'bg-slate-500/15 text-slate-400'
                  }`}>
                    {item.impact}
                  </span>
                </div>

                <h4 className={`text-xs font-semibold leading-relaxed ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {item.title}
                </h4>

                {/* Related Symbols */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`text-[10px] ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>Mentioned:</span>
                  {item.symbols.map(sym => (
                    <button
                      key={sym}
                      onClick={() => onSelectSymbol(sym)}
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded hover:bg-[#2962ff] hover:text-white transition-colors ${
                        theme === 'dark' ? 'bg-[#1e222d] text-[#2962ff]' : 'bg-slate-200 text-[#2962ff]'
                      }`}
                    >
                      ${sym}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Economic Calendar */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-[11px] font-semibold select-none ${
                  theme === 'dark' ? 'border-[#2a2e39] text-[#787b86]' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Cur</th>
                  <th className="py-2.5 px-3">Event</th>
                  <th className="py-2.5 px-3 text-center">Impact</th>
                  <th className="py-2.5 px-3 text-right">Actual</th>
                  <th className="py-2.5 px-3 text-right">Forecast</th>
                  <th className="py-2.5 px-3 text-right">Prior</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-inherit">
                {events.map((evt) => (
                  <tr key={evt.id} className={theme === 'dark' ? 'hover:bg-[#2a2e39]/40' : 'hover:bg-slate-50'}>
                    <td className="py-2.5 px-3 font-mono tabular-nums text-[#787b86]">
                      {evt.time}
                    </td>
                    <td className={`py-2.5 px-3 font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {evt.currency}
                    </td>
                    <td className={`py-2.5 px-3 font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                      {evt.event}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.impact === 'high' 
                          ? 'bg-[#f23645]/20 text-[#f23645]' 
                          : evt.impact === 'medium'
                            ? 'bg-amber-500/20 text-amber-500'
                            : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {evt.impact}
                      </span>
                    </td>
                    <td className={`py-2.5 px-3 text-right font-mono tabular-nums font-bold ${
                      evt.actual ? 'text-[#089981]' : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-400'
                    }`}>
                      {evt.actual || '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#787b86]">
                      {evt.forecast}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-[#787b86]">
                      {evt.previous}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
