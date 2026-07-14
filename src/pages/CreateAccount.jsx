import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight, Upload, File as FileIcon, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

import headerLogo from '../assets/header-logo.svg';

const STEPS_CONFIG = ['Personal Details', 'Trading Experience', 'Verification'];

export default function CreateAccount() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', country: '', dob: '', password: '', confirmPassword: '',
    experience: '', accountType: '', income: '', sourceOfFunds: '',
    instruments: [],
    agreedToTerms: false
  });
  
  const [files, setFiles] = useState({ id: null, proofOfAddress: null });
  const [errors, setErrors] = useState({});
  const idInputRef = useRef(null);
  const poaInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleInstrumentChange = (inst) => {
    setFormData(prev => {
      const isSelected = prev.instruments.includes(inst);
      return {
        ...prev,
        instruments: isSelected 
          ? prev.instruments.filter(i => i !== inst)
          : [...prev.instruments, inst]
      };
    });
  };

  const handleFileChange = (e, type) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
      setErrors(prev => ({ ...prev, [type]: null }));
    }
  };
  
  const removeFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    if (type === 'id' && idInputRef.current) idInputRef.current.value = '';
    if (type === 'proofOfAddress' && poaInputRef.current) poaInputRef.current.value = '';
  }

  const validateStep0 = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'Required';
    if (!formData.lastName) newErrors.lastName = 'Required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.phone) newErrors.phone = 'Required';
    if (!formData.country) newErrors.country = 'Required';
    if (!formData.dob) newErrors.dob = 'Required';
    if (!formData.password || formData.password.length < 8) newErrors.password = 'Min 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.experience) newErrors.experience = 'Required';
    if (!formData.accountType) newErrors.accountType = 'Required';
    if (!formData.income) newErrors.income = 'Required';
    if (!formData.sourceOfFunds) newErrors.sourceOfFunds = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!files.id) newErrors.id = 'ID Document is required';
    if (!files.proofOfAddress) newErrors.proofOfAddress = 'Proof of Address is required';
    if (!formData.agreedToTerms) newErrors.agreedToTerms = 'You must agree to the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const next = (e) => { 
    e.preventDefault(); 
    
    let isValid = false;
    if (step === 0) isValid = validateStep0();
    else if (step === 1) isValid = validateStep1();
    else if (step === 2) isValid = validateStep2();

    if (isValid) {
      if (step < 2) {
        setStep(s => s + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        submitApplication();
      }
    }
  };
  
  const submitApplication = async () => {
    setIsLoading(true);
    setApiError('');
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        country: formData.country,
        dob: formData.dob,
        submitKyc: !!(files.id && files.proofOfAddress)
      });
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setApiError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Account Created!</h1>
          <p className="text-body-dark mb-8">Your account application has been submitted. You'll receive a confirmation email within minutes. Our team will verify your documents within 24 hours.</p>
          <Link to="/dashboard" className="bg-primary hover:bg-primary-dark text-white font-bold px-8 py-4 rounded transition-colors inline-block">
            GO TO DASHBOARD
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-dark min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
            <Link to="/">
              <img src={headerLogo} alt="LIQUID" className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {STEPS_CONFIG.map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-2 ${i <= step ? 'text-white' : 'text-body-dark'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all ${
                    i < step ? 'bg-primary border-primary text-white' :
                    i === step ? 'border-primary text-primary' :
                    'border-white/20 text-body-dark'
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="text-xs hidden sm:block">{label}</span>
                </div>
                {i < 2 && <ChevronRight className="w-4 h-4 text-white/20 mx-1" />}
              </div>
            ))}
          </div>

          <div className="bg-dark-secondary rounded-2xl border border-white/10 p-8">
            <h1 className="text-2xl font-bold text-white mb-2">{STEPS_CONFIG[step]}</h1>
            <p className="text-body-dark text-sm mb-8">Step {step + 1} of 3 — {['Fill in your personal information below.', 'Tell us about your trading background.', 'Verify your identity to activate your account.'][step]}</p>

            {apiError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded p-3 text-red-400 text-xs mb-4">
                {apiError}
              </div>
            )}

            <form onSubmit={next} className="flex flex-col gap-4">
              {step === 0 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: 'First Name', name: 'firstName' }, { label: 'Last Name', name: 'lastName' }].map(({ label, name }) => (
                      <div key={name}>
                        <label htmlFor={`create-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                        <input id={`create-${name}`} type="text" name={name} value={formData[name]} onChange={handleInputChange} placeholder={label} className={`w-full bg-dark border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                        {errors[name] && <p className="text-red-500 text-[10px] mt-1">{errors[name]}</p>}
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="create-email" className="block text-xs font-semibold text-body-dark mb-1">Email Address</label>
                    <input id="create-email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className={`w-full bg-dark border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                    {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {[{ label: 'Phone Number', name: 'phone' }, { label: 'Country of Residence', name: 'country' }].map(({ label, name }) => (
                      <div key={name}>
                        <label htmlFor={`create-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                        <input id={`create-${name}`} type="text" name={name} value={formData[name]} onChange={handleInputChange} placeholder={label} className={`w-full bg-dark border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                        {errors[name] && <p className="text-red-500 text-[10px] mt-1">{errors[name]}</p>}
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="create-dob" className="block text-xs font-semibold text-body-dark mb-1">Date of Birth</label>
                    <input id="create-dob" type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={`w-full bg-dark border ${errors.dob ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                    {errors.dob && <p className="text-red-500 text-[10px] mt-1">{errors.dob}</p>}
                  </div>

                  {[{ label: 'Password', name: 'password' }, { label: 'Confirm Password', name: 'confirmPassword' }].map(({ label, name }) => (
                    <div key={name}>
                      <label htmlFor={`create-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                      <input id={`create-${name}`} type="password" name={name} value={formData[name]} onChange={handleInputChange} placeholder={label} className={`w-full bg-dark border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                      {errors[name] && <p className="text-red-500 text-[10px] mt-1">{errors[name]}</p>}
                    </div>
                  ))}
                </>
              )}

              {step === 1 && (
                <>
                  {[
                    { label: 'Trading Experience', name: 'experience', options: ['No experience', 'Less than 1 year', '1–3 years', '3–5 years', '5+ years'] },
                    { label: 'Preferred Account Type', name: 'accountType', options: ['Demo', 'Standard', 'Gold', 'ECN'] },
                    { label: 'Estimated Annual Income', name: 'income', options: ['Under $20,000', '$20,000–$50,000', '$50,000–$100,000', 'Over $100,000'] },
                    { label: 'Source of Funds', name: 'sourceOfFunds', options: ['Employment income', 'Business profits', 'Savings', 'Investments', 'Inheritance'] },
                  ].map(({ label, name, options }) => (
                    <div key={name}>
                      <label htmlFor={`create-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                      <select id={`create-${name}`} name={name} value={formData[name]} onChange={handleInputChange} className={`w-full bg-dark border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`}>
                        <option value="">Select...</option>
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      {errors[name] && <p className="text-red-500 text-[10px] mt-1">{errors[name]}</p>}
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-body-dark mb-2">Preferred Trading Instruments</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Crypto', 'Forex', 'Real Estate', 'Gold'].map(inst => (
                        <label key={inst} htmlFor={`inst-${inst}`} className="flex items-center gap-2 text-sm text-body-dark cursor-pointer">
                          <input id={`inst-${inst}`} type="checkbox" className="accent-primary" checked={formData.instruments.includes(inst)} onChange={() => handleInstrumentChange(inst)} />
                          {inst}
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <p className="text-body-dark text-sm leading-relaxed mb-2">
                    To comply with regulatory requirements and protect your account, we need to verify your identity. Please upload the following documents:
                  </p>
                  
                  {/* ID Upload */}
                  <div 
                    onClick={() => !files.id && idInputRef.current.click()}
                    className={`border-2 border-dashed ${errors.id ? 'border-red-500' : 'border-white/10'} rounded-xl p-6 text-center hover:border-primary transition-colors ${!files.id ? 'cursor-pointer' : ''} relative`}
                  >
                    <input type="file" ref={idInputRef} onChange={(e) => handleFileChange(e, 'id')} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                    {files.id ? (
                      <div className="flex items-center justify-between bg-dark p-3 rounded border border-white/10">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileIcon className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-white truncate">{files.id.name}</span>
                        </div>
                        <button type="button" onClick={() => removeFile('id')} className="text-body-dark hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">🪪</div>
                        <p className="text-white text-sm font-semibold mb-1">Government-issued Photo ID</p>
                        <p className="text-body-dark text-xs">Click to upload (Passport or National ID)</p>
                      </>
                    )}
                  </div>
                  {errors.id && <p className="text-red-500 text-[10px]">{errors.id}</p>}
                  
                  {/* POA Upload */}
                  <div 
                    onClick={() => !files.proofOfAddress && poaInputRef.current.click()}
                    className={`border-2 border-dashed ${errors.proofOfAddress ? 'border-red-500' : 'border-white/10'} rounded-xl p-6 text-center hover:border-primary transition-colors ${!files.proofOfAddress ? 'cursor-pointer' : ''} relative mt-2`}
                  >
                    <input type="file" ref={poaInputRef} onChange={(e) => handleFileChange(e, 'proofOfAddress')} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                    {files.proofOfAddress ? (
                      <div className="flex items-center justify-between bg-dark p-3 rounded border border-white/10">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileIcon className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-sm text-white truncate">{files.proofOfAddress.name}</span>
                        </div>
                        <button type="button" onClick={() => removeFile('proofOfAddress')} className="text-body-dark hover:text-white">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-3xl mb-2">📄</div>
                        <p className="text-white text-sm font-semibold mb-1">Proof of Address</p>
                        <p className="text-body-dark text-xs">Click to upload (Bank Statement or Utility Bill)</p>
                      </>
                    )}
                  </div>
                  {errors.proofOfAddress && <p className="text-red-500 text-[10px]">{errors.proofOfAddress}</p>}
                  
                  <div className="mt-4">
                    <label htmlFor="create-agreed" className="flex items-start gap-3 text-xs text-body-dark cursor-pointer">
                      <input id="create-agreed" type="checkbox" name="agreedToTerms" checked={formData.agreedToTerms} onChange={handleInputChange} className="accent-primary mt-0.5" />
                      <div>
                        I confirm that I have read and agree to the{' '}
                        <Link to="/terms" className="text-primary hover:underline">Terms & Conditions</Link>,{' '}
                        <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, and{' '}
                        <Link to="/risk-disclosure" className="text-primary hover:underline">Risk Disclosure</Link>.
                      </div>
                    </label>
                    {errors.agreedToTerms && <p className="text-red-500 text-[10px] mt-1 ml-6">{errors.agreedToTerms}</p>}
                  </div>
                </>
              )}

              <div className="flex gap-4 mt-6">
                {step > 0 && (
                  <button type="button" onClick={() => setStep(s => s - 1)} disabled={isLoading} className="border border-white/20 hover:border-white/40 text-white font-bold py-4 px-6 rounded transition-colors disabled:opacity-50">
                    BACK
                  </button>
                )}
                <button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:hover:bg-primary text-white font-bold py-2.5 text-sm md:py-4 md:text-base rounded-full transition-colors flex justify-center items-center gap-2">
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? 'PROCESSING...' : (step < 2 ? 'CONTINUE →' : 'SUBMIT APPLICATION')}
                </button>
              </div>
            </form>

            <p className="text-center text-body-dark text-xs mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
