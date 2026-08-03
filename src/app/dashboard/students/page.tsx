import { Search, MessageCircle } from "lucide-react";
import { getStudents, getBranchSubjects } from "../../actions/student-actions";
import { AddStudentSheet } from "../../../components/students/AddStudentSheet";

export default async function StudentsPage() {
  const students = await getStudents();
  const subjects = await getBranchSubjects();

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[17px] text-black font-normal">Student Master Directory</h2>
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-3 bg-[#f5f5f5] border-b border-gray-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            placeholder="Search students..." 
            className="pl-8 pr-3 py-1 border border-gray-400 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] w-64 shadow-inner"
          />
        </div>
        <div>
          {/* Automatically works now, no props needed besides subjects */}
          <AddStudentSheet subjects={subjects} />
        </div>
      </div>

      {/* 3. THE CLASSIC ERP TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-400">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[12px] font-bold">
              <tr>
                <th className="py-1.5 px-3 border-r border-white/40 text-center w-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Roll No
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Student Name
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">
                  Parent Contact
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Enrolled Subjects
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 text-center w-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Status
                </th>
                <th className="py-1.5 px-3 text-center w-28 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Action
                </th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[12px] text-gray-800">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center border-t border-gray-300">
                    <span className="text-gray-500">No student records found.</span>
                  </td>
                </tr>
              ) : (
                students.map((student: any, index: number) => (
                  <tr 
                    key={student.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                  >
                    
                    {/* Roll No */}
                    <td className="py-1.5 px-3 border-r border-gray-300 text-center font-semibold">
                      {student.roll_number}
                    </td>
                    
                    {/* Student Name */}
                    <td className="py-1.5 px-3 border-r border-gray-300">
                      {student.full_name}
                    </td>
                    
                    {/* Parent Contact */}
                    <td className="py-1.5 px-3 border-r border-gray-300 text-center">
                      {student.parent_phone}
                    </td>
                    
                    {/* Subjects - Comma Separated Classic Text */}
                    <td className="py-1.5 px-3 border-r border-gray-300">
                      {student.student_subjects && student.student_subjects.length > 0 ? (
                        student.student_subjects.map((enrollment: any, idx: number) => (
                          <span key={enrollment.subjects.id}>
                            {enrollment.subjects.name}
                            {idx < student.student_subjects.length - 1 ? ", " : ""}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    
                    {/* Status */}
                    <td className="py-1.5 px-3 border-r border-gray-300 text-center">
                      <span className="text-[#008000] font-bold uppercase">Active</span>
                    </td>
                    
                    {/* Action Link (Classic Blue Link Style) */}
                    <td className="py-1.5 px-3 text-center">
                      <a 
                        href={`https://wa.me/91${student.whatsapp_number}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0066cc] hover:text-[#003399] hover:underline font-medium inline-flex items-center justify-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Msg
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