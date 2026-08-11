"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, GraduationCap, ShieldCheck, User, Clock, CreditCard, BookOpen, AlertTriangle 
} from "lucide-react";
import { signUpFreeTrialAction, loginOwnerAction } from "../actions/owner-auth";
import { createClient } from "../../lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [agreed, setAgreed] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", email: "", mobile: "", password: ""
  });

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Direct new Google signups to the onboarding wizard
        redirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. Create the account in Supabase
      await signUpFreeTrialAction(formData.email, formData.password);
      // 2. Establish the session
      await loginOwnerAction(formData.email, formData.password);
      // 3. Send them to setup their workspace
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message || "An error occurred during signup.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex font-sans selection:bg-blue-100 selection:text-blue-900 bg-white">
      
      {/* LEFT SIDE (Marketing Banner) */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-[#003B73] to-[#0074B7] text-white p-12 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-center max-w-lg mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-8 border border-white/20 bg-white/10 w-fit pr-6 pl-2 py-2 rounded-xl backdrop-blur-sm">
              <div className="bg-white/20 p-2 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black tracking-wide">CoachingWala <span className="font-light opacity-80">ERP</span></h1>
            </div>
            <h2 className="text-5xl font-extrabold leading-[1.1] mb-6 drop-shadow-sm tracking-tight">
              Digitize Your Coaching Institute Today.
            </h2>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">
              Start your <span className="font-bold text-white bg-white/20 px-2.5 py-1 rounded-md border border-white/20">7-Day Free Trial</span>. Experience enterprise-grade automation tailored for modern educators.
            </p>
          </div>

          <div className="bg-[#00264d]/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-blue-200 mb-6 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" /> Unlocked During Free Trial
            </h3>
            <ul className="space-y-5">
              {[
                { icon: User, label: "Student Record Management" },
                { icon: Clock, label: "Global Attendance Tracking" },
                { icon: CreditCard, label: "Fee Collection & Ledger" },
                { icon: BookOpen, label: "Course & Master Setup" }
              ].map((Feature, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <div className="bg-white/10 p-2.5 rounded-xl border border-white/5"><Feature.icon className="w-5 h-5 text-blue-100" /></div>
                  <span className="font-semibold text-[15px] tracking-wide text-white">{Feature.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Interactive Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 py-12 relative overflow-y-auto">
        <div className="absolute top-8 right-8 text-sm font-medium text-slate-500 hidden sm:block">
          Already Have An Account? <Link href="/login" className="text-[#0055a5] font-bold hover:underline">Log In</Link>
        </div>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign Up For Your Free Trial</h2>
            <p className="text-slate-500 text-sm font-medium">Get A Live, Personalized Walkthrough Included In Your Free Trial.</p>
          </div>

          {error && (
            <div className="mb-6 bg-[#ffebee] border border-[#ffcdd2] p-4 text-sm font-bold text-[#cc0000] flex items-start gap-2 rounded-xl shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
              <span>{error}</span>
            </div>
          )}

          <button 
            onClick={handleGoogleSignup} 
            type="button" 
            disabled={isLoading || isGoogleLoading}
            className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-300 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Sign up with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or register with email</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Full Name" required className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all font-medium text-slate-800 placeholder:text-gray-400" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} disabled={isLoading || isGoogleLoading}/>
            <input type="email" placeholder="Email ID" required className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all font-medium text-slate-800 placeholder:text-gray-400" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} disabled={isLoading || isGoogleLoading}/>
            <input type="tel" placeholder="Mobile Number" required className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all font-medium text-slate-800 placeholder:text-gray-400" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} disabled={isLoading || isGoogleLoading}/>
            <input type="password" placeholder="Create Password" required minLength={6} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all font-medium text-slate-800 placeholder:text-gray-400" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} disabled={isLoading || isGoogleLoading}/>

            <div className="pt-2 flex items-start gap-3">
              <input type="checkbox" id="terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 text-[#0055a5] rounded border-gray-300 focus:ring-[#0055a5]" disabled={isLoading || isGoogleLoading}/>
              <label htmlFor="terms" className="text-xs text-slate-500 font-medium leading-relaxed">
                By Signing Up, You Agree To Our <Link href="#" className="text-[#0055a5] hover:underline font-bold">Terms Of Service</Link> And <Link href="#" className="text-[#0055a5] hover:underline font-bold">Privacy Policy</Link>.
              </label>
            </div>

            <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/30 hover:shadow-[#0055a5]/40 mt-2 flex items-center justify-center active:scale-[0.98] disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up For Free Trial"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}