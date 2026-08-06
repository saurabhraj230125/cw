"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle, Loader2 } from "lucide-react";
import { addStudentAction } from "../../app/actions/student-actions";

// 1. DEEP TYPESCRIPT FIX: Explicitly define the props to fix the Vercel build crash
interface AddStudentSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  subjects: any[];
}

export function AddStudentSheet({ open, onOpenChange, subjects }: AddStudentSheetProps) {
  // 2. SMART STATE MANAGEMENT: Allows the component to be controlled by the parent OR manage itself
  const [internalOpen, setInternalOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSheetOpen = open !== undefined ? open : internalOpen;
  
  const setSheetOpen = (val: boolean) => {
    if (onOpenChange) onOpenChange(val);
    setInternalOpen(val);
    if (!val) setError(null); // Clear errors on close
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const response = await addStudentAction(formData);
      
      if (response.success) {
        setSheetOpen(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to add student. Check database constraints.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {/* ERP Style Trigger Button (Only visible if the parent doesn't strictly hide it) */}
      <button 
        type="button"
        onClick={() => setSheetOpen(true)}
        className="flex items-center gap-1.5 bg-cw-green border border-[#006600] text-white px-4 py-1.5 text-erp-sm font-bold hover:bg-[#005000] transition-colors shadow-erp-button rounded-erp"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Quick Add
      </button>

      {isSheetOpen && (
        <>
          {/* Dark Overlay with Blur */}
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200" 
            onClick={() => setSheetOpen(false)} 
          />

          {/* Rigid Side Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300 border-l border-erp-border">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-cw-blue text-white border-b border-cw-blueDark shrink-0">
              <h2 className="text-erp-md font-bold tracking-wide uppercase flex items-center gap-2">
                <Plus className="w-4 h-4" /> Quick Admission
              </h2>
              <button 
                type="button"
                onClick={() => setSheetOpen(false)} 
                className="p-1 hover:bg-white/20 transition-colors rounded-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-erp-bg p-6">
              
              {error && (
                <div className="mb-5 p-3 bg-pastel-redBg border border-pastel-redBorder text-cw-red text-erp-sm font-bold flex items-start gap-2 shadow-sm rounded-erp animate-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-tight">{error}</p>
                </div>
              )}

              <form id="quick-student-form" onSubmit={handleSubmit} className="bg-white border border-erp-border p-5 space-y-5 shadow-sm rounded-erp">
                
                <div className="space-y-1.5">
                  <label className="text-erp-sm font-bold text-gray-800">Roll Number <span className="text-cw-red">*</span></label>
                  <input 
                    required 
                    name="roll_number" 
                    placeholder="e.g. 2026-MATH-01" 
                    className="w-full px-3 py-2 border border-erp-border bg-white text-erp-base focus:outline-none focus:border-cw-blue transition-colors rounded-sm" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-erp-sm font-bold text-gray-800">Full Name <span className="text-cw-red">*</span></label>
                  <input 
                    required 
                    name="full_name" 
                    placeholder="Student's Legal Name"
                    className="w-full px-3 py-2 border border-erp-border bg-white text-erp-base focus:outline-none focus:border-cw-blue transition-colors rounded-sm" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-erp-sm font-bold text-gray-800">Parent Phone <span className="text-cw-red">*</span></label>
                    <input 
                      required 
                      type="tel"
                      name="parent_phone" 
                      maxLength={10}
                      placeholder="10 Digits"
                      className="w-full px-3 py-2 border border-erp-border bg-white text-erp-base focus:outline-none focus:border-cw-blue transition-colors rounded-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-erp-sm font-bold text-gray-800">WhatsApp <span className="text-cw-red">*</span></label>
                    <input 
                      required 
                      type="tel"
                      name="whatsapp_number"
                      maxLength={10} 
                      placeholder="10 Digits"
                      className="w-full px-3 py-2 border border-erp-border bg-white text-erp-base focus:outline-none focus:border-cw-blue transition-colors rounded-sm" 
                    />
                  </div>
                </div>

                {/* Subject Assignment List */}
                <div className="pt-5 border-t border-erp-borderLight mt-2">
                  <label className="text-erp-sm font-bold text-cw-blue uppercase tracking-wider mb-3 block flex items-center justify-between">
                    Assign Subjects
                    <span className="text-gray-400 text-xs font-normal normal-case">Optional</span>
                  </label>
                  
                  <div className="border border-erp-border bg-white max-h-[220px] overflow-y-auto rounded-sm shadow-inner">
                    {subjects.length === 0 ? (
                      <div className="p-6 text-erp-sm text-gray-500 font-medium italic text-center bg-gray-50">
                        No active subjects configured in Master.
                      </div>
                    ) : (
                      subjects.map((subject, index) => (
                        <label 
                          key={subject.id} 
                          className={`flex items-center p-3 cursor-pointer hover:bg-pastel-blueBg transition-colors ${index !== subjects.length - 1 ? 'border-b border-erp-borderLight' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            name="subject_ids" 
                            value={subject.id} 
                            className="w-4 h-4 text-cw-blue rounded-sm border-gray-400 focus:ring-cw-blue cursor-pointer" 
                          />
                          <div className="ml-3 flex-1 flex justify-between items-center">
                            <span className="text-erp-sm font-bold text-gray-800">{subject.name}</span>
                            <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 border border-gray-200 rounded-sm">
                              ₹{subject.monthly_fee || 0}
                            </span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Action Footer */}
            <div className="p-4 border-t border-erp-border bg-erp-header flex justify-end gap-3 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button 
                type="button"
                onClick={() => setSheetOpen(false)}
                className="px-6 py-2 bg-white border border-erp-border text-gray-700 text-erp-sm font-bold hover:bg-gray-50 transition-colors rounded-erp shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="quick-student-form"
                disabled={isPending}
                className="flex items-center gap-2 bg-cw-blue border border-cw-blueDark text-white px-8 py-2 text-erp-sm font-bold hover:bg-cw-blueDark transition-colors disabled:opacity-60 shadow-erp-button rounded-erp"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isPending ? "Saving..." : "Lock Record"}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}