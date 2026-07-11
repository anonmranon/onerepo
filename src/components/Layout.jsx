import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTopBtn from './ScrollToTopBtn';
import CookieBanner from './CookieBanner';

export default function Layout() {
  const { pathname, hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      // Small timeout ensures DOM is fully rendered before calculating position
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          // Adjust for fixed navbar (64px = 4rem) plus some padding
          const y = element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return (
    <div className="min-h-screen flex flex-col font-sans overflow-x-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-white focus:top-0 focus:left-0 font-bold">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTopBtn />
      <CookieBanner />
    </div>
  );
}
