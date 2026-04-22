import React, { useState } from 'react';
import HeroText from './HeroText';
import ProfileCard from './ProfileCard';
import WorkModal from './modals/WorkModal';
import ConnectModal from './modals/ConnectModal';
import { trackEvent } from '../utils/analytics';
import { HeroConfig } from '../types/hero';

interface HeroSectionProps {
  externalConfig: HeroConfig | null;
}

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

const HeroSection: React.FC<HeroSectionProps> = ({ externalConfig }) => {
  const [workOpen, setWorkOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  const handleWorkClick = () => {
    setWorkOpen(true);
    trackEvent('cta_work_click', { action: 'open_modal' });
  };

  const handleConnectClick = () => {
    setConnectOpen(true);
    trackEvent('cta_connect_click', { action: 'open_modal' });
  };

  return (
    <section className="relative bg-[#fafafa] flex items-center py-16 lg:py-24 overflow-hidden min-h-[calc(100vh-64px)]">
      
      {/* Rough / TV Static Noise Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.25] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col justify-center">
            {!externalConfig ? (
              <HeroSkeleton />
            ) : (
              <HeroText
                badge={externalConfig.heroText.badge}
                heading={externalConfig.heroText.heading}
                subheading={externalConfig.heroText.subheading}
                intro={externalConfig.heroText.intro}
                onWorkClick={handleWorkClick}
                onConnectClick={handleConnectClick}
                workLabel={externalConfig.modals.work.label}
                connectLabel={externalConfig.modals.connect.label}
              />
            )}
          </div>

          {/* Right Column: Visual */}
          <div className="flex justify-center lg:justify-end items-center mt-12 lg:mt-0">
            {!externalConfig ? (
              <div className="w-full max-w-md aspect-[4/5] bg-slate-100 rounded-3xl animate-pulse" />
            ) : (
              <ProfileCard
                name={externalConfig.profile.name}
                role={externalConfig.profile.role}
                image={externalConfig.profile.image}
                stats={externalConfig.profile.stats}
                funFacts={externalConfig.profile.funFacts}
              />
            )}
          </div>
          
        </div>
      </div>

      {/* Modals with dynamic config */}
      {externalConfig && (
        <>
          <WorkModal 
            isOpen={workOpen} 
            onClose={() => setWorkOpen(false)} 
            config={externalConfig.modals.work}
          />
          <ConnectModal 
            isOpen={connectOpen} 
            onClose={() => setConnectOpen(false)} 
            config={externalConfig.modals.connect}
          />
        </>
      )}
    </section>
  );
};

export default HeroSection;
