"use client";

import { useState } from "react";
import { Plus, Search, BarChart3, Edit2, PlayCircle } from "lucide-react";

// MOCK DATA
const mockTests = [
  { id: "TEST-092", title: "JEE Advanced Full Syllabus Mock - 1", batch: "Target 2027", duration: "180 mins", marks: 360, questions: 90, date: "05 Aug 2026", status: "UPCOMING", type: "Objective (CBT)" },
  { id: "TEST-091", title: "NEET Biology - Human Physiology", batch: "Medical Achievers", duration: "45 mins", marks: 180, questions: 45, date: "Today, 10:00 AM", status: "ACTIVE", type: "Objective (CBT)" },
  { id: "TEST-090", title: "Physics Subjective - Thermodynamics", batch: "Class 11th Physics", duration: "90 mins", marks: 50, questions: 10, date: "22 Jul 2026", status: "COMPLETED", type: "Subjective" },
  { id: "TEST-089", title: "Maths DPP Quiz - Integration", batch: "Class 12th Maths", duration: "30 mins", marks: 40, questions: 10, date: "18 Jul 2026", status: "COMPLETED", type: "Objective (CBT)" },
];

export default function OnlineTestsPage() {
  const [activeTab, setActiveTab] = useState("All Tests");

  const filteredTests = mockTests.filter(test => 
    activeTab === "All Tests" || test.status === activeTab.toUpperCase()
  );

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[18px] text-gray-900 font-normal">Online Assessment & Test Master</h2>
      </div>

      {/* 2. DENSE STATUS BAR (White background, specific text colors) */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white flex flex-wrap gap-x-10 gap-y-2 text-[13px] font-bold shrink-0">
        <span className="text-[#008000]">Active Tests: 1 (42 Live Students)</span>
        <span className="text-[#0066cc]">Total Questions Bank: 1,248 MCQs</span>
        <span className="text-[#800080]">Avg Institute Score: 68.4%</span>
      </div>

      {/* 3. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0">
        
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-bold text-gray-900 uppercase">Status Filter:</label>
          <select 
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 bg-white text-[13px] text-gray-700 focus:outline-none focus:border-[#0055a5] shadow-inner w-48 cursor-pointer"
          >
            <option value="All Tests">All Tests</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search Test ID..." 
              className="pl-8 pr-3 py-1.5 w-64 border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-inner placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors shadow-sm">
            <Plus className="h-4 w-4" strokeWidth={3} /> Create Assessment
          </button>
        </div>
      </div>

      {/* 4. CLASSIC ERP TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-300 min-w-max">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[13px] font-bold">
              <tr>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-28 text-center">
                  Test ID
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Assessment Title
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-56">
                  Target Batch
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-32 text-center">
                  Metrics
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-40 text-center">
                  Schedule Date
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-32 text-center">
                  Status
                </th>
                <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-36">
                  Action
                </th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[13px] text-gray-800">
              {filteredTests.map((test, index) => (
                <tr 
                  key={test.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                >
                  <td className="py-2.5 px-3 border-r border-gray-300 text-center font-bold text-black align-middle">
                    {test.id}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-300 align-middle">
                    <div className="font-bold text-black leading-snug">{test.title}</div>
                    <div className="text-[12px] text-[#0066cc] mt-0.5">{test.type}</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-300 text-gray-700 align-middle">
                    {test.batch}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-300 text-center align-middle">
                    <div className="text-gray-800">{test.duration}</div>
                    <div className="text-[12px] text-gray-400 mt-0.5">{test.marks}M / {test.questions}Q</div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-300 text-center text-gray-700 align-middle">
                    {test.date}
                  </td>
                  <td className="py-2.5 px-3 border-r border-gray-300 text-center font-bold align-middle">
                    <span className={
                      test.status === 'ACTIVE' ? 'text-[#008000]' : 
                      test.status === 'UPCOMING' ? 'text-[#e65100]' : 
                      'text-[#333333]'
                    }>
                      {test.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center align-middle">
                    {test.status === 'COMPLETED' ? (
                      <button className="text-[#0066cc] hover:text-[#003399] font-bold flex items-center justify-center gap-1.5 mx-auto">
                        <BarChart3 className="w-4 h-4" /> Results
                      </button>
                    ) : test.status === 'ACTIVE' ? (
                      <button className="bg-[#008000] border border-[#006600] text-white px-3 py-1 text-[12px] font-bold hover:bg-[#006600] shadow-sm mx-auto flex items-center gap-1.5 rounded-[2px]">
                        <PlayCircle className="w-4 h-4" /> Live Monitor
                      </button>
                    ) : (
                      <button className="text-gray-600 hover:text-black font-semibold flex items-center justify-center gap-1.5 mx-auto">
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                    )}
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