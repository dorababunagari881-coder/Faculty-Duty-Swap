import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  Bell, 
  CheckCheck, 
  ArrowRightLeft, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Info,
  Clock
} from 'lucide-react';

interface NotificationsPageProps {
  onNavigate?: (page: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const userNotifs = user 
    ? notifications.filter(n => n.user_id === user.id || (isAdmin && n.user_id === 'admin-1'))
    : [];

  const filtered = filter === 'unread' 
    ? userNotifs.filter(n => !n.is_read) 
    : userNotifs;

  const unreadCount = userNotifs.filter(n => !n.is_read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'NEW_SWAP_REQUEST':
        return <div className="p-2 rounded-xl bg-amber-50 text-amber-600"><ArrowRightLeft className="w-5 h-5" /></div>;
      case 'SWAP_ACCEPTED':
        return <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle className="w-5 h-5" /></div>;
      case 'SWAP_REJECTED':
        return <div className="p-2 rounded-xl bg-rose-50 text-rose-600"><XCircle className="w-5 h-5" /></div>;
      case 'DUTY_UPDATED':
        return <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><Calendar className="w-5 h-5" /></div>;
      default:
        return <div className="p-2 rounded-xl bg-slate-100 text-slate-600"><Info className="w-5 h-5" /></div>;
    }
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Notification Center
          </h2>
          <p className="text-xs text-slate-500">
            System notices, schedule modifications, and peer swap alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="px-3.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Notifications ({userNotifs.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            filter === 'unread'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notification List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No notifications to display.</p>
            <p className="text-xs text-slate-400 mt-1">You are completely caught up!</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                !item.is_read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              {getIcon(item.type)}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {new Date(item.created_at).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {!item.is_read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.related_request_id && onNavigate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markNotificationRead(item.id);
                      onNavigate(isAdmin ? 'admin/swap-requests' : 'faculty/swap-requests');
                    }}
                    className="mt-2 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-block"
                  >
                    View Swap Request →
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
