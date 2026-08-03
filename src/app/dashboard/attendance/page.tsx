"use client";

import { useState } from "react";
import { 
  Search, Save, AlertTriangle, ChevronLeft, ChevronRight 
} from "lucide-react";

// Mock Data Structure
const mockStudents = [
  { id: "STU-1042", name: "Rahul Sharma", roll: "21" },
  { id: "STU-1043", name: "Priya Singh", roll: "22" },
  { id: "STU-1044", name: "Amit Kumar", roll: "23" },
  { id: "STU-1045", name: "Neha Gupta", roll: "24" },
  { id: "STU-1046", name: "Vikram Yadav", roll: "25" },
  { id: "STU-1047", name: "Ananya Patel", roll: "26" },
];

export default function AttendancePage() {
  const [attendanceData, setAttendanceData] = useState(
    mockStudents.reduce((acc, student) => {
      acc[student.id] = "present"; 
      return acc;
    }, {} as Record<string, "present" | "absent" | "late">)
  );

  const [isSaving, setIsSaving] = useState(false);

  // Quick summary calculation
  const summary = Object.values(attendanceData).reduce((acc, status) => {
    acc[status]++;
    return acc;
  }, { present: 0, absent: 0, late: 0 });

  const toggleStatus = (studentId: string, status: "present" | "absent" | "late") => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Attendance saved! SMS alerts triggered for absent students.");
    }, 1200);
  };

  // Smart Alert Logic: Only show conflict if Rahul is marked absent
  const hasAbsentConflict = attendanceData["STU-1042"] === "absent";

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2 border-b border-gray-300 bg-white shrink-0 flex justify-between items-center">
        <h2 className="text-[17px] text-black font-normal">Daily Attendance Register</h2>
      </div>

      {/* 2. FUNCTIONAL TOOLBAR (Strict, compact, gray background) */}
      <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-gray-300 flex flex-wrap items-center gap-4 shrink-0">
        
        <div className="flex items-center gap-2">
          <label className="text-[12px] font-bold text-gray-800 uppercase">Batch:</label>
          <select className="px-2 py-1 border border-gray-400 bg-white text-[12px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <option>Class 12 PCM (Target 2027)</option>
            <option>NEET Achievers Batch</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-[12px] font-bold text-gray-800 uppercase">Date:</label>
          <div className="flex items-center border border-gray-400 bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]">
            <button className="px-1.5 py-1 hover:bg-gray-200 border-r border-gray-400 transition-colors"><ChevronLeft className="h-3.5 w-3.5 text-gray-600" /></button>
            <span className="px-3 text-[12px] font-bold text-gray-800">30 Jul 2026</span>
            <button className="px-1.5 py-1 hover:bg-gray-200 border-l border-gray-400 transition-colors"><ChevronRight className="h-3.5 w-3.5 text-gray-600" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search student..." 
              className="pl-7 pr-3 py-1 w-48 border border-gray-400 bg-white text-[12px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1 text-[12px] font-bold hover:bg-[#004080] transition-colors disabled:opacity-60 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save Register"}
          </button>
        </div>
      </div>

      {/* 3. STATUS BAR */}
      <div className="px-4 py-1.5 bg-[#eef5fa] border-b border-gray-300 flex gap-6 text-[12px] font-bold shrink-0">
        <span className="text-[#0055a5]">Total Students: {mockStudents.length}</span>
        <span className="text-[#008000]">Present: {summary.present}</span>
        <span className="text-[#cc0000]">Absent: {summary.absent}</span>
        <span className="text-[#ff9900]">Late: {summary.late}</span>
      </div>

      {/* 4. DYNAMIC CRITICAL ALERT (Classic ERP Warning Box) */}
      {hasAbsentConflict && (
        <div className="mx-4 mt-4 bg-[#fff3cd] border border-[#ffeeba] px-3 py-2 flex items-start gap-2 shadow-sm shrink-0">
          <AlertTriangle className="h-4 w-4 text-[#856404] shrink-0 mt-0.5" />
          <p className="text-[12px] text-[#856404] leading-tight">
            <strong>System Warning:</strong> <span className="font-bold">Rahul Sharma</span> is currently marked ABSENT, but the Biometric gate logs show an entry scan at 09:14 AM today. Please verify.
          </p>
        </div>
      )}

      {/* 5. CLASSIC ERP TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-400">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[12px] font-bold">
              <tr>
                <th className="py-1.5 px-3 border-r border-white/40 text-center w-24 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Roll No
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 text-center w-32 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Student ID
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Student Name
                </th>
                <th className="py-1.5 px-3 text-center w-64 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Attendance Status
                </th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[12px] text-gray-800">
              {mockStudents.map((student, index) => (
                <tr 
                  key={student.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                >
                  {/* Roll No */}
                  <td className="py-1.5 px-3 border-r border-gray-300 text-center font-bold">
                    {student.roll}
                  </td>
                  
                  {/* Student ID */}
                  <td className="py-1.5 px-3 border-r border-gray-300 text-center text-gray-500 font-mono">
                    {student.id}
                  </td>
                  
                  {/* Student Name */}
                  <td className="py-1.5 px-3 border-r border-gray-300 font-semibold">
                    {student.name}
                  </td>
                  
                  {/* Attendance Marking (Classic Segmented Control) */}
                  <td className="py-1.5 px-3 text-center">
                    <div className="inline-flex shadow-sm border border-gray-400 rounded-none overflow-hidden">
                      
                      <button 
                        onClick={() => toggleStatus(student.id, "present")}
                        className={`px-3 py-1 border-r border-gray-400 text-[11px] font-bold uppercase transition-colors ${
                          attendanceData[student.id] === "present" 
                            ? "bg-[#008000] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" 
                            : "bg-[#f5f5f5] text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Present
                      </button>
                      
                      <button 
                        onClick={() => toggleStatus(student.id, "absent")}
                        className={`px-3 py-1 border-r border-gray-400 text-[11px] font-bold uppercase transition-colors ${
                          attendanceData[student.id] === "absent" 
                            ? "bg-[#cc0000] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" 
                            : "bg-[#f5f5f5] text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Absent
                      </button>
                      
                      <button 
                        onClick={() => toggleStatus(student.id, "late")}
                        className={`px-3 py-1 text-[11px] font-bold uppercase transition-colors ${
                          attendanceData[student.id] === "late" 
                            ? "bg-[#ff9900] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" 
                            : "bg-[#f5f5f5] text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        Late
                      </button>

                    </div>
                  </td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}