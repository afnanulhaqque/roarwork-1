import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#0A0D14]">
      {/* Background Image with Dark Vignette Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: "url('/0X9A9243.jpeg')",
        }}
      />
      
      {/* Dark Ambient Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/60" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 w-full">
        <div className="max-w-2xl">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-gray-200 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00B87C] animate-ping" />
            <span className="text-[#00B87C]">Now Open in Blue Area, Islamabad</span>
            <span className="text-gray-400">·</span>
            <span>24/7 Access</span>
          </div>

          {/* Main Headline from Design.png */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] mb-6">
            Comfortable <br />
            <span className="text-white">Coworking Space.</span>
          </h1>

          {/* Subtitle from Design.png */}
          <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed mb-10 max-w-xl">
            Our coworking spaces let you choose to work with others in an open-plan area, or a shared office. Designed for tech innovators, agency teams, and creators in Blue Area, Islamabad.
          </p>

          {/* Action Buttons from Design.png */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#book-tour"
              className="px-8 py-4 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-sm tracking-wider uppercase rounded-md shadow-xl shadow-[#00B87C]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
            >
              <span>BOOK A TOUR</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <Link
              to="/about"
              className="px-8 py-4 bg-[#1F2937]/80 hover:bg-[#374151] text-white font-semibold text-sm rounded-md border border-white/20 transition-all transform hover:-translate-y-0.5"
            >
              About Us
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00B87C]" />
              <span>Female-Friendly & Secure Access</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
              <span>Day & Night Shifts (US/UK friendly)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00B87C]" />
              <span>100% Fiber & Generator Backup</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
