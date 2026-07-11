import { Link } from 'react-router-dom';
import { Monitor, Smartphone, BarChart2, Check, ArrowRight } from 'lucide-react';
import StatsBar from '../components/StatsBar';

const PLATFORMS = [
  {
    icon: Monitor,
    title: 'Web Platform',
    subtitle: 'No download required',
    description: 'Our browser-based platform delivers the full power of professional trading tools without any installation. Access your account from any device, anywhere in the world.',
    features: ['One-click execution', 'Advanced charting with 50+ indicators', 'Customisable workspace layouts', 'Integrated economic calendar', 'Real-time market depth', 'Risk management tools'],
    to: '/platforms',
    cta: 'LAUNCH WEB PLATFORM',
    emoji: '🌐',
  },
  {
    icon: Smartphone,
    title: 'Trading Apps',
    subtitle: 'iOS & Android',
    description: 'Stay connected to the markets wherever you are. Our award-winning mobile apps bring the full suite of Liquid\'s trading capabilities to your smartphone or tablet.',
    features: ['Full account management', 'Push notifications for price alerts', 'Biometric security login', 'One-tap order execution', 'Live charts & technical indicators', 'Instant deposit & withdrawal'],
    to: '/platforms',
    cta: 'DOWNLOAD APP',
    emoji: '📱',
  },
  {
    icon: BarChart2,
    title: 'MetaTrader 5',
    subtitle: 'Industry standard platform',
    description: 'The world\'s most popular trading platform, enhanced with Liquid\'s liquidity and ultra-low latency execution. Perfect for algorithmic traders and technical analysts.',
    features: ['Expert Advisor automation', 'Strategy Tester & backtesting', 'Market depth & tick charts', 'MQL5 programming language', 'Hedging & netting account modes', 'Copy trading via signals'],
    to: '/platforms/mt5',
    cta: 'EXPLORE MT5',
    emoji: '💻',
  },
];

export default function TradingPlatforms() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">AVAILABLE ON MULTIPLE PLATFORMS</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">World-Class Platforms for Every Trader</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you prefer trading in your browser, on your phone, or through the industry-standard
            MetaTrader 5 — Liquid delivers a seamless, professional-grade experience across all platforms
            and devices.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PLATFORMS.map((p) => (
            <div key={p.title} className="bg-dark-card rounded-xl p-8 border border-white/5 hover:border-primary transition-all duration-300 flex flex-col gap-6">
              <div>
                <div className="text-5xl mb-4">{p.emoji}</div>
                <h2 className="text-white font-bold text-2xl mb-1">{p.title}</h2>
                <p className="text-primary text-xs font-semibold mb-4">{p.subtitle}</p>
                <p className="text-body-dark text-sm leading-relaxed">{p.description}</p>
              </div>
              <ul className="space-y-2.5 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-body-dark">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={p.to}
                className="block text-center bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded transition-colors"
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto mt-10 text-center">
          <Link
            to="/platforms/compare"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
          >
            Compare all platforms <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <StatsBar />
    </>
  );
}
