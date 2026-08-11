"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CheckCircle2, Bell, MessageCircle, 
  Fingerprint, Users, BookOpen, GraduationCap
} from "lucide-react";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("fee");

  return (
    <main className="min-h-screen bg-white text-slate-900 font-sans overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-[#0055a5] p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0055a5]">
              CoachingWala
            </span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
            <Link href="#features" className="hover:text-[#0055a5] transition-colors">Features</Link>
            <Link href="#company" className="hover:text-[#0055a5] transition-colors">Company</Link>
            <Link href="#pricing" className="hover:text-[#0055a5] transition-colors">Pricing</Link>
            <Link href="#contact" className="hover:text-[#0055a5] transition-colors">Contact Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-[15px] font-bold bg-[#0055a5] text-white px-6 py-2.5 rounded-full hover:bg-[#004080] transition-colors">
              Log In
            </Link>
            <Link href="/signup" className="hidden sm:block text-[15px] font-bold text-[#0055a5] border border-[#0055a5] px-6 py-2.5 rounded-full hover:bg-[#e6f2ff] transition-colors">
              Get free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (Using the Deep Blue Theme) */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 max-w-7xl mx-auto min-h-[90vh] flex items-center mt-10">
        
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#f8fafc] bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          <div className="max-w-xl z-10">
            <h2 className="text-3xl md:text-4xl font-light text-slate-800 mb-2">Your Trusted</h2>
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-[#0055a5] mb-6 leading-[1.1]">
              All-In-One Coaching<br />Class<br />Management Software
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
              Upgrade your coaching class management with online fee collection, lecture & exam management, lead tracking, biometric attendance, SMS notification & more.
            </p>
            <div className="flex items-center gap-4">
               <Link href="/signup" className="text-lg font-bold bg-[#0055a5] text-white px-8 py-4 rounded-full hover:bg-[#004080] transition-all shadow-lg shadow-[#0055a5]/30 hover:-translate-y-1">
                Sign Up For Free Trial
              </Link>
            </div>
          </div>

          {/* Hero Floating Widgets */}
          <div className="relative h-[500px] w-full hidden md:block">
            {/* Widget 1: Punched In */}
            <motion.div animate={{ y: [-10, 10, -10] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute top-[20%] left-[10%] bg-slate-900 text-white px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl z-20 border border-slate-700">
              <div className="bg-[#0055a5] rounded-full p-1"><Fingerprint className="w-5 h-5 text-white" /></div>
              <span className="font-semibold text-sm">Punched In</span>
            </motion.div>

            {/* Widget 2: Performance Report */}
            <motion.div animate={{ y: [10, -10, 10] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} className="absolute top-[10%] right-[15%] bg-white p-5 rounded-3xl shadow-2xl border border-gray-100 z-30 w-48">
              <h4 className="text-[#0055a5] font-bold text-sm mb-4">Performance<br/>Report</h4>
              <div className="w-24 h-24 rounded-full border-[12px] border-[#0055a5] border-r-slate-800 border-b-amber-400 mx-auto"></div>
              <div className="absolute -bottom-3 -right-3 bg-amber-400 p-2.5 rounded-full shadow-lg"><BookOpen className="w-5 h-5 text-slate-900" /></div>
            </motion.div>

            {/* Widget 3: Attendance Reports */}
            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }} className="absolute bottom-[10%] left-[15%] bg-white p-5 rounded-2xl shadow-2xl border border-gray-100 z-20">
              <h4 className="text-[#0055a5] font-bold text-sm mb-4">Attendance<br/>Reports</h4>
              <div className="flex items-end gap-2 h-16">
                <div className="w-2.5 bg-[#0055a5] rounded-t-full h-[80%]"></div>
                <div className="w-2.5 bg-[#0055a5] rounded-t-full h-[60%]"></div>
                <div className="w-2.5 bg-red-400 rounded-t-full h-[40%]"></div>
                <div className="w-2.5 bg-[#0055a5] rounded-t-full h-[100%]"></div>
                <div className="w-2.5 bg-[#0055a5] rounded-t-full h-[90%]"></div>
              </div>
            </motion.div>

            {/* Background Image Placeholder */}
            <div className="absolute inset-0 top-[20%] left-[20%] right-[20%] bottom-0 bg-gradient-to-t from-slate-200 to-slate-50 rounded-t-full overflow-hidden border border-gray-200 flex items-end justify-center pb-10 shadow-inner">
               <Users className="w-32 h-32 text-slate-300" />
            </div>

            {/* WhatsApp Floating Icon */}
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-[20%] right-[20%] bg-white p-3.5 rounded-full shadow-xl z-30 border border-gray-100">
              <MessageCircle className="w-8 h-8 text-[#0055a5]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. DITCH SPREADSHEETS SECTION */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto text-center border-t border-gray-100">
        <h2 className="text-4xl md:text-5xl font-light text-slate-800 mb-2 tracking-tight">Ditch Documents. Ditch Spreadsheets.</h2>
        <h3 className="text-3xl md:text-4xl font-light text-slate-800 mb-16">
          Switch To <span className="text-[#0055a5] font-medium">Coaching Management Software</span> Built For Your Institute.
        </h3>

        {/* Feature Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-20 max-w-4xl mx-auto">
          {[
            { id: "fee", label: "Transparent Fee Management" },
            { id: "attendance", label: "Biometric Attendance" },
            { id: "performance", label: "Student Performance" },
            { id: "app", label: "Student/Parent App" },
            { id: "reports", label: "Insightful Reports" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-full border text-sm md:text-base transition-all duration-300 ${
                activeTab === tab.id 
                ? "border-[#0055a5] text-[#0055a5] shadow-md shadow-[#0055a5]/10 font-bold bg-[#e6f2ff]" 
                : "border-gray-200 text-slate-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-left">
          <div className="max-w-md">
            <h3 className="text-3xl font-light text-slate-800 leading-snug mb-8">
              We streamline the financial process of fee management with the help of <span className="text-[#0055a5] font-medium">online payment options, automated payment reminders, real time fees tracking</span> and more.
            </h3>
            <button className="bg-[#0055a5] text-white font-semibold px-8 py-3 rounded-full hover:bg-[#004080] transition-colors shadow-lg shadow-[#0055a5]/30">
              Learn More
            </button>
          </div>

          {/* Interactive UI Mockup */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform md:-rotate-2 transition-transform hover:rotate-0 duration-500">
              <div className="bg-[#0055a5] p-4 flex items-center justify-between text-white">
                <span className="font-bold text-lg flex items-center gap-2"><GraduationCap className="w-5 h-5"/> CoachingWala</span>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  <div className="w-3 h-3 rounded-full bg-white/30"></div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50">
                <div className="bg-red-50 text-red-500 border border-red-100 p-4 rounded-xl flex justify-between items-center font-bold text-xl mb-6 shadow-sm">
                  <span>Total Outstanding Fees</span>
                  <span>₹97,814</span>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-sm text-left text-slate-600">
                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                      <tr>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Due Fees</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      <tr>
                        <td className="px-4 py-4">01 August, 2026</td>
                        <td className="px-4 py-4 font-medium">Alka Popere</td>
                        <td className="px-4 py-4">Class XII</td>
                        <td className="px-4 py-4 text-red-500 font-bold">₹10,000</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4">05 August, 2026</td>
                        <td className="px-4 py-4 font-medium">Pranay Jadhav</td>
                        <td className="px-4 py-4">JEE Dropper</td>
                        <td className="px-4 py-4 text-red-500 font-bold">₹8,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <motion.div animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -top-8 -right-8 bg-white p-5 rounded-2xl shadow-xl border border-gray-100 z-20">
              <div className="absolute -top-4 -right-4 bg-white p-2 rounded-full shadow-md border border-gray-100">
                <Bell className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-slate-500 font-semibold text-sm mb-1">Payment Due</p>
              <p className="text-red-500 font-bold text-3xl">₹5,245</p>
              <p className="text-xs text-slate-400 mt-2">01st Aug, 2026</p>
            </motion.div>

             <motion.div animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-8 -left-8 bg-white p-5 rounded-2xl shadow-xl border-2 border-[#0055a5] z-20">
              <p className="text-slate-800 font-black text-lg mb-1">Paid</p>
              <p className="text-[#0055a5] font-bold text-4xl">₹4000</p>
              <p className="text-xs text-slate-500 mt-2">Paid on 1st Aug, 2026 by Cash</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. MADE IN INDIA CTA (Now in Deep Blue) */}
      <section className="bg-[#002b5e] text-white py-24 relative overflow-hidden mt-32 border-t border-[#004080]">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-10 md:mb-0">
            <h2 className="text-5xl font-light mb-2">Made in India.</h2>
            <h2 className="text-5xl font-light">Made for the World.</h2>
          </div>
          <Link href="/signup" className="bg-white text-[#0055a5] hover:bg-gray-100 font-bold text-lg px-10 py-5 rounded-full transition-all shadow-lg shadow-black/20">
            Sign Up For Free Trial
          </Link>
        </div>
      </section>

    </main>
  );
}