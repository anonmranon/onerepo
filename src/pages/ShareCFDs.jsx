import { Link } from 'react-router-dom';
import StatsBar from '../components/StatsBar';

const SHARES = [
  { name: 'Apple Inc.', ticker: 'AAPL', sector: 'Technology', spread: '0.10%', leverage: '1:5' },
  { name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Technology', spread: '0.12%', leverage: '1:5' },
  { name: 'Tesla Inc.', ticker: 'TSLA', sector: 'Automotive / Energy', spread: '0.15%', leverage: '1:5' },
  { name: 'Amazon.com Inc.', ticker: 'AMZN', sector: 'E-Commerce / Cloud', spread: '0.12%', leverage: '1:5' },
  { name: 'Meta Platforms Inc.', ticker: 'META', sector: 'Social Media / Tech', spread: '0.10%', leverage: '1:5' },
  { name: 'Microsoft Corp.', ticker: 'MSFT', sector: 'Technology / Cloud', spread: '0.10%', leverage: '1:5' },
  { name: 'NVIDIA Corp.', ticker: 'NVDA', sector: 'Semiconductors', spread: '0.12%', leverage: '1:5' },
  { name: 'Netflix Inc.', ticker: 'NFLX', sector: 'Streaming / Media', spread: '0.14%', leverage: '1:5' },
];

export default function ShareCFDs() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">MARKETS — SHARE CFDs</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 max-w-2xl">
            Trade the World's Biggest Companies
          </h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed mb-10">
            Share CFDs let you speculate on price movements of the world's most recognisable companies
            without taking ownership of the underlying stock. Go long or short with tight spreads and
            leverage up to 1:5.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/create-account" className="bg-primary hover:bg-primary-dark text-white text-sm md:text-base font-bold px-6 py-3 md:px-7 md:py-3.5 rounded-full transition-colors inline-block">
              START TRADING
            </Link>
            <Link to="/accounts" className="border border-white text-white font-bold px-7 py-3.5 rounded hover:bg-white/10 transition-colors">
              OPEN DEMO
            </Link>
          </div>
        </div>
      </section>

      {/* What are Share CFDs */}
      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { title: 'No Stamp Duty', desc: 'Unlike physical share purchases, Share CFD trading is exempt from stamp duty — keeping more profit in your account.' },
            { title: 'Short Selling', desc: 'Profit when a company\'s share price falls. With Share CFDs, you can open a short position with the same ease as going long.' },
            { title: 'Leverage Advantage', desc: 'Control a larger position with a smaller capital outlay. Trade popular global stocks with leverage up to 1:5, responsibly.' },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-dark-card rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-3">{title}</h3>
              <p className="text-body-dark text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instruments table */}
      <section className="bg-dark pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Popular Share CFDs</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-dark-secondary">
                <tr>
                  {['Company', 'Ticker', 'Sector', 'Typical Spread', 'Max Leverage'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-body-dark tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SHARES.map((s, i) => (
                  <tr key={s.ticker} className={`border-t border-white/5 ${i % 2 === 0 ? '' : 'bg-white/2'} hover:bg-primary/5 transition-colors`}>
                    <td className="px-5 py-4 text-white font-semibold">{s.name}</td>
                    <td className="px-5 py-4 text-primary font-bold">{s.ticker}</td>
                    <td className="px-5 py-4 text-body-dark">{s.sector}</td>
                    <td className="px-5 py-4 text-white">{s.spread}</td>
                    <td className="px-5 py-4 text-white">{s.leverage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-body-dark mt-4">* Spreads are indicative and subject to market conditions. Leverage is subject to regulatory requirements and client classification.</p>
        </div>
      </section>
      <StatsBar />
    </>
  );
}
