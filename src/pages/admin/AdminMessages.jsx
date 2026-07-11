import { useState, useEffect } from 'react';
import { Loader2, MailOpen } from 'lucide-react';
import { adminApi } from '../../services/api';

const STATUS_COLORS = {
  UNREAD: 'text-blue-400 bg-blue-400/10',
  READ: 'text-body-dark bg-white/5',
  ARCHIVED: 'text-yellow-400 bg-yellow-400/10',
};

export default function AdminMessages() {
  const [msgs, setMsgs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState('');

  useEffect(() => {
    adminApi.messages().then(setMsgs).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await adminApi.updateMessageStatus(id, 'READ');
      setMsgs(prev => prev.map(m => m.id === id ? { ...m, status: 'READ' } : m));
    } catch (err) { /* ignore */ }
  };

  const toggle = (id) => {
    const msg = msgs.find(m => m.id === id);
    if (msg?.status === 'UNREAD') markRead(id);
    setExpanded(prev => prev === id ? '' : id);
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-body-dark text-sm mt-1">View and manage incoming contact form submissions.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : msgs.length === 0 ? (
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-12 text-center">
          <p className="text-body-dark">No messages yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {msgs.map(msg => (
            <div key={msg.id} className={`bg-dark-secondary border rounded-xl transition-colors ${msg.status === 'UNREAD' ? 'border-primary/20' : 'border-white/5'}`}>
              <button onClick={() => toggle(msg.id)} className="w-full flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 text-left gap-4">
                <div className="flex items-start sm:items-center gap-4">
                  {msg.status === 'UNREAD' && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5 sm:mt-0" />}
                  <div>
                    <p className="text-white font-semibold text-sm">{msg.subject}</p>
                    <p className="text-body-dark text-xs">{msg.name} — {msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLORS[msg.status] || ''}`}>{msg.status}</span>
                  <span className="text-body-dark text-xs whitespace-nowrap">{new Date(msg.createdAt).toLocaleDateString('en-GB')}</span>
                  <MailOpen className="w-4 h-4 text-body-dark flex-shrink-0" />
                </div>
              </button>
              {expanded === msg.id && (
                <div className="px-5 pb-4 border-t border-white/5 pt-4">
                  <p className="text-white text-sm whitespace-pre-wrap">{msg.message}</p>
                  <a href={`mailto:${msg.email}`} className="mt-3 inline-flex items-center gap-1 text-primary text-xs font-bold hover:underline">
                    Reply via email →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
