import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "How do I start trading with Liquid Broker?",
    answer: "Getting started is easy. Simply click the 'Open Account' button to register, verify your identity through our fast KYC process, fund your account using one of our secure payment methods, and you'll be ready to trade on the world's leading markets."
  },
  {
    question: "What is the minimum deposit required?",
    answer: "Our minimum deposit depends on your chosen account tier. A Standard account requires a minimum of $1,000, while a Demo account is completely free and comes with virtual funds for practice."
  },
  {
    question: "Are my funds secure?",
    answer: "Yes. Client funds are kept in segregated accounts with top-tier international banks. We employ bank-level encryption and strict regulatory compliance to ensure the highest level of security for your capital."
  },
  {
    question: "What markets can I trade?",
    answer: "You can trade across 4 major asset classes: Cryptocurrencies (BTC, ETH, etc.), Forex (major, minor, and exotic pairs), Tokenized Real Estate, and Gold (XAU/USD). We offer deep liquidity and ultra-tight spreads across all instruments."
  },
  {
    question: "How long do withdrawals take?",
    answer: "We pride ourselves on fast withdrawals. Most withdrawal requests are processed within 24 hours. Depending on your chosen payment method (crypto, bank wire, or credit card), the funds will reach your account anywhere from a few minutes to 3 business days."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">GOT QUESTIONS?</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Everything you need to know about trading with Liquid Broker.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary shadow-md shadow-primary/5' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <span className={`font-semibold text-lg transition-colors ${isOpen ? 'text-primary' : 'text-gray-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-gray-50 text-gray-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <div 
                  className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 text-center bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-500 mb-6">Our 24/7 support team is always ready to help you.</p>
          <Link to="/contact" className="inline-flex items-center justify-center bg-dark text-white font-bold tracking-wider text-xs px-8 py-4 rounded hover:bg-black transition-colors">
            CONTACT SUPPORT
          </Link>
        </div>
      </div>
    </section>
  );
}
