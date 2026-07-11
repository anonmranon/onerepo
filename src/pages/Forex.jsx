import { Link } from 'react-router-dom';
import StatsBar from '../components/StatsBar';

const PAIRS = [
  { pair: 'EUR/USD', type: 'Major', spread: '0.0 pips', leverage: '1:500', sessions: 'All Sessions' },
  { pair: 'GBP/USD', type: 'Major', spread: '0.2 pips', leverage: '1:500', sessions: 'All Sessions' },
  { pair: 'USD/JPY', type: 'Major', spread: '0.1 pips', leverage: '1:500', sessions: 'All Sessions' },
  { pair: 'AUD/USD', type: 'Major', spread: '0.3 pips', leverage: '1:500', sessions: 'All Sessions' },
  { pair: 'USD/CAD', type: 'Major', spread: '0.3 pips', leverage: '1:500', sessions: 'All Sessions' },
  { pair: 'EUR/GBP', type: 'Minor', spread: '0.5 pips', leverage: '1:200', sessions: 'London/NY' },
  { pair: 'USD/MXN', type: 'Exotic', spread: '120 pips', leverage: '1:50', sessions: 'All Sessions' },
  { pair: 'USD/ZAR', type: 'Exotic', spread: '200 pips', leverage: '1:50', sessions: 'All Sessions' },
];

const typeColor = { Major: 'text-green-400', Minor: 'text-blue-400', Exotic: 'text-yellow-400' };

export default function Forex() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">MARKETS — FOREX</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 max-w-2xl">
            The World's Largest Financial Market
          </h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed mb-10">
            With over $7 trillion traded daily, the Forex market offers unmatched liquidity and
            round-the-clock trading opportunities. Access 60+ currency pairs with spreads starting
            from 0.0 pips on our ECN account.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/create-account" className="bg-primary hover:bg-primary-dark text-white font-bold px-7 py-3.5 rounded transition-colors">
              START TRADING
            </Link>
            <Link to="/accounts" className="border border-white text-white font-bold px-7 py-3.5 rounded hover:bg-white/10 transition-colors">
              OPEN DEMO
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {[
            { title: '24/5 Market Access', desc: 'Forex markets are open 24 hours a day, five days a week — from the Sydney open on Monday to the New York close on Friday.' },
            { title: 'Superior Liquidity', desc: 'As the most liquid market in the world, Forex ensures your orders are filled quickly at competitive prices, even in volatile conditions.' },
            { title: 'Tight Spreads', desc: 'Benefit from raw interbank spreads starting at 0.0 pips on our ECN account, with transparent pricing and no hidden markups.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-dark-card rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-body-dark text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Currency Pairs</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-dark">
                <tr>
                  {['Pair', 'Type', 'Typical Spread', 'Max Leverage', 'Trading Sessions'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-body-dark tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAIRS.map((p, i) => (
                  <tr key={p.pair} className={`border-t border-white/5 hover:bg-primary/5 transition-colors`}>
                    <td className="px-5 py-4 text-white font-bold whitespace-nowrap">{p.pair}</td>
                    <td className={`px-5 py-4 font-semibold text-xs whitespace-nowrap ${typeColor[p.type]}`}>{p.type}</td>
                    <td className="px-5 py-4 text-white whitespace-nowrap">{p.spread}</td>
                    <td className="px-5 py-4 text-white whitespace-nowrap">{p.leverage}</td>
                    <td className="px-5 py-4 text-body-dark whitespace-nowrap">{p.sessions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <StatsBar />
    </>
  );
}
