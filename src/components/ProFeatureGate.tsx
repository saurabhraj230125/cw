"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Crown, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import WaveLoader from "./WaveLoader"; 

export default function ProFeatureGate({ 
  children, 
  featureName 
}: { 
  children: React.ReactNode; 
  featureName: string;
}) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLocked, setIsLocked] = useState<boolean | null>(null);
  const [currentPlan, setCurrentPlan] = useState("Free Trial");

  useEffect(() => {
    async function checkAccess() {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data: member } = await supabase
        .from('core_memberships')
        .select('institutes(subscription_plan)')
        .eq('user_id', authData.user.id)
        .single();

      const inst = Array.isArray(member?.institutes) ? member?.institutes[0] : member?.institutes;
      const plan = inst?.subscription_plan || "Free Trial";
      setCurrentPlan(plan);

      const isPremium = plan.includes("Growth") || plan.includes("Enterprise");
      
      if (!isPremium) {
        setIsLocked(true);
      } else {
        setIsLocked(false);
      }
    }
    checkAccess();
  }, [supabase]);

  if (isLocked === null) return <WaveLoader />;

  if (isLocked) {
    return (
      <div className="flex-1 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-erp-bg animate-in fade-in duration-300">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 max-w-xl w-full text-center shadow-2xl shadow-blue-900/5 relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent -z-10" />
          
          <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative shadow-inner">
            <Lock className="w-10 h-10 text-[#0055a5]" />
            <div className="absolute -bottom-2 -right-2 bg-amber-400 p-1.5 rounded-lg border-2 border-white shadow-sm">
              <Crown className="w-4 h-4 text-amber-950" />
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
            {featureName} is Locked
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium mb-8 leading-relaxed">
            {/* 🚨 DEEP FIX: Dynamically states their actual plan instead of hardcoding "Free Trial" */}
            This module is restricted on your current <span className="font-bold text-slate-700">{currentPlan}</span> account. Upgrade to a Pro plan to unlock {featureName}, advanced analytics, online testing, and unlimited storage.
          </p>

          <Link 
            href="/dashboard/settings?tab=billing"
            className="group relative inline-flex items-center justify-center gap-2 bg-[#0055a5] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#0055a5]/30 active:scale-95 w-full sm:w-auto"
          >
            Upgrade to Pro Access
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
            Instant activation upon payment
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}