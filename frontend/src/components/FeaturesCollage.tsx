import React from 'react';
import { Clock, Coffee, Gamepad2 } from 'lucide-react';

export const FeaturesCollage: React.FC = () => {
  return (
    <section className="py-24 bg-[#0B0F19] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Collage of Rounded Overlapping Photos matching Design.png */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[480px] h-[480px]">
              {/* Main Center Image */}
              <div               className="absolute left-8 top-10 w-[72%] h-[80%] rounded-2xl overflow-hidden shadow-2xl z-10 border-4 border-[#1F2937]">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                  alt="Coworking Collaboration at The Roarworks"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Top Left Floating Image */}
              <div               className="absolute -top-3 -left-4 w-[42%] h-[40%] rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-[#1F2937] transform -rotate-2 hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Remote professional at The Roarworks"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom Right Floating Image (Podcast/Audio/Tech focus) */}
              <div               className="absolute -bottom-4 right-0 w-[46%] h-[46%] rounded-2xl overflow-hidden shadow-2xl z-20 border-4 border-[#1F2937] transform rotate-2 hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=500&q=80"
                  alt="Podcast creator studio"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative Emerald Accent Badge */}
              <div className="absolute bottom-16 -left-6 z-30 bg-[#00B87C] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold">
                <span>99.9% Fiber Uptime</span>
              </div>
            </div>
          </div>

          {/* Right: Content & 3 Icon Cards matching Design.png */}
          <div className="lg:col-span-6">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white tracking-tight leading-[1.18] mb-4">
                Best creative working environments that suits your business.
              </h2>
              <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-10">
                Whether you need a dedicated desk for high-intensity engineering, a sound-treated studio for broadcast podcasts, or a secure private suite for your team in Blue Area, Islamabad.
              </p>

              {/* Feature 1: Open 24 hours */}
              <div className="flex items-start gap-4 mb-7 group">
                <div className="w-12 h-12 rounded-xl bg-[#00B87C] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#00B87C]/20 group-hover:scale-105 transition-transform">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Open 24 hours
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Day & night shifts tailored for overseas US/UK clients, complete with dual heavy backup generators and biometric entry.
                  </p>
                </div>
              </div>

              {/* Feature 2: Free Snack & Drink */}
              <div className="flex items-start gap-4 mb-7 group">
                <div className="w-12 h-12 rounded-xl bg-[#00B87C] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#00B87C]/20 group-hover:scale-105 transition-transform">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Free Snack & Drink
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Freshly brewed roast coffee, signature green tea, clean RO water, and snack pantry available round the clock.
                  </p>
                </div>
              </div>

              {/* Feature 3: Enjoy Game Zone & Podcast Studio */}
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-[#00B87C] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#00B87C]/20 group-hover:scale-105 transition-transform">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    Enjoy Game Zone
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                    Relax between sprint reviews with console gaming, soundproof creator booths, and community networking lounges.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
