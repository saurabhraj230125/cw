"use client";

import { useState } from "react";
import { 
  Save, RefreshCw, CreditCard, 
  CheckCircle2, ShieldCheck,
  Clock, AlertTriangle, ChevronRight, Check,
  Building2, Lock, Smartphone, ArrowLeft, QrCode, Copy, Info
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
  
  // Modern SaaS Payment State
  const [paymentMethod, setPaymentMethod] = useState("upi_qr");
  const [utrNumber, setUtrNumber] = useState("");
  const [copied, setCopied] = useState(false);

  const upiId = "7080626215@ybl";

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  const initiateCheckout = (name: string, price: number) => {
    setSelectedPlanName(name);
    setSelectedPlanPrice(price);
    setIsCheckout(true);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const plans = [
    {
      id: "essential",
      name: "Essential",
      price: 799,
      capacity: "Up to 100 Students",
      features: ["Student Records", "Global Attendance", "Fee Management", "Course & Batch Master"],
      locked: ["DPP & Study Material", "Online Tests", "Analytics & CRM"],
      color: "blue"
    },
    {
      id: "starter",
      name: "Starter",
      price: 1499,
      capacity: "Up to 500 Students",
      features: ["All Essential Features", "DPP & Study Material", "Online Tests", "Analytics & Reports", "System Alerts", "Manual WhatsApp"],
      locked: ["Marketing Website", "Automated CRM"],
      color: "orange",
      popular: true
    },
    {
      id: "pro",
      name: "Enterprise",
      price: 2499,
      capacity: "Unlimited Students",
      features: ["All Starter Features", "Marketing Website", "Student CRM", "Automatic Fee Reminders", "Dedicated Account Manager"],
      locked: [],
      color: "emerald"
    }
  ];

  return (
    <main className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-lg text-slate-800 font-bold">Institute Master Settings</h2>
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          ID: {instituteSlug}
        </span>
      </div>

      {/* 2. CLASSIC TAB ROW */}
      <div className="px-6 pt-4 bg-white border-b border-gray-200 flex gap-2 shrink-0 overflow-x-auto hide-scrollbar">
        {["General", "Branding & White-Label", "Integrations", "SaaS Billing"].map((tab) => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setIsCheckout(false); }}
            className={`px-6 py-2.5 text-[13px] font-bold rounded-t-xl transition-all whitespace-nowrap ${
              activeTab === tab 
                ? "bg-[#f8fafc] border-t border-l border-r border-gray-200 text-[#0055a5] -mb-[1px] shadow-[0_4px_0_#f8fafc]" 
                : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. SETTINGS WORKSPACE */}
      <div className="flex-1 p-6 md:p-8 bg-[#f8fafc] overflow-auto">
        
        {/* ======================================================== */}
        {/* GENERAL TAB                                              */}
        {/* ======================================================== */}
        {activeTab === "General" && (
          <div className="max-w-[1200px] border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden animate-in fade-in duration-200">
            <div className="p-8 space-y-8">
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
                <div>
                  <h3 className="text-sm text-[#0055a5] font-bold mb-5 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0055a5]"></div> Branch Address
                  </h3>
                  <Field label="Address" required isTextArea defaultValue="" />
                  <Field label="City" required isSelect options={[city.toUpperCase(), "RANCHI", "DHANBAD"]} />
                  <Field label="State" required isSelect options={["JHARKHAND", "BIHAR", "UTTAR PRADESH"]} />
                  <Field label="Pin Code" required defaultValue="" />
                </div>
                <div>
                  <h3 className="text-sm text-[#0055a5] font-bold mb-5 uppercase tracking-wider flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0055a5]"></div> Head Office
                  </h3>
                  <Field label="Address" required isTextArea defaultValue="" />
                  <Field label="City" required isSelect options={[city.toUpperCase(), "LUCKNOW", "VARANASI"]} />
                  <Field label="State" required isSelect options={["UTTAR PRADESH", "DELHI", "BIHAR"]} />
                  <Field label="Pin Code" required defaultValue="" />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border-t border-gray-200 px-8 py-5 flex justify-end gap-4">
              <button className="bg-white border border-gray-300 text-slate-700 px-6 py-2.5 text-[13px] font-bold hover:bg-slate-50 shadow-sm flex items-center gap-2 transition-colors rounded-lg">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <button onClick={handleSave} disabled={isSaving} className="bg-[#0055a5] border border-[#004080] text-white px-8 py-2.5 text-[13px] font-bold hover:bg-[#004080] shadow-sm flex items-center gap-2 transition-colors disabled:opacity-70 rounded-lg">
                {isSaving ? "Updating..." : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SAAS BILLING TAB                                         */}
        {/* ======================================================== */}
        {activeTab === "SaaS Billing" && (
          <div className="max-w-[1200px] animate-in fade-in duration-200 mx-auto">
            
            {!isCheckout ? (
              <div className="space-y-8">
                
                {/* DYNAMIC TRIAL BANNER */}
                {isFreeTrial && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between rounded-2xl overflow-hidden">
                    <div className="p-6 md:p-8 flex items-start gap-5">
                      <div className="h-14 w-14 bg-amber-100 border border-amber-300 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                        <Clock className="w-7 h-7 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                          7-Day Free Trial Active
                        </h3>
                        <div className="text-sm font-semibold text-amber-800 mt-1 flex flex-col sm:flex-row sm:gap-6">
                          <span>Expires: <span className="font-black">18 Aug 2026</span></span>
                          <span className="flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Upgrade required to unlock DPPs & Analytics</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 md:p-8 bg-white/60 backdrop-blur-sm border-l border-amber-200 md:min-w-[300px] w-full md:w-auto flex flex-col justify-center shrink-0">
                      <span className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Trial Countdown</span>
                      <div className="w-full bg-amber-100 h-2.5 rounded-full overflow-hidden shadow-inner">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="mt-2 text-right text-xs font-bold text-slate-700">
                        7 Days Remaining
                      </div>
                    </div>
                  </div>
                )}

                {/* DETAILED PRICING MATRIX */}
                <div className="bg-white border border-gray-200 shadow-xl shadow-slate-200/40 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 border-b border-gray-200 px-8 py-5 flex justify-between items-center">
                    <h2 className="text-sm font-black text-[#0055a5] uppercase tracking-widest">Select Your ERP Plan</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-gray-200">
                    
                    {/* ESSENTIAL PLAN */}
                    <div className="p-8 flex flex-col hover:bg-slate-50 transition-colors">
                      <div className="mb-6 text-center">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Essential</h3>
                        <div className="mt-3 flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-slate-400">₹</span>
                          <span className="text-4xl font-black text-slate-900 leading-none">799</span>
                          <span className="text-sm font-bold text-slate-400">/mo</span>
                        </div>
                        <div className="mt-4 inline-block bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full">Up to 100 Students</div>
                      </div>
                      <ul className="text-sm font-semibold text-slate-600 space-y-3.5 flex-1 mb-8">
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Student Records Management</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Global Attendance Tracking</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Core Fee Management</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Course & Batch Master</li>
                      </ul>
                      <button 
                        onClick={() => initiateCheckout("Essential Plan", 799)}
                        className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-[#0055a5] hover:text-[#0055a5] transition-all rounded-xl shadow-sm"
                      >
                        Select Essential
                      </button>
                    </div>

                    {/* STARTER PLAN (POPULAR) */}
                    <div className="p-8 flex flex-col bg-gradient-to-b from-[#f0f7ff] to-white relative shadow-lg z-10 scale-100 md:scale-[1.02] rounded-xl md:rounded-none border-y md:border-y-0 border-[#0055a5]/20">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0055a5]"></div>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0055a5] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                        Most Popular
                      </div>
                      <div className="mb-6 text-center">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Starter</h3>
                        <div className="mt-3 flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-slate-400">₹</span>
                          <span className="text-4xl font-black text-[#0055a5] leading-none">1,499</span>
                          <span className="text-sm font-bold text-slate-400">/mo</span>
                        </div>
                        <div className="mt-4 inline-block bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">Up to 500 Students</div>
                      </div>
                      <ul className="text-sm font-semibold text-slate-600 space-y-3.5 flex-1 mb-8">
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0" /> <span className="font-bold text-slate-900">All Essential Features</span></li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> DPP & Study Material Hub</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Online Test Engine</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Analytics & Custom Reports</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> System Alerts & Notifications</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Manual WhatsApp Messaging</li>
                      </ul>
                      <button 
                        onClick={() => initiateCheckout("Starter Plan", 1499)}
                        className="w-full py-3 bg-[#0055a5] text-white font-bold text-sm hover:bg-[#004080] shadow-lg hover:shadow-xl transition-all rounded-xl transform hover:-translate-y-0.5"
                      >
                        Select Starter
                      </button>
                    </div>

                    {/* ENTERPRISE PLAN */}
                    <div className="p-8 flex flex-col hover:bg-slate-50 transition-colors">
                      <div className="mb-6 text-center">
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Enterprise</h3>
                        <div className="mt-3 flex items-baseline justify-center gap-1">
                          <span className="text-lg font-bold text-slate-400">₹</span>
                          <span className="text-4xl font-black text-slate-900 leading-none">2,499</span>
                          <span className="text-sm font-bold text-slate-400">/mo</span>
                        </div>
                        <div className="mt-4 inline-block bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full">Unlimited Students</div>
                      </div>
                      <ul className="text-sm font-semibold text-slate-600 space-y-3.5 flex-1 mb-8">
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0" /> <span className="font-bold text-slate-900">All Starter Features</span></li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> SEO Marketing Website</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Advanced Student CRM</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Automatic Fee Reminders</li>
                        <li className="flex items-start gap-2.5"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> Dedicated Account Manager</li>
                      </ul>
                      <button 
                        onClick={() => initiateCheckout("Enterprise Plan", 2499)}
                        className="w-full py-3 border-2 border-slate-200 text-slate-700 font-bold text-sm hover:border-[#0055a5] hover:text-[#0055a5] transition-all rounded-xl shadow-sm"
                      >
                        Select Enterprise
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            ) : (
              /* ======================================================== */
              /* MODERN SAAS CHECKOUT & QR PAYMENT UI                     */
              /* ======================================================== */
              <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
                <button 
                  onClick={() => setIsCheckout(false)} 
                  className="mb-6 flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-[#0055a5] transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Pricing
                </button>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
                  
                  {/* Checkout Header */}
                  <div className="bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white">
                    <div>
                      <h2 className="text-2xl font-black tracking-tight">{selectedPlanName}</h2>
                      <p className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure encrypted checkout
                      </p>
                    </div>
                    <div className="text-right bg-white/10 px-6 py-3 rounded-xl border border-white/10 backdrop-blur-md">
                      <div className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-1">Total Due</div>
                      <div className="text-3xl font-black text-white leading-none">₹{selectedPlanPrice.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row min-h-[500px]">
                    
                    {/* LEFT MENU (Clean, Modern Tabs) */}
                    <div className="w-full md:w-[280px] bg-slate-50 border-r border-slate-200 p-4 space-y-2">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 mb-4 mt-2">Payment Method</div>
                      {[
                        { id: "upi_qr", label: "UPI & QR Code", icon: QrCode },
                        { id: "cards", label: "Credit / Debit Card", icon: CreditCard },
                        { id: "netbanking", label: "Netbanking", icon: Building2 },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full px-4 py-3.5 text-left text-sm font-bold rounded-xl flex items-center gap-3 transition-all ${
                            paymentMethod === method.id 
                              ? "bg-white text-[#0055a5] shadow-sm border border-slate-200" 
                              : "text-slate-600 hover:bg-slate-100 border border-transparent"
                          }`}
                        >
                          <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-[#0055a5]' : 'text-slate-400'}`} />
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {/* RIGHT PANEL (Payment Content) */}
                    <div className="flex-1 bg-white p-8 flex flex-col">
                      
                      <div className="flex-1">
                        
                        {/* THE UPI QR CODE FLOW (Recommended) */}
                        {paymentMethod === "upi_qr" && (
                          <div className="max-w-sm mx-auto w-full animate-in fade-in duration-300">
                            
                            <div className="text-center mb-6">
                              <h3 className="text-lg font-black text-slate-900 mb-1">Scan to Pay</h3>
                              <p className="text-sm font-medium text-slate-500">Open GPay, PhonePe, or Paytm</p>
                            </div>
                            
                            {/* Premium QR Frame */}
                            <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center relative group">
                              <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none"></div>
                              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 relative z-10">
                                <img 
                                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=CoachingWala&am=${selectedPlanPrice}&cu=INR`} 
                                  alt="UPI QR Code" 
                                  className="w-48 h-48 object-contain"
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 my-6">
                              <div className="h-px bg-slate-200 flex-1"></div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">OR</span>
                              <div className="h-px bg-slate-200 flex-1"></div>
                            </div>

                            {/* Copy UPI ID */}
                            <div className="mb-8">
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Pay to UPI ID</label>
                              <div 
                                onClick={handleCopyUpi}
                                className="flex items-center justify-between bg-slate-50 px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#0055a5] hover:bg-blue-50 transition-colors group"
                              >
                                <div className="flex items-center gap-3">
                                  <Smartphone className="w-5 h-5 text-slate-400 group-hover:text-[#0055a5]" />
                                  <span className="text-sm font-black text-slate-700 font-mono tracking-wide">{upiId}</span>
                                </div>
                                {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
                              </div>
                            </div>
                            
                            {/* UTR Verification */}
                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                                After payment, enter 12-digit UTR
                              </label>
                              <input 
                                type="text" 
                                value={utrNumber}
                                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                                placeholder="e.g. 312345678901" 
                                maxLength={12}
                                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-sm font-black text-slate-900 outline-none focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 shadow-sm text-center tracking-widest placeholder:tracking-normal placeholder:font-medium placeholder:text-slate-300 transition-all" 
                              />
                            </div>
                          </div>
                        )}

                        {/* CARDS / NETBANKING FALLBACK */}
                        {paymentMethod !== "upi_qr" && (
                          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center mb-6">
                              {paymentMethod === "cards" ? <CreditCard className="w-8 h-8 text-slate-400" /> : <Building2 className="w-8 h-8 text-slate-400" />}
                            </div>
                            <h4 className="text-lg font-black text-slate-800 mb-2">Secure Gateway Integration</h4>
                            <p className="text-sm font-medium text-slate-500 max-w-sm mb-8">
                              You will be redirected to our secure payment partner to complete this transaction via {paymentMethod === "cards" ? "Credit / Debit Card" : "Netbanking"}.
                            </p>
                            <button 
                              className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center gap-2"
                              onClick={() => alert("Redirecting to Razorpay/Stripe secure checkout...")}
                            >
                              Proceed to Gateway <ChevronRight className="w-4 h-4" />
                            </button>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-400">
                              <Lock className="w-3 h-3" /> PCI-DSS Compliant Checkout
                            </div>
                          </div>
                        )}

                      </div>

                      {/* BOTTOM ACTION BAR (Only visible for UPI flow) */}
                      {paymentMethod === "upi_qr" && (
                        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                          <div className="flex-1 flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
                            <Info className="w-4 h-4 shrink-0" /> Plan activates instantly upon UTR verification.
                          </div>
                          <button 
                            onClick={() => {
                              if (utrNumber.length !== 12) {
                                alert("Please enter exactly 12 digits for your UTR number.");
                                return;
                              }
                              alert(`Verifying UPI Payment for UTR: ${utrNumber}...`);
                            }}
                            disabled={utrNumber.length !== 12}
                            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                              utrNumber.length === 12 
                              ? 'bg-[#0055a5] text-white hover:bg-[#004080] hover:shadow-lg hover:-translate-y-0.5' 
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            }`}
                          >
                            Verify & Upgrade
                          </button>
                        </div>
                      )}
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
    <div className="flex items-start mb-3.5">
      <label className="w-[160px] shrink-0 text-right pr-4 text-xs text-slate-700 font-bold pt-2.5 uppercase tracking-wider">
        {required && <span className="text-red-500 font-black mr-1">*</span>}{label}
      </label>
      <div className="flex-1">
        {isTextArea ? (
          <textarea 
            defaultValue={defaultValue} 
            disabled={disabled}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 h-20 resize-none disabled:bg-slate-50 disabled:text-slate-400 transition-all shadow-sm" 
          />
        ) : isSelect ? (
          <select 
            disabled={disabled}
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all disabled:bg-slate-50 disabled:text-slate-400 cursor-pointer shadow-sm appearance-none"
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
            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all disabled:bg-slate-50 disabled:text-slate-400 shadow-sm" 
          />
        )}
      </div>
    </div>
  );
}