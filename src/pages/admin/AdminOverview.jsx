import { useState, useEffect } from 'react';
import { Users, Shield, Handshake, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { adminApi } from '../../services/api';

const STAT_CARDS = [
  { key: 'totalUsers', label: 'Total Users', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  { key: 'pendingKyc', label: 'Pending KYC', icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  { key: 'partnerApps', label: 'Partner Apps', icon: Handshake, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { key: 'contactMsgs', label: 'Unread Messages', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { key: 'accounts', label: 'Trading Accounts', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
];

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminApi.stats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Overview</h1>
        <p className="text-body-dark text-sm mt-1">Platform health and key metrics at a glance.</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
            <div key={key} className="bg-dark-secondary border border-white/5 rounded-xl p-5">
              <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <p className="text-3xl font-bold text-white">{stats?.[key] ?? 0}</p>
              <p className="text-body-dark text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
