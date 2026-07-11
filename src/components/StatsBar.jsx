import { Clock, Trophy, Headphones } from 'lucide-react';

const STATS = [
  { icon: Clock,      label: '25 Years of Excellence' },
  { icon: Trophy,     label: '15+ Global Awards'       },
  { icon: Headphones, label: '24/5 Customer Support'   },
];

export default function StatsBar() {
  return (
    <div className="bg-[#111113] border-t border-white/8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
          {STATS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-4 py-6 px-6">
              {/* Increased contrast: slightly lighter fill + brighter border */}
              <div className="w-10 h-10 rounded-lg bg-white/8 border border-white/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white/90" />
              </div>
              <span className="text-white font-semibold text-sm tracking-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
