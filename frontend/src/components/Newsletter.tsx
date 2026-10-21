import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Mail, CheckCircle } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    showToast('Subscribed! Thank you for joining The Roarworks community.', 'success');
    setEmail('');
  };

  return (
    <section id="newsletter" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading matching Design.png */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Subs To News Letter
        </h2>

        {/* Subtitle matching Design.png */}
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed mb-8">
          Stay connected with Blue Area coworking community happenings, podcast studio feature releases, and exclusive workspace deals.
        </p>

        {/* Form matching Design.png */}
        {subscribed ? (
          <div className="inline-flex items-center gap-2 p-4 rounded-xl bg-[#EAF7F2] text-[#00B87C] font-semibold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>You're officially subscribed to The Roarworks dispatch!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                required
                placeholder="Email Address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:flex-1 px-5 py-3.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00B87C] focus:border-transparent"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-sm tracking-wide rounded-md shadow-md shadow-[#00B87C]/20 transition-all shrink-0"
              >
                Subscribe
              </button>
            </div>
            
            {/* Disclaimer matching Design.png */}
            <p className="text-xs text-gray-400 text-left sm:text-left mt-2.5">
              We'll never share your email with anyone else.
            </p>
          </form>
        )}
      </div>
    </section>
  );
};
