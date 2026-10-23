import React, { useState } from 'react';
import { bookingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Check, Calendar, Mail, User, Layers, MessageSquare, ExternalLink } from 'lucide-react';

export const TourBookingWidget: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingType, setBookingType] = useState('Personal');
  const [planInterest, setPlanInterest] = useState('Hot Desk');
  const [startDate, setStartDate] = useState('2026-10-25');
  const [endDate, setEndDate] = useState('2026-11-25');
  const [agreed, setAgreed] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      showToast('Please accept the Terms of Service to book a tour.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await bookingsApi.create({
        email,
        full_name: fullName || email.split('@')[0],
        phone,
        booking_type: bookingType,
        plan_interest: planInterest,
        start_date: startDate,
        end_date: endDate,
        preferred_time: 'Day Shift',
        terms_agreed: agreed,
      });

      showToast('Tour booking submitted! Our Blue Area community team will contact you.', 'success');
      if (res.data.whatsapp_link) {
        setWhatsappLink(res.data.whatsapp_link);
      }
      // Reset some inputs
      setEmail('');
      setPhone('');
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to submit tour request. Please try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="book-tour" className="relative py-24 bg-[#F3F8F6] overflow-hidden">
      {/* Background Image of Coworkers at Desks matching Design.png */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('/booking_tour.jpeg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#F3F8F6]/95 via-[#F3F8F6]/90 to-[#F3F8F6]/95" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Side: Teaser Text */}
          <div className="max-w-xl text-gray-900">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B87C]/20 text-[#00B87C] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#00B87C]/30">
              Personalized Workspace Tour
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
              Experience The Roarworks in Person.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
              Tour our flexible hot desks, executive conference rooms, soundproof podcast studio, and member lounge in Blue Area, Islamabad. Free day pass provided with every guided tour.
            </p>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00B87C]/20 flex items-center justify-center text-[#00B87C]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Guided walkthrough with community manager</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00B87C]/20 flex items-center justify-center text-[#00B87C]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Complimentary coffee & high-speed Wi-Fi test</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#00B87C]/20 flex items-center justify-center text-[#00B87C]">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>Immediate WhatsApp confirmation</span>
              </div>
            </div>
          </div>

          {/* Right Side: Floating Form Card */}
          <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
              Book a Tour
            </h3>

            {whatsappLink ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#00B87C]/20 text-[#00B87C] mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900">Booking Received!</h4>
                <p className="text-xs text-gray-600">
                  Our community team has been notified. Click below to connect with us immediately on WhatsApp.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Us on WhatsApp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setWhatsappLink(null)}
                  className="text-xs text-gray-500 hover:text-gray-900 underline mt-2"
                >
                  Book another visit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email input */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email :
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  />
                </div>

                {/* Full name & Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Full Name :
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      WhatsApp / Phone :
                    </label>
                    <input
                      type="tel"
                      placeholder="+92 333 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                    />
                  </div>
                </div>

                {/* Type dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Type :
                  </label>
                  <select
                    value={bookingType}
                    onChange={(e) => setBookingType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Team">Team (2 - 10 people)</option>
                    <option value="Enterprise">Enterprise (10+ people)</option>
                    <option value="Podcast">Podcast Studio Recording</option>
                  </select>
                </div>

                {/* Plan interest */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Plan Interest :
                  </label>
                  <select
                    value={planInterest}
                    onChange={(e) => setPlanInterest(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                  >
                    <option value="Hot Desk">Hot Desk (PKR 18,000/mo)</option>
                    <option value="Dedicated Desk">Dedicated Desk (PKR 28,000/mo)</option>
                    <option value="Private Office">Private Office (From PKR 75,000/mo)</option>
                    <option value="Podcast Studio">Podcast Studio (PKR 4,000/hr)</option>
                    <option value="Meeting Room">Meeting Boardroom (PKR 2,500/hr)</option>
                    <option value="Night Shift">Night Shift Pass (PKR 22,000/mo)</option>
                  </select>
                </div>

                {/* Date Start & Date End matching Design.png */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Date Start :
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Date End :
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg bg-white text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                    />
                  </div>
                </div>

                {/* Terms agreement checkbox matching Design.png */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-[#00B87C] focus:ring-[#00B87C] border-gray-300 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-[11px] text-gray-600 leading-snug cursor-pointer">
                    I agree to the{' '}
                    <span className="text-[#00B87C] underline">Terms of service</span> and{' '}
                    <span className="text-[#00B87C] underline">Privacy policy</span> of{' '}
                    <span className="text-gray-900 font-semibold">The Roarworks</span> company
                  </label>
                </div>

                {/* SUBMIT button matching Design.png */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 py-3.5 bg-[#00B87C] hover:bg-[#009F6B] disabled:bg-gray-600 text-white font-bold text-sm tracking-wider uppercase rounded-lg shadow-lg shadow-[#00B87C]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {submitting ? 'SUBMITTING...' : 'SUBMIT'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
