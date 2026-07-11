import { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  {
    label: 'Markets',
    path: '/markets',
    dropdown: [
      { label: 'All Markets',  path: '/markets' },
      { label: 'Share CFDs',   path: '/markets/share-cfds' },
      { label: 'Forex',        path: '/markets/forex' },
      { label: 'Indices',      path: '/markets/indices' },
      { label: 'Commodities',  path: '/markets/commodities' },
    ],
  },
  {
    label: 'Platforms',
    path: '/platforms',
    dropdown: [
      { label: 'All Platforms',     path: '/platforms' },
      { label: 'MetaTrader 5',      path: '/platforms/mt5' },
      { label: 'Compare Platforms', path: '/platforms/compare' },
    ],
  },
  {
    label: 'Education',
    path: '/education',
    dropdown: [
      { label: 'Education Hub',      path: '/education' },
      { label: 'Trading Strategies', path: '/education/strategy' },
      { label: 'Forex Course',       path: '/education/course' },
    ],
  },
  {
    label: 'Accounts',
    path: '/accounts',
    dropdown: [
      { label: 'Account Types',    path: '/accounts' },
      { label: 'Demo Account',     path: '/accounts#demo' },
      { label: 'Standard Account', path: '/accounts#standard' },
      { label: 'ECN Account',      path: '/accounts#ecn' },
    ],
  },
];

function DropdownMenu({ items, open }) {
  return (
    <div
      className={`absolute top-full left-0 pt-2 w-48 z-50 transition-all duration-200 ${
        open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
      }`}
    >
      <div className="bg-[#242424] border border-white/10 rounded shadow-2xl overflow-hidden">
        {/* key by label — paths may not be unique */}
        {items.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="block px-4 py-3 text-sm text-body-dark hover:text-white hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

import headerLogo from '../assets/header-logo.svg';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileSection, setOpenMobileSection] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dropdownTimeout = useRef(null);

  const { user, logout } = useAuth();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#333333] shadow-2xl' : 'bg-[#333333]/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group" aria-label="Liquid Home">
            <img src={headerLogo} alt="LIQUID" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded ${
                      isActive ? 'text-white' : 'text-body-dark hover:text-white'
                    }`
                  }
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </NavLink>
                {item.dropdown && <DropdownMenu items={item.dropdown} open={openDropdown === item.label} />}
              </div>
            ))}
          </div>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-1.5 px-3 py-2 text-body-dark hover:text-white transition-colors text-xs font-bold tracking-widest"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  DASHBOARD
                </Link>
                <button
                  onClick={logout}
                  className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-body-dark text-xs font-bold tracking-widest px-5 py-3 rounded-[4px] shadow-lg transition-colors flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 text-body-dark hover:text-white transition-colors text-xs font-bold tracking-widest"
                  aria-label="Login"
                >
                  <User className="w-4 h-4" />
                  LOGIN
                </Link>
                <Link
                  to="/create-account"
                  className="bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-widest px-5 py-2.5 lg:px-6 lg:py-3 rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/25 hover:-translate-y-0.5 transition-all duration-200"
                >
                  CREATE ACCOUNT
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Drawer ───────────────────────────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/50 z-40"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Panel — fixed height, scrollable list, pinned CTA footer */}
      <div
        className={`lg:hidden fixed top-16 left-0 right-0 z-50 flex flex-col bg-[#1a1a1a] border-t border-white/10 transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-y-0' : '-translate-y-[calc(100%+4rem)]'
        }`}
        style={{ maxHeight: 'calc(100dvh - 64px)' }}
      >
        {/* Scrollable nav list */}
        <div className="flex-1 overflow-y-auto overscroll-contain pb-2 scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const isOpen = openMobileSection === item.label;
            return (
              <div key={item.label} className="border-b border-white/5">
                {/* Section header — tapping expands, not navigates */}
                <button
                  onClick={() => setOpenMobileSection(isOpen ? null : item.label)}
                  className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                >
                  {item.label}
                  <ChevronRight
                    className={`w-4 h-4 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                  />
                </button>

                {/* Sub-links — animate open */}
                {isOpen && (
                  <div className="bg-white/[0.03] border-t border-white/5">
                    {/* Parent link */}
                    <Link
                      to={item.path}
                      onClick={closeMobile}
                      className="flex items-center px-8 py-3 text-xs font-bold text-primary tracking-widest uppercase"
                    >
                      View All {item.label} →
                    </Link>
                    {item.dropdown.slice(1).map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        onClick={closeMobile}
                        className="block px-8 py-3 text-sm text-white/60 hover:text-white border-t border-white/5 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll-fade indicator */}
        <div className="h-6 bg-gradient-to-t from-[#1a1a1a] to-transparent -mt-6 pointer-events-none relative z-10" />

        {/* Pinned CTA footer — always visible, never requires scroll */}
        <div className="flex-shrink-0 border-t border-white/10 px-5 py-4 flex flex-col gap-3 bg-[#1a1a1a]">
          {user ? (
            <>
              <Link
                to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 border border-white/20 text-white text-xs font-bold tracking-widest px-5 py-3.5 rounded-[4px] hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> DASHBOARD
              </Link>
              <button
                onClick={() => { logout(); closeMobile(); }}
                className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold tracking-widest px-5 py-3.5 rounded-[4px] transition-colors"
              >
                <LogOut className="w-4 h-4" /> LOGOUT
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 border border-white/20 text-white text-xs font-bold tracking-widest px-5 py-3.5 rounded-[4px] hover:border-white/40 hover:bg-white/5 transition-colors"
              >
                <User className="w-4 h-4" /> LOGIN
              </Link>
              <Link
                to="/create-account"
                onClick={closeMobile}
                className="flex items-center justify-center bg-primary hover:bg-primary-dark text-white text-xs font-bold tracking-widest px-5 py-3 rounded-full transition-colors shadow-lg shadow-primary/20"
              >
                CREATE ACCOUNT
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
