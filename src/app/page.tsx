"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users, Layers, CalendarCheck, Wallet, BookOpen, FileText,
  BarChart3, GraduationCap, Shield, ChevronDown, ArrowRight,
  Check, Star, Zap, Building2, User, Users2, Lock, Database,
  TrendingUp, CheckCircle2, ShieldCheck, BookMarked, FlaskConical,
  IndianRupee, Menu, X, Play, Download, Key, MonitorSmartphone,
  MessageSquare, ChevronRight
} from "lucide-react";

const NAV_LINKS = ["Product", "Features", "Pricing", "About Us", "Resources"];

const FEATURES = [
  { icon: Users,             color: "text-blue-600",   bg: "bg-blue-50",   title: "Student Management",  desc: "Complete student profiles with admission records, guardian info, fee history, attendance, and academic progress — all in one place."   },
  { icon: Layers,            color: "text-purple-600", bg: "bg-purple-50", title: "Batch Management",    desc: "Create and manage multiple batches, assign teachers, enroll students, and schedule sessions with full flexibility."                    },
  { icon: CalendarCheck,     color: "text-green-600",  bg: "bg-green-50",  title: "Attendance Tracking", desc: "Mark daily attendance batch-wise, view historical data, generate reports and identify students at risk of falling behind."             },
  { icon: Wallet,            color: "text-amber-600",  bg: "bg-amber-50",  title: "Fee Management",      desc: "Installment plans, partial payments, discounts, due date tracking, payment receipts and collection analytics — fully automated."    },
  { icon: BookMarked,        color: "text-cyan-600",   bg: "bg-cyan-50",   title: "Study Material",      desc: "Upload and organize PDFs, notes, and videos by subject and batch. Students access everything from their portal."                     },
  { icon: FileText,          color: "text-indigo-600", bg: "bg-indigo-50", title: "DPP & Assignments",   desc: "Create daily practice problems, assign to batches, set deadlines and track student submission and completion status."                },
  { icon: FlaskConical,      color: "text-rose-600",   bg: "bg-rose-50",   title: "Test Series",         desc: "Conduct chapter, unit, and full-length tests. Auto-evaluate, generate rank lists and share results with students instantly."        },
  { icon: MonitorSmartphone, color: "text-teal-600",   bg: "bg-teal-50",   title: "Student Portal",      desc: "A dedicated portal for students to view attendance, download study material, submit DPPs and check test results and fees."          },
];

const JOURNEY = ["Admission","Student Profile","Batch Allocation","Daily Attendance","Fee Collection","Study Material","DPP & Assignments","Tests & Exams","Results & Analytics"];

const ROLES = [
  { label: "Owner",   icon: Building2,     color: "bg-[#0055a5]",  items: ["Full dashboard overview","Revenue analytics","All student records","Billing & subscription","Staff management","Institute settings"] },
  { label: "Teacher", icon: GraduationCap, color: "bg-purple-600", items: ["Batch attendance","Upload study material","Create & assign DPPs","Conduct tests","View student progress","Mark registers"] },
  { label: "Student", icon: User,          color: "bg-green-600",  items: ["View attendance","Download study material","Submit DPPs","Take online tests","Check results","Fee payment status"] },
  { label: "Parent",  icon: Users2,        color: "bg-amber-600",  items: ["Child attendance alerts","Fee due reminders","Result notifications","Batch schedule","Contact teacher","Track progress"] },
];

const PLANS = [
  { name: "Starter",      price: "799",   students: "Up to 100 students",   popular: false, features: ["Student & batch management","Daily attendance tracking","Basic fee management","Study material upload","Student portal access","Email support"] },
  { name: "Growth",       price: "1,499", students: "Up to 500 students",   popular: true,  features: ["Everything in Starter","DPP & assignment module","Test series & auto-evaluation","Advanced fee analytics","Parent notifications","Priority support"] },
  { name: "Professional", price: "2,999", students: "Up to 2,000 students", popular: false, features: ["Everything in Growth","Multi-branch management","Custom portal domain","Advanced analytics & reports","Bulk SMS & WhatsApp alerts","Dedicated onboarding"] },
];

