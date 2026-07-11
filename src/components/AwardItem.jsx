import { Trophy, Medal, Star, Award } from 'lucide-react';

// Each award gets a distinct icon so the row feels varied, not templated
const AWARD_ICONS = [Trophy, Medal, Star, Award];

// Per-award accent colors so the row reads as a deliberate system
const ACCENT_COLORS = [
  { ring: 'border-amber-400/30',  bg: 'bg-amber-400/10',  icon: 'text-amber-400'  },
  { ring: 'border-primary/30',    bg: 'bg-primary/10',    icon: 'text-primary'    },
  { ring: 'border-blue-400/30',   bg: 'bg-blue-400/10',   icon: 'text-blue-400'   },
  { ring: 'border-emerald-400/30',bg: 'bg-emerald-400/10',icon: 'text-emerald-400'},
];

export default function AwardItem({ title, event, index = 0 }) {
  const Icon   = AWARD_ICONS[index % AWARD_ICONS.length];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div className="flex flex-col items-center gap-4 text-center group">
      {/* Icon container with distinct per-award accent */}
      <div
        className={`w-16 h-16 rounded-2xl border ${accent.ring} ${accent.bg} flex items-center justify-center transition-transform duration-300 group-hover:scale-105`}
      >
        <Icon className={`w-7 h-7 ${accent.icon}`} strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-bold text-gray-900 text-sm leading-snug">{title}</p>
        <p className="text-xs text-gray-500 mt-1 font-medium">{event}</p>
      </div>
    </div>
  );
}
