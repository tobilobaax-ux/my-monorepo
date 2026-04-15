import React from 'react';
import { HeroTextProps } from '../types/hero';

const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const LinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

interface ExtendedHeroTextProps extends HeroTextProps {
  onWorkClick?: () => void;
  onConnectClick?: () => void;
  workLabel?: string;
  connectLabel?: string;
}

const HeroText: React.FC<ExtendedHeroTextProps> = ({ 
  badge, 
  heading, 
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
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight leading-[1.05] text-gray-900">
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
        <h2 className="text-xl md:text-2xl font-medium text-gray-500 tracking-tight">
          {subheading}
        </h2>
      </div>

      {/* Intro */}
      <div className="animate-fade-up animate-fade-up-delay-3">
        <p className="text-base md:text-xl text-gray-500 max-w-2xl leading-relaxed font-normal">
          {intro}
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="animate-fade-up animate-fade-up-delay-4 flex flex-wrap gap-4 pt-4">
        <button
          onClick={onWorkClick}
          className="btn-primary group"
          id="cta-work-with-me"
        >
          {workLabel}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight />
          </span>
        </button>

        <button
          onClick={onConnectClick}
          className="btn-ghost"
          id="cta-connect-with-me"
        >
          <LinkIcon />
          {connectLabel}
        </button>
      </div>
    </div>
  );
};

export default HeroText;
