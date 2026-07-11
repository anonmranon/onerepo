import { useState, useEffect } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { adminApi } from '../../services/api';

const STATUS_COLORS = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  REVIEWING: 'text-blue-400 bg-blue-400/10',
  APPROVED: 'text-emerald-400 bg-emerald-400/10',
  REJECTED: 'text-red-400 bg-red-400/10',
};

export default function AdminPartners() {
  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState('');

  useEffect(() => {
    adminApi.partners().then(setApps).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const review = async (id, status) => {
    setActionId(id);
    try {
      await adminApi.reviewPartner(id, status);
      setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId('');
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Partnership Applications</h1>
        <p className="text-body-dark text-sm mt-1">Review and manage IB, White Label, and Affiliate applications.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : apps.length === 0 ? (
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-12 text-center">
          <p className="text-body-dark">No partnership applications yet.</p>
        </div>
      ) : (
        <div className="bg-dark-secondary border border-white/5 rounded-xl overflow-x-auto scrollbar-none">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-white/5">
              <tr>{['Applicant', 'Company', 'Phone', 'Type', 'Status', 'Date', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-body-dark">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {apps.map(app => (
                <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-white font-medium">{app.name}</p>
                    <p className="text-body-dark text-xs">{app.email}</p>
                  </td>
                  <td className="px-4 py-3 text-body-dark">{app.company}</td>
                  <td className="px-4 py-3 text-body-dark">{app.phone}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-white/5 text-body-dark px-2 py-0.5 rounded">{app.type}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[app.status] || ''}`}>{app.status}</span></td>
                  <td className="px-4 py-3 text-body-dark text-xs">{new Date(app.createdAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-4 py-3">
                    {actionId === app.id ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : app.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button onClick={() => review(app.id, 'APPROVED')} className="flex items-center gap-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-1 rounded transition-colors">
                          <Check className="w-3 h-3" /> Approve
                        </button>
                        <button onClick={() => review(app.id, 'REJECTED')} className="flex items-center gap-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded transition-colors">
                          <X className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    ) : <span className="text-body-dark text-xs">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apps.length === 0 && (
            <div className="px-4 py-12 text-center text-body-dark sticky left-0 w-full">No partnership applications yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
