import React from 'react';
import { Clock, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { TourBookingWidget } from '../components/TourBookingWidget';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

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
  return (
    <div className="contact-page min-h-screen text-white">
      <section className="contact-hero relative pt-24 pb-20 text-center">
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

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <div className="contact-glass-card rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-3">
                Direct Contact Lines
              </h2>

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

            <div className="contact-glass-card rounded-2xl p-6 space-y-4">
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
                  <span>Public Tours &amp; Visitors</span>
                  <span className="font-semibold text-gray-800">9:00 AM – 7:00 PM</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Podcast Studio Sessions</span>
                  <span className="font-semibold text-gray-800">By Advance Booking</span>
                </div>
              </div>
            </div>

            <div className="contact-glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                <MapPin className="w-5 h-5 text-[#00B87C]" />
                <span>Location &amp; Transit Guide</span>
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

          <div className="lg:col-span-7">
            <TourBookingWidget embedded />
          </div>
        </div>
      </section>

      <section id="location" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="contact-map rounded-3xl overflow-hidden h-[400px] relative">
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
