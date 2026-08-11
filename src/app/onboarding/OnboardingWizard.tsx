"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, ArrowRight, Loader2, Sparkles, 
  Server, CheckCircle2, AlertTriangle, ShieldCheck, 
  Database, Lock, LayoutDashboard, FileText,
  MapPin, Users, Target, BookOpen, Wallet, CalendarClock
} from "lucide-react";
import { completeOnboardingAction } from "../../app/actions/owner-auth";

// Define the steps for our dynamic left-hand guide
const WIZARD_STEPS = [
  {
    id: 0,
    title: "Welcome to CoachingWala.",
    subtitle: "Let's digitize your institute in under 60 seconds.",
    icon: Sparkles
  },
  {
    id: 1,
    title: "Bank-Grade Security.",
    subtitle: "Your student data is encrypted, backed up daily, and strictly yours.",
    icon: ShieldCheck
  },
  {
    id: 2,
    title: "The Basics.",
    subtitle: "Tell us who you are and where you are located.",
    icon: Building2
  },
  {
    id: 3,
    title: "Institute Scale.",
    subtitle: "Help us configure your server capacity based on your operations.",
    icon: Users
  },
  {
    id: 4,
    title: "Primary Goal.",
    subtitle: "What is the biggest challenge you want CoachingWala to solve today?",
    icon: Target
  },
  {
    id: 5,
    title: "Provisioning Servers...",
    subtitle: "Please don't close this window while we allocate your database.",
    icon: Server
  }
];

