import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-dark-card border-t border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex-1 text-sm text-body-dark max-w-4xl pr-8">
        <p>
          We use cookies to improve your experience on our site, analyze site traffic, and serve targeted advertisements. By continuing to use our site, you consent to our use of cookies as described in our <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
        </p>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={acceptCookies}
          className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded transition-colors"
        >
          Accept
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="text-body-dark hover:text-white transition-colors p-2"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
