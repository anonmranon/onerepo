import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import StatsBar from '../components/StatsBar';

const RESOURCES = [
  { category: 'NEWS', title: 'Federal Reserve Holds Rates as Inflation Nears Target', author: 'Reuters', date: 'Jan 12, 2024', excerpt: 'The Federal Open Market Committee voted unanimously to maintain the federal funds rate at its current level, signalling confidence that inflation is returning sustainably toward the 2% target without triggering a recession.' },
  { category: 'ANALYSIS', title: 'Dollar Strength: How Long Can the Rally Last?', author: 'Liquid Research', date: 'Jan 10, 2024', excerpt: 'The US Dollar Index has surged to its highest level in six months, driven by resilient economic data and hawkish Fed rhetoric. We examine the technical and macro factors that will determine whether this move is sustainable.' },
  { category: 'EDUCATION', title: 'What is the Economic Calendar and How Do You Trade It?', author: 'Trading Academy', date: 'Jan 8, 2024', excerpt: 'The economic calendar is one of the most powerful tools available to fundamental traders. This guide explains which data releases matter most, how to interpret market reactions, and how to position ahead of key events.' },
  { category: 'NEWS', title: 'Eurozone GDP Growth Beats Expectations in Q4', author: 'Bloomberg Wire', date: 'Jan 6, 2024', excerpt: 'Eurozone GDP expanded by 0.4% in the fourth quarter, surpassing analyst forecasts and easing fears of a technical recession. Germany led the recovery, posting its strongest quarterly growth figure in over a year.' },
  { category: 'ANALYSIS', title: 'Crude Oil Outlook 2024: Supply Cuts Meet Demand Uncertainty', author: 'Liquid Research', date: 'Jan 4, 2024', excerpt: 'With OPEC+ maintaining its supply discipline and global demand recovery looking uneven, the oil market faces a complex balancing act in 2024. We outline our price targets and key risk events to watch over the next six months.' },
  { category: 'EDUCATION', title: 'Top 5 Risk Management Mistakes New Traders Make', author: 'Barry Norman', date: 'Jan 2, 2024', excerpt: 'Poor risk management is responsible for more blown accounts than bad analysis ever will be. In this guide, we identify the five most common risk management errors and show you exactly how to avoid them from day one.' },
];

const TOOLS = [
  { icon: '📅', title: 'Economic Calendar', desc: 'Track all major data releases and central bank decisions with our real-time economic calendar — filterable by country, impact, and asset class.' },
  { icon: '📊', title: 'Trading Calculator', desc: 'Calculate pip value, margin requirements, potential profit/loss, and commission costs for any trade before you place it.' },
  { icon: '💱', title: 'Currency Converter', desc: 'Instantly convert between any two currencies at live market rates — useful for calculating position sizes in your home currency.' },
];

export default function Resources() {
  return (
    <>
      <section className="bg-dark pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">RESOURCES</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Your Trading Resource Centre</h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed">
            Market intelligence, analytical tools, and educational resources — everything you need to
            stay informed, make better decisions, and develop your edge as a trader.
          </p>
        </div>
      </section>

      {/* Tools row */}
      <section className="bg-dark-secondary py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOOLS.map(({ icon, title, desc }) => (
            <div key={title} className="bg-dark-card rounded-xl p-6 border border-white/5 hover:border-primary transition-all group cursor-pointer">
              <div className="text-4xl mb-4">{icon}</div>
              <h3 className="text-white font-bold text-lg mb-2 group-hover:text-primary transition-colors">{title}</h3>
              <p className="text-body-dark text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Articles */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111] mb-8">Latest Market Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESOURCES.map((post) => (
              <BlogCard key={post.title} {...post} />
            ))}
          </div>
        </div>
      </section>

      <StatsBar />
    </>
  );
}
