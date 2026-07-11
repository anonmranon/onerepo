import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import headerLogo from '../assets/header-logo.svg';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setApiError('');
    try {
      const loggedInUser = await login(formData.email, formData.password);
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setApiError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4 py-20">
      <Helmet>
        <title>Sign In | Liquid Broker</title>
        <meta name="description" content="Sign in to your Liquid Broker account to access your trading dashboard." />
      </Helmet>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <Link to="/">
            <img src={headerLogo} alt="LIQUID" className="h-8 w-auto object-contain" />
          </Link>
        </div>

        <div className="bg-dark-secondary rounded-2xl border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to Liquid</h1>
          <p className="text-body-dark text-sm mb-8">Access your trading account</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-body-dark mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full bg-dark border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-body-dark mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full bg-dark border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 pr-11 text-white text-sm focus:outline-none focus:border-primary transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-body-dark hover:text-white transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between text-xs">
              <label htmlFor="remember" className="flex items-center gap-2 text-body-dark cursor-pointer">
                <input id="remember" type="checkbox" className="accent-primary" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </div>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-xs">
                {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:hover:bg-primary text-white font-bold py-3 md:py-4 rounded-full transition-colors mt-2 flex justify-center items-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs text-body-dark">
              <span className="bg-dark-secondary px-3">or</span>
            </div>
          </div>

          {/* Demo login */}
          <button
            onClick={() => {
              navigate('/');
            }}
            disabled={isLoading}
            className="w-full border border-white/20 text-white font-bold py-3 rounded hover:border-white/50 transition-colors text-sm disabled:opacity-50"
          >
            CONTINUE WITH DEMO ACCOUNT
          </button>

          <p className="text-center text-body-dark text-xs mt-6">
            Don't have an account?{' '}
            <Link to="/create-account" className="text-primary hover:underline">Create one free</Link>
          </p>
        </div>

        <p className="text-center text-body-dark text-xs mt-6 max-w-xs mx-auto leading-relaxed">
          By signing in you agree to our Terms of Service and Privacy Policy.
          Trading derivatives carries significant risk.
        </p>
      </div>
    </div>
  );
}
