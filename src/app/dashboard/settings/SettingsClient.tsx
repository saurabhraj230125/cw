"use client";

import { useState } from "react";
import { 
  Save, RefreshCw, 
  CheckCircle2, ShieldCheck,
  Clock, AlertTriangle, ChevronRight, Check,
  Building2, Smartphone, ArrowLeft, QrCode, Copy,
  Loader2, Sparkles, Lock
} from "lucide-react";
import { submitUtrPaymentAction } from "../../actions/billing";

export default function SettingsClient({
  userEmail = "admin@institute.com",
  instituteName = "My Institute",
  instituteSlug = "my-institute",
  city = "Bokaro",
  isTrialExpired = false,
  daysLeft = 7,
  isPaid = false,
  currentPlan = "Free Trial",
  activePendingPayment = null 
}: {
  userEmail?: string;
  instituteName?: string;
  instituteSlug?: string;
  city?: string;
  isTrialExpired?: boolean;
  daysLeft?: number;
  isPaid?: boolean;
  currentPlan?: string;
  activePendingPayment?: any;
}) {
  const [activeTab, setActiveTab] = useState("SaaS Billing");
  const [isSaving, setIsSaving] = useState(false);
  
  // Clean Plan State (No add-ons)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("starter");
  
  // Checkout & Payment State
  const [isCheckout, setIsCheckout] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const upiId = "7080626215@ybl";

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1200);
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUtrSubmit = async () => {
    if (utrNumber.length < 12) {
      alert("Please enter a valid 12-digit UTR number.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await submitUtrPaymentAction(selectedPlanId as any, billingCycle, utrNumber);
      setIsCheckout(false);
      setIsSubmitting(false);
      window.location.reload(); 
    } catch (error: any) {
      setIsSubmitting(false);
      alert(`Submission Error: ${error.message}`);
    }
  };

  const plans = [
    {
      id: "essential",
      name: "Essential",
      priceMonthly: 799,
      priceYearly: 7999,
      capacity: "Up to 100 Students",
      desc: "Core administrative tools for individual tutors and emerging batch centers.",
      features: [
        "Student Records & Directory",
        "Global Attendance Tracking",
        "Core Fee Ledger Management",
        "Course & Batch Master Setup"
      ]
    },
    {
      id: "starter",
      name: "Starter",
      priceMonthly: 1499,
      priceYearly: 14999,
      capacity: "Up to 500 Students",
      desc: "Our most popular module for established coaching institutes seeking total automation.",
      features: [
        "All Essential Features Included",
        "DPP & Study Material Hub",
        "Online Test & Quiz Engine",
        "Advanced Analytics & Reports",
        "Automated System Alerts",
        "Manual Broadcast Messaging"
      ],
      popular: true
    },
    {
      id: "pro",
      name: "Enterprise",
      priceMonthly: 2499,
      priceYearly: 24999,
      capacity: "Unlimited Students",
      desc: "Full white-glove infrastructure for large institutions and multi-branch networks.",
      features: [
        "All Starter Features Included",
        "Dedicated SEO Marketing Website",
        "Advanced Student CRM & Pipeline",
        "Automated WhatsApp Fee Reminders",
        "Priority 24/7 Account Manager"
      ]
    }
  ];

  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[1];
  const finalTotal = billingCycle === "yearly" ? activePlan.priceYearly : activePlan.priceMonthly;

  return (
    <main className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col relative">
      
      {/* 1. TOP HEADER */}
      <div className="px-6 py-4 border-b border-gray-200 bg-white shrink-0 flex justify-between items-center shadow-sm z-20 relative">
        <h2 className="text-lg text-slate-800 font-bold">Institute Master Settings</h2>
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
          ID: {instituteSlug.toUpperCase()}
        </span>
      </div>

      {/* 2. TAB ROW */}
      <div className="px-6 pt-4 bg-white border-b border-gray-200 flex gap-2 shrink-0 overflow-x-auto hide-scrollbar z-10 relative">
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

      {/* 3. WORKSPACE */}
      <div className="flex-1 p-6 md:p-10 bg-[#f8fafc] overflow-auto pb-36">
        
        {activeTab === "General" && (
          <div className="max-w-[1200px] border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden mx-auto">
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
            </div>
            <div className="bg-slate-50 border-t border-gray-200 px-8 py-5 flex justify-end gap-4">
              <button onClick={handleSave} disabled={isSaving} className="bg-[#0055a5] border border-[#004080] text-white px-8 py-2.5 text-[13px] font-bold hover:bg-[#004080] shadow-sm rounded-lg">
                {isSaving ? "Updating..." : <><Save className="w-4 h-4 inline mr-2" /> Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {activeTab === "SaaS Billing" && (
          <div className="max-w-[1100px] animate-in fade-in duration-200 mx-auto">
            
            {/* PENDING STATE */}
            {activePendingPayment ? (
              <div className="bg-white border border-blue-200 shadow-xl shadow-blue-900/5 rounded-3xl p-12 text-center max-w-2xl mx-auto mt-10">
                <div className="w-24 h-24 bg-blue-50 border-4 border-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <Clock className="w-10 h-10 text-[#0055a5] animate-pulse" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Payment Verification in Progress</h2>
                <p className="text-lg font-medium text-slate-500 mb-10 leading-relaxed">
                  We received your UTR reference <span className="font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded shadow-sm">{activePendingPayment.utr}</span> for the <span className="font-bold text-[#0055a5] uppercase">{activePendingPayment.plan_id}</span> plan. Our team is verifying the funds.
                </p>
                <div className="bg-blue-50 text-[#0055a5] text-sm font-bold px-6 py-4 rounded-xl border border-blue-200 flex items-center justify-center gap-3 w-max mx-auto shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin" /> Usually verified within 15-30 minutes.
                </div>
              </div>
            ) : !isCheckout ? (
              
              <div className="space-y-10">
                
                {/* SUBSCRIPTION BANNER */}
                {isPaid ? (
                  <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-300 shadow-sm flex flex-col md:flex-row items-center justify-between rounded-2xl p-6 md:p-8">
                    <div className="flex items-center gap-5">
                      <div className="h-14 w-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center shadow-md"><ShieldCheck className="w-8 h-8" /></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full">Active Subscription</span>
                          <h3 className="text-xl font-black text-slate-900 uppercase">{currentPlan}</h3>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 mt-1">Your workspace is fully verified. All institutional modules are unlocked.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`border shadow-sm flex flex-col md:flex-row items-center justify-between rounded-2xl overflow-hidden p-6 md:p-8 ${isTrialExpired ? 'bg-red-50 border-red-200' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'}`}>
                    <div className="flex items-start gap-5">
                      <div className={`h-14 w-14 border rounded-2xl flex items-center justify-center ${isTrialExpired ? 'bg-red-100 border-red-300 text-red-600' : 'bg-amber-100 border-amber-300 text-amber-600'}`}>
                        <Clock className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-black uppercase ${isTrialExpired ? 'text-red-700' : 'text-slate-900'}`}>{isTrialExpired ? 'Trial Expired - Workspace Locked' : '7-Day Free Trial Active'}</h3>
                        <p className={`text-sm font-semibold mt-1 ${isTrialExpired ? 'text-red-600' : 'text-amber-800'}`}>
                          {isTrialExpired ? 'Please select a plan below to restore administrative access.' : `${daysLeft} days remaining before trial lock.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* BILLING CYCLE SWITCHER */}
                <div className="flex flex-col items-center">
                  <div className="bg-white border border-slate-200 p-1.5 rounded-full flex items-center shadow-sm relative">
                    <div className={`absolute top-1.5 bottom-1.5 w-[50%] bg-[#0055a5] rounded-full shadow-md transition-all duration-300 ease-out ${billingCycle === 'monthly' ? 'left-1.5' : 'left-[calc(50%-6px)]'}`}></div>
                    <button onClick={() => setBillingCycle("monthly")} className={`relative z-10 w-36 py-2.5 text-sm font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly Billing</button>
                    <button onClick={() => setBillingCycle("yearly")} className={`relative z-10 w-36 py-2.5 text-sm font-bold flex justify-center gap-1.5 ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                      Yearly <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${billingCycle === 'yearly' ? 'bg-white text-[#0055a5]' : 'bg-emerald-500 text-white'}`}>Save 20%</span>
                    </button>
                  </div>
                </div>

                {/* BEAUTIFUL UNIFIED PRICING GRID (NO SHRINKING) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const price = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;

                    return (
                      <div 
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`bg-white rounded-3xl border-2 transition-all cursor-pointer flex flex-col p-8 relative shadow-sm hover:shadow-md ${
                          isSelected ? 'border-[#0055a5] ring-4 ring-blue-500/10 bg-gradient-to-b from-blue-50/20 to-white' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0055a5] text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                            Most Popular Choice
                          </div>
                        )}

                        <div className="mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</h3>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#0055a5] bg-[#0055a5]' : 'border-slate-300'}`}>
                              {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </div>
                          <p className="text-xs font-semibold text-slate-500 min-h-[32px]">{plan.desc}</p>
                        </div>

                        <div className="mb-6 pb-6 border-b border-slate-100">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-slate-400">₹</span>
                            <span className="text-4xl font-black text-slate-900 tracking-tight">{price.toLocaleString('en-IN')}</span>
                            <span className="text-xs font-bold text-slate-400">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                          </div>
                          <div className="mt-3 inline-block bg-slate-100 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-md">{plan.capacity}</div>
                        </div>

                        <div className="space-y-4 flex-1 mb-8">
                          <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">What's included</div>
                          <ul className="space-y-3">
                            {plan.features.map((feat, i) => (
                              <li key={i} className="flex items-start gap-2.5 text-xs font-bold text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedPlanId(plan.id); setIsCheckout(true); }}
                          className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all ${
                            isSelected ? 'bg-[#0055a5] text-white hover:bg-[#004080] shadow-blue-900/10' : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          Select {plan.name} Plan
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* STICKY CHECKOUT BAR */}
                <div className="fixed bottom-0 left-0 md:left-[250px] right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 z-40 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                      <ShieldCheck className="w-6 h-6 text-[#0055a5]" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">{activePlan.name} Plan <span className="text-slate-400 font-medium text-xs">({billingCycle})</span></h3>
                      <p className="text-xs font-bold text-emerald-600">Selected capacity: {activePlan.capacity}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Payable</div>
                      <div className="text-2xl font-black text-[#0055a5] leading-none">₹{finalTotal.toLocaleString('en-IN')}</div>
                    </div>
                    <button 
                      onClick={() => setIsCheckout(true)}
                      className="flex-1 md:flex-none px-10 py-3.5 bg-[#e65100] hover:bg-[#cc4800] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      Proceed to UPI Checkout <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              
              /* ======================================================== */
              /* CLEAN UPI & UTR CHECKOUT FLOW                            */
              /* ======================================================== */
              <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300 mb-10">
                <button onClick={() => setIsCheckout(false)} className="mb-6 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0055a5] transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Plan Selection
                </button>

                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-900 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white">
                    <div>
                      <h2 className="text-2xl font-black text-white">{activePlan.name} Subscription</h2>
                      <p className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" /> Billed {billingCycle} • Secure Manual UTR Verification
                      </p>
                    </div>
                    <div className="text-right bg-white/10 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Amount Due</div>
                      <div className="text-3xl font-black text-emerald-400 leading-none">₹{finalTotal.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-[340px] bg-slate-50 border-r border-slate-200 p-8 flex flex-col">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Payment Guidelines</h3>
                      <div className="space-y-6 relative flex-1">
                        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-slate-200"></div>
                        <div className="flex gap-4 relative z-10"><div className="w-8 h-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center shrink-0 shadow-sm"><Smartphone className="w-3 h-3 text-slate-500" /></div><div className="pt-1.5"><h4 className="text-xs font-bold text-slate-800">1. Open any UPI app</h4></div></div>
                        <div className="flex gap-4 relative z-10"><div className="w-8 h-8 bg-blue-50 border-2 border-[#0055a5] rounded-full flex items-center justify-center shrink-0 shadow-sm"><QrCode className="w-3 h-3 text-[#0055a5]" /></div><div className="pt-1.5"><h4 className="text-xs font-bold text-[#0055a5]">2. Scan QR or copy ID</h4></div></div>
                        <div className="flex gap-4 relative z-10"><div className="w-8 h-8 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center shrink-0 shadow-sm"><Building2 className="w-3 h-3 text-slate-500" /></div><div className="pt-1.5"><h4 className="text-xs font-bold text-slate-800">3. Submit 12-digit UTR</h4></div></div>
                      </div>
                    </div>

                    <div className="flex-1 bg-white p-8 md:p-10 flex flex-col justify-center items-center">
                      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                        <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-300 w-full flex flex-col items-center shadow-sm relative mb-6">
                          <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 mb-4 w-[180px] h-[180px] flex items-center justify-center">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=${upiId}&pn=CoachingWala&am=${finalTotal}&cu=INR`} alt="UPI QR Code" className="w-full h-full object-contain" />
                          </div>
                          <div onClick={handleCopyUpi} className="flex items-center justify-between w-full bg-white px-4 py-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#0055a5] transition-colors shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <Smartphone className="w-4 h-4 text-slate-400 shrink-0" />
                              <span className="text-xs font-bold text-slate-700 font-mono truncate">{upiId}</span>
                            </div>
                            {copied ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <Copy className="w-4 h-4 text-slate-400 shrink-0" />}
                          </div>
                        </div>
                        
                        <div className="w-full bg-[#f8fafc] p-6 rounded-2xl border border-slate-200 shadow-sm">
                          <label className="block text-[11px] font-black text-slate-600 uppercase tracking-widest mb-3 text-center">Enter 12-digit UTR Reference</label>
                          <input 
                            type="text" 
                            value={utrNumber} 
                            onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))} 
                            placeholder="312345678901" 
                            maxLength={12} 
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3.5 text-base font-black text-slate-900 outline-none focus:border-[#0055a5] focus:ring-2 shadow-sm text-center tracking-[0.2em] mb-4" 
                          />
                          <button 
                            onClick={handleUtrSubmit} 
                            disabled={utrNumber.length !== 12 || isSubmitting} 
                            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 ${
                              utrNumber.length === 12 ? 'bg-[#0055a5] text-white hover:bg-[#004080]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Transmitting...</> : <>Submit UTR for Verification <ChevronRight className="w-4 h-4" /></>}
                          </button>
                        </div>
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

function Field({ label, required = false, defaultValue = "", type = "text", disabled = false, isTextArea = false, isSelect = false, options = [] }: any) {
  return (
    <div className="flex items-start mb-3.5">
      <label className="w-[160px] shrink-0 text-right pr-4 text-xs text-slate-700 font-bold pt-2.5 uppercase tracking-wider">
        {required && <span className="text-red-500 font-black mr-1">*</span>}{label}
      </label>
      <div className="flex-1">
        {isTextArea ? <textarea defaultValue={defaultValue} disabled={disabled} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none h-20 resize-none disabled:bg-slate-50 shadow-sm" /> : isSelect ? <select disabled={disabled} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none cursor-pointer disabled:bg-slate-50 shadow-sm appearance-none">{options.map((opt:any) => <option key={opt}>{opt}</option>)}</select> : <input type={type} defaultValue={defaultValue} disabled={disabled} className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 outline-none disabled:bg-slate-50 shadow-sm" />}
      </div>
    </div>
  );
}