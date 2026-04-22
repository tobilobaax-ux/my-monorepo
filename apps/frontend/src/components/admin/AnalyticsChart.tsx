import React from 'react';

interface AnalyticsChartProps {
  data: { label: string; value: number; color: string }[];
  title: string;
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, title }) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
      <div className="mb-8">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Performance Trend</h4>
        <p className="text-gray-900 font-bold">{title}</p>
      </div>
      
      <div className="space-y-6">
        {data.map((item) => (
          <div key={item.label} className="space-y-2 group/bar">
            <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest transition-colors group-hover/bar:text-gray-900">
              <span>{item.label}</span>
              <span className="opacity-0 group-hover/bar:opacity-100 transition-opacity flex items-center gap-1">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L24 24H0L12 0Z"/></svg>
                {item.value}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden border border-transparent group-hover/bar:border-gray-100 transition-all">
              <div 
                className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                style={{ width: `${item.value}%` }} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Decorative SVG Trend Line (Visual only) */}
      <div className="mt-10 h-20 w-full relative overflow-hidden rounded-xl bg-gray-50/50">
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
          <path 
            d="M0,80 Q50,70 100,85 T200,60 T300,75 T400,40 L400,100 L0,100 Z" 
            fill="url(#gradient)" 
            className="opacity-20"
          />
          <path 
            d="M0,80 Q50,70 100,85 T200,60 T300,75 T400,40" 
            fill="none" 
            stroke="#111827" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#111827" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default AnalyticsChart;
