import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TickerBar from '../components/TickerBar';
import { Coins, Anchor, ArrowRight, Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Gold() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[#f59e0b]/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Trade the Ultimate Safe Haven: <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fcd34d] to-[#d97706]">Gold.</span>
              </h1>
              <p className="text-lg text-body-dark mb-8 max-w-xl">
                Trade spot Gold (XAU/USD) with ultra-tight spreads, lightning-fast execution, and institutional liquidity. Secure your wealth and capitalize on market volatility.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/create-account" className="bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold py-3 px-8 rounded flex items-center transition-colors">
                  Trade Gold Now <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f59e0b]/20 to-[#d97706]/20 rounded-2xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=2070&auto=format&fit=crop" 
                alt="Gold Bullion" 
                className="relative z-10 rounded-2xl shadow-2xl border border-[#f59e0b]/20"
              />
            </div>
          </div>
        </div>
      </section>

      <TickerBar />

      {/* Features */}
      <section className="py-20 bg-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Trade Gold (XAU/USD) with Us?</h2>
            <p className="text-body-dark max-w-2xl mx-auto">
              Gold has historically maintained its value over time, making it an excellent hedge against inflation and currency depreciation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Safe Haven', desc: 'Protect your portfolio against economic instability and inflation.' },
              { icon: Activity, title: 'High Liquidity', desc: 'Execute large orders with minimal slippage thanks to deep institutional liquidity.' },
              { icon: Anchor, title: 'Store of Value', desc: 'Gold is recognized globally as the ultimate store of value.' },
              { icon: Coins, title: 'Tight Spreads', desc: 'Trade XAU/USD with raw spreads starting from 0.0 pips on our ECN accounts.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-dark-card p-6 rounded-xl border border-white/5 hover:border-[#f59e0b]/50 transition-colors">
                <div className="w-12 h-12 bg-[#f59e0b]/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#f59e0b]" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-body-dark">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
