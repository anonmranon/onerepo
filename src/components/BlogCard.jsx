import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CAT_STYLES = {
  NEWS:      { bg: 'bg-primary/10',    text: 'text-primary',   label: 'News'     },
  ANALYSIS:  { bg: 'bg-blue-500/10',   text: 'text-blue-500',  label: 'Analysis' },
  EDUCATION: { bg: 'bg-emerald-500/10',text: 'text-emerald-600',label: 'Education'},
};

export default function BlogCard({ category, title, author, date, excerpt, to = '/article/market-update' }) {
  const style = CAT_STYLES[category] || CAT_STYLES.NEWS;

  return (
    <article className="flex flex-col gap-4 border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-gray-200 transition-all duration-300 group bg-white">
      {/* Horizontal pill badge */}
      <span
        className={`inline-flex items-center self-start px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.05em] uppercase ${style.bg} ${style.text}`}
      >
        {style.label}
      </span>

      {/* Title */}
      <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {title}
      </h3>

      {/* Meta */}
      <p className="text-xs text-gray-400">
        By {author} &bull; {date}
      </p>

      {/* Excerpt — native line-clamp keeps complete words */}
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{excerpt}</p>

      <Link
        to={to}
        className="text-xs font-bold tracking-[0.05em] text-gray-700 hover:text-primary transition-colors flex items-center gap-1 mt-auto"
      >
        READ MORE <ArrowRight className="w-3 h-3" />
      </Link>
    </article>
  );
}
