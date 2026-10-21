import React, { useState, useEffect } from 'react';
import { partnersApi, PartnerRecord, bookingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Handshake, Building, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const Partnerships: React.FC = () => {
  const { showToast } = useToast();
  const [partners, setPartners] = useState<PartnerRecord[]>([]);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partnershipType, setPartnershipType] = useState('Corporate Membership');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await partnersApi.list();
        setPartners(res.data);
      } catch (err) {
        setPartners([
          { id: '1', name: 'Nayatel Fiber', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Nayatel_logo.png', category: 'Infrastructure Partner' },
          { id: '2', name: 'Techlogix', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', category: 'Tech Enterprise' },
          { id: '3', name: 'Devsinc', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', category: 'Software House' },
          { id: '4', name: 'Careem', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', category: 'Corporate Member' },
          { id: '5', name: 'Jazz xlr8', logo_url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&w=200&q=80', category: 'Accelerator' },
        ]);
      }
    };
    fetchPartners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bookingsApi.create({
        email,
        full_name: `${contactName} (${companyName})`,
        phone,
        booking_type: 'Enterprise',
        plan_interest: `Partner: ${partnershipType}`,
        notes: message,
        terms_agreed: true
      });
      setSubmitted(true);
      showToast('Partnership proposal received! Our director will reach out within 24 hours.', 'success');
    } catch (err) {
      showToast('Could not submit inquiry. Please message on WhatsApp directly.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Header */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-20 border-b border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B87C]/20 border border-[#00B87C]/30 text-xs font-semibold text-[#00B87C] mb-4">
            Ecosystem & Enterprise
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Partner With The Roarworks
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Join leading Pakistani enterprises, fast-scaling software houses, and global incubators collaborating in Islamabad.
          </p>
        </div>
      </section>

      {/* Partner Logo Wall */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#00B87C] mb-2">
            Trusted By Industry Pioneers
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Our Ecosystem Partners & Corporate Members
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center hover:border-[#00B87C] hover:shadow-md transition-all group"
            >
              <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center p-2 mb-3 group-hover:scale-105 transition-transform">
                <Building className="w-8 h-8 text-gray-500 group-hover:text-[#00B87C]" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{partner.name}</h4>
              <span className="text-[11px] text-gray-400 font-medium">{partner.category}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center mb-5">
                <Building className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Corporate Wings</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Dedicated lockable suites with custom company branding, internal meeting spaces, and private fiber uplinks for 10-50+ member teams.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center mb-5">
                <Handshake className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Event & Hackathon Hosting</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Host investor demo days, developer meetups, and design workshops in our auditorium lounge with 4K projectors and catering support.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-gray-50 border border-gray-200">
              <div className="w-12 h-12 rounded-xl bg-[#00B87C]/10 text-[#00B87C] flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Perks for Your Members</h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                Offer your portfolio companies or employees priority access to meeting rooms, podcast studio credits, and discounted desk packages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner With Us Form */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0B0F19] text-white rounded-3xl p-8 sm:p-12 border border-white/10 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-extrabold mb-3">
              Explore a Partnership
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Tell us about your organization and how we can collaborate in Blue Area, Islamabad.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <CheckCircle className="w-12 h-12 text-[#00B87C] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Inquiry Submitted!</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                Thank you for your interest. A member of our executive team will review your proposal and respond promptly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Careem Technologies"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Contact Person Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Afnan Ul Haq"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 333 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Partnership Category</label>
                <select
                  value={partnershipType}
                  onChange={(e) => setPartnershipType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                >
                  <option value="Corporate Membership">Corporate Team Membership (10+ Desks)</option>
                  <option value="Event Sponsorship">Event / Hackathon Sponsorship</option>
                  <option value="Creator / Media Alliance">Creator / Podcast Studio Alliance</option>
                  <option value="Landlord / Real Estate">Landlord / Workspace Expansion</option>
                  <option value="Tech Vendor / Perk">Perks & Cloud Services Discount Provider</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">How Can We Collaborate?</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about your team size, expected dates, or specific collaboration goals..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-[#00B87C] hover:bg-[#009F6B] disabled:bg-gray-600 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-xl shadow-[#00B87C]/25 transition-all"
              >
                {submitting ? 'Submitting Proposal...' : 'Send Partnership Proposal'}
              </button>
            </form>
          )}
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
};
