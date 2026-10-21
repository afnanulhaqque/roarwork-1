import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { bookingsApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, ExternalLink, CheckCircle } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

// Inline social icons
const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Contact: React.FC = () => {
  const { showToast } = useToast();
  const location = useLocation();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingType, setBookingType] = useState('Personal');
  const [planInterest, setPlanInterest] = useState('Hot Desk');
  const [startDate, setStartDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning Shift');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState<string | null>(null);

  useEffect(() => {
    // Check if plan passed via query param
    const params = new URLSearchParams(location.search);
    const planParam = params.get('plan');
    if (planParam) {
      setPlanInterest(planParam);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await bookingsApi.create({
        full_name: fullName,
        email,
        phone,
        booking_type: bookingType,
        plan_interest: planInterest,
        start_date: startDate || undefined,
        preferred_time: preferredTime,
        notes,
        terms_agreed: true
      });

      setSubmitted(true);
      if (res.data.whatsapp_link) {
        setWhatsappLink(res.data.whatsapp_link);
      }
      showToast('Tour request received! Our community lead will contact you.', 'success');
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Could not send request. Please WhatsApp us directly.', 'error');
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
            Connect With Our Team
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Visit The Roarworks Blue Area
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Conveniently located on Jinnah Avenue in Islamabad’s central commercial hub. Schedule a tour, enquire about private suites, or reserve the podcast studio.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left: Contact Info & Location details */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Cards */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">
                Direct Contact Lines
              </h3>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00B87C] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Phone / WhatsApp</div>
                  <a href="tel:+923275277725" className="text-base font-bold text-gray-900 hover:text-[#00B87C]">
                    +92 327 527 7725
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00B87C] flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Instant WhatsApp Line</div>
                  <a
                    href="https://wa.me/923275277725"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-[#00B87C] hover:underline"
                  >
                    +92 327 527 7725
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00B87C] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium">Official Inquiries</div>
                  <a href="mailto:info@theroarworks.com" className="text-base font-bold text-gray-900 hover:text-[#00B87C]">
                    info@theroarworks.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                <a
                  href="https://www.instagram.com/theroarworks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#00B87C] transition-colors"
                >
                  <InstagramIcon className="w-5 h-5" />
                  Instagram
                </a>
                <a
                  href="https://www.linkedin.com/company/theroarworks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#00B87C] transition-colors"
                >
                  <LinkedinIcon className="w-5 h-5" />
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-gray-900 font-bold text-base">
                <Clock className="w-5 h-5 text-[#00B87C]" />
                <span>Operating Hours</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Registered Members</span>
                  <span className="font-bold text-[#00B87C]">24 Hours / 7 Days</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span>Public Tours & Visitors</span>
                  <span className="font-semibold text-gray-800">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Podcast Studio Sessions</span>
                  <span className="font-semibold text-gray-800">By Advance Booking</span>
                </div>
              </div>
            </div>

            {/* Metro & Location Guide */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                <MapPin className="w-5 h-5 text-[#00B87C]" />
                <span>Location & Transit Guide</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                The Roarworks, Executive Heights, Jinnah Avenue, Blue Area, Islamabad.
              </p>
              <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1">
                <div>• <strong>Metro Station:</strong> 7th Avenue Station (2 mins walk)</div>
                <div>• <strong>Parking:</strong> Dedicated basement and front executive parking</div>
                <div>• <strong>Landmarks:</strong> Opposite ISE Towers, near Stock Exchange</div>
              </div>
            </div>

          </div>

          {/* Right: Interactive Booking / Contact Form */}
          <div id="book-tour" className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200 shadow-xl">
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                Schedule a Visit or Send an Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-8">
                Fill in your details below and our team will prepare your workspace pass.
              </p>

              {submitted ? (
                <div className="text-center py-12 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <CheckCircle className="w-14 h-14 text-[#00B87C] mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Tour Request Confirmed!</h4>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto mb-6">
                    We look forward to welcoming you to The Roarworks Blue Area. Click below to message our front desk host on WhatsApp right now.
                  </p>
                  {whatsappLink && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-sm rounded-lg shadow-lg"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp Now</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Afnan Ul Haq"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        WhatsApp / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+92 333 1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Booking Category
                      </label>
                      <select
                        value={bookingType}
                        onChange={(e) => setBookingType(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                      >
                        <option value="Personal">Personal / Freelancer</option>
                        <option value="Team">Small Team (2-10)</option>
                        <option value="Enterprise">Enterprise (10+)</option>
                        <option value="Podcast">Podcast Studio Recording</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Plan of Interest
                      </label>
                      <select
                        value={planInterest}
                        onChange={(e) => setPlanInterest(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                      >
                        <option value="Hot Desk">Hot Desk (PKR 18,000/mo)</option>
                        <option value="Dedicated Desk">Dedicated Desk (PKR 28,000/mo)</option>
                        <option value="Private Office">Private Office (From PKR 75,000/mo)</option>
                        <option value="Podcast Studio">Podcast Studio (PKR 4,000/hr)</option>
                        <option value="Meeting Room">Meeting Boardroom (PKR 2,500/hr)</option>
                        <option value="Night Shift">Night Shift Pass (PKR 22,000/mo)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                        Preferred Tour Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Shift Preference
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Morning Shift', 'Evening Shift', 'Night Shift'].map((shift) => (
                        <button
                          key={shift}
                          type="button"
                          onClick={() => setPreferredTime(shift)}
                          className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                            preferredTime === shift
                              ? 'bg-[#00B87C] text-white border-[#00B87C]'
                              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {shift}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Additional Notes or Specific Requirements
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Let us know if you require monitors, podcast camera operator, or custom cabin layout..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#00B87C] hover:bg-[#009F6B] disabled:bg-gray-400 text-white font-bold text-sm uppercase tracking-wider rounded-lg shadow-xl shadow-[#00B87C]/25 transition-all"
                  >
                    {submitting ? 'Sending Request...' : 'Confirm Tour Booking'}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Embedded Google Map Section */}
      <section id="location" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-200 h-[400px] relative">
          <iframe
            title="The Roarworks Blue Area Islamabad Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13279.799863810148!2d73.0559728!3d33.7088924!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbf9df193631f%3A0xc68297f093a0f781!2sBlue%20Area%2C%20Islamabad!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
};
