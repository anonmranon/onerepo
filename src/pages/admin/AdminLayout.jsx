import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, FileText, Handshake, MessageSquare, LogOut, ChevronRight, Loader2, ExternalLink, Menu, X, Wallet, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import headerLogo from '../../assets/header-logo.svg';

const NAV = [
  { path: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/admin/users', label: 'Users', icon: Users },
  { path: '/admin/transactions', label: 'Transactions', icon: Wallet },
  { path: '/admin/kyc', label: 'KYC Review', icon: Shield },
  { path: '/admin/blog', label: 'Blog CMS', icon: FileText },
  { path: '/admin/partners', label: 'Partners', icon: Handshake },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { isAuthenticated, isLoading, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-dark flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-dark-secondary border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src={headerLogo} alt="LIQUID" className="h-6 w-auto object-contain" />
          </Link>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">ADMIN</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-dark-secondary border-r border-white/5 flex flex-col flex-shrink-0 
        fixed lg:sticky top-0 h-screen z-40 transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="hidden lg:flex p-6 border-b border-white/5 items-center justify-between">
          <Link to="/">
            <img src={headerLogo} alt="LIQUID" className="h-7 w-auto object-contain" />
          </Link>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">ADMIN</span>
        </div>

        <div className="px-4 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-primary text-[10px] font-bold">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV.map(({ path, label, icon: Icon, exact }) => {
            const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);
            return (
              <Link key={path} to={path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-body-dark hover:text-white hover:bg-white/5'
                }`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5 flex flex-col gap-1">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-xs text-body-dark hover:text-white transition-colors">
            <ExternalLink className="w-3 h-3" /> User Dashboard
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-body-dark hover:text-white hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 w-full lg:min-w-0 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
