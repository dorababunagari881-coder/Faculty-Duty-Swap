import React, { useState, useMemo } from 'react';
import { Duty } from '../types';
import { StatusBadge } from './StatusBadge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Building2, 
  ArrowRightLeft,
  Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface CalendarViewProps {
  duties: Duty[];
  onSelectDuty?: (duty: Duty) => void;
  onRequestSwap?: (duty: Duty) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  duties,
  onSelectDuty,
  onRequestSwap
}) => {
  const { user } = useAuth();
  const { config, profiles } = useData();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Filters
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Apply filters
  const filteredDuties = useMemo(() => {
    return duties.filter((duty) => {
      if (departmentFilter !== 'ALL' && duty.department !== departmentFilter) return false;
      if (statusFilter !== 'ALL' && duty.status !== statusFilter) return false;
      if (facultyFilter !== 'ALL' && duty.faculty_id !== facultyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchDesc = duty.duty_description.toLowerCase().includes(q);
        const matchLoc = duty.location.toLowerCase().includes(q);
        const matchFaculty = (duty.faculty_name || '').toLowerCase().includes(q);
        if (!matchDesc && !matchLoc && !matchFaculty) return false;
      }
      return true;
    });
  }, [duties, departmentFilter, statusFilter, facultyFilter, searchQuery]);

  // Calendar math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month grid calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const monthDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];
    
    // Prev month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      days.push({ dateStr, dayNum, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: i, isCurrentMonth: true });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: i, isCurrentMonth: false });
    }

    return days;
  }, [year, month, firstDayOfMonth, daysInMonth, daysInPrevMonth]);

  // Week days calculation
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const day = curr.getDay();
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1); // Monday start
    const startOfWeek = new Date(curr.setDate(diff));
    
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const dt = String(d.getDate()).padStart(2, '0');
      return {
        date: d,
        dateStr: `${y}-${m}-${dt}`,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        dayNum: d.getDate()
      };
    });
  }, [currentDate]);

  const todayStr = useMemo(() => {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
  }, []);

  return (
    <div className="space-y-4">
      {/* Controls & Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {/* Navigation & Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handlePrev}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
              aria-label="Previous time frame"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all"
              aria-label="Next time frame"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {monthNames[month]} {year}
          </h2>
        </div>

        {/* View mode switcher + filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View mode buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Department Filter */}
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

          {/* Status Filter */}
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
        </div>
      </div>

      {/* CALENDAR BODY */}

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/75 text-center text-xs font-semibold text-slate-600 py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Month grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {monthDays.map((day, idx) => {
              const dayDuties = filteredDuties.filter(d => d.date === day.dateStr);
              const isToday = day.dateStr === todayStr;

              return (
                <div
                  key={idx}
                  className={`min-h-[110px] p-1.5 sm:p-2 flex flex-col transition-colors ${
                    !day.isCurrentMonth
                      ? 'bg-slate-50/40 text-slate-400'
                      : isToday
                      ? 'bg-blue-50/20'
                      : 'bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                        isToday
                          ? 'bg-blue-600 text-white'
                          : day.isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {day.dayNum}
                    </span>
                    {dayDuties.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                        {dayDuties.length} {dayDuties.length === 1 ? 'duty' : 'duties'}
                      </span>
                    )}
                  </div>

                  {/* Day duties list */}
                  <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px]">
                    {dayDuties.slice(0, 3).map((duty) => {
                      const isMine = duty.faculty_id === user?.id;
                      return (
                        <div
                          key={duty.id}
                          onClick={() => onSelectDuty ? onSelectDuty(duty) : undefined}
                          className={`p-1 rounded text-[11px] font-medium truncate cursor-pointer transition-all border ${
                            isMine
                              ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                              : 'bg-slate-100 border-slate-200/80 text-slate-700'
                          }`}
                          title={`${duty.duty_description} (${duty.start_time}) - ${duty.faculty_name} @ ${duty.location}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="truncate">{duty.duty_description}</span>
                            <span className="text-[9px] opacity-75 font-mono shrink-0">{duty.start_time.split(' ')[0]}</span>
                          </div>
                        </div>
                      );
                    })}
                    {dayDuties.length > 3 && (
                      <span className="text-[10px] font-semibold text-blue-600 block pl-1">
                        +{dayDuties.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/75 divide-x divide-slate-100 text-center py-3">
            {weekDays.map((w, idx) => {
              const isToday = w.dateStr === todayStr;
              return (
                <div key={idx} className="px-2">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">{w.dayName}</p>
                  <p className={`text-sm font-bold mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                    isToday ? 'bg-blue-600 text-white' : 'text-slate-800'
                  }`}>
                    {w.dayNum}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-7 divide-x divide-slate-100 min-h-[360px]">
            {weekDays.map((w, idx) => {
              const dayDuties = filteredDuties.filter(d => d.date === w.dateStr);
              return (
                <div key={idx} className="p-2 space-y-2 bg-slate-50/20">
                  {dayDuties.length === 0 ? (
                    <div className="text-center py-8 text-[11px] text-slate-400 italic">No duties</div>
                  ) : (
                    dayDuties.map((duty) => {
                      const isMine = duty.faculty_id === user?.id;
                      return (
                        <div
                          key={duty.id}
                          onClick={() => onSelectDuty && onSelectDuty(duty)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all shadow-xs ${
                            isMine
                              ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold truncate">{duty.duty_description}</span>
                            <StatusBadge status={duty.status} size="sm" />
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {duty.start_time} – {duty.end_time}
                          </p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            {duty.location}
                          </p>
                          <p className="text-[11px] font-medium text-slate-700 flex items-center gap-1 mt-1 truncate">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            {duty.faculty_name}
                          </p>
                          {isMine && duty.status === 'scheduled' && onRequestSwap && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRequestSwap(duty);
                              }}
                              className="mt-2 w-full text-[11px] font-semibold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 rounded-md py-1 transition-colors flex items-center justify-center gap-1"
                            >
                              <ArrowRightLeft className="w-3 h-3" />
                              Swap Duty
                            </button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-xs text-slate-500">
                All duties scheduled for this calendar date
              </p>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {filteredDuties.filter(d => d.date === todayStr).length} Duties Total
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredDuties.filter(d => d.date === todayStr).length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-sm">
                No duties found for this date with selected filters.
              </div>
            ) : (
              filteredDuties.filter(d => d.date === todayStr).map((duty) => {
                const isMine = duty.faculty_id === user?.id;
                return (
                  <div
                    key={duty.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 p-3 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 text-center shrink-0">
                        <span className="text-xs font-bold text-blue-700 block font-mono">{duty.start_time}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">to {duty.end_time}</span>
                      </div>
                      <div className="border-l-2 border-blue-600 pl-3">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{duty.duty_description}</h4>
                          <StatusBadge status={duty.status} />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {duty.faculty_name} {isMine && <strong className="text-blue-600">(You)</strong>}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {duty.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {duty.department}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {isMine && duty.status === 'scheduled' && onRequestSwap && (
                        <button
                          onClick={() => onRequestSwap(duty)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          Request Swap
                        </button>
                      )}
                      {onSelectDuty && (
                        <button
                          onClick={() => onSelectDuty(duty)}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
