import { Link } from 'react-router-dom';
import StatsBar from '../components/StatsBar';

const INDICES = [
  { name: 'S&P 500', symbol: 'US500', region: 'United States', spread: '0.4 pts', leverage: '1:100', description: 'The benchmark index tracking 500 of the largest US-listed companies by market capitalisation.' },
  { name: 'NASDAQ 100', symbol: 'US100', region: 'United States', spread: '1.0 pts', leverage: '1:100', description: 'Technology-heavy index tracking the 100 largest non-financial companies on the NASDAQ exchange.' },
  { name: 'FTSE 100', symbol: 'UK100', region: 'United Kingdom', spread: '1.0 pts', leverage: '1:100', description: 'The primary UK equity benchmark, tracking the 100 largest companies listed on the London Stock Exchange.' },
  { name: 'DAX 40', symbol: 'GER40', region: 'Germany', spread: '1.0 pts', leverage: '1:100', description: 'Germany\'s premier stock index, comprising 40 of the largest blue-chip companies traded on the Frankfurt Stock Exchange.' },
  { name: 'Nikkei 225', symbol: 'JPN225', region: 'Japan', spread: '7.0 pts', leverage: '1:100', description: 'Japan\'s most widely quoted stock index, tracking 225 major companies listed on the Tokyo Stock Exchange.' },
];

export default function Indices() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">MARKETS — INDICES</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 max-w-2xl">
            Broad Market Exposure with Index CFDs
          </h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed mb-10">
            Rather than picking individual stocks, trade the performance of entire economies.
            Index CFDs give you instant, diversified exposure to the world's most important
            equity markets in a single transaction.
          </p>
          <Link to="/create-account" className="bg-primary hover:bg-primary-dark text-white text-sm md:text-base font-bold px-6 py-3 md:px-7 md:py-3.5 rounded-full transition-colors inline-block">
            START TRADING
          </Link>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDICES.map((idx) => (
            <div key={idx.symbol} className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg">{idx.name}</h3>
                  <p className="text-primary text-xs font-bold">{idx.symbol}</p>
                </div>
                <span className="text-xs text-body-dark bg-white/5 px-2 py-1 rounded">{idx.region}</span>
              </div>
              <p className="text-body-dark text-sm leading-relaxed mb-5">{idx.description}</p>
              <div className="flex gap-6 pt-4 border-t border-white/10">
                <div>
                  <p className="text-xs text-body-dark mb-1">Typical Spread</p>
                  <p className="text-white font-bold text-sm">{idx.spread}</p>
                </div>
                <div>
                  <p className="text-xs text-body-dark mb-1">Max Leverage</p>
                  <p className="text-white font-bold text-sm">{idx.leverage}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <StatsBar />
    </>
  );
}
