"use client";

import { useState } from "react";
import { Plus, X, Save, AlertCircle } from "lucide-react";
import { addStudentAction } from "../../app/actions/student-actions";

export function AddStudentSheet({ subjects }: { subjects: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setError(null);
    try {
      await addStudentAction(formData);
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to add student");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      {/* ERP Style Trigger Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors shadow-sm"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        Add Student
      </button>

      {isOpen && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 z-40 bg-black/40" 
            onClick={() => setIsOpen(false)} 
          />

          {/* Rigid Side Panel */}
          <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-gray-400 shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-200">
            
            {/* Panel Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0055a5] text-white border-b border-[#003366]">
              <h2 className="text-[15px] font-bold tracking-wide uppercase">New Admission Entry</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1 hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#f3f4f6] p-4">
              
              {error && (
                <div className="mb-4 p-3 bg-[#ffeeee] border border-[#cc0000] text-[#cc0000] text-[12px] font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form id="student-form" action={handleSubmit} className="bg-white border border-gray-400 p-4 space-y-4 shadow-sm">
                
                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-gray-800">Roll Number <span className="text-red-600">*</span></label>
                  <input 
                    required 
                    name="roll_number" 
                    placeholder="2026-MATH-01" 
                    className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[12px] font-bold text-gray-800">Full Name <span className="text-red-600">*</span></label>
                  <input 
                    required 
                    name="full_name" 
                    className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-gray-800">Parent Phone <span className="text-red-600">*</span></label>
                    <input 
                      required 
                      name="parent_phone" 
                      maxLength={10}
                      className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[12px] font-bold text-gray-800">WhatsApp <span className="text-red-600">*</span></label>
                    <input 
                      required 
                      name="whatsapp_number"
                      maxLength={10} 
                      className="w-full px-2.5 py-1.5 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" 
                    />
                  </div>
                </div>

                {/* Subject Assignment List */}
                <div className="pt-4 border-t border-gray-300 mt-2">
                  <label className="text-[13px] font-bold text-[#0055a5] uppercase tracking-wider mb-2 block">
                    Assign Subjects
                  </label>
                  
                  <div className="border border-gray-400 bg-white max-h-[200px] overflow-y-auto">
                    {subjects.length === 0 ? (
                      <div className="p-3 text-[12px] text-gray-500 italic text-center">
                        No active subjects found.
                      </div>
                    ) : (
                      subjects.map((subject, index) => (
                        <label 
                          key={subject.id} 
                          className={`flex items-center p-2.5 cursor-pointer hover:bg-[#eef5fa] ${index !== subjects.length - 1 ? 'border-b border-gray-200' : ''}`}
                        >
                          <input 
                            type="checkbox" 
                            name="subject_ids" 
                            value={subject.id} 
                            className="w-3.5 h-3.5 text-[#0055a5] rounded-none border-gray-400 focus:ring-0" 
                          />
                          <div className="ml-3 flex-1 flex justify-between items-center">
                            <span className="text-[12px] font-bold text-gray-800">{subject.name}</span>
                            <span className="text-[11px] font-bold text-gray-500">₹{subject.monthly_fee}</span>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Action Footer */}
            <div className="p-4 border-t border-gray-300 bg-[#f5f5f5] flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-5 py-1.5 bg-white border border-gray-400 text-gray-700 text-[12px] font-bold hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="student-form"
                disabled={isPending}
                className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-6 py-1.5 text-[12px] font-bold hover:bg-[#004080] transition-colors disabled:opacity-60 shadow-sm"
              >
                {isPending ? "Saving..." : <><Save className="w-3.5 h-3.5" /> Save Record</>}
              </button>
            </div>

          </div>
        </>
      )}
    </>
  );
}