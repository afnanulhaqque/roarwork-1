import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { offeringsApi, OfferingRecord } from '../services/api';
import { Check, ArrowRight, Calculator, Sparkles, Clock, ShieldCheck, Zap } from 'lucide-react';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const Offerings: React.FC = () => {
  const [offerings, setOfferings] = useState<OfferingRecord[]>([]);
  const [shiftFilter, setShiftFilter] = useState<string>('All');
  const [loading, setLoading] = useState<boolean>(true);

  // Calculator State
  const [calcSeats, setCalcSeats] = useState<number>(3);
  const [calcPlan, setCalcPlan] = useState<'hot' | 'dedicated' | 'private'>('dedicated');

  useEffect(() => {
    const fetchOfferings = async () => {
      setLoading(true);
      try {
        const res = await offeringsApi.list({ shift: shiftFilter === 'All' ? undefined : shiftFilter });
        setOfferings(res.data);
      } catch (err) {
        // Fallback default offerings
        setOfferings([
          {
            id: '1',
            name: 'Hot Desk',
            slug: 'hot-desk',
            tag: 'Flexible Seating',
            description: 'Drop in and choose any open workspace. Ideal for freelancers, remote techies, and mobile professionals in Blue Area.',
            price_pkr: 25000,
            billing_period: '/month',
            capacity: '1 Person',
            shift_type: 'Day or Night',
            features: [
              'High-speed dual fiber internet',
              'Unlimited artisan tea & green tea',
              'Uninterrupted generator backup',
              'Female-friendly secure access',
              'Access to community events & lounge',
              'No lock-in contract'
            ],
            is_popular: false,
            is_active: true,
            display_order: 1
          },
          {
            id: '2',
            name: 'Dedicated Desk',
            slug: 'dedicated-desk',
            tag: 'Most Popular',
            description: 'Your own permanent desk reserved 24/7 with ergonomic chair, lockable pedestal, and meeting room credits.',
            price_pkr: 38000,
            billing_period: '/month',
            capacity: '1 Person',
            shift_type: '24/7 Access',
            features: [
              'Permanent reserved desk & locker',
              '24/7 access (Day & Night shifts)',
              '5 hours free meeting room credits',
              'Mailing address & courier handling',
              'Dedicated power strip with UPS backup',
              'Discounted podcast studio rates'
            ],
            is_popular: true,
            is_active: true,
            display_order: 2
          },
          {
            id: '3',
            name: 'Private Office',
            slug: 'private-office',
            tag: 'For Growing Teams',
            description: 'Fully serviced, lockable private cabins for 2 to 20 people with custom acoustic glass partitions and executive desks.',
            price_pkr: 120000,
            billing_period: '/month',
            capacity: '2 - 20 People',
            shift_type: '24/7 Access',
            features: [
              'Private sound-insulated office suite',
              'Company branding on cabin door',
              '15 hours monthly boardroom credits',
              '24/7 biometric keyless entry',
              'Complimentary executive coffee bar',
              'Daily housekeeping and sanitization'
            ],
            is_popular: false,
            is_active: true,
            display_order: 3
          },
          {
            id: '4',
            name: 'Meeting Room Only',
            slug: 'meeting-room',
            tag: 'Hourly',
            description: 'Modern presentation space with a 4K display, conference camera, audio, and whiteboard.',
            price_pkr: 2500,
            billing_period: '/hour',
            capacity: 'Up to 12 People',
            shift_type: 'Flexible Booking',
            features: [
              '4K presentation display',
              'Wireless screen casting',
              'Conference camera and audio',
              'Whiteboard and markers',
              'High-speed meeting WiFi'
            ],
            is_popular: false,
            is_active: true,
            display_order: 4
          },
          {
            id: '5',
            name: 'Shared Hall Day Pass',
            slug: 'shared-hall-day-pass',
            tag: 'Day Pass',
            description: 'A flexible daily workspace in our shared hall.',
            price_pkr: 2500,
            billing_period: '/day',
            capacity: '1 Person',
            shift_type: 'Day Shift',
            features: [
              'Shared coworking seating',
              'High-speed internet',
              'Tea and coffee',
              'Generator backup'
            ],
            is_popular: false,
            is_active: true,
            display_order: 5
          },
          {
            id: '6',
            name: 'Private Hall - Hourly',
            slug: 'private-hall-hourly',
            tag: 'Hourly',
            description: 'Private hall access for meetings, workshops, or small events.',
            price_pkr: 4500,
            billing_period: '/hour',
            capacity: 'Flexible Capacity',
            shift_type: 'Flexible Booking',
            features: [
              'Private hall access',
              'Presentation setup',
              'High-speed internet',
              'Flexible seating arrangement'
            ],
            is_popular: false,
            is_active: true,
            display_order: 6
          },
          {
            id: '7',
            name: 'Private Hall - Day Pass',
            slug: 'private-hall-day-pass',
            tag: 'Day Pass',
            description: 'Private hall access for a full day.',
            price_pkr: 10000,
            billing_period: '/day',
            capacity: 'Flexible Capacity',
            shift_type: 'Day Shift',
            features: ['Private hall access', 'Presentation setup', 'High-speed internet', 'Flexible seating arrangement'],
            is_popular: false,
            is_active: true,
            display_order: 7
          },
          {
            id: '8',
            name: 'Podcast Studio - No Equipment',
            slug: 'podcast-studio',
            tag: 'Studio Rental',
            description: 'Podcast studio access without equipment.',
            price_pkr: 9000,
            billing_period: '/session',
            capacity: 'Up to 4 Hosts',
            shift_type: 'Flexible Booking',
            features: ['Acoustically treated studio', 'Studio space only', 'No recording equipment included'],
            is_popular: false,
            is_active: true,
            display_order: 8
          },
          {
            id: '9',
            name: 'Podcast Studio - Equipment',
            slug: 'podcast-studio-equipment',
            tag: 'Audio + Video',
            description: 'Studio rental with equipment and audio/video recording.',
            price_pkr: 16000,
            billing_period: '/session',
            capacity: 'Up to 4 Hosts',
            shift_type: 'Flexible Booking',
            features: ['Recording equipment', 'Audio recording', 'Video recording', 'Acoustically treated studio'],
            is_popular: true,
            is_active: true,
            display_order: 9
          },
          {
            id: '10',
            name: 'Podcast Studio - Full Package',
            slug: 'podcast-studio-full-package',
            tag: 'Best Package',
            description: 'Full podcast production package with basic editing.',
            price_pkr: 21000,
            billing_period: '/session',
            capacity: 'Up to 4 Hosts',
            shift_type: 'Flexible Booking',
            features: ['Recording equipment', 'Audio/video recording', 'Basic editing', 'Acoustically treated studio'],
            is_popular: true,
            is_active: true,
            display_order: 10
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOfferings();
  }, [shiftFilter]);

  const calculateEstimate = () => {
    let rate = 38000;
    if (calcPlan === 'hot') rate = 25000;
    if (calcPlan === 'private') rate = 120000;
    return (calcSeats * rate).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      
      {/* Header Banner */}
      <section className="bg-[#0B0F19] text-white pt-24 pb-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00B87C]/20 border border-[#00B87C]/30 text-xs font-semibold text-[#00B87C] mb-4">
            Transparent PKR Pricing · No Hidden Lock-ins
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            Flexible Workspace Offerings
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From single hot desks to full private office suites and our signature 4K podcast studio, discover spaces tailored for your productivity in Blue Area, Islamabad.
          </p>

          {/* Shift Filter Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {['All', 'Day', 'Night', '24/7'].map((shift) => (
              <button
                key={shift}
                onClick={() => setShiftFilter(shift)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  shiftFilter === shift
                    ? 'bg-[#00B87C] text-white shadow-lg shadow-[#00B87C]/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/15'
                }`}
              >
                {shift === 'All' ? 'All Plans' : `${shift} Shift`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Offerings Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offerings.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl bg-white p-8 border transition-all duration-300 flex flex-col justify-between ${
                plan.is_popular
                  ? 'border-[#00B87C] ring-2 ring-[#00B87C]/20 shadow-xl relative'
                  : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3.5 left-8 px-3 py-1 bg-[#00B87C] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                  {plan.tag || 'Recommended'}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-600 font-semibold">
                    {plan.capacity}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-6 min-h-[36px]">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase">PKR</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                    {plan.slug === 'private-office'
                      ? '120,000 - 230,000'
                      : plan.price_pkr.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {plan.billing_period}
                  </span>
                </div>

                {/* Shift badge */}
                <div className="flex items-center gap-2 mb-5 text-xs text-[#00B87C] font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>{plan.shift_type}</span>
                </div>

                {/* Features List */}
                <ul className="space-y-3 mb-8 text-xs sm:text-sm text-gray-600">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#00B87C] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <Link
                to={`/contact?plan=${encodeURIComponent(plan.name)}#book-tour`}
                className={`w-full py-3.5 rounded-lg text-center font-bold text-xs uppercase tracking-wider transition-all block ${
                  plan.is_popular
                    ? 'bg-[#00B87C] hover:bg-[#009F6B] text-white shadow-md shadow-[#00B87C]/20'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                Book This Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Team Pricing Calculator */}
      <section className="py-20 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#00B87C] text-xs font-bold uppercase mb-2">
              <Calculator className="w-3.5 h-3.5" />
              <span>Budget Estimator</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Calculate Your Team's Monthly Investment
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto mt-2">
              Scale up or down without long lease commitments. All utilities, cleaning, and generator fuel included.
            </p>
          </div>

          <div className="bg-[#0B0F19] text-white rounded-2xl p-8 shadow-xl border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center text-sm font-semibold mb-2">
                    <span>Number of Team Members:</span>
                    <span className="text-[#00B87C] text-lg font-bold">{calcSeats} Seats</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={calcSeats}
                    onChange={(e) => setCalcSeats(Number(e.target.value))}
                    className="w-full accent-[#00B87C] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>1 Solo</span>
                    <span>10 Team</span>
                    <span>25 Enterprise</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Preferred Workspace Style:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'hot', label: 'Hot Desk' },
                      { id: 'dedicated', label: 'Dedicated' },
                      { id: 'private', label: 'Private Suite' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setCalcPlan(type.id as any)}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                          calcPlan === type.id
                            ? 'bg-[#00B87C] text-white border-[#00B87C]'
                            : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Result Summary */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center flex flex-col justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">
                    Estimated Monthly Cost
                  </span>
                  <div className="text-4xl font-extrabold text-[#00B87C] mb-2">
                    PKR {calculateEstimate()}
                  </div>
                  <span className="text-[11px] text-gray-400 block mb-6">
                    Inclusive of fiber, generator, tea/coffee, and conference credits
                  </span>
                </div>

                <Link
                  to="/contact#book-tour"
                  className="w-full py-3 bg-[#00B87C] hover:bg-[#009F6B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-[#00B87C]/25 transition-all"
                >
                  Schedule Tour For This Team
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Podcast Studio Spotlight (Unique Differentiator) */}
      <section className="py-20 bg-gradient-to-br from-[#0B0F19] to-[#121826] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00B87C]/20 text-[#00B87C] text-xs font-bold uppercase mb-4 border border-[#00B87C]/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Islamabad's Unique Differentiator</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                Broadcast Grade <br />
                <span className="text-[#00B87C]">Podcast & Video Studio.</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                Record video podcasts, executive fireside chats, and online courses with pristine acoustic isolation. Equipped with Shure SM7B mics, 4K Sony cinema cameras, and Blackmagic live switcher.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs mb-8">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-white mb-1">4 Microphones</div>
                  <div className="text-gray-400">Shure SM7B broadcast quality with cloudlifters</div>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-lg font-bold text-white mb-1">4K Recording</div>
                  <div className="text-gray-400">Multi-cam switcher with ISO recording</div>
                </div>
              </div>
              <Link
                to="/contact?plan=Podcast+Studio#book-tour"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#00B87C] hover:bg-[#009F6B] text-white font-bold text-sm rounded-lg shadow-xl shadow-[#00B87C]/25 transition-all"
              >
                <span>Reserve Studio Time</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/15">
              <img
                src="/podcast_room.jpeg"
                alt="The Roarworks Podcast Studio Islamabad"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <WhatsAppFloat />
    </div>
  );
};
