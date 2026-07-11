import { Link } from 'react-router-dom';
import { ArrowRight, Layers, BarChart3, Sliders, Award, ShieldCheck, TrendingUp, Headphones } from 'lucide-react';

const FEATURE_ICONS = {
  assets: Layers,
  market: BarChart3,
  tools: Sliders,
};

// ─── Dark Feature Card (Save time / features section) ─────────────────────────
export function DarkFeatureCard({ title, description, keyName }) {
  const Icon = FEATURE_ICONS[keyName] || Layers;

  return (
    <div className="group bg-[#141416] rounded-xl p-8 border border-white/5 shadow-md hover:shadow-[0_12px_45px_rgba(240,78,35,0.06)] hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start">
      {/* Icon Container with glowing orange tint */}
      <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-[inset_0_0_12px_rgba(240,78,35,0.15)] transition-transform duration-300 group-hover:scale-105">
        <Icon className="w-7 h-7" strokeWidth={1.75} />
      </div>

      {/* Text content */}
      <h3 className="text-white font-bold text-lg mb-3 group-hover:text-primary transition-colors duration-300 tracking-tight">
        {title}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Why Choose Us Icon Badges ───────────────────────────────────────────────

const WHY_ICONS = {
  service: Award,
  trusted: ShieldCheck,
  strength: TrendingUp,
  support: Headphones,
};

// ─── Why Card ────────────────────────────────────────────────────────────────
export function WhyCard({ keyName, title, description, to }) {
  const Icon = WHY_ICONS[keyName] || ShieldCheck;
  return (
    <div className="bg-white border border-gray-200/80 rounded-2xl p-8 hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:border-gray-300 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6 shadow-[inset_0_0_12px_rgba(240,78,35,0.06)]">
          <Icon className="w-6 h-6" strokeWidth={1.75} />
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-3 tracking-tight group-hover:text-primary transition-colors duration-200">
          {title}
        </h3>
        <p className="text-body-light text-sm leading-relaxed mb-6">{description}</p>
      </div>
      <Link
        to={to}
        className="inline-flex items-center gap-1.5 text-primary text-xs font-bold tracking-widest hover:gap-2 transition-all mt-auto"
      >
        FIND OUT MORE <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
