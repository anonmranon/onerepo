import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Globe, Apple, Laptop, Smartphone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

import payment1 from '../assets/in-liquid-payment-1.svg?url';
import payment2 from '../assets/in-liquid-payment-2.svg?url';
import payment3 from '../assets/in-liquid-payment-3.svg?url';
import payment4 from '../assets/in-liquid-payment-4.svg?url';
import payment5 from '../assets/in-liquid-payment-5.svg?url';
import payment6 from '../assets/in-liquid-payment-6.svg?url';
import laptopMockup from '../assets/in-liquid-3-mockup.png';

import Hero from '../components/Hero';
import LiveTicker from '../components/LiveTicker';
import { DarkFeatureCard, WhyCard } from '../components/Card';
import BlogCard from '../components/BlogCard';
import AwardItem from '../components/AwardItem';
import { Helmet } from 'react-helmet-async';
import StatsBar from '../components/StatsBar';
import FAQ from '../components/FAQ';

// ─── Shared animation variants ────────────────────────────────────────────────

// Fade + slide up — most section headings & text
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

// Stagger wrapper for lists/grids
const staggerContainer = (stagger = 0.1, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// Stagger child — each card/item fades+rises after the previous
const staggerItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Slide from left / right for two-column sections
const slideLeft  = { hidden: { opacity: 0, x: -60 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };
const slideRight = { hidden: { opacity: 0, x:  60 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } };

// Scale pop for step circles
const scalePop = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.34, 1.56, 0.64, 1] } },
};

// Viewport trigger settings — animate once, when 20% visible
const VP = { once: true, amount: 0.2 };


// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    keyName: 'assets',
    title: 'Various assets',
    description:
      'Trade over 300 financial instruments across Crypto, Forex, Real Estate, and Gold, all from a single integrated account.',
  },
  {
    keyName: 'market',
    title: 'Market analysis',
    description:
      'Access daily market insights, technical analysis reports, and actionable trade ideas compiled by our veteran team of market researchers.',
  },
  {
    keyName: 'tools',
    title: 'Enhanced tools',
    description:
      'Take control of your portfolio with advanced charting packages, risk management shields, and automated strategy triggers.',
  },
];

const WHY_CARDS = [
  {
    keyName: 'service',
    title: 'Expert service',
    description:
      'Our dedicated team of trading specialists is available around the clock to guide you through every market condition, from account setup to advanced trading strategies.',
    to: '/company',
  },
  {
    keyName: 'trusted',
    title: 'Trusted and credible',
    description:
      'Regulated by leading financial authorities worldwide, Liquid operates with full transparency, segregated client funds, and a proven track record spanning 25 years.',
    to: '/company',
  },
  {
    keyName: 'strength',
    title: 'Financial strength',
    description:
      'Backed by institutional-grade infrastructure and deep liquidity partnerships, Liquid provides best-execution pricing and ultra-fast order processing on every trade.',
    to: '/accounts',
  },
  {
    keyName: 'support',
    title: 'Integrated support',
    description:
      'From onboarding to advanced platform training, our multi-lingual support team and extensive knowledge base ensure you always have the help you need, when you need it.',
    to: '/education',
  },
];

const STEPS = [
  { num: 1, label: 'Register account' },
  { num: 2, label: 'Fund your account' },
  { num: 3, label: 'Start your trade' },
];

const BLOG_POSTS = [
  {
    category: 'NEWS',
    title: 'Wall Street cautious on \'frothy\' stocks, warn bitcoin bubble',
    author: 'Reuters',
    date: 'Updated June 2026',
    excerpt:
      'Major Wall Street institutions are sounding the alarm on inflated equity valuations, with several strategists drawing parallels between current tech sector multiples and the speculative excess seen during the dot-com era.',
  },
  {
    category: 'ANALYSIS',
    title: 'Will AUD/USD Hit 0.8000 In The Foreseeable Future?',
    author: 'JFD Team',
    date: 'Updated May 2026',
    excerpt:
      'The Australian dollar has staged a remarkable recovery against the greenback, fuelled by improving commodity prices and a resilient domestic labour market. We examine the technical and fundamental case for a push toward 0.8000.',
  },
  {
    category: 'EDUCATION',
    title: 'How Can You Use Volatility to Your Advantage',
    author: 'Barry Norman',
    date: 'Updated April 2026',
    excerpt:
      'Volatility is often feared by retail traders, but experienced professionals view it as opportunity. In this guide, we break down the tools and strategies that allow traders to capitalise on rapid price movement.',
  },
];

