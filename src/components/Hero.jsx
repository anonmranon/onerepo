import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SLIDES = [
  {
    headline: 'One of the best\nglobal broker.',
    sub: 'A trusted destination for traders worldwide. Start your investment journey with raw spreads and lightning-fast execution.',
    ctaPrimary: { label: 'EXPLORE PLATFORMS', to: '/platforms' },
    ctaSecondary: { label: 'TRY FREE DEMO', to: '/accounts' },
    asset: 'EUR/USD',
    price: '1.08945',
    change: '+0.34%',
    isUp: true,
    points: [30, 110, 45, 95, 70, 75, 95, 55, 120, 65, 150, 40, 180, 50, 210, 30, 240, 45, 270, 25, 300, 15]
  },
  {
    headline: 'New standard\nin stock broker.',
    sub: 'Trade CFDs on the world\'s leading companies with zero commissions, deep market depth, and professional analytics tools.',
    ctaPrimary: { label: 'VIEW SHARE CFDS', to: '/markets/share-cfds' },
    ctaSecondary: { label: 'COMPARE FEATURES', to: '/platforms/compare' },
    asset: 'AAPL',
    price: '185.92',
    change: '+1.42%',
    isUp: true,
    points: [30, 120, 50, 110, 75, 115, 100, 85, 130, 95, 160, 60, 190, 75, 220, 40, 250, 50, 280, 20, 300, 10]
  },
  {
    headline: 'World-class\ntrading platform.',
    sub: 'Deploy expert advisors, custom indicators, and automated strategies on our ultra-low latency execution engine.',
    ctaPrimary: { label: 'DOWNLOAD MT5', to: '/platforms/mt5' },
    ctaSecondary: { label: 'WATCH DEMO', to: '/education' },
    asset: 'BTC/USD',
    price: '43,890',
    change: '-0.85%',
    isUp: false,
    points: [30, 40, 60, 65, 90, 55, 120, 85, 150, 70, 180, 110, 210, 95, 240, 130, 270, 115, 290, 140, 300, 135]
  },
];

