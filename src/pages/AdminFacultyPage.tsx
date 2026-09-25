import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { UserProfile } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

export const AdminFacultyPage: React.FC = () => {
  const { profiles, saveFacultyProfile, deleteFacultyProfile, config } = useData();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // Modals
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<UserProfile | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [facultyId, setFacultyId] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [role, setRole] = useState<'FACULTY' | 'ADMIN'>('FACULTY');
  const [status, setStatus] = useState<'active' | 'on_leave' | 'inactive'>('active');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredFaculty = profiles.filter((p) => {
    if (departmentFilter !== 'ALL' && p.department !== departmentFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = p.full_name.toLowerCase().includes(q);
      const matchEmail = p.email.toLowerCase().includes(q);
      const matchId = p.faculty_id.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchId) return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProfile(null);
    setFullName('');
    setFacultyId(`FAC-${department}-0${profiles.length + 1}`);
    setEmail('');
    setPhone('+91 ');
    setDepartment('CSE');
    setDesignation('Assistant Professor');
    setRole('FACULTY');
    setStatus('active');
    setErrors({});
    setIsAddEditOpen(true);
  };

  const handleOpenEdit = (p: UserProfile) => {
    setEditingProfile(p);
    setFullName(p.full_name);
    setFacultyId(p.faculty_id);
    setEmail(p.email);
    setPhone(p.phone);
    setDepartment(p.department);
    setDesignation(p.designation);
    setRole(p.role);
    setStatus(p.status);
    setErrors({});
    setIsAddEditOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!facultyId.trim()) newErrors.facultyId = 'Faculty ID is required';
    if (!email.trim()) newErrors.email = 'Email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload: UserProfile = {
      id: editingProfile?.id || `fac-${Date.now()}`,
      full_name: fullName.trim(),
      faculty_id: facultyId.trim(),
      email: email.trim(),
      phone: phone.trim(),
      department,
      designation,
      role,
      status,
      created_at: editingProfile?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    saveFacultyProfile(payload);
    setIsAddEditOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (deletingProfile) {
      deleteFacultyProfile(deletingProfile.id);
      setDeletingProfile(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Faculty Directory Management
          </h2>
          <p className="text-xs text-slate-500">
            Register, configure, and monitor faculty accounts and department assignments
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by faculty name, email, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
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

          {(departmentFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setDepartmentFilter('ALL');
                setSearch('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Faculty Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Faculty ID</th>
                <th className="py-3 px-5">Full Name</th>
                <th className="py-3 px-5">Email Address</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Designation</th>
                <th className="py-3 px-5">Phone</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFaculty.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                    {f.faculty_id}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{f.full_name}</div>
                  </td>
                  <td className="py-3.5 px-5 text-slate-600 font-mono">
                    {f.email}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-slate-800">
                    {f.department}
                  </td>
                  <td className="py-3.5 px-5 text-slate-600">
                    {f.designation}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">
                    {f.phone}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      f.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {f.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={f.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Faculty Member"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProfile(f)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Faculty Member"
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

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingProfile ? 'Edit Faculty Record' : 'Register New Faculty'}
        subtitle="Manage faculty credentials and administrative privileges"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Ramesh Babu"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Faculty ID <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={facultyId}
                onChange={(e) => setFacultyId(e.target.value)}
                placeholder="e.g. FAC-CSE-09"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.facultyId && <p className="text-xs text-rose-500 mt-1">{errors.facultyId}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Institutional Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@rgmcet.edu.in"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {config.departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Designation
              </label>
              <input
                type="text"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Associate Professor"
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Access Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'FACULTY' | 'ADMIN')}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="FACULTY">Faculty</option>
                <option value="ADMIN">Administrator (Dean/Head)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'active' | 'on_leave' | 'inactive')}
                className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddEditOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20"
            >
              {editingProfile ? 'Save Changes' : 'Register Faculty'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingProfile}
        onClose={() => setDeletingProfile(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Faculty Member"
        message={`Are you sure you want to remove ${deletingProfile?.full_name} (${deletingProfile?.faculty_id}) from the college system?`}
        confirmLabel="Remove Faculty"
        variant="danger"
      />
    </div>
  );
};
