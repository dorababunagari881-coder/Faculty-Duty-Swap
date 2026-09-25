import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SwapHistory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { 
  History, 
  Search, 
  Filter, 
  Calendar, 
  ArrowRightLeft, 
  FileText, 
  User, 
  MapPin,
  Clock,
  Eye
} from 'lucide-react';

export const SwapHistoryPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { swapHistory } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<SwapHistory | null>(null);

  // If faculty, show records involving them unless admin
  const relevantHistory = useMemo(() => {
    if (isAdmin) return swapHistory;
    return swapHistory.filter(
      h => h.requester_id === user?.id || h.receiver_id === user?.id
    );
  }, [swapHistory, isAdmin, user]);

  const filteredHistory = useMemo(() => {
    return relevantHistory.filter((item) => {
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchReq = item.requester_name.toLowerCase().includes(q);
        const matchRec = item.receiver_name.toLowerCase().includes(q);
        const matchOrig = item.original_duty_desc.toLowerCase().includes(q);
        const matchSwap = item.swapped_duty_desc.toLowerCase().includes(q);
        const matchId = item.swap_request_id.toLowerCase().includes(q);
        if (!matchReq && !matchRec && !matchOrig && !matchSwap && !matchId) return false;
      }
      return true;
    });
  }, [relevantHistory, statusFilter, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Duty Swap Audit History
          </h2>
          <p className="text-xs text-slate-500">
            Complete, immutable log of all completed and evaluated faculty duty exchange transactions
          </p>
        </div>

        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200/80 self-start sm:self-auto font-mono">
          {filteredHistory.length} Recorded Transactions
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by faculty name, duty, or Request ID..."
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
            <option value="ALL">All Outcomes</option>
            <option value="approved">Approved & Swapped</option>
            <option value="rejected">Rejected / Declined</option>
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

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <History className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">No swap history found.</p>
            <p className="text-xs text-slate-400 mt-1">Confirmed exchanges and closed requests will be archived here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-5">Request ID</th>
                  <th className="py-3 px-5">Requester</th>
                  <th className="py-3 px-5">Receiver</th>
                  <th className="py-3 px-5">Original Duty</th>
                  <th className="py-3 px-5">Swapped Duty</th>
                  <th className="py-3 px-5">Request Date</th>
                  <th className="py-3 px-5">Response Date</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedRecord(item)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-5 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {item.swap_request_id}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                      {item.requester_name}
                      {item.requester_id === user?.id && (
                        <span className="ml-1 text-[10px] text-blue-600 font-bold">(You)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-900 whitespace-nowrap">
                      {item.receiver_name}
                      {item.receiver_id === user?.id && (
                        <span className="ml-1 text-[10px] text-blue-600 font-bold">(You)</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-slate-800">{item.original_duty_desc}</span>
                      <span className="block text-[11px] text-slate-500 font-mono">{item.original_duty_date}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-indigo-700">{item.swapped_duty_desc}</span>
                      <span className="block text-[11px] text-slate-500 font-mono">{item.swapped_duty_date}</span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                      {new Date(item.request_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                      {new Date(item.response_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(item);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"
                        title="View Detailed Audit Snapshot"
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

      {/* Audit Detail Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title="Swap Transaction Audit Snapshot"
          subtitle={`Archive Ref: ${selectedRecord.id} · Request: ${selectedRecord.swap_request_id}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-slate-500">Transaction Status:</span>
              <StatusBadge status={selectedRecord.status} size="md" />
            </div>

            {/* Exchange Comparison Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-700 uppercase tracking-wider block mb-1">
                  Faculty Requester
                </span>
                <p className="font-bold text-sm text-slate-900">{selectedRecord.requester_name}</p>
                <div className="mt-2 pt-2 border-t border-blue-200/60 space-y-1 text-slate-700">
                  <p className="font-semibold">{selectedRecord.original_duty_desc}</p>
                  <p className="font-mono text-slate-500">{selectedRecord.original_duty_date}</p>
                  {selectedRecord.original_duty_time && (
                    <p className="font-mono text-slate-500">{selectedRecord.original_duty_time}</p>
                  )}
                  {selectedRecord.original_duty_location && (
                    <p className="text-slate-500">{selectedRecord.original_duty_location}</p>
                  )}
                </div>
              </div>

              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100">
                <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                  Faculty Approver
                </span>
                <p className="font-bold text-sm text-slate-900">{selectedRecord.receiver_name}</p>
                <div className="mt-2 pt-2 border-t border-indigo-200/60 space-y-1 text-slate-700">
                  <p className="font-semibold">{selectedRecord.swapped_duty_desc}</p>
                  <p className="font-mono text-slate-500">{selectedRecord.swapped_duty_date}</p>
                  {selectedRecord.swapped_duty_time && (
                    <p className="font-mono text-slate-500">{selectedRecord.swapped_duty_time}</p>
                  )}
                  {selectedRecord.swapped_duty_location && (
                    <p className="text-slate-500">{selectedRecord.swapped_duty_location}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stated Reason */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700 block mb-1">Stated Reason:</span>
              <p className="text-slate-700 italic leading-relaxed">&quot;{selectedRecord.reason}&quot;</p>
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-3 text-slate-500 pt-2 border-t border-slate-100">
              <div>
                <span className="block font-medium">Request Initiated:</span>
                <span className="font-mono text-slate-800">{new Date(selectedRecord.request_date).toLocaleString()}</span>
              </div>
              <div>
                <span className="block font-medium">Mutual Confirmation:</span>
                <span className="font-mono text-slate-800">{new Date(selectedRecord.response_date).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
