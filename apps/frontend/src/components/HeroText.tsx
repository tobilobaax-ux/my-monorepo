import React from 'react';

import { HeroTextProps } from '../types/hero';

const HeroText: React.FC<HeroTextProps> = ({ badge, heading, subheading, intro }) => {
  const parts = heading.split(',');
  const firstPart = parts[0]?.trim() ?? heading;
  const secondPart = parts.slice(1).join(',').trim();

  return (
    <div className="flex flex-col space-y-8">
      {/* Badge (Dynamic) */}
      {badge && (
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 tracking-wide uppercase shadow-sm">
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
    </div>
  );
};

export default HeroText;
