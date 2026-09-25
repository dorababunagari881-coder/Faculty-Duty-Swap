import React from 'react';
import { Duty } from '../types';
import { Modal } from './Modal';
import { StatusBadge } from './StatusBadge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  User, 
  ArrowRightLeft, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DutyDetailsModalProps {
  duty: Duty | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestSwap?: (duty: Duty) => void;
  onEdit?: (duty: Duty) => void;
  onDelete?: (duty: Duty) => void;
}

export const DutyDetailsModal: React.FC<DutyDetailsModalProps> = ({
  duty,
  isOpen,
  onClose,
  onRequestSwap,
  onEdit,
  onDelete
}) => {
  const { user, isAdmin } = useAuth();

  if (!duty) return null;

  const isOwner = duty.faculty_id === user?.id;
  const canSwap = isOwner && duty.status === 'scheduled';
  const canEdit = (isOwner || isAdmin) && duty.status !== 'completed';
  const canDelete = isOwner || isAdmin;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Duty Assignment Details"
      subtitle={`Duty ID: ${duty.id}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Title and status */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-900">{duty.duty_description}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{duty.department} Department</p>
          </div>
          <StatusBadge status={duty.status} size="md" />
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Date
            </span>
            <span className="text-sm font-semibold text-slate-800">{duty.date}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Time Slot
            </span>
            <span className="text-sm font-semibold text-slate-800 font-mono">
              {duty.start_time} – {duty.end_time}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Venue / Room
            </span>
            <span className="text-sm font-semibold text-slate-800">{duty.location}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-slate-400 block mb-1 font-medium flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Assigned Faculty
            </span>
            <span className="text-sm font-semibold text-slate-800 truncate block">
              {duty.faculty_name} {isOwner && '(You)'}
            </span>
          </div>
        </div>

        {duty.is_swapped && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>This duty was exchanged through a confirmed peer duty swap.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-slate-100">
          {canDelete && onDelete && (
            <button
              onClick={() => {
                onClose();
                onDelete(duty);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          )}

          {canEdit && onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(duty);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit Duty
            </button>
          )}

          {canSwap && onRequestSwap && (
            <button
              onClick={() => {
                onClose();
                onRequestSwap(duty);
              }}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/20"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Request Duty Swap
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
