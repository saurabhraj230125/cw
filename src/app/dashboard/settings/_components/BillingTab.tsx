import UpgradeSection from "./UpgradeSection";
import { Clock, DownloadCloud, RefreshCw, QrCode } from "lucide-react";
import { SettingsSection, SettingsSectionHeader } from "./Primitives";

type Props = {
  isPaid: boolean;
  daysLeft: number;
  currentPlan: string;
  isTrialExpired: boolean;
};

// Simulated dynamic UTR history
const INVOICES = [
  { id: "RCPT-2026-08", utr: "312456789012", date: "01 Aug 2026", amount: "₹15,000", status: "Verified" },
  { id: "RCPT-2026-07", utr: "219876543210", date: "01 Jul 2026", amount: "₹1,499",  status: "Verified" },
];

export default function BillingTab({ isPaid, daysLeft, currentPlan, isTrialExpired }: Props) {
  
  // Dynamic Limits based on actual selected plan
  let studentsMax = 100;
  let storageMax = 10;
  let studentsUsed = 42; 
  let storageUsed = 3;

  if (currentPlan === "Growth Plan") {
    studentsMax = 500;
    storageMax = 50;
    studentsUsed = 284;
    storageUsed = 18;
  } else if (currentPlan === "Enterprise") {
    studentsMax = 5000; // Representing unlimited visually
    storageMax = 500;
    studentsUsed = 890;
    storageUsed = 120;
  }
  
  return (
    <div className="space-y-5">
      {/* ── Main Landscape Upgrade & Comparison Section ── */}
      <UpgradeSection 
        currentPlan={currentPlan} 
        daysLeft={daysLeft} 
        isPaid={isPaid} 
      />

      {/* ── Usage Meters & Payment Method (Side-by-Side) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        {/* Usage meters side-by-side landscape */}
        <SettingsSection>
          <SettingsSectionHeader icon={RefreshCw} subtitle="Current plan consumption" title="Active Usage"/>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Active Students", used: studentsUsed, max: studentsMax, unit: "students", color: "bg-[#0055a5]" },
              { label: "Storage Used",    used: storageUsed,  max: storageMax,  unit: "GB",        color: "bg-amber-500" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">{s.label}</span>
                  <span className="text-xs font-black text-slate-900 tabular-nums">{s.used} / {s.max === 5000 ? "∞" : s.max}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${s.color} ${(s.used / s.max) > 0.85 ? "animate-pulse" : ""}`}
                    style={{ width: `${Math.min((s.used / s.max) * 100, 100)}%` }}
                  />
                  <div className="absolute inset-x-2 inset-y-0.5 bg-white/20 rounded-full shadow-inner pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{Math.round((s.used / s.max) * 100)}% consumed</p>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Payment Configuration */}
        <SettingsSection>
          <SettingsSectionHeader icon={QrCode} subtitle="Linked manual payment method" title="Billing Details"/>
          <div className="p-6 flex items-center justify-between gap-4 h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-10 bg-[#0055a5]/10 border border-[#0055a5]/20 rounded-lg flex items-center justify-center shrink-0">
                <QrCode className="w-5 h-5 text-[#0055a5]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-950">Manual UPI Verified</p>
                <p className="text-xs font-mono text-slate-500 mt-0.5 font-semibold">Registered ID: 7080626215@ybl</p>
              </div>
            </div>
            <div className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-black uppercase px-2 py-1 rounded-md">
              Active
            </div>
          </div>
        </SettingsSection>
      </div>

      {/* ── Landscape Billing Table ── */}
      <SettingsSection>
        <SettingsSectionHeader icon={Clock} subtitle="Verified UTRs & transaction history" title="Payment Receipts"/>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Receipt ID</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">UTR Reference</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount Paid</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Download</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INVOICES.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-[#0055a5] tracking-tight">{inv.id}</td>
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-500">{inv.utr}</td>
                  <td className="px-6 py-3.5 text-slate-700 font-medium text-[13px]">{inv.date}</td>
                  <td className="px-6 py-3.5 font-black text-slate-950 tabular-nums">{inv.amount}</td>
                  <td className="px-6 py-3.5 tabular-nums">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-inner">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right tabular-nums">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0055a5] transition-colors" title="Download Receipt">
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