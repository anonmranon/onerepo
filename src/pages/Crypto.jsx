import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TickerBar from '../components/TickerBar';
import { Bitcoin, Zap, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Crypto() {
  return (
    <div className="min-h-screen bg-dark">
      <Helmet>
        <title>Crypto Trading | Liquid Broker</title>
        <meta name="description" content="Trade Bitcoin, Ethereum, Solana, and more with tight spreads, deep liquidity, and 24/7 access on Liquid Broker." />
      </Helmet>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-primary text-xs font-bold tracking-widest mb-4">CRYPTO TRADING</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Trade the World's Leading{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">
                  Cryptocurrencies.
                </span>
              </h1>
              <p className="text-lg text-body-dark mb-8 max-w-xl">
                Access Bitcoin, Ethereum, Solana, and 50+ crypto assets with institutional-grade
                liquidity, tight spreads, and 24/7 execution. No wallet needed — just trade the price.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/create-account"
                  className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded flex items-center transition-colors"
                >
                  Start Trading <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link
                  to="/create-account"
                  className="border border-white/20 hover:border-white text-white font-bold py-3 px-8 rounded flex items-center transition-colors"
                >
                  Open Demo Account
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-yellow-500/20 rounded-2xl blur-3xl"></div>
              <img
                src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop"
                alt="Cryptocurrency Trading"
                className="relative z-10 rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
          </div>
        </div>
      </section>

      <TickerBar />

      {/* Top Coins */}
      <section className="py-16 bg-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Top Cryptocurrencies</h2>
            <p className="text-body-dark max-w-2xl mx-auto">
              Trade the most liquid and widely traded digital assets in the world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Bitcoin', symbol: 'BTC/USD', icon: '₿', change: '+2.4%' },
              { name: 'Ethereum', symbol: 'ETH/USD', icon: 'Ξ', change: '+1.8%' },
              { name: 'Solana', symbol: 'SOL/USD', icon: '◎', change: '+3.1%' },
              { name: 'Ripple', symbol: 'XRP/USD', icon: '✕', change: '+0.9%' },
              { name: 'BNB', symbol: 'BNB/USD', icon: '⬡', change: '+1.2%' },
              { name: 'Cardano', symbol: 'ADA/USD', icon: '₳', change: '-0.5%' },
              { name: 'Dogecoin', symbol: 'DOGE/USD', icon: 'Ð', change: '+5.2%' },
              { name: 'Polkadot', symbol: 'DOT/USD', icon: '●', change: '+2.7%' },
            ].map((coin) => (
              <div
                key={coin.symbol}
                className="bg-dark-card p-4 rounded-xl border border-white/5 hover:border-orange-400/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{coin.icon}</span>
                  <span className={`text-xs font-bold ${coin.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {coin.change}
                  </span>
                </div>
                <p className="text-white font-bold text-sm">{coin.name}</p>
                <p className="text-body-dark text-xs">{coin.symbol}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Trade Crypto with Liquid?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: '24/7 Markets', desc: 'Crypto markets never close. Trade Bitcoin at midnight or Ethereum at dawn.' },
              { icon: ShieldCheck, title: 'Secure Execution', desc: 'Trade with confidence backed by institutional-grade security protocols.' },
              { icon: TrendingUp, title: 'High Liquidity', desc: 'Deep liquidity pools ensure minimal slippage even on large orders.' },
              { icon: Bitcoin, title: '50+ Assets', desc: 'From BTC and ETH to emerging altcoins, we have the market covered.' },
            ].map((f, i) => (
              <div key={i} className="bg-dark-card p-6 rounded-xl border border-white/5 hover:border-orange-400/50 transition-colors">
                <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-orange-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-body-dark">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
