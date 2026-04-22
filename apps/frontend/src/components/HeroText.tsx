import React from 'react';
import { ExtendedHeroTextProps } from '../types/hero';
import CTAButtons from './CTAButtons';

const HeroText: React.FC<ExtendedHeroTextProps> = ({ 
  badge, 
  heading = '', 
  subheading, 
  intro, 
  onWorkClick, 
  onConnectClick,
  workLabel = 'Work With Me',
  connectLabel = 'Connect With Me'
}) => {
  const parts = heading.split(',');
  const firstPart = parts[0]?.trim() ?? heading;
  const secondPart = parts.slice(1).join(',').trim();

  return (
    <div className="flex flex-col space-y-8">
      {/* Badge (Dynamic) */}
      {badge && (
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-700 tracking-widest uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {badge}
          </span>
        </div>
      )}

      {/* Heading */}
      <div className="animate-fade-up animate-fade-up-delay-1">
        <h1 className="hero-heading">
          <span className="block">
            {secondPart ? <>{firstPart},</> : firstPart}
          </span>
          {secondPart && (
            <span className="block text-gray-500 mt-2">{secondPart}</span>
          )}
        </h1>
      </div>

      {/* Subheading */}
      <div className="animate-fade-up animate-fade-up-delay-2">
        <h2 className="hero-subheading">
          {subheading}
        </h2>
      </div>

      {/* Intro */}
      <div className="animate-fade-up animate-fade-up-delay-3">
        <p className="hero-body">
          {intro}
        </p>
      </div>

      {/* CTA Buttons */}
      <CTAButtons 
        onWorkClick={onWorkClick || (() => {})} 
        onConnectClick={onConnectClick || (() => {})} 
        workLabel={workLabel} 
        connectLabel={connectLabel} 
      />
    </div>
  );
};

export default HeroText;
