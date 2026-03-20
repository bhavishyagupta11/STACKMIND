import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import {
  Code2, History, LayoutDashboard, LogOut, Menu,
  ChevronRight, Zap, User, Settings, PanelLeftClose, PanelLeftOpen, Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/review', label: 'New Review', icon: Code2 },
  { path: '/history', label: 'History', icon: History },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const handleLogout = () => {
    setAccountMenuOpen(false);
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  useEffect(() => {
    setSidebarOpen(false);
    setAccountMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) {
      setSidebarCollapsed((prev) => !prev);
      return;
    }

    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-bg-surface/95 border-r border-border z-30
          flex flex-col transition-all duration-300 ease-out lg:translate-x-0
          ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link
            to="/dashboard"
            className={`flex items-center group ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-amber to-[#ffbf66]
                            flex items-center justify-center shadow-[0_10px_24px_rgba(255,161,22,0.25)] group-hover:scale-105 transition-transform">
              <Zap size={18} className="text-white" />
            </div>
            <div className={sidebarCollapsed ? 'hidden' : 'block'}>
              <div className="font-display font-bold text-text-primary text-sm leading-none">STACKMIND</div>
              <div className="text-accent-amber text-xs font-mono mt-0.5">Code Intelligence</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                  transition-all duration-150 group ${sidebarCollapsed ? 'justify-center' : ''}
                  ${active
                    ? 'bg-accent-amber/10 text-accent-amber border border-accent-amber/25'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
                title={sidebarCollapsed ? label : undefined}
              >
                <Icon size={17} className={active ? 'text-accent-amber' : ''} />
                <span className={`font-display ${sidebarCollapsed ? 'hidden' : 'block'}`}>{label}</span>
                {active && !sidebarCollapsed && <ChevronRight size={14} className="ml-auto text-accent-amber" />}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-10 bg-bg-surface/90 backdrop-blur border-b border-border px-4 lg:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="w-10 h-10 rounded-xl border border-border bg-bg-elevated text-text-secondary hover:text-text-primary hover:border-border-bright transition-colors flex items-center justify-center"
                aria-label="Toggle sidebar"
              >
                <span className="hidden lg:block">
                  {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </span>
                <span className="lg:hidden">
                  <Menu size={18} />
                </span>
              </button>

            </div>

            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-amber to-[#ffbf66] flex items-center justify-center shadow-[0_10px_24px_rgba(255,161,22,0.20)] hover:scale-105 transition-transform"
                aria-label="Open account menu"
              >
                <User size={15} className="text-white" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-3 w-[290px] glass-card p-3 shadow-2xl shadow-stone-900/10">
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-bg-overlay border border-border mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-amber to-[#ffbf66] flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-text-primary text-sm font-semibold font-display truncate">{user?.name}</div>
                      <div className="flex items-center gap-1.5 text-text-muted text-xs font-mono truncate">
                        <Mail size={12} className="flex-shrink-0" />
                        <span className="truncate">{user?.email}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-accent-amber hover:bg-accent-amber/10 transition-all duration-150 font-display"
                  >
                    <Settings size={16} />
                    Edit profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:text-accent-red hover:bg-accent-red/10 transition-all duration-150 font-display"
                  >
                    <LogOut size={16} />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
