import React from 'react';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ label, value, description, icon }) => (
  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group">
    <div className="flex justify-between items-start mb-6">
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <span className="analytics-card-title">{label}</span>
    </div>
    <div className="space-y-1">
      <h3 className="analytics-metric-value">{value}</h3>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{description}</p>
    </div>
  </div>
);

export default AnalyticsCard;
