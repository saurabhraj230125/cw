"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, CalendarCheck, Wallet, 
  BookOpen, CheckSquare, Settings, BellRing, BarChart3,
  Power, ChevronDown, Plus, User, Zap, Menu, X,
  Layers, BookMarked // Added for new Master modules
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Student Records", href: "/dashboard/students", icon: Users },
  { name: "Global Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { name: "Fee Management", href: "/dashboard/fees", icon: Wallet },
  { name: "Courses Master", href: "/dashboard/courses", icon: BookMarked },
  { name: "Batches Master", href: "/dashboard/batches", icon: Layers },
  { name: "DPP & Study Material", href: "/dashboard/materials", icon: BookOpen },
  { name: "Online Tests", href: "/dashboard/tests", icon: CheckSquare },
  { name: "Analytics & Reports", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "System Alerts", href: "/dashboard/alerts", icon: BellRing },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  const handleNavClick = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans overflow-hidden">
      
      {/* 1. INSTITUTIONAL TOP BAR */}
      <header className="h-[70px] bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] flex items-center justify-between px-4 sm:px-6 shrink-0 z-30 shadow-md">
        
        {/* LEFT: Branding & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1 text-white hover:bg-white/10 rounded-[2px] transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="h-9 w-9 sm:h-10 sm:w-10 bg-white rounded flex items-center justify-center shadow-sm shrink-0">
            <span className="text-[#004b87] font-black text-lg">CW</span>
          </div>
          <span className="font-extrabold text-lg sm:text-xl text-white tracking-wide hidden xs:block">
            CoachingWala
          </span>
        </div>

        {/* RIGHT: Quick Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          <Link 
            href="/dashboard/enquiries/new" 
            className="hidden lg:flex items-center gap-1.5 bg-[#4CAF50] hover:bg-[#45a049] text-white px-4 py-1.5 rounded-[2px] text-[13px] font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_1px_2px_rgba(0,0,0,0.2)] transition-all"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Enquiry
          </Link>

          <div className="relative hidden md:block">
            <select className="appearance-none bg-white text-[#0055a5] border border-[#cccccc] rounded-[2px] pl-3 pr-8 py-1.5 text-[14px] font-bold outline-none cursor-pointer shadow-sm focus:border-[#0055a5] focus:ring-1 focus:ring-[#0055a5]">
              <option>2026-27</option>
              <option>2025-26</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>

          <div className="h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] rounded-full bg-slate-200 border border-white/20 overflow-hidden shadow-sm shrink-0 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-white/50 transition-all">
            <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 mt-1.5 sm:mt-2" />
          </div>

          <button 
            title="Secure Logout"
            className="h-[38px] w-[38px] sm:h-[44px] sm:w-[44px] rounded-full bg-gradient-to-b from-[#ff4d4d] to-[#cc0000] border-2 border-[#990000] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_2px_5px_rgba(0,0,0,0.5)] flex items-center justify-center hover:from-[#ff6666] hover:to-[#e60000] active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)] transition-all shrink-0 cursor-pointer"
          >
            <Power className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" strokeWidth={3} />
          </button>

        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex flex-1 h-[calc(100vh-70px)] relative">
        
        {/* MOBILE OVERLAY */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-10 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR (Desktop Static & Mobile Slide-out) */}
        <aside className={`
          absolute md:static inset-y-0 left-0 z-20
          w-[250px] bg-white border-r border-[#cccccc] flex flex-col shrink-0
          transform transition-transform duration-200 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}>
          
          <nav className="flex-1 overflow-y-auto pb-6 pt-2 hide-scrollbar">
            
            {/* The Module Links */}
            {navigation.map((item) => {
              // Strict active routing logic to prevent /dashboard from highlighting everywhere
              const isActive = item.href === '/dashboard' 
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-4 py-3 text-[13px] border-b border-[#e0e0e0] transition-colors ${
                    isActive 
                      ? "bg-[#e6f0fa] text-[#0055a5] font-bold border-l-4 border-l-[#0055a5]" 
                      : "text-gray-700 hover:bg-[#f5f5f5] border-l-4 border-l-transparent font-semibold"
                  }`}
                >
                  <div className={`flex-shrink-0 ${isActive ? 'text-[#0055a5]' : 'text-[#666666]'}`}>
                    <item.icon className="h-[18px] w-[18px]" strokeWidth={2} />
                  </div>
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}

            {/* STRICT ERP UPGRADE WIDGET */}
            <div className="mx-3 mt-6 mb-4 border border-[#cccccc] bg-[#f5f5f5] shadow-sm">
              <div className="p-2 border-b border-[#cccccc] bg-white flex justify-between items-center">
                <span className="text-[#cc0000] font-bold text-[11px] uppercase tracking-wide">Trial Active</span>
                <span className="text-[#333333] font-bold text-[11px]">7 Days Left</span>
              </div>
              
              <div className="p-2.5">
                <div className="w-full bg-[#e0e0e0] h-1.5 mb-2.5 border border-[#cccccc]">
                  <div className="bg-[#008000] h-full w-[20%]"></div>
                </div>
                
                <Link 
                  href="/dashboard/settings" 
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-1.5 w-full bg-[#0055a5] border border-[#004080] text-white py-1.5 text-[12px] font-bold hover:bg-[#004080] transition-colors rounded-[2px] shadow-sm"
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