import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { 
  Settings, 
  Building2, 
  RotateCcw, 
  Save, 
  MapPin, 
  BookOpen, 
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { config, updateConfig, resetDemoData } = useData();

  const [collegeName, setCollegeName] = useState(config.collegeName);
  const [collegeShortName, setCollegeShortName] = useState(config.collegeShortName);
  const [tagline, setTagline] = useState(config.tagline);
  const [academicYear, setAcademicYear] = useState(config.academicYear);
  const [locations, setLocations] = useState(config.locations.join(', '));
  const [dutyTypes, setDutyTypes] = useState(config.dutyTypes.join(', '));

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      collegeName: collegeName.trim(),
      collegeShortName: collegeShortName.trim(),
      tagline: tagline.trim(),
      academicYear: academicYear.trim(),
      locations: locations.split(',').map(s => s.trim()).filter(Boolean),
      dutyTypes: dutyTypes.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  const handleResetConfirm = () => {
    resetDemoData();
    setIsResetConfirmOpen(false);
    // Refresh local form fields
    setCollegeName(config.collegeName);
    setCollegeShortName(config.collegeShortName);
    setTagline(config.tagline);
    setAcademicYear(config.academicYear);
    setLocations(config.locations.join(', '));
    setDutyTypes(config.dutyTypes.join(', '));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          Institutional & Portal Settings
        </h2>
        <p className="text-xs text-slate-500">
          Configure college identity, academic terminology, venues, and reset evaluation scenarios
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>College Identity Configuration</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Change the institution name, acronym, and portal tagline dynamically
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College Full Name
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                College Acronym / Short Name
              </label>
              <input
                type="text"
                value={collegeShortName}
                onChange={(e) => setCollegeShortName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Academic Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Portal Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Approved Exam Venues & Laboratories (comma-separated)
              </label>
              <textarea
                rows={2}
                value={locations}
                onChange={(e) => setLocations(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Standard Duty Types (comma-separated)
              </label>
              <textarea
                rows={2}
                value={dutyTypes}
                onChange={(e) => setDutyTypes(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20 inline-flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>

        {/* Demo Data Reset Section */}
        <div className="pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-rose-50/50 border border-rose-200">
            <div>
              <h4 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Reset Demo Evaluation Database</span>
              </h4>
              <p className="text-xs text-rose-800/80 mt-1 max-w-xl">
                Restores the standard BTech CSE test scenario with Faculty A (Dr. Rajesh Kumar), Faculty B (Dr. Priya Sharma), Dean Admin, pending swap requests, and full sample duties.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-rose-700 bg-white hover:bg-rose-100 border border-rose-300 rounded-xl transition-colors shrink-0 inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <span>Reset to Clean Demo</span>
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetConfirm}
        title="Reset Demo Database"
        message="Are you sure you want to reset all duties, swap requests, and history back to the initial evaluator demo state? Any newly created duties will be replaced with the standard demo seed."
        confirmLabel="Reset Everything"
        variant="danger"
      />
    </div>
  );
};
