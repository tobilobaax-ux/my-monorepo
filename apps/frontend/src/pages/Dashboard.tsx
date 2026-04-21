import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicRenderer from '../components/DynamicRenderer';
import Modal from '../components/Modal';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';
import dashboardConfig from '../config/dashboard.json';

interface DashboardModule {
  id: number;
  componentType: string;
  title: string;
  description?: string;
  content?: string;
  onClickType?: string;
}

const Dashboard: React.FC = () => {
  const { isAuthorized, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });

  useEffect(() => {
    if (!isLoading && !isAuthorized) navigate('/login');
  }, [isAuthorized, isLoading, navigate]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      trackEvent('analytics_dashboard_view', { source: 'sidebar_click' });
    }
  }, [activeTab]);

  const handleManualRefresh = () => {
    trackEvent('analytics_refresh_click', { user: 'admin' });
    window.location.reload();
  };

  const handleModuleClick = (module: DashboardModule) => {
    if (module.onClickType === 'modal') {
      setModalContent({ title: module.title, content: module.description || '' });
      setModalOpen(true);
    }
  };

  if (isLoading || !isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-gray-100 bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-black text-xs">TA</div>
          <h1 className="text-sm font-black italic tracking-tighter text-gray-900 uppercase">
            {dashboardConfig.roadmap.hubLabel}
          </h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {dashboardConfig.sidebar.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                   <path d={item.iconPath} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {dashboardConfig.roadmap.logoutLabel}
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <h2 className="text-lg font-extrabold italic tracking-tighter text-gray-900 uppercase">
              {dashboardConfig.sidebar.find(i => i.id === activeTab)?.label}
            </h2>
            {activeTab === 'analytics' && (
              <button 
                onClick={handleManualRefresh}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-900 transition-all active:scale-95"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                {dashboardConfig.roadmap.syncLabel}
              </button>
            )}
          </div>
        </header>

        <main className="p-8 sm:p-12 overflow-y-auto">
          {activeTab === 'analytics' ? (
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
              {dashboardConfig.modules.map((module) => (
                <DynamicRenderer
                  key={module.id}
                  componentName={module.componentType}
                  props={{ ...module, onClick: () => handleModuleClick(module as any) }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in-95 duration-700 text-center">
               <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-2xl flex items-center justify-center mb-6">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                   <path d={dashboardConfig.sidebar.find(i => i.id === activeTab)?.iconPath || ''} strokeLinecap="round" strokeLinejoin="round" />
                 </svg>
               </div>
               <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">
                 {dashboardConfig.roadmap.title}
               </h3>
               <p className="text-gray-400 text-sm font-medium mt-2 max-w-sm mx-auto">
                 {dashboardConfig.roadmap.description}
               </p>
            </div>
          )}
        </main>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalContent.title}>
        <p className="text-gray-600 leading-relaxed font-medium">{modalContent.content}</p>
      </Modal>
    </div>
  );
};

export default Dashboard;
