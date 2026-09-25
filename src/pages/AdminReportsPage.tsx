import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Filter, 
  Building2, 
  CheckCircle2, 
  ArrowRightLeft, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { duties, swapRequests, swapHistory, profiles, config } = useData();

  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Filter duties based on report controls
  const filteredDuties = useMemo(() => {
    return duties.filter((d) => {
      if (departmentFilter !== 'ALL' && d.department !== departmentFilter) return false;
      if (facultyFilter !== 'ALL' && d.faculty_id !== facultyFilter) return false;
      if (startDate && d.date < startDate) return false;
      if (endDate && d.date > endDate) return false;
      return true;
    });
  }, [duties, departmentFilter, facultyFilter, startDate, endDate]);

  const totalDuties = filteredDuties.length;
  const completedDuties = filteredDuties.filter(d => d.status === 'completed').length;
  const swappedDuties = filteredDuties.filter(d => d.is_swapped || d.status === 'swapped').length;
  const scheduledDuties = filteredDuties.filter(d => d.status === 'scheduled').length;

  const relevantSwaps = swapRequests.filter((r) => {
    if (departmentFilter !== 'ALL' && r.requester_department !== departmentFilter && r.receiver_department !== departmentFilter) {
      return false;
    }
    return true;
  });

  const pendingRequests = relevantSwaps.filter(r => r.status === 'pending').length;
  const approvedRequests = relevantSwaps.filter(r => r.status === 'approved').length;
  const rejectedRequests = relevantSwaps.filter(r => r.status === 'rejected').length;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ["Duty ID", "Faculty", "Department", "Duty Description", "Date", "Time", "Location", "Status", "Was Swapped"];
    const rows = filteredDuties.map(d => [
      d.id,
      `"${d.faculty_name || ''}"`,
      d.department,
      `"${d.duty_description}"`,
      d.date,
      `"${d.start_time} - ${d.end_time}"`,
      `"${d.location}"`,
      d.status,
      d.is_swapped ? "Yes" : "No"
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Duty_Swap_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Duty & Swap Analytics Reports
          </h2>
          <p className="text-xs text-slate-500">
            Exportable performance metrics, swap frequency rates, and invigilation audit summaries
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm inline-flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Department
          </label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Departments</option>
            {config.departments.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Faculty Member
          </label>
          <select
            value={facultyFilter}
            onChange={(e) => setFacultyFilter(e.target.value)}
            className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Faculty</option>
            {profiles.filter(p => p.role === 'FACULTY').map(p => (
              <option key={p.id} value={p.id}>{p.full_name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            From Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            To Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {(departmentFilter !== 'ALL' || facultyFilter !== 'ALL' || startDate || endDate) && (
          <button
            onClick={() => {
              setDepartmentFilter('ALL');
              setFacultyFilter('ALL');
              setStartDate('');
              setEndDate('');
            }}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 self-end pb-2 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 6 Report Summary Metric Cards (Section 35) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Total Duties</span>
          <span className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1 block">{totalDuties}</span>
          <span className="text-[10px] text-slate-400">In selected scope</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Completed</span>
          <span className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1 block">{completedDuties}</span>
          <span className="text-[10px] text-slate-400">
            {totalDuties > 0 ? `${Math.round((completedDuties / totalDuties) * 100)}% rate` : '0%'}
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Swapped Duties</span>
          <span className="text-2xl font-extrabold text-indigo-600 tabular-nums mt-1 block">{swappedDuties}</span>
          <span className="text-[10px] text-slate-400">Peer adjustments</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Pending Swaps</span>
          <span className="text-2xl font-extrabold text-amber-600 tabular-nums mt-1 block">{pendingRequests}</span>
          <span className="text-[10px] text-slate-400">Under review</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Approved Swaps</span>
          <span className="text-2xl font-extrabold text-emerald-600 tabular-nums mt-1 block">{approvedRequests}</span>
          <span className="text-[10px] text-slate-400">Mutual confirmations</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 block uppercase">Rejected Swaps</span>
          <span className="text-2xl font-extrabold text-rose-600 tabular-nums mt-1 block">{rejectedRequests}</span>
          <span className="text-[10px] text-slate-400">Declined requests</span>
        </div>
      </div>

      {/* Detailed Report Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Academic Duty Roster Ledger</h3>
            <p className="text-xs text-slate-500">Filtered dataset ready for institutional compliance audit</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full font-mono text-slate-700">
            {filteredDuties.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Time</th>
                <th className="py-3 px-5">Faculty</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Duty</th>
                <th className="py-3 px-5">Venue</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Swap State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDuties.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">{d.date}</td>
                  <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">{d.start_time} – {d.end_time}</td>
                  <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">{d.faculty_name}</td>
                  <td className="py-3.5 px-5 text-slate-700">{d.department}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-900">{d.duty_description}</td>
                  <td className="py-3.5 px-5 text-slate-600">{d.location}</td>
                  <td className="py-3.5 px-5 font-semibold uppercase text-[10px] text-slate-700">{d.status}</td>
                  <td className="py-3.5 px-5">
                    {d.is_swapped ? (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        Swapped
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Original</span>
                    )}
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
