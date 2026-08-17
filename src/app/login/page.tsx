"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  
  // 🚨 DEEP FIX: Use Supabase SSR Browser Client so it saves to Cookies, not LocalStorage
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          // 🚨 Hit the callback route so cookies get set, then go to dashboard
          redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` 
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMessage(err.message);
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      router.refresh(); // Refresh Next.js server state
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col font-sans bg-[#F8FAFC] selection:bg-[#0055a5] selection:text-white relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F8FAFC] to-[#EFF6FF] pointer-events-none z-0"></div>

      <header className="w-full px-6 py-6 flex items-center justify-between relative z-10">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#0055a5] rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">CoachingWala</span>
        </Link>
        <Link href="/signup" className="border-2 border-[#0055a5] text-[#0055a5] hover:bg-[#0055a5] hover:text-white font-bold px-6 py-2 rounded-full transition-all text-sm">
          Get free Trial
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10 pb-20">
        <div className="bg-white rounded-[2rem] w-full max-w-[460px] p-10 sm:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-[#0F172A] mb-2 tracking-tight">Welcome Back!</h1>
            <p className="text-[14px] font-medium text-[#64748B]">Login to your CoachingWala Account</p>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email ID" className="w-full px-5 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:border-[#0055a5] outline-none transition-all font-semibold text-[14px] text-[#0F172A] placeholder:text-[#94A3B8]" />
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-5 py-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:bg-white focus:border-[#0055a5] outline-none transition-all font-semibold text-[14px] text-[#0F172A] placeholder:text-[#94A3B8]" />
            
            <div className="flex justify-end pt-1">
              <Link href="#" className="text-[13px] font-bold text-[#0055a5] hover:underline">Forgot Password?</Link>
            </div>

            <button disabled={loading || googleLoading} type="submit" className="w-full bg-[#0055a5] hover:bg-[#004080] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/20 mt-2 active:scale-[0.98]">
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Log In"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-[#E2E8F0] flex-1"></div>
            <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest">OR</span>
            <div className="h-px bg-[#E2E8F0] flex-1"></div>
          </div>

          <button onClick={handleGoogleSignIn} disabled={googleLoading || loading} className="w-full flex items-center justify-center gap-3 bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] text-[#0F172A] font-bold py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.98]">
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#0055a5]" /> : <><GoogleLogo /> Sign in with Google</>}
          </button>

          <div className="mt-10 text-center">
            <span className="text-[14px] font-medium text-slate-500">Don't Have An Account? <Link href="/signup" className="text-[#0055a5] font-bold hover:underline">Sign Up</Link></span>
          </div>

        </div>
      </div>
    </main>
  );
}