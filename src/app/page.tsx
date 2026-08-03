"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ArrowRight, PlayCircle, Wallet, CalendarCheck, Users, 
  CheckSquare, BookOpen, BarChart3, XCircle, CheckCircle2, 
  ShieldCheck, Award, FileText, MessageSquare, Smartphone, Check,
  Sparkles
} from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. FLOATING NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="text-white font-black text-lg tracking-tighter">CW</span>
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              CoachingWala
            </span>
          </div>
          
          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Features</Link>
            <Link href="#modules" className="hover:text-blue-600 transition-colors">Modules</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="https://student.coachingwala.com" className="hover:text-blue-600 transition-colors">Student Portal</Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <Link href="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              Log in
            </Link>
            <Link href="/onboarding" className="text-sm font-bold bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-black transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 pb-32 px-6 max-w-7xl mx-auto overflow-hidden">
        {/* Modern Background Grid pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#F8FAFC] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4" /> The #1 OS for Indian Institutes
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900 mb-6">
              Run your coaching <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                on autopilot.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-medium max-w-lg">
              Manage students, track subject-wise fees, automate bunk alerts, and publish test ranks from one beautiful dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/onboarding" className="inline-flex justify-center items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1">
                Start 7-Day Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="inline-flex justify-center items-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all">
                <PlayCircle className="w-5 h-5 text-slate-400" /> See it in action
              </Link>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-500">No credit card required. Setup in 60 seconds.</p>
          </div>

          {/* Hero Illustration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center lg:ml-10"
          >
            {/* Premium Glass Container */}
            <div className="absolute inset-0 md:inset-4 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-3xl border border-white shadow-2xl rounded-[3rem] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay"></div>
              <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-blue-400/20 blur-[80px] rounded-full"></div>
              <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-400/20 blur-[80px] rounded-full"></div>
            </div>

            {/* The Floating Image */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative w-[90%] h-[90%] z-10"
            >
              <Image
                src="/hero-illustration.png"
                alt="CoachingWala Dashboard"
                fill
                priority
                className="object-contain drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3. PROBLEMS & SOLUTIONS */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900">Leave the old ways behind.</h2>
          <p className="text-slate-500 mt-4 font-medium text-lg">Stop fighting with Excel sheets and WhatsApp groups.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { text: "No more Excel", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
            { text: "No manual registers", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
            { text: "No lost receipts", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
            { text: "No parent complaints", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
            { text: "100% Automated", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", highlight: true }
          ].map((item, i) => (
            <div key={i} className={`rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center transition-all ${item.highlight ? 'bg-white shadow-xl shadow-emerald-500/10 border-2 border-emerald-100 scale-105' : 'bg-white shadow-sm border border-slate-200'}`}>
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <p className="font-bold text-slate-800 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MODULES BENTO GRID */}
      <section id="modules" className="bg-slate-900 py-32 px-6 rounded-[3rem] mx-4 sm:mx-8 mb-24 shadow-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-slate-400 text-lg font-medium">A unified ecosystem built specifically for Indian coaching centers.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { name: "Student CRM", desc: "Manage admissions", icon: Users },
              { name: "Fee Ledger", desc: "Track partial payments", icon: Wallet },
              { name: "Attendance", desc: "Automated SMS alerts", icon: CalendarCheck },
              { name: "Study Material", desc: "Cloud DPP & Notes", icon: BookOpen },
              { name: "Test Tracker", desc: "Ranks & Percentiles", icon: Award },
              { name: "Analytics", desc: "Growth insights", icon: BarChart3 },
              { name: "Parent App", desc: "Real-time updates", icon: Smartphone },
              { name: "Notice Board", desc: "Instant broadcasts", icon: MessageSquare }
            ].map((mod, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 hover:bg-slate-800 p-6 rounded-2xl flex flex-col gap-4 hover:border-blue-500/50 transition-all group cursor-pointer">
                <div className="p-3 bg-slate-700/50 rounded-xl w-fit group-hover:bg-blue-500/20 transition-colors">
                  <mod.icon className="h-6 w-6 text-slate-300 group-hover:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base mb-1">{mod.name}</h3>
                  <p className="text-slate-400 text-sm font-medium">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">Simple pricing for growing institutes.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {[
            { name: "Starter", price: "₹799", target: "For individual tutors.", features: ["Up to 50 Students", "Attendance Tracking", "Basic Fee Ledger", "Email Support"] },
            { name: "Growth", price: "₹1,499", target: "For standard coaching centers.", pop: true, features: ["Unlimited Students", "Advanced Fee Installments", "Study Material Cloud", "Automated SMS Alerts", "Rank & Exam Engine"] },
            { name: "Pro Chain", price: "₹3,999", target: "For multi-branch institutes.", features: ["Multi-Branch Management", "White-labeled Parent App", "Custom Domain", "Dedicated Account Manager"] }
          ].map((plan, i) => (
            <div key={i} className={`bg-white border rounded-3xl p-8 relative transition-all ${plan.pop ? 'border-blue-600 shadow-2xl shadow-blue-900/10 scale-105 md:-translate-y-4 z-10' : 'border-slate-200 shadow-sm hover:shadow-md'}`}>
              
              {plan.pop && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-slate-500 text-sm font-medium mb-8 h-10">{plan.target}</p>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                <span className="text-slate-500 font-bold">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className={`p-1 rounded-full ${plan.pop ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all ${plan.pop ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="bg-gradient-to-br from-blue-900 to-slate-900 py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to scale your institute?</h2>
          <p className="text-blue-200 mb-10 text-xl font-medium">Join hundreds of forward-thinking coaching owners today.</p>
          <Link href="/onboarding" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl">
            Create Your Workspace <ArrowRight className="h-6 w-6" />
          </Link>
        </div>
      </section>

    </main>
  );
}