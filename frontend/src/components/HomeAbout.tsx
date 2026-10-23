import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Wifi, Radio, Clock } from 'lucide-react';

export const HomeAbout: React.FC = () => {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Female-Friendly & Secure',
      desc: 'Dedicated biometric access, respectful community guidelines, well-lit parking, and private female nursing and relaxation pods.',
    },
    {
      icon: Wifi,
      title: 'Dual Fiber & Zero Downtime',
      desc: 'Redundant commercial fiber connections with automatic failover and industrial diesel generator backup for 100% uninterrupted power.',
    },
    {
      icon: Clock,
      title: 'Day & Night Shifts',
      desc: 'Built specifically for international remote teams, software houses, and freelancers synchronizing with US, UK, and European business hours.',
    },
    {
      icon: Radio,
      title: 'Creator & Media Ecosystem',
      desc: 'Islamabad’s only coworking campus featuring an on-site acoustically isolated 4K podcast studio, audio mixing, and broadcast video setup.',
    },
  ];

  const stats = [
    { number: '15,000+', label: 'Square Feet of Creative Space' },
    { number: '250+', label: 'Active Innovators & Freelancers' },
    { number: '99.9%', label: 'Power & High-Speed Internet Uptime' },
    { number: '50+', label: 'Podcast Episodes Recorded Monthly' },
  ];

  return (
    <>
      <section id="our-story" className="bg-[#F3F8F6] text-gray-900 py-16 sm:py-20 border-y border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#00B87C]/20 border border-[#00B87C]/30 text-xs font-semibold text-[#00B87C] mb-4">
              Our Story & Mission
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-5">
              Empowering Islamabad’s <span className="text-[#00B87C]">Next Generation of Builders.</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              The Roarworks was born out of a desire to provide Islamabad’s tech founders, creators, and remote professionals with a reliable, world-class workspace in the heart of Blue Area.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6 leading-tight">
                A Modern Workspace Designed Around Real Work.
              </h3>
              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Situated on Jinnah Avenue in Blue Area, Islamabad, The Roarworks positions you at the epicenter of Pakistan&apos;s capital commerce. Just steps away from the Metro Bus terminal and key financial institutions, our campus offers unmatched accessibility and prestige.
                </p>
                <p>
                  Unlike generic commercial rentals that burden startups with massive initial furniture investments and unpredictable utility bills, we provide turnkey flexibility: drop in for a day pass, secure a dedicated desk, or scale your software agency inside a bespoke private office.
                </p>
                <p>
                  With 24/7 power backed by industrial generators and dual fiber lines, night shift software engineers and day shift creators alike work with zero interruption.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/contact#book-tour"
                  className="px-6 py-3 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
                >
                  Schedule an In-Person Tour
                </Link>
                <Link
                  to="/offerings"
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-semibold text-xs rounded-lg border border-gray-200 transition-all"
                >
                  Explore Offerings
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="/0X9A9232.jpeg"
                  alt="The Roarworks Workspace Interior"
                  className="w-full h-[320px] sm:h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-3 sm:-left-6 bg-[#0B0F19] text-white p-5 sm:p-6 rounded-2xl shadow-xl max-w-xs border border-white/10">
                <div className="text-xl sm:text-2xl font-extrabold text-[#00B87C] mb-1">Jinnah Avenue</div>
                <div className="text-xs text-gray-300">Blue Area, Islamabad · Nearest Metro: 7th Avenue Station</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 sm:py-16 bg-[#0B0F19] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="p-2 sm:p-4">
                <div className="text-3xl sm:text-5xl font-extrabold text-[#00B87C] mb-2 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Built on Pillars of Excellence
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              We hold ourselves to the highest standards of hospitality, security, and technological reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00B87C] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
