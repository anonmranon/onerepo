import { useState, useEffect } from 'react';

const INITIAL_TICKERS = [
  { symbol: 'EUR/USD', price: 1.08945, change: 0.34,  positive: true,  digits: 5 },
  { symbol: 'GBP/USD', price: 1.27210, change: 0.12,  positive: true,  digits: 5 },
  { symbol: 'USD/JPY', price: 155.62,  change: -0.22, positive: false, digits: 2 },
  { symbol: 'AAPL',    price: 185.92,  change: 1.42,  positive: true,  digits: 2 },
  { symbol: 'TSLA',    price: 174.60,  change: -2.40, positive: false, digits: 2 },
  { symbol: 'BTC/USD', price: 43890.0, change: -0.85, positive: false, digits: 2 },
  { symbol: 'GOLD',    price: 2315.30, change: 0.65,  positive: true,  digits: 2 },
];

export default function TickerBar() {
  const [tickers, setTickers] = useState(INITIAL_TICKERS);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers((prev) =>
        prev.map((t) => {
          const changePercent = (Math.random() - 0.5) * 0.05;
          const newPrice      = t.price + t.price * (changePercent / 100);
          const newChange     = t.change + changePercent;
          return {
            ...t,
            price:    parseFloat(newPrice.toFixed(t.digits)),
            change:   parseFloat(newChange.toFixed(2)),
            positive: newChange >= 0,
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    /* mt-16 clears the fixed 64px navbar */
    <div
      className="relative border-b border-white/5 bg-[#121214] select-none"
      aria-label="Live Market Ticker"
    >
      {/* Scrollable ticker row — overflow-x-auto so mobile can swipe; scrollbar-none hides the webkit scrollbar thumb */}
      <div className="overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8 py-3 w-max lg:w-full lg:justify-between">
          {tickers.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2 flex-shrink-0 transition-all duration-300">
              <span className="text-white font-bold text-xs tracking-wider">{item.symbol}</span>
              <span className="text-white/60 text-xs font-mono">
                {item.price.toLocaleString(undefined, {
                  minimumFractionDigits:  item.digits,
                  maximumFractionDigits: item.digits,
                })}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 transition-colors duration-300 ${
                  item.positive ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'
                }`}
              >
                <span>{item.positive ? '▲' : '▼'}</span>
                <span>{Math.abs(item.change).toFixed(2)}%</span>
              </span>
            </div>
          ))}

          <span className="hidden xl:block text-[9px] text-white/20 font-medium flex-shrink-0">
            *Prices illustrative only
          </span>
        </div>
      </div>

      {/* Right edge fade — tells mobile users there's more content */}
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#121214] to-transparent pointer-events-none lg:hidden" />
    </div>
  );
}
