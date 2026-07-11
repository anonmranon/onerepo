import { useState } from 'react';
import { Shield, Upload, CheckCircle, Clock, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../services/api';

export default function DashboardKYC() {
  const { user } = useAuth();
  const [uploadingType, setUploadingType] = useState(null);
  
  const kycDocs = user?.kycDocuments || [];
  
  const hasUploaded = kycDocs.length > 0;
  const isVerified = hasUploaded && kycDocs.every(d => d.status === 'APPROVED');
  const isRejected = hasUploaded && kycDocs.some(d => d.status === 'REJECTED');
  
  const STEPS = [
    { label: 'Account Created', done: true },
    { label: 'Document Upload', done: hasUploaded },
    { label: 'Under Review', done: hasUploaded && !isRejected },
    { label: 'Verified', done: isVerified },
  ];

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingType(type);
    try {
      // Simulate slight delay for "uploading" effect
      await new Promise(r => setTimeout(r, 1000));
      await usersApi.uploadKyc({
        type: type,
        fileUrl: file.name
      });
      // Reload page to fetch updated user data
      window.location.reload();
    } catch (err) {
      alert(err.message || 'Upload failed');
      setUploadingType(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Identity Verification (KYC)</h1>
        <p className="text-body-dark text-sm mt-1">Complete verification to access live trading accounts and withdrawals.</p>
      </div>

      {/* Status Timeline */}
      <div className="bg-dark-secondary border border-white/5 rounded-xl p-4 sm:p-6 mb-6">
        <h2 className="text-white font-bold mb-6">Verification Progress</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 relative">
          {STEPS.map((step, i) => (
            <div key={step.label} className="flex flex-col sm:flex-row items-start sm:items-center flex-1 sm:last:flex-none">
              <div className="flex flex-row sm:flex-col items-center gap-3 sm:gap-0 z-10 relative bg-dark-secondary">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-colors ${
                  step.done ? 'bg-primary border-primary text-white' : 
                  (isRejected && i === 2) ? 'bg-red-500 border-red-500 text-white' :
                  'border-white/20 bg-dark text-body-dark'
                }`}>
                  {step.done ? <CheckCircle className="w-4 h-4" /> : 
                   (isRejected && i === 2) ? <XCircle className="w-4 h-4" /> : 
                   <span className="text-xs">{i + 1}</span>}
                </div>
                <p className={`text-sm sm:text-xs sm:mt-2 text-left sm:text-center w-auto sm:w-24 ${step.done ? 'text-white font-semibold' : 'text-body-dark'}`}>{step.label}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`hidden sm:block absolute top-4 left-0 w-full h-px -z-0 ${STEPS[i+1].done ? 'bg-primary' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { type: 'Government ID', title: 'Government Issued ID', desc: 'Passport, National ID, or Driver\'s License', accept: '.jpg,.jpeg,.png,.pdf' },
          { type: 'Proof of Address', title: 'Proof of Address', desc: 'Bank statement or utility bill (less than 3 months old)', accept: '.jpg,.jpeg,.png,.pdf' },
        ].map(({ type, title, desc, accept }) => {
          
          const existingDoc = kycDocs.find(d => d.type.includes(type.split(' ')[0]));
          const isUploading = uploadingType === type;
          
          return (
            <div key={title} className="bg-dark-secondary border border-white/5 rounded-xl p-6 relative">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold text-sm">{title}</h3>
              </div>
              <p className="text-body-dark text-xs mb-4">{desc}</p>
              
              {!existingDoc || existingDoc.status === 'REJECTED' ? (
                <label className={`block border-2 border-dashed border-white/10 hover:border-primary/40 rounded-lg p-6 text-center transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  {isUploading ? (
                    <div className="flex flex-col items-center justify-center py-2">
                      <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                      <p className="text-primary text-xs font-bold">Uploading...</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-body-dark mx-auto mb-2" />
                      <p className="text-body-dark text-xs">Click to upload or drag & drop</p>
                      <p className="text-body-dark text-[10px] mt-1">JPG, PNG, PDF — Max 5MB</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={accept} 
                    disabled={isUploading}
                    onChange={(e) => handleUpload(e, type)}
                  />
                </label>
              ) : (
                <div className="border border-white/10 bg-dark rounded-lg p-6 text-center flex flex-col items-center justify-center">
                  <Shield className="w-8 h-8 text-body-dark mb-2 opacity-50" />
                  <p className="text-white text-sm font-semibold">Document Submitted</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-body-dark font-semibold uppercase tracking-wider">Status:</span>
                {!existingDoc ? (
                  <span className="text-body-dark text-xs font-bold">Pending Upload</span>
                ) : existingDoc.status === 'PENDING' ? (
                  <span className="text-yellow-400 text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> Under Review</span>
                ) : existingDoc.status === 'APPROVED' ? (
                  <span className="text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>
                ) : (
                  <span className="text-red-400 text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected - Please reupload</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
