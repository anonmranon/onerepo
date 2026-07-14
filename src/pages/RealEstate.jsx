import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TickerBar from '../components/TickerBar';
import { Building2, TrendingUp, ShieldCheck, PieChart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RealEstate() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                Invest in <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Real Estate</span> Globally.
              </h1>
              <p className="text-lg text-body-dark mb-8 max-w-xl">
                Access prime global real estate markets through tokenized assets and REITs. Diversify your portfolio with high-yield, tangible asset investments without the traditional barriers to entry.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/create-account" className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded flex items-center transition-colors">
                  Start Investing <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
                alt="Modern Real Estate" 
                className="relative z-10 rounded-2xl shadow-2xl border border-white/10"
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
            <h2 className="text-3xl font-bold text-white mb-4">Why Trade Real Estate with Liquid?</h2>
            <p className="text-body-dark max-w-2xl mx-auto">
              Real estate offers a unique hedge against inflation and stable, long-term yield generation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Building2, title: 'Fractional Ownership', desc: 'Invest in high-value commercial properties with lower capital requirements.' },
              { icon: PieChart, title: 'Portfolio Diversification', desc: 'Balance your crypto and forex portfolios with stable, tangible assets.' },
              { icon: TrendingUp, title: 'Passive Yield', desc: 'Benefit from rental yield distributions directly to your wallet.' },
              { icon: ShieldCheck, title: 'Asset Backed', desc: 'Every tokenized investment is backed by audited real-world properties.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-dark-card p-6 rounded-xl border border-white/5 hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
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
