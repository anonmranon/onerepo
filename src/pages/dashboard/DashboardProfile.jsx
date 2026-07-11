import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersApi } from '../../services/api';
import { Loader2, Check } from 'lucide-react';

export default function DashboardProfile() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    country: user?.country || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await usersApi.updateMe(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-body-dark text-sm mt-1">Update your personal information.</p>
      </div>

      <div className="max-w-2xl bg-dark-secondary border border-white/5 rounded-xl p-8">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-white font-bold">{user?.firstName} {user?.lastName}</p>
            <p className="text-body-dark text-sm">{user?.email}</p>
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded mt-1 inline-block">{user?.role}</span>
          </div>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'First Name', name: 'firstName' }, { label: 'Last Name', name: 'lastName' }].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={`profile-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                <input id={`profile-${name}`} type="text" name={name} value={formData[name]} onChange={handleChange}
                  className="w-full bg-dark border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-body-dark mb-1">Email Address</label>
            <input type="email" value={user?.email || ''} disabled
              className="w-full bg-dark/50 border border-white/5 rounded px-4 py-3 text-body-dark text-sm cursor-not-allowed" />
            <p className="text-body-dark text-[10px] mt-1">Email cannot be changed.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[{ label: 'Phone Number', name: 'phone' }, { label: 'Country', name: 'country' }].map(({ label, name }) => (
              <div key={name}>
                <label htmlFor={`profile-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                <input id={`profile-${name}`} type="text" name={name} value={formData[name]} onChange={handleChange}
                  className="w-full bg-dark border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
              </div>
            ))}
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-bold py-3 rounded transition-colors mt-2">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {saved ? <><Check className="w-4 h-4" /> Saved!</> : (isLoading ? 'Saving...' : 'Save Changes')}
          </button>
        </form>
      </div>
    </div>
  );
}
