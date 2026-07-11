import { useState, useEffect } from 'react';
import { PlusCircle, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import { adminApi } from '../../services/api';

const CATEGORIES = ['NEWS', 'ANALYSIS', 'EDUCATION'];
const EMPTY_POST = { title: '', slug: '', category: 'NEWS', author: 'Liquid Analysis Team', excerpt: '', content: '', status: 'DRAFT' };

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null | 'new' | post object
  const [form, setForm] = useState(EMPTY_POST);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState('');

  const fetchPosts = () => {
    setIsLoading(true);
    adminApi.blog().then(setPosts).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(fetchPosts, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleEdit = post => { setEditing(post); setForm(post); };
  const handleNew = () => { setEditing('new'); setForm({ ...EMPTY_POST, slug: `post-${Date.now()}` }); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing === 'new') {
        await adminApi.createPost(form);
      } else {
        await adminApi.updatePost(editing.id, form);
      }
      setEditing(null);
      fetchPosts();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    try {
      await adminApi.deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting('');
    }
  };

  const STATUS_COLOR = { DRAFT: 'text-body-dark bg-white/5', PUBLISHED: 'text-emerald-400 bg-emerald-400/10', ARCHIVED: 'text-yellow-400 bg-yellow-400/10' };

  return (
    <div className="p-4 sm:p-8 w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog CMS</h1>
          <p className="text-body-dark text-sm mt-1">Create and manage news, analysis, and education posts.</p>
        </div>
        <button onClick={handleNew} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-sm font-bold py-2 px-4 rounded transition-colors">
          <PlusCircle className="w-4 h-4" /> New Post
        </button>
      </div>

      {/* Editor Modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-6 overflow-y-auto">
          <div className="bg-dark-secondary border border-white/10 rounded-xl w-full max-w-2xl p-6 mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold">{editing === 'new' ? 'New Post' : 'Edit Post'}</h2>
              <button onClick={() => setEditing(null)} className="text-body-dark hover:text-white transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-col gap-4">
              {[{ label: 'Title', name: 'title' }, { label: 'Slug', name: 'slug' }, { label: 'Author', name: 'author' }, { label: 'Excerpt', name: 'excerpt' }].map(({ label, name }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                  <input type="text" name={name} value={form[name]} onChange={handleChange}
                    className="w-full bg-dark border border-white/10 rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                {[{ label: 'Category', name: 'category', options: CATEGORIES }, { label: 'Status', name: 'status', options: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] }].map(({ label, name, options }) => (
                  <div key={name}>
                    <label className="block text-xs font-semibold text-body-dark mb-1">{label}</label>
                    <select name={name} value={form[name]} onChange={handleChange}
                      className="w-full bg-dark border border-white/10 rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors">
                      {options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-body-dark mb-1">Content</label>
                <textarea name="content" value={form.content} onChange={handleChange} rows={8}
                  className="w-full bg-dark border border-white/10 rounded px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dark disabled:opacity-70 text-white text-sm font-bold py-2 px-5 rounded transition-colors">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Post'}
                </button>
                <button onClick={() => setEditing(null)} className="text-body-dark hover:text-white text-sm font-medium transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <div className="bg-dark-secondary border border-white/5 rounded-xl overflow-x-auto scrollbar-none">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="border-b border-white/5">
              <tr>{['Title', 'Category', 'Author', 'Status', 'Published', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-body-dark">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {posts.length > 0 && posts.map(post => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium max-w-xs truncate">{post.title}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-white/5 text-body-dark px-2 py-0.5 rounded">{post.category}</span></td>
                  <td className="px-4 py-3 text-body-dark">{post.author}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded ${STATUS_COLOR[post.status] || ''}`}>{post.status}</span></td>
                  <td className="px-4 py-3 text-body-dark text-xs">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(post)} className="text-body-dark hover:text-white transition-colors p-1"><Pencil className="w-4 h-4" /></button>
                      {deleting === post.id ? <Loader2 className="w-4 h-4 text-primary animate-spin" /> : (
                        <button onClick={() => handleDelete(post.id)} className="text-body-dark hover:text-red-400 transition-colors p-1"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {posts.length === 0 && (
            <div className="px-4 py-12 text-center text-body-dark sticky left-0 w-full">No posts yet. Create your first post.</div>
          )}
        </div>
      )}
    </div>
  );
}
