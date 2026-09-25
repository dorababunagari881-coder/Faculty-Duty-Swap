import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UserRole } from '../types';
import { 
  CalendarDays, 
  ArrowRightLeft, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  LogIn,
  KeyRound,
  UserCheck
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { login, isLoading } = useAuth();
  const { config } = useData();

  const [email, setEmail] = useState('faculty@rgmcet.edu.in');
  const [password, setPassword] = useState('faculty123');
  const [role, setRole] = useState<UserRole>('FACULTY');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const res = await login(email, role);
    setIsSubmitting(false);

    if (res.success) {
      onLoginSuccess(role);
    } else {
      setError(res.error || 'Failed to authenticate.');
    }
  };

  const handleQuickDemoFill = (type: 'facultyA' | 'facultyB' | 'admin') => {
    if (type === 'facultyA') {
      setEmail('faculty@rgmcet.edu.in');
      setPassword('faculty123');
      setRole('FACULTY');
    } else if (type === 'facultyB') {
      setEmail('priya.sharma@rgmcet.edu.in');
      setPassword('faculty123');
      setRole('FACULTY');
    } else {
      setEmail('admin@rgmcet.edu.in');
      setPassword('admin123');
      setRole('ADMIN');
    }
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-900">
      {/* LEFT SECTION (Desktop Hero & Branding) */}
      <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-slate-950 text-white">
        {/* Background Campus Photo with Deep Scrim */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url('/src/assets/images/rgm_campus_hero_1790267583641.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        
        {/* Top Header Logo */}
        <div className="relative z-10">
          <Logo 
            variant="dark" 
            size="lg" 
            collegeName={config.collegeName} 
          />
        </div>

        {/* Center Presentation Pitch */}
        <div className="relative z-10 max-w-xl my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            BTech CSE Academic Capstone
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight text-balance">
            Smart Faculty Duty Management & Swapping Portal
          </h2>

          <p className="mt-4 text-sm text-slate-300 leading-relaxed max-w-lg">
            A centralized digital exchange ensuring uninterrupted academic operations, lab invigilation, assessment coordination, and transparent peer duty swaps with administrative oversight.
          </p>

          {/* 3 Key Feature Highlights */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Manage Duties</h3>
              <p className="text-[11px] text-slate-400 mt-1">Real-time scheduling and department coordination</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Request Swaps</h3>
              <p className="text-[11px] text-slate-400 mt-1">4-step mutual agreement workflow</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-xs">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Track Schedule</h3>
              <p className="text-[11px] text-slate-400 mt-1">Audit log and instant roster sync</p>
            </div>
          </div>
        </div>

        {/* Bottom Institutional Seal */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{config.collegeName}</span>
          <span className="font-mono text-slate-500">Autonomous · Accredited by NBA & NAAC</span>
        </div>
      </div>

      {/* RIGHT SECTION: Professional Login Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-50 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center flex justify-center">
            <Logo size="md" collegeName={config.collegeName} />
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 sm:p-10 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sign in to your faculty management account.
              </p>
            </div>

            {/* Role selector tabs */}
            <div className="mt-6 p-1 bg-slate-100 rounded-xl flex items-center">
              <button
                type="button"
                onClick={() => setRole('FACULTY')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === 'FACULTY'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faculty
              </button>
              <button
                type="button"
                onClick={() => setRole('ADMIN')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  role === 'ADMIN'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Faculty ID / Email
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. faculty@rgmcet.edu.in"
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("In demo evaluation mode, use password: faculty123 or admin123");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot Password?
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm rounded-xl border border-slate-300 px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.99] transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Fill Buttons for Project Evaluators */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Project Evaluation Demo Credentials
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('facultyA')}
                  className="px-2 py-1.5 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors text-center"
                >
                  Dr. Rajesh (CSE)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('facultyB')}
                  className="px-2 py-1.5 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors text-center"
                >
                  Dr. Priya (CSE)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoFill('admin')}
                  className="px-2 py-1.5 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-center"
                >
                  Admin Dean
                </button>
              </div>
            </div>

            {/* Institutional tagline */}
            <div className="mt-6 text-center text-xs text-slate-400">
              {config.collegeName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
