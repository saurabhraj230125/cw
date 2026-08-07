"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogOut, BookOpen, CalendarDays, FileText, Download, 
  User, Loader2, Clock, CheckCircle2, AlertCircle, 
  PlayCircle, Sparkles, ChevronRight, BarChart3
} from "lucide-react";
import { getStudentDashboardData } from "../../actions/student-dashboard-actions";
import { studentLogoutAction } from "../../actions/student-auth";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  const [student, setStudent] = useState<any>(null);
  const [materials, setMaterials] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getStudentDashboardData();
        setStudent(data.student);
        setMaterials(data.materials);
        setTests(data.tests);
      } catch (error: any) {
        if (error.message === "UNAUTHORIZED") router.push("/student/login");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    await studentLogoutAction();
    router.push("/student/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-cw-blue blur-xl opacity-20 rounded-full"></div>
          <Loader2 className="w-10 h-10 animate-spin text-cw-blue relative z-10" />
        </div>
        <p className="font-bold text-gray-500 tracking-widest uppercase text-xs animate-pulse">Authenticating Secure Session...</p>
      </div>
    );
  }

  if (!student) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] font-sans flex flex-col pb-12 selection:bg-cw-blue selection:text-white">
      
      {/* PREMIUM NAVIGATION BAR */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-cw-blue to-blue-600 p-2.5 rounded-xl shadow-md shadow-blue-500/20">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg leading-tight tracking-tight">{student.full_name}</h1>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">Roll No: {student.roll_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Assigned Batch</span>
            <span className="font-bold text-sm text-cw-blue bg-pastel-blueBg px-3 py-1 rounded-full border border-pastel-blueBorder shadow-sm">
              {student.batch_id || "Unassigned"}
            </span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-600 hover:text-cw-red hover:bg-red-50 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            Logout <LogOut className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* HERO WELCOME BANNER */}
      <div className="max-w-[1200px] mx-auto w-full px-6 pt-8 pb-4">
        <div className="bg-gradient-to-r from-cw-blue via-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 space-y-2 text-center md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center justify-center md:justify-start gap-2">
              {greeting}, {student.full_name.split(' ')[0]}! <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </h2>
            <p className="text-blue-100 font-medium text-sm max-w-lg leading-relaxed">
              Welcome to your dedicated learning hub. You have <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{materials.length}</span> study materials and <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded-md">{tests.length}</span> upcoming exams. Let's crack it.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center w-28 shadow-inner">
              <BookOpen className="w-6 h-6 mb-1 text-blue-200" />
              <span className="text-2xl font-black">{materials.length}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Resources</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex flex-col items-center justify-center w-28 shadow-inner">
              <BarChart3 className="w-6 h-6 mb-1 text-blue-200" />
              <span className="text-2xl font-black">{tests.length}</span>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-200">Exams</span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="px-6 max-w-[1200px] mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
        
        {/* LEFT COLUMN: CBT EXAM CENTER */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg tracking-tight">Exam Center</h2>
          </div>
          
          <div className="space-y-4">
            {tests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-2">
                  <CheckCircle2 className="w-6 h-6 text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-700">No active exams</h3>
                <p className="text-xs text-gray-500">You are all caught up! Enjoy your free time.</p>
              </div>
            ) : (
              tests.map(test => {
                const testDate = new Date(test.test_date);
                const isPast = testDate < new Date(new Date().setHours(0,0,0,0));
                const isLiveNow = !isPast && test.is_live;

                return (
                  <div key={test.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
                    <div className={`h-1.5 w-full ${isLiveNow ? 'bg-cw-green' : isPast ? 'bg-gray-300' : 'bg-cw-blue'}`}></div>
                    
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className={`font-bold text-base leading-tight ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>{test.title}</h3>
                        {isLiveNow && (
                          <span className="bg-green-100 text-green-700 text-[9px] font-extrabold px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 shrink-0 animate-pulse border border-green-200">
                            <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span> Live
                          </span>
                        )}
                        {!isLiveNow && !isPast && (
                          <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 shrink-0 border border-blue-100">
                            <Clock className="w-3 h-3"/> Soon
                          </span>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 mb-4">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          <CalendarDays className="w-3.5 h-3.5 text-gray-400" /> {testDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100 text-gray-600">{test.duration_minutes || 180} Mins</span>
                        <span className="bg-gray-50 px-2 py-1 rounded-md border border-gray-100 text-gray-600">{test.total_marks} Marks</span>
                      </div>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-gray-600 font-medium">
                        <span className="font-bold text-[10px] uppercase text-gray-400 block mb-1.5 tracking-wider">Syllabus Covered</span>
                        <p className="line-clamp-2 leading-relaxed">{test.syllabus || "Full Mock Syllabus"}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {isLiveNow ? (
                          <button onClick={() => router.push(`/student/exam/${test.id}`)} className="w-full bg-gradient-to-r from-cw-green to-emerald-600 hover:from-emerald-600 hover:to-cw-green text-white py-3 rounded-xl text-sm font-bold uppercase tracking-wider cursor-pointer shadow-md shadow-green-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2">
                            <PlayCircle className="w-5 h-5" /> Start Exam Now
                          </button>
                        ) : !isPast ? (
                          <button disabled className="w-full bg-gray-50 text-gray-400 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed border border-gray-200 flex justify-center items-center gap-2">
                            <Clock className="w-4 h-4" /> Waiting for Host
                          </button>
                        ) : test.results_published ? (
                          <button onClick={() => alert(`Your Result Page will load here! Test ID: ${test.id}`)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer hover:shadow-lg transition-all flex justify-center items-center gap-2">
                            View Final Scorecard <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button disabled className="w-full bg-orange-50 text-orange-600 border border-orange-200 py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed flex justify-center items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" /> Results Processing...
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DIGITAL STUDY LIBRARY */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-teal-600" />
              </div>
              <h2 className="font-bold text-gray-800 text-lg tracking-tight">Digital Library</h2>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">
              {materials.length} Files Available
            </span>
          </div>
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {materials.length === 0 ? (
              <div className="text-center py-24 text-gray-400 font-medium flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                  <AlertCircle className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <p className="text-gray-600 font-bold text-base">Your vault is empty</p>
                  <p className="text-xs mt-1">Teachers haven't uploaded any study materials for this batch yet.</p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {materials.map(mat => (
                  <div key={mat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-slate-50 transition-colors group gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                        <FileText className="w-6 h-6 text-cw-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-tight group-hover:text-cw-blue transition-colors">{mat.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200">
                            {mat.document_type || "Document"}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(mat.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <a href={mat.file_url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold text-white bg-cw-blue hover:bg-blue-700 px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.98] shrink-0">
                      <Download className="w-4 h-4" /> Download File
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}