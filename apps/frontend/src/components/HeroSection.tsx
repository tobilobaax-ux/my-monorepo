import React, { useState, useEffect } from 'react';
import HeroText from './HeroText';
import ProfileCard from './ProfileCard';

import { HeroConfig } from '../types/hero';

const HeroSkeleton = () => (
  <div className="animate-pulse space-y-8">
    <div className="w-32 h-6 bg-slate-200 rounded-full" />
    <div className="space-y-4">
      <div className="h-16 bg-slate-200 rounded-2xl w-4/5" />
      <div className="h-16 bg-slate-200 rounded-2xl w-2/3" />
    </div>
    <div className="h-8 bg-slate-200 rounded-xl w-1/2" />
    <div className="h-24 bg-slate-200 rounded-2xl w-full max-w-lg" />
  </div>
);

const HeroSection: React.FC = () => {
  const [config, setConfig] = useState<HeroConfig | null>(null);

  useEffect(() => {
    import('../config/hero.json').then((data) => setConfig(data.default as HeroConfig));
  }, []);

  return (
    <section className="relative bg-[#fafafa] min-h-[calc(100vh-64px)] flex items-center py-16 lg:py-24 overflow-hidden">
      
      {/* Rough / TV Static Noise Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10"> 
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col justify-center">
            {!config ? (
              <HeroSkeleton />
            ) : (
              <HeroText
                badge={config.heroText.badge}
                heading={config.heroText.heading}
                subheading={config.heroText.subheading}
                intro={config.heroText.intro}
              />
            )}
          </div>

          {/* Right Column: Visual */}
          <div className="flex justify-center lg:justify-end items-center mt-12 lg:mt-0">
            {!config ? (
              <div className="w-full max-w-md aspect-[4/5] bg-slate-100 rounded-3xl animate-pulse" />
            ) : (
              <ProfileCard
                name={config.profile.name}
                role={config.profile.role}
                image={config.profile.image}
                stats={config.profile.stats}
              />
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
