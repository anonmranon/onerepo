import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const COINS = [
  { id: 'bitcoin',      label: 'BTC/USD' },
  { id: 'ethereum',     label: 'ETH/USD' },
  { id: 'solana',       label: 'SOL/USD' },
  { id: 'ripple',       label: 'XRP/USD' },
  { id: 'binancecoin',  label: 'BNB/USD' },
  { id: 'cardano',      label: 'ADA/USD' },
  { id: 'pax-gold',     label: 'GOLD/USD' },
];

const COIN_IDS = COINS.map(c => c.id).join(',');
const ENDPOINT = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd&include_24hr_change=true`;
const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

function fmt(price) {
  if (price >= 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (price >= 1)    return price.toFixed(4);
  return price.toFixed(6);
}

export default function LiveTicker() {
  const [prices, setPrices] = useState({});
  const [error, setError]   = useState(false);

  const fetchPrices = async () => {
    try {
      const res  = await fetch(ENDPOINT, {
        headers: {
          'x-cg-demo-api-key': API_KEY
        }
      });
      const data = await res.json();
      setPrices(data);
      setError(false);
    } catch {
      setError(true);
    }
  };

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 30_000); // refresh every 30 s
    return () => clearInterval(id);
  }, []);

  if (error || Object.keys(prices).length === 0) {
    // Skeleton shimmer while loading / on network error
    return (
      <div className="w-full bg-[#0d0d0f] py-2.5 px-4 overflow-hidden">
        <div className="flex gap-8 animate-pulse">
          {COINS.map(c => (
            <div key={c.id} className="flex gap-2 items-center flex-shrink-0">
              <div className="h-3 w-14 bg-white/10 rounded" />
              <div className="h-3 w-20 bg-white/10 rounded" />
              <div className="h-3 w-12 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const items = COINS.filter(c => prices[c.id]).map(c => {
    const usd    = prices[c.id]?.usd ?? 0;
    const change = prices[c.id]?.usd_24h_change ?? 0;
    return { ...c, usd, change };
  });

  // Duplicate items so the marquee loops seamlessly
  const scrollItems = [...items, ...items];

  return (
    <div
      className="relative w-full bg-[#0d0d0f] overflow-hidden select-none border-b border-white/5"
      style={{ height: '40px' }}
    >
      <div
        className="flex items-center gap-0"
        style={{
          animation: 'ticker-scroll 40s linear infinite',
          width: 'max-content',
        }}
      >
        {scrollItems.map((item, i) => {
          const positive = item.change >= 0;
          return (
            <div
              key={`${item.id}-${i}`}
              className="flex items-center gap-2 px-6 h-10 border-r border-white/5 flex-shrink-0"
            >
              <span className="text-white/60 text-xs font-semibold tracking-wider">
                {item.label}
              </span>
              <span className="text-white text-xs font-mono font-bold">
                ${fmt(item.usd)}
              </span>
              <span
                className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  positive
                    ? 'text-emerald-400 bg-emerald-400/10'
                    : 'text-red-400 bg-red-400/10'
                }`}
              >
                {positive ? (
                  <TrendingUp className="w-2.5 h-2.5" />
                ) : (
                  <TrendingDown className="w-2.5 h-2.5" />
                )}
                {positive ? '+' : ''}{item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Right edge fade — tells mobile users there's more content */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0d0d0f] to-transparent pointer-events-none lg:hidden" />
    </div>
  );
}
