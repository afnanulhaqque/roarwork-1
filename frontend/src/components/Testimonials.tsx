import React from 'react';
import { Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Celine Dion',
      role: 'Cafe Owner & Founder',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      stars: 5,
      content: 'The Roarworks gave our administrative team the focus and executive presence we needed in Islamabad. Clean spaces, great coffee, and professional conference rooms.',
    },
    {
      name: 'Riana Madiva',
      role: 'Digital Marketer & Agency Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      stars: 5,
      content: 'Working night shifts for overseas US clients used to mean constant power and internet anxiety. At Roarworks Blue Area, zero downtime and round-the-clock female-friendly security.',
    },
    {
      name: 'John Melon',
      role: 'Freelancer & Content Creator',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      stars: 5,
      content: 'The acoustic podcast studio with Shure SM7B mics and 4K cameras is easily the best creator setup in Islamabad. High-speed fiber makes uploading 4K video instantaneous.',
    },
  ];

  return (
    <section className="py-24 bg-[#0B0F19]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header matching Design.png */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              They Satisfied With <br />
              Our Coworking Space
            </h2>
          </div>
          <div className="max-w-md">
            <span className="text-[#00B87C] font-bold text-sm tracking-wider uppercase block mb-1">
              Testimonials
            </span>
            <p className="text-gray-400 text-xs sm:text-sm">
              Discover how freelancers, agencies, and international remote teams thrive at The Roarworks.
            </p>
          </div>
        </div>

        {/* Testimonials 3 Cards matching Design.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev) => (
            <div
              key={rev.name}
              className="bg-[#121826] hover:bg-[#172033] rounded-2xl p-8 transition-all duration-300 border border-white/10 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Author Info with Circular Avatar */}
                <div className="flex items-center gap-4 mb-5">
                  <img
                    src={rev.avatar}
                    alt={rev.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {rev.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {rev.role}
                    </p>
                  </div>
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
                  "{rev.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
