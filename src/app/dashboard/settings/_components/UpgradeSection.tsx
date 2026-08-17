// src/app/dashboard/settings/_components/UpgradeSection.tsx
import { Zap, Star, ArrowRight, ShieldCheck, CheckSquare } from "lucide-react";
import { ProPill } from "./Primitives";

type Props = {
  isPaid: boolean;
  daysLeft: number;
  currentPlan: string;
};

// Plan options struct, inspired by Images
const PLANS = [
  {
    key: "growth",
    name: "Growth Plan",
    icon: ShieldCheck,
    price: "₹1,499",
    billing: "billed monthly",
    color: "bg-purple-100 text-purple-700",
    features: ["Up to 300 Students", "50 GB Storage", "Standard Support"],
    current: false,
  },
  {
    key: "pro",
    name: "Pro Plan",
    icon: Star,
    price: "₹2,499",
    billing: "billed monthly",
    color: "bg-amber-100 text-amber-700",
    features: ["Up to 500 Students", "100 GB Storage", "Priority Support", "White Labelling", "Events Manager"],
    current: true, // Marker for current 'Pro'
  },
  {
    key: "enterprise",
    name: "Enterprise",
    icon: ShieldCheck,
    price: "Custom",
    billing: "Tailored Billing",
    color: "bg-slate-100 text-slate-700",
    features: ["Unlimited Students", "Custom Storage", "Dedicated Manager", "White Labelling", "Custom Branding"],
    current: false,
  },
];

export default function UpgradeSection({ isPaid, daysLeft, currentPlan }: Props) {
  const currentProMarker = PLANS.find(plan => plan.name === currentPlan);

  return (
    <div className="space-y-6">
      {/* ── Page Top Horizontal Upgrade Banner ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] rounded-3xl px-8 py-7 border border-white/5 shadow-inner backdrop-blur-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
            <Zap className="w-8 h-8 text-[#0055a5]"/>
          </div>
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="text-sm font-black text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300"/> Unlock Pro Features
              </span>
              {!isPaid && <ProPill>FREE TRIAL</ProPill>}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight">
              Grow beyond limits. Permanently.
            </h2>
            <p className="text-blue-100 text-[15px] mt-1 font-medium max-w-lg">
              Manage up to 500 students, unlock custom branding, get priority support and white labelling features.
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2.5 px-7 py-3 rounded-xl font-extrabold text-[15px] transition-all whitespace-nowrap shadow-xl bg-amber-400 hover:bg-amber-300 text-amber-950 scale-100 hover:scale-105 active:scale-100">
          Upgrade to Pro Plan <ArrowRight className="w-5 h-5"/>
        </button>
      </div>

      {/* ── Clear Plan Comparison Section ── */}
      <div className="border border-slate-200 rounded-3xl p-6 bg-white shadow-inner">
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide mb-6">Compare Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PLANS.map(plan => {
            const isCurrentPro = plan.name === currentPlan;
            return (
              <div
                key={plan.key}
                className={`border rounded-2xl p-6 flex flex-col items-start ${
                  plan.current
                    ? "border-[#0055a5] bg-blue-50/50 shadow-[0_10px_20px_-5px_rgba(0,85,165,0.1)] scale-100 ring-2 ring-[#0055a5]/10"
                    : "border-slate-100 bg-slate-50 hover:bg-slate-100 hover:border-slate-200"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-4 ${plan.color}`}>
                  <plan.icon className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-3 mb-2 justify-between w-full">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-900">{plan.name}</p>
                  {isCurrentPro && <ProPill>Your Current Plan</ProPill>}
                </div>
                <p className="text-3xl font-black text-slate-950">{plan.price}</p>
                <p className="text-xs font-semibold text-slate-500 mb-6">{plan.billing}</p>

                <div className="mt-auto w-full">
                  <div className="w-full h-px bg-slate-200 mb-6" />
                  <div className="space-y-4 mb-8">
                    {plan.features.map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckSquare className="w-4 h-4 text-[#0055a5]"/>
                        <span className="text-[13px] font-medium text-slate-800">{f}</span>
                      </div>
                    ))}
                  </div>
                  {!isCurrentPro && (
                    <button className="w-full text-center bg-[#0055a5] hover:bg-[#004080] text-white text-xs font-black px-4 py-3 rounded-xl transition-colors shadow-sm">
                      Upgrade now
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