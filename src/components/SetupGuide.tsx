"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, BookOpen, Layers, UserPlus, Users, X, Trophy } from "lucide-react";

export default function SetupGuide() {
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    // Check local storage to see what steps they've done
    const savedSteps = JSON.parse(localStorage.getItem("coachingwala_setup") || "[]");
    setCompletedSteps(savedSteps);
    
    // Hide if they dismissed it or finished all 4 steps
    const isDismissed = localStorage.getItem("coachingwala_setup_dismissed") === "true";
    if (!isDismissed && savedSteps.length < 4) {
      setIsVisible(true);
    }
  }, []);

  const dismissGuide = () => {
    setIsVisible(false);
    localStorage.setItem("coachingwala_setup_dismissed", "true");
  };

  // This is a helper function. In a real app, you'd trigger this when they actually submit the form on those pages.
  // For now, they can click the circle to mark it as done.
  const toggleStep = (stepId: string) => {
    let newSteps;
    if (completedSteps.includes(stepId)) {
      newSteps = completedSteps.filter(id => id !== stepId);
    } else {
      newSteps = [...completedSteps, stepId];
    }
    setCompletedSteps(newSteps);
    localStorage.setItem("coachingwala_setup", JSON.stringify(newSteps));
  };

  if (!isVisible) return null;

  const progress = (completedSteps.length / 4) * 100;

  const steps = [
    {
      id: "course",
      title: "1. Create a Course Master",
      desc: "Everything begins here. Define the programs you teach (e.g., '11th Physics').",
      icon: BookOpen,
      href: "/dashboard/courses",
      cta: "Go to Courses"
    },
    {
      id: "batch",
      title: "2. Organize a Batch",
      desc: "Link a schedule to your course by creating a batch (e.g., 'Morning Target 2027').",
      icon: Layers,
      href: "/dashboard/batches",
      cta: "Set up Batches"
    },
    {
      id: "enquiry",
      title: "3. Log a New Enquiry",
      desc: "Capture your first lead. Log a student who walked in or called for information.",
      icon: UserPlus,
      href: "/dashboard/enquiries/new",
      cta: "Add Enquiry"
    },
    {
      id: "student",
      title: "4. Admit a Student",
      desc: "Convert that lead into an official admission and assign them to your new batch.",
      icon: Users,
      href: "/dashboard/students",
      cta: "Admit Student"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> Let's set up your Institute
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Follow these 4 steps to build your foundation. You are {completedSteps.length} of 4 steps complete.
          </p>
        </div>
        <button onClick={dismissGuide} className="text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-slate-100">
        <div 
          className="h-full bg-[#0055a5] transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Steps Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          const isNext = !isDone && (
            (step.id === "course") || 
            (step.id === "batch" && completedSteps.includes("course")) ||
            (step.id === "enquiry" && completedSteps.includes("batch")) ||
            (step.id === "student" && completedSteps.includes("enquiry"))
          );

          return (
            <div 
              key={step.id} 
              className={`relative flex flex-col p-5 rounded-xl border-2 transition-all ${
                isDone ? "bg-emerald-50/50 border-emerald-100" : 
                isNext ? "bg-blue-50/30 border-[#0055a5] shadow-[0_0_15px_rgba(0,85,165,0.1)]" : 
                "bg-white border-slate-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-sm ${
                  isDone ? "bg-emerald-100 border-emerald-200 text-emerald-600" : 
                  isNext ? "bg-[#0055a5] border-[#004080] text-white" : 
                  "bg-slate-100 border-slate-200 text-slate-400"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                
                {/* Clicking the checkmark simulates completing the task for testing */}
                <button onClick={() => toggleStep(step.id)} className="shrink-0 mt-1">
                  {isDone ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-300 hover:text-[#0055a5] transition-colors" />
                  )}
                </button>
              </div>

              <h3 className={`text-sm font-black mb-2 ${isDone ? "text-slate-700" : "text-slate-900"}`}>
                {step.title}
              </h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6 flex-1">
                {step.desc}
              </p>

              <Link 
                href={step.href}
                className={`w-full py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                  isDone ? "bg-white border border-slate-200 text-slate-500 hover:border-slate-300" :
                  isNext ? "bg-[#0055a5] text-white hover:bg-[#004080] shadow-sm" :
                  "bg-slate-100 text-slate-400 pointer-events-none"
                }`}
              >
                {isDone ? "Review" : step.cta} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}