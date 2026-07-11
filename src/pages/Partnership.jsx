import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import { contactApi } from '../services/api';

const PROGRAMS = [
  {
    title: 'Introducing Broker',
    icon: '🤝',
    description: 'Refer clients to Liquid and earn competitive rebates on every trade they place — for the lifetime of the relationship.',
    commission: 'Up to $15 per lot',
    features: ['Volume-based rebate tiers', 'Real-time reporting dashboard', 'Dedicated IB support manager', 'Co-branded marketing materials', 'Sub-IB network management'],
  },
  {
    title: 'White Label',
    icon: '🏷️',
    description: 'Launch your own branded brokerage powered by Liquid\'s technology, liquidity, and regulatory infrastructure in as little as 4 weeks.',
    commission: 'Custom revenue share',
    features: ['Full platform white-labelling', 'Access to 300+ instruments', 'Segregated client accounts', 'Liquidity bridge integration', 'Regulatory support & compliance'],
  },
  {
    title: 'Affiliate Program',
    icon: '📢',
    description: 'Promote Liquid through your website, social channels, or content — and earn CPA or revenue share for every qualified client you send.',
    commission: 'Up to $600 CPA',
    features: ['Competitive CPA & RevShare models', 'Real-time tracking & analytics', 'Multilingual marketing assets', 'Fast monthly payouts', 'Dedicated affiliate manager'],
  },
];

export default function Partnership() {
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', phone: '', type: 'Introducing Broker'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.company) newErrors.company = 'Required';
    if (!formData.phone) newErrors.phone = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await contactApi.partner(formData);
      setIsSuccess(true);
    } catch (err) {
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">COMPANY — PARTNER WITH US</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Grow Together with Liquid</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Join over 2,000 active partners across 60 countries who are building successful businesses
            on Liquid's award-winning broker infrastructure, deep liquidity, and industry-leading
            commission structure.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PROGRAMS.map((p) => (
            <div key={p.title} className="bg-dark-card rounded-xl p-8 border border-white/5 hover:border-primary transition-all duration-300 flex flex-col">
              <div className="text-4xl mb-5">{p.icon}</div>
              <h2 className="text-white font-bold text-2xl mb-3">{p.title}</h2>
              <p className="text-body-dark text-sm leading-relaxed mb-5">{p.description}</p>
              <div className="bg-primary/10 border border-primary/20 rounded-lg px-4 py-3 mb-6 inline-block">
                <p className="text-primary font-bold text-sm">Commission: {p.commission}</p>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {p.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-body-dark">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/create-account"
                className="block text-center bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded transition-colors"
              >
                APPLY NOW
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Apply section */}
      <section className="bg-dark py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Partner with Liquid?</h2>
          <p className="text-body-dark mb-8">Complete your application in minutes. Our partnership team will be in touch within one business day.</p>
          
          {isSuccess ? (
            <div className="bg-dark-secondary rounded-xl border border-primary/20 p-8 flex flex-col items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Application Received</h3>
              <p className="text-body-dark text-sm">Thank you for your interest in partnering with Liquid. A member of our team will contact you shortly.</p>
            </div>
          ) : (
            <form className="flex flex-col gap-4 text-left" onSubmit={handleSubmit}>
              {[{ label: 'Full Name', name: 'name' }, { label: 'Company / Website', name: 'company' }].map(({ label, name }) => (
                <div key={name}>
                  <label htmlFor={`partner-${name}`} className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                  <input id={`partner-${name}`} type="text" name={name} value={formData[name]} onChange={handleInputChange} placeholder={label} className={`w-full bg-dark-secondary border ${errors[name] ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                  {errors[name] && <p className="text-red-500 text-[10px] mt-1">{errors[name]}</p>}
                </div>
              ))}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="partner-email" className="block text-xs font-semibold text-body-dark mb-1">Email Address</label>
                  <input id="partner-email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className={`w-full bg-dark-secondary border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="partner-phone" className="block text-xs font-semibold text-body-dark mb-1">Phone Number</label>
                  <input id="partner-phone" type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className={`w-full bg-dark-secondary border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                  {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="partner-type" className="block text-xs font-semibold text-body-dark mb-1">Partnership Type</label>
                <select id="partner-type" name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-dark-secondary border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                  <option>Introducing Broker</option>
                  <option>White Label</option>
                  <option>Affiliate</option>
                </select>
              </div>
              <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark disabled:opacity-70 disabled:hover:bg-primary text-white font-bold py-3 md:py-4 rounded-full transition-colors mt-2 flex justify-center items-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          )}
        </div>
      </section>
      <StatsBar />
    </>
  );
}