const TRUST = [
  { icon: Shield,      title: "Secure Authentication",  desc: "Industry-standard authentication protocols protect every login."       },
  { icon: Database,    title: "Data Isolation",          desc: "Your institute data is fully isolated from every other institute."     },
  { icon: Key,         title: "Role-Based Access",       desc: "Granular permissions ensure staff only see what they need to."        },
  { icon: Lock,        title: "Database Security",       desc: "Row-level security policies enforced at the database layer."          },
  { icon: ShieldCheck, title: "Controlled Permissions",  desc: "Every action is tied to a verified user role and scope."             },
  { icon: Download,    title: "Data Export",             desc: "Export your data anytime in standard formats. You always own it."     },
];

const FAQS = [
  { q: "Is CoachingWala suitable for small institutes?",  a: "Absolutely. The Starter plan at \u20b9799/month is designed for institutes just getting started. You can begin with 20 students and scale up without switching platforms." },
  { q: "Can I upgrade my plan later?",                    a: "Yes. You can upgrade at any time. Your data, students, batches, and history carry forward completely. You never lose progress when you grow." },
  { q: "Does it support multiple batches?",               a: "Yes. All plans support multiple batches with independent schedules, teachers, student lists, attendance, study material, and fee structures — no data mixing." },
  { q: "Can students access the platform?",               a: "Every plan includes a student portal where students can view attendance, download study material, submit DPPs, take tests and check fee payment status without contacting the institute." },
  { q: "Does CoachingWala build websites?",               a: "CoachingWala is a full institute management platform — not a website builder. The Professional plan supports a custom student portal domain so students access the portal from your own domain." },
];

