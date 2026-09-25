import React, { useState, useEffect } from 'react';
import { Duty } from '../types';
import { Modal } from './Modal';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowRightLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Check, 
  ChevronRight, 
  AlertCircle 
} from 'lucide-react';

interface SwapRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDuty?: Duty | null;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedDuty
}) => {
  const { user } = useAuth();
  const { duties, profiles, createSwapRequest } = useData();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedMyDutyId, setSelectedMyDutyId] = useState<string>('');
  const [targetFacultyId, setTargetFacultyId] = useState<string>('');
  const [selectedTargetDutyId, setSelectedTargetDutyId] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (preselectedDuty && preselectedDuty.faculty_id === user?.id) {
        setSelectedMyDutyId(preselectedDuty.id);
        setStep(2); // Jump straight to step 2 if duty preselected
      } else {
        setSelectedMyDutyId('');
        setStep(1);
      }
      setTargetFacultyId('');
      setSelectedTargetDutyId('');
      setReason('');
      setError('');
    }
  }, [isOpen, preselectedDuty, user]);

  // Requester's eligible duties (status === 'scheduled')
  const myEligibleDuties = duties.filter(
    d => d.faculty_id === user?.id && d.status === 'scheduled'
  );

  // Other faculty members (cannot swap with self)
  const targetFaculties = profiles.filter(
    p => p.id !== user?.id && p.role === 'FACULTY' && p.status === 'active'
  );

  // Target faculty's eligible duties (status === 'scheduled')
  const targetFacultyDuties = duties.filter(
    d => d.faculty_id === targetFacultyId && d.status === 'scheduled'
  );

  const mySelectedDuty = duties.find(d => d.id === selectedMyDutyId);
  const targetFaculty = profiles.find(p => p.id === targetFacultyId);
  const targetSelectedDuty = duties.find(d => d.id === selectedTargetDutyId);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!selectedMyDutyId) {
        setError('Please select one of your duties to exchange.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!targetFacultyId) {
        setError('Please select a faculty member.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!selectedTargetDutyId) {
        setError('Please select the duty you wish to request in exchange.');
        return;
      }
      setStep(4);
    }
  };

  const handleBack = () => {
    setError('');
    if (step > 1) {
      setStep((step - 1) as 1 | 2 | 3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      setError('Please provide an academic or personal reason for this swap request.');
      return;
    }

    const result = createSwapRequest({
      receiver_id: targetFacultyId,
      requester_duty_id: selectedMyDutyId,
      receiver_duty_id: selectedTargetDutyId,
      reason: reason.trim()
    });

    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Failed to submit swap request.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Duty Swap"
      subtitle="Follow the 4-step workflow to exchange duty schedules"
      maxWidth="2xl"
    >
      <div>
        {/* Step progress indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          {[
            { num: 1, label: 'Your Duty' },
            { num: 2, label: 'Faculty' },
            { num: 3, label: 'Their Duty' },
            { num: 4, label: 'Review & Submit' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    step === s.num
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : step > s.num
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${
                  step === s.num ? 'text-slate-900 font-semibold' : 'text-slate-500'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < 3 && <div className="flex-1 h-0.5 mx-2 bg-slate-200 hidden sm:block" />}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Select Your Duty */}
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              Step 1: Select the duty you need to exchange
            </p>
            {myEligibleDuties.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">You do not have any upcoming scheduled duties available for swapping.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {myEligibleDuties.map((duty) => {
                  const isSelected = selectedMyDutyId === duty.id;
                  return (
                    <div
                      key={duty.id}
                      onClick={() => setSelectedMyDutyId(duty.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{duty.duty_description}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {duty.date}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {duty.start_time} – {duty.end_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {duty.location}
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="myDuty"
                          checked={isSelected}
                          onChange={() => setSelectedMyDutyId(duty.id)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Select Target Faculty */}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              Step 2: Choose faculty member to request swap with
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {targetFaculties.map((f) => {
                const isSelected = targetFacultyId === f.id;
                const dutiesCount = duties.filter(d => d.faculty_id === f.id && d.status === 'scheduled').length;
                return (
                  <div
                    key={f.id}
                    onClick={() => {
                      setTargetFacultyId(f.id);
                      setSelectedTargetDutyId(''); // reset duty when faculty changes
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-semibold text-xs text-slate-700 shrink-0">
                        {f.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-slate-900 truncate">{f.full_name}</h4>
                        <p className="text-xs text-slate-500">{f.department} · {f.designation}</p>
                        <p className="text-[11px] text-blue-600 font-medium mt-1">
                          {dutiesCount} upcoming {dutiesCount === 1 ? 'duty' : 'duties'}
                        </p>
                      </div>
                      <input
                        type="radio"
                        name="targetFaculty"
                        checked={isSelected}
                        onChange={() => setTargetFacultyId(f.id)}
                        className="mt-1 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Select Target Faculty's Duty */}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-slate-800">
              Step 3: Select {targetFaculty?.full_name}&apos;s duty to receive in return
            </p>
            {targetFacultyDuties.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-500">
                  {targetFaculty?.full_name} does not have any upcoming scheduled duties.
                </p>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Choose another faculty member
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {targetFacultyDuties.map((duty) => {
                  const isSelected = selectedTargetDutyId === duty.id;
                  return (
                    <div
                      key={duty.id}
                      onClick={() => setSelectedTargetDutyId(duty.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900">{duty.duty_description}</h4>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {duty.date}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {duty.start_time} – {duty.end_time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {duty.location}
                            </span>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="targetDuty"
                          checked={isSelected}
                          onChange={() => setSelectedTargetDutyId(duty.id)}
                          className="mt-1 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Reason & Side-by-Side Comparison Preview */}
        {step === 4 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Step 4: Review swap proposal and provide academic reason
            </p>

            {/* Side by side duty exchange preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              {/* Left: Your Duty */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block mb-1">
                  You give away
                </span>
                <h4 className="text-sm font-bold text-slate-900">{mySelectedDuty?.duty_description}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mySelectedDuty?.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mySelectedDuty?.start_time} – {mySelectedDuty?.end_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{mySelectedDuty?.location}</span>
                  </div>
                </div>
              </div>

              {/* Right: Target Duty */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-xs">
                <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block mb-1">
                  You receive from {targetFaculty?.full_name}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{targetSelectedDuty?.duty_description}</h4>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{targetSelectedDuty?.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{targetSelectedDuty?.start_time} – {targetSelectedDuty?.end_time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{targetSelectedDuty?.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reason textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Reason for swap request <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                placeholder="e.g., Requesting swap due to department accreditation review or conflict with scheduled laboratory viva..."
                className="w-full text-sm rounded-lg border border-slate-300 p-3 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-3 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Once submitted, this request will have <strong>Pending</strong> status. Duties will only be exchanged after <strong>{targetFaculty?.full_name}</strong> reviews and accepts.
              </span>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Send Swap Request
              </button>
            </div>
          </form>
        )}

        {/* Navigation buttons for steps 1-3 */}
        {step < 4 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={step === 1 ? onClose : handleBack}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
