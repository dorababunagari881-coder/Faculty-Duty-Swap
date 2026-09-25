import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SwapRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SwapRequestModal } from '../components/SwapRequestModal';
import { 
  ArrowRightLeft, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Plus, 
  MessageSquare,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Modal } from '../components/Modal';

export const SwapRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const { swapRequests, respondSwapRequest } = useData();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [isNewSwapOpen, setIsNewSwapOpen] = useState(false);

  // Action states for confirm dialog
  const [confirmAction, setConfirmAction] = useState<{
    request: SwapRequest;
    type: 'accept' | 'reject';
  } | null>(null);

  // Detail modal
  const [detailRequest, setDetailRequest] = useState<SwapRequest | null>(null);

  // Filter requests for current faculty
  const receivedRequests = swapRequests.filter(r => r.receiver_id === user?.id);
  const sentRequests = swapRequests.filter(r => r.requester_id === user?.id);

  const pendingReceivedCount = receivedRequests.filter(r => r.status === 'pending').length;

  const handleConfirmAction = () => {
    if (!confirmAction) return;
    respondSwapRequest(confirmAction.request.id, confirmAction.type);
    setConfirmAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Duty Swap Requests
          </h2>
          <p className="text-xs text-slate-500">
            Review incoming swap proposals and monitor outgoing exchange requests
          </p>
        </div>

        <button
          onClick={() => setIsNewSwapOpen(true)}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-600/20 inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Swap Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'received'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Received Requests</span>
          {pendingReceivedCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'sent'
              ? 'bg-white text-blue-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Sent Requests ({sentRequests.length})</span>
        </button>
      </div>

      {/* RECEIVED REQUESTS CONTENT */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No swap requests received.</p>
              <p className="text-xs text-slate-400 mt-1">Colleagues will appear here when they request to exchange a duty with you.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {receivedRequests.map((req) => {
                const isPending = req.status === 'pending';
                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                      isPending ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {req.requester_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{req.requester_name}</h3>
                            <span className="text-xs text-slate-400">· {req.requester_department}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Requested on {new Date(req.request_date).toLocaleDateString()} at{' '}
                            {new Date(req.request_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusBadge status={req.status} size="md" />
                      </div>
                    </div>

                    {/* Comparison Cards: What requester offers vs what requester wants */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
                      {/* Requester's Duty (You will receive) */}
                      <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100">
                        <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block mb-1">
                          Offered to You:
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {req.requester_duty?.duty_description || 'Duty assignment'}
                        </h4>
                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.requester_duty?.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.requester_duty?.start_time} – {req.requester_duty?.end_time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.requester_duty?.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Your Duty (You will give up) */}
                      <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100">
                        <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                          Requested from You:
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          {req.receiver_duty?.duty_description || 'Your Duty'}
                        </h4>
                        <div className="mt-2 space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.receiver_duty?.date}</span>
                          </div>
                          <div className="flex items-center gap-1.5 font-mono">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.receiver_duty?.start_time} – {req.receiver_duty?.end_time}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{req.receiver_duty?.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-slate-900">Reason: </strong>
                        <span>&quot;{req.reason}&quot;</span>
                      </div>
                    </div>

                    {/* Action buttons if pending */}
                    {isPending ? (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setConfirmAction({ request: req, type: 'reject' })}
                          className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors inline-flex items-center gap-1.5"
                        >
                          <X className="w-4 h-4" />
                          <span>Reject Swap</span>
                        </button>

                        <button
                          onClick={() => setConfirmAction({ request: req, type: 'accept' })}
                          className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-sm shadow-emerald-600/20 inline-flex items-center gap-1.5"
                        >
                          <Check className="w-4 h-4" />
                          <span>Accept & Confirm Swap</span>
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                        <span>Action completed on {new Date(req.response_date || req.updated_at).toLocaleString()}</span>
                        <span className="font-semibold">{req.remarks || `Status: ${req.status}`}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SENT REQUESTS CONTENT */}
      {activeTab === 'sent' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {sentRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <ArrowRightLeft className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-600">No swap requests initiated yet.</p>
              <p className="text-xs text-slate-400 mt-1">Click &quot;New Swap Request&quot; to propose a duty exchange.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-5">Target Faculty</th>
                    <th className="py-3 px-5">My Duty (Offered)</th>
                    <th className="py-3 px-5">Requested Duty</th>
                    <th className="py-3 px-5">Reason</th>
                    <th className="py-3 px-5">Request Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sentRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 font-bold text-slate-900">
                        {req.receiver_name}
                        <span className="block text-[11px] font-normal text-slate-400">
                          {req.receiver_department}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-slate-800">
                          {req.requester_duty?.duty_description || 'Duty'}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-mono">
                          {req.requester_duty?.date} ({req.requester_duty?.start_time})
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-semibold text-blue-700">
                          {req.receiver_duty?.duty_description || 'Duty'}
                        </span>
                        <span className="block text-[11px] text-slate-500 font-mono">
                          {req.receiver_duty?.date} ({req.receiver_duty?.start_time})
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-600 max-w-xs truncate">
                        {req.reason}
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                        {new Date(req.request_date).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-5">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => setDetailRequest(req)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Request Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog for Accept / Reject */}
      <ConfirmDialog
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirmAction}
        title={confirmAction?.type === 'accept' ? 'Confirm Duty Swap' : 'Decline Swap Request'}
        message={
          confirmAction?.type === 'accept'
            ? `Accepting this request will immediately swap duty assignments between you and ${confirmAction.request.requester_name}. Your schedule will be automatically updated.`
            : `Are you sure you want to decline the swap request from ${confirmAction?.request.requester_name}? Duties will remain unchanged.`
        }
        confirmLabel={confirmAction?.type === 'accept' ? 'Accept & Update Schedule' : 'Decline Request'}
        variant={confirmAction?.type === 'accept' ? 'success' : 'danger'}
      />

      {/* Modal for Creating New Swap */}
      <SwapRequestModal
        isOpen={isNewSwapOpen}
        onClose={() => setIsNewSwapOpen(false)}
      />

      {/* Request Details Modal */}
      {detailRequest && (
        <Modal
          isOpen={!!detailRequest}
          onClose={() => setDetailRequest(null)}
          title="Swap Request Overview"
          subtitle={`Reference ID: ${detailRequest.id}`}
          maxWidth="md"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-700">Request Status</span>
              <StatusBadge status={detailRequest.status} size="md" />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2">
              <p><strong>Requester:</strong> {detailRequest.requester_name} ({detailRequest.requester_department})</p>
              <p><strong>Target Faculty:</strong> {detailRequest.receiver_name} ({detailRequest.receiver_department})</p>
              <p><strong>Proposed Reason:</strong> {detailRequest.reason}</p>
              <p><strong>Sent Date:</strong> {new Date(detailRequest.request_date).toLocaleString()}</p>
              {detailRequest.response_date && (
                <p><strong>Response Date:</strong> {new Date(detailRequest.response_date).toLocaleString()}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                <span className="font-bold text-blue-700 block mb-1">Your Duty</span>
                <p className="font-semibold">{detailRequest.requester_duty?.duty_description}</p>
                <p className="text-slate-500 font-mono">{detailRequest.requester_duty?.date}</p>
              </div>

              <div className="p-2.5 bg-indigo-50/60 rounded-lg border border-indigo-100">
                <span className="font-bold text-indigo-700 block mb-1">Requested Duty</span>
                <p className="font-semibold">{detailRequest.receiver_duty?.duty_description}</p>
                <p className="text-slate-500 font-mono">{detailRequest.receiver_duty?.date}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
