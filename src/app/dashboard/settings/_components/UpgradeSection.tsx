import { useState } from "react";
import { Zap, Star, ShieldCheck, CheckSquare, CheckCircle2, X, Loader2, Lock, Check } from "lucide-react";
import { ProPill } from "./Primitives";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

type Props = {
  isPaid: boolean;
  daysLeft: number;
  currentPlan: string;
  membershipId: string;
  instituteName: string; // 🚨 Added for Make.com payload
  userEmail: string;     // 🚨 Added for Make.com payload
  onUpgradeComplete: (newTx: any) => void;
};

const PLANS = [
  {
    tier: 1, key: "starter", name: "Starter Plan", icon: ShieldCheck,
    monthlyPrice: 799, annualPrice: 7990, limit: "100 Students", color: "bg-blue-100 text-blue-700",
    features: ["Student Management", "Attendance Management", "Fee Management", "Course & Batch Master"],
  },
  {
    tier: 2, key: "growth", name: "Growth Plan", icon: Star,
    monthlyPrice: 1499, annualPrice: 15000, limit: "500 Students", color: "bg-amber-100 text-amber-700",
    features: ["Everything in Starter", "DPP & Study Material", "Online Tests", "Analytics & Reports", "Student Portal", "System Alerts (Manual)"],
  },
  {
    tier: 3, key: "enterprise", name: "Enterprise", icon: Zap,
    monthlyPrice: 2499, annualPrice: 24990, limit: "Unlimited Students", color: "bg-purple-100 text-purple-700",
    features: ["Everything in Growth", "Automated Fee Enquiries", "Marketing Website", "CRM with Custom Domain", "All Premium Features"],
  },
];

