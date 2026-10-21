import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, BlogPostRecord } from '../services/api';
import { Search, Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [category, setCategory] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const categories = ['ALL', 'INTERIOR', 'FREELANCE', 'TIPS_TRICK', 'STARTUP', 'COMMUNITY'];

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await blogApi.list({
          category: category === 'ALL' ? undefined : category,
          search: search.trim() || undefined,
        });
        setPosts(res.data);
      } catch (err) {
        // Fallback default starter posts matching proposal
        setPosts([
          {
            id: '1',
            title: 'Why your business absolutely needs a virtual office',
            slug: 'why-your-business-needs-a-virtual-office',
            excerpt: 'Establish prestige on Jinnah Avenue, Blue Area Islamabad without the overhead of long-term commercial leases.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
            category: 'INTERIOR',
            read_time: '5 mins read',
            published: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'How to Run Your Freelance Design Business on the Cheap',
            slug: 'how-to-run-your-freelance-design-business-on-the-cheap',
            excerpt: 'Smart tips on equipment, workspace efficiency, and international invoicing for Pakistani creatives.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            category: 'TIPS_TRICK',
            read_time: '5 mins read',
            published: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Getting Clients to Care About Their Website Long Term',
            slug: 'getting-clients-to-care-about-their-website-long-term',
            excerpt: 'Proven strategies for web agencies and developers to turn one-time builds into recurring maintenance contracts.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            category: 'FREELANCE',
            read_time: '5 mins read',
            published: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchPosts, 250);
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Header */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-20 border-b border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B87C]/20 border border-[#00B87C]/30 text-xs font-semibold text-[#00B87C] mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Roarworks Editorial</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Workspace Insights & Creator Stories
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Actionable strategies on freelancing, tech startup scaling, podcast production, and workspace design in Pakistan.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mt-8 relative">
            <input
              type="text"
              placeholder="Search articles by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 text-sm border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#00B87C] backdrop-blur-md"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-[#00B87C] text-white shadow-md'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm">No articles found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-56 overflow-hidden">
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 font-semibold">
                      <span className="text-[#00B87C] uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-normal text-gray-400">
                        <Clock className="w-3 h-3" />
                        {post.read_time}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#00B87C] transition-colors leading-snug mb-3">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {post.author_name || 'The Roarworks'}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00B87C] hover:text-[#009F6B]"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <WhatsAppFloat />
    </div>
  );
};
