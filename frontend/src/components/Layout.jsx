import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import {
  Code2, History, LayoutDashboard, LogOut, Menu, X,
  ChevronRight, Zap, User
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

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-bg-surface border-r border-border z-30
          flex flex-col transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple
                            flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Zap size={18} className="text-bg-base" />
            </div>
            <div>
              <div className="font-display font-bold text-text-primary text-sm leading-none">CodeReview</div>
              <div className="text-accent-cyan text-xs font-mono mt-0.5">AI Assistant</div>
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
                  transition-all duration-150 group
                  ${active
                    ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                  }`}
              >
                <Icon size={17} className={active ? 'text-accent-cyan' : ''} />
                <span className="font-display">{label}</span>
                {active && <ChevronRight size={14} className="ml-auto text-accent-cyan" />}
              </Link>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-bg-elevated mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan
                            flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-text-primary text-xs font-semibold font-display truncate">{user?.name}</div>
              <div className="text-text-muted text-xs font-mono truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm
              text-text-secondary hover:text-accent-red hover:bg-accent-red/10
              transition-all duration-150 font-display"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-10 bg-bg-surface/90 backdrop-blur border-b border-border
                           flex items-center justify-between px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-text-secondary hover:text-text-primary">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-accent-cyan" />
            <span className="font-display font-bold text-sm text-text-primary">CodeReview AI</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-cyan
                          flex items-center justify-center">
            <User size={13} className="text-white" />
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
