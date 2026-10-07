import React, { useState } from 'react';
import { MarketSymbol, Position } from '../types/market';
import { 
  X, 
  TrendingUp, 
  TrendingDown, 
  Bookmark, 
  Layers, 
  Maximize2, 
  DollarSign, 
  Briefcase, 
  Activity, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

interface SymbolModalProps {
  symbol: MarketSymbol | null;
  onClose: () => void;
  onToggleWatchlist: (symbol: MarketSymbol) => void;
  isWatchlisted: boolean;
  theme: 'dark' | 'light';
  accountBalance: number;
  positions: Position[];
  onExecuteTrade: (symbol: MarketSymbol, type: 'BUY' | 'SELL', qty: number) => void;
  onClosePosition: (positionId: string) => void;
}

export const SymbolModal: React.FC<SymbolModalProps> = ({
  symbol,
  onClose,
  onToggleWatchlist,
  isWatchlisted,
  theme,
  accountBalance,
  positions,
  onExecuteTrade,
  onClosePosition,
}) => {
  if (!symbol) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '6M' | '1Y'>('1M');
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles');
  const [showRSI, setShowRSI] = useState(false);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQty, setTradeQty] = useState<number>(10);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);

  const candles = symbol.candles;
  const isPositive = symbol.change >= 0;

  // Min and max for chart scale
  const prices = candles.flatMap(c => [c.low, c.high]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const chartHeight = 320;
  const chartWidth = 840;
  const candleWidth = (chartWidth / candles.length) * 0.7;

  // Moving average line
  const maPoints = candles.map((_, idx) => {
    if (idx < 5) return null;
    const slice = candles.slice(idx - 5, idx + 1);
    return slice.reduce((acc, c) => acc + c.close, 0) / slice.length;
  });

  const handleTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tradeQty <= 0) return;
    onExecuteTrade(symbol, tradeType, tradeQty);
    setTradeSuccessMsg(`Successfully executed ${tradeType} order for ${tradeQty} shares of ${symbol.symbol}`);
    setTimeout(() => setTradeSuccessMsg(null), 3500);
  };

  const symbolPositions = positions.filter(p => p.symbol === symbol.symbol);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className={`relative w-full max-w-5xl rounded-2xl border shadow-2xl overflow-hidden my-auto ${
        theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39] text-[#d1d4dc]' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-inherit">
          <div className="flex items-center gap-3.5">
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shadow"
              style={{ backgroundColor: symbol.logoColor }}
            >
              {symbol.logoLetter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  {symbol.symbol}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded font-bold bg-[#2962ff]/10 text-[#2962ff]">
                  {symbol.exchange}
                </span>
                <span className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                  {symbol.category.toUpperCase()}
                </span>
              </div>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                {symbol.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onToggleWatchlist(symbol)}
              className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                isWatchlisted
                  ? 'bg-[#2962ff] text-white border-[#2962ff]'
                  : theme === 'dark'
                    ? 'border-[#2a2e39] text-[#d1d4dc] hover:bg-[#2a2e39]'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
            >
              <Bookmark className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-lg border transition-colors ${
                theme === 'dark' ? 'border-[#2a2e39] text-[#787b86] hover:text-white' : 'border-slate-200 text-slate-400 hover:text-slate-800'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-6">
          {/* Price Bar & Timeframe Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-inherit">
            <div>
              <div className={`text-3xl font-extrabold tabular-nums ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ${symbol.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center gap-1.5 text-xs font-bold tabular-nums mt-0.5 ${
                isPositive ? 'text-[#089981]' : 'text-[#f23645]'
              }`}>
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{isPositive ? '+' : ''}{symbol.change.toFixed(2)}</span>
                <span>({isPositive ? '+' : ''}{symbol.changePercent.toFixed(2)}%)</span>
                <span className={`font-normal ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-400'}`}>Today</span>
              </div>
            </div>

            {/* Chart Toolbar */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center p-0.5 rounded border ${theme === 'dark' ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-100 border-slate-200'}`}>
                {(['1D', '5D', '1M', '6M', '1Y'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      timeframe === tf 
                        ? 'bg-[#2962ff] text-white' 
                        : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className={`flex items-center p-0.5 rounded border ${theme === 'dark' ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-100 border-slate-200'}`}>
                <button
                  onClick={() => setChartMode('candles')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    chartMode === 'candles' ? 'bg-[#2962ff] text-white' : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'
                  }`}
                >
                  Candlestick
                </button>
                <button
                  onClick={() => setChartMode('line')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded ${
                    chartMode === 'line' ? 'bg-[#2962ff] text-white' : theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'
                  }`}
                >
                  Area
                </button>
              </div>

              <button
                onClick={() => setShowRSI(!showRSI)}
                className={`px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                  showRSI
                    ? 'border-[#2962ff] text-[#2962ff] bg-[#2962ff]/10'
                    : theme === 'dark' ? 'border-[#2a2e39] text-[#787b86]' : 'border-slate-200 text-slate-600'
                }`}
              >
                RSI (14)
              </button>
            </div>
          </div>

          {/* Interactive Chart Visualizer */}
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-64 sm:h-72 select-none">
              {/* Grid Lines */}
              {[0.2, 0.4, 0.6, 0.8].map((pct, idx) => {
                const y = chartHeight * pct;
                const val = maxPrice - pct * priceRange;
                return (
                  <g key={idx}>
                    <line 
                      x1="0" 
                      y1={y} 
                      x2={chartWidth - 55} 
                      y2={y} 
                      stroke={theme === 'dark' ? '#2a2e39' : '#e2e8f0'} 
                      strokeDasharray="2,2" 
                      strokeWidth="1"
                    />
                    <text 
                      x={chartWidth - 50} 
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

              {/* Volume bars */}
              {candles.map((candle, idx) => {
                const x = (idx / (candles.length - 1)) * (chartWidth - 65);
                const maxVol = Math.max(...candles.map(c => c.volume));
                const volHeight = (candle.volume / maxVol) * 45;
                const isUp = candle.close >= candle.open;

                return (
                  <rect
                    key={`v-${idx}`}
                    x={x - candleWidth / 2}
                    y={chartHeight - volHeight}
                    width={candleWidth}
                    height={volHeight}
                    fill={isUp ? '#089981' : '#f23645'}
                    opacity="0.3"
                  />
                );
              })}

              {/* MA Line */}
              <polyline
                fill="none"
                stroke="#2962ff"
                strokeWidth="1.5"
                points={maPoints.map((val, idx) => {
                  if (val === null) return '';
                  const x = (idx / (candles.length - 1)) * (chartWidth - 65);
                  const y = chartHeight * 0.75 - ((val - minPrice) / priceRange) * (chartHeight * 0.65);
                  return `${x},${y}`;
                }).filter(Boolean).join(' ')}
              />

              {chartMode === 'candles' ? (
                candles.map((candle, idx) => {
                  const x = (idx / (candles.length - 1)) * (chartWidth - 65);
                  const isUp = candle.close >= candle.open;
                  const highY = chartHeight * 0.75 - ((candle.high - minPrice) / priceRange) * (chartHeight * 0.65);
                  const lowY = chartHeight * 0.75 - ((candle.low - minPrice) / priceRange) * (chartHeight * 0.65);
                  const openY = chartHeight * 0.75 - ((candle.open - minPrice) / priceRange) * (chartHeight * 0.65);
                  const closeY = chartHeight * 0.75 - ((candle.close - minPrice) / priceRange) * (chartHeight * 0.65);
                  const bodyTop = Math.min(openY, closeY);
                  const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
                  const color = isUp ? '#089981' : '#f23645';

                  return (
                    <g key={`c-${idx}`}>
                      <line x1={x} y1={highY} x2={x} y2={lowY} stroke={color} strokeWidth="1.2" />
                      <rect x={x - candleWidth / 2} y={bodyTop} width={candleWidth} height={bodyHeight} fill={color} rx="1" />
                    </g>
                  );
                })
              ) : (
                <polyline
                  fill="none"
                  stroke="#2962ff"
                  strokeWidth="2.5"
                  points={candles.map((c, idx) => {
                    const x = (idx / (candles.length - 1)) * (chartWidth - 65);
                    const y = chartHeight * 0.75 - ((c.close - minPrice) / priceRange) * (chartHeight * 0.65);
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}
            </svg>
          </div>

          {/* Paper Trading Section */}
          <div className={`rounded-xl border p-4 ${
            theme === 'dark' ? 'bg-[#131722] border-[#2a2e39]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#2962ff]" />
                <h3 className={`text-sm font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Simulated Paper Trading Terminal
                </h3>
              </div>
              <span className={`text-xs font-mono font-semibold tabular-nums ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Buying Power: <strong className="text-emerald-500">${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </span>
            </div>

            {/* Quick Order Form */}
            <form onSubmit={handleTradeSubmit} className="flex flex-wrap items-center gap-3">
              <div className="flex items-center p-0.5 rounded border border-inherit">
                <button
                  type="button"
                  onClick={() => setTradeType('BUY')}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${
                    tradeType === 'BUY' ? 'bg-[#089981] text-white' : 'text-[#787b86]'
                  }`}
                >
                  Buy / Long
                </button>
                <button
                  type="button"
                  onClick={() => setTradeType('SELL')}
                  className={`px-3 py-1.5 text-xs font-bold rounded ${
                    tradeType === 'SELL' ? 'bg-[#f23645] text-white' : 'text-[#787b86]'
                  }`}
                >
                  Sell / Short
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-medium">
                <label className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'}>Qty:</label>
                <input
                  type="number"
                  min="1"
                  max="5000"
                  value={tradeQty}
                  onChange={(e) => setTradeQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className={`w-20 px-2 py-1 text-xs rounded border font-mono ${
                    theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39] text-white' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                />
              </div>

              <div className={`text-xs font-mono tabular-nums ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'}`}>
                Total: <strong className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
                  ${(symbol.price * tradeQty).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>

              <button
                type="submit"
                className={`ml-auto px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${
                  tradeType === 'BUY' ? 'bg-[#089981] hover:bg-[#067a67]' : 'bg-[#f23645] hover:bg-[#cc2b38]'
                }`}
              >
                Place {tradeType} Order
              </button>
            </form>

            {tradeSuccessMsg && (
              <div className="mt-2.5 p-2 rounded bg-emerald-500/15 text-emerald-500 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{tradeSuccessMsg}</span>
              </div>
            )}

            {/* Active Position Ledger for this symbol */}
            {symbolPositions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-inherit">
                <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${
                  theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'
                }`}>
                  Open Positions in {symbol.symbol}
                </span>
                <div className="space-y-1.5">
                  {symbolPositions.map(pos => (
                    <div key={pos.id} className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          pos.type === 'BUY' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'
                        }`}>
                          {pos.type}
                        </span>
                        <span>{pos.qty} shares @ ${pos.entryPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-bold ${pos.pnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(2)}%)
                        </span>
                        <button
                          onClick={() => onClosePosition(pos.id)}
                          className="text-[11px] px-2 py-0.5 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Fundamentals & Description */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#131722]/50 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>52-Week High</span>
              <p className={`font-mono font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ${symbol.fiftyTwoWeekHigh.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#131722]/50 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>52-Week Low</span>
              <p className={`font-mono font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                ${symbol.fiftyTwoWeekLow.toFixed(2)}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#131722]/50 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>Beta</span>
              <p className={`font-mono font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {symbol.beta ? symbol.beta.toFixed(2) : '1.00'}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${theme === 'dark' ? 'bg-[#131722]/50 border-[#2a2e39]' : 'bg-slate-50 border-slate-200'}`}>
              <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>Div Yield</span>
              <p className={`font-mono font-bold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {symbol.dividendYield || '—'}
              </p>
            </div>
          </div>

          <div className="text-xs leading-relaxed">
            <span className={`block font-bold mb-1 ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-600'}`}>Company / Asset Profile</span>
            <p className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{symbol.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
