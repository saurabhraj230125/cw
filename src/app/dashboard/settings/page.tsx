"use client";

import { useState } from "react";
import { 
  Save, RefreshCw, CreditCard, Download, 
  CheckCircle2, Smartphone, ShieldCheck, Zap,
  Clock, AlertTriangle
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("SaaS Billing");
  const [isSaving, setIsSaving] = useState(false);
  
  // Simulated State: Set to true to see the 7-Day Free Trial view
  const isFreeTrial = true; 
  const selectedPlanPrice = 14999; // Defaulting to PRO Plan price
  const addonPrice = 0; // Keeping addons separate for the total

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[17px] text-black font-normal">Institute Master Settings</h2>
      </div>

      {/* 2. CLASSIC TAB ROW */}
      <div className="px-4 pt-2 bg-[#f5f5f5] border-b border-gray-300 flex gap-1 shrink-0 overflow-x-auto hide-scrollbar">
        {["General", "Branding & White-Label", "Integrations", "SaaS Billing"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-[12px] font-bold border-t border-l border-r rounded-t-sm transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? "bg-white border-gray-300 text-[#0055a5] -mb-[1px] shadow-[0_-2px_0_#0055a5]" 
                : "bg-[#e8e8e8] border-[#d4d4d4] text-gray-600 hover:bg-[#f0f0f0]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. SETTINGS WORKSPACE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        
        {/* ======================================================== */}
        {/* GENERAL TAB (Unchanged)                                  */}
        {/* ======================================================== */}
        {activeTab === "General" && (
          <div className="max-w-[1200px] border border-gray-300 rounded-sm bg-[#fafafa] shadow-sm overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 sm:p-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
                <div>
                  <Field label="Institute Reg No" required defaultValue="FQ-2026-001" />
                  <Field label="Institute Name" required defaultValue="Future Q Academy" />
                  <Field label="System Domain" required defaultValue="futureq.coachingwala.com" disabled />
                  <Field label="Establishment Year" defaultValue="2026" />
                  <Field label="Institute Type" isSelect options={["Coaching Center", "School", "Tutor"]} />
                </div>
                <div>
                  <Field label="Director/Owner Name" required defaultValue="Saurabh Raj" />
                  <Field label="Support Email Id" required defaultValue="admin@futureq.com" type="email" />
                  <Field label="Support Mobile No" required defaultValue="6306814355" />
                  <Field label="Alternate Phone" defaultValue="" />
                  <Field label="Current Session" isSelect options={["2026-27", "2025-26"]} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6 border-t border-gray-300">
                <div>
                  <h3 className="text-[16px] text-black font-normal mb-4">Branch / Correspondence Address</h3>
                  <Field label="Address" required isTextArea defaultValue="QR.NO. - 4009, SECTOR - 4C, NEAR DPS BOKARO, LAXMI MARKET, B.S.CITY" />
                  <Field label="City" required isSelect options={["BOKARO", "RANCHI", "DHANBAD"]} />
                  <Field label="State" required isSelect options={["JHARKHAND", "BIHAR", "WEST BENGAL"]} />
                  <Field label="Country" required isSelect options={["India"]} />
                  <Field label="Pin" required defaultValue="827004" />
                </div>
                <div>
                  <h3 className="text-[16px] text-black font-normal mb-4">Head Office / Permanent Address</h3>
                  <Field label="Address" required isTextArea defaultValue="SHIVPUR SHABHAJGANJ JUNGLE SALIGRAM SHAKTINAGAR GORAKHPUR UTTARPRADESH" />
                  <Field label="City" required isSelect options={["GORAKHPUR", "LUCKNOW", "VARANASI"]} />
                  <Field label="State" required isSelect options={["UTTAR PRADESH", "DELHI", "BIHAR"]} />
                  <Field label="Country" required isSelect options={["India"]} />
                  <Field label="Pin" required defaultValue="273014" />
                </div>
              </div>
            </div>
            <div className="bg-[#eeeeee] border-t border-gray-300 px-6 py-3 flex justify-center gap-4">
              <button className="bg-[#f5f5f5] border border-gray-400 text-gray-800 px-6 py-1.5 text-[13px] font-bold hover:bg-white shadow-sm flex items-center gap-1.5 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
              <button onClick={handleSave} disabled={isSaving} className="bg-[#0055a5] border border-[#004080] text-white px-8 py-1.5 text-[13px] font-bold hover:bg-[#004080] shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-70">
                {isSaving ? "Updating..." : <><Save className="w-3.5 h-3.5" /> Update Profile</>}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SAAS BILLING TAB - WITH NEW 7-DAY TRIAL LOGIC            */}
        {/* ======================================================== */}
        {activeTab === "SaaS Billing" && (
          <div className="max-w-[1200px] animate-in fade-in duration-200 space-y-6">
            
            {/* DYNAMIC SUBSCRIPTION STATUS */}
            {isFreeTrial ? (
              <div className="border border-[#e65100] bg-[#fff3e0] shadow-sm flex flex-col md:flex-row items-center justify-between">
                <div className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#ffe0b2] border border-[#ffb74d] rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#e65100]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                      Active Plan: 7-DAY FREE TRIAL
                    </h3>
                    <div className="text-[12px] font-semibold text-[#cc0000] mt-0.5 flex gap-4">
                      <span>Expires: <span className="text-black">10 Aug 2026</span></span>
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Upgrade required to avoid suspension</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#ffecb3] border-l border-[#ffcc80] md:min-w-[280px] flex flex-col justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#e65100] uppercase">Trial Countdown</span>
                  <div className="w-full bg-white h-2 mt-1.5 mb-1.5 border border-[#ffb74d]">
                    {/* Progress bar showing 7 days full, slowly reducing */}
                    <div className="bg-[#e65100] h-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="flex justify-between text-[12px] font-bold text-gray-800">
                    <span>7 Days Remaining</span>
                    <span className="text-[#cc0000] underline cursor-pointer">Activate Now</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-gray-400 bg-white shadow-sm flex flex-col md:flex-row items-center justify-between">
                <div className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 bg-[#e8f5e9] border border-[#a5d6a7] rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#2e7d32]" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-gray-900 uppercase tracking-wide">Active Plan: PRO MODULE</h3>
                    <div className="text-[12px] font-semibold text-gray-600 mt-0.5 flex gap-4">
                      <span>Valid Till: <span className="text-black">15 Sep 2026</span></span>
                      <span>License Key: <span className="font-mono text-[#0055a5]">CW-PRO-9982X</span></span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-[#f5f5f5] border-l border-gray-300 md:min-w-[250px] flex flex-col justify-center shrink-0">
                  <span className="text-[11px] font-bold text-gray-500 uppercase">Usage Quota (Students)</span>
                  <div className="w-full bg-gray-300 h-2 mt-1 mb-1 border border-gray-400">
                    <div className="bg-[#0055a5] h-full" style={{ width: '45%' }}></div>
                  </div>
                  <div className="flex justify-between text-[12px] font-bold text-gray-800">
                    <span>225 Active</span>
                    <span>500 Limit</span>
                  </div>
                </div>
              </div>
            )}

            {/* BILLING MATRIX & ADD-ONS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* LEFT: Plan Comparison Matrix */}
              <div className="xl:col-span-2 border border-gray-400 bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="bg-[#f5f5f5] border-b border-gray-400 px-4 py-2 flex justify-between items-center">
                  <h2 className="text-[13px] font-bold text-[#0055a5] uppercase">Subscription Matrix</h2>
                </div>
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white font-bold">
                    <tr>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Features / Modules</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-[130px]">Pro Plan</th>
                      <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-[140px]">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-800">
                    {[
                      { feat: "Student Capacity", pro: "500 Limit", ent: "Unlimited" },
                      { feat: "Cloud Storage (Materials)", pro: "10 GB", ent: "100 GB" },
                      { feat: "WhatsApp Cloud API", pro: "Add-on Available", ent: "Yes (Included)" },
                      { feat: "White-Label Parent App", pro: "No", ent: "Yes (Android/iOS)" },
                      { feat: "Multi-Branch Support", pro: "Single Branch", ent: "Up to 5 Branches" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-gray-300 hover:bg-[#eef5fa]">
                        <td className="py-2.5 px-3 border-r border-gray-300 font-semibold">{row.feat}</td>
                        <td className="py-2.5 px-3 border-r border-gray-300 text-center text-[#0055a5] font-bold">{row.pro}</td>
                        <td className="py-2.5 px-3 text-center text-[#008000] font-bold">{row.ent}</td>
                      </tr>
                    ))}
                    <tr className="bg-[#f9f9f9]">
                      <td className="py-3 px-3 border-r border-gray-300 text-right font-bold uppercase text-gray-600">Pricing (Annual)</td>
                      <td className="py-3 px-3 border-r border-gray-300 text-center font-bold text-[15px]">₹14,999</td>
                      <td className="py-3 px-3 text-center font-bold text-[15px] text-[#008000]">₹34,999</td>
                    </tr>
                    <tr>
                      <td className="border-r border-gray-300"></td>
                      <td className="p-2 border-r border-gray-300 text-center bg-[#f5f5f5]">
                        <button className="w-full bg-[#0055a5] text-white py-1.5 text-[11px] font-bold border border-[#004080] hover:bg-[#004080] flex items-center justify-center gap-1 shadow-sm transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Select Pro
                        </button>
                      </td>
                      <td className="p-2 text-center bg-[#f5f5f5]">
                        <button className="w-full bg-white text-gray-800 py-1.5 text-[11px] font-bold border border-gray-400 hover:bg-gray-100 flex items-center justify-center gap-1 shadow-sm transition-colors">
                          <Zap className="w-3 h-3" /> Select Enterprise
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* RIGHT: Add-ons & UPI Payment Panel */}
              <div className="flex flex-col gap-6">
                
                {/* Add-ons Checklist */}
                <div className="border border-gray-400 bg-white shadow-sm">
                  <div className="bg-[#f5f5f5] border-b border-gray-400 px-4 py-2">
                    <h2 className="text-[13px] font-bold text-gray-800 uppercase">A-La-Carte Add-Ons</h2>
                  </div>
                  <div className="p-3 space-y-2">
                    <label className="flex items-center gap-3 p-2 border border-gray-300 bg-[#f9f9f9] hover:bg-[#eef5fa] cursor-pointer transition-colors">
                      <input type="checkbox" className="w-4 h-4 text-[#0055a5] border-gray-400 focus:ring-0" />
                      <div className="flex-1">
                        <div className="text-[12px] font-bold text-gray-900">WhatsApp API</div>
                        <div className="text-[11px] text-gray-500">Automated SMS</div>
                      </div>
                      <div className="text-[12px] font-bold text-[#008000]">+₹2,500/yr</div>
                    </label>
                    <label className="flex items-center gap-3 p-2 border border-[#a5d6a7] bg-[#e8f5e9] cursor-not-allowed">
                      <input type="checkbox" defaultChecked disabled className="w-4 h-4 text-[#008000] border-gray-400 focus:ring-0" />
                      <div className="flex-1">
                        <div className="text-[12px] font-bold text-gray-900">Online CBT Module</div>
                        <div className="text-[11px] text-[#2e7d32]">Default Active</div>
                      </div>
                      <div className="text-[12px] font-bold text-gray-500">Included</div>
                    </label>
                  </div>
                </div>

                {/* Secure UPI / Checkout Panel */}
                <div className="border border-[#0055a5] bg-[#eef5fa] shadow-sm overflow-hidden">
                  <div className="bg-[#0055a5] px-4 py-2 text-white flex justify-between items-center">
                    <h2 className="text-[13px] font-bold uppercase flex items-center gap-1.5"><CreditCard className="w-4 h-4" /> Quick Pay Ledger</h2>
                    <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 border border-white/40">100% SECURE</span>
                  </div>
                  <div className="p-4 text-center border-b border-gray-300">
                    <div className="flex justify-between text-[12px] font-bold text-gray-600 mb-1">
                      <span>Pro Plan (Base)</span>
                      <span>₹{selectedPlanPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-[12px] font-bold text-gray-600 mb-3 border-b border-gray-300 pb-2">
                      <span>Add-ons</span>
                      <span>₹{addonPrice.toLocaleString('en-IN')}</span>
                    </div>
                    
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-3 mb-0.5">Total Amount Payable</div>
                    <div className="text-[28px] font-black text-[#0055a5] leading-none mb-4">₹{(selectedPlanPrice + addonPrice).toLocaleString('en-IN')}</div>
                    
                    <button className="w-full bg-[#008000] hover:bg-[#006600] border border-[#004d00] text-white py-2.5 text-[13px] font-bold flex items-center justify-center gap-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] transition-colors mb-3">
                      <Smartphone className="w-4 h-4" /> Pay via UPI / Card
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 font-bold uppercase">
                      <span>GPay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>Visa</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* INVOICE LEDGER (Empty for free trial users, but headers present for completeness) */}
            <div className="border border-gray-400 bg-white shadow-sm mt-6">
              <div className="bg-[#f5f5f5] border-b border-gray-400 px-4 py-2 flex justify-between items-center">
                <h2 className="text-[13px] font-bold text-gray-800 uppercase">Billing Ledger & Invoices</h2>
              </div>
              <table className="w-full text-left text-[12px] border-collapse">
                <thead className="bg-[#e8e8e8] text-gray-700 font-bold border-b border-gray-300">
                  <tr>
                    <th className="py-2 px-4 border-r border-gray-300">Invoice No.</th>
                    <th className="py-2 px-4 border-r border-gray-300">Date</th>
                    <th className="py-2 px-4 border-r border-gray-300">Description</th>
                    <th className="py-2 px-4 border-r border-gray-300 text-right">Amount</th>
                    <th className="py-2 px-4 border-r border-gray-300 text-center">Status</th>
                    <th className="py-2 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {!isFreeTrial ? (
                    <tr className="border-b border-gray-300 hover:bg-[#f9f9f9]">
                      <td className="py-2 px-4 border-r border-gray-300 font-mono text-[#0055a5]">INV-26-0042</td>
                      <td className="py-2 px-4 border-r border-gray-300 text-gray-600">15 Aug 2026</td>
                      <td className="py-2 px-4 border-r border-gray-300 font-semibold">Pro Plan Annual Renewal</td>
                      <td className="py-2 px-4 border-r border-gray-300 text-right font-bold">₹14,999</td>
                      <td className="py-2 px-4 border-r border-gray-300 text-center"><span className="bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 border border-[#a5d6a7] font-bold text-[10px] uppercase">Paid</span></td>
                      <td className="py-2 px-4 text-center">
                        <button className="text-[#0055a5] hover:underline font-bold flex items-center justify-center gap-1 mx-auto">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-gray-500 font-bold">
                        No invoices generated yet. Your 7-Day Free Trial is currently active.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Fallback for other tabs */}
        {activeTab !== "General" && activeTab !== "SaaS Billing" && (
          <div className="p-8 text-center text-[13px] text-gray-500 font-bold border border-gray-300 bg-[#fafafa]">
            Module configuration pending for {activeTab}.
          </div>
        )}

      </div>
    </main>
  );
}

// ------------------------------------------------------------------
// REUSABLE FIELD COMPONENT
// ------------------------------------------------------------------
function Field({ 
  label, 
  required = false, 
  defaultValue = "", 
  type = "text",
  disabled = false,
  isTextArea = false,
  isSelect = false,
  options = []
}: { 
  label: string; 
  required?: boolean; 
  defaultValue?: string; 
  type?: string;
  disabled?: boolean;
  isTextArea?: boolean;
  isSelect?: boolean;
  options?: string[];
}) {
  return (
    <div className="flex items-start mb-2.5">
      <label className="w-[160px] shrink-0 text-right pr-2.5 text-[12px] text-black pt-1 leading-tight">
        {required && <span className="text-[#cc0000] font-bold">*</span>}{label} :
      </label>
      <div className="flex-1">
        {isTextArea ? (
          <textarea 
            defaultValue={defaultValue} 
            disabled={disabled}
            className="w-full border border-[#cccccc] p-1.5 text-[12px] text-gray-800 focus:border-[#0055a5] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] h-16 resize-none disabled:bg-[#f0f0f0] disabled:text-gray-500 transition-colors" 
          />
        ) : isSelect ? (
          <select 
            disabled={disabled}
            className="w-full border border-[#cccccc] p-1 text-[12px] text-gray-800 focus:border-[#0055a5] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] h-[26px] disabled:bg-[#f0f0f0] disabled:text-gray-500 transition-colors cursor-pointer"
          >
            {options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input 
            type={type} 
            defaultValue={defaultValue} 
            disabled={disabled}
            className="w-full border border-[#cccccc] p-1 text-[12px] text-gray-800 focus:border-[#0055a5] outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] h-[26px] disabled:bg-[#f0f0f0] disabled:text-gray-500 transition-colors" 
          />
        )}
      </div>
    </div>
  );
}