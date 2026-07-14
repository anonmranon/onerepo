import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, X, User, Wallet, Shield, Gift, Lock, Trash2, Edit, ChevronDown } from 'lucide-react';
import { adminApi } from '../../services/api';

const STATUS_COLORS = {
  ACTIVE: 'text-emerald-400 bg-emerald-400/10',
  SUSPENDED: 'text-yellow-400 bg-yellow-400/10',
  BANNED: 'text-red-400 bg-red-400/10',
};

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-dark-secondary border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <h3 className="text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-body-dark hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function InputRow({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full bg-dark border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [modal, setModal] = useState(null); // { type, user }
  const [tradingAccounts, setTradingAccounts] = useState([]);

  // Form states
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    adminApi.users({ search: search || undefined, status: filterStatus || undefined })
      .then(setUsers).catch(console.error).finally(() => setIsLoading(false));
  }, [search, filterStatus]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openModal = async (type, user) => {
    setModal({ type, user });
    setSelectedUser(user);
    setAmount(''); setNote(''); setPromoCode(''); setNewPassword(''); setFeedback('');
    if (type === 'accounts') {
      const accs = await adminApi.getUserAccounts(user.id).catch(() => []);
      setTradingAccounts(accs);
    }
  };

  const closeModal = () => { setModal(null); setFeedback(''); };

  const run = async (fn, successMsg) => {
    setActionLoading('modal');
    try {
      await fn();
      setFeedback('✅ ' + successMsg);
      fetchUsers();
    } catch (err) {
      setFeedback('❌ ' + (err.message || 'Error'));
    } finally {
      setActionLoading('');
    }
  };

  const changeStatus = (id, status) => {
    setActionLoading(id);
    adminApi.updateUserStatus(id, status)
      .then(() => setUsers(p => p.map(u => u.id === id ? { ...u, status } : u)))
      .catch(err => alert(err.message))
      .finally(() => setActionLoading(''));
  };

  const deleteUser = async (user) => {
    if (!confirm(`Permanently delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
    setActionLoading(user.id);
    await adminApi.deleteUser(user.id).catch(err => alert(err.message));
    fetchUsers();
    setActionLoading('');
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-body-dark text-sm mt-1">View, search, and manage all registered users with full admin controls.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-body-dark absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search name or email..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-secondary border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-primary" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-dark-secondary border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-dark-secondary border border-white/5 rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[850px]">
          <thead className="border-b border-white/5">
            <tr>
              {['User', 'Country', 'Wallet', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-body-dark">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-body-dark text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-body-dark">{user.country || '—'}</td>
                <td className="px-4 py-3 text-emerald-400 font-bold">${user.walletBalance?.toFixed(2) || '0.00'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[user.status] || ''}`}>{user.status}</span>
                </td>
                <td className="px-4 py-3 text-body-dark text-xs">{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-4 py-3">
                  {actionLoading === user.id ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <div className="relative group inline-block">
                      <button className="flex items-center gap-1 text-xs text-body-dark hover:text-white border border-white/10 rounded px-2 py-1">
                        Actions <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 mt-1 w-52 bg-dark-card border border-white/10 rounded-lg shadow-xl z-50 hidden group-hover:block">
                        <button onClick={() => openModal('view', user)} className="w-full text-left px-4 py-2 text-xs text-body-dark hover:text-white hover:bg-white/5 flex items-center gap-2 rounded-t-lg">
                          <User className="w-3.5 h-3.5" /> View Profile
                        </button>
                        <button onClick={() => openModal('credit', user)} className="w-full text-left px-4 py-2 text-xs text-emerald-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                          <Wallet className="w-3.5 h-3.5" /> Credit Wallet
                        </button>
                        <button onClick={() => openModal('debit', user)} className="w-full text-left px-4 py-2 text-xs text-yellow-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                          <Wallet className="w-3.5 h-3.5" /> Debit Wallet
                        </button>
                        <button onClick={() => openModal('bonus', user)} className="w-full text-left px-4 py-2 text-xs text-purple-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                          <Gift className="w-3.5 h-3.5" /> Add Promo Bonus
                        </button>
                        <button onClick={() => openModal('accounts', user)} className="w-full text-left px-4 py-2 text-xs text-blue-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                          <Edit className="w-3.5 h-3.5" /> Trading Accounts
                        </button>
                        <button onClick={() => openModal('password', user)} className="w-full text-left px-4 py-2 text-xs text-orange-400 hover:bg-white/5 flex items-center gap-2 border-t border-white/5">
                          <Lock className="w-3.5 h-3.5" /> Reset Password
                        </button>
                        {['ACTIVE', 'SUSPENDED', 'BANNED'].filter(s => s !== user.status).map(s => (
                          <button key={s} onClick={() => changeStatus(user.id, s)} className="w-full text-left px-4 py-2 text-xs text-body-dark hover:text-white hover:bg-white/5 border-t border-white/5">
                            Set {s}
                          </button>
                        ))}
                        {user.role !== 'ADMIN' && (
                          <button onClick={() => adminApi.updateUserRole(user.id, 'ADMIN').then(fetchUsers)} className="w-full text-left px-4 py-2 text-xs text-primary hover:bg-white/5 border-t border-white/5">
                            <Shield className="w-3.5 h-3.5 inline mr-2" />Promote to Admin
                          </button>
                        )}
                        <button onClick={() => deleteUser(user)} className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-400/10 flex items-center gap-2 border-t border-white/5 rounded-b-lg">
                          <Trash2 className="w-3.5 h-3.5" /> Delete User
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isLoading && <div className="py-12 text-center"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></div>}
        {!isLoading && users.length === 0 && <div className="py-12 text-center text-body-dark">No users found.</div>}
        {!isLoading && users.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 text-body-dark text-xs">{users.length} user{users.length !== 1 ? 's' : ''} found</div>
        )}
      </div>

      {/* ── Modals ── */}

      {/* View Profile */}
      {modal?.type === 'view' && (
        <Modal title="User Profile" onClose={closeModal}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
              {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
            </div>
            <div>
              <p className="text-white font-bold text-lg">{selectedUser.firstName} {selectedUser.lastName}</p>
              <p className="text-body-dark text-sm">{selectedUser.email}</p>
              <div className="flex gap-2 mt-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[selectedUser.status]}`}>{selectedUser.status}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-body-dark">{selectedUser.role}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              ['Phone', selectedUser.phone],
              ['Country', selectedUser.country],
              ['DOB', selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString() : '—'],
              ['Joined', new Date(selectedUser.createdAt).toLocaleDateString()],
              ['Wallet', `$${selectedUser.walletBalance?.toFixed(2) || '0.00'}`],
              ['Accounts', selectedUser._count?.accounts ?? 0],
            ].map(([k, v]) => (
              <div key={k} className="bg-dark rounded-lg p-3 border border-white/5">
                <p className="text-[10px] text-body-dark uppercase tracking-wider mb-1">{k}</p>
                <p className="text-white font-medium">{v || '—'}</p>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Credit Wallet */}
      {modal?.type === 'credit' && (
        <Modal title={`Credit Wallet — ${selectedUser.firstName}`} onClose={closeModal}>
          <p className="text-body-dark text-sm mb-4">Add funds directly to the user's main wallet balance. An email notification will be sent.</p>
          <InputRow label="Amount (USD)" value={amount} onChange={setAmount} type="number" placeholder="e.g. 500" />
          <InputRow label="Internal Note (optional)" value={note} onChange={setNote} placeholder="e.g. Deposit correction" />
          {feedback && <p className="text-sm mb-3">{feedback}</p>}
          <button onClick={() => run(() => adminApi.creditWallet(selectedUser.id, parseFloat(amount), note), 'Wallet credited successfully!')}
            disabled={actionLoading === 'modal' || !amount}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-2.5 rounded transition-colors">
            {actionLoading === 'modal' ? 'Processing...' : 'Credit Wallet'}
          </button>
        </Modal>
      )}

      {/* Debit Wallet */}
      {modal?.type === 'debit' && (
        <Modal title={`Debit Wallet — ${selectedUser.firstName}`} onClose={closeModal}>
          <p className="text-body-dark text-sm mb-4">Remove funds from the user's wallet. Balance: <strong className="text-white">${selectedUser.walletBalance?.toFixed(2)}</strong></p>
          <InputRow label="Amount (USD)" value={amount} onChange={setAmount} type="number" placeholder="e.g. 100" />
          <InputRow label="Reason (optional)" value={note} onChange={setNote} placeholder="e.g. Fee adjustment" />
          {feedback && <p className="text-sm mb-3">{feedback}</p>}
          <button onClick={() => run(() => adminApi.debitWallet(selectedUser.id, parseFloat(amount), note), 'Wallet debited.')}
            disabled={actionLoading === 'modal' || !amount}
            className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold py-2.5 rounded transition-colors">
            {actionLoading === 'modal' ? 'Processing...' : 'Debit Wallet'}
          </button>
        </Modal>
      )}

      {/* Promo Bonus */}
      {modal?.type === 'bonus' && (
        <Modal title={`Add Promo Bonus — ${selectedUser.firstName}`} onClose={closeModal}>
          <p className="text-body-dark text-sm mb-4">Credit a promotional bonus to the user's wallet. This will be logged as a PROMO transaction.</p>
          <InputRow label="Bonus Amount (USD)" value={amount} onChange={setAmount} type="number" placeholder="e.g. 250" />
          <InputRow label="Promo Code (optional)" value={promoCode} onChange={setPromoCode} placeholder="e.g. SUMMER2025" />
          {feedback && <p className="text-sm mb-3">{feedback}</p>}
          <button onClick={() => run(() => adminApi.addBonus(selectedUser.id, parseFloat(amount), promoCode), 'Bonus credited!')}
            disabled={actionLoading === 'modal' || !amount}
            className="w-full bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-bold py-2.5 rounded transition-colors">
            {actionLoading === 'modal' ? 'Processing...' : 'Add Bonus'}
          </button>
        </Modal>
      )}

      {/* Reset Password */}
      {modal?.type === 'password' && (
        <Modal title={`Reset Password — ${selectedUser.firstName}`} onClose={closeModal}>
          <p className="text-body-dark text-sm mb-4">Set a new temporary password for this user. They should be advised to change it after login.</p>
          <InputRow label="New Password (min 8 chars)" value={newPassword} onChange={setNewPassword} type="password" placeholder="••••••••" />
          {feedback && <p className="text-sm mb-3">{feedback}</p>}
          <button onClick={() => run(() => adminApi.resetPassword(selectedUser.id, newPassword), 'Password reset successfully.')}
            disabled={actionLoading === 'modal' || newPassword.length < 8}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded transition-colors">
            {actionLoading === 'modal' ? 'Resetting...' : 'Reset Password'}
          </button>
        </Modal>
      )}

      {/* Trading Accounts */}
      {modal?.type === 'accounts' && (
        <Modal title={`Trading Accounts — ${selectedUser.firstName}`} onClose={closeModal}>
          {tradingAccounts.length === 0 ? (
            <p className="text-body-dark text-sm text-center py-4">No trading accounts found.</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tradingAccounts.map(acc => (
                <div key={acc.id} className="bg-dark border border-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{acc.type}</span>
                      <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded ${acc.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>{acc.status}</span>
                    </div>
                    <button onClick={() => run(() => adminApi.deleteTradingAccount(selectedUser.id, acc.id).then(() => setTradingAccounts(p => p.filter(a => a.id !== acc.id))), 'Account deleted.')}
                      className="text-red-400 hover:text-red-300 text-xs">Delete</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div><p className="text-body-dark">Balance</p><p className="text-white font-bold">${acc.balance?.toFixed(2)}</p></div>
                    <div><p className="text-body-dark">Leverage</p><p className="text-white font-bold">1:{acc.leverage}</p></div>
                    <div>
                      <p className="text-body-dark mb-1">Type</p>
                      <select defaultValue={acc.type}
                        onChange={e => adminApi.updateTradingAccount(selectedUser.id, acc.id, { type: e.target.value })}
                        className="bg-dark-secondary border border-white/10 rounded px-1 py-0.5 text-white text-xs w-full">
                        {['DEMO','STANDARD','GOLD','ECN'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {feedback && <p className="text-sm mt-3">{feedback}</p>}
        </Modal>
      )}
    </div>
  );
}
