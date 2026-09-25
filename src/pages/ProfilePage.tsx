import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  ShieldCheck, 
  Save, 
  Award, 
  CheckCircle2 
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateCurrentProfile } = useAuth();
  const { config } = useData();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [designation, setDesignation] = useState(user?.designation || '');
  const [department, setDepartment] = useState(user?.department || 'CSE');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentProfile({
      full_name: fullName,
      phone,
      designation,
      department
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Faculty Profile
        </h2>
        <p className="text-xs text-slate-500">
          Manage your contact credentials and department affiliation
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Banner with college watermark styling */}
        <div className="h-28 bg-gradient-to-r from-blue-900 to-indigo-900 px-6 flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-bold">{config.collegeName}</h3>
            <p className="text-xs text-blue-200">Academic Faculty Directory</p>
          </div>
          <span className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
            {user?.role}
          </span>
        </div>

        <div className="px-6 pb-6 pt-0">
          {/* Avatar and Badge */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-6">
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 border-2 border-white shadow-md">
                <div className="w-full h-full rounded-xl bg-slate-900 text-white flex items-center justify-center text-2xl font-bold">
                  {user?.full_name ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                </div>
              </div>
              <div className="pb-1">
                <h3 className="text-lg font-bold text-slate-900">{user?.full_name}</h3>
                <p className="text-xs text-slate-500 font-mono">{user?.faculty_id}</p>
              </div>
            </div>

            <div className="pb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active Academic Staff
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty ID (Permanent)
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.faculty_id || ''}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 text-slate-500 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Institutional Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 bg-slate-50 text-slate-500 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile / Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Academic Designation
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-300 px-3 py-2.5 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {config.departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20 inline-flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
