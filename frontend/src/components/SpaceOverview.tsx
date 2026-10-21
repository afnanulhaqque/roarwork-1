import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export const SpaceOverview: React.FC = () => {
  const rooms = [
    {
      id: 1,
      title: 'Space Room #1',
      subtitle: 'Open Plan Hot Desking',
      image: '/office.jpeg',
      description: 'Spacious collaborative hot desks with abundant daylight, plant life, and ergonomic task seating.',
    },
    {
      id: 2,
      title: 'Space Room #2',
      subtitle: 'Dedicated Workstations',
      image: '/Workstations.jpeg',
      description: 'Permanent reserved desks with locking pedestals, dual monitors support, and clean cable trays.',
    },
    {
      id: 3,
      title: 'Space Room #3',
      subtitle: 'Executive Boardroom',
      image: '/meeting_room.png',
      description: '12-seat executive conference room with 65-inch 4K wireless presentation display, whiteboard, and Margalla Hills views.',
    },
    {
      id: 4,
      title: 'Space Room #4',
      subtitle: '4K Broadcast Podcast Studio',
      image: '/podcast_room.jpeg',
      description: 'Fully isolated creator room with 4x Shure SM7B broadcast microphones, 4K camera switching, and acoustic isolation.',
    },
    {
      id: 5,
      title: 'Space Room #5',
      subtitle: 'Private Team Cabin',
      image: '/space_room.jpeg',
      description: 'Acoustic glass-enclosed team suites with biometric locks, whiteboards, and customizable layouts.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(2); // Default to room #3 matching Design.png!

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? rooms.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === rooms.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          Space Overview
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
          Take a look inside our modern facilities designed to elevate your work, meetings, and digital media production.
        </p>
      </div>

      {/* Horizontal Carousel Container matching Design.png */}
      <div className="relative max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 py-4">
          {rooms.map((room, idx) => {
            const isCenter = idx === activeIndex;
            return (
              <div
                key={room.id}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-500 cursor-pointer rounded-2xl overflow-hidden shrink-0 ${
                  isCenter
                    ? 'w-72 sm:w-96 h-80 sm:h-96 shadow-2xl scale-105 border-4 border-[#00B87C] z-20'
                    : 'w-44 sm:w-56 h-60 sm:h-72 opacity-60 hover:opacity-90 scale-95 z-10 hidden sm:block'
                }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={room.image}
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 text-left">
                    <span className="text-xs text-[#00B87C] font-semibold uppercase tracking-wider">
                      {room.subtitle}
                    </span>
                    <h3 className="text-lg font-bold text-white">
                      {room.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Highlighted Room Title in Green matching Design.png */}
        <div className="text-center mt-8">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#00B87C] tracking-tight">
            {rooms[activeIndex].title}
          </h3>
          <p className="text-sm text-gray-600 max-w-md mx-auto mt-2">
            {rooms[activeIndex].description}
          </p>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-gray-100 hover:bg-[#00B87C] hover:text-white text-gray-700 transition-colors shadow-sm"
              aria-label="Previous space"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {rooms.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? 'w-8 bg-[#00B87C]' : 'w-2 bg-gray-300'
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-gray-100 hover:bg-[#00B87C] hover:text-white text-gray-700 transition-colors shadow-sm"
              aria-label="Next space"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
