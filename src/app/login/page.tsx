"use client";

import { useState } from "react";
// Swapped to a strict relative path to bypass alias errors
import { createClient } from "../../lib/supabase/client"; 
import { ArrowRight, Mail, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Initialize Supabase client
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  };

  return (
    <div className="min-h-screen bg-muted/50 flex flex-col justify-center items-center p-6">
      <Link href="/" className="flex items-center gap-2 mb-10 cursor-pointer">
        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
          <span className="text-primary-foreground font-bold text-lg tracking-tighter">CW</span>
        </div>
        <span className="font-bold text-2xl tracking-tight text-primary">CoachingWala</span>
      </Link>

      <div className="w-full max-w-md bg-background border border-border rounded-2xl shadow-xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
        
        <h1 className="text-2xl font-bold text-primary mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-sm mb-8">Sign in to your institute dashboard.</p>

        {status === "success" ? (
          <div className="bg-success/10 border border-success/20 rounded-lg p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-bold text-primary mb-2">Check your email</h3>
            <p className="text-sm text-muted-foreground">
              We sent a magic link to <strong>{email}</strong>. Click it to securely log in.
            </p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="director@institute.com"
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-lg text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                />
              </div>
            </div>

            {status === "error" && (
              <p className="text-sm text-destructive font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors disabled:opacity-70"
            >
              {status === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue with Email"} 
              {status !== "loading" && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        )}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">
        Secure, passwordless authentication powered by Supabase.
      </p>
    </div>
  );
}