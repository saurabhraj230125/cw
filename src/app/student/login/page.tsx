"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, ArrowRight, User, Calendar, ShieldCheck } from "lucide-react";
import { studentLoginAction } from "../../actions/student-auth";

export default function StudentLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login Credentials
  const [rollNumber, setRollNumber] = useState("");
  const [dob, setDob] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rollNumber || !dob) {
      setError("Please enter both Roll Number and Date of Birth.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Calls the secure Next.js Server Action we built earlier
      const res = await studentLoginAction(rollNumber, dob);
      if (res.success) {
        // Instantly redirect to their secure dashboard
        router.push("/student/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please check your Roll Number and DOB.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cw-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cw-green/10 rounded-full blur-3xl"></div>

      <div className="bg-white border border-erp-border w-full max-w-md rounded-erp shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-500">
        
        {/* Top Branding Banner */}
        <div className="bg-cw-blue p-8 flex flex-col items-center justify-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="bg-white/20 p-3 rounded-full mb-3 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">Student Portal</h1>
          <p className="text-white/80 text-sm font-medium mt-1">Academic & Testing Gateway</p>
        </div>

        {/* Login Form */}
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-pastel-redBg border-l-4 border-cw-red p-3 text-sm font-bold text-cw-red shadow-sm animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-erp-sm font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                <User className="w-4 h-4 text-cw-blue" /> Roll Number
              </label>
              <input 
                type="text" 
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 2026-SCI-001" 
                className="w-full border border-erp-border p-3 focus:border-cw-blue outline-none rounded-sm shadow-inner text-erp-base font-bold text-gray-900 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-erp-sm font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                <Calendar className="w-4 h-4 text-cw-blue" /> Date of Birth
              </label>
              <input 
                type="date" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full border border-erp-border p-3 focus:border-cw-blue outline-none rounded-sm shadow-inner text-erp-base font-bold text-gray-900 cursor-pointer transition-colors"
              />
              <p className="text-[10px] text-gray-500 font-bold text-right mt-1">Format: DD-MM-YYYY</p>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-cw-blue text-white py-3.5 font-bold text-erp-md rounded-erp hover:bg-cw-blueDark flex justify-center items-center gap-2 shadow-erp-button disabled:opacity-70 transition-all active:scale-[0.98] mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Secure Login <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-erp-borderLight flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
            <ShieldCheck className="w-4 h-4" /> SSL Encrypted & Secured by Future Q
          </div>
        </div>
      </div>
    </main>
  );
}