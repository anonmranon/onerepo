import { useState } from 'react';
import { Mail, Phone, MapPin, Check, Loader2 } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import { contactApi } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
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
    if (!formData.subject) newErrors.subject = 'Required';
    if (!formData.message) newErrors.message = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      await contactApi.send(formData);
      setIsSuccess(true);
    } catch (err) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">COMPANY — CONTACT US</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">We're Here to Help</h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you have a question about our platforms, need help with your account, or want to explore partnership opportunities, our global support team is available 24/5.
          </p>
        </div>
      </section>

      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="bg-dark-card rounded-xl p-8 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Email Support</h3>
            <p className="text-body-dark text-sm mb-4">For general inquiries and account support.</p>
            <a href="mailto:support@liquidbroker.example.com" className="text-primary font-bold hover:underline">support@liquidbroker.example.com</a>
          </div>
          <div className="bg-dark-card rounded-xl p-8 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Phone Support</h3>
            <p className="text-body-dark text-sm mb-4">Available 24 hours a day, 5 days a week.</p>
            <a href="tel:+442012345678" className="text-primary font-bold hover:underline">+44 20 1234 5678</a>
          </div>
          <div className="bg-dark-card rounded-xl p-8 border border-white/5 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Global Headquarters</h3>
            <p className="text-body-dark text-sm mb-4">123 Financial District,<br />London, EC2N 4AY, UK</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto bg-dark-card rounded-xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Send us a Message</h2>
          
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Message Sent</h3>
              <p className="text-body-dark">Thank you for contacting us. We will get back to you shortly.</p>
              <button onClick={() => setIsSuccess(false)} className="mt-6 text-primary hover:underline font-semibold text-sm">Send another message</button>
            </div>
          ) : (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-semibold text-body-dark mb-1">Full Name</label>
                  <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleInputChange} className={`w-full bg-dark-secondary border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                  {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-body-dark mb-1">Email Address</label>
                  <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleInputChange} className={`w-full bg-dark-secondary border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                  {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-semibold text-body-dark mb-1">Subject</label>
                <input id="contact-subject" type="text" name="subject" value={formData.subject} onChange={handleInputChange} className={`w-full bg-dark-secondary border ${errors.subject ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                {errors.subject && <p className="text-red-500 text-[10px] mt-1">{errors.subject}</p>}
              </div>
              
              <div>
                <label htmlFor="contact-message" className="block text-xs font-semibold text-body-dark mb-1">Message</label>
                <textarea id="contact-message" name="message" value={formData.message} onChange={handleInputChange} rows={5} className={`w-full bg-dark-secondary border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors`} />
                {errors.message && <p className="text-red-500 text-[10px] mt-1">{errors.message}</p>}
              </div>

              <button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary-dark disabled:opacity-70 text-white font-bold py-3 md:py-4 rounded-full transition-colors mt-2 flex justify-center items-center gap-2">
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          )}
        </div>
      </section>
      <StatsBar />
    </>
  );
}
