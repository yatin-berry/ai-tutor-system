import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Mic2, 
  LogOut, 
  User,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Quiz', path: '/quiz', icon: BrainCircuit },
    { name: 'AI Interview', path: '/interview', icon: Mic2 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-3 px-2 mb-10 h-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary to-purple-600 flex items-center justify-center shrink-0">
          <BrainCircuit size={18} className="text-white" />
        </div>
        {(isSidebarOpen || isMobileMenuOpen) && <span className="font-bold text-xl gradient-text">Mentra AI</span>}
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-primary/10 text-brand-primary shadow-sm' 
                  : 'hover:bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-brand-primary' : 'group-hover:text-white'} />
              {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium">{item.name}</span>}
              {isActive && (isSidebarOpen || isMobileMenuOpen) && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-white/5 space-y-2">
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 shrink-0`}>
          <User size={20} />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium truncate">{user?.email?.split('@')[0]}</span>}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
          {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row text-slate-200">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-white/5 bg-dark-900/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-secondary to-purple-600 flex items-center justify-center">
            <BrainCircuit size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg gradient-text">Mentra AI</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-white/5 rounded-lg text-slate-400"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block h-screen sticky top-0 bg-dark-900 border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}>
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 lg:hidden bg-dark-900 w-72 shadow-2xl border-r border-white/10"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
