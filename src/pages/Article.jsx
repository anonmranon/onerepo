import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import { ALL_POSTS } from '../data/articles';

export default function Article() {
  const { slug } = useParams();
  
  // Find article
  const article = ALL_POSTS.find(p => p.slug === slug);

  if (!article) {
    return <Navigate to="/company/news" replace />;
  }

  return (
    <>
      <section className="bg-dark pt-28 pb-12 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <Link to="/company/news" className="inline-flex items-center gap-2 text-primary hover:text-white text-sm font-semibold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to News
          </Link>
          
          <div className="flex items-center gap-4 text-xs font-semibold text-body-dark mb-4">
            <span className="text-primary tracking-widest uppercase">{article.category}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 5 min read</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {article.author.charAt(0)}
            </div>
            <div>
              <p className="text-white text-sm font-semibold">{article.author}</p>
              <p className="text-body-dark text-xs">{article.date}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-dark min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto prose prose-invert prose-p:text-body-dark prose-headings:text-white prose-a:text-primary hover:prose-a:text-primary-dark max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}>
        </div>
      </section>
      
      <StatsBar />
    </>
  );
}
