"use client";

import { useState } from "react";
import { 
  Trophy, Medal, Search, Save, Award, 
  TrendingUp, AlertOctagon, FileSpreadsheet 
} from "lucide-react";

// Mock Data: Structured exactly how our Supabase JOIN will return it
const mockExamData = {
  id: "EXAM-991",
  title: "JEE Mains Pattern - Mock Test 4",
  subject: "Class 12 Physics",
  date: "2026-08-10",
  totalMarks: 100,
  students: [
    { id: "STU-1", name: "Rahul Sharma", roll: "21", marks: 92 },
    { id: "STU-2", name: "Priya Singh", roll: "22", marks: 45 },
    { id: "STU-3", name: "Amit Kumar", roll: "23", marks: 88 },
    { id: "STU-4", name: "Neha Gupta", roll: "24", marks: 95 },
    { id: "STU-5", name: "Vikram Yadav", roll: "25", marks: 32 },
    { id: "STU-6", name: "Ananya Patel", roll: "26", marks: 76 },
  ]
};

export default function ExamTrackerPage() {
  const [marksState, setMarksState] = useState<Record<string, number>>(
    mockExamData.students.reduce((acc, stu) => ({ ...acc, [stu.id]: stu.marks }), {})
  );
  const [isSaving, setIsSaving] = useState(false);

  // Math Engine: Calculate Ranks, Percentages, and Averages dynamically
  const sortedStudents = [...mockExamData.students].sort((a, b) => marksState[b.id] - marksState[a.id]);
  const classAverage = Math.round(Object.values(marksState).reduce((a, b) => a + b, 0) / mockExamData.students.length);
  const highestScore = Math.max(...Object.values(marksState));

  const handleMarkChange = (studentId: string, value: string) => {
    const numValue = Math.min(Math.max(0, Number(value) || 0), mockExamData.totalMarks);
    setMarksState(prev => ({ ...prev, [studentId]: numValue }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Marks saved! Batch ranks have been updated.");
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-blue-600" />
            Performance & Ranks
          </h1>
          <p className="text-slate-500 mt-1">Input scores, generate leaderboards, and track batch progress.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
            <FileSpreadsheet className="h-4 w-4" /> Export Report
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-70"
          >
            {isSaving ? "Saving..." : "Publish Results"} <Save className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* EXAM CONTEXT & STATS CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Exam Details Card */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Award className="w-24 h-24" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/30">
            Active Exam
          </div>
          <h2 className="text-2xl font-bold mb-1">{mockExamData.title}</h2>
          <p className="text-slate-400 font-medium">{mockExamData.subject} • {mockExamData.date}</p>
          <div className="mt-6 pt-4 border-t border-slate-700 flex gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Max Marks</p>
              <p className="text-xl font-bold text-slate-100">{mockExamData.totalMarks}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Students Appeared</p>
              <p className="text-xl font-bold text-slate-100">{mockExamData.students.length}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Stat: Batch Average */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Batch Average</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-bold text-slate-900">{classAverage}</h3>
            <p className="text-sm font-medium text-slate-400 mb-1.5">/ {mockExamData.totalMarks}</p>
          </div>
        </div>

        {/* Dynamic Stat: Highest Score */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Trophy className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Highest Score</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-bold text-amber-600">{highestScore}</h3>
            <p className="text-sm font-medium text-slate-400 mb-1.5">/ {mockExamData.totalMarks}</p>
          </div>
        </div>

      </div>

      {/* DYNAMIC LEADERBOARD & ENTRY TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900">Score Entry & Leaderboard</h3>
          <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                  type="text" 
                  placeholder="Search student..." 
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 w-24 text-center">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4 w-48 text-center">Marks Obtained</th>
                <th className="px-6 py-4 w-32 text-center">Percentage</th>
                <th className="px-6 py-4 w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((student, index) => {
                const currentMarks = marksState[student.id];
                const percentage = Math.round((currentMarks / mockExamData.totalMarks) * 100);
                const rank = index + 1;
                
                // Visual logic based on performance
                const isTopper = rank === 1;
                const isFailing = percentage < 40;

                return (
                  <tr key={student.id} className={`transition-colors ${isTopper ? 'bg-amber-50/30' : 'hover:bg-slate-50/80'}`}>
                    
                    {/* Rank Column */}
                    <td className="px-6 py-4 text-center">
                      {isTopper ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 shadow-sm border border-amber-200">
                          <Medal className="w-4 h-4" />
                        </div>
                      ) : (
                        <span className="font-bold text-slate-400 text-base">#{rank}</span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-base">{student.name}</div>
                      <div className="font-mono text-xs font-semibold text-slate-500 mt-0.5">Roll: {student.roll}</div>
                    </td>

                    {/* Score Input Column */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          value={currentMarks}
                          onChange={(e) => handleMarkChange(student.id, e.target.value)}
                          className={`w-20 text-center py-1.5 border rounded-lg font-bold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            isFailing ? 'bg-red-50 border-red-200 text-red-700' : 'bg-slate-50 border-slate-200 text-slate-900'
                          }`}
                        />
                        <span className="text-slate-400 font-medium">/ {mockExamData.totalMarks}</span>
                      </div>
                    </td>

                    {/* Percentage Column */}
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold text-base ${isFailing ? 'text-red-600' : 'text-slate-700'}`}>
                        {percentage}%
                      </span>
                    </td>

                    {/* Status Alert Column */}
                    <td className="px-6 py-4">
                      {isTopper && (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                          Topper
                        </span>
                      )}
                      {isFailing && (
                        <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2.5 py-1 rounded-md border border-red-200">
                          <AlertOctagon className="w-3.5 h-3.5" /> Needs Attention
                        </span>
                      )}
                      {!isTopper && !isFailing && (
                        <span className="text-slate-400 font-semibold text-xs">On Track</span>
                      )}
                    </td>

                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}