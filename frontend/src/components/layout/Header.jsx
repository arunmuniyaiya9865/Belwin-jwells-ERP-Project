import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Building2, Menu, X, Gem } from 'lucide-react';
import UserProfile from './UserProfile';

const BRANCHES = ['Head Office', 'Trichy', 'Dindigul', 'Karur', 'Pudukkottai', 'Namakkal'];

const Header = ({ isMobile, onToggleMobileMenu }) => {
  const [branch, setBranch] = useState('Head Office');
  const [branchOpen, setBranchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const branchRef = useRef(null);

  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
  const isAdmin = user.role === 'admin' || user.role === 'super admin' || user.role === 'Super Admin';

  useEffect(() => {
    const handler = (e) => {
      if (branchRef.current && !branchRef.current.contains(e.target)) setBranchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap');
        .topbar-header * { font-family: 'Jost', sans-serif; }
      `}</style>

      <header className="topbar-header sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100 print:hidden">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-[68px]">
            
            {/* Mobile Hamburger (Only visible on mobile, left side) */}
            {isMobile && (
              <button
                onClick={onToggleMobileMenu}
                className="p-1.5 mr-3 text-green-600 rounded-none hover:bg-green-50 transition-colors cursor-pointer"
              >
                <Menu size={22} />
              </button>
            )}

            {/* Logo - Only show on mobile because desktop has it in Sidebar */}
            {isMobile && (
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="w-10 h-10 rounded-none flex items-center justify-center text-white font-bold text-base"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #14532d)' }}>
                  <Gem size={20} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-lg font-bold text-[#14532d]">Belwin</span>
                  <span className="text-base font-semibold tracking-wider text-green-600 uppercase">Jewellery ERP</span>
                </div>
              </div>
            )}

            {/* Desktop Search (Left aligned) */}
            {!isMobile && (
              <div className="flex-1 ml-4">
                <div className="relative group w-64 md:w-80 lg:w-[400px]">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search employees, customers, loans..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              

              {/* Mobile search icon */}
              {isMobile && (
                <button
                  onClick={() => setSearchOpen(o => !o)}
                  className="p-1.5 border border-gray-200 text-gray-500 rounded-none bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Search size={16} />
                </button>
              )}

              {/* Branch Selector — desktop only (Static display for employees) */}
              {!isMobile && !isAdmin && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 border border-green-200 bg-green-50 rounded-none text-xs font-semibold text-green-700">
                  <Building2 size={14} className="text-green-600" />
                  <span>{user.employee?.branch || 'Head Office'}</span>
                </div>
              )}

              {/* Profile */}
              <UserProfile isMobile={isMobile} />
            </div>
          </div>
        </div>

        {/* Mobile full-width search dropdown */}
        {isMobile && searchOpen && (
          <div className="bg-white border-b border-gray-200 p-3 shadow-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search employees, loans..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-10 py-2 border border-gray-300 rounded-none text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:bg-gray-100 rounded-none cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
