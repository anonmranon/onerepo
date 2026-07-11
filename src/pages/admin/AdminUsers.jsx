import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, ChevronDown, X, User, Phone, MapPin, Wallet, Shield, FileText } from 'lucide-react';
import { adminApi } from '../../services/api';

const STATUS_COLORS = {
  ACTIVE: 'text-emerald-400 bg-emerald-400/10',
  SUSPENDED: 'text-yellow-400 bg-yellow-400/10',
  BANNED: 'text-red-400 bg-red-400/10',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(() => {
    setIsLoading(true);
    adminApi.users({ search: search || undefined, status: filterStatus || undefined })
      .then(setUsers)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [search, filterStatus]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const changeStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await adminApi.updateUserStatus(id, status);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="text-body-dark text-sm mt-1">View, search, and manage all registered users.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-body-dark absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="Search name or email..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-dark-secondary border border-white/10 rounded-lg pl-9 pr-4 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-dark-secondary border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary transition-colors">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BANNED">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-dark-secondary border border-white/5 rounded-xl overflow-x-auto scrollbar-none">
        <table className="w-full text-sm min-w-[700px]">
          <thead className="border-b border-white/5">
            <tr>
              {['User', 'Country', 'Role', 'Accounts', 'Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-body-dark">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && users.map(user => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedUser(user)}>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-white font-medium group-hover:text-primary transition-colors">{user.firstName} {user.lastName}</p>
                      <p className="text-body-dark text-xs">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-body-dark">{user.country || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-white/5 text-body-dark'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-white">{user._count?.accounts ?? 0}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[user.status] || ''}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-body-dark text-xs">{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                <td className="px-4 py-3">
                  {actionLoading === user.id ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <div className="relative group inline-block">
                      <button className="flex items-center gap-1 text-xs text-body-dark hover:text-white transition-colors">
                        Actions <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="absolute right-0 mt-1 w-40 bg-dark-card border border-white/10 rounded-lg shadow-xl z-50 hidden group-hover:block">
                        <button onClick={() => setSelectedUser(user)} className="w-full text-left px-4 py-2 text-xs text-body-dark hover:text-white hover:bg-white/5 transition-colors rounded-t-lg">
                          View Details
                        </button>
                        {['ACTIVE', 'SUSPENDED', 'BANNED'].filter(s => s !== user.status).map(s => (
                          <button key={s} onClick={() => changeStatus(user.id, s)}
                            className="w-full text-left px-4 py-2 text-xs text-body-dark hover:text-white hover:bg-white/5 transition-colors last:rounded-b-lg border-t border-white/5">
                            Set {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {isLoading && (
          <div className="px-4 py-12 text-center sticky left-0 w-full"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></div>
        )}
        
        {!isLoading && users.length === 0 && (
          <div className="px-4 py-12 text-center text-body-dark sticky left-0 w-full">No users found.</div>
        )}

        {!isLoading && users.length > 0 && (
          <div className="px-4 py-3 border-t border-white/5 text-body-dark text-xs">{users.length} user{users.length !== 1 ? 's' : ''} found</div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-dark-secondary border border-white/10 rounded-2xl w-full max-w-2xl max-h-full overflow-y-auto shadow-2xl relative">
            
            <div className="sticky top-0 bg-dark-secondary border-b border-white/5 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> User Profile
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-body-dark hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Header Info */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0">
                  {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-body-dark text-sm">{selectedUser.email}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_COLORS[selectedUser.status] || ''}`}>{selectedUser.status}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-body-dark">{selectedUser.role}</span>
                  </div>
                </div>
              </div>

              {/* Grid Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-body-dark uppercase tracking-wider mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone Number</label>
                    <p className="text-sm text-white font-medium">{selectedUser.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-body-dark uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Country</label>
                    <p className="text-sm text-white font-medium">{selectedUser.country || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-body-dark uppercase tracking-wider mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Date of Birth</label>
                    <p className="text-sm text-white font-medium">{selectedUser.dob ? new Date(selectedUser.dob).toLocaleDateString('en-GB') : 'Not provided'}</p>
                  </div>
                </div>

                <div className="space-y-4 bg-dark border border-white/5 p-4 rounded-xl">
                  <div>
                    <label className="text-[10px] font-bold text-body-dark uppercase tracking-wider mb-1 flex items-center gap-1"><Wallet className="w-3 h-3 text-emerald-400" /> Main Wallet Balance</label>
                    <p className="text-2xl text-emerald-400 font-bold">${selectedUser.walletBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-body-dark uppercase tracking-wider mb-1">Joined Date</label>
                    <p className="text-sm text-white font-medium">{new Date(selectedUser.createdAt).toLocaleString('en-GB')}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-body-dark uppercase tracking-wider mb-1">Trading Accounts</label>
                    <p className="text-sm text-white font-medium">{selectedUser._count?.accounts ?? 0} active</p>
                  </div>
                </div>
              </div>

              {/* KYC Documents */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2 border-b border-white/5 pb-2">
                  <Shield className="w-4 h-4 text-primary" /> KYC Documents Submitted
                </h4>
                {(!selectedUser.kycDocuments || selectedUser.kycDocuments.length === 0) ? (
                  <p className="text-sm text-body-dark italic">No documents uploaded.</p>
                ) : (
                  <div className="flex flex-col gap-3 mt-4">
                    {selectedUser.kycDocuments.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between bg-dark p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-white">{doc.type}</p>
                            <p className="text-[10px] text-body-dark">Submitted: {new Date(doc.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          doc.status === 'APPROVED' ? 'bg-emerald-400/10 text-emerald-400' :
                          doc.status === 'REJECTED' ? 'bg-red-400/10 text-red-400' :
                          'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
