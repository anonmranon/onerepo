import { Link } from 'react-router-dom';
import { Infinity } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center px-4 text-center">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #f04e23 0, #f04e23 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Infinity className="w-8 h-8 text-primary" strokeWidth={2.5} />
          <span className="text-white font-bold text-xl tracking-widest">LIQUID</span>
        </div>

        <div className="text-[8rem] sm:text-[12rem] font-black text-primary/20 leading-none select-none mb-4">
          404
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-body-dark text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back to the markets.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded transition-colors"
          >
            ← BACK TO HOME
          </Link>
          <Link
            to="/markets"
            className="border border-white/20 text-white font-bold px-8 py-4 rounded hover:border-white/50 transition-colors"
          >
            EXPLORE MARKETS
          </Link>
        </div>
      </div>
    </div>
  );
}
