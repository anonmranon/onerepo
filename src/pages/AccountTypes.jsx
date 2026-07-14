import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import StatsBar from '../components/StatsBar';

const ACCOUNTS = [
  {
    type: 'Demo',
    icon: '🎯',
    tagline: 'Risk-Free Practice',
    color: 'border-blue-400',
    badge: 'text-blue-400 bg-blue-400/10',
    minDeposit: '$0',
    spread: 'From 1.0 pips',
    leverage: 'Up to 1:500',
    commission: 'None',
    platforms: 'Web, App, MT5',
    features: ['$100,000 virtual balance', 'Full platform access', 'Live market conditions', 'No time limit', 'Instant activation'],
    cta: 'OPEN DEMO',
    to: '/create-account',
    description: 'The ideal starting point for all new traders. Practise your strategy and explore our platforms with zero financial risk.',
  },
  {
    type: 'Standard',
    icon: '⭐',
    tagline: 'Most Popular',
    color: 'border-white/30',
    badge: 'text-white bg-white/10',
    minDeposit: '$1,000',
    spread: 'From 1.0 pips',
    leverage: 'Up to 1:500',
    commission: 'None',
    platforms: 'Web, App, MT5',
    features: ['All major asset classes', 'Negative balance protection', 'Free deposits & withdrawals', 'Daily market analysis', '24/5 customer support'],
    cta: 'OPEN STANDARD',
    to: '/create-account',
    description: 'Our most popular account — designed for everyday traders who want competitive conditions with no commission on trades.',
  },
  {
    type: 'Gold',
    icon: '🥇',
    tagline: 'Premium Choice',
    color: 'border-[#f59e0b]',
    badge: 'text-[#f59e0b] bg-[#f59e0b]/10',
    minDeposit: '$5,000',
    spread: 'From 0.8 pips',
    leverage: 'Up to 1:400',
    commission: 'None',
    platforms: 'Web, App, MT5',
    features: ['Premium market insights', 'Priority support', 'Dedicated account manager', 'Free deposits & withdrawals', 'Exclusive webinars'],
    cta: 'OPEN GOLD',
    to: '/create-account',
    description: 'A premium account offering enhanced trading conditions, dedicated support, and advanced insights for serious investors.',
  },
  {
    type: 'ECN',
    icon: '🏆',
    tagline: 'Professional Grade',
    color: 'border-primary',
    badge: 'text-primary bg-primary/10',
    highlight: true,
    minDeposit: '$10,000',
    spread: 'From 0.0 pips',
    leverage: 'Up to 1:500',
    commission: '$3.50 per lot',
    platforms: 'Web, App, MT5',
    features: ['Raw interbank spreads', 'STP/ECN execution', 'Depth of market (Level II)', 'Dedicated account manager', 'Priority withdrawal processing'],
    cta: 'OPEN ECN',
    to: '/create-account',
    description: 'Raw, commission-based pricing with direct market access. The preferred choice of experienced traders and scalpers.',
  },
];

export default function AccountTypes() {
  return (
    <>
      <Helmet>
        <title>Account Types | Liquid Broker</title>
        <meta name="description" content="Compare our Demo, Standard, Gold, and ECN trading accounts. Find the perfect account type for your trading strategy." />
      </Helmet>

      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">ACCOUNT TYPES</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">The Right Account for Every Trader</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you're just starting out or running a high-frequency algorithmic strategy,
            Liquid has an account type engineered to match your needs and maximise your trading performance.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {ACCOUNTS.map((acc) => (
            <div
              key={acc.type}
              id={acc.type.toLowerCase()}
              className={`bg-dark-card rounded-xl border-t-4 ${acc.color} p-6 flex flex-col gap-5 ${acc.highlight ? 'ring-1 ring-primary shadow-lg shadow-primary/10' : ''}`}
            >
              <div>
                <div className="text-4xl mb-3">{acc.icon}</div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-white font-bold text-xl">{acc.type}</h2>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${acc.badge}`}>{acc.tagline}</span>
                </div>
                <p className="text-body-dark text-xs leading-relaxed">{acc.description}</p>
              </div>

              {/* Conditions */}
              <div className="grid grid-cols-2 gap-3 py-4 border-y border-white/10">
                {[
                  { label: 'Min. Deposit', value: acc.minDeposit },
                  { label: 'Spread', value: acc.spread },
                  { label: 'Leverage', value: acc.leverage },
                  { label: 'Commission', value: acc.commission },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-body-dark mb-0.5">{label}</p>
                    <p className="text-white font-bold text-sm">{value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <ul className="space-y-2 flex-1">
                {acc.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-body-dark">
                    <Check className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={acc.to}
                className={`block text-center font-bold py-3 rounded transition-colors text-sm ${
                  acc.highlight
                    ? 'bg-primary hover:bg-primary-dark text-white'
                    : 'border border-white/20 text-white hover:border-primary hover:text-primary'
                }`}
              >
                {acc.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table teaser */}
      <section className="bg-dark py-12 px-4 text-center">
        <p className="text-body-dark mb-4">Not sure which account to choose?</p>
        <Link to="/platforms/compare" className="text-primary font-semibold hover:underline">
          View detailed feature comparison →
        </Link>
      </section>
      <StatsBar />
    </>
  );
}
