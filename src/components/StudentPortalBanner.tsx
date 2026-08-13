"use client";

import { useState } from "react";
import { Copy, CheckCircle2, ExternalLink, Globe } from "lucide-react";

export default function StudentPortalBanner() {
  const [copied, setCopied] = useState(false);
  
  // 🚨 Updated to your exact global Vercel domain
  const portalUrl = "https://cwwala.vercel.app/students";

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 border-l-4 border-l-[#0055a5] p-5 rounded-xl shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="w-12 h-12 bg-blue-50/50 rounded-full flex items-center justify-center shrink-0 text-[#0055a5] border border-blue-100">
          <Globe className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
            Student Portal Access
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed max-w-lg">
            Share this secure link with your students. They can log in using their <strong className="text-slate-800">Registration ID</strong> to access study materials, DPPs, and CBT exams.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto bg-slate-50 p-1.5 rounded-xl border border-slate-200">
        <div className="px-3 py-1.5 text-xs font-bold text-slate-600 flex-1 lg:w-[240px] truncate select-all">
          {portalUrl}
        </div>
        
        <button
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm ${
            copied 
              ? 'bg-emerald-500 text-white border-transparent' 
              : 'bg-white border border-slate-200 text-slate-700 hover:text-[#0055a5] hover:border-[#0055a5]'
          }`}
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        
        <a 
          href={portalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          title="Open Portal in New Tab"
          className="bg-white border border-slate-200 text-slate-500 hover:text-[#0055a5] hover:border-[#0055a5] w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm shrink-0"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      
    </div>
  );
}