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
            name: 'Tatheer Fatemah',
            role: 'CEO',
            bio: 'Leading the vision and growth of The Roarworks.',
            photo_url: '/team-member-female.png',
            display_order: 1,
          },
          {
            id: '2',
            name: 'Tayyiba Mustafa',
            role: 'General Manager',
            bio: 'Overseeing daily operations and delivering a seamless member experience.',
            photo_url: '/team-member-female.png',
            display_order: 2,
          },
          {
            id: '3',
            name: 'Nabeel Sadique',
            role: 'Office Administrator',
            bio: 'Supporting the team and keeping office operations organized.',
            photo_url: '/team-member-male.png',
            display_order: 3,
          },
          {
            id: '4',
            name: 'Abdul Basit',
            role: 'IT Executive',
            bio: 'Supporting reliable technology and IT services across the workspace.',
            display_order: 4,
            photo_url: '/team-member-male.png',
          },
          {
            id: '5',
            name: 'Rijah Nisar',
            role: 'Sales Executive',
            bio: 'Helping prospective members find the right workspace solution.',
            display_order: 5,
            photo_url: '/team-member-female.png',
          },
          {
            id: '6',
            name: 'Fatima Iftikhar',
            role: 'Social Media Manager',
            bio: 'Sharing The Roarworks community and updates across social platforms.',
            display_order: 6,
            photo_url: '/team-member-female.png',
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
            Meet the people leading our team, supporting daily operations, and building The Roarworks community.
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
