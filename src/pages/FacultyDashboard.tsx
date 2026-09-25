import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Duty } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { DutyFormModal } from '../components/DutyFormModal';
import { DutyDetailsModal } from '../components/DutyDetailsModal';
import { formatDateStr } from '../services/storage';
import { 
  CalendarDays, 
  Clock, 
  ArrowRightLeft, 
  CheckCircle2, 
  MapPin, 
  Plus, 
  Calendar, 
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface FacultyDashboardProps {
  onNavigate: (page: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { duties, swapRequests, swapHistory, config } = useData();

  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [selectedDutyForSwap, setSelectedDutyForSwap] = useState<Duty | null>(null);
  const [dutyFormOpen, setDutyFormOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedDutyForDetails, setSelectedDutyForDetails] = useState<Duty | null>(null);

  const todayStr = formatDateStr(new Date());

  // Filter duties for current logged-in faculty
  const myDuties = duties.filter(d => d.faculty_id === user?.id);
  
  // Today's duties
  const todayDuties = myDuties.filter(d => d.date === todayStr);

  // Upcoming duties (date >= today and not completed/cancelled, sorted by date asc)
  const upcomingDuties = myDuties
    .filter(d => d.date > todayStr && d.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date));

  // Swap requests pending for me (received or sent)
  const pendingRequests = swapRequests.filter(
    r => (r.receiver_id === user?.id || r.requester_id === user?.id) && r.status === 'pending'
  );

  // Approved swaps involving me
  const approvedSwapsCount = swapHistory.filter(
    h => (h.requester_id === user?.id || h.receiver_id === user?.id) && h.status === 'approved'
  ).length;

  const handleOpenSwap = (duty?: Duty) => {
    setSelectedDutyForSwap(duty || null);
    setSwapModalOpen(true);
  };

  const handleOpenDetails = (duty: Duty) => {
    setSelectedDutyForDetails(duty);
    setDetailsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Academic Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white shadow-md">
        <div>
          <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider block mb-1">
            {config.collegeName} · {user?.department} Department
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Good morning, {user?.full_name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Here&apos;s an overview of your academic duties and peer swap requests.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={() => setDutyFormOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + Add Duty
          </button>
          <button
            onClick={() => handleOpenSwap()}
            className="px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4 text-blue-600" />
            Request Swap
          </button>
        </div>
      </div>

      {/* 4 STATISTICS CARDS (Section 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Duties */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Today&apos;s Duties
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {todayDuties.length}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              {todayDuties.filter(d => d.status === 'scheduled').length} remaining today
            </p>
          </div>
        </div>

        {/* Card 2: Upcoming Duties */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Upcoming Duties
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {upcomingDuties.length}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Next: {upcomingDuties[0] ? upcomingDuties[0].date : 'None scheduled'}
            </p>
          </div>
        </div>

        {/* Card 3: Pending Requests */}
        <div 
          onClick={() => onNavigate('faculty/swap-requests')}
          className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {pendingRequests.length}
            </span>
            <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              <span>Awaiting mutual review</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </div>
        </div>

        {/* Card 4: Approved Swaps */}
        <div 
          onClick={() => onNavigate('faculty/swap-history')}
          className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Approved Swaps
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
              {approvedSwapsCount}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Lifetime exchanged assignments
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 10: TODAY'S DUTIES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Today&apos;s Duties</h3>
            <p className="text-xs text-slate-500">Duties assigned to you for today ({todayStr})</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-mono">
            {todayDuties.length} {todayDuties.length === 1 ? 'duty' : 'duties'}
          </span>
        </div>

        {todayDuties.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            No duties scheduled for today. Have a productive day!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Time</th>
                  <th className="py-3 px-5">Duty</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todayDuties.map((duty) => (
                  <tr key={duty.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-semibold text-slate-900">
                      {duty.start_time} – {duty.end_time}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-sm">{duty.duty_description}</div>
                      {duty.is_swapped && (
                        <span className="text-[10px] text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                          <ArrowRightLeft className="w-3 h-3" /> Received via swap
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
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenDetails(duty)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SECTION 11: UPCOMING DUTIES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upcoming Duties</h3>
            <p className="text-xs text-slate-500">Future scheduled assignments eligible for duty swapping</p>
          </div>
          <button
            onClick={() => onNavigate('faculty/schedule')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
          >
            <span>Full Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {upcomingDuties.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No upcoming scheduled duties found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Time</th>
                  <th className="py-3 px-5">Duty</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingDuties.slice(0, 6).map((duty) => (
                  <tr key={duty.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-slate-900 whitespace-nowrap">
                      {duty.date}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">
                      {duty.start_time} – {duty.end_time}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-bold text-slate-900">{duty.duty_description}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{duty.location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={duty.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenSwap(duty)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors inline-flex items-center gap-1.5"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Request Swap
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <SwapRequestModal
        isOpen={swapModalOpen}
        onClose={() => setSwapModalOpen(false)}
        preselectedDuty={selectedDutyForSwap}
      />

      <DutyFormModal
        isOpen={dutyFormOpen}
        onClose={() => setDutyFormOpen(false)}
      />

      <DutyDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        duty={selectedDutyForDetails}
        onRequestSwap={(d) => handleOpenSwap(d)}
      />
    </div>
  );
};
