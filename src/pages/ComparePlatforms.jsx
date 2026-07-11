import StatsBar from '../components/StatsBar';
import { Check, X } from 'lucide-react';

const FEATURES = [
  { feature: 'Instruments available', web: '300+', app: '300+', mt5: '300+' },
  { feature: 'Minimum spread', web: '0.0 pips', app: '0.0 pips', mt5: '0.0 pips' },
  { feature: 'One-click trading', web: true, app: true, mt5: true },
  { feature: 'Advanced charting', web: true, app: true, mt5: true },
  { feature: 'Number of indicators', web: '50+', app: '30+', mt5: '38 built-in' },
  { feature: 'Expert Advisors (EAs)', web: false, app: false, mt5: true },
  { feature: 'Strategy Tester / Backtesting', web: false, app: false, mt5: true },
  { feature: 'Copy trading', web: false, app: true, mt5: true },
  { feature: 'Biometric login', web: false, app: true, mt5: false },
  { feature: 'Push price alerts', web: false, app: true, mt5: false },
  { feature: 'Tick charts', web: false, app: false, mt5: true },
  { feature: 'Multi-currency backtesting', web: false, app: false, mt5: true },
  { feature: 'Download required', web: false, app: true, mt5: true },
  { feature: 'Available on iOS', web: true, app: true, mt5: true },
  { feature: 'Available on Android', web: true, app: true, mt5: true },
];

function Cell({ value }) {
  if (value === true) return <Check className="w-5 h-5 text-green-400 mx-auto" />;
  if (value === false) return <X className="w-4 h-4 text-red-400/50 mx-auto" />;
  return <span className="text-white text-sm font-semibold">{value}</span>;
}

export default function ComparePlatforms() {
  return (
    <>
      <section className="bg-dark pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">PLATFORMS — COMPARE</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Find Your Perfect Platform</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            All three Liquid platforms deliver the same award-winning execution and tight spreads.
            Use this comparison to identify which one best matches your trading style and workflow.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-12 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-dark">
                <th className="text-left px-6 py-5 text-xs font-bold text-body-dark tracking-widest w-2/5">FEATURE</th>
                {['🌐 Web Platform', '📱 Trading App', '💻 MetaTrader 5'].map(h => (
                  <th key={h} className="px-4 py-5 text-center text-sm font-bold text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(({ feature, web, app, mt5 }, i) => (
                <tr key={feature} className={`border-t border-white/5 ${i % 2 === 0 ? '' : 'bg-white/2'} hover:bg-primary/5 transition-colors`}>
                  <td className="px-6 py-4 text-body-dark">{feature}</td>
                  <td className="px-4 py-4 text-center"><Cell value={web} /></td>
                  <td className="px-4 py-4 text-center"><Cell value={app} /></td>
                  <td className="px-4 py-4 text-center"><Cell value={mt5} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <StatsBar />
    </>
  );
}
