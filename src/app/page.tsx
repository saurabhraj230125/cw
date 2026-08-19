"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Layers, CalendarCheck, Wallet, BookOpen, FileText,
  BarChart3, GraduationCap, Shield, ChevronDown, ArrowRight,
  Check, Star, Zap, Building2, User, Users2, Lock, Database,
  TrendingUp, CheckCircle2, ShieldCheck, BookMarked, FlaskConical,
  IndianRupee, Menu, X, Play, Download, Key, MonitorSmartphone,
  MessageSquare, ChevronRight, PlayCircle, Phone, Video, Laptop,
  Sparkles
} from "lucide-react";

// ════════════════════════════════════════════════════════
// CONSTANTS & DATA
// ════════════════════════════════════════════════════════
const NAV_LINKS = ["Product", "Features", "Pricing", "Resources"];

const FEATURES = [
  { icon: Users,             color: "text-blue-600",   bg: "bg-blue-50",   title: "Student Management",  desc: "Complete student profiles with admission records, guardian info, fee history, attendance, and academic progress."   },
  { icon: Layers,            color: "text-purple-600", bg: "bg-purple-50", title: "Batch Management",    desc: "Create and manage multiple batches, assign teachers, enroll students, and schedule sessions with full flexibility." },
  { icon: CalendarCheck,     color: "text-green-600",  bg: "bg-green-50",  title: "Attendance Tracking", desc: "Mark daily attendance batch-wise, view historical data, generate reports and identify students at risk."            },
  { icon: Wallet,            color: "text-amber-600",  bg: "bg-amber-50",  title: "Fee Management",      desc: "Installment plans, partial payments, discounts, due date tracking, payment receipts and collection analytics."    },
  { icon: BookMarked,        color: "text-cyan-600",   bg: "bg-cyan-50",   title: "Study Material",      desc: "Upload and organize PDFs, notes, and videos by subject and batch. Students access everything from their portal."  },
  { icon: FileText,          color: "text-indigo-600", bg: "bg-indigo-50", title: "DPP & Assignments",   desc: "Create daily practice problems, assign to batches, set deadlines and track student submission status."              },
  { icon: FlaskConical,      color: "text-rose-600",   bg: "bg-rose-50",   title: "Test Series",         desc: "Conduct chapter, unit, and full-length tests. Auto-evaluate, generate rank lists and share results instantly."    },
  { icon: MonitorSmartphone, color: "text-teal-600",   bg: "bg-teal-50",   title: "Student Portal",      desc: "A dedicated portal for students to view attendance, download study material, submit DPPs and check fees."         },
];

const JOURNEY = ["Admission","Student Profile","Batch Allocation","Daily Attendance","Fee Collection","Study Material","DPP & Assignments","Tests & Exams","Results & Analytics"];

const FAQS = [
  { q: "Is CoachingWala suitable for small institutes?",  a: "Absolutely. The Starter plan at \u20b9799/month is designed for institutes just getting started. You can begin with 20 students and scale up without switching platforms." },
  { q: "Can I upgrade my plan later?",                    a: "Yes. You can upgrade at any time. Your data, students, batches, and history carry forward completely. You never lose progress when you grow." },
  { q: "Does it support multiple batches?",               a: "Yes. All plans support multiple batches with independent schedules, teachers, student lists, attendance, study material, and fee structures — no data mixing." },
  { q: "Can students access the platform?",               a: "Every plan includes a student portal where students can view attendance, download study material, submit DPPs, take tests and check fee payment status without contacting the institute." },
  { q: "Does CoachingWala build websites?",               a: "CoachingWala is a full institute management platform — not a website builder. The Professional plan supports a custom student portal domain so students access the portal from your own domain." },
];

