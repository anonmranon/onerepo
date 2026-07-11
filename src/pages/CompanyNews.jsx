import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import StatsBar from '../components/StatsBar';
import { useState } from 'react';
import { ALL_POSTS } from '../data/articles';

const CATEGORIES = ['ALL', 'NEWS', 'ANALYSIS', 'EDUCATION'];

export default function CompanyNews() {
  const [active, setActive] = useState('ALL');
  const filtered = active === 'ALL' ? ALL_POSTS : ALL_POSTS.filter(p => p.category === active);

  return (
    <>
      <section className="bg-dark pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-primary text-xs font-bold tracking-widest mb-4">COMPANY — NEWS & INSIGHTS</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Market Intelligence</h1>
          <p className="text-body-dark text-lg max-w-2xl leading-relaxed">
            Daily research, breaking news, and educational content from our team of expert analysts
            and industry commentators — everything you need to stay informed and trade with conviction.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-xs font-bold tracking-widest rounded transition-colors ${
                  active === cat
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map(post => (
                <BlogCard key={post.slug} {...post} to={`/article/${post.slug}`} />
              ))}
            </div>
        </div>
      </section>
      <StatsBar />
    </>
  );
}
