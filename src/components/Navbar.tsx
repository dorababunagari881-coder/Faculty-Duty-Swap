import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  CheckCheck, 
  Calendar, 
  ShieldCheck, 
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface NavbarProps {
  onToggleSidebar: () => void;
  title: string;
  subtitle?: string;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  title,
  subtitle,
  onNavigate,
  currentPage
}) => {
  const { user, isAdmin, logout, quickSwitchUser } = useAuth();
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, config } = useData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (demoRef.current && !demoRef.current.contains(e.target as Node)) {
        setShowDemoMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userNotifications = user 
    ? notifications.filter(n => n.user_id === user.id)
    : [];

  const latestNotifs = userNotifications.slice(0, 5);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left zone: Mobile toggle + Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="hidden sm:block text-xs text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right zone: Presentation Demo Quick-Switch + Notification Bell + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Evaluator Demo Switcher Dropdown */}
        <div className="relative" ref={demoRef}>
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 rounded-lg hover:bg-blue-100/80 transition-colors"
            title="Switch demo persona for testing swap workflows"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[130px]">
              {isAdmin ? 'Admin View' : user?.full_name?.split(' ')[1] || 'Faculty'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Evaluator Fast-Switcher
                </p>
                <p className="text-xs text-slate-500">
                  Switch accounts to test mutual swap workflow
                </p>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    quickSwitchUser('faculty@rgmcet.edu.in');
                    setShowDemoMenu(false);
                    onNavigate('faculty/dashboard');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    user?.email === 'faculty@rgmcet.edu.in'
                      ? 'bg-blue-50 font-bold text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">Dr. Rajesh Kumar</div>
                    <div className="text-[10px] text-slate-400 font-mono">CSE · Requester (Faculty A)</div>
                  </div>
                  {user?.email === 'faculty@rgmcet.edu.in' && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono">ACTIVE</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    quickSwitchUser('priya.sharma@rgmcet.edu.in');
                    setShowDemoMenu(false);
                    onNavigate('faculty/dashboard');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    user?.email === 'priya.sharma@rgmcet.edu.in'
                      ? 'bg-blue-50 font-bold text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-medium">Dr. Priya Sharma</div>
                    <div className="text-[10px] text-slate-400 font-mono">CSE · Approver (Faculty B)</div>
                  </div>
                  {user?.email === 'priya.sharma@rgmcet.edu.in' && (
                    <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded font-mono">ACTIVE</span>
                  )}
                </button>

                <button
                  onClick={() => {
                    quickSwitchUser('admin@rgmcet.edu.in');
                    setShowDemoMenu(false);
                    onNavigate('admin/dashboard');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-left transition-colors ${
                    isAdmin
                      ? 'bg-purple-50 font-bold text-purple-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      Dean Academics
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">College Admin Portal</div>
                  </div>
                  {isAdmin && (
                    <span className="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-mono">ACTIVE</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {latestNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    No notifications yet.
                  </div>
                ) : (
                  latestNotifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                        !n.is_read ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1.5 block">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate(isAdmin ? 'admin/notifications' : 'faculty/notifications');
                  }}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors w-full py-1"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-slate-100 border border-slate-200/80 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">
                {user?.full_name || 'Guest User'}
              </p>
              <p className="text-[10px] text-slate-500 font-medium">
                {user?.role}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                  {user?.department} · {user?.faculty_id}
                </span>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate('profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                    onNavigate('login');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
