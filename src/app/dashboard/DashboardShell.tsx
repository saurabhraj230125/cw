"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, CalendarCheck, Wallet,
  BookOpen, CheckSquare, BellRing, BarChart3,
  Plus, User, Zap, Menu, X, ArrowRight,
  Layers, BookMarked, Lock, Loader2, ChevronRight, AlertOctagon,
  Settings, CreditCard, LogOut, RefreshCw
} from "lucide-react";
import { logoutAction } from "../actions/owner-auth";
import DashboardTour, { resetTour } from "../../components/DashboardTour";

export type DashboardShellProps = {
  children: React.ReactNode;
  instituteName: string;
  isTrialExpired: boolean;
  daysLeft: number;
  isPaid: boolean;
  currentPlan: string;
  logoUrl?: string | null; 
};

export default function DashboardShell({
  children, 
  instituteName, 
  isTrialExpired, 
  daysLeft, 
  isPaid, 
  currentPlan,
  logoUrl
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // 🚨 DEEP FIX: Removed the automatic URL redirect! 
  // We want them to stay on the dashboard so they can physically see the giant lock screen instead of a forced URL change.

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = () => setIsMobileMenuOpen(false);
  
  const initials = instituteName && instituteName !== "Not Set" 
    ? instituteName.substring(0, 2).toUpperCase() 
    : "CW";

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push("/login");
  };

  const isBaseLocked = !isPaid && isTrialExpired;
  const isPremiumLocked = !isPaid || isBaseLocked || (currentPlan || "").includes("Starter");

  const navigation = [
    // 🟢 BASE FEATURES 
    { name: "Dashboard", href: isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard", icon: LayoutDashboard, locked: isBaseLocked, tourClass: "tour-dashboard" },
    { name: "Student Records", href: isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard/students", icon: Users, locked: isBaseLocked, tourClass: "tour-students" },
    { name: "Global Attendance", href: isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard/attendance", icon: CalendarCheck, locked: isBaseLocked },
    { name: "Fee Management", href: isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard/fees", icon: Wallet, locked: isBaseLocked, tourClass: "tour-fee-table" },
    { name: "Courses Master", href: isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard/courses", icon: BookMarked, locked: isBaseLocked, tourClass: "tour-add-course" },
    { name: "Batches Master", href: isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard/batches", icon: Layers, locked: isBaseLocked, tourClass: "tour-add-batch" },

    // 🔴 PREMIUM FEATURES
    { name: "DPP & Study Material", href: isPremiumLocked ? "/dashboard/settings?tab=billing" : "/dashboard/materials", icon: BookOpen, locked: isPremiumLocked },
    { name: "Online Tests", href: isPremiumLocked ? "/dashboard/settings?tab=billing" : "/dashboard/tests", icon: CheckSquare, locked: isPremiumLocked },
    { name: "Analytics & Reports", href: isPremiumLocked ? "/dashboard/settings?tab=billing" : "/dashboard/analytics", icon: BarChart3, locked: isPremiumLocked },
    { name: "System Alerts", href: isPremiumLocked ? "/dashboard/settings?tab=billing" : "/dashboard/alerts", icon: BellRing, locked: isPremiumLocked },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans overflow-hidden selection:bg-[#0055a5] selection:text-white">
      <DashboardTour />
      
      {/* ── HEADER ── */}
      <header className="h-[70px] bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1 text-white hover:bg-white/10 rounded-[2px] transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          {logoUrl ? (
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white rounded flex items-center justify-center shadow-sm shrink-0 p-0.5 overflow-hidden">
              <img src={logoUrl} alt="Institute Logo" className="w-full h-full object-contain" />
            </div>
          ) : (
            <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white rounded flex items-center justify-center shadow-sm shrink-0">
              <span className="text-[#004b87] font-black text-lg">{initials}</span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl text-white tracking-wide hidden xs:block truncate max-w-[200px] lg:max-w-[400px] leading-tight">
              {instituteName !== "Not Set" ? instituteName : "CoachingWala"}
            </span>
            <span className="text-[10px] text-blue-200 font-bold uppercase tracking-widest hidden xs:block leading-none mt-0.5">
              {currentPlan || "Free Trial"}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          <Link prefetch={false} href={isBaseLocked ? "/dashboard/settings?tab=billing" : "/dashboard/enquiries/new"} className="tour-enquiry hidden lg:flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#45a049] text-white px-5 py-2 rounded-[4px] text-[13px] font-bold shadow-sm transition-all active:scale-95">
            <Plus className="w-4 h-4" strokeWidth={3} /> New Enquiry
          </Link>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setIsProfileOpen(p => !p)}
              className="h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] rounded-full bg-slate-200 border-2 border-white/30 flex items-center justify-center hover:ring-2 hover:ring-white/60 transition-all overflow-hidden shadow-sm"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mt-1.5 sm:mt-2" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-56 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <p className="text-sm font-bold text-slate-800">Institute Admin</p>
                  <p className="text-xs text-slate-500 mt-0.5">Admin Role</p>
                </div>
                <div className="py-1">
                  <Link prefetch={false} href="/dashboard/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings className="w-4 h-4 text-slate-400" /> View Profile &amp; Settings
                  </Link>
                  <Link prefetch={false} href="/dashboard/settings?tab=billing" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <CreditCard className="w-4 h-4 text-slate-400" /> Billing &amp; Plan
                  </Link>
                  <button onClick={() => { setIsProfileOpen(false); resetTour(); }} className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                    <RefreshCw className="w-4 h-4 text-amber-500" /> Restart Dashboard Tour
                  </button>
                </div>
                <div className="border-t border-slate-100 py-1">
                  <button onClick={handleLogout} disabled={isLoggingOut} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer">
                    {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />} Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── SIDEBAR & MAIN LAYOUT ── */}
      <div className="flex flex-1 h-[calc(100vh-70px)] relative">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        
        <aside className={`absolute md:static inset-y-0 left-0 z-20 w-[250px] bg-white border-r border-[#cccccc] flex flex-col shrink-0 transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <nav className="flex-1 overflow-y-auto pb-6 pt-2 hide-scrollbar flex flex-col">
            
            <div className="flex flex-col w-full">
              {navigation.map((item) => {
                const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href) && !item.locked;
                return (
                  <Link
                    prefetch={false}
                    key={item.name}
                    href={item.href}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3 px-4 py-3 text-[13px] border-b border-[#e0e0e0] transition-colors ${item.tourClass || ""} ${isActive ? "bg-[#e6f0fa] text-[#0055a5] font-bold border-l-4 border-l-[#0055a5]" : "text-gray-700 hover:bg-[#f5f5f5] border-l-4 border-l-transparent font-semibold"
                      } ${item.locked ? "bg-slate-50/50 opacity-90" : ""}`}
                  >
                    <div className={`flex-shrink-0 ${isActive ? 'text-[#0055a5]' : 'text-[#666666]'}`}>
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    </div>
                    <span className="truncate flex-1">{item.name}</span>
                    {item.locked && <span title="Premium Feature - Upgrade Required" className="flex items-center"><Lock className="w-4 h-4 text-amber-500 flex-shrink-0" /></span>}
                  </Link>
                );
              })}
            </div>

            {!isPaid && (
              <Link
                prefetch={false}
                href="/dashboard/settings?tab=billing"
                onClick={handleNavClick}
                className={`block mx-4 mt-2 mb-4 border shadow-sm transition-all rounded-[6px] overflow-hidden group cursor-pointer shrink-0 ${isTrialExpired ? 'border-red-300 bg-red-50' : 'border-[#0055a5]/20 bg-gradient-to-b from-[#ffffff] to-[#f8fafc]'}`}
              >
                <div className={`p-2.5 border-b flex justify-between items-center bg-white ${isTrialExpired ? 'border-red-200' : 'border-[#0055a5]/10'}`}>
                  <span className={`font-bold text-[11px] uppercase tracking-wide flex items-center gap-1 ${isTrialExpired ? 'text-red-600' : 'text-[#cc0000]'}`}>
                    {isTrialExpired ? <AlertOctagon className="w-3 h-3" /> : <Zap className="w-3 h-3 fill-[#cc0000]" />}
                    {isTrialExpired ? 'Trial Expired' : 'Trial Active'}
                  </span>
                  <span className={`font-extrabold text-[11px] ${isTrialExpired ? 'text-red-600' : 'text-[#0055a5]'}`}>{daysLeft} Days Left</span>
                </div>
                <div className="p-3">
                  <div className={`w-full h-1.5 mb-3 rounded-full overflow-hidden border ${isTrialExpired ? 'bg-red-200 border-red-300' : 'bg-[#e2e8f0] border-gray-200'}`}>
                    <div className={`${isTrialExpired ? 'bg-red-600' : 'bg-[#008000]'} h-full transition-all`} style={{ width: `${(daysLeft / 7) * 100}%` }}></div>
                  </div>
                  <div className={`flex items-center justify-center gap-1.5 w-full text-white py-2 text-[12px] font-bold rounded-[4px] shadow-sm ${isTrialExpired ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-[#0055a5] hover:bg-[#004080]'}`}>
                    {isTrialExpired ? 'Renew Subscription' : 'Upgrade Plan'} <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            )}
          </nav>
        </aside>

        {/* 🚨 THE MASTER LOCK INTERCEPTOR */}
        {/* If the trial is expired, AND they haven't paid, AND they are not on the settings page, completely block the app and show this wall! */}
        <main className="flex-1 overflow-y-auto bg-[#f3f4f6]">
          {!isPaid && isTrialExpired && !pathname.includes("/dashboard/settings") ? (
            <div className="min-h-full flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
              <div className="bg-white border border-red-200 rounded-3xl p-8 md:p-12 max-w-xl w-full text-center shadow-2xl shadow-red-900/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-red-50 to-transparent -z-10" />
                
                <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 relative shadow-inner">
                  <AlertOctagon className="w-10 h-10 text-red-600" />
                  <div className="absolute -bottom-2 -right-2 bg-slate-800 p-1.5 rounded-lg border-2 border-white shadow-sm">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-3">
                  Free Trial Expired
                </h2>
                <p className="text-slate-500 text-sm md:text-base font-medium mb-8 leading-relaxed">
                  Your 7-Day Free Trial has concluded. To regain access to your student directory, fee ledgers, and all institute operations, please activate your subscription.
                </p>

                <Link 
                  href="/dashboard/settings?tab=billing"
                  className="group relative inline-flex items-center justify-center gap-2 bg-[#0055a5] text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#004080] transition-all shadow-lg shadow-[#0055a5]/30 active:scale-95 w-full sm:w-auto"
                >
                  Activate Subscription Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                  Your data is safely backed up
                </p>
              </div>
            </div>
          ) : (
            children
          )}
        </main>

      </div>
    </div>
  );
}