import React, { useState, useEffect } from 'react';
import { MarketCategory, MarketSymbol, Position } from './types/market';
import { 
  INITIAL_MARKET_SYMBOLS, 
  HEATMAP_DATA, 
  BREAKING_NEWS, 
  ECONOMIC_CALENDAR 
} from './data/mockMarkets';
import { Header } from './components/Header';
import { TickerTape } from './components/TickerTape';
import { MarketHero } from './components/MarketHero';
import { MarketHeatmap } from './components/MarketHeatmap';
import { MarketMoversTable } from './components/MarketMoversTable';
import { ForexMatrix } from './components/ForexMatrix';
import { CryptoDominance } from './components/CryptoDominance';
import { NewsAndCalendar } from './components/NewsAndCalendar';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { SymbolModal } from './components/SymbolModal';
import { SearchModal } from './components/SearchModal';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  ShieldAlert, 
  Compass, 
  Briefcase, 
  Globe2 
} from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('tv_theme') as 'dark' | 'light') || 'dark';
  });

  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('overview');
  const [symbols, setSymbols] = useState<MarketSymbol[]>(INITIAL_MARKET_SYMBOLS);
  const [selectedHeroSymbol, setSelectedHeroSymbol] = useState<MarketSymbol>(INITIAL_MARKET_SYMBOLS[0]);
  const [modalSymbol, setModalSymbol] = useState<MarketSymbol | null>(null);
  const [updatedSymbol, setUpdatedSymbol] = useState<string | undefined>(undefined);

  // Watchlist state
  const [watchlistSymbols, setWatchlistSymbols] = useState<string[]>(() => {
    const saved = localStorage.getItem('tv_watchlist');
    return saved ? JSON.parse(saved) : ['SPX', 'NVDA', 'BTCUSD', 'AAPL', 'CL1!'];
  });
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Paper Trading state
  const [accountBalance, setAccountBalance] = useState<number>(100000.0);
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos-1',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      type: 'BUY',
      qty: 25,
      entryPrice: 132.50,
      currentPrice: 138.25,
      pnl: 143.75,
      pnlPercent: 4.34,
      timestamp: 'Today, 09:35 AM'
    },
    {
      id: 'pos-2',
      symbol: 'BTCUSD',
      name: 'Bitcoin',
      type: 'BUY',
      qty: 0.5,
      entryPrice: 65400.00,
      currentPrice: 67420.00,
      pnl: 1010.00,
      pnlPercent: 3.09,
      timestamp: 'Yesterday'
    }
  ]);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('tv_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#131722';
      document.body.style.color = '#d1d4dc';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [theme]);

  // Persist watchlist
  useEffect(() => {
    localStorage.setItem('tv_watchlist', JSON.stringify(watchlistSymbols));
  }, [watchlistSymbols]);

  // Keyboard shortcut listener (Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Simulate real-time market ticks every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSymbols(prevSymbols => {
        // Pick a random symbol to tick
        const randomIndex = Math.floor(Math.random() * prevSymbols.length);
        const target = prevSymbols[randomIndex];
        if (!target) return prevSymbols;

        const isForexOrBond = target.category === 'forex' || target.category === 'bonds';
        const deltaPct = (Math.random() - 0.49) * (isForexOrBond ? 0.002 : 0.005);
        const oldPrice = target.price;
        const newPrice = Number(Math.max(oldPrice * (1 + deltaPct), 0.01).toFixed(isForexOrBond ? 4 : 2));
        const priceDiff = Number((newPrice - target.prevClose).toFixed(isForexOrBond ? 4 : 2));
        const newPct = Number(((priceDiff / target.prevClose) * 100).toFixed(2));

        const updatedTarget: MarketSymbol = {
          ...target,
          price: newPrice,
          change: priceDiff,
          changePercent: newPct,
          high: Math.max(target.high, newPrice),
          low: Math.min(target.low, newPrice),
          sparkline: [...target.sparkline.slice(1), newPrice]
        };

        setUpdatedSymbol(target.symbol);

        // Update hero symbol if it's currently selected
        setSelectedHeroSymbol(current => current.symbol === target.symbol ? updatedTarget : current);

        const newArr = [...prevSymbols];
        newArr[randomIndex] = updatedTarget;
        return newArr;
      });

      // Update unrealized P&L on open positions
      setPositions(prevPositions => 
        prevPositions.map(pos => {
          const sym = symbols.find(s => s.symbol === pos.symbol);
          if (!sym) return pos;
          const currentPrice = sym.price;
          const priceDiff = pos.type === 'BUY' 
            ? (currentPrice - pos.entryPrice) 
            : (pos.entryPrice - currentPrice);
          const pnl = Number((priceDiff * pos.qty).toFixed(2));
          const pnlPercent = Number(((priceDiff / pos.entryPrice) * 100).toFixed(2));
          return {
            ...pos,
            currentPrice,
            pnl,
            pnlPercent
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [symbols]);

  // Toggle watchlist symbol
  const handleToggleWatchlist = (target: MarketSymbol) => {
    setWatchlistSymbols(prev => {
      if (prev.includes(target.symbol)) {
        return prev.filter(s => s !== target.symbol);
      } else {
        return [...prev, target.symbol];
      }
    });
  };

  // Execute paper trade
  const handleExecuteTrade = (symbol: MarketSymbol, type: 'BUY' | 'SELL', qty: number) => {
    const cost = symbol.price * qty;
    if (type === 'BUY') {
      setAccountBalance(prev => prev - cost);
    } else {
      setAccountBalance(prev => prev + cost);
    }

    const newPosition: Position = {
      id: `pos-${Date.now()}`,
      symbol: symbol.symbol,
      name: symbol.name,
      type,
      qty,
      entryPrice: symbol.price,
      currentPrice: symbol.price,
      pnl: 0,
      pnlPercent: 0,
      timestamp: 'Just now'
    };

    setPositions(prev => [newPosition, ...prev]);
  };

  // Close position
  const handleClosePosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (pos) {
      const proceeds = pos.type === 'BUY' ? pos.currentPrice * pos.qty : -(pos.currentPrice * pos.qty);
      setAccountBalance(prev => prev + proceeds);
      setPositions(prev => prev.filter(p => p.id !== positionId));
    }
  };

  const watchlistedItems = symbols.filter(s => watchlistSymbols.includes(s.symbol));

  // Switch active hero or open full modal
  const handleSelectSymbol = (symbol: MarketSymbol) => {
    setSelectedHeroSymbol(symbol);
    setModalSymbol(symbol);
  };

  const handleSelectSymbolByName = (symbolName: string) => {
    const found = symbols.find(s => s.symbol.toUpperCase() === symbolName.toUpperCase());
    if (found) {
      setSelectedHeroSymbol(found);
      setModalSymbol(found);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark' ? 'bg-[#131722] text-[#d1d4dc]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* TradingView Top Navigation */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlistSymbols.length}
        isWatchlistOpen={isWatchlistOpen}
        theme={theme}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      {/* Real-Time Scrolling Ticker Tape */}
      <TickerTape
        symbols={symbols}
        onSelectSymbol={handleSelectSymbol}
        theme={theme}
        updatedSymbol={updatedSymbol}
      />

      {/* Main Content Viewport */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* OVERVIEW SCREEN */}
        {currentCategory === 'overview' && (
          <div className="space-y-6">
            {/* Top Row: Hero Featured Benchmark + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <MarketHero
                  symbol={selectedHeroSymbol}
                  onOpenDetails={setModalSymbol}
                  onToggleWatchlist={handleToggleWatchlist}
                  isWatchlisted={watchlistSymbols.includes(selectedHeroSymbol.symbol)}
                  theme={theme}
                />
              </div>

              {/* Portfolio / Quick Market Sentiment Card */}
              <div className={`rounded-xl border p-5 flex flex-col justify-between transition-colors ${
                theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39]' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-inherit">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#2962ff]" />
                      <h2 className={`font-extrabold text-sm tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                        Paper Trading Portfolio
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                      LIVE SIMULATION
                    </span>
                  </div>

                  <div className="mt-4">
                    <span className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                      Available Buying Power
                    </span>
                    <div className={`text-2xl font-extrabold font-mono tabular-nums mt-0.5 ${
                      theme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>
                      ${accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Open Positions Summary */}
                  <div className="mt-4 pt-3 border-t border-inherit">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className={theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}>Active Positions ({positions.length})</span>
                      <span className="font-mono font-bold text-emerald-400">
                        +${positions.reduce((acc, p) => acc + p.pnl, 0).toFixed(2)} Total P&L
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {positions.map(p => (
                        <div key={p.id} className={`p-2 rounded text-xs flex items-center justify-between ${
                          theme === 'dark' ? 'bg-[#131722]' : 'bg-slate-50'
                        }`}>
                          <div>
                            <span className="font-bold">{p.symbol}</span>
                            <span className="text-[10px] text-[#787b86] ml-1.5">{p.qty} shs</span>
                          </div>
                          <div className="text-right font-mono tabular-nums">
                            <span className={`font-semibold ${p.pnl >= 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                              {p.pnl >= 0 ? '+' : ''}${p.pnl.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setModalSymbol(selectedHeroSymbol)}
                  className="w-full mt-4 py-2 text-xs font-bold rounded-lg bg-[#2962ff] hover:bg-[#1e4bd8] text-white transition-colors"
                >
                  Trade {selectedHeroSymbol.symbol} Now
                </button>
              </div>
            </div>

            {/* S&P 500 Treemap Heatmap */}
            <MarketHeatmap
              data={HEATMAP_DATA}
              onSelectSymbol={handleSelectSymbolByName}
              theme={theme}
            />

            {/* Market Movers & Screener Table */}
            <MarketMoversTable
              symbols={symbols}
              onSelectSymbol={handleSelectSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistSymbols={watchlistSymbols}
              theme={theme}
              updatedSymbol={updatedSymbol}
            />

            {/* News and Economic Calendar */}
            <NewsAndCalendar
              news={BREAKING_NEWS}
              events={ECONOMIC_CALENDAR}
              theme={theme}
              onSelectSymbol={handleSelectSymbolByName}
            />
          </div>
        )}

        {/* STOCKS SCREEN */}
        {currentCategory === 'stocks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                  Global Stocks Overview
                </h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                  Real-time stock quotes, institutional volume, earnings ratios, and corporate fundamentals
                </p>
              </div>
            </div>

            <MarketMoversTable
              symbols={symbols.filter(s => s.category === 'stocks')}
              onSelectSymbol={handleSelectSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistSymbols={watchlistSymbols}
              theme={theme}
              updatedSymbol={updatedSymbol}
            />

            <MarketHeatmap
              data={HEATMAP_DATA}
              onSelectSymbol={handleSelectSymbolByName}
              theme={theme}
            />
          </div>
        )}

        {/* CRYPTO SCREEN */}
        {currentCategory === 'crypto' && (
          <div className="space-y-6">
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Cryptocurrency Markets
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Digital asset pairs, spot Bitcoin ETF accumulation, Layer-1 ecosystems, and 24h market liquidity
              </p>
            </div>

            <CryptoDominance
              theme={theme}
              onSelectCoin={handleSelectSymbolByName}
            />

            <MarketHero
              symbol={symbols.find(s => s.symbol === 'BTCUSD') || selectedHeroSymbol}
              onOpenDetails={setModalSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              isWatchlisted={watchlistSymbols.includes('BTCUSD')}
              theme={theme}
            />

            <MarketMoversTable
              symbols={symbols.filter(s => s.category === 'crypto')}
              onSelectSymbol={handleSelectSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistSymbols={watchlistSymbols}
              theme={theme}
              updatedSymbol={updatedSymbol}
            />
          </div>
        )}

        {/* FOREX SCREEN */}
        {currentCategory === 'forex' && (
          <div className="space-y-6">
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Foreign Exchange (Forex) Markets
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Interbank currency cross rates, US Dollar Index momentum, and central bank interest rate yield spreads
              </p>
            </div>

            <ForexMatrix
              theme={theme}
              onSelectPair={handleSelectSymbolByName}
            />

            <MarketMoversTable
              symbols={symbols.filter(s => s.category === 'forex')}
              onSelectSymbol={handleSelectSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistSymbols={watchlistSymbols}
              theme={theme}
              updatedSymbol={updatedSymbol}
            />
          </div>
        )}

        {/* INDICES SCREEN */}
        {currentCategory === 'indices' && (
          <div className="space-y-6">
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                World Indices & Benchmarks
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Americas, Europe, and Asia-Pacific flagship stock indices tracking equity performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {symbols.filter(s => s.category === 'indices').map(idx => (
                <div
                  key={idx.symbol}
                  onClick={() => handleSelectSymbol(idx)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                    theme === 'dark' ? 'bg-[#1e222d] border-[#2a2e39] hover:border-[#363a45]' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#2962ff]">{idx.symbol}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      idx.change >= 0 ? 'bg-[#089981]/15 text-[#089981]' : 'bg-[#f23645]/15 text-[#f23645]'
                    }`}>
                      {idx.change >= 0 ? '+' : ''}{idx.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <h3 className={`font-bold text-xs mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    {idx.name}
                  </h3>
                  <div className="text-xl font-mono font-bold mt-2 tabular-nums">
                    {idx.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <p className="text-[11px] text-[#787b86] mt-2 line-clamp-2">{idx.description}</p>
                </div>
              ))}
            </div>

            <MarketHero
              symbol={selectedHeroSymbol}
              onOpenDetails={setModalSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              isWatchlisted={watchlistSymbols.includes(selectedHeroSymbol.symbol)}
              theme={theme}
            />
          </div>
        )}

        {/* FUTURES & COMMODITIES SCREEN */}
        {currentCategory === 'futures' && (
          <div className="space-y-6">
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Futures & Commodities
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Crude oil energy benchmarks, gold and silver precious metals, agriculture and raw industrial inputs
              </p>
            </div>

            <MarketMoversTable
              symbols={symbols.filter(s => s.category === 'futures')}
              onSelectSymbol={handleSelectSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistSymbols={watchlistSymbols}
              theme={theme}
              updatedSymbol={updatedSymbol}
            />
          </div>
        )}

        {/* BONDS SCREEN */}
        {currentCategory === 'bonds' && (
          <div className="space-y-6">
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Government Bond Yields & Debt
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Sovereign treasury yield curves, 10Y-2Y inversion spread metrics, and benchmark borrowing costs
              </p>
            </div>

            <MarketMoversTable
              symbols={symbols.filter(s => s.category === 'bonds')}
              onSelectSymbol={handleSelectSymbol}
              onToggleWatchlist={handleToggleWatchlist}
              watchlistSymbols={watchlistSymbols}
              theme={theme}
              updatedSymbol={updatedSymbol}
            />
          </div>
        )}

        {/* HEATMAP FULLSCREEN SCREEN */}
        {currentCategory === 'heatmap' && (
          <div className="space-y-6">
            <div>
              <h1 className={`text-xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                Interactive Market Heatmaps
              </h1>
              <p className={`text-xs ${theme === 'dark' ? 'text-[#787b86]' : 'text-slate-500'}`}>
                Bird's-eye view of sector relative strength and institutional capital rotation across S&P 500 sectors
              </p>
            </div>

            <MarketHeatmap
              data={HEATMAP_DATA}
              onSelectSymbol={handleSelectSymbolByName}
              theme={theme}
            />
          </div>
        )}

      </main>

      {/* Symbol Details & Trading Studio Modal */}
      <SymbolModal
        symbol={modalSymbol}
        onClose={() => setModalSymbol(null)}
        onToggleWatchlist={handleToggleWatchlist}
        isWatchlisted={modalSymbol ? watchlistSymbols.includes(modalSymbol.symbol) : false}
        theme={theme}
        accountBalance={accountBalance}
        positions={positions}
        onExecuteTrade={handleExecuteTrade}
        onClosePosition={handleClosePosition}
      />

      {/* Watchlist Sidebar */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlistedItems}
        onSelectSymbol={handleSelectSymbol}
        onRemoveFromWatchlist={(sym) => setWatchlistSymbols(prev => prev.filter(s => s !== sym))}
        theme={theme}
      />

      {/* Global Spotlight Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={handleSelectSymbol}
        theme={theme}
      />
    </div>
  );
}
