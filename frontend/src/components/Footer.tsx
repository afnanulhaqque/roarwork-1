import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

// Inline social icons (lucide-react version doesn't include these)
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

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.48 0 .13 5.35.13 11.94c0 2.1.55 4.15 1.59 5.96L.04 24l6.26-1.64a11.9 11.9 0 0 0 5.75 1.46h.01c6.58 0 11.93-5.35 11.94-11.93a11.86 11.86 0 0 0-3.48-8.41zM12.06 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.72.98.99-3.63-.23-.37a9.87 9.87 0 0 1-1.52-5.25c0-5.46 4.45-9.91 9.92-9.91 2.65 0 5.14 1.03 7.01 2.91a9.85 9.85 0 0 1 2.9 7.01c0 5.47-4.45 9.92-9.95 9.92zm5.44-7.42c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.79-1.67-2.09-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35z" />
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] text-gray-400 pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-white/10 text-sm">
          {/* Column 1: FEATURE */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Features
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/offerings" className="hover:text-white transition-colors">
                  Hot Desk Seating
                </Link>
              </li>
              <li>
                <Link to="/offerings" className="hover:text-white transition-colors">
                  Dedicated Desks
                </Link>
              </li>
              <li>
                <Link to="/offerings" className="hover:text-white transition-colors">
                  Private Office Cabins
                </Link>
              </li>
              <li>
                <Link to="/offerings" className="hover:text-white transition-colors">
                  4K Podcast Studio
                </Link>
              </li>
              <li>
                <Link to="/offerings" className="hover:text-white transition-colors">
                  Night Shift Pass
                </Link>
              </li>
              <li>
                <Link to="/offerings" className="hover:text-white transition-colors">
                  Meeting Boardrooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: RESOURCES */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/blog" className="hover:text-white transition-colors">
                  Editorial & Insights
                </Link>
              </li>
              <li>
                <Link to="/#our-story" className="hover:text-white transition-colors">
                  Space Tour Guide
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="hover:text-white transition-colors">
                  Member Perks & Discounts
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/#newsletter" className="hover:text-white transition-colors">
                  Community Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: SUPPORT */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/admin/login" className="hover:text-white transition-colors">
                  Staff & Member Login
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Help & Contact Desk
                </Link>
              </li>
              <li>
                <Link to="/contact#location" className="hover:text-white transition-colors">
                  Metro Transit Access
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: COMPANY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/#our-story" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-white transition-colors">
                  Our Team & Founders
                </Link>
              </li>
              <li>
                <Link to="/partnerships" className="hover:text-white transition-colors">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/code-of-conduct" className="hover:text-white transition-colors">
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar matching Design.png footer */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-4 gap-y-3">
            <Link to="/" aria-label="Home" className="shrink-0">
              <img
                src="/images-removebg-preview.png"
                alt="The Roarworks"
                width="738"
                height="270"
                className="w-32 sm:w-36 h-auto max-h-12 object-contain"
              />
            </Link>
            <span className="text-gray-600 hidden sm:block">|</span>
            <span className="flex items-center gap-1 text-gray-400">
              <MapPin className="w-3.5 h-3.5 text-[#00B87C]" />
              Blue Area, Jinnah Avenue, Islamabad
            </span>
            <span className="text-gray-600 hidden sm:block">|</span>
            <a href="tel:+923275277725" className="flex items-center gap-1 text-gray-400 hover:text-[#00B87C] transition-colors">
              <Phone className="w-3.5 h-3.5 text-[#00B87C]" />
              +92 327 527 7725
            </a>
            <span className="text-gray-600 hidden sm:block">|</span>
            <a href="mailto:info@theroarworks.com" className="flex items-center gap-1 text-gray-400 hover:text-[#00B87C] transition-colors">
              <Mail className="w-3.5 h-3.5 text-[#00B87C]" />
              info@theroarworks.com
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://www.instagram.com/theroarworks/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#00B87C] transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/theroarworks/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-[#00B87C] transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="https://wa.me/923275277725" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-gray-500 hover:text-[#00B87C] transition-colors">
              <WhatsAppIcon className="w-4 h-4" />
            </a>
            <span>© 2026 All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
