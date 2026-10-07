export type MarketCategory = 
  | 'overview' 
  | 'stocks' 
  | 'crypto' 
  | 'forex' 
  | 'indices' 
  | 'futures' 
  | 'bonds' 
  | 'heatmap';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketSymbol {
  symbol: string;
  name: string;
  category: 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds';
  exchange: string;
  currency: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  prevClose: number;
  high: number;
  low: number;
  volume: string;
  marketCap: string;
  peRatio?: number;
  dividendYield?: string;
  beta?: number;
  eps?: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  rating: TechnicalRating;
  ratingScore: number; // 0 (Strong Sell) to 100 (Strong Buy)
  sparkline: number[];
  candles: Candle[];
  sector?: string;
  logoColor: string;
  logoLetter: string;
  logoUrl?: string;
  description: string;
}

export interface HeatmapItem {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  changePercent: number;
  marketCapNumber: number; // in billions for area weighting
  marketCapFormatted: string;
  logoColor: string;
  logoLetter: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  url?: string;
  impact: 'bullish' | 'bearish' | 'neutral';
  symbols: string[];
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  countryCode: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface Position {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  qty: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  timestamp: string;
}
