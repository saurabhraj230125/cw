"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, CalendarCheck, Wallet, 
  BookOpen, CheckSquare, Settings, BellRing, BarChart3,
  Power, ChevronDown, Plus, User, Zap
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Student Records", href: "/dashboard/students", icon: Users },
  { name: "Global Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { name: "Fee Management", href: "/dashboard/fees", icon: Wallet },
  { name: "DPP & Study Material", href: "/dashboard/materials", icon: BookOpen },
  { name: "Online Tests", href: "/dashboard/tests", icon: CheckSquare },
  { name: "Analytics & Reports", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "System Alerts", href: "/dashboard/alerts", icon: BellRing },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans">
      
      {/* 1. INSTITUTIONAL TOP BAR */}
      <header className="h-[70px] bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] flex items-center justify-between px-6 shrink-0 z-20 shadow-md">
        
        {/* LEFT: Branding */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white rounded flex items-center justify-center shadow-sm">
            <span className="text-[#004b87] font-black text-lg">CW</span>
          </div>
          <span className="font-extrabold text-xl text-white tracking-wide">
            CoachingWala
          </span>
        </div>

        {/* RIGHT: Quick Actions & Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          <button className="hidden md:flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[2px] text-[13px] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.2)] transition-all mr-2">
            <Plus className="w-4 h-4" strokeWidth={3} /> New Enquiry
          </button>

          <div className="relative hidden sm:block">
            <select className="appearance-none bg-white text-[#0055a5] border border-[#cccccc] rounded-[2px] pl-3 pr-8 py-1.5 text-[14px] font-bold outline-none cursor-pointer shadow-sm">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>

          <div className="h-[42px] w-[42px] rounded-full bg-slate-200 border border-white/20 overflow-hidden shadow-sm shrink-0 flex items-center justify-center">
            <User className="w-6 h-6 text-slate-500 mt-2" />
          </div>

          <button 
            title="Logout"
            className="h-[44px] w-[44px] rounded-full bg-gradient-to-b from-[#ff4d4d] to-[#cc0000] border-2 border-[#990000] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center hover:from-[#ff6666] hover:to-[#e60000] active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)] transition-all shrink-0 cursor-pointer"
          >
            <Power className="w-[22px] h-[22px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" strokeWidth={3} />
          </button>

        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex flex-1 h-[calc(100vh-70px)] overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <aside className="w-[240px] bg-white border-r border-[#cccccc] flex flex-col shrink-0 z-10 hidden md:flex">
          
          {/* Navigation Container */}
          <nav className="flex-1 overflow-y-auto pb-6">
            
            {/* The Module Links */}
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-[13px] border-b border-[#e0e0e0] transition-colors ${
                    isActive 
                      ? "bg-[#e6f0fa] text-[#0055a5] font-bold border-l-4 border-l-[#0055a5]" 
                      : "text-gray-700 hover:bg-[#f5f5f5] border-l-4 border-l-transparent font-semibold"
                  }`}
                >
                  {/* Subtle classic blue icons, similar to the reference image */}
                  <div className={`flex-shrink-0 ${isActive ? 'text-[#0055a5]' : 'text-[#666666]'}`}>
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </div>
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}

            {/* STRICT ERP UPGRADE WIDGET - Matches the rigid, bordered ERP aesthetic */}
            <div className="mx-3 mt-6 mb-4 border border-[#cccccc] bg-[#f5f5f5] shadow-sm">
              <div className="p-2 border-b border-[#cccccc] bg-white flex justify-between items-center">
                <span className="text-[#cc0000] font-bold text-[11px] uppercase tracking-wide">Trial Active</span>
                <span className="text-[#333333] font-bold text-[11px]">7 Days Left</span>
              </div>
              
              <div className="p-2.5">
                {/* Flat, square progress bar */}
                <div className="w-full bg-[#e0e0e0] h-1.5 mb-2.5 border border-[#cccccc]">
                  <div className="bg-[#008000] h-full w-[20%]"></div>
                </div>
                
                {/* Classic Action Button - styled exactly like the "View Profile" button */}
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center justify-center gap-1.5 w-full bg-[#0055a5] border border-[#004080] text-white py-1.5 text-[12px] font-bold hover:bg-[#004080] transition-colors rounded-[2px]"
                >
                  <Zap className="w-3.5 h-3.5" /> UPGRADE PLAN
                </Link>
              </div>
            </div>

          </nav>
        </aside>

        {/* RIGHT CONTENT AREA */}
        <main className="flex-1 overflow-y-auto bg-[#f3f4f6]">
          {children}
        </main>
      </div>
    </div>
  );
}