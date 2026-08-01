import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-800 font-sans relative">
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop & Mobile */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-40 transform transition-transform duration-300' : 'relative z-10'}
        ${isMobile && !mobileOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        <Sidebar 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isMobile={isMobile} 
          onClose={() => setMobileOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header 
          isMobile={isMobile} 
          onToggleMobileMenu={() => setMobileOpen(true)} 
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col justify-between">
          <div className="w-full flex-1 max-w-screen-2xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
