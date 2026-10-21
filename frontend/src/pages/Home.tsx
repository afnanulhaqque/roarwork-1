import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturesCollage } from '../components/FeaturesCollage';
import { TourBookingWidget } from '../components/TourBookingWidget';
import { Testimonials } from '../components/Testimonials';
import { SpaceOverview } from '../components/SpaceOverview';
import { BlogPreview } from '../components/BlogPreview';
import { Newsletter } from '../components/Newsletter';
import { WhatsAppFloat } from '../components/WhatsAppFloat';

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Hero />
      <FeaturesCollage />
      <TourBookingWidget />
      <Testimonials />
      <SpaceOverview />
      <BlogPreview />
      <Newsletter />
      <WhatsAppFloat />
    </div>
  );
};
