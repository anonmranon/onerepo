import StatsBar from '../components/StatsBar';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

const LEVELS = [
  {
    level: 'Beginner',
    color: 'border-green-400',
    badge: 'text-green-400 bg-green-400/10',
    modules: [
      { title: 'What is Forex Trading?', lessons: 5 },
      { title: 'How the Currency Market Works', lessons: 4 },
      { title: 'Understanding Pips, Lots & Margin', lessons: 6 },
      { title: 'Your First Trade: Step by Step', lessons: 4 },
      { title: 'Risk Management Fundamentals', lessons: 5 },
    ],
  },
  {
    level: 'Intermediate',
    color: 'border-yellow-400',
    badge: 'text-yellow-400 bg-yellow-400/10',
    modules: [
      { title: 'Technical Analysis: Charts & Patterns', lessons: 8 },
      { title: 'Key Indicators: RSI, MACD, Bollinger Bands', lessons: 7 },
      { title: 'Fundamental Analysis & Economic Data', lessons: 6 },
      { title: 'Trading the News: NFP, CPI & Rate Decisions', lessons: 5 },
      { title: 'Building a Trading Plan', lessons: 4 },
    ],
  },
  {
    level: 'Advanced',
    color: 'border-primary',
    badge: 'text-primary bg-primary/10',
    modules: [
      { title: 'Advanced Chart Patterns & Price Action', lessons: 9 },
      { title: 'Multi-Timeframe Analysis', lessons: 6 },
      { title: 'Portfolio Diversification Strategies', lessons: 5 },
      { title: 'Algorithmic Trading & Expert Advisors', lessons: 7 },
      { title: 'Trading Psychology & Discipline', lessons: 5 },
    ],
  },
];

export default function ForexCourse() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">EDUCATION — FOREX COURSE</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">From Zero to Trader: The Complete Forex Course</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            A fully structured, self-paced curriculum designed to take you from complete beginner to
            a confident, disciplined trader — covering everything from market mechanics to advanced
            technical strategy. Completely free for all Liquid account holders.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {LEVELS.map((level) => (
            <div key={level.level} className={`bg-dark-card rounded-xl border-l-4 ${level.color} p-8`}>
              <div className="flex items-center gap-4 mb-6">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${level.badge}`}>
                  {level.level}
                </span>
                <span className="text-body-dark text-sm">{level.modules.length} Modules · {level.modules.reduce((s, m) => s + m.lessons, 0)} Lessons</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {level.modules.map((mod) => (
                  <div key={mod.title} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm font-semibold">{mod.title}</p>
                      <p className="text-body-dark text-xs">{mod.lessons} lessons</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Start Learning Today — It's Free</h2>
        <p className="text-white/80 mb-6">All course content is available free of charge to every Liquid account holder.</p>
        <Link to="/create-account" className="bg-white text-primary font-bold px-8 py-4 rounded hover:bg-gray-100 transition-colors inline-block">
          OPEN YOUR FREE ACCOUNT
        </Link>
      </section>
      <StatsBar />
    </>
  );
}
