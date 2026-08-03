"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NewAdmissionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    batch: "class-12-pcm-2027",
    enrollmentNo: `CW-${Math.floor(1000 + Math.random() * 9000)}`,
    totalFee: "15000",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Server Action simulation
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/dashboard/students?success=true");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#f3f4f6] font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2 border-b border-gray-300 bg-white shrink-0 flex items-center gap-3">
        <Link 
          href="/dashboard/students" 
          className="text-[#0055a5] hover:text-[#003399] transition-colors"
          title="Back to Directory"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
        </Link>
        <h2 className="text-[17px] text-black font-normal">Student Master Registration</h2>
      </div>

      {/* 2. FORM WORKSPACE */}
      <div className="flex-1 p-4 sm:p-6 overflow-auto">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
          
          {/* SECTION 1: PERSONAL DETAILS */}
          <div className="bg-white border border-gray-400 shadow-sm">
            {/* Strict Gray Header */}
            <div className="bg-[#f5f5f5] border-b border-gray-400 px-4 py-2 flex items-center">
              <h2 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider">
                1. Personal Information
              </h2>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800">First Name <span className="text-red-600">*</span></label>
                <input 
                  required
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-colors" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-colors" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800">Phone Number <span className="text-red-600">*</span></label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-colors" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-colors" 
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: ACADEMIC DETAILS */}
          <div className="bg-white border border-gray-400 shadow-sm">
            <div className="bg-[#f5f5f5] border-b border-gray-400 px-4 py-2 flex items-center">
              <h2 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider">
                2. Academic Assignment
              </h2>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800">Assign to Batch <span className="text-red-600">*</span></label>
                <select 
                  value={formData.batch}
                  onChange={(e) => setFormData({...formData, batch: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] cursor-pointer"
                >
                  <option value="class-12-pcm-2027">Class 12 PCM (Target 2027)</option>
                  <option value="neet-achievers">NEET Achievers Batch</option>
                  <option value="foundation-10">Class 10th Foundation</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800 flex justify-between">
                  Enrollment Number
                  <span className="text-gray-500 font-normal italic">Auto-generated</span>
                </label>
                <input 
                  type="text" 
                  readOnly
                  value={formData.enrollmentNo}
                  className="w-full px-2.5 py-1.5 border border-gray-300 bg-gray-100 text-[13px] text-gray-600 font-mono focus:outline-none cursor-not-allowed" 
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: FEE CONFIGURATION */}
          <div className="bg-white border border-gray-400 shadow-sm">
            <div className="bg-[#f5f5f5] border-b border-gray-400 px-4 py-2 flex items-center">
              <h2 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider">
                3. Fee Configuration
              </h2>
            </div>
            
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1">
                <label className="text-[12px] font-bold text-gray-800">Total Course Fee (₹)</label>
                <input 
                  type="number" 
                  value={formData.totalFee}
                  onChange={(e) => setFormData({...formData, totalFee: e.target.value})}
                  className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] font-bold text-black focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] transition-colors" 
                />
              </div>
              
              {/* Classic System Alert Box */}
              <div className="flex items-start gap-3 bg-[#e8f5e9] border border-[#a5d6a7] p-3 md:mt-5">
                <AlertCircle className="h-4 w-4 text-[#2e7d32] shrink-0 mt-0.5" />
                <p className="text-[12px] text-[#2e7d32] leading-tight">
                  System Note: An initial invoice for <strong>₹{formData.totalFee}</strong> will be generated in the Fee Ledger upon admission confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* FORM ACTIONS - Classic Button Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link 
              href="/dashboard/students"
              className="px-5 py-1.5 bg-[#f5f5f5] border border-gray-400 text-gray-700 text-[13px] font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={isSubmitting || !formData.firstName || !formData.phone}
              className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-6 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors disabled:opacity-60 shadow-sm"
            >
              {isSubmitting ? (
                "Processing..."
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> Confirm Admission
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}