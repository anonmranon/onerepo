import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import StatsBar from '../components/StatsBar';

const MARKETS = [
  {
    icon: '📈',
    title: 'Share CFDs',
    to: '/markets/share-cfds',
    spread: 'From 0.1%',
    leverage: 'Up to 1:5',
    description:
      'Trade the world\'s most influential companies — Apple, Google, Tesla, Amazon, and hundreds more — without owning the underlying shares. Profit from both rising and falling markets.',
  },
  {
    icon: '💱',
    title: 'Forex',
    to: '/markets/forex',
    spread: 'From 0.0 pips',
    leverage: 'Up to 1:500',
    description:
      'Access the world\'s largest and most liquid market with over 60 currency pairs, including major, minor, and exotic pairs — available 24 hours a day, 5 days a week.',
  },
  {
    icon: '🌐',
    title: 'Indices',
    to: '/markets/indices',
    spread: 'From 0.4 pts',
    leverage: 'Up to 1:100',
    description:
      'Gain diversified exposure to entire economies with CFDs on the world\'s leading indices, including the S&P 500, NASDAQ 100, FTSE 100, DAX 40, and Nikkei 225.',
  },
  {
    icon: '🪙',
    title: 'Commodities',
    to: '/markets/commodities',
    spread: 'From $0.03',
    leverage: 'Up to 1:100',
    description:
      'Trade Gold, Silver, Crude Oil, Natural Gas, and a range of agricultural commodities with competitive spreads and flexible leverage — hedge your portfolio or speculate on price moves.',
  },
];

export default function Markets() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">EXPLORE OUR INSTRUMENTS</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Global Markets at Your Fingertips</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Trade over 300 financial instruments across four asset classes — all from a single account
            with industry-leading spreads, deep liquidity, and fast execution.
          </p>
        </div>
      </section>

      {/* Market cards */}
      <section className="bg-dark pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {MARKETS.map((m) => (
            <Link
              key={m.title}
              to={m.to}
              className="bg-dark-card border border-white/5 hover:border-primary rounded-xl p-8 flex flex-col gap-5 transition-all duration-300 group"
            >
              <div className="text-5xl">{m.icon}</div>
              <div>
                <h2 className="text-white font-bold text-xl mb-3 group-hover:text-primary transition-colors">
                  {m.title}
                </h2>
                <p className="text-body-dark text-sm leading-relaxed mb-4">{m.description}</p>
              </div>
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-body-dark mb-1">Typical Spread</p>
                  <p className="text-white font-bold text-sm">{m.spread}</p>
                </div>
                <div>
                  <p className="text-xs text-body-dark mb-1">Max Leverage</p>
                  <p className="text-white font-bold text-sm">{m.leverage}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                Explore {m.title} <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
          <p className="text-white/80 mb-8 text-lg">Open a free demo account and practise with virtual funds before trading live.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create-account" className="bg-white text-primary font-bold px-8 py-4 rounded hover:bg-gray-100 transition-colors">
              OPEN LIVE ACCOUNT
            </Link>
            <Link to="/accounts" className="border border-white text-white font-bold px-8 py-4 rounded hover:bg-white/10 transition-colors">
              TRY DEMO FIRST
            </Link>
          </div>
        </div>
      </section>

      <StatsBar />
    </>
  );
}
