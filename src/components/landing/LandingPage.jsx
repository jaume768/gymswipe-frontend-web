'use client';

import React from 'react';
import HeroSection from './HeroSection';
import InfoSection from './InfoSection';
import ReviewsSection from './ReviewsSection';
import DownloadSection from './DownloadSection';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <InfoSection />
      <ReviewsSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
