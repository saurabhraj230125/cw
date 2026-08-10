"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Building2, Lock, Mail, ArrowRight, Loader2, CheckCircle2, 
  ShieldCheck, GraduationCap, Clock, CreditCard, BookOpen,
  AlertTriangle, User // <-- FIXED: Added missing imports
} from "lucide-react";
import { loginOwnerAction, registerFreeTrialAction } from "../actions/owner-auth";

export default function SaaSGatewayPage() {
  const router = useRouter();
  
  // UI State
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [instituteName, setInstituteName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await loginOwnerAction(email, password);
        router.push("/dashboard");
      } else {
        if (!instituteName) throw new Error("Institute Name is required for the Free Trial.");
        if (password.length < 6) throw new Error("Password must be at least 6 characters.");
        
        await registerFreeTrialAction(instituteName, email, password);
        // Registration successful! Log them in automatically
        await loginOwnerAction(email, password);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setPassword("");
    setInstituteName("");
  };

  return (
    <main className="min-h-screen bg-white font-sans flex select-none">
      
      {/* ========================================================= */}
      {/* LEFT SIDE: MARKETING & FREE TRIAL VALUE PROP */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-br from-[#003366] via-[#0055a5] to-[#0073e6] text-white p-12 relative overflow-hidden shadow-2xl z-10">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none transition-transform duration-1000 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-[#00a3cc]/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col h-full justify-between">
          
          {/* Logo & Branding */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 p-2.5 rounded-xl backdrop-blur-md border border-white/20 shadow-lg">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-black tracking-wide">FUTURE Q <span className="font-light opacity-80">ERP</span></h1>
            </div>
            
            <h2 className="text-4xl font-extrabold leading-tight mb-4 drop-shadow-sm">
              Digitize Your Coaching Institute Today.
            </h2>
            <p className="text-blue-100 text-lg font-medium mb-10 max-w-md leading-relaxed">
              Start your <span className="font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-md shadow-sm border border-white/10">7-Day Free Trial</span>. Experience enterprise-grade automation tailored for modern educators.
            </p>
          </div>

          {/* Feature Unlocks during Trial */}
          <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8 shadow-inner animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Unlocked During Free Trial
            </h3>
            <ul className="space-y-4">
              {[
                { icon: User, label: "Student Record Management" },
                { icon: Clock, label: "Global Attendance Tracking" },
                { icon: CreditCard, label: "Fee Collection & Ledger" },
                { icon: BookOpen, label: "Course & Master Setup" },
                { icon: Building2, label: "Batch Master Architecture" }
              ].map((Feature, idx) => (
                <li key={idx} className="flex items-center gap-3 group">
                  <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors border border-white/5"><Feature.icon className="w-4 h-4 text-[#66ccff]" /></div>
                  <span className="font-semibold text-sm tracking-wide text-gray-50 group-hover:text-white transition-colors">{Feature.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-xs text-blue-200 font-bold flex items-center gap-2 opacity-80 uppercase tracking-widest">
            <CheckCircle2 className="w-4 h-4" /> No credit card required. Cancel anytime.
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: THE AUTH FORM */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-[#f8fafc] relative">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="inline-flex items-center justify-center bg-[#e6f2ff] text-[#0055a5] p-3 rounded-2xl mb-4 lg:hidden shadow-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              {isLogin ? "Welcome Back" : "Claim Your Free Trial"}
            </h2>
            <p className="text-sm font-bold text-gray-500">
              {isLogin ? "Enter your admin credentials to access your dashboard." : "Set up your institute's cloud environment in seconds."}
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-[#0055a5]/5 border border-gray-100 p-8 sm:p-10 animate-in zoom-in-95 duration-300">
            
            {error && (
              <div className="mb-6 bg-[#ffebee] border border-[#ffcdd2] p-4 text-sm font-bold text-[#cc0000] flex items-start gap-2 rounded-xl shadow-sm animate-in shake">
                <AlertTriangle className="w-5 h-5 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {!isLogin && (
                <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">Institute Name</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0055a5] transition-colors" />
                    <input 
                      type="text" 
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      required={!isLogin}
                      placeholder="e.g. Apex Academy" 
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-semibold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">Admin Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0055a5] transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="director@institute.com" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-semibold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest">Password</label>
                  {isLogin && <a href="#" className="text-[11px] font-bold text-[#0055a5] hover:underline">Forgot Password?</a>}
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#0055a5] transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-semibold text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
                {!isLogin && <p className="text-[10px] font-bold text-gray-400 text-right mt-1">Must be at least 6 characters</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/30 hover:shadow-[#0055a5]/40 active:scale-[0.98] flex justify-center items-center gap-2 mt-4 text-[15px]"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isLogin ? (
                  <>Secure Login <ArrowRight className="w-5 h-5" /></>
                ) : (
                  <>Start 7-Day Free Trial <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-bold text-gray-500 pt-6 border-t border-gray-100">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                onClick={toggleAuthMode}
                className="ml-2 text-[#0055a5] hover:underline hover:text-[#004080] transition-colors"
              >
                {isLogin ? "Start Free Trial" : "Log In Here"}
              </button>
            </div>

          </div>
          
          <div className="text-center mt-8 text-xs font-bold text-gray-400">
            &copy; {new Date().getFullYear()} Future Q Enterprise. All rights reserved.
          </div>
        </div>
      </div>
    </main>
  );
}