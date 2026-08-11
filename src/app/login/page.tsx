"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, GraduationCap, AlertTriangle } from "lucide-react";
import { loginOwnerAction } from "../actions/owner-auth";
import { createClient } from "../../lib/supabase/client"; 

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    const supabase = createClient();
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await loginOwnerAction(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials.");
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      <header className="w-full bg-white py-6 px-8 border-b border-gray-100 flex justify-between items-center shadow-sm relative z-10">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <div className="bg-[#0055a5] p-1.5 rounded-md">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-[#0055a5]">CoachingWala</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <Link href="/signup" className="text-[#0055a5] border border-[#0055a5] px-5 py-2 rounded-full font-bold hover:bg-[#e6f2ff] transition-colors">Get free Trial</Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0055a5]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl shadow-[#0055a5]/10 p-10 border border-gray-100 relative z-10">
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Welcome Back!</h1>
            <p className="text-slate-500 text-sm font-medium">Login to your CoachingWala Account</p>
          </div>

          {error && (
            <div className="mb-6 bg-[#ffebee] border border-[#ffcdd2] p-4 text-sm font-bold text-[#cc0000] flex items-start gap-2 rounded-xl shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <input 
              type="email" 
              placeholder="Email ID" 
              required
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all font-medium text-slate-800 placeholder:text-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || isGoogleLoading}
            />

            <div className="space-y-2">
              <input 
                type="password" 
                placeholder="Password" 
                required
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/20 transition-all font-medium text-slate-800 placeholder:text-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isGoogleLoading}
              />
              <div className="flex justify-end">
                <Link href="#" className="text-sm font-bold text-[#0055a5] hover:underline">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" disabled={isLoading || isGoogleLoading} className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/30 hover:shadow-[#0055a5]/40 mt-4 flex items-center justify-center active:scale-[0.98] disabled:opacity-70">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="h-px bg-gray-200 flex-1"></div>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or</span>
              <div className="h-px bg-gray-200 flex-1"></div>
            </div>

            {/* Google SSO Login */}
            <button 
              onClick={handleGoogleLogin} 
              type="button" 
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
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
              Sign in with Google
            </button>

            <div className="text-center pt-2 text-sm text-slate-500 font-medium">
              Don't Have An Account? <Link href="/signup" className="text-[#0055a5] font-bold hover:underline">Sign Up</Link>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}