// High-fidelity trading dashboard mockup in a browser frame
function TradingDashboardMockup({ asset, price, change, isUp, points }) {
  // Compute chart path from points
  const pathData = points.reduce((acc, val, i) => {
    if (i % 2 === 0) {
      return acc + (i === 0 ? 'M' : ' L') + val;
    } else {
      return acc + ',' + val;
    }
  }, '');

  // Fill path for area gradient
  const fillPathData = `${pathData} L300,160 L30,160 Z`;

  return (
    <div className="w-full max-w-xl bg-[#121214] rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden font-sans text-xs text-gray-400 select-none transition-all duration-300">
      {/* Browser Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#18181b] border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="bg-white/5 border border-white/5 rounded-md px-6 py-0.5 text-[9px] text-white/30 tracking-wider">
          liquidbroker.com/trade/{asset.replace('/', '')}
        </div>
        <div className="w-10" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 divide-x divide-white/5">
        {/* Watchlist Section */}
        <div className="col-span-3 bg-[#141416] p-2.5 flex flex-col gap-2">
          <div className="text-[9px] font-bold tracking-wider text-white/30 mb-1">WATCHLIST</div>
          {[
            { s: 'EUR/USD', p: '1.08945', chg: '+0.34%', up: true },
            { s: 'GBP/USD', p: '1.27210', chg: '+0.12%', up: true },
            { s: 'AAPL', p: '185.92', chg: '+1.42%', up: true },
            { s: 'BTC/USD', p: '43,890', chg: '-0.85%', up: false }
          ].map((item) => (
            <div
              key={item.s}
              className={`p-1.5 rounded flex flex-col gap-0.5 transition-colors ${
                item.s === asset ? 'bg-white/5 border border-white/5' : 'border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] text-white">{item.s}</span>
                <span className={`text-[9px] font-semibold ${item.up ? 'text-green-400' : 'text-primary'}`}>
                  {item.chg}
                </span>
              </div>
              <span className="text-[10px] text-white/50">{item.p}</span>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="col-span-6 bg-[#111112] p-3.5 flex flex-col gap-2 relative">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-extrabold text-sm">{asset}</span>
              <span className="text-[9px] text-white/30 ml-2">Realtime Chart</span>
            </div>
            <div className="text-right">
              <span className="text-white font-bold text-xs block">{price}</span>
              <span className={`text-[9px] font-bold flex items-center justify-end gap-0.5 ${isUp ? 'text-green-400' : 'text-primary'}`}>
                {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {change}
              </span>
            </div>
          </div>

          {/* SVG Sparkline Chart */}
          <div className="relative h-36 w-full mt-2 bg-gradient-to-b from-white/[0.01] to-transparent rounded border border-white/5 overflow-hidden">
            {/* Grid Horizontal Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-white" />
              <div className="w-full h-[1px] bg-white" />
              <div className="w-full h-[1px] bg-white" />
            </div>

            <svg className="w-full h-full" viewBox="0 0 320 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f04e23" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#f04e23" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Shaded Area */}
              <path d={fillPathData} fill="url(#chartGlow)" />
              {/* Glowing Line */}
              <path
                d={pathData}
                fill="none"
                stroke="#f04e23"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dynamic pulse point at ending coordinates */}
              <circle
                cx={points[points.length - 2]}
                cy={points[points.length - 1]}
                r="4.5"
                fill="#f04e23"
                className="animate-ping origin-center"
                style={{ transformOrigin: `${points[points.length - 2]}px ${points[points.length - 1]}px` }}
              />
              <circle
                cx={points[points.length - 2]}
                cy={points[points.length - 1]}
                r="3"
                fill="#f04e23"
              />
            </svg>
          </div>
        </div>

        {/* Place Order Panel */}
        <div className="col-span-3 bg-[#141416] p-2.5 flex flex-col justify-between">
          <div className="flex flex-col gap-2.5">
            <div className="flex rounded bg-white/5 p-0.5 border border-white/5 text-[9px] font-bold text-center">
              <div className="flex-1 py-1 rounded bg-[#f04e23] text-white">BUY</div>
              <div className="flex-1 py-1 text-white/40">SELL</div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <div>
                <label className="text-[9px] text-white/30 block mb-0.5">AMOUNT</label>
                <div className="bg-white/5 border border-white/5 rounded p-1 text-[10px] text-white font-semibold">1.00 Lot</div>
              </div>
              <div>
                <label className="text-[9px] text-white/30 block mb-0.5">STOP LOSS</label>
                <div className="bg-white/5 border border-white/5 rounded p-1 text-[10px] text-white/50">Optional</div>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#f04e23] hover:bg-[#d63d14] text-white font-bold py-2 rounded text-[9px] tracking-widest transition-colors duration-200">
            PLACE BUY ORDER
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % total), 6000);
    return () => clearInterval(timer);
  }, [total]);

  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);
  const slide = SLIDES[current];

  return (
    <section className="relative bg-[#0b0b0c] min-h-screen flex items-center overflow-hidden">
      {/* Fintech Grid Background & Radial Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Radial Glows */}
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-[#f04e23]/10 blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px]" />
        
        {/* Subtle Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-16 lg:py-24">
          {/* Left: Text & CTA Content — always first in DOM order */}
          <div key={current} className="col-span-1 lg:col-span-6 animate-fade-in text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-white leading-[1.1] tracking-tight whitespace-pre-line mb-6">
              {slide.headline}
            </h1>
            <p className="text-white/65 text-base sm:text-lg max-w-md leading-relaxed mx-auto lg:mx-0 mb-8">
              {slide.sub}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to={slide.ctaPrimary.to}
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white text-sm font-bold tracking-widest px-6 py-3 md:px-8 md:py-4 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200 text-center"
              >
                {slide.ctaPrimary.label}
              </Link>
              <Link
                to={slide.ctaSecondary.to}
                className="w-full sm:w-auto border border-white/20 hover:border-white text-white text-xs font-bold tracking-widest px-8 py-3.5 rounded-[4px] hover:bg-white/5 transition-all duration-200 text-center flex items-center justify-center gap-2"
              >
                {slide.ctaSecondary.label === 'WATCH DEMO' && <Play className="w-3.5 h-3.5 fill-white" />}
                {slide.ctaSecondary.label}
              </Link>
            </div>

            {/* Slide dots visible on mobile, below CTAs */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mt-8 lg:hidden">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-primary w-6' : 'bg-white/20 w-2'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Dashboard Mockup — hidden on mobile to keep hero above fold */}
          <div className="col-span-1 lg:col-span-6 hidden lg:flex items-center justify-center z-10">
            <div className="w-full flex justify-center transform lg:translate-x-4 hover:scale-[1.01] transition-transform duration-300">
              <TradingDashboardMockup
                asset={slide.asset}
                price={slide.price}
                change={slide.change}
                isUp={slide.isUp}
                points={slide.points}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Prev / Next controls — edge-aligned, bottom-third so they don't look like CTAs */}
      <button onClick={prev} aria-label="Previous slide"
        className="absolute left-2 sm:left-4 bottom-20 lg:top-1/2 lg:-translate-y-1/2 z-20 p-2 text-white/30 hover:text-white transition-colors">
        <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>
      <button onClick={next} aria-label="Next slide"
        className="absolute right-2 sm:right-4 bottom-20 lg:top-1/2 lg:-translate-y-1/2 z-20 p-2 text-white/30 hover:text-white transition-colors">
        <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
      </button>

      {/* Dot Indicators — desktop only (mobile dots are inline below CTAs) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === current ? 'bg-primary w-8 shadow-sm shadow-primary/20' : 'bg-white/20 hover:bg-white/40 w-2.5'
            }`}
          />
        ))}
      </div>


    </section>
  );
}
