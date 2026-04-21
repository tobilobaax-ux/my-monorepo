import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicRenderer from '../components/DynamicRenderer';
import Modal from '../components/Modal';
import { trackEvent } from '../utils/analytics';
import { useAuth } from '../context/AuthContext';

interface DashboardConfig {
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
  const [sections, setSections] = useState<DashboardConfig[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', content: '' });
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    if (!isLoading && !isAuthorized) navigate('/login');
    if (isAuthorized) {
      import('../config/dashboard.json').then((data) => setSections(data.default));
    }
  }, [isAuthorized, isLoading, navigate]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      trackEvent('analytics_dashboard_view', { source: 'sidebar_click' });
    }
  }, [activeTab]);

  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { id: 'listings', label: 'Listings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg> },
    { id: 'bookings', label: 'Bookings', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
    { id: 'analytics', label: 'Analytics', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { id: 'finance', label: 'Finance', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  ];

  const handleManualRefresh = () => {
    trackEvent('analytics_refresh_click', { user: 'admin' });
    window.location.reload();
  };

  const handleSectionClick = (section: DashboardConfig) => {
    if (section.onClickType === 'modal') {
      setModalContent({ title: section.title, content: section.description || '' });
      setModalOpen(true);
    }
  };

  if (isLoading || !isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      <aside className="w-64 border-r border-gray-100 bg-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-black text-xs">TX</div>
          <h1 className="text-sm font-black italic tracking-tighter text-gray-900 uppercase">Admin Hub</h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                  : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-500 hover:bg-red-50 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <h2 className="text-lg font-extrabold italic tracking-tighter text-gray-900 uppercase">
              {menuItems.find(i => i.id === activeTab)?.label}
            </h2>
            {activeTab === 'analytics' && (
              <button 
                onClick={handleManualRefresh}
                className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 text-[9px] font-black uppercase tracking-widest text-gray-900 transition-all active:scale-95"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Sync Data
              </button>
            )}
          </div>
        </header>

        <main className="p-8 sm:p-12 overflow-y-auto">
          {activeTab === 'analytics' ? (
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8">
              {sections.map((section) => (
                <DynamicRenderer
                  key={section.id}
                  componentName={section.componentType}
                  props={{ ...section, onClick: () => handleSectionClick(section) }}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 animate-in fade-in zoom-in-95 duration-700">
               <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-2xl flex items-center justify-center mb-6">
                  {menuItems.find(i => i.id === activeTab)?.icon}
               </div>
               <h3 className="text-2xl font-black italic tracking-tighter text-gray-900 uppercase">Coming Soon</h3>
               <p className="text-gray-400 text-sm font-medium mt-2">Section: {activeTab} is currently in the Week 2 development roadmap.</p>
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
