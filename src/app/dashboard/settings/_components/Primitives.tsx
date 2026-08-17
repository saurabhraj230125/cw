// src/app/dashboard/settings/_components/Primitives.tsx
import React from "react";

// Standard input Cls, updated for consistency
export const inputCls =
  "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white " +
  "focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/10 outline-none transition-all placeholder:text-slate-400";

// Reusable label Primitive
export const Label = ({ children, icon: Icon, required }: { children: React.ReactNode; icon?: any; required?: boolean }) => (
  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
    {Icon && <Icon className="inline w-3.5 h-3.5 mr-1 -mt-0.5 text-slate-400"/>}
    {children}
    {required && <span className="text-red-500">*</span>}
  </label>
);

// New hierarchical landscape Section with multi-column grid layouts
export const SettingsSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden ${className}`}>{children}</div>
);

export const SettingsSectionHeader = ({
  title,
  subtitle,
  icon: Icon,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: any;
  action?: React.ReactNode;
}) => (
  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#0055a5]"/>
        </div>
      )}
      <div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

// Common Save Bar primitive
export const SaveBar = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex justify-end pt-2 ${className}`}>{children}</div>
);

// Special Pill for Pro related callouts
export const ProPill = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center gap-1.5 bg-gradient-to-br from-[#0055a5] to-[#004080] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-inner animate-pulse">
    {children}
  </span>
);