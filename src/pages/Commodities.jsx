import { Link } from 'react-router-dom';
import StatsBar from '../components/StatsBar';

const COMMODITIES = [
  { name: 'Gold', symbol: 'XAUUSD', category: 'Precious Metals', spread: '$0.30', leverage: '1:100', emoji: '🥇', desc: 'The world\'s premier safe-haven asset. Trade gold against the US Dollar and capitalise on inflation hedging and geopolitical uncertainty.' },
  { name: 'Silver', symbol: 'XAGUSD', category: 'Precious Metals', spread: '$0.03', leverage: '1:100', emoji: '🥈', desc: 'Both a precious metal and industrial commodity, silver offers high volatility and significant trading opportunities across diverse market conditions.' },
  { name: 'Crude Oil (WTI)', symbol: 'USOIL', category: 'Energy', spread: '$0.05', leverage: '1:100', emoji: '🛢️', desc: 'West Texas Intermediate crude is the primary benchmark for US oil production. Trade the world\'s most important energy commodity with tight spreads.' },
  { name: 'Brent Crude', symbol: 'UKOIL', category: 'Energy', spread: '$0.05', leverage: '1:100', emoji: '⛽', desc: 'The international benchmark for oil pricing. Brent crude is influenced by OPEC decisions, global supply chains, and geopolitical events worldwide.' },
  { name: 'Natural Gas', symbol: 'NATGAS', category: 'Energy', spread: '$0.01', leverage: '1:100', emoji: '🔥', desc: 'One of the most volatile commodity markets, natural gas presents significant opportunities driven by seasonal demand, supply disruptions, and weather patterns.' },
  { name: 'Wheat', symbol: 'WHEAT', category: 'Agricultural', spread: '1.0 pts', leverage: '1:20', emoji: '🌾', desc: 'Trade global food security dynamics. Wheat prices are driven by weather events, geopolitical tensions, and shifting agricultural output from major producers.' },
];

export default function Commodities() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">MARKETS — COMMODITIES</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 max-w-2xl">
            Trade Hard Assets with Precision
          </h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed mb-10">
            From precious metals to energy and agricultural products, Liquid offers CFD trading
            on a wide range of commodities — giving you access to real-world supply and demand
            dynamics with competitive spreads and leverage.
          </p>
          <Link to="/create-account" className="bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3.5 rounded transition-colors inline-block">
            START TRADING
          </Link>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMODITIES.map((c) => (
            <div key={c.symbol} className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary transition-all duration-300">
              <div className="text-4xl mb-4">{c.emoji}</div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-white font-bold text-lg">{c.name}</h3>
                <span className="text-xs text-primary font-bold">{c.symbol}</span>
              </div>
              <span className="text-xs text-body-dark bg-white/5 px-2 py-1 rounded mb-3 inline-block">{c.category}</span>
              <p className="text-body-dark text-sm leading-relaxed mb-5">{c.desc}</p>
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <div><p className="text-xs text-body-dark mb-1">Typical Spread</p><p className="text-white font-bold text-sm">{c.spread}</p></div>
                <div><p className="text-xs text-body-dark mb-1">Max Leverage</p><p className="text-white font-bold text-sm">{c.leverage}</p></div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <StatsBar />
    </>
  );
}
