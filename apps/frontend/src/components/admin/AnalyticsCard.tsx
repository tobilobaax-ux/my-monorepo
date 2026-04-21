import React from 'react';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ label, value, description, icon }) => (
  <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-400 p-2 bg-gray-50 rounded-lg group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
        {icon}
      </span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <div className="space-y-1">
      <h3 className="text-3xl font-black text-gray-900 tracking-tighter">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </h3>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
    </div>
  </div>
);

export default AnalyticsCard;
