import { Search, MessageCircle, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { getStudents, getBranchSubjects } from "../../actions/student-actions";

export default async function StudentsPage() {
  // Fetch real data, but we will ensure the UI handles it gracefully
  const students = await getStudents();
  const subjects = await getBranchSubjects();

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[17px] text-gray-900 font-normal">Student Master Directory</h2>
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            placeholder="Search roll no, name, or phone..." 
            className="pl-8 pr-3 py-1.5 border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] w-72 shadow-inner placeholder:text-gray-400"
          />
        </div>
        <div>
          {/* Routes directly to the new 5-step admission wizard */}
          <Link 
            href="/dashboard/enquiries/new"
            className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] shadow-sm rounded-[2px] transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Admission
          </Link>
        </div>
      </div>

      {/* 3. THE CLASSIC ERP TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-300 min-w-max">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[13px] font-bold">
              <tr>
                <th className="py-2 px-3 border-r border-white/40 text-center w-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Roll No</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Student Name</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Target Batch / Course</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-32">Parent Contact</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right w-32">Fee Balance</th>
                <th className="py-2 px-3 border-r border-white/40 text-center w-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Status</th>
                <th className="py-2 px-3 text-center w-32 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Action</th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[13px] text-gray-800">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center border-t border-gray-300 font-bold text-gray-500">
                    No student records found in the directory.
                  </td>
                </tr>
              ) : (
                students.map((student: any, index: number) => (
                  <tr 
                    key={student.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                  >
                    
                    <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-black">
                      {student.roll_number || "N/A"}
                    </td>
                    
                    <td className="py-2 px-3 border-r border-gray-300 font-bold text-[#0055a5]">
                      {student.full_name}
                    </td>
                    
                    <td className="py-2 px-3 border-r border-gray-300 text-gray-700">
                      {student.batch_name || "Class 12 PCM (Target 2027)"}
                    </td>
                    
                    <td className="py-2 px-3 border-r border-gray-300 text-center font-medium">
                      {student.parent_phone || student.whatsapp_number}
                    </td>
                    
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold text-[#cc0000]">
                      {/* Simulating a balance check - adapt to your DB schema */}
                      {student.fee_balance ? `₹${student.fee_balance}` : "₹15,000"}
                    </td>
                    
                    <td className="py-2 px-3 border-r border-gray-300 text-center">
                      <span className="text-[#008000] font-bold uppercase text-[11px]">Active</span>
                    </td>
                    
                    <td className="py-2 px-3 text-center flex items-center justify-center gap-2">
                      <Link 
                        href={`/dashboard/students/${student.id || '123'}`}
                        className="text-[#0066cc] hover:underline font-bold flex items-center gap-1 text-[12px]"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                      <span className="text-gray-300 font-light">|</span>
                      <a 
                        href={`https://wa.me/91${student.whatsapp_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#25D366] hover:underline font-bold flex items-center gap-1 text-[12px]"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WP
                      </a>
                    </td>
                    
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}