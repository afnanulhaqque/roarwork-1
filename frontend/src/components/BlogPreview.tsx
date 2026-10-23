import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogApi, BlogPostRecord } from '../services/api';
import { ArrowRight, Clock } from 'lucide-react';

export const BlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await blogApi.list();
        setPosts(res.data.slice(0, 3));
      } catch (err) {
        // Fallback default starter posts matching Design.png
        setPosts([
          {
            id: '1',
            title: 'Why your business absolutely needs a virtual office',
            slug: 'why-your-business-needs-a-virtual-office',
            excerpt: 'Establish prestige on Jinnah Avenue, Blue Area Islamabad without the overhead of long leases.',
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
            excerpt: 'Smart tips on equipment, workspace efficiency, and international invoicing.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            category: 'TIPS TRICK',
            read_time: '5 mins read',
            published: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Getting Clients to Care About Their Website Long Term',
            slug: 'getting-clients-to-care-about-their-website-long-term',
            excerpt: 'Proven strategies for web agencies and developers to build recurring retainers.',
            content: '',
            cover_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            category: 'FREELANCE',
            read_time: '5 mins read',
            published: true,
            published_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
          },
        ]);
      }
    };
    fetchPosts();
  }, []);

  return (
    <section className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading matching Design.png */}
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Our Latest Blog
          </h2>
        </div>

        {/* 3 Blog Cards matching Design.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group block bg-[#121826] rounded-xl p-4 border border-white/10 transition-transform transform hover:-translate-y-1"
            >
              <div className="w-full h-56 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Tag and read time line matching Design.png */}
              <div className="flex items-center gap-3 text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">
                <span className="text-[#00B87C] font-bold">
                  {post.category}
                </span>
                <span className="text-gray-500">—</span>
                <span className="flex items-center gap-1 font-normal lowercase">
                  <Clock className="w-3 h-3 text-gray-500" />
                  {post.read_time}
                </span>
              </div>

              {/* Title matching Design.png */}
              <h3 className="text-lg font-bold text-white group-hover:text-[#00B87C] transition-colors leading-snug">
                {post.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* More Posts Button matching Design.png */}
        <div className="text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-sm rounded-md shadow-lg shadow-[#00B87C]/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>More Posts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};
