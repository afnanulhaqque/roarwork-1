import React, { useState } from 'react';
import { Shield, FileText, CheckCircle2 } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const Legal: React.FC<{ initialTab?: 'privacy' | 'terms' | 'code' }> = ({ initialTab = 'privacy' }) => {
  const [tab, setTab] = useState<'privacy' | 'terms' | 'code'>(initialTab);

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-16 border-b border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Legal & Community Policies
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            The Roarworks Coworking & Podcast Space · Blue Area, Islamabad
          </p>

          {/* Tab buttons */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setTab('privacy')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                tab === 'privacy'
                  ? 'bg-[#00B87C] text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setTab('terms')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                tab === 'terms'
                  ? 'bg-[#00B87C] text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              Terms of Service
            </button>
            <button
              onClick={() => setTab('code')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
                tab === 'code'
                  ? 'bg-[#00B87C] text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/15'
              }`}
            >
              Code of Conduct
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-sm text-gray-700 leading-relaxed space-y-6">
        {tab === 'privacy' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
            <p className="text-xs text-gray-500">Last updated: October 2026</p>
            <p>
              At The Roarworks, we take member privacy and data security seriously. This privacy policy describes how we collect, store, and safeguard personal and business information.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">1. Information We Collect</h3>
            <p>
              When booking a tour or subscribing to a desk plan, we collect your name, email address, phone number, company name, and shift preferences.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">2. Zero Spam Commitment</h3>
            <p>
              We will never sell, rent, or trade your contact information with external advertisers. Information is strictly used for tour coordination, invoicing, and facility updates.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">3. CCTV & Physical Security Data</h3>
            <p>
              For member protection, communal corridors and entry points in our Blue Area facility are monitored via 24/7 CCTV surveillance footage, retained for security compliance only.
            </p>
          </div>
        )}

        {tab === 'terms' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
            <p className="text-xs text-gray-500">Effective Date: October 2026</p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">1. Membership & Access</h3>
            <p>
              Membership grants non-exclusive license to use designated desk spaces or private suites in accordance with your subscribed tier. Shift timings (Day Shift: 8 AM - 8 PM; Night Shift: 8 PM - 8 AM; 24/7 Access) must be respected.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">2. Internet & Network Etiquette</h3>
            <p>
              High-speed internet is shared across members. Activities causing network saturation, illegal torrenting, or malicious intrusion are strictly prohibited and grounds for immediate contract termination.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">3. Cancellation & Notice</h3>
            <p>
              All desk memberships operate on flexible monthly cycles. Members can cancel or modify their plan by giving a 15-day written notice before the next billing period.
            </p>
          </div>
        )}

        {tab === 'code' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Community Code of Conduct</h2>
            <p className="text-xs text-gray-500">Guidelines for a respectful, inclusive workspace</p>
            <p>
              The Roarworks is committed to maintaining a professional, female-friendly, and supportive environment for all creators and developers.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">1. Mutual Respect & Zero Tolerance Harassment</h3>
            <p>
              Harassment of any form—including verbal, physical, or digital misconduct—will result in immediate expulsion without refund. We prioritize safety and peace of mind for all female and male members.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">2. Acoustic & Phone Etiquette</h3>
            <p>
              For long sales calls or video meetings, please utilize our dedicated acoustic phone booths or boardroom suites to keep open-plan hot desking quiet and productive.
            </p>
            <h3 className="text-lg font-bold text-gray-900 mt-4">3. Shared Amenities Care</h3>
            <p>
              Please clean up coffee cups and food containers after use in the pantry. Respect the equipment in the Podcast Studio and handle audio consoles with care.
            </p>
          </div>
        )}
      </div>

      <WhatsAppFloat />
    </div>
  );
};
