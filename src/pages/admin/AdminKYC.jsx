import { useState, useEffect } from 'react';
import { Loader2, Check, X, Eye, FileText, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminApi } from '../../services/api';

const STATUS_COLORS = {
  PENDING: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  APPROVED: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  REJECTED: 'text-red-400 bg-red-400/10 border-red-400/20',
};

// Simulated document preview — shows a placeholder since files are stored as names in demo mode
function DocumentModal({ doc, onClose }) {
  const isImage = doc.fileUrl && /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.fileUrl);
  const isPdf   = doc.fileUrl && /\.pdf$/i.test(doc.fileUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-dark border border-white/10 rounded-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
          <div>
            <p className="text-white font-bold">{doc.type}</p>
            <p className="text-body-dark text-xs mt-0.5">
              {doc.user?.firstName} {doc.user?.lastName} · {doc.user?.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold px-2 py-1 rounded border ${STATUS_COLORS[doc.status] || ''}`}>{doc.status}</span>
            <button onClick={onClose} className="text-body-dark hover:text-white p-1 bg-white/5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-6 bg-[#111]">
          {/* In production, this would render an actual file URL from S3/cloud storage.
              In this demo, we display a professional placeholder showing the filename. */}
          <div className="w-full max-w-lg bg-dark-secondary border border-white/10 rounded-xl overflow-hidden">
            {/* Mock document header */}
            <div className="bg-white/5 px-5 py-3 flex items-center gap-3 border-b border-white/5">
              <FileText className="w-5 h-5 text-primary" />
              <p className="text-white text-sm font-medium truncate">{doc.fileUrl || 'document.jpg'}</p>
            </div>
            {/* Simulated document body */}
            <div className="p-8 flex flex-col items-center justify-center min-h-64 gap-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mb-2">
                <FileText className="w-10 h-10 text-primary opacity-60" />
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-lg mb-1">{doc.type}</p>
                <p className="text-body-dark text-sm">Submitted by {doc.user?.firstName} {doc.user?.lastName}</p>
                <p className="text-body-dark text-xs mt-1">{new Date(doc.createdAt).toLocaleString('en-GB')}</p>
              </div>
              <div className="bg-dark rounded-lg px-4 py-3 w-full text-center mt-2 border border-white/5">
                <p className="text-body-dark text-xs font-mono break-all">{doc.fileUrl || 'No file stored'}</p>
              </div>
              <p className="text-body-dark text-xs text-center mt-2 italic opacity-60">
                ⚠️ In production, the actual document file would be rendered here via secure cloud storage (e.g. AWS S3 pre-signed URL).
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-5 py-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs text-body-dark">
            <span>Submitted: <span className="text-white">{new Date(doc.createdAt).toLocaleDateString('en-GB')}</span></span>
            {doc.reviewedAt && <span>Reviewed: <span className="text-white">{new Date(doc.reviewedAt).toLocaleDateString('en-GB')}</span></span>}
            {doc.notes && <span className="italic">Note: {doc.notes}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminKYC() {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [rejectNotes, setRejectNotes] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    adminApi.kyc().then(setDocs).catch(console.error).finally(() => setIsLoading(false));
  }, []);

  const review = async (id, status, notes) => {
    setActionId(id);
    try {
      const updated = await adminApi.reviewKyc(id, status, notes);
      setDocs(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
      setRejectingId(null);
      setRejectNotes('');
    } catch (err) {
      alert(err.message);
    } finally {
      setActionId('');
    }
  };

  const filtered = filter === 'ALL' ? docs : docs.filter(d => d.status === filter);
  const counts = {
    ALL: docs.length,
    PENDING: docs.filter(d => d.status === 'PENDING').length,
    APPROVED: docs.filter(d => d.status === 'APPROVED').length,
    REJECTED: docs.filter(d => d.status === 'REJECTED').length,
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">KYC Review Queue</h1>
        <p className="text-body-dark text-sm mt-1">Review submitted identity documents and update verification status.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors border ${
              filter === f
                ? f === 'PENDING' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30'
                  : f === 'APPROVED' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30'
                  : f === 'REJECTED' ? 'bg-red-400/10 text-red-400 border-red-400/30'
                  : 'bg-primary/10 text-primary border-primary/30'
                : 'bg-dark-secondary text-body-dark border-white/5 hover:text-white'
            }`}
          >
            {f} <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">{counts[f]}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-dark-secondary border border-white/5 rounded-xl p-12 text-center">
          <FileText className="w-10 h-10 text-body-dark mx-auto mb-3 opacity-30" />
          <p className="text-body-dark">No KYC submissions{filter !== 'ALL' ? ` with status ${filter}` : ''} yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-dark-secondary border border-white/5 rounded-xl overflow-hidden">
              <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  {/* User Info */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                      {doc.user?.firstName?.[0]}{doc.user?.lastName?.[0]}
                    </div>
                    <span className="text-white font-bold">{doc.user?.firstName} {doc.user?.lastName}</span>
                    <span className="text-body-dark text-xs">{doc.user?.email}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLORS[doc.status] || ''}`}>{doc.status}</span>
                  </div>

                  {/* Document Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-body-dark mb-3">
                    <span>Type: <span className="text-white font-medium">{doc.type}</span></span>
                    <span>Submitted: <span className="text-white">{new Date(doc.createdAt).toLocaleDateString('en-GB')}</span></span>
                    {doc.reviewedAt && <span>Reviewed: <span className="text-white">{new Date(doc.reviewedAt).toLocaleDateString('en-GB')}</span></span>}
                  </div>

                  {/* File Preview Row */}
                  <div className="flex items-center gap-3 bg-dark rounded-lg px-4 py-3 border border-white/5">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-body-dark text-xs font-mono flex-1 truncate">{doc.fileUrl || 'No file recorded'}</span>
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Document
                    </button>
                  </div>

                  {doc.notes && <p className="text-body-dark text-xs mt-2 italic">Admin Note: {doc.notes}</p>}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 flex-shrink-0 min-w-[120px]">
                  {actionId === doc.id ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" />
                  ) : doc.status === 'PENDING' ? (
                    <>
                      <button onClick={() => review(doc.id, 'APPROVED')}
                        className="flex items-center justify-center gap-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors border border-emerald-500/20 hover:border-emerald-500">
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button onClick={() => setRejectingId(doc.id)}
                        className="flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors border border-red-500/20 hover:border-red-500">
                        <X className="w-3.5 h-3.5" /> Reject
                      </button>
                    </>
                  ) : (
                    <button onClick={() => review(doc.id, 'PENDING')}
                      className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-body-dark hover:text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors border border-white/5">
                      Reset to Pending
                    </button>
                  )}
                </div>
              </div>

              {/* Rejection Notes Inline Form */}
              {rejectingId === doc.id && (
                <div className="border-t border-white/5 bg-red-500/5 px-5 py-4">
                  <p className="text-red-400 text-xs font-bold mb-2">Add a rejection reason (optional):</p>
                  <textarea
                    value={rejectNotes}
                    onChange={e => setRejectNotes(e.target.value)}
                    placeholder="e.g. Document is blurry, please resubmit a clearer photo..."
                    rows={2}
                    className="w-full bg-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-red-500/50 mb-3"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => review(doc.id, 'REJECTED', rejectNotes)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      Confirm Rejection
                    </button>
                    <button onClick={() => { setRejectingId(null); setRejectNotes(''); }}
                      className="bg-white/5 hover:bg-white/10 text-body-dark text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && <DocumentModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />}
    </div>
  );
}
