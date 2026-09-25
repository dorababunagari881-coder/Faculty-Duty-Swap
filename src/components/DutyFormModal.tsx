import React, { useState, useEffect } from 'react';
import { Duty, DutyStatus } from '../types';
import { Modal } from './Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { formatDateStr } from '../services/storage';

interface DutyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  duty?: Duty | null;
}

export const DutyFormModal: React.FC<DutyFormModalProps> = ({
  isOpen,
  onClose,
  duty
}) => {
  const { config, profiles, createDuty, updateDuty } = useData();
  const { user, isAdmin } = useAuth();

  const [facultyId, setFacultyId] = useState(user?.id || '');
  const [dutyDesc, setDutyDesc] = useState('');
  const [date, setDate] = useState(formatDateStr(new Date()));
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [location, setLocation] = useState(config.locations[0] || 'Room 204');
  const [department, setDepartment] = useState(user?.department || config.departments[0] || 'CSE');
  const [status, setStatus] = useState<DutyStatus>('scheduled');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (duty) {
      setFacultyId(duty.faculty_id);
      setDutyDesc(duty.duty_description);
      setDate(duty.date);
      setStartTime(duty.start_time);
      setEndTime(duty.end_time);
      setLocation(duty.location);
      setDepartment(duty.department);
      setStatus(duty.status);
    } else {
      setFacultyId(user?.id || '');
      setDutyDesc(config.dutyTypes[0] || 'Lab Supervision');
      setDate(formatDateStr(new Date()));
      setStartTime('09:00 AM');
      setEndTime('11:00 AM');
      setLocation(config.locations[0] || 'CSE Lab 1');
      setDepartment(user?.department || 'CSE');
      setStatus('scheduled');
    }
    setErrors({});
  }, [duty, isOpen, user, config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!dutyDesc.trim()) newErrors.dutyDesc = 'Duty description is required';
    if (!date) newErrors.date = 'Date is required';
    if (!startTime) newErrors.startTime = 'Start time is required';
    if (!endTime) newErrors.endTime = 'End time is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!department) newErrors.department = 'Department is required';
    if (!facultyId) newErrors.facultyId = 'Assigned faculty is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (duty?.id) {
      updateDuty({
        id: duty.id,
        faculty_id: facultyId,
        date,
        start_time: startTime,
        end_time: endTime,
        duty_description: dutyDesc,
        location,
        department,
        status
      });
    } else {
      createDuty({
        faculty_id: facultyId,
        date,
        start_time: startTime,
        end_time: endTime,
        duty_description: dutyDesc,
        location,
        department,
        status
      });
    }

    onClose();
  };

  const facultyOptions = profiles.filter(p => p.role === 'FACULTY');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={duty ? 'Edit Duty Assignment' : '+ Add New Duty'}
      subtitle="Enter details for the academic duty schedule"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Faculty selection (Admin only or disabled for faculty) */}
        {isAdmin ? (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Assigned Faculty <span className="text-rose-500">*</span>
            </label>
            <select
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {facultyOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.full_name} ({f.faculty_id}) — {f.department}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Faculty Assigned: <strong>{user?.full_name}</strong></span>
            <span className="font-mono text-slate-400">{user?.faculty_id}</span>
          </div>
        )}

        {/* Duty description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Duty Description <span className="text-rose-500">*</span>
          </label>
          <div className="space-y-2">
            <select
              value={config.dutyTypes.includes(dutyDesc) ? dutyDesc : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  setDutyDesc(e.target.value);
                }
              }}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {config.dutyTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
              <option value="custom">-- Custom Duty Description --</option>
            </select>
            {(!config.dutyTypes.includes(dutyDesc) || dutyDesc === 'custom') && (
              <input
                type="text"
                value={dutyDesc === 'custom' ? '' : dutyDesc}
                onChange={(e) => setDutyDesc(e.target.value)}
                placeholder="Enter custom duty description..."
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
          {errors.dutyDesc && <p className="text-xs text-rose-500 mt-1">{errors.dutyDesc}</p>}
        </div>

        {/* Date and Times */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.date && <p className="text-xs text-rose-500 mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Start Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="e.g. 09:00 AM"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.startTime && <p className="text-xs text-rose-500 mt-1">{errors.startTime}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              End Time <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="e.g. 11:00 AM"
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.endTime && <p className="text-xs text-rose-500 mt-1">{errors.endTime}</p>}
          </div>
        </div>

        {/* Location & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {config.locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            {errors.location && <p className="text-xs text-rose-500 mt-1">{errors.location}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {config.departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status */}
        {duty && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Duty Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DutyStatus)}
              className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="swapped">Swapped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
          >
            {duty ? 'Save Changes' : 'Create Duty'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
