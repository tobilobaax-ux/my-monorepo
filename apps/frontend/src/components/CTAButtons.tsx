import React from 'react';

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

interface CTAButtonsProps {
  onWorkClick: () => void;
  onConnectClick: () => void;
  workLabel: string;
  connectLabel: string;
}

const CTAButtons: React.FC<CTAButtonsProps> = ({ 
  onWorkClick, 
  onConnectClick, 
  workLabel, 
  connectLabel 
}) => {
  return (
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
        className="btn-ghost group"
        id="cta-connect-with-me"
      >
        <LinkIcon />
        {connectLabel}
      </button>
    </div>
  );
};

export default CTAButtons;
