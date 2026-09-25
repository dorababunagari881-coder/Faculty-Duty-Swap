import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Duty } from '../types';
import { CalendarView } from '../components/CalendarView';
import { StatusBadge } from '../components/StatusBadge';
import { DutyDetailsModal } from '../components/DutyDetailsModal';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { 
  Calendar as CalendarIcon, 
  ListFilter, 
  MapPin, 
  User, 
  Search, 
  ArrowRightLeft,
  Building2,
  CalendarDays
} from 'lucide-react';

export const DutySchedulePage: React.FC = () => {
  const { user } = useAuth();
  const { duties, profiles, config } = useData();

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  
  // List view filters
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [selectedDuty, setSelectedDuty] = useState<Duty | null>(null);
  const [swapDuty, setSwapDuty] = useState<Duty | null>(null);

  const filteredDuties = useMemo(() => {
    return duties.filter((d) => {
      if (departmentFilter !== 'ALL' && d.department !== departmentFilter) return false;
      if (facultyFilter !== 'ALL' && d.faculty_id !== facultyFilter) return false;
      if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
      if (dateFilter && d.date !== dateFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchDesc = d.duty_description.toLowerCase().includes(q);
        const matchLoc = d.location.toLowerCase().includes(q);
        const matchFac = (d.faculty_name || '').toLowerCase().includes(q);
        if (!matchDesc && !matchLoc && !matchFac) return false;
      }
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [duties, departmentFilter, facultyFilter, statusFilter, dateFilter, search]);

  return (
    <div className="space-y-5">
      {/* Top Header & View Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Duty Schedule
          </h2>
          <p className="text-xs text-slate-500">
            Comprehensive college-wide academic invigilation and duty roster
          </p>
        </div>

        {/* View Mode Tabs (Calendar vs List) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'calendar'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar View</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'list'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ListFilter className="w-4 h-4" />
            <span>List View</span>
          </button>
        </div>
      </div>

      {/* CALENDAR VIEW */}
      {activeTab === 'calendar' && (
        <CalendarView
          duties={duties}
          onSelectDuty={(d) => setSelectedDuty(d)}
          onRequestSwap={(d) => setSwapDuty(d)}
        />
      )}

      {/* LIST VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* List View Filter Toolbar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search duties, venues, faculty..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Departments</option>
              {config.departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Faculty */}
            <select
              value={facultyFilter}
              onChange={(e) => setFacultyFilter(e.target.value)}
              className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Faculty</option>
              {profiles.filter(p => p.role === 'FACULTY').map(p => (
                <option key={p.id} value={p.id}>{p.full_name} ({p.department})</option>
              ))}
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="swapped">Swapped</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Date filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {(departmentFilter !== 'ALL' || facultyFilter !== 'ALL' || statusFilter !== 'ALL' || dateFilter || search) && (
              <button
                onClick={() => {
                  setDepartmentFilter('ALL');
                  setFacultyFilter('ALL');
                  setStatusFilter('ALL');
                  setDateFilter('');
                  setSearch('');
                }}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Reset
              </button>
            )}
          </div>

          {/* Table container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredDuties.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <CalendarDays className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No scheduled duties found matching criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-5">Date</th>
                      <th className="py-3 px-5">Time</th>
                      <th className="py-3 px-5">Faculty</th>
                      <th className="py-3 px-5">Duty</th>
                      <th className="py-3 px-5">Location</th>
                      <th className="py-3 px-5">Department</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDuties.map((duty) => {
                      const isMine = duty.faculty_id === user?.id;
                      return (
                        <tr key={duty.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                            {duty.date}
                          </td>
                          <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">
                            {duty.start_time} – {duty.end_time}
                          </td>
                          <td className="py-3.5 px-5 font-medium text-slate-800">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{duty.faculty_name}</span>
                              {isMine && <span className="text-[10px] text-blue-600 font-bold">(You)</span>}
                            </div>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-slate-900">{duty.duty_description}</div>
                            {duty.is_swapped && (
                              <span className="text-[10px] text-indigo-600 font-medium inline-flex items-center gap-1">
                                <ArrowRightLeft className="w-3 h-3" /> Exchanged duty
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-5 text-slate-600">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{duty.location}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-5 font-medium text-slate-700">
                            {duty.department}
                          </td>
                          <td className="py-3.5 px-5">
                            <StatusBadge status={duty.status} />
                          </td>
                          <td className="py-3.5 px-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {isMine && duty.status === 'scheduled' && (
                                <button
                                  onClick={() => setSwapDuty(duty)}
                                  className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1"
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5" />
                                  Swap
                                </button>
                              )}
                              <button
                                onClick={() => setSelectedDuty(duty)}
                                className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                              >
                                Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <DutyDetailsModal
        isOpen={!!selectedDuty}
        onClose={() => setSelectedDuty(null)}
        duty={selectedDuty}
        onRequestSwap={(d) => setSwapDuty(d)}
      />

      <SwapRequestModal
        isOpen={!!swapDuty}
        onClose={() => setSwapDuty(null)}
        preselectedDuty={swapDuty}
      />
    </div>
  );
};