export default function OnboardingWizard() {
  const router = useRouter();
  
  // Wizard State
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Form Data State
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [instituteName, setInstituteName] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [mainProblem, setMainProblem] = useState("");
  
  // Provisioning State
  const [provisionStep, setProvisionStep] = useState(0);

  // Handle the final submission (Triggered at Step 4)
  const handleSetup = async () => {
    const cleanName = instituteName.trim();
    if (!cleanName) return;
    
    setError(null);
    setStep(5); // Move to final provisioning screen

    try {
      // 1. Trigger backend DB creation passing ALL collected data
      await completeOnboardingAction(
        cleanName, 
        location, 
        category, 
        studentCount, 
        mainProblem
      );
      
      // 2. Cinematic Loading Sequence
      setTimeout(() => setProvisionStep(1), 1200);
      setTimeout(() => setProvisionStep(2), 2400);
      setTimeout(() => setProvisionStep(3), 3600);
      
      // 3. Drop into Dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 4500);

    } catch (err: any) {
      setError(err.message || "Failed to provision workspace.");
      setStep(4); // Kick back if failed
      setProvisionStep(0);
    }
  };

  const currentGuide = WIZARD_STEPS[step];

  return (
    <main className="min-h-screen flex font-sans selection:bg-blue-100 selection:text-blue-900 bg-slate-50">
      
      {/* ========================================================= */}
      {/* LEFT SIDE: Dynamic Guide Panel */}
      {/* ========================================================= */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-br from-[#003B73] to-[#0074B7] text-white p-12 relative overflow-hidden z-10 transition-colors duration-700">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-center max-w-lg mx-auto">
          
          {/* Step Indicator */}
          <div className="flex gap-2 mb-12">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-12 bg-white' : i < step ? 'w-6 bg-white/50' : 'w-6 bg-white/20'}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-8 border border-white/20 bg-white/10 w-fit pr-6 pl-2 py-2 rounded-xl backdrop-blur-sm shadow-xl">
                <div className="bg-white/20 p-2 rounded-lg">
                  <currentGuide.icon className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-sm font-bold tracking-widest uppercase opacity-90">Step {step + 1} of 6</h1>
              </div>
              
              <h2 className="text-5xl font-extrabold leading-[1.1] mb-6 drop-shadow-sm tracking-tight">
                {currentGuide.title}
              </h2>
              <p className="text-blue-100 text-lg font-medium leading-relaxed max-w-md">
                {currentGuide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT SIDE: Interactive Wizard Area */}
      {/* ========================================================= */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-12 py-12 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto relative">
          
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-[#ffebee] border border-[#ffcdd2] p-4 text-sm font-bold text-[#cc0000] flex items-start gap-2 rounded-xl shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> 
              <span>{error}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            
            {/* STEP 0: WELCOME */}
            {step === 0 && (
              <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="w-16 h-16 bg-[#e6f2ff] rounded-2xl flex items-center justify-center mb-6 border border-[#0055a5]/20 shadow-inner">
                  <Sparkles className="w-8 h-8 text-[#0055a5]" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Let's set up your ERP.</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  We are about to configure your dedicated database, set up your admin profile, and unlock your 7-day unrestricted trial.
                </p>
                <button onClick={() => setStep(1)} className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#0055a5]/30 hover:shadow-[#0055a5]/40 mt-8 flex items-center justify-center gap-2 active:scale-[0.98]">
                  Begin Setup <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* STEP 1: PRIVACY & CONSENT */}
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="w-16 h-16 bg-[#e6f2ff] rounded-2xl flex items-center justify-center mb-6 border border-[#0055a5]/20 shadow-inner">
                  <FileText className="w-8 h-8 text-[#0055a5]" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Data Privacy</h3>
                <p className="text-slate-500 font-medium leading-relaxed mb-6">
                  Before we create your database, please confirm you understand our data handling policies for educational institutions.
                </p>
                <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input type="checkbox" checked={agreedPrivacy} onChange={(e) => setAgreedPrivacy(e.target.checked)} className="mt-1 w-5 h-5 text-[#0055a5] rounded border-gray-300 focus:ring-[#0055a5] cursor-pointer" />
                    <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                      I agree to the <span className="text-[#0055a5] font-bold">Terms of Service</span> and acknowledge that my student data is completely private and not shared with 3rd parties.
                    </span>
                  </label>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(0)} className="w-1/3 bg-white text-slate-600 border border-gray-300 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">Back</button>
                  <button onClick={() => setStep(2)} disabled={!agreedPrivacy} className="w-2/3 bg-[#0055a5] hover:bg-[#004080] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98]">
                    I Agree, Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: INSTITUTE NAME & LOCATION */}
            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="w-16 h-16 bg-[#e6f2ff] rounded-2xl flex items-center justify-center mb-6 border border-[#0055a5]/20 shadow-inner">
                  <Building2 className="w-8 h-8 text-[#0055a5]" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">Institute Details</h3>
                
                <div className="space-y-5 mt-6">
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">Official Institute Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} placeholder="e.g. Apex Academy" className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-bold text-lg text-slate-900 placeholder:font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">City / Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Kota, Rajasthan" className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-gray-400 shadow-sm" />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(1)} className="w-1/3 bg-white text-slate-600 border border-gray-300 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">Back</button>
                    <button onClick={() => setStep(3)} disabled={!instituteName.trim() || !location.trim()} className="w-2/3 bg-[#0055a5] hover:bg-[#004080] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98]">
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CATEGORY & SIZE */}
            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Operations Setup</h3>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">What do you teach?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {["JEE / NEET", "School Academics", "UPSC / Govt Exams", "Skill & IT Training"].map((cat) => (
                        <button key={cat} onClick={() => setCategory(cat)} className={`p-4 rounded-xl border text-sm font-bold text-left transition-all ${category === cat ? 'bg-[#0055a5] border-[#0055a5] text-white shadow-md' : 'bg-white border-gray-300 text-slate-700 hover:border-[#0055a5]/50'}`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">Total Active Students</label>
                    <div className="grid grid-cols-4 gap-2">
                      {["< 50", "50-200", "200-500", "500+"].map((count) => (
                        <button key={count} onClick={() => setStudentCount(count)} className={`p-3 rounded-xl border text-sm font-bold text-center transition-all ${studentCount === count ? 'bg-[#0055a5] border-[#0055a5] text-white shadow-md' : 'bg-white border-gray-300 text-slate-700 hover:border-[#0055a5]/50'}`}>
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(2)} className="w-1/3 bg-white text-slate-600 border border-gray-300 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">Back</button>
                    <button onClick={() => setStep(4)} disabled={!category || !studentCount} className="w-2/3 bg-[#0055a5] hover:bg-[#004080] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98]">
                      Next Step <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: BIGGEST PROBLEM */}
            {step === 4 && (
              <motion.div key="step-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">Final Step</h3>
                
                <div className="space-y-4">
                  <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">What is your biggest operational challenge right now?</label>
                  
                  <div className="flex flex-col gap-3">
                    {[
                      { id: "fees", label: "Fee Collection & Missing Dues", icon: Wallet },
                      { id: "attendance", label: "Tracking Attendance & Alerts", icon: CalendarClock },
                      { id: "exams", label: "Managing Tests & Results", icon: BookOpen },
                      { id: "all", label: "Everything is a mess right now", icon: AlertTriangle }
                    ].map((prob) => (
                      <button key={prob.id} onClick={() => setMainProblem(prob.id)} className={`p-4 rounded-xl border text-sm font-bold flex items-center gap-3 transition-all ${mainProblem === prob.id ? 'bg-[#0055a5] border-[#0055a5] text-white shadow-md' : 'bg-white border-gray-300 text-slate-700 hover:border-[#0055a5]/50'}`}>
                        <prob.icon className="w-5 h-5" /> {prob.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button onClick={() => setStep(3)} className="w-1/3 bg-white text-slate-600 border border-gray-300 font-bold py-4 rounded-xl hover:bg-gray-50 transition-all">Back</button>
                    <button onClick={handleSetup} disabled={!mainProblem} className="w-2/3 bg-[#008000] hover:bg-[#006600] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex justify-center items-center gap-2 active:scale-[0.98]">
                      Launch Dashboard <Sparkles className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: PROVISIONING */}
            {step === 5 && (
              <motion.div key="step-5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-10 flex flex-col items-center">
                <div className="relative mb-8">
                  <motion.div animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-[#0055a5] blur-xl rounded-full"></motion.div>
                  <div className="bg-white p-5 rounded-2xl relative z-10 shadow-lg border border-gray-100">
                    <Server className="w-10 h-10 text-[#0055a5] animate-pulse" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Provisioning Workspace...</h3>
                <p className="text-sm font-bold text-slate-500 mb-8">Setting up infrastructure for <span className="text-[#0055a5]">{instituteName}</span></p>

                <div className="w-full space-y-3 mb-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  {[
                    { label: "Initializing secure environment...", icon: ShieldCheck },
                    { label: "Configuring relational databases...", icon: Database },
                    { label: "Establishing SSL & API endpoints...", icon: Lock },
                    { label: `Optimizing dashboard for ${studentCount} students...`, icon: LayoutDashboard }
                  ].map((s, idx) => {
                    const isCompleted = idx < provisionStep;
                    const isCurrent = idx === provisionStep;
                    return (
                      <motion.div key={idx} initial={{ opacity: 0.4, x: -10 }} animate={{ opacity: isCompleted || isCurrent ? 1 : 0.4, x: 0 }} className="flex items-center gap-3 text-sm font-bold">
                        {isCompleted ? <CheckCircle2 className="w-5 h-5 text-[#008000] shrink-0" /> : isCurrent ? <Loader2 className="w-5 h-5 text-[#0055a5] animate-spin shrink-0" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300 shrink-0"></div>}
                        <span className={isCompleted ? "text-slate-900" : isCurrent ? "text-[#0055a5]" : "text-gray-400"}>{s.label}</span>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div className="bg-[#0055a5] h-2 rounded-full" animate={{ width: `${((provisionStep + 1) / 4) * 100}%` }} transition={{ duration: 0.5, ease: "easeInOut" }}></motion.div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}