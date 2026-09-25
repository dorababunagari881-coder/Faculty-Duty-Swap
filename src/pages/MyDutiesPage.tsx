import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Duty } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { DutyFormModal } from '../components/DutyFormModal';
import { DutyDetailsModal } from '../components/DutyDetailsModal';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRightLeft, 
  Edit3, 
  Trash2,
  ArrowUpDown
} from 'lucide-react';

export const MyDutiesPage: React.FC = () => {
  const { user } = useAuth();
  const { duties, deleteDuty } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'date' | 'duty' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingDuty, setEditingDuty] = useState<Duty | null>(null);
  const [detailsDuty, setDetailsDuty] = useState<Duty | null>(null);
  const [swapDuty, setSwapDuty] = useState<Duty | null>(null);
  const [deletingDuty, setDeletingDuty] = useState<Duty | null>(null);

  // Filter duties for current faculty
  const myDuties = duties.filter(d => d.faculty_id === user?.id);

  const filteredDuties = useMemo(() => {
    return myDuties
      .filter((duty) => {
        if (statusFilter !== 'ALL' && duty.status !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchDesc = duty.duty_description.toLowerCase().includes(q);
          const matchLoc = duty.location.toLowerCase().includes(q);
          const matchDept = duty.department.toLowerCase().includes(q);
          if (!matchDesc && !matchLoc && !matchDept) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortField === 'date') {
          cmp = a.date.localeCompare(b.date);
        } else if (sortField === 'duty') {
          cmp = a.duty_description.localeCompare(b.duty_description);
        } else if (sortField === 'status') {
          cmp = a.status.localeCompare(b.status);
        }
        return sortOrder === 'asc' ? cmp : -cmp;
      });
  }, [myDuties, statusFilter, search, sortField, sortOrder]);

  const handleEdit = (duty: Duty) => {
    setEditingDuty(duty);
    setIsAddEditOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingDuty) {
      deleteDuty(deletingDuty.id);
      setDeletingDuty(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            My Duties Management
          </h2>
          <p className="text-xs text-slate-500">
            View, schedule, and manage your academic supervision duties
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDuty(null);
            setIsAddEditOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Duty</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search duties by description, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
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

          {/* Sort field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'date' | 'duty' | 'status')}
            className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Sort by Date</option>
            <option value="duty">Sort by Duty Name</option>
            <option value="status">Sort by Status</option>
          </select>

          {/* Sort order toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            title="Toggle sort order"
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Duties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredDuties.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No duties match your filter criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting filters or click &quot;+ Add Duty&quot; to assign a new one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Duty Description</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5">Time Slot</th>
                  <th className="py-3 px-5">Location</th>
                  <th className="py-3 px-5">Department</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDuties.map((duty) => (
                  <tr key={duty.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-slate-900 text-sm">{duty.duty_description}</div>
                      {duty.is_swapped && (
                        <span className="text-[10px] text-indigo-600 font-medium inline-flex items-center gap-1 mt-0.5">
                          <ArrowRightLeft className="w-3 h-3" /> Exchanged via swap
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800 whitespace-nowrap">
                      {duty.date}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">
                      {duty.start_time} – {duty.end_time}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600 whitespace-nowrap">
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
                        {duty.status === 'scheduled' && (
                          <button
                            onClick={() => setSwapDuty(duty)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Request Duty Swap"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEdit(duty)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Duty"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingDuty(duty)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Duty"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <DutyFormModal
        isOpen={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingDuty(null);
        }}
        duty={editingDuty}
      />

      <SwapRequestModal
        isOpen={!!swapDuty}
        onClose={() => setSwapDuty(null)}
        preselectedDuty={swapDuty}
      />

      <DutyDetailsModal
        isOpen={!!detailsDuty}
        onClose={() => setDetailsDuty(null)}
        duty={detailsDuty}
        onRequestSwap={(d) => setSwapDuty(d)}
        onEdit={(d) => handleEdit(d)}
      />

      <ConfirmDialog
        isOpen={!!deletingDuty}
        onClose={() => setDeletingDuty(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Duty Assignment"
        message={`Are you sure you want to remove the duty assignment "${deletingDuty?.duty_description}" on ${deletingDuty?.date}? This action cannot be undone.`}
        confirmLabel="Delete Assignment"
        variant="danger"
      />
    </div>
  );
};
