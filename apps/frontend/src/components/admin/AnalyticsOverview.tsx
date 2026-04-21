import React, { useEffect, useState } from 'react';
import AnalyticsCard from './AnalyticsCard';
import AnalyticsChart from './AnalyticsChart';
import AnalyticsTable from './AnalyticsTable';
import analyticsConfig from '../../config/analytics-config.json';
import heroConfig from '../../config/hero.json';

const IconRenderer: React.FC<{ icon: string }> = ({ icon }) => {
  switch (icon) {
    case 'eye': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>;
    case 'click': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z"/></svg>;
    case 'modal': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>;
    case 'check': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>;
    default: return null;
  }
};

const AnalyticsOverview: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [ctaClicks, setCtaClicks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const passcode = localStorage.getItem('admin_passcode') || '';
        const headers = { 'x-admin-passcode': passcode };
        
        const [sumRes, pvRes, ctaRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/admin/analytics/summary', { headers }),
          fetch('http://localhost:3001/api/v1/admin/analytics/pageviews', { headers }),
          fetch('http://localhost:3001/api/v1/admin/analytics/cta', { headers })
        ]);

        if (sumRes.ok) setStats(await sumRes.json());
        if (pvRes.ok) setPageViews(await pvRes.json());
        if (ctaRes.ok) setCtaClicks(await ctaRes.json());
        
      } catch (error) {
        console.error('Failed to load analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (heroConfig.flags?.analytics_dashboard_enabled === false) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-bold text-gray-400">Dashboard is currently disabled.</h2>
      </div>
    );
  }

  if (loading) return (
    <div className="py-20 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  if (!stats || (stats.totalPageViews === 0 && stats.totalLeads === 0)) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-4xl">📊</div>
        <h2 className="text-xl font-bold text-gray-900">No Analytics Data Available</h2>
        <p className="text-gray-400 max-w-xs mx-auto">Start interacting with the homepage and hero section to see live engagement telemetry.</p>
      </div>
    );
  }

  const chartData = [
    { label: "Visibility", value: 100, color: "bg-gray-900" },
    { 
      label: "Engagement", 
      value: stats?.totalPageViews ? Math.round((stats.totalCTAClicks / stats.totalPageViews) * 100) : 0, 
      color: "bg-gray-400" 
    },
    { 
      label: "Capture", 
      value: stats?.conversionRate ? Math.round(stats.conversionRate) : 0, 
      color: "bg-gray-200" 
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">ANALYTICS</span>
            <h2 className="dashboard-title">Live Performance</h2>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-[9px] font-bold text-gray-900 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Supabase: Active
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {analyticsConfig.metrics.map(metric => (
            <AnalyticsCard 
              key={metric.id}
              label={metric.label}
              value={stats ? (metric.id === 'totalLeads' ? stats.totalLeads : stats[metric.id]) : 0}
              description={metric.description}
              icon={<IconRenderer icon={metric.icon} />}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart 
              title="Traffic-to-Lead Distribution"
              data={chartData}
            />
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-center text-center space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency Goal</span>
            <div className="text-6xl font-black text-gray-900 tracking-tighter italic">
              {stats?.conversionRate || 0}%
            </div>
            <p className="text-xs text-gray-500 font-medium px-4">Your current visitor-to-lead capture efficiency.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsTable 
            title="Page Traffic (per URL)"
            headers={["URL", "Views"]}
            data={pageViews.map((pv: any) => ({ label: pv.url, count: pv.count }))}
          />
          <AnalyticsTable 
            title="CTA Engagement (per Action)"
            headers={["Action ID", "Clicks"]}
            data={ctaClicks.map((cta: any) => ({ label: cta.ctaId, count: cta.count }))}
          />
        </div>
    </div>
  );
};

export default AnalyticsOverview;
