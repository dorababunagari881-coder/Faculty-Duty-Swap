import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  collegeName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'auto',
  size = 'md',
  showText = true,
  className = '',
  collegeName = "RGM College of Engineering & Technology"
}) => {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const titleSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  }[size];

  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Premium Academic Swap Crest */}
      <div 
        className={`${iconSizeClasses} shrink-0 rounded-xl relative flex items-center justify-center shadow-sm overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-blue-700 to-indigo-900 text-white border border-blue-600/40' 
            : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white shadow-indigo-900/10'
        }`}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:6px_6px]" />
        
        <svg 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-4/5 h-4/5 relative z-10"
        >
          {/* Calendar base card */}
          <rect x="8" y="10" width="24" height="22" rx="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
          {/* Calendar top binder bar */}
          <path d="M8 16H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M26 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          
          {/* Graduation Cap motif at top right */}
          <path d="M27 9L34 11.5L27 14L20 11.5L27 9Z" fill="#38bdf8" />
          <path d="M34 11.5V14" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Bidirectional Exchange Arrows inside Calendar */}
          <path 
            d="M13 21H25M25 21L21.5 18M25 21L21.5 24" 
            stroke="#60a5fa" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <path 
            d="M27 27H15M15 27L18.5 24M15 27L18.5 30" 
            stroke="#facc15" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col min-w-0 leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-bold tracking-tight ${titleSizeClasses} ${isDark ? 'text-white' : 'text-slate-900'}`}>
              FACULTY DUTY SWAP
            </span>
          </div>
          <span className={`text-[11px] font-medium truncate ${isDark ? 'text-blue-200/80' : 'text-slate-500'}`}>
            {collegeName}
          </span>
        </div>
      )}
    </div>
  );
};
