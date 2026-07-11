import StatsBar from '../components/StatsBar';
import { Link } from 'react-router-dom';

const STRATEGIES = [
  { name: 'Scalping', timeframe: 'Seconds to Minutes', emoji: '⚡', difficulty: 'Advanced', description: 'Scalping involves executing dozens to hundreds of trades per day, capturing tiny price movements. Requires exceptional discipline, ultra-fast execution, and a strict risk management framework to be consistently profitable.' },
  { name: 'Day Trading', timeframe: 'Minutes to Hours', emoji: '📅', difficulty: 'Intermediate', description: 'Day traders open and close all positions within the same trading session, avoiding overnight exposure. Success depends on technical analysis, news awareness, and the ability to manage multiple open positions simultaneously.' },
  { name: 'Swing Trading', timeframe: 'Days to Weeks', emoji: '🌊', difficulty: 'Intermediate', description: 'Swing traders capture price "swings" over several days or weeks. This approach balances the frequency of opportunities with time available — making it popular among part-time traders who cannot monitor markets continuously.' },
  { name: 'Position Trading', timeframe: 'Weeks to Months', emoji: '🏔️', difficulty: 'Beginner-Friendly', description: 'Position trading is the longest-term active strategy, driven primarily by fundamental analysis. Traders take large directional bets based on economic themes, central bank policy, and macro trends — holding positions for weeks or months.' },
  { name: 'Fundamental Analysis', timeframe: 'All Timeframes', emoji: '📰', difficulty: 'Intermediate', description: 'Fundamental analysis evaluates the intrinsic value of an asset by examining economic data, earnings reports, interest rate policy, and geopolitical factors. It\'s the cornerstone of informed, thesis-driven trading.' },
  { name: 'Technical Analysis', timeframe: 'All Timeframes', emoji: '📐', difficulty: 'Beginner-Friendly', description: 'Technical analysis uses price charts, patterns, and indicators to forecast future price movements. Tools such as moving averages, RSI, MACD, and Fibonacci retracements are core to most traders\' analytical toolkit.' },
];

const difficultyColor = { 'Advanced': 'text-red-400', 'Intermediate': 'text-yellow-400', 'Beginner-Friendly': 'text-green-400' };

export default function TradingStrategy() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">EDUCATION — TRADING STRATEGIES</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 max-w-2xl">Find the Strategy That Fits Your Style</h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed">
            There is no single "best" trading strategy — only the one best suited to your personality,
            schedule, and risk tolerance. Explore all major approaches and discover which one aligns
            with how you want to trade.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STRATEGIES.map((s) => (
            <div key={s.name} className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary transition-all duration-300">
              <div className="text-4xl mb-4">{s.emoji}</div>
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white font-bold text-lg">{s.name}</h3>
                <span className={`text-xs font-bold ${difficultyColor[s.difficulty]}`}>{s.difficulty}</span>
              </div>
              <p className="text-xs text-primary font-semibold mb-3">⏱ {s.timeframe}</p>
              <p className="text-body-dark text-sm leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-12 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Practice Any Strategy Risk-Free</h2>
        <p className="text-white/80 mb-6">Open a demo account with $100,000 virtual funds and test your approach before risking real capital.</p>
        <Link to="/accounts" className="bg-white text-primary font-bold px-8 py-4 rounded hover:bg-gray-100 transition-colors inline-block">
          OPEN DEMO ACCOUNT
        </Link>
      </section>
      <StatsBar />
    </>
  );
}
