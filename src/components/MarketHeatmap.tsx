import React, { useState } from 'react';
import { HeatmapItem } from '../types/market';
import { Layers, ZoomIn, Filter } from 'lucide-react';

interface MarketHeatmapProps {
  data: HeatmapItem[];
  onSelectSymbol: (symbol: string) => void;
  theme: 'dark' | 'light';
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  data,
  onSelectSymbol,
  theme,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [hoveredItem, setHoveredItem] = useState<HeatmapItem | null>(null);

  const sectors = ['All', ...Array.from(new Set(data.map(d => d.sector)))];

  const filteredData = selectedSector === 'All'
    ? data
    : data.filter(d => d.sector === selectedSector);

  // Group items by sector
  const groupedSectors = Array.from(new Set(filteredData.map(d => d.sector)));

  // Color generator based on TradingView heatmap palette
  const getPerformanceColor = (change: number) => {
    if (change >= 3) return 'bg-[#089981] hover:bg-[#078570] text-white';
    if (change >= 1.5) return 'bg-[#0e9f6e] hover:bg-[#0c8a5f] text-white';
    if (change > 0) return 'bg-[#15803d] hover:bg-[#166534] text-white';
    if (change === 0) return 'bg-[#4b5563] text-white';
    if (change > -1.5) return 'bg-[#b91c1c] hover:bg-[#991b1b] text-white';
    if (change > -3) return 'bg-[#dc2626] hover:bg-[#b91c1c] text-white';
    return 'bg-[#f23645] hover:bg-[#d62837] text-white';
  };

  return (
    <div className={`rounded-xl border p-5 transition-colors ${
      theme === 'dark' 
        ? 'bg-[#1e222d] border-[#2a2e39]' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Title & Sector Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#2962ff]" />
            <h2 className={`text-base font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              S&P 500 Market Heatmap
            </h2>
          </div>
          <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
            Tile size weighted by Market Cap · Color coded by Daily Performance
          </p>
        </div>

        {/* Sector Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
                selectedSector === sec
                  ? 'bg-[#2962ff] text-white'
                  : theme === 'dark'
                    ? 'bg-[#131722] text-[#787b86] hover:text-white hover:bg-[#2a2e39]'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-[11px] mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>Scale:</span>
          <div className="flex items-center gap-1 font-mono font-bold text-[10px]">
            <span className="px-1.5 py-0.5 rounded bg-[#f23645] text-white">-3%+</span>
            <span className="px-1.5 py-0.5 rounded bg-[#dc2626] text-white">-1.5%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#4b5563] text-white">0%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#15803d] text-white">+1.5%</span>
            <span className="px-1.5 py-0.5 rounded bg-[#089981] text-white">+3%+</span>
          </div>
        </div>
        <span className={`text-[11px] font-mono ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
          Click any stock to inspect
        </span>
      </div>

      {/* Heatmap Treemap Grid */}
      <div className="space-y-3">
        {groupedSectors.map((sector) => {
          const sectorItems = filteredData.filter(d => d.sector === sector);
          const totalWeight = sectorItems.reduce((acc, curr) => acc + curr.marketCapNumber, 0);

          return (
            <div 
              key={sector} 
              className={`rounded-lg p-2.5 border transition-colors ${
                theme === 'dark' ? 'bg-[#131722]/80 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
              }`}
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between text-xs font-bold mb-2 px-1">
                <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{sector}</span>
                <span className={`text-[10px] font-mono ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                  ${(totalWeight / 1000).toFixed(2)}T Weight
                </span>
              </div>

              {/* Flex Grid with Weight Sizing */}
              <div className="flex flex-wrap gap-1.5">
                {sectorItems.map((item) => {
                  // Flex-basis percentage derived from market cap proportion
                  const weightPct = Math.max(Math.min((item.marketCapNumber / totalWeight) * 100, 48), 12);
                  const isPositive = item.changePercent >= 0;

                  return (
                    <button
                      key={item.symbol}
                      onClick={() => onSelectSymbol(item.symbol)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{ flexGrow: item.marketCapNumber, minWidth: '85px', height: '76px' }}
                      className={`relative rounded-md p-2 flex flex-col justify-between transition-all duration-150 cursor-pointer text-left shadow-xs ${getPerformanceColor(item.changePercent)}`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-sm tracking-tight drop-shadow-xs">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-semibold opacity-90 truncate max-w-[60px]">
                          {item.name}
                        </span>
                      </div>

                      <div className="w-full flex items-baseline justify-between tabular-nums font-mono">
                        <span className="text-xs font-semibold drop-shadow-xs">
                          ${item.price.toFixed(1)}
                        </span>
                        <span className="text-xs font-extrabold drop-shadow-xs">
                          {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Tooltip / Inspector Card */}
      {hoveredItem && (
        <div className={`mt-3 p-2.5 rounded-lg border flex items-center justify-between text-xs tabular-nums animate-fade-in ${
          theme === 'dark' ? 'bg-[#181c27] border-[#2a2e39]' : 'bg-slate-100 border-slate-300'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#2962ff]">{hoveredItem.symbol}</span>
            <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{hoveredItem.name}</span>
            <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>·</span>
            <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>{hoveredItem.sector}</span>
          </div>
          <div className="flex items-center gap-4 font-mono font-semibold">
            <span>Price: ${hoveredItem.price.toFixed(2)}</span>
            <span className={hoveredItem.changePercent >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}>
              {hoveredItem.changePercent >= 0 ? '+' : ''}{hoveredItem.changePercent.toFixed(2)}%
            </span>
            <span>Cap: {hoveredItem.marketCapFormatted}</span>
          </div>
        </div>
      )}
    </div>
  );
};
