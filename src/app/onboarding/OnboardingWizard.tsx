"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Building2, ArrowRight, Loader2, Sparkles, 
  Server, CheckCircle2, AlertTriangle, ShieldCheck 
} from "lucide-react";
import { completeOnboardingAction } from "../../app/actions/owner-auth";

export default function OnboardingWizard() {
  const router = useRouter();
  
  const [instituteName, setInstituteName] = useState("");
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [setupStep, setSetupStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instituteName) return;
    
    setIsProvisioning(true);
    setError(null);

    try {
      await completeOnboardingAction(instituteName);
      
      setSetupStep(1);
      setTimeout(() => setSetupStep(2), 1200);
      setTimeout(() => setSetupStep(3), 2400);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 3500);

    } catch (err: any) {
      setError(err.message);
      setIsProvisioning(false);
      setSetupStep(0);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans flex items-center justify-center p-6 selection:bg-[#0055a5] selection:text-white relative overflow-hidden">
      
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#0055a5]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#00a3cc]/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="w-full max-w-xl relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center bg-white border border-gray-200 text-[#0055a5] p-4 rounded-2xl mb-6 shadow-sm">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
            Account Created Successfully!
          </h1>
          <p className="text-base font-medium text-gray-500 max-w-sm mx-auto">
            Let's set up your cloud workspace. What is the official name of your coaching institute?
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-3xl shadow-xl shadow-[#0055a5]/5 border border-gray-100 p-8 sm:p-12 relative overflow-hidden"
        >
          
          {error && (
            <div className="mb-6 bg-[#ffebee] border border-[#ffcdd2] p-4 text-sm font-bold text-[#cc0000] flex items-start gap-2 rounded-xl shadow-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {isProvisioning ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 flex flex-col items-center justify-center text-center"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 bg-[#0055a5] blur-2xl rounded-full"
                ></motion.div>
                <div className="bg-white p-4 rounded-2xl relative z-10 shadow-lg border border-gray-100">
                  <Server className="w-10 h-10 text-[#0055a5]" />
                </div>
              </div>
              
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3 tracking-tight">Provisioning Workspace...</h3>
              
              <div className="h-6 overflow-hidden relative w-full flex justify-center mb-6">
                <motion.div 
                  animate={{ y: `-${setupStep * 24}px` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="flex flex-col text-sm font-bold text-[#0055a5] absolute"
                >
                  <span className="h-[24px] flex items-center">Initializing environment...</span>
                  <span className="h-[24px] flex items-center">Allocating Cloud Servers for {instituteName}...</span>
                  <span className="h-[24px] flex items-center">Configuring Master Databases...</span>
                  <span className="h-[24px] flex items-center text-[#008000] gap-1"><ShieldCheck className="w-4 h-4"/> Securing API Endpoints...</span>
                </motion.div>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
                <motion.div 
                  className="bg-[#0055a5] h-2 rounded-full"
                  initial={{ width: "10%" }}
                  animate={{ width: setupStep === 0 ? "25%" : setupStep === 1 ? "50%" : setupStep === 2 ? "80%" : "100%" }}
                  transition={{ duration: 0.8 }}
                ></motion.div>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSetup} className="space-y-8">
              
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-600 uppercase tracking-widest ml-1">Institute Name</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-[#0055a5] transition-colors" />
                  <input 
                    type="text" 
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    required
                    placeholder="e.g. Apex Academy" 
                    className="w-full pl-14 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-[#0055a5] focus:ring-4 focus:ring-[#0055a5]/10 outline-none transition-all font-semibold text-lg text-gray-900 placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="bg-[#f8fafc] rounded-2xl p-4 border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Workspace Includes:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><CheckCircle2 className="w-4 h-4 text-[#008000]" /> Dedicated Database</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><CheckCircle2 className="w-4 h-4 text-[#008000]" /> Student Portal Access</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><CheckCircle2 className="w-4 h-4 text-[#008000]" /> CBT Exam Engine</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><CheckCircle2 className="w-4 h-4 text-[#008000]" /> 7-Day Unrestricted</div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#0055a5] hover:bg-[#004080] text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-[#0055a5]/30 hover:shadow-[#0055a5]/40 active:scale-[0.98] flex justify-center items-center gap-2 text-[15px]"
              >
                Launch Cloud Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}

        </motion.div>
      </div>
    </main>
  );
}