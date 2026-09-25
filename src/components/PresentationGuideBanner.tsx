import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ArrowRightLeft, 
  CheckCircle2, 
  ShieldCheck, 
  UserCheck,
  X
} from 'lucide-react';

interface PresentationGuideBannerProps {
  onNavigate: (page: string) => void;
}

export const PresentationGuideBanner: React.FC<PresentationGuideBannerProps> = ({ onNavigate }) => {
  const { user, isAdmin, quickSwitchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white text-xs">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-semibold text-blue-300 shrink-0">Evaluator Walkthrough:</span>
          <span className="text-slate-300 truncate text-[11px] hidden md:inline">
            Logged in as <strong className="text-white">{user?.full_name}</strong> ({isAdmin ? 'ADMIN' : user?.department})
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Quick switcher buttons */}
          <div className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => {
                quickSwitchUser('faculty@rgmcet.edu.in');
                onNavigate('faculty/dashboard');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                user?.email === 'faculty@rgmcet.edu.in'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Dr. Rajesh (Req)
            </button>
            <button
              onClick={() => {
                quickSwitchUser('priya.sharma@rgmcet.edu.in');
                onNavigate('faculty/swap-requests');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                user?.email === 'priya.sharma@rgmcet.edu.in'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Dr. Priya (Appr)
            </button>
            <button
              onClick={() => {
                quickSwitchUser('admin@rgmcet.edu.in');
                onNavigate('admin/dashboard');
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                isAdmin
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Dean Admin
            </button>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
          >
            <span>{isOpen ? 'Hide Steps' : 'Scenario Guide'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Walkthrough Instructions */}
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 py-3 border-t border-slate-800/80 bg-slate-950/80 text-[11px] animate-in fade-in">
          <p className="font-bold text-slate-200 mb-2">
            Recommended BTech Capstone Presentation Workflow:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-blue-400 block mb-1">1. Propose Swap (Faculty A)</span>
              <p className="leading-snug text-slate-400">
                Log in as Dr. Rajesh Kumar. Go to Dashboard or My Duties, click &quot;Request Swap&quot; on Lab Supervision, choose Dr. Priya Sharma, select her duty, and submit.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-indigo-400 block mb-1">2. Review & Accept (Faculty B)</span>
              <p className="leading-snug text-slate-400">
                Click &quot;Dr. Priya (Appr)&quot; above. Open Swap Requests &gt; Received. Click &quot;Accept &amp; Confirm Swap&quot;. Notice immediate atomic schedule exchange!
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">3. Verify Schedule & History</span>
              <p className="leading-snug text-slate-400">
                Go to Duty Schedule to see duties swapped in Calendar. Check Swap History to view the complete immutable audit transaction snapshot.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="font-bold text-purple-400 block mb-1">4. Administrative Governance</span>
              <p className="leading-snug text-slate-400">
                Click &quot;Dean Admin&quot;. View college-wide swap ratios, department duty charts, and export CSV compliance records in Reports.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
