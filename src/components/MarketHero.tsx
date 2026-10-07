import React, { useState } from 'react';
import { MarketSymbol, Candle } from '../types/market';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart2, 
  Maximize2, 
  Bookmark, 
  Layers, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface MarketHeroProps {
  symbol: MarketSymbol;
  onOpenDetails: (symbol: MarketSymbol) => void;
  onToggleWatchlist: (symbol: MarketSymbol) => void;
  isWatchlisted: boolean;
  theme: 'dark' | 'light';
}

export const MarketHero: React.FC<MarketHeroProps> = ({
  symbol,
  onOpenDetails,
  onToggleWatchlist,
  isWatchlisted,
  theme,
}) => {
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles');
  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y'>('1M');
  const [showMA, setShowMA] = useState(true);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const candles = symbol.candles;
  const isPositive = symbol.change >= 0;

  // Active hover candle or last candle
  const activeCandle = hoverIndex !== null && candles[hoverIndex] 
    ? candles[hoverIndex] 
    : candles[candles.length - 1];

  // Min and max for chart scale
  const prices = candles.flatMap(c => [c.low, c.high]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 260;
  const chartWidth = 720;
  const candleWidth = (chartWidth / candles.length) * 0.7;

  // Calculate 10-period moving average for demo
  const maPoints = candles.map((_, idx) => {
    if (idx < 5) return null;
    const slice = candles.slice(idx - 5, idx + 1);
    const avg = slice.reduce((acc, c) => acc + c.close, 0) / slice.length;
    return avg;
  });

  return (
    <div className={`rounded-xl border p-5 transition-colors ${
      theme === 'dark' 
        ? 'bg-[#1e222d] border-[#2a2e39]' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-extrabold text-white shadow"
            style={{ backgroundColor: symbol.logoColor }}
          >
            {symbol.logoLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {symbol.symbol}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-[#2962ff]/10 text-[#2962ff]">
                {symbol.exchange}
              </span>
              <span className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                {symbol.category.toUpperCase()}
              </span>
            </div>
            <p className={`text-xs truncate max-w-sm ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
              {symbol.name}
            </p>
          </div>
        </div>

        {/* Current Price & Action CTAs */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className={`text-2xl font-extrabold tracking-tight tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {symbol.currency === 'USD' ? '$' : ''}{symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {symbol.category === 'bonds' ? '%' : ''}
            </div>
            <div className={`flex items-center justify-end gap-1 text-xs font-bold tabular-nums ${
              isPositive ? 'text-[#089981]' : 'text-[#f23645]'
            }`}>
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{isPositive ? '+' : ''}{symbol.change > 0 ? symbol.change.toFixed(2) : symbol.change.toFixed(2)}</span>
              <span>({isPositive ? '+' : ''}{symbol.changePercent.toFixed(2)}%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isWatchlisted
                  ? 'bg-[#2962ff] text-white border-[#2962ff]'
                  : theme === 'dark'
                    ? 'border-[#2a2e39] text-[#d1d4dc] hover:bg-[#2a2e39]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenDetails(symbol)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#2962ff] hover:bg-[#1e4bd8] text-white text-xs font-bold transition-colors shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Chart Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar: Timeframes, Indicators, Chart Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-inherit">
        {/* Timeframe selector */}
        <div className="flex items-center gap-1">
          {(['1D', '5D', '1M', '6M', 'YTD', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                timeframe === tf
                  ? theme === 'dark' ? 'bg-[#2a2e39] text-white' : 'bg-slate-200 text-slate-900 font-bold'
                  : theme === 'dark' ? 'text-[#787b86] hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart type & overlay toggles */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center p-0.5 rounded border ${theme === 'dark' ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-100 border-slate-200'}`}>
            <button
              onClick={() => setChartMode('candles')}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                chartMode === 'candles' 
                  ? 'bg-[#2962ff] text-white shadow-xs' 
                  : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartMode('line')}
              className={`px-2 py-0.5 text-xs font-medium rounded transition-colors ${
                chartMode === 'line' 
                  ? 'bg-[#2962ff] text-white shadow-xs' 
                  : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'
              }`}
            >
              Area
            </button>
          </div>

          <button
            onClick={() => setShowMA(!showMA)}
            className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors flex items-center gap-1 ${
              showMA
                ? 'border-[#2962ff] text-[#2962ff] bg-[#2962ff]/10'
                : theme === 'dark'
                  ? 'border-[#2a2e39] text-[#787b86]'
                  : 'border-slate-200 text-slate-600'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>EMA (20)</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas with Live Hover Crosshair */}
      <div className="relative mt-3">
        {/* Dynamic Hover HUD Readout */}
        <div className="flex flex-wrap items-center gap-3 text-xs tabular-nums mb-2 font-mono">
          <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>
            {activeCandle ? activeCandle.time : 'Current'}:
          </span>
          <span><strong className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>O:</strong> ${activeCandle?.open.toFixed(2)}</span>
          <span><strong className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>H:</strong> ${activeCandle?.high.toFixed(2)}</span>
          <span><strong className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>L:</strong> ${activeCandle?.low.toFixed(2)}</span>
          <span><strong className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>C:</strong> ${activeCandle?.close.toFixed(2)}</span>
          <span className="hidden sm:inline">
            <strong className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>Vol:</strong> {activeCandle ? (activeCandle.volume / 1000000).toFixed(2) : 0}M
          </span>
        </div>

        {/* SVG Interactive Financial Chart */}
        <div className="w-full overflow-hidden">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-56 sm:h-64 cursor-crosshair select-none"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* Background Grid Lines */}
            {[0.2, 0.4, 0.6, 0.8].map((pct, idx) => {
              const y = chartHeight * pct;
              const val = maxPrice - pct * priceRange;
              return (
                <g key={idx}>
                  <line 
                    x1="0" 
                    y1={y} 
                    x2={chartWidth - 50} 
                    y2={y} 
                    stroke={theme === 'dark' ? '#2a2e39' : '#e2e8f0'} 
                    strokeDasharray="2,2" 
                    strokeWidth="1"
                  />
                  <text 
                    x={chartWidth - 45} 
                    y={y + 3} 
                    fontSize="9" 
                    fill={theme === 'dark' ? '#787b86' : '#94a3b8'}
                    fontFamily="monospace"
                  >
                    ${val.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* Volume bars at bottom */}
            {candles.map((candle, idx) => {
              const x = (idx / (candles.length - 1)) * (chartWidth - 60);
              const maxVol = Math.max(...candles.map(c => c.volume));
              const volHeight = (candle.volume / maxVol) * 45;
              const isUp = candle.close >= candle.open;

              return (
                <rect
                  key={`vol-${idx}`}
                  x={x - candleWidth / 2}
                  y={chartHeight - volHeight}
                  width={candleWidth}
                  height={volHeight}
                  fill={isUp ? '#089981' : '#f23645'}
                  opacity={hoverIndex === idx ? 0.6 : 0.25}
                />
              );
            })}

            {/* Moving Average Line */}
            {showMA && (
              <polyline
                fill="none"
                stroke="#2962ff"
                strokeWidth="1.75"
                strokeDasharray="4,2"
                points={maPoints.map((val, idx) => {
                  if (val === null) return '';
                  const x = (idx / (candles.length - 1)) * (chartWidth - 60);
                  const y = chartHeight * 0.75 - ((val - minPrice) / priceRange) * (chartHeight * 0.65);
                  return `${x},${y}`;
                }).filter(Boolean).join(' ')}
              />
            )}

            {/* Candlestick Mode */}
            {chartMode === 'candles' ? (
              candles.map((candle, idx) => {
                const x = (idx / (candles.length - 1)) * (chartWidth - 60);
                const isUp = candle.close >= candle.open;
                const highY = chartHeight * 0.75 - ((candle.high - minPrice) / priceRange) * (chartHeight * 0.65);
                const lowY = chartHeight * 0.75 - ((candle.low - minPrice) / priceRange) * (chartHeight * 0.65);
                const openY = chartHeight * 0.75 - ((candle.open - minPrice) / priceRange) * (chartHeight * 0.65);
                const closeY = chartHeight * 0.75 - ((candle.close - minPrice) / priceRange) * (chartHeight * 0.65);
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

                const color = isUp ? '#089981' : '#f23645';

                return (
                  <g 
                    key={`candle-${idx}`} 
                    className="cursor-pointer"
                    onMouseEnter={() => setHoverIndex(idx)}
                  >
                    {/* Candle Wick */}
                    <line
                      x1={x}
                      y1={highY}
                      x2={x}
                      y2={lowY}
                      stroke={color}
                      strokeWidth="1.2"
                    />
                    {/* Candle Real Body */}
                    <rect
                      x={x - candleWidth / 2}
                      y={bodyTop}
                      width={candleWidth}
                      height={bodyHeight}
                      fill={color}
                      rx="1"
                    />
                  </g>
                );
              })
            ) : (
              /* Area / Line Mode */
              <>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#areaGradient)"
                  points={`
                    0,${chartHeight}
                    ${candles.map((c, idx) => {
                      const x = (idx / (candles.length - 1)) * (chartWidth - 60);
                      const y = chartHeight * 0.75 - ((c.close - minPrice) / priceRange) * (chartHeight * 0.65);
                      return `${x},${y}`;
                    }).join(' ')}
                    ${chartWidth - 60},${chartHeight}
                  `}
                />
                <polyline
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={candles.map((c, idx) => {
                    const x = (idx / (candles.length - 1)) * (chartWidth - 60);
                    const y = chartHeight * 0.75 - ((c.close - minPrice) / priceRange) * (chartHeight * 0.65);
                    return `${x},${y}`;
                  }).join(' ')}
                />
              </>
            )}

            {/* Hover Crosshair Guide */}
            {hoverIndex !== null && (
              <line
                x1={(hoverIndex / (candles.length - 1)) * (chartWidth - 60)}
                y1="0"
                x2={(hoverIndex / (candles.length - 1)) * (chartWidth - 60)}
                y2={chartHeight}
                stroke={theme === 'dark' ? '#d1d4dc' : '#475569'}
                strokeDasharray="3,3"
                strokeWidth="1"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Bottom Metrics Bar & Technical Gauge */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-inherit text-xs">
        <div>
          <span className={`block ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>Day Range</span>
          <span className={`font-mono font-semibold tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            ${symbol.low.toFixed(2)} - ${symbol.high.toFixed(2)}
          </span>
        </div>

        <div>
          <span className={`block ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>52-Week Range</span>
          <span className={`font-mono font-semibold tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            ${symbol.fiftyTwoWeekLow.toFixed(2)} - ${symbol.fiftyTwoWeekHigh.toFixed(2)}
          </span>
        </div>

        <div>
          <span className={`block ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>Volume</span>
          <span className={`font-mono font-semibold tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {symbol.volume}
          </span>
        </div>

        <div>
          <span className={`block ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>Market Cap</span>
          <span className={`font-mono font-semibold tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {symbol.marketCap}
          </span>
        </div>

        <div>
          <span className={`block ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>P/E Ratio</span>
          <span className={`font-mono font-semibold tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {symbol.peRatio ? symbol.peRatio.toFixed(1) : '—'}
          </span>
        </div>

        {/* Technical Analysis Gauge */}
        <div className="col-span-2 md:col-span-1">
          <span className={`block ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>Technical Rating</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-2 h-2 rounded-full ${
              symbol.rating.includes('Buy') ? 'bg-[#089981]' : symbol.rating === 'Neutral' ? 'bg-amber-400' : 'bg-[#f23645]'
            }`} />
            <span className={`font-bold ${
              symbol.rating.includes('Buy') ? 'text-[#089981]' : symbol.rating === 'Neutral' ? 'text-amber-500' : 'text-[#f23645]'
            }`}>
              {symbol.rating}
            </span>
            <span className={`text-[10px] ml-auto font-mono ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
              {symbol.ratingScore}/100
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
