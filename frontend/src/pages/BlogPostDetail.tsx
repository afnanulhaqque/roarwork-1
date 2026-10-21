import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogApi, BlogPostRecord } from '../services/api';
import { ArrowLeft, Clock, Calendar, Share2, User, Check, MessageSquare } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const BlogPostDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await blogApi.get(slug);
        setPost(res.data);
      } catch (err) {
        // Fallback default
        setPost({
          id: '1',
          title: 'Why your business absolutely needs a virtual office',
          slug: 'why-your-business-needs-a-virtual-office',
          excerpt: 'Establish prestige on Jinnah Avenue, Blue Area Islamabad without the overhead of long-term commercial leases.',
          content: `In today's digital-first economy, location continues to signal credibility. Having a registered corporate address in Islamabad's commercial core—Blue Area—immediately differentiates your startup or agency from competitors operating from residential sectors.

### 1. Prestigious Business Address on Jinnah Avenue
A Blue Area address on your company letterhead, tax filings, and client invoices immediately conveys stability and professionalism to international clients and Pakistani institutions alike.

### 2. Mail Handling and Executive Reception
With The Roarworks virtual office package, our professional front desk team receives your registered mail, parcels, and executive guests, notifying you instantly via WhatsApp and digital mail scanning.

### 3. Meeting Room Credits on Demand
When you need to sign a high-value contract or meet investors, book our modern boardroom with 4K video conferencing and executive hospitality, paying only for the hours you actually use.`,
          cover_image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
          category: 'INTERIOR',
          read_time: '5 mins read',
          published: true,
          published_at: new Date().toISOString(),
          author_name: 'Afnan Ul Haq',
          created_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
        <Link to="/blog" className="text-[#00B87C] font-semibold underline">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      
      {/* Article Header */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-16 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-[#00B87C] mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <div className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-[#00B87C] mb-4">
            <span>{post.category}</span>
            <span>·</span>
            <span className="text-gray-400 font-normal lowercase flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.read_time}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-gray-400 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#00B87C] text-white flex items-center justify-center font-bold text-sm">
                {post.author_name ? post.author_name[0] : 'R'}
              </div>
              <span className="text-white font-medium">
                {post.author_name || 'The Roarworks Editorial'}
              </span>
            </div>
            <span>·</span>
            <span>Blue Area, Islamabad</span>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-[360px] sm:h-[480px] object-cover"
          />
        </div>
      </div>

      {/* Article Body */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
          <p className="text-lg font-medium text-gray-900 border-l-4 border-[#00B87C] pl-4 italic">
            {post.excerpt}
          </p>

          <div className="whitespace-pre-line text-sm sm:text-base leading-relaxed text-gray-700">
            {post.content}
          </div>
        </div>

        {/* Share & Tour CTA Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-[#EAF7F2] border border-[#00B87C]/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Ready to Upgrade Your Workday?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Visit The Roarworks in Blue Area, Islamabad for a free day pass and guided tour.
            </p>
          </div>
          <Link
            to="/contact#book-tour"
            className="px-6 py-3 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md shrink-0 transition-all"
          >
            Book a Tour Now
          </Link>
        </div>
      </article>

      <WhatsAppFloat />
    </div>
  );
};
