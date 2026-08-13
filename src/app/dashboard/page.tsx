import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../lib/supabase/server";
import { 
  UserCircle, Users, CalendarDays, Wallet, 
  Calculator, BarChart3, BookOpen, 
  Trophy, GraduationCap, BellRing, Settings,
  Building2, LayoutGrid
} from "lucide-react";

export default async function OwnerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: membership } = await supabase
    .from("core_memberships")
    .select(`
      role_key,
      institutes ( name, slug, created_at ),
      branches ( name, city )
    `)
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/onboarding");

  const institute = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;
  const branch = Array.isArray(membership.branches) ? membership.branches[0] : membership.branches;

  const gridItems = [
    { name: "New Enquiries", icon: UserCircle, color: "text-[#00838F]", href: "/dashboard/enquiries/new" },
    { name: "Manage Faculty", icon: Users, color: "text-[#1565C0]", href: "/dashboard/faculty" },
    { name: "Batch Schedule", icon: CalendarDays, color: "text-[#E65100]", href: "/dashboard/attendance" },
    { name: "Fee Collections", icon: Wallet, color: "text-[#2E7D32]", href: "/dashboard/fees" },
    { name: "Growth Analytics", icon: BarChart3, color: "text-[#6A1B9A]", href: "/dashboard/analytics" },
    { name: "DPP & Material", icon: BookOpen, color: "text-[#4E342E]", href: "/dashboard/materials" },
    { name: "Test & Ranks", icon: Trophy, color: "text-[#00695C]", href: "/dashboard/tests" },
    { name: "Student CRM", icon: GraduationCap, color: "text-[#F57F17]", href: "/dashboard/students" },
    { name: "Parent Alerts", icon: BellRing, color: "text-[#0277BD]", href: "/dashboard/alerts" },
    { name: "System Settings", icon: Settings, color: "text-[#424242]", href: "/dashboard/settings" },
  ];

  return (
    <div className="w-full bg-[#f3f4f6] min-h-screen font-sans pb-10">
      
      {/* ── Welcome Bar ── */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] shadow-md">
        <div className="px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-[11px] font-semibold uppercase tracking-widest">Executive Control Panel</p>
            <h1 className="text-white text-xl font-black tracking-wide mt-0.5">
              Welcome back, {user.email?.split("@")[0]?.toUpperCase() || "DIRECTOR"}
            </h1>
          </div>
          <LayoutGrid className="w-8 h-8 text-white/30 hidden sm:block" />
        </div>
      </div>

      <div className="p-4 sm:p-6 flex flex-col xl:flex-row gap-6 items-start max-w-[1600px] mx-auto">
        
        {/* ── Full Workspace Grid ── */}
        <div className="flex-1 bg-white border border-gray-300 shadow-sm overflow-hidden rounded-xl">
          <div className="bg-[#eef5fa] px-6 py-3 border-b border-gray-300">
            <h2 className="text-[#0055a5] text-[13px] font-bold uppercase tracking-wide">All Workspace Modules</h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-12 gap-x-8">
              {gridItems.map((item, index) => (
                <Link 
                  key={index} 
                  href={item.href}
                  className="flex flex-col items-center justify-start gap-3 group outline-none"
                >
                  <div className="w-[72px] h-[72px] bg-white rounded-xl border border-gray-300 flex items-center justify-center shadow-sm group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-[#0055a5] transition-all duration-200 ease-in-out relative">
                    <item.icon className={`w-8 h-8 ${item.color} group-hover:scale-110 transition-transform duration-200`} strokeWidth={1.5} />
                    <div className="absolute inset-0 rounded-xl ring-2 ring-transparent group-hover:ring-[#0055a5]/10 transition-all"></div>
                  </div>
                  <span className="text-[13px] text-gray-800 font-medium text-center leading-tight px-1 group-hover:text-[#0055a5] transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[340px] shrink-0 bg-white border border-gray-300 shadow-sm flex flex-col">
          <div className="bg-gradient-to-b from-[#e8f5e9] to-[#c8e6c9] py-2.5 text-center border-b border-gray-300">
            <h2 className="text-[#2e7d32] text-[15px] font-bold tracking-wide">Institute Profile</h2>
          </div>
          
          <div className="flex justify-center py-6 bg-white border-b border-gray-200 relative">
            <div className="absolute inset-0 bg-[#f8f9fa] opacity-50"></div>
            <div className="w-24 h-24 bg-white rounded-lg border border-gray-300 flex items-center justify-center overflow-hidden shadow-sm relative z-10">
              <Building2 className="w-12 h-12 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-col text-[12.5px]">
            <div className="flex items-center bg-[#fff9c4] px-4 py-2.5 border-b border-gray-200 hover:bg-[#fff59d] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">Registration No</span>
              <span className="w-3/5 text-gray-900 font-medium">{institute?.slug || "N/A"}</span>
            </div>
            
            <div className="flex items-center bg-[#c8e6c9] px-4 py-2.5 border-b border-gray-200 hover:bg-[#a5d6a7] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">Institute Name</span>
              <span className="w-3/5 text-gray-900 font-medium">{institute?.name || "N/A"}</span>
            </div>
            
            <div className="flex items-center bg-[#f8bbd0] px-4 py-2.5 border-b border-gray-200 hover:bg-[#f48fb1] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">HQ Branch</span>
              <span className="w-3/5 text-gray-900 font-medium">{branch?.city || "Gorakhpur"}</span>
            </div>
            
            <div className="flex items-center bg-[#f5f5f5] px-4 py-2.5 border-b border-gray-200 hover:bg-[#eeeeee] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">Date Established</span>
              <span className="w-3/5 text-gray-900 font-medium">
                {institute?.created_at ? new Date(institute.created_at).toLocaleDateString() : "2026"}
              </span>
            </div>
            
            <div className="flex items-center bg-[#bbdefb] px-4 py-2.5 border-b border-gray-200 hover:bg-[#90caf9] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">Subscription</span>
              <span className="w-3/5 text-gray-900 font-bold">PRO PLAN</span>
            </div>
            
            <div className="flex items-center bg-[#c8e6c9] px-4 py-2.5 border-b border-gray-200 hover:bg-[#a5d6a7] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">System Role</span>
              <span className="w-3/5 text-gray-900 font-bold uppercase">{membership?.role_key || "OWNER"}</span>
            </div>
            
            <div className="flex items-center bg-[#f8bbd0] px-4 py-2.5 border-b border-gray-200 hover:bg-[#f48fb1] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">Email Id</span>
              <span className="w-3/5 text-gray-900 font-medium truncate" title={user.email}>{user.email}</span>
            </div>

            <div className="flex items-center bg-[#f5f5f5] px-4 py-2.5 border-b border-gray-200 hover:bg-[#eeeeee] transition-colors">
              <span className="w-2/5 text-[#0055a5] font-bold">Status</span>
              <span className="w-3/5 text-[#2e7d32] font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#4caf50]"></span> ACTIVE
              </span>
            </div>
            
            <div className="px-4 py-5 bg-white flex justify-center">
              <Link href="/dashboard/settings" className="bg-[#0055a5] hover:bg-[#004080] text-white px-8 py-2 rounded-[3px] text-[13px] font-bold shadow-md transition-colors flex items-center gap-2">
                <UserCircle className="w-4 h-4" /> View Profile
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}