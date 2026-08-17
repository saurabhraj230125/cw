"use client";

import { useState } from "react";
import { Building2, CreditCard, Shield, Star, Crown } from "lucide-react";

// Structured Tab Components
import GeneralTab from "./GeneralTab";
import BillingTab from "./BillingTab";
import SecurityTab from "./SecurityTab";

// Props structure defined in server component
type TabProps = {
  userEmail: string;
  instituteName: string;
  instituteSlug: string;
  city: string;
  daysLeft: number;
  isPaid: boolean;
  isTrialExpired: boolean;
  currentPlan: string;
};

type ShellProps = TabProps & {
  membershipId: string;
  createdAt: string;
};

type Tab = "general" | "billing" | "security";

export default function SettingsShell({
  userEmail, instituteName, instituteSlug, city,
  daysLeft, isPaid, isTrialExpired, currentPlan,
  membershipId, createdAt,
}: ShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const TABS: { id: Tab; label: string; icon: any; desc: string }[] = [
    { id: "general", label: "General Information", icon: Building2, desc: "Branding & contact" },
    { id: "billing", label: "Billing & Plans", icon: CreditCard, desc: "Subscription & upgrade" },
    { id: "security", label: "Security & Sessions", icon: Shield, desc: "Password & access" },
  ];

  return (
    // Replaced <PageContainer> with a standard div to instantly fix the export error
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      
      {/* ── Page Top Header Landscape ── */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] px-6 py-6 backdrop-blur-sm border-b border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-white/60 text-[11px] font-black uppercase tracking-widest leading-none">Settings</span>
              {isPaid ? (
                <span className="flex items-center gap-1.5 bg-gradient-to-br from-[#0055a5] to-[#004080] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-inner animate-pulse">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300"/> Pro Account
                </span>
              ) : (
                <span className={`text-[11px] font-black px-3 py-1 rounded-full shadow-inner ${isTrialExpired ? "bg-red-500 text-white" : "bg-amber-400 text-amber-950"}`}>
                  {isTrialExpired ? "Trial Expired" : `Trial Expires In ${daysLeft} Days`}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">{instituteName}</h1>
            <p className="text-white/50 text-sm mt-0.5">Manage your institute profile, billing subscription, and account security.</p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {!isPaid && (
              <button onClick={() => setActiveTab("billing")} className="flex items-center gap-1.5 bg-gradient-to-br from-white to-blue-50 text-[#0055a5] text-xs font-black px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors shadow-sm scale-100 hover:scale-105 active:scale-100">
                <Crown className="w-3.5 h-3.5 fill-[#0055a5]"/> Get Pro Access
              </button>
            )}
            <p className="text-white/40 text-[10px] font-semibold tabular-nums">Member since: {new Date(createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* ── TAB LAYOUT (Horizontal Landscape Shift) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        {/* Landscape navigation across the top */}
        <div className="border-b border-slate-200 mb-6 relative z-0">
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm shadow-sm rounded-xl -z-10" />
          <nav className="flex flex-wrap items-center gap-1.5 px-3 py-1.5 rounded-xl">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all group shrink-0 ${
                  activeTab === tab.id
                    ? "bg-white text-[#0055a5] shadow-lg shadow-[#0055a5]/5 border border-[#E2E8F0] transform -translate-y-px"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeTab === tab.id ? "bg-[#0055a5]" : "bg-slate-100 group-hover:bg-slate-200"
                }`}>
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-500"}`} />
                </div>
                <div>
                  <p className={`text-sm font-black transition-colors ${activeTab === tab.id ? "text-[#0055a5]" : "text-slate-800"}`}>{tab.label}</p>
                  <p className="text-[10px] text-slate-400 font-medium group-hover:text-slate-500">{tab.desc}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* ── Content (Horizontal style flow) ── */}
        <div className="flex-1 min-w-0">
          {activeTab === "general" && (
            <GeneralTab city={city} instituteName={instituteName} userEmail={userEmail} />
          )}
          {activeTab === "billing" && (
            <BillingTab currentPlan={currentPlan} daysLeft={daysLeft} isPaid={isPaid} isTrialExpired={isTrialExpired} />
          )}
          {activeTab === "security" && <SecurityTab />}
        </div>
      </div>
    </div>
  );
}