function SL({ children }: { children: React.ReactNode }) {
  return <div className="inline-flex items-center gap-2 bg-blue-50 border border-[#0055a5]/20 text-[#0055a5] text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">{children}</div>;
}
function SH({ children, center=true }: { children: React.ReactNode; center?: boolean }) {
  return <h2 className={`text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight ${center?"text-center":""}`}>{children}</h2>;
}
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-white/85 border-b border-slate-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-[#0055a5] rounded-lg flex items-center justify-center shadow-md shadow-blue-900/20"><span className="text-white font-black text-sm">CW</span></div>
          <span className="font-black text-slate-900 text-[15px] tracking-tight">CoachingWala</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => <a key={l} href={l==="Pricing"?"#pricing":"#"} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">{l}</a>)}
        </div>
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
          <Link href="/login" className="flex items-center gap-1.5 bg-[#0055a5] hover:bg-[#004080] text-white text-sm font-bold px-4 py-2 rounded-lg shadow-sm transition-all">Start Free Trial <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <button className="md:hidden p-1.5 text-slate-600" onClick={() => setOpen(p => !p)}>{open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
      </div>
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md px-4 py-4 space-y-1">
          {NAV_LINKS.map(l => <a key={l} href="#" className="block py-2.5 text-sm font-semibold text-slate-700 border-b border-slate-100">{l}</a>)}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/login" className="text-center text-sm font-bold py-2.5 border border-slate-200 rounded-xl text-slate-700">Login</Link>
            <Link href="/login" className="text-center text-sm font-bold bg-[#0055a5] text-white py-2.5 rounded-xl">Start Free Trial</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  return (
    <section className="pt-28 pb-16 bg-gradient-to-b from-[#eef5ff] via-white to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-14">
          <SL><Zap className="w-3.5 h-3.5 fill-[#0055a5]" /> The Operating System for Coaching Institutes</SL>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 leading-[1.07] tracking-tight mb-6">
            Run your entire coaching institute
            <span className="block bg-gradient-to-r from-[#0055a5] to-[#0088cc] bg-clip-text text-transparent"> from one place.</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto mb-8 font-medium">
            Manage students, batches, attendance, fees, study material, DPPs and tests through one simple, powerful platform built specifically for coaching institutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0055a5] hover:bg-[#004080] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-[#0055a5]/20 transition-all hover:-translate-y-0.5 text-[15px]">Start 7-Day Free Trial <ArrowRight className="w-4 h-4" /></Link>
            <a href="#" className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-7 py-3.5 rounded-xl transition-all hover:bg-slate-50 text-[15px]"><Play className="w-4 h-4 fill-slate-700" /> Book a Demo</a>
          </div>
          <p className="text-[13px] text-slate-400 font-medium tracking-wide">Built for modern coaching institutes · Simple to start · Designed to grow with you</p>
        </div>
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-300/40 overflow-hidden">
            <div className="bg-[#002244] h-9 flex items-center px-4 gap-2 shrink-0">
              <div className="flex gap-1.5">{["bg-red-400","bg-amber-400","bg-green-400"].map(c=><div key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-80`}/>)}</div>
              <div className="flex-1 mx-3 bg-white/10 rounded-md h-5 flex items-center px-3"><span className="text-[9px] text-white/50 font-medium">coachingwala.in/dashboard</span></div>
            </div>
            <div className="flex h-[340px] sm:h-[380px]">
              <div className="w-44 bg-white border-r border-slate-100 flex-col py-3 shrink-0 hidden sm:flex">
                <div className="px-3 mb-3 flex items-center gap-2 py-1">
                  <div className="w-5 h-5 bg-[#002244] rounded flex items-center justify-center"><span className="text-white font-black text-[8px]">CW</span></div>
                  <span className="text-[10px] font-black text-slate-700">CoachingWala</span>
                </div>
                {[{icon:BarChart3,label:"Dashboard",active:true},{icon:Users,label:"Students",active:false},{icon:Layers,label:"Batches",active:false},{icon:Wallet,label:"Fees",active:false},{icon:CalendarCheck,label:"Attendance",active:false},{icon:BookOpen,label:"Study Material",active:false}].map(item=>(
                  <div key={item.label} className={`flex items-center gap-2 px-2 py-2 mx-2 rounded-lg mb-0.5 ${item.active?"bg-[#e8f0fd] border-l-2 border-[#0055a5]":""}`}>
                    <item.icon className={`w-3.5 h-3.5 shrink-0 ${item.active?"text-[#0055a5]":"text-slate-400"}`}/>
                    <span className={`text-[10px] truncate ${item.active?"font-bold text-[#0055a5]":"font-semibold text-slate-500"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 bg-[#f8fafc] p-3 sm:p-4 overflow-hidden">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Dashboard Overview</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3">
                  {[{label:"Students",value:"428",sub:"+12 this month",icon:Users,color:"text-[#0055a5]",bg:"bg-blue-50"},{label:"Attendance",value:"91.4%",sub:"+2.1% avg",icon:CalendarCheck,color:"text-green-600",bg:"bg-green-50"},{label:"Collected",value:"\u20b91.24L",sub:"+\u20b918K",icon:IndianRupee,color:"text-amber-600",bg:"bg-amber-50"}].map(m=>(
                    <div key={m.label} className="bg-white rounded-xl border border-slate-100 p-2 sm:p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase">{m.label}</span>
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 ${m.bg} rounded-lg flex items-center justify-center`}><m.icon className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${m.color}`}/></div>
                      </div>
                      <p className="text-base sm:text-lg font-black text-slate-900">{m.value}</p>
                      <p className="text-[8px] text-green-600 font-bold mt-0.5 hidden sm:block">{m.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Fee Collection — Last 6 Months</p>
                    <span className="text-[8px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+22% up</span>
                  </div>
                  <div className="flex items-end gap-1.5 sm:gap-2 h-14 sm:h-16">
                    {[38,52,61,72,65,88].map((h,i)=><div key={i} className="flex-1"><div className="w-full rounded-t-sm bg-gradient-to-t from-[#0055a5] to-[#4d9de0]" style={{height:`${h}%`}}/></div>)}
                  </div>
                  <div className="flex mt-1">{["Mar","Apr","May","Jun","Jul","Aug"].map(m=><span key={m} className="flex-1 text-center text-[8px] text-slate-400">{m}</span>)}</div>
                </div>
                <div className="mt-2 sm:mt-3 bg-white rounded-xl border border-slate-100 p-2 sm:p-3 shadow-sm hidden sm:block">
                  <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Recent Activity</p>
                  <div className="space-y-1.5">
                    {[{text:"Riya Sharma admitted to Batch B2",time:"2m ago",dot:"bg-green-400"},{text:"Fee collected from Arjun Mehta — \u20b94,500",time:"14m ago",dot:"bg-blue-400"}].map((a,i)=>(
                      <div key={i} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${a.dot} shrink-0`}/>
                        <span className="text-[10px] text-slate-600 font-medium flex-1 truncate">{a.text}</span>
                        <span className="text-[9px] text-slate-400">{a.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-[#0055a5]/5 blur-3xl -z-10 rounded-3xl"/>
        </div>
      </div>
    </section>
  );
}

function ProblemSolution() {
  const BEFORE = ["Paper attendance registers","Excel fee spreadsheets","WhatsApp study material groups","Manual fee tracking & receipts","Scattered student records across files"];
  const AFTER  = ["One student profile — admission to results","Automated fee tracking & receipts","Organized study material by batch","Batch-wise attendance with analytics","Tests, DPPs, results — all connected"];
  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SL><MessageSquare className="w-3.5 h-3.5"/> The Real Problem</SL>
          <SH>{"Your institute shouldn't run on spreadsheets"}<br className="hidden sm:block"/>{"and scattered WhatsApp messages."}</SH>
        </div>
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><X className="w-4 h-4 text-red-400"/> Before CoachingWala</p>
            </div>
            <div className="p-5 space-y-3">
              {BEFORE.map(item=><div key={item} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"><div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center shrink-0"><X className="w-3.5 h-3.5 text-red-400"/></div><span className="text-sm font-semibold text-slate-400 line-through">{item}</span></div>)}
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#003366] to-[#0066cc] border border-[#0055a5]/40 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-white/10 px-5 py-3 border-b border-white/10">
              <p className="text-xs font-black text-white/80 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400"/> With CoachingWala</p>
            </div>
            <div className="p-5 space-y-3">
              {AFTER.map(item=><div key={item} className="flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10"><div className="w-7 h-7 bg-green-400/20 rounded-lg flex items-center justify-center shrink-0"><Check className="w-3.5 h-3.5 text-green-400"/></div><span className="text-sm font-semibold text-white">{item}</span></div>)}
              <p className="text-xs text-white/60 font-medium pt-2 px-1 leading-relaxed">{"One connected workspace. From a student's admission to their batch, attendance, fees, study material and tests — everything stays organized in one place."}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CoreProductGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SL><Zap className="w-3.5 h-3.5 fill-[#0055a5]"/> Core Features</SL>
          <SH>{"Everything your institute needs. Nothing you don't."}</SH>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">Eight integrated modules covering every part of running a coaching institute.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map(f=>(
            <div key={f.title} className="group bg-white border border-slate-200 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg hover:border-slate-300 transition-all duration-200 cursor-default">
              <div className={`w-11 h-11 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><f.icon className={`w-5 h-5 ${f.color}`} strokeWidth={2}/></div>
              <h3 className="text-sm font-black text-slate-900 mb-2">{f.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudentJourney() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SL><Users className="w-3.5 h-3.5"/> One Connected Journey</SL>
        <SH>{"Every student's journey, connected."}</SH>
        <p className="mt-4 text-slate-500 text-lg max-w-2xl mx-auto mb-14">CoachingWala connects the information that normally lives across different registers, spreadsheets and apps.</p>
        <div className="flex flex-wrap justify-center gap-2 items-center max-w-4xl mx-auto">
          {JOURNEY.map((step,i)=>(
            <div key={step} className="flex items-center gap-2">
              <div className={`px-4 py-2 rounded-full border-2 text-sm font-black transition-all ${i===0?"bg-[#0055a5] border-[#0055a5] text-white shadow-lg shadow-[#0055a5]/20":i===JOURNEY.length-1?"bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20":"bg-white border-slate-200 text-slate-700 hover:border-[#0055a5] hover:text-[#0055a5] shadow-sm"}`}>{step}</div>
              {i<JOURNEY.length-1&&<ChevronRight className="w-4 h-4 text-slate-300 shrink-0"/>}
            </div>
          ))}
        </div>
        <div className="mt-12 bg-[#eef5ff] border border-[#0055a5]/15 rounded-2xl p-6 max-w-2xl mx-auto">
          <p className="text-sm text-[#0055a5] font-bold">All nine steps live in one platform. When a student is admitted, their profile, batch, attendance, fees and academics are linked automatically — no manual coordination needed.</p>
        </div>
      </div>
    </section>
  );
}

function FeeManagement() {
  const FF = ["Batch","Student","Fee Structure","Installments","Payment","Receipt","Remaining Due"];
  const FC = ["Installments","Partial payments","Discounts","Due date alerts","Subject-wise allocation","Payment history","Digital receipts","Collection analytics"];
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SL><IndianRupee className="w-3.5 h-3.5"/> Fee Management</SL>
          <SH>Know exactly where your institute<br className="hidden sm:block"/> stands financially.</SH>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-[#003366] to-[#0066cc] px-5 py-4">
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mb-1">Financial Health — August 2026</p>
                <p className="text-2xl font-black text-white">{"\u20b94,80,000"} <span className="text-sm font-semibold text-white/60">expected</span></p>
              </div>
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                  <p className="text-[10px] font-bold text-green-600 uppercase tracking-wide">Collected</p>
                  <p className="text-xl font-black text-green-700 mt-1">{"\u20b93,72,000"}</p>
                  <div className="mt-2 w-full h-1.5 bg-green-200 rounded-full"><div className="h-full bg-green-500 rounded-full" style={{width:"77.5%"}}/></div>
                  <p className="text-[10px] text-green-600 mt-1">77.5% collected</p>
                </div>
                <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                  <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Outstanding</p>
                  <p className="text-xl font-black text-red-600 mt-1">{"\u20b91,08,000"}</p>
                  <div className="mt-2 w-full h-1.5 bg-red-200 rounded-full"><div className="h-full bg-red-400 rounded-full" style={{width:"22.5%"}}/></div>
                  <p className="text-[10px] text-red-500 mt-1">22.5% pending</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fee Flow</p>
              <div className="flex flex-wrap gap-2 items-center">
                {FF.map((s,i)=><div key={s} className="flex items-center gap-2"><span className="text-[11px] font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full shadow-sm">{s}</span>{i<FF.length-1&&<ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0"/>}</div>)}
              </div>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-4">Complete fee management coverage</h3>
            <div className="grid grid-cols-2 gap-3">
              {FC.map(f=><div key={f} className="flex items-center gap-2.5"><div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0"><Check className="w-3 h-3 text-green-600"/></div><span className="text-sm font-semibold text-slate-700">{f}</span></div>)}
            </div>
            <div className="mt-6 p-4 bg-[#eef5ff] rounded-xl border border-[#0055a5]/10"><p className="text-sm text-[#0055a5] font-bold">Students receive instant digital receipts. You get a complete payment ledger with zero manual bookkeeping.</p></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AcademicManagement() {
  const CARDS = [
    { icon: BookMarked,   color: "text-cyan-600",   bg: "bg-cyan-50",   borderTop: "bg-cyan-400",   title: "Study Material",    desc: "Upload PDFs, notes, and video links organized by subject, chapter, and batch. Students access from their portal anytime.", items: ["PDFs & Documents", "Video links", "Chapter-wise organization", "Batch-specific visibility"] },
    { icon: FileText,     color: "text-indigo-600", bg: "bg-indigo-50", borderTop: "bg-indigo-400", title: "DPP & Assignments", desc: "Create daily practice problems and assignments. Set deadlines, assign to batches and track who has submitted.", items: ["Create & assign DPPs", "Set due dates", "Submission tracking", "Completion analytics"] },
    { icon: FlaskConical, color: "text-rose-600",   bg: "bg-rose-50",   borderTop: "bg-rose-400",   title: "Tests & Exams",     desc: "Conduct chapter tests, unit tests and full-length mock exams. Auto-evaluate, generate rank lists and share results instantly.", items: ["Online test creation", "Auto-evaluation", "Rank list generation", "Instant result sharing"] },
  ];
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SL><BookOpen className="w-3.5 h-3.5"/> Academic Tools</SL>
          <SH>Turn your institute into a connected<br className="hidden sm:block"/> learning environment.</SH>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">Give your students everything they need without sending files across multiple WhatsApp groups.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map((card,i)=>(
            <div key={card.title} className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {i<CARDS.length-1&&<div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center z-10 shadow-sm"><ChevronRight className="w-3.5 h-3.5 text-slate-400"/></div>}
              <div className={`h-1.5 w-full ${card.borderTop} opacity-70`}/>
              <div className="p-6">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4`}><card.icon className={`w-5 h-5 ${card.color}`}/></div>
                <h3 className="text-base font-black text-slate-900 mb-2">{card.title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{card.desc}</p>
                <ul className="space-y-2">
                  {card.items.map(item=><li key={item} className="flex items-center gap-2 text-[13px] font-semibold text-slate-600"><Check className="w-3.5 h-3.5 text-green-500 shrink-0"/> {item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuiltForEveryRole() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SL><Users2 className="w-3.5 h-3.5"/> Role-Based Access</SL>
          <SH>One platform. Different experiences.</SH>
          <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto">Every person in your institute sees exactly what they need — no more, no less.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROLES.map(role=>(
            <div key={role.label} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className={`${role.color} p-5 flex items-center gap-3`}>
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><role.icon className="w-5 h-5 text-white"/></div>
                <div>
                  <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Access as</p>
                  <p className="text-base font-black text-white">{role.label}</p>
                </div>
              </div>
              <div className="p-4 space-y-2">
                {role.items.map(item=><div key={item} className="flex items-center gap-2.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"/><span className="text-[13px] text-slate-600 font-medium">{item}</span></div>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SL><IndianRupee className="w-3.5 h-3.5"/> Pricing</SL>
          <SH>Start with what you need.<br className="hidden sm:block"/> Grow when you need more.</SH>
          <p className="mt-4 text-slate-500 text-lg max-w-lg mx-auto">Every plan includes a 7-day free trial. No credit card required to start.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 items-start max-w-5xl mx-auto">
          {PLANS.map(plan=>(
            <div key={plan.name} className={`relative bg-white rounded-2xl border overflow-hidden transition-all ${plan.popular?"border-[#0055a5] shadow-2xl shadow-[#0055a5]/10 scale-[1.03]":"border-slate-200 shadow-sm hover:shadow-md"}`}>
              {plan.popular&&<div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#0055a5] to-[#0088cc]"/>}
              {plan.popular&&<div className="absolute -top-3.5 left-1/2 -translate-x-1/2"><span className="bg-[#0055a5] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-white"/> Most Popular</span></div>}
              <div className={`p-6 ${plan.popular?"pt-8":""}`}>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-slate-900">{"\u20b9"}{plan.price}</span>
                  <span className="text-sm text-slate-400 font-semibold">/month</span>
                </div>
                <p className="text-[13px] text-slate-500 font-medium mb-5">{plan.students}</p>
                <Link href="/login" className={`block w-full text-center py-2.5 rounded-xl font-bold text-sm transition-all ${plan.popular?"bg-[#0055a5] hover:bg-[#004080] text-white shadow-md shadow-[#0055a5]/20":"border-2 border-slate-200 hover:border-[#0055a5] text-slate-700 hover:text-[#0055a5]"}`}>Start Free Trial</Link>
                <div className="mt-5 space-y-3">
                  {plan.features.map(f=><div key={f} className="flex items-start gap-2.5"><CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular?"text-[#0055a5]":"text-green-500"}`}/><span className="text-[13px] text-slate-600 font-medium">{f}</span></div>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BuiltToGrow() {
  const STEPS = [
    { plan: "Starter",      price: "\u20b9799",   badge: "bg-slate-100 text-slate-600",   border: "border-slate-200 bg-white",        desc: "Perfect for institutes just going digital. Manage students, batches, attendance and fees." },
    { plan: "Growth",       price: "\u20b91,499",  badge: "bg-[#0055a5] text-white",       border: "border-[#0055a5] bg-[#eef5ff]",    desc: "Add DPPs, test series and advanced analytics as your student count and complexity grows." },
    { plan: "Professional", price: "\u20b92,999",  badge: "bg-purple-600 text-white",      border: "border-purple-300 bg-purple-50",   desc: "Multi-branch, custom portal domain, bulk notifications and dedicated onboarding support." },
  ];
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <SL><TrendingUp className="w-3.5 h-3.5"/> Growth Path</SL>
        <SH>Start small. Scale without starting over.</SH>
        <p className="mt-4 text-slate-500 text-lg max-w-xl mx-auto mb-12">Every upgrade unlocks new capabilities. Your data, students, and history always carry forward.</p>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {STEPS.map((s,i)=>(
            <div key={s.plan} className={`relative border-2 ${s.border} rounded-2xl p-6 text-left`}>
              {i<STEPS.length-1&&<div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-white border border-slate-200 rounded-full items-center justify-center z-10 shadow-sm"><ArrowRight className="w-3.5 h-3.5 text-slate-400"/></div>}
              <span className={`inline-block text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-3 ${s.badge}`}>{s.plan}</span>
              <p className="text-2xl font-black text-slate-900 mb-1">{s.price}<span className="text-sm font-semibold text-slate-400">/mo</span></p>
              <p className="text-[13px] text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustSecurity() {
  return (
    <section className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"><Shield className="w-3.5 h-3.5 text-green-400"/> Enterprise Security</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">{"Your institute's data deserves"}<br className="hidden sm:block"/> serious protection.</h2>
          <p className="text-slate-400 text-lg max-w-lg mx-auto">Security is not a feature — it is the foundation everything is built on.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRUST.map(item=>(
            <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center mb-4"><item.icon className="w-5 h-5 text-green-400"/></div>
              <h3 className="text-sm font-black text-white mb-2">{item.title}</h3>
              <p className="text-[13px] text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutUs() {
  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <SL><Building2 className="w-3.5 h-3.5"/> About Us</SL>
          <SH>Built with a simple belief.</SH>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">Coaching institutes spend their time educating students. Their software should take care of the administrative complexity.</p>
          <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">A Product by Future Q</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{name:"Saurabh Raj",role:"Founder & Full-Stack Developer",initials:"SR"},{name:"Rishav Kumar Srivastava",role:"UI/UX Designer",initials:"RK"}].map(p=>(
                <div key={p.name} className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                  <div className="w-10 h-10 bg-[#0055a5] rounded-full flex items-center justify-center shrink-0"><span className="text-white font-black text-[11px]">{p.initials}</span></div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{p.name}</p>
                    <p className="text-[12px] text-slate-500 font-medium">{p.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <a href="#" className="inline-flex items-center gap-2 mt-7 text-sm font-bold text-[#0055a5] hover:underline">Learn About Us <ArrowRight className="w-4 h-4"/></a>
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

function FinalCTA() {
  return (
    <section className="py-24 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0055a5]/20 via-transparent to-[#0044aa]/10 pointer-events-none"/>
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0055a5]/10 blur-[100px] rounded-full pointer-events-none"/>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-[11px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400"/> Start Today
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-white leading-[1.1] tracking-tight mb-6">
          Your coaching institute is already growing.
          <span className="block text-[#4d9de0]"> Your software should grow with it.</span>
        </h2>
        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-10">Bring students, batches, attendance, fees and academics together with CoachingWala. Start your free trial today — no credit card required.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-8 py-4 rounded-xl text-[15px] shadow-xl transition-all hover:-translate-y-0.5">Start your 7-day free trial <ArrowRight className="w-4 h-4"/></Link>
          <a href="#" className="w-full sm:w-auto flex items-center justify-center gap-2 border-2 border-white/20 hover:border-white/40 text-white font-bold px-8 py-4 rounded-xl text-[15px] transition-all"><Play className="w-4 h-4 fill-white"/> Book a Demo</a>
        </div>
        <p className="mt-8 text-sm text-slate-500 font-medium">7-day free trial · No credit card · Cancel anytime</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#0055a5] rounded-md flex items-center justify-center"><span className="text-white font-black text-[11px]">CW</span></div>
          <span className="text-white font-bold text-sm">CoachingWala</span>
          <span className="text-slate-600 text-sm mx-1">·</span>
          <span className="text-slate-600 text-sm">A product by Future Q</span>
        </div>
        <p className="text-slate-600 text-sm">© 2026 CoachingWala. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#0055a5] selection:text-white antialiased">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <CoreProductGrid />
        <StudentJourney />
        <FeeManagement />
        <AcademicManagement />
        <BuiltForEveryRole />
        <Pricing />
        <BuiltToGrow />
        <TrustSecurity />
        <AboutUs />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