// ════════════════════════════════════════════════════════
// REUSABLE TYPOGRAPHY COMPONENTS
// ════════════════════════════════════════════════════════
function SL({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex items-center gap-2 bg-[#0055a5]/10 border border-[#0055a5]/20 text-[#0055a5] text-[12px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 shadow-sm">{children}</div>;
}
function SH({ children, center=true }: { children: React.ReactNode; center?: boolean }) {
  return <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight ${center?"text-center":""}`}>{children}</h2>;
}

// ════════════════════════════════════════════════════════
// THE DEMO MODAL COMPONENT
// ════════════════════════════════════════════════════════
function DemoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 sm:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 shadow-inner">
                <PlayCircle className="w-6 h-6 text-[#0055a5]" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Book a Live Demo</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Leave your details and we will call you shortly to show you the platform.</p>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Demo request received! We will call you soon."); onClose(); }}>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Institute Name</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" required placeholder="e.g. Apex Academy" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-bold text-slate-900 text-sm placeholder:font-medium shadow-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Your Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="tel" required maxLength={10} placeholder="9876543210" className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-bold text-slate-900 text-sm placeholder:font-medium shadow-sm" />
              </div>
            </div>
            <button type="submit" className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/20 mt-4 active:scale-[0.98]">
              Request Callback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// NAVBAR
// ════════════════════════════════════════════════════════
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl bg-white/90 border-b border-slate-200 shadow-sm" : "bg-white/50 backdrop-blur-md"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 bg-[#0055a5] rounded-xl flex items-center justify-center shadow-lg shadow-[#0055a5]/30 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-slate-900 text-lg tracking-tight">CoachingWala</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-bold text-slate-600 hover:text-[#0055a5] transition-colors">{l}</a>)}
        </div>
        <div className="hidden md:flex items-center gap-4 shrink-0">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-[#0055a5] transition-colors">Log In</Link>
          <Link href="/signup" className="flex items-center gap-1.5 bg-[#0055a5] hover:bg-[#004080] text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-[#0055a5]/20 transition-all hover:-translate-y-0.5">
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <button className="md:hidden p-2 text-slate-600" onClick={() => setOpen(p => !p)}>{open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-xl">
          {NAV_LINKS.map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)} className="block py-3 text-[15px] font-bold text-slate-700 border-b border-slate-50">{l}</a>)}
          <div className="pt-4 flex flex-col gap-3">
            <Link href="/login" className="text-center text-[15px] font-bold py-3 border-2 border-slate-200 rounded-xl text-slate-700">Log In</Link>
            <Link href="/signup" className="text-center text-[15px] font-bold bg-[#0055a5] text-white py-3 rounded-xl shadow-md">Start Free Trial</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ════════════════════════════════════════════════════════
// HERO
// ════════════════════════════════════════════════════════
function Hero({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section id="product" className="relative pt-32 pb-24 overflow-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[60%] bg-[#0055a5]/15 rounded-full blur-[120px] pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <SL><Zap className="w-3.5 h-3.5 fill-[#0055a5]" /> The Operating System for Coaching Institutes</SL>
          <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
            Run your entire coaching institute
            <span className="block text-[#0055a5]"> from one place.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10 font-medium">
            Manage students, batches, attendance, fees, study material, DPPs and tests through one simple, powerful platform built specifically for Indian coaching centers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0055a5] hover:bg-[#004080] text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-[#0055a5]/30 transition-all hover:-translate-y-1 text-[16px]">
              Start 7-Day Free Trial <ArrowRight className="w-5 h-5" />
            </Link>
            <button onClick={onOpenDemo} className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-[#0055a5] hover:text-[#0055a5] text-slate-700 font-bold px-8 py-4 rounded-xl transition-all bg-white text-[16px] shadow-sm">
              <Play className="w-5 h-5" /> Book a Demo
            </button>
          </div>
          <p className="text-[13px] text-slate-500 font-bold tracking-wide uppercase">
            <span className="text-emerald-500">✓</span> No Credit Card Required &nbsp;&nbsp;•&nbsp;&nbsp; <span className="text-emerald-500">✓</span> Free Setup Assistance
          </p>
        </div>

        {/* The Glowing Video Player Widget */}
        <div className="relative max-w-5xl mx-auto group perspective-1000">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200/60 bg-white shadow-[0_20px_60px_-15px_rgba(0,85,165,0.4)] transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(0,85,165,0.6)] hover:-translate-y-2">
            <div className="h-10 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 flex items-center px-4 gap-2 absolute top-0 w-full z-20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex-1 mx-3 bg-white border border-slate-200 rounded-md h-6 flex items-center justify-center max-w-[240px] mx-auto shadow-sm">
                <span className="text-[11px] text-slate-500 font-bold flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-500"/> coachingwala.in/dashboard
                </span>
              </div>
            </div>
            <div className="pt-10 relative bg-slate-900 aspect-[16/9] w-full">
              <video src="/a1.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                  <PlayCircle className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// PAGE SECTIONS
// ════════════════════════════════════════════════════════

function ProblemSolution() {
  const BEFORE = ["Paper attendance registers","Excel fee spreadsheets","WhatsApp study material groups","Manual fee tracking & receipts","Scattered student records"];
  const AFTER  = ["One unified student profile","Automated fee tracking & receipts","Organized study material by batch","Digital attendance with analytics","Tests, DPPs, results — connected"];
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SL><MessageSquare className="w-3.5 h-3.5"/> The Real Problem</SL>
          <SH>{"Your institute shouldn't run on spreadsheets"}<br className="hidden sm:block"/>{"and scattered WhatsApp messages."}</SH>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-6 py-4 border-b border-slate-200">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><X className="w-4 h-4 text-red-500"/> Before CoachingWala</p>
            </div>
            <div className="p-6 space-y-4">
              {BEFORE.map(item=><div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0"><X className="w-4 h-4 text-red-500"/></div><span className="text-[14px] font-bold text-slate-500 line-through">{item}</span></div>)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#003366] via-[#004080] to-[#0055a5] border border-[#0055a5]/40 rounded-3xl overflow-hidden shadow-2xl shadow-[#0055a5]/20 transform md:-translate-y-4">
            <div className="bg-white/10 px-6 py-4 border-b border-white/10 backdrop-blur-sm">
              <p className="text-xs font-black text-white/90 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> With CoachingWala</p>
            </div>
            <div className="p-6 space-y-4">
              {AFTER.map(item=><div key={item} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-inner"><div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-emerald-400"/></div><span className="text-[14px] font-bold text-white">{item}</span></div>)}
              <div className="pt-2">
                <p className="text-[13px] text-blue-100 font-medium leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                  {"One connected workspace. From a student's admission to their batch, attendance, fees, study material and tests — everything stays organized."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoreProductGrid() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <SL><Zap className="w-3.5 h-3.5 fill-[#0055a5]"/> Core Features</SL>
          <SH>{"Everything your institute needs. Nothing you don't."}</SH>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">Eight integrated modules covering every part of running a coaching institute.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(f=>(
            <div key={f.title} className="group bg-white border border-slate-200 rounded-3xl p-6 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#0055a5]/10 hover:border-[#0055a5]/30 transition-all duration-300">
              <div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}><f.icon className={`w-6 h-6 ${f.color}`} strokeWidth={2}/></div>
              <h3 className="text-[16px] font-black text-slate-900 mb-2">{f.title}</h3>
              <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentJourney() {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SL><Users className="w-3.5 h-3.5"/> One Connected Journey</SL>
        <SH>{"Every student's journey, connected."}</SH>
        <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto mb-14">CoachingWala connects the information that normally lives across different registers, spreadsheets and apps.</p>
        <div className="flex flex-wrap justify-center gap-2 items-center max-w-5xl mx-auto">
          {JOURNEY.map((step,i)=>(
            <div key={step} className="flex items-center gap-2 mb-2">
              <div className={`px-5 py-2.5 rounded-full border-2 text-[13px] font-black transition-all shadow-sm ${i===0?"bg-[#0055a5] border-[#0055a5] text-white shadow-lg shadow-[#0055a5]/20":i===JOURNEY.length-1?"bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20":"bg-white border-slate-200 text-slate-700 hover:border-[#0055a5] hover:text-[#0055a5]"}`}>{step}</div>
              {i<JOURNEY.length-1&&<ChevronRight className="w-5 h-5 text-slate-300 shrink-0"/>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ════════════════════════════════════════════════════════
// 🚨 MATHEMATICALLY PERFECT PRICING UI 🚨
// ════════════════════════════════════════════════════════
function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <section id="pricing" className="py-28 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 bg-blue-100/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10">
          <SL><IndianRupee className="w-3.5 h-3.5"/> Transparent Pricing</SL>
          <SH>Start with what you need.<br className="hidden sm:block"/> Scale effortlessly.</SH>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">No hidden fees. Every plan includes a full 7-day trial to experience the power of CoachingWala.</p>
        </div>
        
        {/* ─── FLAWLESS MONTHLY / ANNUAL TOGGLE ─── */}
        <div className="flex justify-center mb-16 relative z-20">
          <div className="bg-white p-1.5 rounded-full border border-slate-200 flex items-center shadow-sm relative w-[290px] h-[52px]">
            {/* The sliding pill background */}
            <div 
              className="absolute inset-y-1.5 bg-slate-100 border border-slate-200 rounded-full transition-transform duration-300 ease-out z-0"
              style={{
                width: isAnnual ? '168px' : '108px',
                transform: isAnnual ? 'translateX(110px)' : 'translateX(0px)'
              }}
            />
            {/* Buttons */}
            <button
              onClick={() => setIsAnnual(false)}
              className={`relative w-[110px] h-full rounded-full text-[14px] font-black transition-colors duration-300 z-10 ${!isAnnual ? "text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`relative w-[168px] h-full rounded-full text-[14px] font-black transition-colors duration-300 flex items-center justify-center gap-1.5 z-10 ${isAnnual ? "text-[#0055a5]" : "text-slate-500 hover:text-slate-700"}`}
            >
              Annually <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${isAnnual ? "bg-[#0055a5] text-white" : "bg-emerald-100 text-emerald-700"}`}>-20%</span>
            </button>
          </div>
        </div>

        {/* ─── DEDICATED PRICING CARDS ─── */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-24">
          
          {/* STARTER CARD */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col relative z-0">
            <h3 className="text-xl font-black text-slate-900 mb-2">Starter</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 h-10">Perfect for independent tutors going digital.</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-black text-slate-900">{"\u20b9"}{isAnnual ? "625" : "799"}</span>
              <span className="text-base text-slate-400 font-bold">/month</span>
            </div>
            <p className="text-sm font-bold text-emerald-600 mb-8 h-5">{isAnnual ? "Billed ₹7,500 annually" : "Billed monthly"}</p>
            <Link href="/signup" className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 text-slate-700 font-black py-4 rounded-xl text-center transition-colors mb-8 shadow-sm">
              Start Free Trial
            </Link>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-3">Features Included</p>
            <ul className="space-y-4 text-[14px] font-bold text-slate-600 flex-1">
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-[2px]"/> Up to 100 students</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-[2px]"/> Student & batch management</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-[2px]"/> Daily attendance tracking</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-[2px]"/> Basic fee management</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-[2px]"/> Study material upload</li>
            </ul>
          </div>

          {/* GROWTH CARD (HIGHLIGHTED) */}
          <div className="bg-white rounded-3xl p-8 border-2 border-[#0055a5] shadow-2xl shadow-[#0055a5]/20 ring-4 ring-[#0055a5]/10 transform lg:scale-105 transition-all duration-300 flex flex-col relative z-10">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#003366] to-[#0055a5] rounded-t-3xl"/>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#0055a5] text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 fill-white"/> Most Popular
            </div>
            
            <h3 className="text-xl font-black text-[#0055a5] mb-2 mt-2">Growth</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 h-10">The ultimate engine to automate and scale.</p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-black text-slate-900">{"\u20b9"}{isAnnual ? "1,250" : "1,499"}</span>
              <span className="text-base text-slate-400 font-bold">/month</span>
            </div>
            <p className="text-sm font-bold text-emerald-600 mb-8 h-5">{isAnnual ? "Billed ₹15,000 annually" : "Billed monthly"}</p>
            <Link href="/signup" className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-black py-4 rounded-xl text-center transition-all mb-8 shadow-lg shadow-[#0055a5]/30">
              Start Free Trial
            </Link>
            <p className="text-[11px] font-black text-[#0055a5] uppercase tracking-widest mb-4 border-b border-blue-100 pb-3">Everything in Starter, plus</p>
            <ul className="space-y-4 text-[14px] font-bold text-slate-700 flex-1">
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0 fill-blue-50 mt-[2px]"/> Up to 500 students</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0 fill-blue-50 mt-[2px]"/> DPP & assignment module</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0 fill-blue-50 mt-[2px]"/> Online Test Series engine</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0 fill-blue-50 mt-[2px]"/> Advanced Analytics & Reports</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-[#0055a5] shrink-0 fill-blue-50 mt-[2px]"/> System Action Alerts</li>
            </ul>
          </div>

          {/* PROFESSIONAL CARD (DARK THEME) */}
          <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"/>
            <h3 className="text-xl font-black text-white mb-2 relative z-10">Professional</h3>
            <p className="text-sm font-medium text-slate-400 mb-6 h-10 relative z-10">Unlimited power for established institutes.</p>
            <div className="flex items-baseline gap-1 mb-2 relative z-10">
              <span className="text-5xl font-black text-white">{"\u20b9"}{isAnnual ? "2,000" : "2,499"}</span>
              <span className="text-base text-slate-500 font-bold">/month</span>
            </div>
            <p className="text-sm font-bold text-emerald-400 mb-8 h-5 relative z-10">{isAnnual ? "Billed ₹24,000 annually" : "Billed monthly"}</p>
            <Link href="/signup" className="w-full bg-white hover:bg-slate-200 text-slate-900 font-black py-4 rounded-xl text-center transition-colors mb-8 shadow-sm relative z-10">
              Start Free Trial
            </Link>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-800 pb-3 relative z-10">Everything in Growth, plus</p>
            <ul className="space-y-4 text-[14px] font-bold text-slate-300 flex-1 relative z-10">
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-[2px]"/> Up to 2,000 students</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-[2px]"/> Multi-branch management</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-[2px]"/> Custom portal domain</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-[2px]"/> Bulk SMS & WhatsApp</li>
              <li className="flex items-start gap-3 leading-snug"><CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-[2px]"/> Dedicated onboarding rep</li>
            </ul>
          </div>

        </div>

        {/* ─── THE DEEP TICK/CROSS MATRIX ─── */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900">Compare All Features</h3>
            <p className="text-slate-500 font-medium mt-2">See exactly what you get at every tier.</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto hide-scrollbar">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr>
                    <th className="p-6 bg-slate-50 border-b border-slate-200 w-2/5 text-sm font-black text-slate-500 uppercase tracking-widest">Core Modules</th>
                    <th className="p-6 bg-white border-b border-slate-200 border-l w-1/5 text-center text-lg font-black text-slate-900">Starter</th>
                    <th className="p-6 bg-blue-50/40 border-b border-blue-100 border-l border-r border-[#0055a5]/20 w-1/5 text-center text-lg font-black text-[#0055a5]">Growth</th>
                    <th className="p-6 bg-slate-900 border-b border-slate-800 border-l w-1/5 text-center text-lg font-black text-white">Professional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <TableRow title="Student Directory & Profiles" starter={true} growth={true} pro={true} />
                  <TableRow title="Batch Allocation & Timetables" starter={true} growth={true} pro={true} />
                  <TableRow title="Global Attendance Tracking" starter={true} growth={true} pro={true} />
                  <TableRow title="Fee Ledgers & Digital Receipts" starter={true} growth={true} pro={true} />
                  <TableRow title="Basic Study Material Hub" starter={true} growth={true} pro={true} />
                  
                  <tr className="bg-slate-50/50"><td colSpan={4} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-t border-slate-200">Premium Tools</td></tr>
                  <TableRow title="DPP & Assignments Engine" starter={false} growth={true} pro={true} />
                  <TableRow title="Online Test Series & Results" starter={false} growth={true} pro={true} />
                  <TableRow title="Deep Analytics & AI Reports" starter={false} growth={true} pro={true} />
                  <TableRow title="System Action Alerts (Smart Tasks)" starter={false} growth={true} pro={true} />
                  <TableRow title="Custom Domain Student Portal" starter={false} growth={false} pro={true} />
                  
                  <tr className="bg-slate-50/50"><td colSpan={4} className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest border-t border-slate-200">Quotas & Add-ons</td></tr>
                  <tr>
                    <td className="px-6 py-5 font-bold text-slate-700">Cloud Storage Limit</td>
                    <td className="px-6 py-5 text-center border-l border-slate-100 text-slate-500 font-black text-[15px]">1 GB</td>
                    <td className="px-6 py-5 text-center border-l border-r border-[#0055a5]/20 bg-blue-50/20 text-[#0055a5] font-black text-[15px]">10 GB</td>
                    <td className="px-6 py-5 text-center border-l border-slate-100 text-slate-900 font-black text-[15px]">100 GB</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-5 font-bold text-slate-700">WhatsApp Fee Reminders</td>
                    <td className="px-6 py-5 text-center border-l border-slate-100 text-slate-400 font-bold text-[13px]">Manual Only</td>
                    <td className="px-6 py-5 text-center border-l border-r border-[#0055a5]/20 bg-blue-50/20 text-[#0055a5] font-black text-[13px]">Automated</td>
                    <td className="px-6 py-5 text-center border-l border-slate-100 text-slate-900 font-black text-[13px]">Automated Bulk</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

// Helper Component for Matrix Rows
function TableRow({ title, starter, growth, pro }: { title: string, starter: boolean, growth: boolean, pro: boolean }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-5 font-bold text-slate-700">{title}</td>
      <td className="px-6 py-5 text-center border-l border-slate-100">
        {starter ? <Check className="w-5 h-5 text-slate-400 mx-auto" strokeWidth={3} /> : <X className="w-5 h-5 text-slate-200 mx-auto" strokeWidth={3} />}
      </td>
      <td className="px-6 py-5 text-center border-l border-r border-[#0055a5]/20 bg-blue-50/20">
        {growth ? <Check className="w-5 h-5 text-[#0055a5] mx-auto" strokeWidth={3} /> : <X className="w-5 h-5 text-blue-200 mx-auto" strokeWidth={3} />}
      </td>
      <td className="px-6 py-5 text-center border-l border-slate-100">
        {pro ? <Check className="w-5 h-5 text-emerald-500 mx-auto" strokeWidth={3} /> : <X className="w-5 h-5 text-slate-200 mx-auto" strokeWidth={3} />}
      </td>
    </tr>
  );
}

// ════════════════════════════════════════════════════════
// RESOURCES & KNOWLEDGE HUB
// ════════════════════════════════════════════════════════
function Resources() {
  return (
    <section id="resources" className="py-24 px-4 sm:px-6 md:px-12 bg-[#001a33] text-white border-t border-[#002b5e]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SL><BookOpen className="w-3.5 h-3.5" /> Academy</SL>
            <h2 className="text-3xl sm:text-4xl font-black mb-4 tracking-tight">Resources & Knowledge Base</h2>
            <p className="text-blue-200 font-medium max-w-xl leading-relaxed">Everything you need to master CoachingWala, grow your institute, and transition your business to the cloud seamlessly.</p>
          </div>
          <button className="shrink-0 text-[#00aaff] font-bold hover:text-white flex items-center gap-2 transition-colors">
            View All Resources <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-[#002244] border border-[#003366] p-8 rounded-3xl hover:bg-[#002b5e] hover:border-[#004080] transition-all cursor-pointer shadow-lg">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <FileText className="w-7 h-7 text-[#00aaff]" />
            </div>
            <div className="inline-block px-3 py-1 bg-[#00aaff]/10 text-[#00aaff] text-[10px] font-black uppercase tracking-widest rounded-md mb-4 border border-[#00aaff]/20">Setup Guide</div>
            <h3 className="text-xl font-bold mb-3">The Complete Setup Handbook</h3>
            <p className="text-blue-200/70 text-sm font-medium leading-relaxed">Learn how to import students, configure fees, and launch your portal in under 10 minutes.</p>
          </div>

          <div className="group bg-[#002244] border border-[#003366] p-8 rounded-3xl hover:bg-[#002b5e] hover:border-[#004080] transition-all cursor-pointer shadow-lg">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              <Video className="w-7 h-7 text-amber-400" />
            </div>
            <div className="inline-block px-3 py-1 bg-amber-400/10 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-md mb-4 border border-amber-400/20">Video Tutorial</div>
            <h3 className="text-xl font-bold mb-3">Mastering Fee Automation</h3>
            <p className="text-blue-200/70 text-sm font-medium leading-relaxed">Watch how the Smart Action Center automatically detects defaulters and sends WhatsApp alerts.</p>
          </div>

          <div className="group bg-[#002244] border border-[#003366] p-8 rounded-3xl hover:bg-[#002b5e] hover:border-[#004080] transition-all cursor-pointer shadow-lg">
            <div className="w-14 h-14 bg-[#003366] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
              <Laptop className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="inline-block px-3 py-1 bg-emerald-400/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-md mb-4 border border-emerald-400/20">Live Webinar</div>
            <h3 className="text-xl font-bold mb-3">Scaling to 1,000+ Students</h3>
            <p className="text-blue-200/70 text-sm font-medium leading-relaxed">Join our weekly live session with industry experts on maximizing your institute's digital growth.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12"><SL>FAQ</SL><SH>Common questions, honest answers.</SH></div>
        <div className="space-y-3">
          {FAQS.map((faq,i)=>(
            <div key={i} className={`bg-white border rounded-2xl overflow-hidden transition-all ${open===i?"border-[#0055a5]/30 shadow-sm":"border-slate-200"}`}>
              <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center justify-between px-6 py-4 text-left group">
                <span className={`text-sm font-bold transition-colors ${open===i?"text-[#0055a5]":"text-slate-800 group-hover:text-slate-900"}`}>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 ml-4 transition-transform duration-200 ${open===i?"rotate-180 text-[#0055a5]":"text-slate-400"}`}/>
              </button>
              {open===i&&(
                <div className="px-6 pb-5">
                  <div className="h-px bg-slate-100 mb-4"/>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section className="py-28 bg-[#002244] relative overflow-hidden border-t border-blue-900/50">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0055a5]/30 via-transparent to-[#004080]/20 pointer-events-none"/>
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#0055a5]/30 blur-[120px] rounded-full pointer-events-none"/>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[12px] font-black uppercase tracking-widest px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-lg">
          <Zap className="w-4 h-4 text-amber-400 fill-amber-400"/> Start Today
        </div>
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight mb-8">
          Your coaching institute is already growing.
          <span className="block text-blue-300 mt-2"> Your software should grow with it.</span>
        </h2>
        <p className="text-lg sm:text-xl text-blue-100/70 max-w-2xl mx-auto mb-12 font-medium">Bring students, batches, attendance, fees and academics together with CoachingWala. Start your free trial today.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-[#0055a5] font-black px-10 py-5 rounded-2xl text-[16px] shadow-2xl shadow-black/20 transition-all hover:-translate-y-1">
            Start your 7-day free trial <ArrowRight className="w-5 h-5"/>
          </Link>
          <button onClick={onOpenDemo} className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-bold px-10 py-5 rounded-2xl text-[16px] transition-all backdrop-blur-sm">
            <Play className="w-5 h-5 fill-white"/> Book a Demo
          </button>
        </div>
        <p className="mt-10 text-[14px] text-blue-200/50 font-bold uppercase tracking-widest">7-day free trial • No credit card • Cancel anytime</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#0055a5] rounded-lg flex items-center justify-center shadow-lg"><span className="text-white font-black text-[11px]">CW</span></div>
          <span className="text-white font-black text-[15px] tracking-wide">CoachingWala</span>
        </div>
        <p className="text-slate-500 text-[14px] font-medium">© 2026 CoachingWala. All rights reserved.</p>
        <div className="flex gap-6 text-[14px] font-bold text-slate-500">
          <a href="#" className="hover:text-[#0055a5] transition-colors">Privacy</a>
          <a href="#" className="hover:text-[#0055a5] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#0055a5] transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0055a5] selection:text-white antialiased">
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
      <Navbar />
      <main>
        <Hero onOpenDemo={() => setIsDemoOpen(true)} />
        <ProblemSolution />
        <CoreProductGrid />
        <StudentJourney />
        <Pricing />
        <Resources />
        <FAQ />
        <FinalCTA onOpenDemo={() => setIsDemoOpen(true)} />
      </main>
      <Footer />
    </div>
  );
}