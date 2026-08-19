import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { 
  LogOut, GraduationCap, Wallet, CalendarCheck, BookOpen, 
  IndianRupee, BellRing, Building2 
} from "lucide-react";
import { logoutStudentAction } from "../../actions/student-portal-auth";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  // 1. 🚨 DEEP FIX: Secure Route Protection - Await the cookies promise!
  const cookieStore = await cookies();
  const studentSession = cookieStore.get('cw_student_session');
  
  if (!studentSession?.value) {
    redirect("/student/login");
  }

  // 2. Fetch Data securely using Anon Key (we only query the specific student ID)
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  
  const { data: student, error } = await supabase
    .from('students')
    .select(`
      *,
      institutes (name, logo_url, branches (city))
    `)
    .eq('id', studentSession.value)
    .single();

  if (error || !student) {
    redirect("/student/login");
  }

  // Calculate Financials
  const gross = Number(student.gross_fee) || 0;
  const discount = Number(student.discount_amount) || 0;
  const netFee = gross - discount;
  const paid = Number(student.amount_paid) || 0;
  const due = Math.max(0, netFee - paid);

  // Calculate Attendance (Simplified for dashboard)
  const attendance = student.attendance || [];
  const totalClasses = attendance.length;
  const presentClasses = attendance.filter((a: any) => a.status === 'present' || a.status === 'late').length;
  const attPercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  const instData = Array.isArray(student.institutes) ? student.institutes[0] : student.institutes;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {instData?.logo_url ? (
              <img src={instData?.logo_url} alt="Logo" className="h-8 w-8 object-contain" />
            ) : (
              <Building2 className="h-6 w-6 text-[#0055a5]" />
            )}
            <span className="font-black text-slate-800 tracking-tight hidden sm:block">
              {instData?.name || "Institute Portal"}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-[#0055a5] transition-colors rounded-full hover:bg-slate-100">
              <BellRing className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <form action={logoutStudentAction}>
              <button type="submit" className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#003366] to-[#0055a5] rounded-2xl p-6 sm:p-8 shadow-lg text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-10">
            <GraduationCap className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <p className="text-blue-100 font-bold uppercase tracking-wider text-xs mb-2">Welcome Back,</p>
            <h1 className="text-3xl sm:text-4xl font-black mb-1">{student.full_name}</h1>
            <p className="text-blue-100 flex items-center gap-1.5 text-sm font-medium">
              Roll No: {student.roll_number || "N/A"} • Batch: {student.batch_id || "Unassigned"}
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card: Financial Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <Wallet className="w-4 h-4 text-[#0055a5]" /> Fee Status
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              <p className="text-3xl font-black text-slate-800">₹{due.toLocaleString('en-IN')}</p>
              <p className="text-xs font-bold text-red-500 uppercase tracking-wide mt-1">Pending Balance</p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm font-bold">
              <span className="text-slate-500">Total Paid: <span className="text-green-600">₹{paid.toLocaleString('en-IN')}</span></span>
              <span className="text-slate-500">Net Fee: ₹{netFee.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Card: Attendance Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CalendarCheck className="w-4 h-4 text-[#0055a5]" /> Attendance
            </h2>
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-end gap-2">
                <p className={`text-4xl font-black ${attPercentage >= 75 ? 'text-green-600' : attPercentage >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                  {attPercentage}%
                </p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                <div className={`h-full ${attPercentage >= 75 ? 'bg-green-500' : attPercentage >= 50 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${attPercentage}%` }}></div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-sm font-bold">
              <span className="text-slate-500">Classes Attended: <span className="text-slate-800">{presentClasses}/{totalClasses}</span></span>
            </div>
          </div>

          {/* Card: Quick Links */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 lg:col-span-1 md:col-span-2">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-[#0055a5]" /> Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#0055a5]/30 hover:bg-blue-50 transition-all group">
                <span className="font-bold text-slate-700 group-hover:text-[#0055a5]">Download Fee Receipts</span>
                <IndianRupee className="w-4 h-4 text-slate-400 group-hover:text-[#0055a5]" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-[#0055a5]/30 hover:bg-blue-50 transition-all group">
                <span className="font-bold text-slate-700 group-hover:text-[#0055a5]">Study Material / DPPs</span>
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-[#0055a5]" />
              </button>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}