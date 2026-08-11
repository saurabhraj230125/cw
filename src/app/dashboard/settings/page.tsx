"use client";

import { useState } from "react";
import { 
  Save, RefreshCw, CreditCard, Download, 
  CheckCircle2, Smartphone, ShieldCheck, Zap,
  Clock, AlertTriangle, ArrowLeft, Building2, Wallet, CreditCard as CardIcon
} from "lucide-react";

export default function SettingsClient({
  userEmail = "admin@institute.com",
  instituteName = "My Institute",
  instituteSlug = "my-institute",
  city = "Bokaro"
}: {
  userEmail?: string;
  instituteName?: string;
  instituteSlug?: string;
  city?: string;
}) {
  const [activeTab, setActiveTab] = useState("SaaS Billing");
  const [isSaving, setIsSaving] = useState(false);
  
  // Checkout & Billing State
  const isFreeTrial = true; 
  const [isCheckout, setIsCheckout] = useState(false);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(1499); 
  const [selectedPlanName, setSelectedPlanName] = useState("Starter Plan");
  
  // IRCTC Style Payment State
  const [paymentMethod, setPaymentMethod] = useState("multiple");
  const [selectedGateway, setSelectedGateway] = useState("razorpay");

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  const initiateCheckout = (name: string, price: number) => {
    setSelectedPlanName(name);
    setSelectedPlanPrice(price);
    setIsCheckout(true);
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-3 border-b border-gray-300 bg-white shrink-0 flex justify-between items-center shadow-sm">
        <h2 className="text-[17px] text-black font-semibold">Institute Master Settings</h2>
        <span className="text-[12px] font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          ID: {instituteSlug.toUpperCase()}
        </span>
      </div>

      {/* 2. CLASSIC TAB ROW */}
      <div className="px-4 pt-3 bg-white border-b border-gray-300 flex gap-1 shrink-0 overflow-x-auto hide-scrollbar">
        {["General", "Branding & White-Label", "Integrations", "SaaS Billing"].map((tab) => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setIsCheckout(false); }}
            className={`px-5 py-2 text-[13px] font-bold border-t border-l border-r rounded-t-md transition-colors whitespace-nowrap ${
              activeTab === tab 
                ? "bg-[#f8fafc] border-gray-300 text-[#0055a5] -mb-[1px] shadow-[0_-3px_0_#0055a5_inset]" 
                : "bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. SETTINGS WORKSPACE */}
      <div className="flex-1 p-4 md:p-6 bg-[#f8fafc] overflow-auto">
        
        {/* ======================================================== */}
        {/* GENERAL TAB                                              */}
        {/* ======================================================== */}
        {activeTab === "General" && (
          <div className="max-w-[1200px] border border-gray-300 rounded-md bg-white shadow-sm overflow-hidden animate-in fade-in duration-200">
            <div className="p-4 sm:p-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-2">
                <div>
                  <Field label="Institute Reg No" required defaultValue={instituteSlug.toUpperCase()} disabled />
                  <Field label="Institute Name" required defaultValue={instituteName} />
                  <Field label="System Domain" required defaultValue={`${instituteSlug}.coachingwala.com`} disabled />
                  <Field label="Establishment Year" defaultValue="2026" />
                  <Field label="Institute Type" isSelect options={["Coaching Center", "School", "Tutor"]} />
                </div>
                <div>
                  <Field label="Director/Owner Name" required defaultValue="Admin User" />
                  <Field label="Support Email Id" required defaultValue={userEmail} disabled type="email" />
                  <Field label="Support Mobile No" required defaultValue="+91" />
                  <Field label="Alternate Phone" defaultValue="" />
                  <Field label="Current Session" isSelect options={["2026-27", "2025-26"]} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6 border-t border-gray-200">
                <div>
                  <h3 className="text-[14px] text-[#0055a5] font-bold mb-4 uppercase tracking-wider">Branch / Correspondence Address</h3>
                  <Field label="Address" required isTextArea defaultValue="" />
                  <Field label="City" required isSelect options={[city.toUpperCase(), "RANCHI", "DHANBAD"]} />
                  <Field label="State" required isSelect options={["JHARKHAND", "BIHAR", "UTTAR PRADESH"]} />
                  <Field label="Pin" required defaultValue="" />
                </div>
                <div>
                  <h3 className="text-[14px] text-[#0055a5] font-bold mb-4 uppercase tracking-wider">Head Office Address</h3>
                  <Field label="Address" required isTextArea defaultValue="" />
                  <Field label="City" required isSelect options={[city.toUpperCase(), "LUCKNOW", "VARANASI"]} />
                  <Field label="State" required isSelect options={["UTTAR PRADESH", "DELHI", "BIHAR"]} />
                  <Field label="Pin" required defaultValue="" />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-4">
              <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 text-[13px] font-bold hover:bg-gray-50 shadow-sm flex items-center gap-1.5 transition-colors rounded-sm">
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
              <button onClick={handleSave} disabled={isSaving} className="bg-[#0055a5] border border-[#004080] text-white px-8 py-2 text-[13px] font-bold hover:bg-[#004080] shadow-sm flex items-center gap-1.5 transition-colors disabled:opacity-70 rounded-sm">
                {isSaving ? "Updating..." : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SAAS BILLING TAB                                         */}
        {/* ======================================================== */}
        {activeTab === "SaaS Billing" && (
          <div className="max-w-[1200px] animate-in fade-in duration-200">
            
            {!isCheckout ? (
              <div className="space-y-6">
                
                {/* DYNAMIC TRIAL BANNER */}
                {isFreeTrial && (
                  <div className="border border-[#e65100] bg-[#fff3e0] shadow-sm flex flex-col md:flex-row items-center justify-between rounded-sm">
                    <div className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 bg-[#ffe0b2] border border-[#ffb74d] rounded-full flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-[#e65100]" />
                      </div>
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                          Active Plan: 7-DAY FREE TRIAL
                        </h3>
                        <div className="text-[12px] font-semibold text-[#cc0000] mt-0.5 flex gap-4">
                          <span>Expires: <span className="text-black">18 Aug 2026</span></span>
                          <span className="flex items-center gap-1 hidden sm:flex"><AlertTriangle className="w-3 h-3" /> Upgrade required to unlock DPPs & Analytics</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-[#ffecb3] border-l border-[#ffcc80] md:min-w-[280px] w-full md:w-auto flex flex-col justify-center shrink-0">
                      <span className="text-[11px] font-bold text-[#e65100] uppercase">Trial Countdown</span>
                      <div className="w-full bg-white h-2 mt-1.5 mb-1.5 border border-[#ffb74d] rounded-full overflow-hidden">
                        <div className="bg-[#e65100] h-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-800">
                        <span>7 Days Remaining</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DETAILED PRICING MATRIX */}
                <div className="border border-gray-300 bg-white shadow-sm rounded-sm overflow-hidden">
                  <div className="bg-[#f8fafc] border-b border-gray-300 px-5 py-4 flex justify-between items-center">
                    <h2 className="text-[14px] font-black text-[#0055a5] uppercase tracking-wide">Select Your ERP Plan</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-300">
                    
                    {/* ESSENTIAL PLAN */}
                    <div className="p-6 flex flex-col hover:bg-gray-50 transition-colors">
                      <div className="mb-4">
                        <h3 className="text-[18px] font-black text-slate-800 uppercase">Essential</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-[16px] font-bold text-slate-500">₹</span>
                          <span className="text-[32px] font-black text-[#0055a5] leading-none">799</span>
                          <span className="text-[12px] font-bold text-slate-500">/mo</span>
                        </div>
                        <p className="text-[12px] font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 border border-emerald-200 rounded-sm">Up to 100 Students</p>
                      </div>
                      <ul className="text-[12px] font-semibold text-slate-600 space-y-3 flex-1 mb-6">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Student Records Management</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Global Attendance Tracking</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Core Fee Management</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Course & Batch Master</li>
                      </ul>
                      <button 
                        onClick={() => initiateCheckout("Essential Plan", 799)}
                        className="w-full py-2.5 border-2 border-[#0055a5] text-[#0055a5] font-bold text-[13px] hover:bg-[#0055a5] hover:text-white transition-colors rounded-sm shadow-sm"
                      >
                        Select Essential
                      </button>
                    </div>

                    {/* STARTER PLAN (POPULAR) */}
                    <div className="p-6 flex flex-col bg-blue-50/30 relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#0055a5]"></div>
                      <div className="absolute top-4 right-4 bg-[#0055a5] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm shadow-sm">
                        Most Popular
                      </div>
                      <div className="mb-4">
                        <h3 className="text-[18px] font-black text-slate-800 uppercase">Starter</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-[16px] font-bold text-slate-500">₹</span>
                          <span className="text-[32px] font-black text-[#0055a5] leading-none">1,499</span>
                          <span className="text-[12px] font-bold text-slate-500">/mo</span>
                        </div>
                        <p className="text-[12px] font-bold text-emerald-600 mt-2 bg-emerald-50 inline-block px-2 py-1 border border-emerald-200 rounded-sm">Up to 500 Students</p>
                      </div>
                      <ul className="text-[12px] font-semibold text-slate-600 space-y-3 flex-1 mb-6">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#0055a5] shrink-0" /> <span className="font-bold text-slate-800">All Essential Features</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> DPP & Study Material Hub</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Online Test Engine</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Analytics & Custom Reports</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> System Alerts & Notifications</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Manual WhatsApp Messaging</li>
                      </ul>
                      <button 
                        onClick={() => initiateCheckout("Starter Plan", 1499)}
                        className="w-full py-2.5 bg-[#0055a5] border-2 border-[#0055a5] text-white font-bold text-[13px] hover:bg-[#004080] shadow-sm transition-colors rounded-sm"
                      >
                        Select Starter
                      </button>
                    </div>

                    {/* ENTERPRISE PLAN */}
                    <div className="p-6 flex flex-col hover:bg-gray-50 transition-colors">
                      <div className="mb-4">
                        <h3 className="text-[18px] font-black text-slate-800 uppercase">Enterprise</h3>
                        <div className="mt-2 flex items-baseline gap-1">
                          <span className="text-[16px] font-bold text-slate-500">₹</span>
                          <span className="text-[32px] font-black text-[#0055a5] leading-none">2,499</span>
                          <span className="text-[12px] font-bold text-slate-500">/mo</span>
                        </div>
                        <p className="text-[12px] font-bold text-purple-600 mt-2 bg-purple-50 inline-block px-2 py-1 border border-purple-200 rounded-sm">Unlimited Students</p>
                      </div>
                      <ul className="text-[12px] font-semibold text-slate-600 space-y-3 flex-1 mb-6">
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-[#0055a5] shrink-0" /> <span className="font-bold text-slate-800">All Starter Features</span></li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> SEO Marketing Website</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Advanced Student CRM</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Automatic Fee Reminders</li>
                        <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Dedicated Account Manager</li>
                      </ul>
                      <button 
                        onClick={() => initiateCheckout("Enterprise Plan", 2499)}
                        className="w-full py-2.5 border-2 border-[#0055a5] text-[#0055a5] font-bold text-[13px] hover:bg-[#0055a5] hover:text-white transition-colors rounded-sm shadow-sm"
                      >
                        Select Enterprise
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* IRCTC-STYLE PAYMENT GATEWAY CHECKOUT                     */
              /* ======================================================== */
              <div className="animate-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setIsCheckout(false)} 
                  className="mb-4 flex items-center gap-1 text-[12px] font-bold text-[#0055a5] hover:underline"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Plans
                </button>

                <div className="border border-gray-300 bg-white shadow-sm rounded-sm">
                  <div className="p-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                    <div>
                      <h2 className="text-[16px] font-bold text-black font-serif">Payment Methods</h2>
                      <p className="text-[12px] text-gray-500 mt-0.5">Complete payment for {selectedPlanName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount to Pay</div>
                      <div className="text-[20px] font-black text-[#e65100]">₹{selectedPlanPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row min-h-[450px]">
                    
                    {/* LEFT MENU (IRCTC Style vertical tabs) */}
                    <div className="w-full md:w-[260px] bg-[#f5f5f5] border-r border-gray-300 flex flex-col py-2">
                      {[
                        { id: "cards", label: "IRCTC iPay (Credit Card/Debit Card/UPI)", icon: CardIcon },
                        { id: "multiple", label: "Multiple Payment Service", icon: Zap },
                        { id: "netbanking", label: "Netbanking", icon: Building2 },
                        { id: "pg", label: "Payment Gateway / Credit Card / Debit Card", icon: CardIcon },
                        { id: "wallets", label: "Wallets / Cash Card", icon: Wallet },
                        { id: "emi", label: "EMI", icon: Clock }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`px-4 py-3.5 text-left text-[12px] border-y border-transparent flex items-center gap-3 transition-colors ${
                            paymentMethod === method.id 
                              ? "bg-[#e2e2e2] border-l-4 border-l-[#ff7722] text-black font-bold border-y-gray-300/50" 
                              : "text-gray-700 hover:bg-[#e8e8e8] border-l-4 border-l-transparent font-medium"
                          }`}
                        >
                          <method.icon className={`w-4 h-4 ${paymentMethod === method.id ? 'text-[#ff7722]' : 'text-gray-500'}`} />
                          <span className="leading-tight">{method.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* RIGHT PANEL (Gateways) */}
                    <div className="flex-1 bg-white p-4 flex flex-col">
                      <div className="flex-1 space-y-3">
                        {paymentMethod === "multiple" ? (
                          <>
                            <GatewayCard 
                              id="payu" 
                              title="Credit & Debit cards /Net Banking/Wallets/UPI/ International Cards" 
                              provider="Powered by PayU" 
                              logoText="PayU" 
                              logoColor="bg-green-500"
                              selected={selectedGateway === "payu"} 
                              onClick={() => setSelectedGateway("payu")} 
                            />
                            <GatewayCard 
                              id="razorpay" 
                              title="Credit & Debit cards / Net Banking / UPI" 
                              provider="Powered by Razorpay" 
                              logoText="Razorpay" 
                              logoColor="bg-blue-600"
                              selected={selectedGateway === "razorpay"} 
                              onClick={() => setSelectedGateway("razorpay")} 
                            />
                            <GatewayCard 
                              id="phonepe" 
                              title="Credit & Debit cards / Wallet / UPI" 
                              provider="Powered by PhonePe" 
                              logoText="PhonePe" 
                              logoColor="bg-purple-600"
                              selected={selectedGateway === "phonepe"} 
                              onClick={() => setSelectedGateway("phonepe")} 
                            />
                            <GatewayCard 
                              id="amazon" 
                              title="Amazon Pay Wallet" 
                              provider="" 
                              logoText="pay" 
                              logoColor="bg-slate-800"
                              selected={selectedGateway === "amazon"} 
                              onClick={() => setSelectedGateway("amazon")} 
                            />
                            <GatewayCard 
                              id="plural" 
                              title="International/Domestic Credit/Debit Cards" 
                              provider="Powered by Plural" 
                              logoText="plural" 
                              logoColor="bg-fuchsia-700"
                              selected={selectedGateway === "plural"} 
                              onClick={() => setSelectedGateway("plural")} 
                            />
                          </>
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8">
                            <ShieldCheck className="w-12 h-12 text-gray-300 mb-3" />
                            <h4 className="text-gray-600 font-bold text-[13px]">Please select "Multiple Payment Service"</h4>
                            <p className="text-[12px] text-gray-400 mt-1 max-w-xs">For the highest success rate and UPI options, use the Multiple Payment Service tab.</p>
                          </div>
                        )}
                      </div>

                      {/* BOTTOM ACTION BAR (IRCTC Style Orange Button) */}
                      <div className="mt-6 pt-4 flex justify-center gap-3">
                        <button 
                          onClick={() => setIsCheckout(false)}
                          className="px-10 py-2 border border-gray-300 bg-gray-100 text-black text-[14px] font-bold hover:bg-gray-200 transition-colors rounded-sm"
                        >
                          Back
                        </button>
                        <button 
                          onClick={() => alert(`Initiating secure payment of ₹${selectedPlanPrice} via ${selectedGateway.toUpperCase()}`)}
                          className="px-12 py-2 bg-[#ff7722] hover:bg-[#e66a1f] text-white text-[14px] font-bold shadow-sm transition-colors rounded-sm border border-[#d9621a]"
                        >
                          Pay & Book
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}

// ------------------------------------------------------------------
// REUSABLE COMPONENTS
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
      <label className="w-[160px] shrink-0 text-right pr-3 text-[12px] text-gray-700 font-bold pt-1.5 leading-tight">
        {required && <span className="text-[#cc0000] font-black">*</span>} {label}
      </label>
      <div className="flex-1">
        {isTextArea ? (
          <textarea 
            defaultValue={defaultValue} 
            disabled={disabled}
            className="w-full border border-gray-300 p-2 text-[12px] text-gray-900 focus:border-[#0055a5] focus:ring-1 focus:ring-[#0055a5] outline-none h-16 resize-none disabled:bg-gray-100 disabled:text-gray-500 transition-colors rounded-sm shadow-inner" 
          />
        ) : isSelect ? (
          <select 
            disabled={disabled}
            className="w-full border border-gray-300 p-1.5 text-[12px] text-gray-900 focus:border-[#0055a5] focus:ring-1 focus:ring-[#0055a5] outline-none h-[30px] disabled:bg-gray-100 disabled:text-gray-500 transition-colors cursor-pointer rounded-sm shadow-inner"
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
            className="w-full border border-gray-300 p-1.5 text-[12px] text-gray-900 focus:border-[#0055a5] focus:ring-1 focus:ring-[#0055a5] outline-none h-[30px] disabled:bg-gray-100 disabled:text-gray-500 transition-colors rounded-sm shadow-inner" 
          />
        )}
      </div>
    </div>
  );
}

function GatewayCard({ 
  title, provider, logoText, logoColor, selected, onClick 
}: { 
  id: string, title: string, provider: string, logoText: string, logoColor: string, selected: boolean, onClick: () => void 
}) {
  return (
    <div 
      onClick={onClick}
      className={`p-3 border rounded-sm cursor-pointer transition-all flex items-center gap-4 ${
        selected ? "border-[#0055a5] shadow-[0_0_0_1px_#0055a5]" : "border-gray-300 hover:border-gray-400"
      }`}
    >
      <div className={`w-10 h-10 ${logoColor} rounded-full flex items-center justify-center text-white text-[10px] font-black italic tracking-tighter shrink-0`}>
        {logoText}
      </div>
      <div className="flex-1 flex flex-wrap items-center gap-1">
        <span className="text-[13px] font-bold text-black">{title}</span>
        {provider && <span className="text-[12px] font-medium text-gray-600">{provider}</span>}
      </div>
      <div className="w-5 h-5 flex shrink-0">
        <div className={`w-full h-full rounded-full border-2 flex items-center justify-center ${selected ? 'border-[#0055a5]' : 'border-gray-300'}`}>
          {selected && <div className="w-2.5 h-2.5 bg-[#0055a5] rounded-full"></div>}
        </div>
      </div>
    </div>
  );
}