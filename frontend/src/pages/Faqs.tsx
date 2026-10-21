import React, { useState } from 'react';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const Faqs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const faqs: FaqItem[] = [
    {
      category: 'General',
      question: 'Where is The Roarworks located in Islamabad?',
      answer: 'The Roarworks is located centrally on Jinnah Avenue in Blue Area, Islamabad. We are directly opposite ISE Towers, a 2-minute walk from the 7th Avenue Metro Bus station, with easy parking access.',
    },
    {
      category: 'General',
      question: 'Are there any long-term lock-in contracts or heavy deposits?',
      answer: 'No. We operate with zero lock-in contracts. You can subscribe on a monthly flexible basis and upgrade or scale down with 15 days notice. No arbitrary broker fees or commercial lease hassles.',
    },
    {
      category: 'Night Shifts',
      question: 'How do Night Shifts work for US/UK remote workers?',
      answer: 'Our Night Shift Pass runs from 8:00 PM to 8:00 AM. It provides full access to reserved desks, 24/7 heavy generator backup, high-speed fiber, complimentary hot tea/coffee, and overnight on-site security guards.',
    },
    {
      category: 'Night Shifts',
      question: 'Is power and internet 100% guaranteed during city outages?',
      answer: 'Yes. We have industrial dual backup diesel generators that switch on within 10 seconds of any grid interruption. Our fiber connections are routed through dual redundant commercial fiber providers (including Nayatel).',
    },
    {
      category: 'Security',
      question: 'What security and female-friendly measures are in place?',
      answer: 'We have 24/7 CCTV surveillance, biometric access cards, a dedicated female-only lounge and prayer area, clean washrooms with sanitary amenities, and verified member registration.',
    },
    {
      category: 'Podcast Studio',
      question: 'What equipment is included in the Podcast Studio rental?',
      answer: 'The podcast studio comes fully equipped with 4x Shure SM7B microphones on broadcast boom arms, a RODECaster Pro II audio mixer, Sony 4K mirrorless cinema cameras, professional softbox lighting grid, and soundproof acoustic treatment. A studio engineer is also available.',
    },
    {
      category: 'Pricing',
      question: 'What payment methods do you accept?',
      answer: 'We accept direct Pakistani online bank transfers (IBFT), corporate checks, debit/credit cards, Payoneer, and international wire transfers for foreign companies.',
    },
  ];

  const filteredFaqs = activeCategory === 'All'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-20 border-b border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B87C]/20 border border-[#00B87C]/30 text-xs font-semibold text-[#00B87C] mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about our memberships, security, podcast studio, and Blue Area facilities.
          </p>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {['All', 'General', 'Night Shifts', 'Security', 'Podcast Studio', 'Pricing'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#00B87C] text-white shadow-md'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Accordion */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-300 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  <span className="font-bold text-gray-900 text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#00B87C] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Prompt */}
        <div className="mt-16 text-center p-8 bg-[#EAF7F2] rounded-3xl border border-[#00B87C]/20">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Have a question not listed here?</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Our community manager is available on WhatsApp right now to answer any specific questions.
          </p>
          <a
            href="https://wa.me/923335557627"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Us on WhatsApp</span>
          </a>
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
};
