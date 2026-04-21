import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100-screen-64px)] bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 flex flex-col p-6 space-y-8">
        <div>
          <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-6">Operations</h2>
          <nav className="flex flex-col space-y-1">
            <NavLink 
              to="/admin/analytics" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 3v18h18" /><path d="M18 9l-5 5-2-2-5 5" />
              </svg>
              Analytics
            </NavLink>
            <NavLink 
              to="/admin/leads" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all opacity-50 cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Leads Feed
            </NavLink>
          </nav>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-50">
          <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest text-center mt-4">
            Supabase Cluster: Active
          </p>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50/30">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
