import { Link } from 'react-router-dom';
import { Shield, Globe, Award, Users } from 'lucide-react';
import StatsBar from '../components/StatsBar';

const TEAM = [
  { name: 'James Hartwell', role: 'Chief Executive Officer', bio: 'With over 20 years in financial services across London, New York, and Singapore, James leads Liquid\'s global strategy with a focus on regulated, client-first trading.' },
  { name: 'Sarah Chen', role: 'Chief Financial Officer', bio: 'A former investment banker with Goldman Sachs, Sarah oversees Liquid\'s financial operations, risk management framework, and capital strategy across all jurisdictions.' },
  { name: 'Marco Delgado', role: 'Chief Technology Officer', bio: 'Marco architects Liquid\'s trading infrastructure — from ultra-low-latency execution engines to the mobile apps trusted by hundreds of thousands of traders worldwide.' },
  { name: 'Aisha Patel', role: 'Head of Compliance', bio: 'A regulatory expert with a decade of experience across FCA, ASIC, and CySEC frameworks, Aisha ensures Liquid operates at the highest standards of client protection.' },
];

const OFFICES = [
  { city: 'London', country: 'United Kingdom', address: '1 Canary Wharf, London, E14 5AB', flag: '🇬🇧' },
  { city: 'Singapore', country: 'Singapore', address: '8 Marina Boulevard, Singapore 018981', flag: '🇸🇬' },
  { city: 'Dubai', country: 'United Arab Emirates', address: 'DIFC Gate Village, Dubai, UAE', flag: '🇦🇪' },
  { city: 'Sydney', country: 'Australia', address: '1 Martin Place, Sydney NSW 2000', flag: '🇦🇺' },
];

export default function Company() {
  return (
    <>
      {/* Hero */}
      <section className="bg-dark pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">ABOUT US</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">
            25 Years of Trading Excellence
          </h1>
          <p className="text-body-dark text-lg max-w-2xl mx-auto leading-relaxed">
            Founded in 1999, Liquid has grown from a boutique currency specialist into one of the
            world's most trusted multi-asset brokers — serving over 500,000 active traders across
            more than 80 countries.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-body-dark leading-relaxed mb-4">
              We believe that access to world-class financial markets should not be the exclusive
              privilege of banks and hedge funds. Our mission is to democratise trading — giving
              every individual the tools, education, and infrastructure to participate in global
              markets on an equal footing.
            </p>
            <p className="text-body-dark leading-relaxed">
              From our raw ECN spreads and transparent pricing to our award-winning education centre
              and round-the-clock support, every decision we make is guided by a single question:
              does this make our clients more successful?
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { Icon: Shield, label: 'Regulated Globally', sub: 'FCA, ASIC, CySEC, FSCA' },
              { Icon: Globe, label: '80+ Countries', sub: '500,000+ active traders' },
              { Icon: Award, label: '15+ Industry Awards', sub: 'Since 2010' },
              { Icon: Users, label: '24/5 Expert Support', sub: '12 languages' },
            ].map(({ Icon, label, sub }) => (
              <div key={label} className="bg-dark-card rounded-xl p-5 border border-white/5">
                <Icon className="w-7 h-7 text-primary mb-3" />
                <p className="text-white font-bold text-sm mb-1">{label}</p>
                <p className="text-body-dark text-xs">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-dark py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Leadership Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-dark-card rounded-xl p-6 border border-white/5 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-xl">{member.name[0]}</span>
                </div>
                <h3 className="text-white font-bold mb-1">{member.name}</h3>
                <p className="text-primary text-xs font-semibold mb-3">{member.role}</p>
                <p className="text-body-dark text-xs leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Offices */}
      <section className="bg-dark-secondary py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Global Offices</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICES.map((office) => (
              <div key={office.city} className="bg-dark-card rounded-xl p-6 border border-white/5">
                <div className="text-4xl mb-3">{office.flag}</div>
                <h3 className="text-white font-bold text-lg">{office.city}</h3>
                <p className="text-primary text-xs font-semibold mb-2">{office.country}</p>
                <p className="text-body-dark text-xs leading-relaxed">{office.address}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatsBar />
    </>
  );
}
