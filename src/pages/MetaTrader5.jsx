import { Link } from 'react-router-dom';
import { Download } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { category: 'Trading', items: ['38 built-in technical indicators', '44 analytical objects', '21 timeframes', 'One-click trading from chart', 'Market depth (Level II pricing)', 'Netting and hedging account modes'] },
  { category: 'Automation', items: ['Expert Advisors (EAs)', 'Strategy Tester with multi-currency backtesting', 'MQL5 programming language', 'MQL5 community signals marketplace', 'Script & function libraries', 'Cloud computing for EA optimisation'] },
  { category: 'Analysis', items: ['Tick chart & volume data', 'Economic calendar integration', 'Financial news feed', 'Fundamental data panels', 'Custom indicator development', 'Multi-asset portfolio analysis'] },
];

const DOWNLOADS = [
  { label: 'Windows', icon: '🖥️', size: '5 MB (300 MB Installed)', link: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/mt5setup.exe' },
  { label: 'MacOS', icon: '🍎', size: '45 MB (1.5 GB Installed)', link: 'https://download.mql5.com/cdn/web/metaquotes.software.corp/mt5/MetaTrader5.dmg' },
  { label: 'Android', icon: '📱', size: '30 MB', link: 'https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5' },
  { label: 'iOS (iPhone/iPad)', icon: '📲', size: '35 MB', link: 'https://apps.apple.com/app/metatrader-5/id413251709' },
];

export default function MetaTrader5() {
  const { user } = useAuth();
  
  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary text-xs font-bold tracking-widest mb-4">PLATFORMS — METATRADER 5</p>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              The Industry Standard.<br />Powered by Liquid.
            </h1>
            <p className="text-body-dark text-lg leading-relaxed mb-8">
              MetaTrader 5 is the world's most widely used trading platform — now supercharged with
              Liquid's institutional liquidity, ultra-low latency execution, and tight raw spreads.
              The choice of professional traders globally.
            </p>
            <div className="flex gap-4 flex-wrap">
              {user ? (
                <a href="#downloads" className="bg-primary hover:bg-primary-dark text-white text-sm md:text-base font-bold px-6 py-3 md:px-7 md:py-3.5 rounded-full transition-colors flex items-center gap-2">
                  <Download className="w-5 h-5" /> DOWNLOAD MT5 NOW
                </a>
              ) : (
                <Link to="/create-account" className="bg-primary hover:bg-primary-dark text-white text-sm md:text-base font-bold px-6 py-3 md:px-7 md:py-3.5 rounded-full transition-colors">
                  OPEN ACCOUNT TO DOWNLOAD
                </Link>
              )}
            </div>
          </div>
           {/* MT5 mockup — hidden on mobile, shown lg+ */}
          <div className="hidden lg:block min-w-0 bg-dark-secondary rounded-2xl border border-white/10 p-6 font-mono text-xs overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <p className="text-green-400 mb-2">// MetaTrader 5 — Expert Advisor</p>
            <p className="text-blue-400">int <span className="text-white">OnInit</span><span className="text-yellow-400">()</span> {'{'}</p>
            <p className="text-body-dark ml-4">// EA initialisation logic</p>
            <p className="text-blue-400 ml-4">EventSetTimer<span className="text-yellow-400">(</span><span className="text-primary">60</span><span className="text-yellow-400">)</span>;</p>
            <p className="text-white ml-4">return<span className="text-primary"> INIT_SUCCEEDED</span>;</p>
            <p className="text-blue-400">{'}'}</p>
            <p className="text-body-dark mt-2">void <span className="text-white">OnTick</span><span className="text-yellow-400">()</span> {'{'}</p>
            <p className="text-body-dark ml-4">double <span className="text-white">bid</span> = <span className="text-green-400">SymbolInfoDouble</span>(_Symbol, SYMBOL_BID);</p>
            <p className="text-body-dark ml-4">double <span className="text-white">ask</span> = <span className="text-green-400">SymbolInfoDouble</span>(_Symbol, SYMBOL_ASK);</p>
            <p className="text-primary ml-4">// Execute strategy logic...</p>
            <p className="text-body-dark">{'}'}</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Everything a Professional Trader Needs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ category, items }) => (
              <div key={category} className="bg-dark-card rounded-xl p-6 border border-white/5">
                <h3 className="text-primary font-bold text-sm tracking-widest mb-5">{category.toUpperCase()}</h3>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item} className="text-sm text-body-dark flex items-start gap-2">
                      <span className="text-primary mt-0.5">›</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section id="downloads" className="bg-[#121214] py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-4">Available Downloads</h2>
            <p className="text-body-dark max-w-2xl mx-auto">
              Download MT5 for your preferred device. You will need your Liquid Broker account credentials to log in and trade.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DOWNLOADS.map((dl, i) => (
              <div key={i} className="bg-dark border border-white/5 rounded-xl p-6 text-center hover:bg-dark-secondary transition-colors group">
                <div className="text-4xl mb-4">{dl.icon}</div>
                <h3 className="text-white font-bold mb-1">{dl.label}</h3>
                <p className="text-body-dark text-xs mb-6">{dl.size}</p>
                {user ? (
                  <a href={dl.link} target="_blank" rel="noopener noreferrer" className="w-full border border-white/10 text-white font-bold text-sm py-2 rounded-full hover:bg-white hover:text-dark transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Download
                  </a>
                ) : (
                  <Link to={dl.link} className="block w-full border border-white/10 text-white font-bold text-sm py-2 rounded-full hover:bg-white hover:text-dark transition-colors">
                    Login Required
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <StatsBar />
    </>
  );
}
