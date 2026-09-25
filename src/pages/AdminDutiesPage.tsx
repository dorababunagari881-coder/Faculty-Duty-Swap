import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { Duty } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { DutyFormModal } from '../components/DutyFormModal';
import { DutyDetailsModal } from '../components/DutyDetailsModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  ArrowRightLeft 
} from 'lucide-react';

export const AdminDutiesPage: React.FC = () => {
  const { duties, profiles, config, deleteDuty } = useData();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');
  const [facultyFilter, setFacultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDuty, setEditingDuty] = useState<Duty | null>(null);
  const [detailsDuty, setDetailsDuty] = useState<Duty | null>(null);
  const [deletingDuty, setDeletingDuty] = useState<Duty | null>(null);

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

  const handleEdit = (duty: Duty) => {
    setEditingDuty(duty);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deletingDuty) {
      deleteDuty(deletingDuty.id);
      setDeletingDuty(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Duty Master Management
          </h2>
          <p className="text-xs text-slate-500">
            Centrally schedule, reassign, and manage all academic duties across college departments
          </p>
        </div>

        <button
          onClick={() => {
            setEditingDuty(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign New Duty</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2.5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search duties, faculty, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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

        <select
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
          className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Faculty</option>
          {profiles.filter(p => p.role === 'FACULTY').map(p => (
            <option key={p.id} value={p.id}>{p.full_name}</option>
          ))}
        </select>

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

      {/* Duties Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Faculty Member</th>
                <th className="py-3 px-5">Duty Description</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Time Slot</th>
                <th className="py-3 px-5">Venue / Location</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDuties.map((duty) => (
                <tr key={duty.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{duty.faculty_name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-slate-900">{duty.duty_description}</div>
                    {duty.is_swapped && (
                      <span className="text-[10px] text-indigo-600 font-medium inline-flex items-center gap-1">
                        <ArrowRightLeft className="w-3 h-3" /> Exchanged by swap
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
      </div>

      {/* Modals */}
      <DutyFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDuty(null);
        }}
        duty={editingDuty}
      />

      <DutyDetailsModal
        isOpen={!!detailsDuty}
        onClose={() => setDetailsDuty(null)}
        duty={detailsDuty}
        onEdit={(d) => handleEdit(d)}
      />

      <ConfirmDialog
        isOpen={!!deletingDuty}
        onClose={() => setDeletingDuty(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Duty Master Record"
        message={`Are you sure you want to permanently delete "${deletingDuty?.duty_description}" for ${deletingDuty?.faculty_name}?`}
        confirmLabel="Delete Record"
        variant="danger"
      />
    </div>
  );
};
