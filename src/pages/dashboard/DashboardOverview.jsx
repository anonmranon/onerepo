import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, User, PlusCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { accountsApi } from '../../services/api';
import LiveTicker from '../../components/LiveTicker';
import AdvancedChart from '../../components/AdvancedChart';

export default function DashboardOverview() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    accountsApi.list()
      .then(setAccounts)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.firstName} 👋
        </h1>
        <p className="text-body-dark text-sm mt-1">Here's a summary of your account activity.</p>
      </div>

      {/* Live Ticker Tape */}
      <div className="mb-8 border-y border-white/5 bg-dark-secondary py-2 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <LiveTicker />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-2 text-body-dark text-xs font-semibold mb-3">
            <TrendingUp className="w-4 h-4" /> TOTAL BALANCE
          </div>
          <p className="text-2xl font-bold text-white">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-body-dark text-xs mt-1">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-2 text-body-dark text-xs font-semibold mb-3">
            <Shield className="w-4 h-4" /> KYC STATUS
          </div>
          <p className="text-lg font-bold text-yellow-400">Pending Verification</p>
          <p className="text-body-dark text-xs mt-1">Upload your documents to unlock full access</p>
        </div>
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-2 text-body-dark text-xs font-semibold mb-3">
            <User className="w-4 h-4" /> ACCOUNT STATUS
          </div>
          <p className="text-lg font-bold text-emerald-400">Active</p>
          <p className="text-body-dark text-xs mt-1">Member since {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Accounts */}
      <div className="bg-dark-secondary border border-white/5 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold">My Trading Accounts</h2>
          <Link to="/dashboard/accounts" className="text-primary text-xs font-bold hover:underline flex items-center gap-1">
            Manage <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {isLoading ? (
          <p className="text-body-dark text-sm">Loading accounts...</p>
        ) : accounts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-body-dark text-sm mb-4">You don't have any trading accounts yet.</p>
            <Link to="/dashboard/accounts" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2 px-4 rounded transition-colors">
              <PlusCircle className="w-4 h-4" /> Open Demo Account
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {accounts.map(account => (
              <div key={account.id} className="flex items-center justify-between bg-dark rounded-lg px-4 py-3 border border-white/5">
                <div>
                  <p className="text-white font-semibold text-sm">{account.type} Account</p>
                  <p className="text-body-dark text-xs">Leverage 1:{account.leverage} · {account.status}</p>
                </div>
                <p className="text-white font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Market Chart */}
      <div className="bg-dark-secondary border border-white/5 rounded-xl p-6 mb-6">
        <h2 className="text-white font-bold mb-4">Live Market Chart</h2>
        <AdvancedChart />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/dashboard/kyc" className="bg-dark-secondary border border-yellow-400/20 hover:border-yellow-400/40 rounded-xl p-5 flex items-center gap-4 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Complete KYC Verification</p>
            <p className="text-body-dark text-xs">Upload ID to unlock live trading</p>
          </div>
          <ArrowRight className="w-4 h-4 text-body-dark ml-auto group-hover:text-white transition-colors" />
        </Link>
        <Link to="/dashboard/profile" className="bg-dark-secondary border border-white/5 hover:border-white/15 rounded-xl p-5 flex items-center gap-4 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Edit Profile</p>
            <p className="text-body-dark text-xs">Update your personal details</p>
          </div>
          <ArrowRight className="w-4 h-4 text-body-dark ml-auto group-hover:text-white transition-colors" />
        </Link>
      </div>
    </div>
  );
}
