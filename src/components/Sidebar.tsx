import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  CalendarDays, 
  ArrowRightLeft, 
  History, 
  Bell, 
  User, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
}) => {
  const { user, isAdmin, logout } = useAuth();
  const { unreadCount, config } = useData();

  const facultyNav = [
    { id: 'faculty/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'faculty/duties', label: 'My Duties', icon: Briefcase },
    { id: 'faculty/schedule', label: 'Duty Schedule', icon: CalendarDays },
    { id: 'faculty/swap-requests', label: 'Swap Requests', icon: ArrowRightLeft },
    { id: 'faculty/swap-history', label: 'Swap History', icon: History },
    { id: 'faculty/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const adminNav = [
    { id: 'admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin/faculty', label: 'Faculty', icon: Users },
    { id: 'admin/duties', label: 'Duties', icon: Briefcase },
    { id: 'admin/schedule', label: 'Duty Schedule', icon: CalendarDays },
    { id: 'admin/swap-requests', label: 'Swap Requests', icon: ArrowRightLeft },
    { id: 'admin/swap-history', label: 'Swap History', icon: History },
    { id: 'admin/reports', label: 'Reports', icon: BarChart3 },
    { id: 'admin/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = isAdmin ? adminNav : facultyNav;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800 ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800 shrink-0">
          <div className="overflow-hidden">
            <Logo 
              variant="dark" 
              size="md" 
              showText={!collapsed} 
              collegeName={config.collegeShortName} 
            />
          </div>

          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation role banner */}
        {!collapsed && (
          <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isAdmin ? 'ADMINISTRATION PORTAL' : 'FACULTY PORTAL'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {isAdmin ? 'ADMIN' : 'FACULTY'}
            </span>
          </div>
        )}

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                } ${collapsed ? 'justify-center px-0' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Logout at bottom */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-sm">
              {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {user?.full_name}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {user?.department} · {user?.faculty_id}
                </p>
              </div>
            )}

            {!collapsed && (
              <button
                onClick={() => {
                  logout();
                  onNavigate('login');
                }}
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
