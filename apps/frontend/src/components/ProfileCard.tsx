import React, { useState } from 'react';

import { ProfileCardProps } from '../types/hero';

const FALLBACK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f1f5f9'/%3E%3Ccircle cx='100' cy='80' r='36' fill='%23cbd5e1'/%3E%3Cellipse cx='100' cy='170' rx='56' ry='40' fill='%23cbd5e1'/%3E%3C/svg%3E`;

const ProfileCard: React.FC<ProfileCardProps> = ({ name, role, image, stats }) => {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto group">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gray-200 transition-all duration-500 overflow-hidden flex flex-col">
        
        {/* Top Header Background / Image edge-to-edge */}
        <div className="relative h-80 bg-slate-50 w-full overflow-hidden">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover object-center grayscale opacity-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
            onError={() => setImgSrc(FALLBACK)}
          />
          {/* Gradient Overlay to fade into card */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-100" />
        </div>
        
        <div className="px-8 pb-10 flex flex-col items-center -mt-8 relative z-10">
          
          {/* Identity */}
          <h3 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{name}</h3>
          <p className="text-sm font-semibold text-gray-500 mb-8 tracking-wide uppercase">{role}</p>

          {/* Stats row */}
          <div className="w-full grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                <span className="text-[10px] text-gray-500 font-semibold mt-1 uppercase tracking-widest">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
