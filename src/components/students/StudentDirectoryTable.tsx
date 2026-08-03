"use client";

import { MessageCircle } from "lucide-react";
import type { StudentDirectoryRow } from "../../lib/validations/students";

type StudentDirectoryTableProps = {
  students: StudentDirectoryRow[];
};

export function StudentDirectoryTable({ students }: StudentDirectoryTableProps) {
  return (
    <div className="border border-gray-400 bg-white">
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
            <th className="py-1.5 px-3 text-center w-28 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
              Action
            </th>
          </tr>
        </thead>

        {/* STRICT BORDERED ROWS */}
        <tbody className="text-[12px] text-gray-800">
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center border-t border-gray-300 bg-gray-50">
                <span className="text-gray-500 font-medium">No student records found in the directory.</span>
              </td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr 
                key={student.id} 
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300 last:border-0`}
              >
                <td className="py-1.5 px-3 border-r border-gray-300 text-center font-bold">
                  {student.roll_number}
                </td>
                <td className="py-1.5 px-3 border-r border-gray-300">
                  <div className="font-semibold text-black">{student.full_name}</div>
                  <div className="text-[11px] text-gray-500">WA: {student.whatsapp_number}</div>
                </td>
                <td className="py-1.5 px-3 border-r border-gray-300 text-center">
                  {student.parent_phone}
                </td>
                <td className="py-1.5 px-3 border-r border-gray-300">
                  {student.subjects && student.subjects.length > 0 ? (
                    student.subjects.map((enrollment, idx) => (
                      <span key={enrollment.subject_id}>
                        {enrollment.subject.name}
                        {idx < student.subjects.length - 1 ? ", " : ""}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 italic">Unassigned</span>
                  )}
                </td>
                <td className="py-1.5 px-3 text-center">
                  <a 
                    href={`https://wa.me/91${student.whatsapp_number}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0066cc] hover:text-[#003399] hover:underline font-medium inline-flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Msg
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}