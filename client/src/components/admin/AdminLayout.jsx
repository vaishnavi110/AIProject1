import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col md:flex-row">
      {/* Mobile Top Header for Admin */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30">
        <span className="font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
          Admin Portal
        </span>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
          aria-label="Toggle admin sidebar"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0 min-h-screen">
        <Sidebar className="sticky top-0 h-screen" />
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <Sidebar
            className="relative z-10 w-72 h-full shadow-2xl"
            onItemClick={() => setMobileSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Admin Content Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