const AWARDS = [
  { title: 'Best CFD Broker', event: 'TradeON Summit 2020' },
  { title: 'Best Execution Broker', event: 'Forex EXPO Dubai 2020' },
  { title: 'Best Trading Platform', event: 'London Summit 2020' },
  { title: 'Best Broker Asia', event: 'iFX EXPO 2020' },
];

// Payment logos using real asset SVGs provided by the user
const PAYMENT_METHODS = [
  { label: 'Bitcoin',    src: payment1, h: 'h-8'  },
  { label: 'Mastercard', src: payment2, h: 'h-8'  },
  { label: 'VISA',       src: payment3, h: 'h-7'  },
  { label: 'Skrill',     src: payment4, h: 'h-7'  },
  { label: 'PayPal',     src: payment5, h: 'h-7'  },
  { label: 'NETELLER',   src: payment6, h: 'h-7'  },
];

// ─── Platform Mockup ────────────────────────────────────────────────────────
function LaptopMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto lg:-ml-6 lg:scale-105 transition-all duration-500 hover:scale-[1.03] select-none">
      {/* Laptop Screen Bezel */}
      <div className="bg-[#1c1c1e] rounded-t-2xl p-2.5 border-t border-x border-white/10 shadow-2xl">
        {/* Actual Screen Container */}
        <div className="bg-[#0b0b0c] aspect-video w-full rounded-sm overflow-hidden flex flex-col font-sans text-[8px] text-gray-500 relative border border-white/5">
          {/* Mockup Trading Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#121214] border-b border-white/5">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-[6px] text-white/40 font-mono tracking-wider bg-white/5 px-4 py-0.5 rounded">
              liquidbroker.com/trade/EURUSD
            </div>
            <div className="w-4" />
          </div>

          {/* Mockup Trading Grid */}
          <div className="grid grid-cols-12 flex-1 divide-x divide-white/5">
            {/* Watchlist */}
            <div className="col-span-3 bg-[#0d0d0e] p-2 flex flex-col gap-1.5">
              <div className="text-[5px] font-bold text-white/20 tracking-wider mb-0.5">MARKETS</div>
              {[
                { s: 'EUR/USD', chg: '+0.34%', up: true },
                { s: 'GBP/USD', chg: '+0.12%', up: true },
                { s: 'TSLA', chg: '-2.40%', up: false },
                { s: 'BTC/USD', chg: '-0.85%', up: false }
              ].map((item, idx) => (
                <div key={item.s} className={`p-1 rounded flex items-center justify-between ${idx === 0 ? 'bg-white/5' : ''}`}>
                  <span className="font-bold text-[6px] text-white/80">{item.s}</span>
                  <span className={`text-[5px] font-mono ${item.up ? 'text-green-400' : 'text-primary'}`}>{item.chg}</span>
                </div>
              ))}
            </div>

            {/* Chart Area */}
            <div className="col-span-6 bg-[#09090a] p-2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-white font-bold text-[8px] block">EUR/USD</span>
                  <span className="text-[5px] text-white/30">Sub-millisecond Routing</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold text-[7px] block">1.08945</span>
                  <span className="text-green-400 text-[5px] font-bold">▲ +0.34%</span>
                </div>
              </div>
              
              {/* Chart lines */}
              <div className="h-20 w-full relative border border-white/5 bg-white/[0.01] rounded mt-2 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                  <path d="M0,80 L0,50 L20,40 L40,45 L60,35 L80,25 L100,30 L120,15 L140,20 L160,10 L180,18 L200,8 L200,80 Z" fill="rgba(240,78,35,0.04)" />
                  <path d="M0,50 L20,40 L40,45 L60,35 L80,25 L100,30 L120,15 L140,20 L160,10 L180,18 L200,8" fill="none" stroke="#f04e23" strokeWidth="1.2" />
                  <circle cx="200" cy="8" r="2.5" fill="#f04e23" className="animate-ping" style={{ transformOrigin: '200px 8px' }} />
                  <circle cx="200" cy="8" r="1.5" fill="#f04e23" />
                </svg>
              </div>
            </div>

            {/* Place Order Panel */}
            <div className="col-span-3 bg-[#0d0d0e] p-2 flex flex-col justify-between">
              <div className="flex flex-col gap-1.5">
                <div className="flex rounded bg-white/5 p-0.5 text-[5px] font-bold text-center">
                  <div className="flex-1 py-0.5 rounded bg-[#f04e23] text-white">BUY</div>
                  <div className="flex-1 py-0.5 text-white/40">SELL</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div>
                    <label className="text-[4px] text-white/30 block">LOT SIZE</label>
                    <div className="bg-white/5 border border-white/5 rounded p-0.5 text-[5px] text-white font-semibold">1.00</div>
                  </div>
                  <div>
                    <label className="text-[4px] text-white/30 block">LEVERAGE</label>
                    <div className="bg-white/5 border border-white/5 rounded p-0.5 text-[5px] text-white/70">1:500</div>
                  </div>
                </div>
              </div>
              <button className="w-full bg-[#f04e23] text-white font-bold py-1 rounded text-[5px] tracking-wide">
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Laptop Keyboard Base */}
      <div className="bg-[#b5b5b7] h-2.5 w-full rounded-b-2xl border-b-2 border-neutral-400 relative flex justify-center shadow-xl">
        <div className="w-16 h-0.5 bg-neutral-600/60 rounded-b" />
      </div>
    </div>
  );
}

