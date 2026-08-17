import UpgradeSection from "./UpgradeSection";
import { CreditCard, Clock, DownloadCloud, RefreshCw } from "lucide-react";
import { SettingsSection, SettingsSectionHeader } from "./Primitives";

type Props = {
  isPaid: boolean;
  daysLeft: number;
  currentPlan: string;
  isTrialExpired: boolean;
};

// Past billing records
const INVOICES = [
  { id: "INV-2026-08", date: "01 Aug 2026", amount: "₹2,499", status: "Paid" },
  { id: "INV-2026-07", date: "01 Jul 2026", amount: "₹2,499", status: "Paid" },
  { id: "INV-2026-06", date: "01 Jun 2026", amount: "₹2,499", status: "Paid" },
];

export default function BillingTab({ isPaid, daysLeft, currentPlan, isTrialExpired }: Props) {
  // Usage data example
  const studentsUsed = 342;
  const studentsMax  = 500;
  const storageUsed  = 45;
  const storageMax   = 100;

  return (
    <div className="space-y-5">
      {/* ── Main Landscape Upgrade & Comparison Section ── */}
      <UpgradeSection 
        currentPlan={currentPlan} 
        daysLeft={daysLeft} 
        isPaid={isPaid} 
      />

      {/* ── Usage Meters & Payment Method (Side-by-Side Landscape) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Usage meters side-by-side landscape */}
        <SettingsSection>
          <SettingsSectionHeader icon={RefreshCw} subtitle="Current plan consumption" title="Active Usage"/>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Active Students", used: studentsUsed, max: studentsMax, unit: "students", color: "bg-[#0055a5]" },
              { label: "Storage Used",    used: storageUsed,  max: storageMax,  unit: "GB",        color: "bg-purple-500" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">{s.label}</span>
                  <span className="text-xs font-black text-slate-900 tabular-nums">{s.used} / {s.max} {s.unit}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${s.color} ${(s.used / s.max) > 0.85 ? "animate-pulse" : ""}`}
                    style={{ width: `${(s.used / s.max) * 100}%` }}
                  />
                  {/* Subtle pattern shadow inside meter */}
                  <div className="absolute inset-x-2 inset-y-0.5 bg-white/20 rounded-full shadow-inner pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{Math.round((s.used / s.max) * 100)}% consumed</p>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Payment horizontal landscape */}
        <SettingsSection>
          <SettingsSectionHeader icon={CreditCard} subtitle="Auto-renewal billing details" title="Payment Method"/>
          <div className="p-6 flex items-center justify-between gap-4 h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-slate-800 rounded-lg flex items-center justify-center shrink-0 border border-white/10 shadow-lg">
                <div className="text-white text-[9px] font-black tracking-widest uppercase">VISA</div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Visa ending in <span className="font-black">4242</span></p>
                <p className="text-xs text-slate-500 mt-0.5">Expires 08/2028 · Admin@FutureQ.com</p>
              </div>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-bold text-[#0055a5] hover:underline whitespace-nowrap">
              <RefreshCw className="w-3.5 h-3.5"/> Update Card
            </button>
          </div>
        </SettingsSection>
      </div>

      {/* ── Landscape Billing Table ── */}
      <SettingsSection>
        <SettingsSectionHeader icon={Clock} subtitle="Billing history & payment receipts" title="Invoices"/>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Invoice</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INVOICES.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-600 tracking-tight">{inv.id}</td>
                  <td className="px-6 py-3.5 text-slate-700 font-medium text-[13px]">{inv.date}</td>
                  <td className="px-6 py-3.5 font-black text-slate-950 tabular-nums">{inv.amount}</td>
                  <td className="px-6 py-3.5 tabular-nums">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-inner">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0055a5] transition-colors" title="Download Invoice">
                      <DownloadCloud className="w-4 h-4"/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}