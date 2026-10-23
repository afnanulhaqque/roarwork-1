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

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050811] text-gray-400 pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-white/10 text-sm">
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
                <a href="#newsletter" className="hover:text-white transition-colors">
                  Community Newsletter
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: COMMUNITY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Community
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.linkedin.com/company/theroarworks/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <LinkedinIcon className="w-4 h-4" />
                  LinkedIn Network
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/theroarworks/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                  Instagram @theroarworks
                </a>
              </li>
              <li>
                <a href="https://wa.me/923275277725" target="_blank" rel="noopener noreferrer" className="hover:text-[#00B87C] transition-colors font-medium">
                  WhatsApp Community
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: SUPPORT */}
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
              <li>
                <span className="text-xs text-gray-500 block">
                  Phone:
                </span>
                <a href="tel:+923275277725" className="text-white hover:text-[#00B87C] transition-colors font-semibold">
                  +92 327 527 7725
                </a>
              </li>
              <li>
                <span className="text-xs text-gray-500 block">
                  Email:
                </span>
                <a href="mailto:info@theroarworks.com" className="text-white hover:text-[#00B87C] transition-colors font-semibold break-all">
                  info@theroarworks.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5: COMPANY */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/#our-story" className="hover:text-white transition-colors">
                  About The Roarworks
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
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="text-white font-bold text-lg tracking-tight">
              The <span className="text-[#00B87C]">Roarworks</span>
            </span>
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
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/theroarworks/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-500 hover:text-[#00B87C] transition-colors">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/theroarworks/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-[#00B87C] transition-colors">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <span>© 2026 The Roarworks. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