function AppleSVG() {
  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#111111] group-hover:fill-primary transition-colors" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.8-3.3-.8-1.54 0-2.02.78-3.29.82-1.31.03-2.31-1.3-3.58-3.11C2.92 15.65 1.57 10.15 3.96 6.55c1.1-1.63 3.03-2.69 5.09-2.72 1.3-.03 2.53.88 3.3.88.76 0 2.27-1.07 3.82-0.92 1.95.07 3.48 1.25 4.5 2.87-3.48 2.11-2.92 6.82.55 8.44-.35.83-.82 1.7-1.51 2.68zM12.03 2.5c.8-1.01 1.34-2.42 1.19-3.82-1.2.05-2.67.8-3.53 1.83-.75.87-1.37 2.3-1.19 3.7 1.34.1 2.74-.69 3.53-1.71z"/>
    </svg>
  );
}

function WindowsSVG() {
  return (
    <svg viewBox="0 0 16 16" className="w-6 h-6 fill-[#111111] group-hover:fill-primary transition-colors" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.555 1.375 0 2.237v5.45h6.555zM0 13.795l6.555.933V8.313H0zm7.278-5.4.026 6.378L16 16V8.395zM16 0 7.33 1.244v6.414H16z"/>
    </svg>
  );
}

function AndroidSVG() {
  return (
    <svg viewBox="0 0 466 511.98" className="w-6 h-6 fill-[#111111] group-hover:fill-primary transition-colors" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.39 41.86C0 46.04 0 51.63 0 57.2v397.64c0 5.57 0 9.76 1.4 15.34l216.27-214.86L1.39 41.86zm198.51 195.94L1.4 470.17c7.22 24.57 30.16 41.81 55.8 41.81 11.16 0 20.93-2.79 29.3-8.37l244.16-139.46L199.9 237.8zm234.01-32.7L329.26 145.1 217.65 255.32l113.01 108.83 104.64-58.6c18.14-9.77 30.7-29.3 30.7-50.23-1.4-20.93-13.95-40.46-32.09-50.22zm-234.49 68.35 129.85-128.35L87.9 8.37C79.53 2.79 68.36 0 57.2 0 30.7 0 6.98 18.14 1.4 41.86l198.02 231.59z" />
    </svg>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Helmet>
        <title>Liquid Broker | Advanced Trading Platform</title>
        <meta name="description" content="Trade Crypto, Forex, Real Estate and Gold with zero commission on Liquid Broker. Advanced tools for serious investors." />
      </Helmet>

      {/* 1. Live Market Ticker (CoinGecko real-time data) */}
      <LiveTicker />

      {/* 2. Hero Carousel */}
      <Hero />

      {/* 3. Features Section — heading fades up, cards stagger in */}
      <section className="bg-dark py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative floating orbs (CSS animated, not layout-triggering) */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl blob-morph pointer-events-none" />
        <div className="absolute -bottom-16 right-0 w-72 h-72 bg-primary/5 rounded-full blur-2xl float-slow-r pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Heading fades up */}
          <motion.div
            variants={staggerContainer(0.15, 0)}
            initial="hidden" whileInView="show" viewport={VP}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-14 sm:mb-20"
          >
            <motion.h2
              variants={fadeUp}
              className="text-2xl sm:text-3.5xl lg:text-4xl font-extrabold text-white leading-[1.15] tracking-tight"
            >
              Save your time.{' '}
              <span className="text-primary">Grow your wealth.</span>
              <br />
              Take control only by saving a little more!
            </motion.h2>
            {/* Button with pulse-glow and scale on hover */}
            <motion.div variants={fadeUp}>
              <Link
                to="/accounts"
                className="pulse-glow inline-flex items-center gap-2 border border-white/20 hover:border-primary text-white text-xs font-bold tracking-widest px-8 py-4 rounded-[4px] hover:bg-primary/10 transition-all duration-300 self-start sm:self-center flex-shrink-0"
              >
                FIND OUT MORE <ChevronRight className="w-3.5 h-3.5 stroke-[3.5]" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Cards stagger in one by one */}
          <motion.div
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden" whileInView="show" viewport={VP}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {FEATURES.map((f) => (
              <motion.div key={f.keyName} variants={staggerItem}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <DarkFeatureCard {...f} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. Why Choose Us — cards stagger in */}
      <section className="bg-[#f8f3ef] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer(0.1, 0.05)}
            initial="hidden" whileInView="show" viewport={VP}
          >
            {WHY_CARDS.map((card) => (
              <motion.div key={card.keyName} variants={staggerItem}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <WhyCard {...card} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. Simple Steps — label fades, circles scale-pop with bounce */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100/50">
        <motion.div
          className="max-w-4xl mx-auto border border-gray-200/80 rounded-2xl py-12 px-8 bg-[#fcfaf7] shadow-sm"
          variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
        >
          <p className="text-center text-primary font-bold text-xs tracking-[0.05em] uppercase mb-10">
            Simple steps to start trading
          </p>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative"
            variants={staggerContainer(0.18, 0.15)}
            initial="hidden" whileInView="show" viewport={VP}
          >
            <div className="absolute top-6 left-[16%] right-[16%] h-0.5 bg-gray-200 hidden sm:block z-0" />
            {STEPS.map(({ num, label }) => (
              <motion.div key={num} variants={scalePop} className="flex flex-col items-center gap-3 relative z-10">
                <div className="w-12 h-12 rounded-full border-2 border-primary bg-white flex items-center justify-center text-primary font-bold text-base shadow-sm">
                  {num}
                </div>
                <p className="text-sm text-gray-700 font-semibold tracking-wide text-center">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 6. Platform Section — laptop slides from left, text from right */}
      <section className="bg-[#fcfaf7] py-24 px-4 sm:px-6 lg:px-8 border-b border-gray-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Laptop mockup — slides in from left */}
            <motion.div
              className="order-2 lg:order-1"
              variants={slideLeft} initial="hidden" whileInView="show" viewport={VP}
            >
              <LaptopMockup />
            </motion.div>
            {/* Text block — slides in from right */}
            <motion.div
              className="order-1 lg:order-2"
              variants={staggerContainer(0.1, 0)}
              initial="hidden" whileInView="show" viewport={VP}
            >
              <motion.p variants={fadeUp} className="text-primary text-xs font-bold tracking-[0.05em] uppercase mb-4">
                AVAILABLE ON MULTIPLE PLATFORMS
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-gray-900 font-extrabold mb-6">
                World-class platform.<br />Trade with confidence.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-gray-600 text-base leading-[1.6] mb-10 max-w-lg">
                Engineered for high-frequency trading, our server infrastructure ensures sub-millisecond order routing and maximum uptime during peak market volatility.
              </motion.p>

              {/* Platform cards — stagger */}
              <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
                variants={staggerContainer(0.08, 0.2)}
              >
                {[
                  { Icon: Globe, label: 'Web Trader', desc: 'Browser platform' },
                  { Icon: Apple, label: 'macOS App', desc: 'Desktop client' },
                  { Icon: Laptop, label: 'Windows App', desc: 'Desktop client' },
                  { Icon: Smartphone, label: 'iOS App', desc: 'Mobile terminal' },
                  { Icon: Smartphone, label: 'Android App', desc: 'Mobile terminal' },
                ].map(({ Icon, label, desc }) => (
                  <motion.div key={label} variants={staggerItem}>
                    <Link
                      to="/platforms"
                      className="bg-white border border-gray-200/80 rounded-xl p-5 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-200 group flex flex-col gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        <Icon className="w-5 h-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900 group-hover:text-primary transition-colors">{label}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{desc}</div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. Blog / News — heading + staggered cards */}
      <section className="bg-[#f8f8f8] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-12"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <h2 className="text-gray-900 tracking-tight">Stay ahead of the curve.</h2>
            <Link
              to="/company/news"
              className="text-xs font-bold tracking-[0.05em] text-gray-500 hover:text-primary flex items-center gap-1 transition-colors flex-shrink-0"
            >
              SHOW ALL <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </Link>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={staggerContainer(0.12, 0.1)}
            initial="hidden" whileInView="show" viewport={VP}
          >
            {BLOG_POSTS.map((post) => (
              <motion.div key={post.title} variants={staggerItem}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <BlogCard {...post} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 8. Awards — stagger */}
      <section className="bg-[#f8f8f8] pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden" whileInView="show" viewport={VP}
        >
          {AWARDS.map((a, i) => (
            <motion.div key={a.title} variants={staggerItem}>
              <AwardItem {...a} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* 9. Payment Methods — logos stagger, CTA button pulses */}
      <section className="relative bg-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{ backgroundImage: 'radial-gradient(circle, #111 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.h2
            className="text-gray-900 mb-3"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >Payment methods.</motion.h2>
          <motion.p
            className="text-sm text-gray-500 mb-12"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}
          >Deposit and withdraw with your preferred payment provider.</motion.p>

          {/* Payment logos stagger */}
          <motion.div
            className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-12"
            variants={staggerContainer(0.07, 0.2)}
            initial="hidden" whileInView="show" viewport={VP}
          >
            {PAYMENT_METHODS.map(({ label, src }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                whileHover={{ scale: 1.08, transition: { duration: 0.15 } }}
                className="bg-white border border-gray-200/80 rounded-xl p-4 flex items-center justify-center hover:border-gray-300 hover:shadow-sm transition-colors duration-200 aspect-[3/2] cursor-pointer"
                aria-label={label}
              >
                <img src={src} alt={label} className="h-7 w-auto object-contain" />
              </motion.div>
            ))}
          </motion.div>

          {/* CTA with shimmer effect */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#faf8f5] rounded-xl border border-gray-200/80 px-8 py-5 max-w-3xl mx-auto shadow-sm shimmer-once"
            variants={fadeUp} initial="hidden" whileInView="show" viewport={VP}
          >
            <p className="text-sm text-body-light text-center sm:text-left font-medium">
              Don't see a payment method that works for you? We have other options.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              <Link
                to="/accounts"
                className="flex-shrink-0 bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-[0.05em] px-6 py-3.5 rounded-[4px] flex items-center gap-2 transition-colors"
              >
                MORE OPTIONS <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 10. Stats Bar */}
      <StatsBar />
    </>
  );
}

