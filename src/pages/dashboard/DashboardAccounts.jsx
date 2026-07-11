import { useState, useEffect } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react';
import { accountsApi } from '../../services/api';

const ACCOUNT_TYPES = ['DEMO', 'STANDARD', 'ECN', 'ISLAMIC'];

export default function DashboardAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedType, setSelectedType] = useState('DEMO');
  const [showForm, setShowForm] = useState(false);

  const fetchAccounts = () => {
    setIsLoading(true);
    accountsApi.list().then(setAccounts).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(fetchAccounts, []);

  const handleCreate = async () => {
    setIsCreating(true);
    try {
      await accountsApi.create({ type: selectedType, leverage: 100 });
      fetchAccounts();
      setShowForm(false);
    } catch (err) {
      alert(`Failed to create account: ${err.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const STATUS_COLORS = { ACTIVE: 'text-emerald-400', SUSPENDED: 'text-yellow-400', CLOSED: 'text-red-400' };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Trading Accounts</h1>
          <p className="text-body-dark text-sm mt-1">Manage your live and demo trading accounts.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2 px-4 rounded transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Open Account
        </button>
      </div>

      {/* Open Account Form */}
      {showForm && (
        <div className="bg-dark-secondary border border-primary/20 rounded-xl p-6 mb-6">
          <h3 className="text-white font-bold mb-4">Open a New Trading Account</h3>
          <div className="flex flex-wrap gap-3 mb-4">
            {ACCOUNT_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                  selectedType === type
                    ? 'bg-primary border-primary text-white'
                    : 'border-white/10 text-body-dark hover:text-white hover:border-white/30'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <p className="text-body-dark text-xs mb-4">
            {selectedType === 'DEMO' ? '📊 Demo accounts start with $10,000 virtual funds.' : '⚠️ Live accounts require KYC verification and a deposit.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCreate}
              disabled={isCreating}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-sm font-bold py-2 px-5 rounded transition-colors"
            >
              {isCreating && <Loader2 className="w-3 h-3 animate-spin" />}
              {isCreating ? 'Creating...' : 'Confirm & Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="text-body-dark hover:text-white text-sm font-medium transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Accounts List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
      ) : accounts.length === 0 ? (
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-12 text-center">
          <p className="text-body-dark text-sm mb-4">No trading accounts yet. Open your first account above.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {accounts.map(account => (
            <div key={account.id} className="bg-dark-secondary border border-white/5 rounded-xl p-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">{account.type}</span>
                  <span className={`text-xs font-semibold ${STATUS_COLORS[account.status] || 'text-white'}`}>{account.status}</span>
                </div>
                <p className="text-white text-2xl font-bold">${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                <p className="text-body-dark text-xs mt-1">Leverage 1:{account.leverage} · ID: {account.id.slice(0, 8)}...</p>
              </div>
              <div className="text-right">
                <p className="text-body-dark text-xs">Opened</p>
                <p className="text-white text-sm">{new Date(account.createdAt).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
