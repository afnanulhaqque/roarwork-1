import React, { useEffect, useState } from 'react';
import { teamApi, TeamMemberRecord } from '../services/api';
import { Mail, Sparkles, Globe } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await teamApi.list();
        setMembers(res.data);
      } catch (err) {
        setMembers([
          {
            id: '1',
            name: 'Afnan Ul Haq',
            role: 'Managing Director & Founder',
            bio: "Serial entrepreneur passionate about building Islamabad's most vibrant creator and tech ecosystem in Blue Area.",
            photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
            email: 'afnan@roarworks.com',
            linkedin_url: 'https://linkedin.com',
            display_order: 1,
          },
          {
            id: '2',
            name: 'Sarah Khan',
            role: 'Community & Operations Lead',
            bio: 'Ensuring seamless day and night operations, female-friendly security, and welcoming community vibes for all members.',
            photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
            email: 'sarah@roarworks.com',
            linkedin_url: 'https://linkedin.com',
            display_order: 2,
          },
          {
            id: '3',
            name: 'Hamza Ali',
            role: 'Studio & Media Producer',
            bio: 'Audiophile and media engineer managing The Roarworks Podcast Studio, multi-cam switching, and audio mastering.',
            photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
            email: 'hamza@roarworks.com',
            linkedin_url: 'https://linkedin.com',
            display_order: 3,
          },
          {
            id: '4',
            name: 'Zoya Malik',
            role: 'Member Experience Coordinator',
            bio: 'Dedicated to tour bookings, shift scheduling, and ensuring rapid one-hour follow-ups on all visitor inquiries.',
            photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
            email: 'zoya@roarworks.com',
            linkedin_url: 'https://linkedin.com',
            display_order: 4,
          },
        ]);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-20 border-b border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B87C]/20 border border-[#00B87C]/30 text-xs font-semibold text-[#00B87C] mb-4">
            Meet the Curators
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            The Faces Behind The Roarworks
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our passionate hospitality, operations, and audio engineering team dedicated to making your workday seamless.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={member.photo_url}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    {member.linkedin_url && (
                      <a
                        href={member.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-white/20 hover:bg-[#00B87C] text-white backdrop-blur-md transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00B87C] block mb-1">
                    {member.role}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>

              {member.email && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {member.email}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Careers Prompt */}
      <section className="py-20 bg-emerald-50 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#00B87C] text-white mx-auto flex items-center justify-center mb-4 shadow-lg shadow-[#00B87C]/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
            Want to Join The Roarworks Team?
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mb-6">
            We are always on the lookout for dynamic community managers, evening shift hosts, and audio podcast engineers.
          </p>
          <a
            href="mailto:careers@roarworks.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
          >
            <span>Email careers@roarworks.com</span>
          </a>
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
};
