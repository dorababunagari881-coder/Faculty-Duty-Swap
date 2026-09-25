import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { SwapRequest } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { 
  ArrowRightLeft, 
  Search, 
  Filter, 
  Eye, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ShieldAlert 
} from 'lucide-react';

export const AdminSwapRequestsPage: React.FC = () => {
  const { swapRequests } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null);

  const filteredRequests = useMemo(() => {
    return swapRequests.filter((r) => {
      if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchReq = r.requester_name.toLowerCase().includes(q);
        const matchRec = r.receiver_name.toLowerCase().includes(q);
        const matchId = r.id.toLowerCase().includes(q);
        if (!matchReq && !matchRec && !matchId) return false;
      }
      return true;
    });
  }, [swapRequests, statusFilter, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Institutional Swap Requests Oversight
          </h2>
          <p className="text-xs text-slate-500">
            Audit and inspect peer-to-peer duty swap negotiations across all departments
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200/80 self-start sm:self-auto font-mono">
          {filteredRequests.length} Total Requests
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by faculty, department, or Request ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium rounded-xl border border-slate-200 px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="pending">Pending Mutual Confirmation</option>
            <option value="approved">Approved & Swapped</option>
            <option value="rejected">Rejected / Cancelled</option>
          </select>

          {(statusFilter !== 'ALL' || search) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSearch('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Request ID</th>
                <th className="py-3 px-5">Requester</th>
                <th className="py-3 px-5">Receiver</th>
                <th className="py-3 px-5">Original Duty</th>
                <th className="py-3 px-5">Requested Duty</th>
                <th className="py-3 px-5">Date Submitted</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-5 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {req.id}
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{req.requester_name}</div>
                    <span className="text-[10px] text-slate-400">{req.requester_department}</span>
                  </td>
                  <td className="py-3.5 px-5 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{req.receiver_name}</div>
                    <span className="text-[10px] text-slate-400">{req.receiver_department}</span>
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
                  <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                    {new Date(req.request_date).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRequest(req);
                      }}
                      className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                      title="Inspect Swap Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title="Swap Request Administrative Audit"
          subtitle={`Reference ID: ${selectedRequest.id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="font-semibold text-slate-600">Current Status:</span>
              <StatusBadge status={selectedRequest.status} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Requester Faculty
                </span>
                <p className="font-bold text-slate-900 text-sm">{selectedRequest.requester_name}</p>
                <p className="text-slate-500">{selectedRequest.requester_department} Department</p>
                <div className="mt-2 pt-2 border-t border-blue-200/60 space-y-0.5">
                  <p className="font-semibold">{selectedRequest.requester_duty?.duty_description}</p>
                  <p className="font-mono text-slate-500">{selectedRequest.requester_duty?.date}</p>
                  <p className="font-mono text-slate-500">{selectedRequest.requester_duty?.start_time} – {selectedRequest.requester_duty?.end_time}</p>
                  <p className="text-slate-500">{selectedRequest.requester_duty?.location}</p>
                </div>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  Target Faculty
                </span>
                <p className="font-bold text-slate-900 text-sm">{selectedRequest.receiver_name}</p>
                <p className="text-slate-500">{selectedRequest.receiver_department} Department</p>
                <div className="mt-2 pt-2 border-t border-indigo-200/60 space-y-0.5">
                  <p className="font-semibold">{selectedRequest.receiver_duty?.duty_description}</p>
                  <p className="font-mono text-slate-500">{selectedRequest.receiver_duty?.date}</p>
                  <p className="font-mono text-slate-500">{selectedRequest.receiver_duty?.start_time} – {selectedRequest.receiver_duty?.end_time}</p>
                  <p className="text-slate-500">{selectedRequest.receiver_duty?.location}</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-900 mb-1">Stated Exchange Reason:</strong>
              <p className="italic text-slate-700">&quot;{selectedRequest.reason}&quot;</p>
            </div>

            <div className="pt-2 text-slate-400 flex items-center justify-between border-t border-slate-100">
              <span>Submitted: {new Date(selectedRequest.request_date).toLocaleString()}</span>
              {selectedRequest.response_date && (
                <span>Evaluated: {new Date(selectedRequest.response_date).toLocaleString()}</span>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
