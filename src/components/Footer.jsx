import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';

const FOOTER_LINKS = {
  PRODUCTS: [
    { label: 'Crypto Trading', path: '/markets/crypto' },
    { label: 'Forex Trading',  path: '/markets/forex' },
    { label: 'Real Estate',    path: '/markets/real-estate' },
    { label: 'Gold Trading',   path: '/markets/gold' },
    { label: 'MetaTrader 5',   path: '/platforms/mt5' },
  ],
  ACCOUNTS: [
    { label: 'Demo Account',     path: '/accounts' },
    { label: 'Standard Account', path: '/accounts' },
    { label: 'Gold Account',     path: '/accounts' },
    { label: 'ECN Account',      path: '/accounts' },
  ],
  RESOURCES: [
    { label: 'Market Insights',    path: '/company/news' },
    { label: 'Trading Strategies', path: '/education/strategy' },
    { label: 'Forex Course',       path: '/education/course' },
    { label: 'Trading Tools',      path: '/resources' },
    { label: 'Support & Guides',   path: '/resources' },
  ],
  COMPANY: [
    { label: 'About Liquid',        path: '/company' },
    { label: 'Company News',        path: '/company/news' },
    { label: 'Partnership Program', path: '/company/partnership' },
    { label: 'Careers',             path: '/company' },
    { label: 'Contact Us',          path: '/contact' },
  ],
};

const SocialIcons = [
  {
    label: 'Facebook',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.88.39-1 1-1h2V2h-3a5 5 0 0 0-5 5v1z" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'Telegram',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.93 1.23-5.46 3.62-.51.35-.98.53-1.39.51-.46-.01-1.33-.26-1.98-.48-.8-.27-1.43-.41-1.37-.87.03-.24.36-.49.99-.74 3.89-1.69 6.49-2.8 7.8-3.32 3.71-1.48 4.48-1.74 4.99-1.75.11 0 .36.03.52.16.14.11.18.26.2.37.03.11.04.24.02.35z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 0 0-2.11 2.107C0 8.05 0 12 0 12s0 3.95.502 5.837a3.003 3.003 0 0 0 2.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 0 0 2.11-2.107C24 15.95 24 12 24 12s0-3.95-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

import headerLogo from '../assets/header-logo.svg';

export default function Footer() {
  // Track which accordion is open on mobile
  const [openSection, setOpenSection] = useState(null);
  const toggle = (key) => setOpenSection((prev) => (prev === key ? null : key));

  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-8 mb-12 border-b border-white/5">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center group" aria-label="Liquid Home">
            <img src={headerLogo} alt="LIQUID" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Social Icons & Secondary Links */}
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            <div className="flex items-center gap-3">
              {SocialIcons.map(({ label, svg }) => (
                <a
                  key={label}
                  href={`https://${label.toLowerCase()}.com/liquidbroker`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  {svg}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-8">
              <Link to="/company/news" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                Company News
              </Link>
              <Link to="/company/partnership" className="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                Partnership
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Links — desktop: 4-column grid, mobile: accordions */}
        <div className="mb-16">
          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-4 gap-8 md:gap-12">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading} className="flex flex-col">
                <h4 className="text-[11px] font-extrabold text-white tracking-[0.08em] uppercase mb-5">
                  {heading}
                </h4>
                <ul className="space-y-3.5">
                  {links.map(({ label, path }) => (
                    <li key={label}>
                      <Link
                        to={path}
                        className="text-sm text-gray-500 hover:text-white transition-colors font-medium"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile accordions */}
          <div className="md:hidden border-t border-white/5">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => {
              const isOpen = openSection === heading;
              return (
                <div key={heading} className="border-b border-white/5">
                  <button
                    onClick={() => toggle(heading)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <span className="text-[11px] font-extrabold text-white tracking-[0.08em] uppercase">
                      {heading}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <ul className="pb-4 space-y-3">
                      {links.map(({ label, path }) => (
                        <li key={label}>
                          <Link
                            to={path}
                            className="block text-sm text-gray-500 hover:text-white transition-colors font-medium pl-1"
                          >
                            {label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Copyright and Legal Section */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex items-center mb-6">
            <p className="text-xs text-gray-500 whitespace-nowrap">
              Copyright &copy;{new Date().getFullYear()} Liquid Inc. All Rights Reserved.
            </p>
            <div className="flex gap-4 ml-6 text-xs font-semibold">
              <Link to="/terms" className="text-gray-500 hover:text-white transition-colors">Terms</Link>
              <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy</Link>
              <Link to="/risk-disclosure" className="text-gray-500 hover:text-white transition-colors">Risk Disclosure</Link>
            </div>
            <div className="flex-grow h-[1px] bg-white/5 ml-4 hidden sm:block" />
          </div>

          <p className="text-xs text-gray-500 leading-relaxed max-w-7xl">
            Trading derivatives and leveraged products carries a high level of risk, including the risk
            of losing substantially more than your initial investment. It is not suitable for everyone.
            Before you make any decision in relation to a financial product you should obtain and
            consider our Product Disclosure Statement (PDS) and Financial Services Guide (FSG)
            available on our website and seek independent advice if necessary.
          </p>
        </div>

      </div>
    </footer>
  );
}
