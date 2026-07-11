import { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { Loader2, ArrowDownToLine, ArrowUpFromLine, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  const fetchTxs = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.transactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTxs(); }, []);

  const handleAction = async (id, action) => {
    if (!confirm(`Are you sure you want to ${action} this transaction?`)) return;
    setActionLoading(id);
    try {
      if (action === 'approve') await adminApi.approveTransaction(id);
      if (action === 'reject') await adminApi.rejectTransaction(id);
      fetchTxs();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading('');
    }
  };

  const STATUS_COLORS = {
    PENDING: 'text-yellow-400 bg-yellow-400/10',
    COMPLETED: 'text-emerald-400 bg-emerald-400/10',
    REJECTED: 'text-red-400 bg-red-400/10',
  };

  const TYPE_LABELS = {
    DEPOSIT: 'Deposit',
    WITHDRAWAL: 'Withdrawal',
    TRANSFER_IN: 'Transfer (To Wallet)',
    TRANSFER_OUT: 'Transfer (To Account)'
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Transactions Hub</h1>
        <p className="text-body-dark text-sm mt-1">Review pending deposits and withdrawals across the platform.</p>
      </div>

      <div className="bg-dark-secondary border border-white/5 rounded-xl">
        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-sm min-w-[800px]">
            <thead className="border-b border-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">Method / TXID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-body-dark">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 && transactions.map(tx => (
                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{tx.user?.firstName} {tx.user?.lastName}</p>
                    <p className="text-body-dark text-xs">{tx.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {tx.type === 'DEPOSIT' || tx.type === 'TRANSFER_IN' ? <ArrowDownToLine className="w-4 h-4 text-emerald-400" /> : <ArrowUpFromLine className="w-4 h-4 text-red-400" />}
                      <span className="text-white">{TYPE_LABELS[tx.type]}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white font-bold">${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">
                    <p className="text-body-dark">{tx.method}</p>
                    {tx.txHash && <p className="text-xs text-body-dark font-mono mt-1 break-all bg-white/5 p-1 rounded">TXID: {tx.txHash}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded flex items-center inline-flex gap-1.5 ${STATUS_COLORS[tx.status]}`}>
                      {tx.status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
                      {tx.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      {tx.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-dark text-xs">{new Date(tx.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {tx.status === 'PENDING' && (tx.type === 'DEPOSIT' || tx.type === 'WITHDRAWAL') ? (
                      <div className="flex items-center gap-2">
                        {actionLoading === tx.id ? (
                          <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        ) : (
                          <>
                            <button onClick={() => handleAction(tx.id, 'approve')} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1 rounded text-xs font-bold transition-colors">Approve</button>
                            <button onClick={() => handleAction(tx.id, 'reject')} className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-xs font-bold transition-colors">Reject</button>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-body-dark text-xs">No actions</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {isLoading && (
            <div className="px-4 py-12 text-center sticky left-0 w-full"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></div>
          )}
          {!isLoading && transactions.length === 0 && (
            <div className="px-4 py-12 text-center text-body-dark sticky left-0 w-full">No transactions found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
