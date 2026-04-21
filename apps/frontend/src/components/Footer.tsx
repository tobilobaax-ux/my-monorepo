import React, { useState, useEffect } from 'react';
import { FooterConfig } from '../types/hero';

const Footer: React.FC = () => {
  const [config, setConfig] = useState<FooterConfig | null>(null);

  useEffect(() => {
    import('../config/hero.json').then((data) => {
       if (data.default && data.default.footer) {
          setConfig(data.default.footer);
       }
    });
  }, []);

  const year = new Date().getFullYear();
  
  if (!config) return null;

  return (
    <footer className="relative bg-[#fafafa] border-t border-gray-100 py-8 overflow-hidden">
      {/* Subtle Noise Overlay to match Hero rhythm */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.1] pointer-events-none mix-blend-multiply" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='1.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          
          {/* Copyright Section */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-[11px] font-medium text-gray-400 mt-2">
              © {year} {config.owner}. All Rights Reserved.
            </p>
          </div>


          {/* Version / Technical Stamp */}
          <div className="hidden lg:block">
            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-[0.4em] select-none">
              Build. {new Date().toISOString().split('T')[0].replace(/-/g, '.')}
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
