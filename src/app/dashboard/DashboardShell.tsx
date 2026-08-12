"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, Users, CalendarCheck, Wallet, 
  BookOpen, CheckSquare, Settings, BellRing, BarChart3,
  Power, ChevronDown, Plus, User, Zap, Menu, X,
  Layers, BookMarked, Lock, Loader2, ChevronRight, AlertOctagon, ShieldCheck
} from "lucide-react";
import { logoutAction } from "../actions/owner-auth";

export default function DashboardShell({ 
  children, instituteName, isTrialExpired, daysLeft, isPaid, currentPlan
}: { 
  children: React.ReactNode; instituteName: string; isTrialExpired: boolean; daysLeft: number; isPaid: boolean; currentPlan: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (isTrialExpired && !isPaid && !pathname.includes("/dashboard/settings")) {
      router.push("/dashboard/settings");
    }
  }, [isTrialExpired, isPaid, pathname, router]);

  const handleNavClick = () => setIsMobileMenuOpen(false);
  const initials = instituteName.substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAction();
    router.push("/login");
  };

  const isBaseLocked = !isPaid && isTrialExpired;
  const isPremiumLocked = !isPaid; 

  const navigation = [
    { name: "Dashboard", href: isBaseLocked ? "/dashboard/settings" : "/dashboard", icon: LayoutDashboard, locked: isBaseLocked },
    { name: "Student Records", href: isBaseLocked ? "/dashboard/settings" : "/dashboard/students", icon: Users, locked: isBaseLocked },
    { name: "Global Attendance", href: isBaseLocked ? "/dashboard/settings" : "/dashboard/attendance", icon: CalendarCheck, locked: isBaseLocked },
    { name: "Fee Management", href: isBaseLocked ? "/dashboard/settings" : "/dashboard/fees", icon: Wallet, locked: isBaseLocked },
    { name: "Courses Master", href: isBaseLocked ? "/dashboard/settings" : "/dashboard/courses", icon: BookMarked, locked: isBaseLocked },
    { name: "Batches Master", href: isBaseLocked ? "/dashboard/settings" : "/dashboard/batches", icon: Layers, locked: isBaseLocked },
    
    { name: "DPP & Study Material", href: isPremiumLocked ? "/dashboard/settings" : "/dashboard/materials", icon: BookOpen, locked: isPremiumLocked },
    { name: "Online Tests", href: isPremiumLocked ? "/dashboard/settings" : "/dashboard/tests", icon: CheckSquare, locked: isPremiumLocked },
    { name: "Analytics & Reports", href: isPremiumLocked ? "/dashboard/settings" : "/dashboard/analytics", icon: BarChart3, locked: isPremiumLocked },
    { name: "System Alerts", href: isPremiumLocked ? "/dashboard/settings" : "/dashboard/alerts", icon: BellRing, locked: isPremiumLocked },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans overflow-hidden selection:bg-[#0055a5] selection:text-white">
      <header className="h-[70px] bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1 text-white hover:bg-white/10 rounded-[2px] transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white rounded flex items-center justify-center shadow-sm shrink-0">
            <span className="text-[#004b87] font-black text-lg">{initials}</span>
          </div>
          <span className="font-extrabold text-lg sm:text-xl text-white tracking-wide hidden xs:block truncate max-w-[200px] lg:max-w-[400px]">
            {instituteName}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href={isBaseLocked ? "/dashboard/settings" : "/dashboard/enquiries/new"} className="hidden lg:flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[2px] text-[13px] font-bold shadow-sm transition-all">
            <Plus className="w-4 h-4" strokeWidth={3} /> New Enquiry
          </Link>
          <div className="relative hidden md:block">
            <select className="appearance-none bg-white text-[#0055a5] border border-[#cccccc] rounded-[2px] pl-3 pr-8 py-1.5 text-[14px] font-bold outline-none cursor-pointer shadow-sm">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>
          <Link href="/dashboard/settings" className="h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] rounded-full bg-slate-200 border border-white/20 overflow-hidden shadow-sm flex items-center justify-center hover:ring-2 hover:ring-white/50 transition-all">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mt-1.5 sm:mt-2" />
          </Link>
          <button onClick={handleLogout} disabled={isLoggingOut} className="h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] rounded-full bg-gradient-to-b from-[#ff4d4d] to-[#cc0000] border-2 border-[#990000] flex items-center justify-center hover:from-[#ff6666] hover:to-[#e60000] transition-all shrink-0 cursor-pointer disabled:opacity-50">
            {isLoggingOut ? <Loader2 className="w-5 h-5 text-white animate-spin drop-shadow-md" /> : <Power className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-white" strokeWidth={3} />}
          </button>
        </div>
      </header>

      <div className="flex flex-1 h-[calc(100vh-70px)] relative">
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-10 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        <aside className={`absolute md:static inset-y-0 left-0 z-20 w-[250px] bg-white border-r border-[#cccccc] flex flex-col shrink-0 transform transition-transform duration-200 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
          <nav className="flex-1 overflow-y-auto pb-6 pt-2 hide-scrollbar">
            {navigation.map((item) => {
              const isActive = item.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(item.href) && !item.locked;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 text-[13px] border-b border-[#e0e0e0] transition-colors ${
                    isActive ? "bg-[#e6f0fa] text-[#0055a5] font-bold border-l-4 border-l-[#0055a5]" : "text-gray-700 hover:bg-[#f5f5f5] border-l-4 border-l-transparent font-semibold"
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

            {isPaid ? (
              <div className="mx-3 mt-6 mb-4 border border-[#2e7d32]/30 bg-gradient-to-b from-[#f1f8e9] to-white shadow-sm rounded-[6px] overflow-hidden">
                <div className="p-2.5 border-b border-[#2e7d32]/10 bg-white flex justify-between items-center">
                  <span className="font-bold text-[11px] uppercase tracking-wide flex items-center gap-1 text-[#2e7d32]">
                    <ShieldCheck className="w-3 h-3" /> Paid Plan
                  </span>
                  <span className="font-extrabold text-[11px] text-slate-800 uppercase">{currentPlan}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-center gap-1.5 w-full text-[#2e7d32] bg-emerald-100 py-2 text-[12px] font-bold rounded-[4px] shadow-inner border border-emerald-200">
                    All Systems Operational
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href="/dashboard/settings" 
                onClick={handleNavClick}
                className={`block mx-3 mt-6 mb-4 border shadow-sm transition-all rounded-[6px] overflow-hidden group cursor-pointer ${isTrialExpired ? 'border-red-300 bg-red-50' : 'border-[#0055a5]/20 bg-gradient-to-b from-[#ffffff] to-[#f8fafc]'}`}
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
        <main className="flex-1 overflow-y-auto bg-[#f3f4f6]">{children}</main>
      </div>
    </div>
  );
}