import React from 'react';
import { useData } from '../context/DataContext';
import { formatDateStr } from '../services/storage';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Users, 
  Briefcase, 
  Clock, 
  ArrowRightLeft, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  TrendingUp, 
  Building2,
  Calendar,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { profiles, duties, swapRequests, swapHistory, config } = useData();

  const todayStr = formatDateStr(new Date());

  const facultyProfiles = profiles.filter(p => p.role === 'FACULTY');
  const todayDuties = duties.filter(d => d.date === todayStr);
  const pendingSwaps = swapRequests.filter(r => r.status === 'pending');
  const approvedSwaps = swapRequests.filter(r => r.status === 'approved');
  const rejectedSwaps = swapRequests.filter(r => r.status === 'rejected');

  // Chart 1 data: Duties by Department
  const deptCounts = config.departments.map(dept => {
    const count = duties.filter(d => d.department === dept).length;
    return { dept, count };
  });
  const maxDeptCount = Math.max(...deptCounts.map(d => d.count), 1);

  // Chart 2 data: Swap Requests status
  const totalRequests = swapRequests.length || 1;
  const pendingPct = Math.round((pendingSwaps.length / totalRequests) * 100);
  const approvedPct = Math.round((approvedSwaps.length / totalRequests) * 100);
  const rejectedPct = Math.round((rejectedSwaps.length / totalRequests) * 100);

  // Chart 3 data: Monthly Swap Activity
  const monthlyData = [
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 7 },
    { month: 'Mar', count: 12 },
    { month: 'Apr', count: 9 },
    { month: 'May', count: 15 },
    { month: 'Jun', count: 18 },
  ];
  const maxMonthly = Math.max(...monthlyData.map(m => m.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 text-white rounded-2xl shadow-md border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
              OFFICE OF DEAN ACADEMICS
            </span>
            <span className="text-xs text-slate-400">· {config.collegeName}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Administration Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Monitor faculty duties, schedules and swap activity across all departments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => onNavigate('admin/reports')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Generate Reports</span>
          </button>
        </div>
      </div>

      {/* 6 Key Statistics Cards (Section 20) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Faculty */}
        <div 
          onClick={() => onNavigate('admin/faculty')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Faculty</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{facultyProfiles.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Across {config.departments.length} departments</p>
        </div>

        {/* Total Duties */}
        <div 
          onClick={() => onNavigate('admin/duties')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Duties</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{duties.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Academic sessions</p>
        </div>

        {/* Today's Duties */}
        <div 
          onClick={() => onNavigate('admin/schedule')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today&apos;s Duties</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{todayDuties.length}</p>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">Active today</p>
        </div>

        {/* Pending Swaps */}
        <div 
          onClick={() => onNavigate('admin/swap-requests')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Swaps</span>
            <ArrowRightLeft className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-600 tabular-nums">{pendingSwaps.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Mutual review stage</p>
        </div>

        {/* Approved Swaps */}
        <div 
          onClick={() => onNavigate('admin/swap-history')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Approved Swaps</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{approvedSwaps.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Completed swaps</p>
        </div>

        {/* Rejected Swaps */}
        <div 
          onClick={() => onNavigate('admin/swap-history')}
          className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Rejected Swaps</span>
            <XCircle className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{rejectedSwaps.length}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Declined proposals</p>
        </div>
      </div>

      {/* 3 ADMIN CHARTS (Section 21) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Duties by Department */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Duties by Department</h3>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Total scheduled duty distribution</p>
          </div>

          <div className="space-y-3">
            {deptCounts.map(({ dept, count }) => {
              const pct = Math.round((count / maxDeptCount) * 100);
              return (
                <div key={dept} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{dept}</span>
                    <span className="font-mono text-slate-500">{count} duties</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Swap Requests status */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Swap Requests Ratio</h3>
              <ArrowRightLeft className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Outcome breakdown of swap transactions</p>
          </div>

          <div className="py-2">
            {/* Visual multi-segment bar */}
            <div className="h-6 w-full rounded-xl bg-slate-100 flex overflow-hidden p-1 gap-1">
              <div 
                style={{ width: `${approvedPct}%` }}
                className="bg-emerald-500 rounded-lg h-full transition-all"
                title={`Approved: ${approvedSwaps.length}`}
              />
              <div 
                style={{ width: `${pendingPct}%` }}
                className="bg-amber-400 rounded-lg h-full transition-all"
                title={`Pending: ${pendingSwaps.length}`}
              />
              <div 
                style={{ width: `${rejectedPct}%` }}
                className="bg-rose-400 rounded-lg h-full transition-all"
                title={`Rejected: ${rejectedSwaps.length}`}
              />
            </div>

            <div className="mt-6 space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-emerald-950">Approved / Swapped</span>
                </div>
                <span className="font-mono font-bold text-emerald-700">{approvedSwaps.length} ({approvedPct}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="font-semibold text-amber-950">Pending Mutual Review</span>
                </div>
                <span className="font-mono font-bold text-amber-700">{pendingSwaps.length} ({pendingPct}%)</span>
              </div>

              <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-rose-50/60 border border-rose-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <span className="font-semibold text-rose-950">Declined / Rejected</span>
                </div>
                <span className="font-mono font-bold text-rose-700">{rejectedSwaps.length} ({rejectedPct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Monthly Swap Activity */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900">Monthly Swap Activity</h3>
              <TrendingUp className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 mb-4">Trend of duty swap proposals (Jan - Jun)</p>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
            {monthlyData.map((d) => {
              const heightPct = Math.round((d.count / maxMonthly) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 transition-colors">
                    {d.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg h-28 flex items-end">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-700 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:from-blue-600 group-hover:to-indigo-400"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 mt-1">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Swap Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Swap Requests Oversight</h3>
            <p className="text-xs text-slate-500">Live feed of faculty duty exchanges across the institution</p>
          </div>
          <button
            onClick={() => onNavigate('admin/swap-requests')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <span>View All ({swapRequests.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-5">Requester</th>
                <th className="py-3 px-5">Receiver</th>
                <th className="py-3 px-5">Offered Duty</th>
                <th className="py-3 px-5">Requested Duty</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {swapRequests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-semibold text-blue-700 whitespace-nowrap">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                    {req.requester_name}
                    <span className="block text-[10px] text-slate-400">{req.requester_department}</span>
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                    {req.receiver_name}
                    <span className="block text-[10px] text-slate-400">{req.receiver_department}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-800">
                    {req.requester_duty?.duty_description || 'Duty'}
                  </td>
                  <td className="py-3.5 px-5 text-slate-800">
                    {req.receiver_duty?.duty_description || 'Duty'}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onNavigate('admin/swap-requests')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Inspect →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