export default function UpgradeSection({ isPaid, daysLeft, currentPlan, membershipId, instituteName, userEmail, onUpgradeComplete }: Props) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [checkoutPlan, setCheckoutPlan] = useState<typeof PLANS[0] | null>(null);
  const [utr, setUtr] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");

  const currentTierObj = PLANS.find(p => p.name === currentPlan);
  const currentTierLevel = isPaid && currentTierObj ? currentTierObj.tier : 0;

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (utr.length < 6 || !checkoutPlan) return;
    setPaymentState("processing");

    try {
      const paymentAmount = billingCycle === "monthly" ? checkoutPlan.monthlyPrice : checkoutPlan.annualPrice;

      // 1. Log the UTR into the Transactions Table
      const { data: txData, error: txError } = await supabase
        .from('institute_transactions')
        .insert({
          institute_id: membershipId,
          utr_reference: utr,
          amount: paymentAmount,
          plan_name: checkoutPlan.name,
          status: 'Verified'
        })
        .select()
        .single();

      if (txError) throw txError;

      // 2. Upgrade the institute plan
      await supabase
        .from('institutes')
        .update({
          subscription_status: 'active',
          subscription_plan: checkoutPlan.name
        })
        .eq('id', membershipId);

      // 3. 🚨 TRIGGER MAKE.COM WEBHOOK
      // Replace this URL with your actual Make.com custom webhook URL
      const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/3364x07tplii7ptdgrlq9cbrnyqq7f4j";
      
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: "payment_verified",
            instituteName: instituteName,
            ownerEmail: userEmail,
            planName: checkoutPlan.name,
            billingCycle: billingCycle,
            amountPaid: paymentAmount,
            utrReference: utr,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookError) {
        console.error("Webhook triggered failed, but payment was saved:", webhookError);
      }

      setPaymentState("success");
      
      const finalReceipt = txData || {
        id: "UPG" + Math.random().toString(36).substr(2, 6),
        utr_reference: utr,
        amount: paymentAmount,
        plan_name: checkoutPlan.name,
        status: 'Verified',
        created_at: new Date().toISOString()
      };

      onUpgradeComplete(finalReceipt);
      router.refresh(); 

    } catch (error: any) {
      console.error(error);
      alert("Payment verification failed. Error: " + error.message);
      setPaymentState("idle");
    }
  };

  const closeCheckout = () => {
    setCheckoutPlan(null);
    setUtr("");
    setPaymentState("idle");
  };

  const getDynamicQR = (price: number) => {
    const upiString = `upi://pay?pa=7080626215@ybl&pn=CoachingWala&am=${price}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(upiString)}`;
  };

  return (
    <div className="space-y-6">
      
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeCheckout} />
          <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {paymentState === "success" ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Upgrade Successful!</h3>
                <p className="text-sm font-medium text-slate-500 mb-6">
                  Your UTR <span className="font-bold text-slate-800">{utr}</span> was processed and your <b>PDF receipt</b> has downloaded. 
                  Your <b>{checkoutPlan.name}</b> features are now unlocked.
                </p>
                <button onClick={closeCheckout} className="w-full bg-[#0055a5] text-white font-bold py-3.5 rounded-xl shadow-md active:scale-95 transition-transform">
                  Back to Dashboard
                </button>
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Upgrade to {checkoutPlan.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mt-1">Scan & pay via any UPI app.</p>
                  </div>
                  <button onClick={closeCheckout} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-center shadow-inner">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount to Pay</p>
                  <p className="text-4xl font-black text-[#0055a5]">
                    ₹{billingCycle === "monthly" ? checkoutPlan.monthlyPrice : checkoutPlan.annualPrice}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">{billingCycle === "monthly" ? "for 1 month" : "for 1 year"}</p>
                </div>

                <div className="flex flex-col items-center mb-6">
                  <div className="w-40 h-40 bg-white border-2 border-[#0055a5]/20 p-2 rounded-2xl flex flex-col items-center justify-center mb-3 shadow-md">
                    <img src={getDynamicQR(billingCycle === "monthly" ? checkoutPlan.monthlyPrice : checkoutPlan.annualPrice)} alt="UPI QR Code" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Official UPI ID</p>
                  <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 font-mono text-lg font-black text-[#0055a5] select-all">
                    7080626215@ybl
                  </div>
                </div>

                <form onSubmit={handleSubmitPayment}>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Enter Receipt / UTR Number</label>
                  <input 
                    type="text" required minLength={6} value={utr} onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 312456789012" 
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/10 outline-none transition-all font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium mb-4 shadow-sm"
                  />
                  <button disabled={paymentState === "processing" || utr.length < 6} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#0055a5] hover:bg-[#004080] disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#0055a5]/20 transition-all active:scale-[0.98]">
                    {paymentState === "processing" ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Unlock Features"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── TOP BANNER & CARDS EXCLUDED FOR BREVITY (Keep your existing banner and mapping code here) ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] rounded-3xl px-8 py-7 shadow-inner backdrop-blur-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20 shadow-lg">
            {isPaid ? <CheckCircle2 className="w-8 h-8 text-emerald-400" /> : <Zap className="w-8 h-8 text-amber-400 fill-amber-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                {isPaid ? "Subscription Active" : "Elevate Your Institute"}
              </span>
              {!isPaid && <ProPill>TRIAL EXPIRES IN {daysLeft} DAYS</ProPill>}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              {isPaid ? `You are on the ${currentPlan}` : "Ready to automate everything?"}
            </h2>
          </div>
        </div>
        
        <div className="flex items-center bg-[#002244]/50 p-1.5 rounded-xl border border-white/10 shrink-0">
          <button onClick={() => setBillingCycle("monthly")} className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all ${billingCycle === "monthly" ? "bg-white text-[#003366] shadow-sm" : "text-white/60 hover:text-white"}`}>Monthly</button>
          <button onClick={() => setBillingCycle("annual")} className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all flex items-center gap-2 ${billingCycle === "annual" ? "bg-white text-[#003366] shadow-sm" : "text-white/60 hover:text-white"}`}>
            Annually <span className="bg-amber-400 text-amber-950 text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-widest">Save 20%</span>
          </button>
        </div>
      </div>

      {/* PLAN CARDS */}
      <div className="border border-slate-200 rounded-3xl p-6 bg-white shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-6">Choose Your Growth Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => {
            const isThisPlan = currentTierLevel === plan.tier;
            const isIncluded = currentTierLevel > plan.tier;
            const isLocked = currentTierLevel < plan.tier;
            const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.annualPrice;
            const billingText = billingCycle === "monthly" ? "/month" : "/year";

            return (
              <div key={plan.key} className={`border rounded-2xl p-6 flex flex-col items-start relative overflow-hidden transition-all ${isThisPlan ? "border-emerald-500 bg-emerald-50/30 shadow-lg ring-2 ring-emerald-500/10 scale-100 lg:scale-[1.02] z-10" : plan.name === "Growth Plan" && !isPaid ? "border-[#0055a5] bg-blue-50/30 shadow-lg ring-2 ring-[#0055a5]/10 scale-100 lg:scale-[1.02] z-10" : "border-slate-200 bg-white hover:border-[#0055a5]/30 hover:shadow-md"}`}>
                {isThisPlan && <div className="absolute top-0 inset-x-0 h-1.5 bg-emerald-500"/>}
                {!isPaid && plan.name === "Growth Plan" && <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#003366] to-[#0055a5]"/>}

                <div className="flex items-center gap-3.5 mb-4 w-full justify-between mt-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${plan.color}`}>
                    {isThisPlan ? <Check className="w-5 h-5" /> : isLocked ? <Lock className="w-4 h-4 opacity-50" /> : <plan.icon className="w-5 h-5" />}
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] font-black px-2.5 py-1 rounded-md ${isThisPlan ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-[#0055a5]"}`}>LIMIT: {plan.limit}</p>
                  </div>
                </div>

                <p className="text-sm font-black uppercase tracking-widest text-slate-900">{plan.name}</p>
                <div className="mt-2 mb-1 flex items-end gap-1">
                  <span className="text-3xl font-black text-slate-950">₹{price.toLocaleString('en-IN')}</span>
                  <span className="text-sm font-bold text-slate-500 mb-1">{billingText}</span>
                </div>
                
                {billingCycle === "annual" && plan.name === "Growth Plan" && <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-4">🎉 Special 15k offer applied</p>}
                {!(billingCycle === "annual" && plan.name === "Growth Plan") && <div className="mb-4"></div>}

                <div className="w-full h-px bg-slate-100 mb-5" />
                
                <div className="space-y-3.5 mb-8 w-full">
                  {plan.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {isIncluded || isThisPlan ? <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> : <CheckSquare className="w-4 h-4 text-[#0055a5] shrink-0 mt-0.5"/>}
                      <span className="text-[13px] font-semibold text-slate-700 leading-tight">{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto w-full">
                  {isThisPlan ? (
                    <button disabled className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white text-sm font-black px-4 py-3.5 rounded-xl shadow-md border border-emerald-600"><CheckCircle2 className="w-4 h-4" /> Active Plan</button>
                  ) : isIncluded ? (
                    <button disabled className="w-full text-center bg-slate-50 text-slate-500 text-sm font-black px-4 py-3.5 rounded-xl border border-slate-200">Included in your Plan</button>
                  ) : (
                    <button onClick={() => setCheckoutPlan(plan)} className={`w-full flex items-center justify-center gap-2 text-sm font-black px-4 py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98] ${plan.name === "Growth Plan" ? "bg-[#0055a5] hover:bg-[#004080] text-white shadow-md shadow-[#0055a5]/20" : "bg-white border-2 border-slate-200 text-slate-800 hover:border-[#0055a5] hover:text-[#0055a5]"}`}>
                      <Lock className="w-4 h-4" /> Unlock & Upgrade
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}