import React, { useEffect, useState, Suspense, lazy } from 'react';
import AnalyticsCard from './AnalyticsCard';
import analyticsConfig from '../../config/analytics-config.json';
import heroConfig from '../../config/hero.json';
import { fetchAdminStats, fetchPageViewMetrics, fetchCTAMetrics } from '../../utils/api';

const AnalyticsChart = lazy(() => import('./AnalyticsChart'));
const AnalyticsTable = lazy(() => import('./AnalyticsTable'));

const IconRenderer: React.FC<{ icon: string }> = ({ icon }) => {
  const path = (analyticsConfig.iconLibrary as any)[icon];
  if (!path) return null;
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
        const [statsData, pvData, ctaData] = await Promise.all([
          fetchAdminStats(passcode),
          fetchPageViewMetrics(passcode),
          fetchCTAMetrics(passcode)
        ]);
        setStats(statsData);
        setPageViews(pvData);
        setCtaClicks(ctaData);
      } catch (error) {
        console.error('Data sync failed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, analyticsConfig.settings.refreshInterval);
    return () => clearInterval(interval);
  }, []);

  if (heroConfig.flags?.analytics_dashboard_enabled === false) {
    return <div className="py-20 text-center"><h2 className="text-xl font-bold text-gray-400">{analyticsConfig.flags.disabledMessage}</h2></div>;
  }

  if (loading) return <div className="py-20 flex items-center justify-center"><div className="w-8 h-8 border-4 border-gray-100 border-t-gray-900 rounded-full animate-spin" /></div>;

  if (!stats || (stats.totalPageViews === 0 && stats.totalLeads === 0)) {
    const { icon, title, description } = analyticsConfig.flags.emptyState;
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-4xl">{icon}</div>
        <h2 className="text-xl font-bold text-gray-900 font-mono tracking-tighter uppercase">{title}</h2>
        <p className="text-gray-400 max-w-xs mx-auto text-xs font-bold leading-relaxed">{description}</p>
      </div>
    );
  }

  const getChartData = (chartId: string) => {
    const chartConfig = analyticsConfig.charts.find(c => c.id === chartId);
    if (!chartConfig) return [];
    return chartConfig.items.map(item => {
      let value = 0;
      if (item.baseMetric) {
        value = Math.round(Number(stats[item.baseMetric]) || 0);
        if (item.baseMetric === 'totalPageViews') value = 100;
      } else if (item.compareMetric && item.toMetric) {
        const dividend = Number(stats[item.compareMetric]) || 0;
        const divisor = Number(stats[item.toMetric]) || 1;
        value = Math.round((dividend / divisor) * 100);
      }
      return { label: item.label, value, color: item.color };
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">{analyticsConfig.settings.subtitle}</span>
            <h2 className="dashboard-title uppercase tracking-tighter italic">{analyticsConfig.settings.title}</h2>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-[9px] font-black text-gray-900 uppercase tracking-widest">
            <span className={`w-2 h-2 rounded-full ${analyticsConfig.settings.statusIndicator.color} animate-pulse`} />
            {analyticsConfig.settings.statusIndicator.label}: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {analyticsConfig.metrics.map(metric => (
            <AnalyticsCard 
              key={metric.id}
              label={metric.label}
              value={stats[metric.id] || 0}
              description={metric.description}
              icon={<IconRenderer icon={metric.icon} />}
            />
          ))}
        </div>

        {/* Charts & Efficiency Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Suspense fallback={<div className="lg:col-span-2 h-64 bg-gray-50 rounded-3xl animate-pulse" />}>
            {analyticsConfig.charts.map(chart => (
              <div key={chart.id} className="lg:col-span-2">
                <AnalyticsChart title={chart.title} data={getChartData(chart.id)} />
              </div>
            ))}
          </Suspense>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col justify-center text-center space-y-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{analyticsConfig.settings.efficiencyLabel}</span>
            <div className="text-6xl font-black text-gray-900 tracking-tighter italic">{stats.conversionRate}%</div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-4">{analyticsConfig.settings.scoreLabel}</p>
          </div>
        </div>

        {/* Data Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<div className="lg:col-span-2 h-40 bg-gray-50 rounded-3xl animate-pulse" />}>
            {analyticsConfig.tables.map(table => (
              <AnalyticsTable 
                key={table.id}
                title={table.title}
                headers={table.headers}
                data={(table.dataSource === 'pageViews' ? pageViews : ctaClicks).map((row: any) => ({
                  label: row.url || row.ctaId || 'Anonymous Action',
                  count: row.count || 0
                }))}
              />
            ))}
          </Suspense>
        </div>
    </div>
  );
};

export default AnalyticsOverview;
