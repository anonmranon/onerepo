import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, TrendingUp, GraduationCap } from 'lucide-react';
import StatsBar from '../components/StatsBar';

const HUBS = [
  { icon: BookOpen, title: 'News & Trade Ideas', description: 'Daily market commentary, breaking financial news, and actionable trade ideas from our in-house team of experienced analysts — updated throughout the trading day.', to: '/company/news', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { icon: TrendingUp, title: 'Trading Strategy', description: 'From scalping techniques and day trading playbooks to long-term position management and systematic approaches — master the strategies used by professional traders.', to: '/education/strategy', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: GraduationCap, title: 'Forex Trading Course', description: 'A structured, beginner-to-advanced curriculum covering market fundamentals, technical analysis, risk management, and trading psychology — all completely free.', to: '/education/course', color: 'text-green-400', bg: 'bg-green-400/10' },
];

export default function Education() {
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">EDUCATION CENTRE</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Learn to Trade. Trade to Win.</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you're opening your first trading account or refining an advanced strategy,
            Liquid's Education Centre gives you the knowledge, tools, and insight to trade
            global markets with genuine confidence.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {HUBS.map(({ icon: Icon, title, description, to, color, bg }) => (
            <Link key={title} to={to} className="bg-dark-card rounded-xl p-8 border border-white/5 hover:border-primary transition-all duration-300 group flex flex-col gap-5">
              <div className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center`}>
                <Icon className={`w-7 h-7 ${color}`} />
              </div>
              <div>
                <h2 className={`text-white font-bold text-xl mb-3 group-hover:${color} transition-colors`}>{title}</h2>
                <p className="text-body-dark text-sm leading-relaxed">{description}</p>
              </div>
              <div className={`flex items-center gap-2 ${color} text-sm font-semibold mt-auto`}>
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick stats */}
      <section className="bg-dark py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '200+', label: 'Free Lessons' },
            { value: '50+', label: 'Video Tutorials' },
            { value: '30+', label: 'Strategy Guides' },
            { value: '12', label: 'Languages' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-dark-card rounded-xl p-6 border border-white/5">
              <p className="text-3xl font-black text-primary mb-1">{value}</p>
              <p className="text-sm text-body-dark">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <StatsBar />
    </>
  );
}
