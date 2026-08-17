"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck, User, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function SignupPage() {
  const router = useRouter();
  
  // 🚨 DEEP FIX: Use Supabase SSR Browser Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          // 🚨 Since it's a signup, route to onboarding!
          redirectTo: `${window.location.origin}/auth/callback?next=/onboarding` 
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message);
      setGoogleLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setErrorMessage("You must agree to the Terms of Service.");
      return;
    }
    setLoading(true);
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName, phone: mobile } }
      });
      if (error) throw error;
      
      router.refresh();
      router.push("/onboarding");
    } catch (err: any) {
      setErrorMessage(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex font-sans selection:bg-[#1353E5] selection:text-white bg-white">
      
      <div className="hidden lg:flex flex-col w-[45%] bg-[#0055a5] text-white p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/hexellence.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col h-full">
          <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 px-4 py-2 rounded-xl w-max shadow-sm backdrop-blur-sm mb-16">
            <GraduationCap className="w-5 h-5" />
            <span className="font-bold tracking-wide">CoachingWala <span className="font-normal opacity-80">ERP</span></span>
          </div>

          <h1 className="text-[3.5rem] font-black leading-[1.05] tracking-tight mb-6">
            Digitize Your<br/>Coaching Institute<br/>Today.
          </h1>
          
          <p className="text-lg text-blue-100 font-medium leading-relaxed mb-12 max-w-md">
            Start your <span className="bg-white/20 px-2 py-0.5 rounded text-white font-bold">7-Day Free Trial</span>. Experience enterprise-grade automation tailored for modern educators.
          </p>

          <div className="mt-auto bg-[#004080] rounded-2xl p-8 border border-white/5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-200 mb-6">
              <ShieldCheck className="w-4 h-4" /> Unlocked During Free Trial
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-white" /></div>
                <span className="font-bold text-[15px]">Student Record Management</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-white" /></div>
                <span className="font-bold text-[15px]">Global Attendance Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[55%] flex flex-col relative px-6 sm:px-16 py-8 overflow-y-auto">
        <div className="absolute top-8 right-8 hidden sm:block text-sm font-medium text-slate-500">
          Already Have An Account? <Link href="/login" className="text-[#0055a5] font-bold hover:underline">Log In</Link>
        </div>

        <div className="max-w-[420px] w-full mx-auto my-auto py-12">
          
          <div className="mb-8">
            <h2 className="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">Sign Up For Your Free Trial</h2>
            <p className="text-[#64748B] text-[13px] font-medium">Get A Live, Personalized Walkthrough Included In Your Free Trial.</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold">{errorMessage}</div>
          )}

          <button onClick={handleGoogleSignIn} disabled={googleLoading || loading} className="w-full flex items-center justify-center gap-3 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] font-bold py-3.5 rounded-xl transition-all shadow-[0_2px_10px_rgba(0,0,0,0.04)] active:scale-[0.98]">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#0055a5]" /> : <><GoogleLogo /> Sign up with Google</>}
          </button>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-[#E2E8F0] flex-1"></div>
            <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Or Register With Email</span>
            <div className="h-px bg-[#E2E8F0] flex-1"></div>
          </div>

          <form onSubmit={handleEmailSignUp} className="space-y-4">
            <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:border-[#0055a5] outline-none transition-all font-semibold text-sm text-[#0F172A] placeholder:text-[#94A3B8]" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email ID" className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:border-[#0055a5] outline-none transition-all font-semibold text-sm text-[#0F172A] placeholder:text-[#94A3B8]" />
            <input type="tel" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} placeholder="Mobile Number" className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:border-[#0055a5] outline-none transition-all font-semibold text-sm text-[#0F172A] placeholder:text-[#94A3B8]" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create Password" className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:border-[#0055a5] outline-none transition-all font-semibold text-sm text-[#0F172A] placeholder:text-[#94A3B8]" />

            <label className="flex items-start gap-3 mt-6 cursor-pointer group">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 w-4 h-4 text-[#0055a5] rounded border-[#CBD5E1] cursor-pointer" />
              <span className="text-[12px] font-medium text-[#64748B] group-hover:text-[#0F172A] transition-colors leading-tight">
                By Signing Up, You Agree To Our <Link href="#" className="text-[#0055a5] font-bold hover:underline">Terms Of Service</Link> And <Link href="#" className="text-[#0055a5] font-bold hover:underline">Privacy Policy</Link>.
              </span>
            </label>

            <button disabled={loading || googleLoading} type="submit" className="w-full bg-[#0055a5] hover:bg-[#004080] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/20 mt-4 active:scale-[0.98]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Sign Up"}
            </button>
          </form>
          
          <div className="mt-8 text-center sm:hidden">
            <span className="text-sm font-medium text-slate-500">Already Have An Account? <Link href="/login" className="text-[#0055a5] font-bold">Log In</Link></span>
          </div>

        </div>
      </div>
    </main>
  );
}