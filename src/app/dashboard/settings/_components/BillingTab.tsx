"use client";

import { useEffect, useState } from "react";
import UpgradeSection from "./UpgradeSection";
import { 
  Clock, DownloadCloud, RefreshCw, QrCode, 
  CheckCircle2, Lock, ShieldCheck, Layers, Loader2
} from "lucide-react";
import { SettingsSection, SettingsSectionHeader } from "./Primitives";
import { SettingsShellProps } from "./index";
import { jsPDF } from "jspdf"; 
import { createBrowserClient } from "@supabase/ssr";

// 🚨 DEEP FIX: We MUST import the secure backend action to bypass the RLS block!
import { getStudents } from "../../../actions/student-actions";

type BillingProps = SettingsShellProps & {
  onUpgradeSuccess: (newTx: any) => void;
};

export default function BillingTab(props: BillingProps) {
  const [liveStudentCount, setLiveStudentCount] = useState<number>(props.studentsCount || 0);
  const [isLoading, setIsLoading] = useState(true);
  
  const [planData, setPlanData] = useState({
    currentPlan: props.currentPlan || "Free Trial",
    daysLeft: props.daysLeft || 0,
    isTrialExpired: false
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    let isMounted = true;

    async function syncLiveDatabase() {
      setIsLoading(true);
      try {
        // 1. 🚨 DIRECT BACKEND FETCH: Securely get students to bypass browser RLS!
        const studentsData = await getStudents();
        if (isMounted && studentsData) {
          setLiveStudentCount(studentsData.length); // Instantly set the true length
        }

        // 2. Fetch Plan Data
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        const { data: member } = await supabase
          .from('core_memberships')
          .select(`institute_id, institutes (subscription_plan, created_at)`)
          .eq('user_id', authData.user.id)
          .single();

        if (member?.institute_id && isMounted) {
          const inst = Array.isArray(member.institutes) ? member.institutes[0] : member.institutes;
          
          const realPlan = inst?.subscription_plan || "Free Trial";
          const createdDate = new Date(inst?.created_at || new Date());
          const expiryDate = new Date(createdDate);
          expiryDate.setDate(createdDate.getDate() + 7); // 7 Day Trial
          const today = new Date();
          const daysRemaining = Math.max(0, Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24)));
          
          setPlanData({
            currentPlan: realPlan,
            daysLeft: daysRemaining,
            isTrialExpired: daysRemaining <= 0
          });
        }
      } catch (error) {
        console.error("Failed to sync live billing data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    syncLiveDatabase();
    
    return () => { isMounted = false; };
  }, [supabase]);

  // 🚨 DYNAMIC PLAN LIMITS IMPLEMENTED HERE
  let studentsMax = 100;
  let storageMax = 1; // 1 GB Default for Starter / Free Trial
  
  const planName = planData.currentPlan;

  if (planName.includes("Growth")) {
    studentsMax = 500;
    storageMax = 10; 
  } else if (planName.includes("Enterprise")) {
    studentsMax = 5000; 
    storageMax = 100; 
  }
  
  // Storage usage calculation powered by LIVE student count
  const baseAssetsSizeGB = props.logoUrl ? 0.05 : 0.01; 
  const studentsStorageGB = (liveStudentCount * 0.002);
  const storageUsed = Math.max(0.01, Number((baseAssetsSizeGB + studentsStorageGB).toFixed(2))); 

  const transactions = props.transactions || [];
  
  const isPremiumUnlocked = planName.includes("Growth") || planName.includes("Enterprise");

  const handleDownloadReceipt = (inv: any) => {
    const doc = new jsPDF();
    const safeId = inv.id.length > 8 ? inv.id.substring(0, 8).toUpperCase() : inv.id;

    doc.setFontSize(22);
    doc.setTextColor(0, 85, 165); 
    doc.text("COACHINGWALA ERP", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("Official Payment Receipt", 105, 30, { align: "center" });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35); 

    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    
    doc.setFont("helvetica", "bold");
    doc.text("Billed To:", 20, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Institute: ${props.instituteName}`, 20, 60);
    doc.text(`Reg Number: ${props.registrationNumber}`, 20, 70);
    doc.text(`Email: ${props.userEmail}`, 20, 80);

    doc.setFont("helvetica", "bold");
    doc.text("Transaction Details:", 110, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`Receipt ID: RCPT-${safeId}`, 110, 60);
    doc.text(`Date: ${new Date(inv.created_at).toLocaleString('en-IN')}`, 110, 70);
    doc.text(`Status: ${inv.status.toUpperCase()}`, 110, 80);

    doc.line(20, 95, 190, 95);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Plan Upgraded: ${inv.plan_name}`, 20, 115);
    doc.text(`Amount Paid: Rs. ${Number(inv.amount).toLocaleString('en-IN')}`, 20, 125);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`UPI UTR Reference: ${inv.utr_reference}`, 20, 135);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for choosing CoachingWala.", 105, 270, { align: "center" });
    doc.text("For support, contact 6306814355 or support@coachingwala.com", 105, 278, { align: "center" });

    doc.save(`CoachingWala_Receipt_${safeId}.pdf`);
  };

  const handleLocalUpgrade = (newTx: any) => {
    props.onUpgradeSuccess(newTx);
    handleDownloadReceipt(newTx); 
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-cw-blue" />
        <p className="mt-4 font-bold text-gray-500">Syncing Live Usage Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <UpgradeSection 
        currentPlan={planData.currentPlan} 
        daysLeft={planData.daysLeft} 
        isPaid={props.isPaid} 
        membershipId={props.membershipId}
        instituteName={props.instituteName}
        userEmail={props.userEmail}
        onUpgradeComplete={handleLocalUpgrade} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
        
        {/* USAGE METRICS WITH DYNAMIC STORAGE MAX & LIVE STUDENTS */}
        <SettingsSection>
          <SettingsSectionHeader icon={RefreshCw} subtitle="Current plan consumption" title="Active Usage"/>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Active Students", used: liveStudentCount, max: studentsMax, unit: "students", color: "bg-[#0055a5]" },
              { label: "Storage Used",    used: storageUsed,   max: storageMax,  unit: "GB",        color: "bg-amber-500" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600">{s.label}</span>
                  <span className="text-xs font-black text-slate-900 tabular-nums">{s.used} / {s.max === 5000 ? "∞" : s.max}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative shadow-inner border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${s.color} ${(s.used / s.max) > 0.85 ? "animate-pulse" : ""}`}
                    style={{ width: `${Math.min((s.used / s.max) * 100, 100)}%` }}
                  />
                  <div className="absolute inset-x-2 inset-y-0.5 bg-white/20 rounded-full shadow-inner pointer-events-none" />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{Math.round((s.used / s.max) * 100)}% consumed</p>
              </div>
            ))}
          </div>
        </SettingsSection>

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

      <SettingsSection>
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Plan Features Access</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureStatus title="Student Management" description="Unlimited directory & ledgers" isUnlocked={true} />
            <FeatureStatus title="Global Attendance" description="Track daily attendance" isUnlocked={true} />
            <FeatureStatus title="Student Portals" description="Generate portal credentials" isUnlocked={isPremiumUnlocked} />
            <FeatureStatus title="DPP & Study Material" description="Upload PDFs to dashboards" isUnlocked={isPremiumUnlocked} />
            <FeatureStatus title="Online CBT Tests" description="Create mock tests" isUnlocked={isPremiumUnlocked} />
            <FeatureStatus title="Advanced Analytics" description="Revenue & batch reports" isUnlocked={isPremiumUnlocked} />
          </div>
        </div>
      </SettingsSection>

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
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium text-sm">
                    No payment receipts found yet. Your invoices will appear here after upgrading.
                  </td>
                </tr>
              ) : (
                transactions.map(inv => {
                  const safeId = inv.id.length > 8 ? inv.id.substring(0, 8).toUpperCase() : inv.id;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs font-bold text-[#0055a5] tracking-tight">
                        RCPT-{safeId}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-500">{inv.utr_reference}</td>
                      <td className="px-6 py-3.5 text-slate-700 font-medium text-[13px]">
                        {new Date(inv.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5 font-black text-slate-950 tabular-nums">₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                      <td className="px-6 py-3.5 tabular-nums">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-inner ${
                          inv.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${inv.status === 'Verified' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} /> 
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right tabular-nums">
                        <button 
                          onClick={() => handleDownloadReceipt(inv)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0055a5] transition-colors" 
                          title="Download Receipt (PDF)"
                        >
                          <DownloadCloud className="w-4 h-4"/>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}

function FeatureStatus({ title, description, isUnlocked }: { title: string, description: string, isUnlocked: boolean }) {
  return (
    <div className={`border p-4 rounded-xl flex items-start gap-3 transition-colors ${
      isUnlocked ? 'bg-white border-green-200 shadow-sm' : 'bg-slate-50 border-slate-200 opacity-70'
    }`}>
      {isUnlocked ? (
        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
      ) : (
        <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
      )}
      <div>
        <h4 className={`text-sm font-black ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
          {title}
        </h4>
        <p className={`text-[11px] mt-0.5 leading-tight ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
          {description}
        </p>
      </div>
    </div>
  );
}