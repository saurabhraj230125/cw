"use client";

import { useState } from "react";
import { Download, Filter, BarChart3, TrendingUp, CalendarDays } from "lucide-react";

// MOCK DATA: Dense ERP Reporting Data
const monthlyReport = [
  { month: "August 2026", admissions: 42, revenue: "₹3,45,000", expenses: "₹85,000", profit: "₹2,60,000", growth: "+12.5%" },
  { month: "July 2026", admissions: 85, revenue: "₹6,10,000", expenses: "₹1,12,000", profit: "₹4,98,000", growth: "+45.2%" },
  { month: "June 2026", admissions: 24, revenue: "₹2,15,000", expenses: "₹78,000", profit: "₹1,37,000", growth: "-5.4%" },
  { month: "May 2026", admissions: 110, revenue: "₹8,50,000", expenses: "₹1,45,000", profit: "₹7,05,000", growth: "+88.0%" },
];

const batchPerformance = [
  { batch: "Class 12 PCM (Target 2027)", totalStudents: 145, avgAttendance: "92.4%", testsConducted: 8, avgScore: "68.5%", status: "EXCELLENT" },
  { batch: "NEET Achievers Batch", totalStudents: 210, avgAttendance: "88.1%", testsConducted: 12, avgScore: "74.2%", status: "EXCELLENT" },
  { batch: "Class 11 Commerce", totalStudents: 64, avgAttendance: "76.5%", testsConducted: 4, avgScore: "52.8%", status: "NEEDS ATTENTION" },
  { batch: "Class 10 Foundation", totalStudents: 92, avgAttendance: "85.0%", testsConducted: 6, avgScore: "61.0%", status: "AVERAGE" },
];

export default function AnalyticsReportsPage() {
  const [reportYear, setReportYear] = useState("2026-27");

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[18px] text-gray-900 font-normal flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#0055a5]" /> Enterprise Analytics & Reports
        </h2>
      </div>

      {/* 2. DENSE STATUS BAR */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white flex flex-wrap gap-x-10 gap-y-2 text-[13px] font-bold shrink-0">
        <span className="text-[#0055a5]">YTD Revenue: ₹20,20,000</span>
        <span className="text-[#008000]">YTD Admissions: 261</span>
        <span className="text-[#800080]">Overall Attendance: 87.2%</span>
      </div>

      {/* 3. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-bold text-gray-900 uppercase">Financial Year:</label>
          <select 
            value={reportYear}
            onChange={(e) => setReportYear(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 bg-white text-[13px] text-gray-700 focus:outline-none focus:border-[#0055a5] shadow-inner cursor-pointer"
          >
            <option value="2026-27">FY 2026-27</option>
            <option value="2025-26">FY 2025-26</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-[#f5f5f5] border border-gray-400 text-gray-800 px-4 py-1.5 text-[13px] font-bold hover:bg-gray-200 transition-colors shadow-sm">
            <Filter className="h-4 w-4" /> Advanced Filter
          </button>
          <button className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors shadow-sm">
            <Download className="h-4 w-4" strokeWidth={2.5} /> Export Complete Ledger (CSV)
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 bg-white overflow-auto space-y-6">
        
        {/* REPORT TABLE 1: Financial & Admissions */}
        <div>
          <h3 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> Monthly Collection & Admission Matrix
          </h3>
          <div className="border border-gray-400 min-w-max">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[13px] font-bold">
                <tr>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Month</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">New Admissions</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right">Gross Revenue</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right">Operating Expenses</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right">Net Profit</th>
                  <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">MoM Growth</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[13px] text-gray-800">
                {monthlyReport.map((row, idx) => (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-gray-300 hover:bg-[#eef5fa]`}>
                    <td className="py-2 px-3 border-r border-gray-300 font-bold">{row.month}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-[#0055a5]">{row.admissions}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold text-[#008000]">{row.revenue}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold text-[#cc0000]">{row.expenses}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold">{row.profit}</td>
                    <td className={`py-2 px-3 text-center font-bold ${row.growth.startsWith('+') ? 'text-[#008000]' : 'text-[#cc0000]'}`}>
                      {row.growth}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* REPORT TABLE 2: Academic Performance */}
        <div>
          <h3 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" /> Batch-wise Academic Ledger
          </h3>
          <div className="border border-gray-400 min-w-max">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gradient-to-b from-[#666666] via-[#4d4d4d] to-[#333333] text-white text-[13px] font-bold">
                <tr>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Target Batch</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Enrolled</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Avg Attendance</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Tests Conducted</th>
                  <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Avg Test Score</th>
                  <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Academic Status</th>
                </tr>
              </thead>
              <tbody className="bg-white text-[13px] text-gray-800">
                {batchPerformance.map((row, idx) => (
                  <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-gray-300 hover:bg-[#eef5fa]`}>
                    <td className="py-2 px-3 border-r border-gray-300 font-bold">{row.batch}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center">{row.totalStudents}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-[#0055a5]">{row.avgAttendance}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center">{row.testsConducted}</td>
                    <td className="py-2 px-3 border-r border-gray-300 text-center font-bold">{row.avgScore}</td>
                    <td className={`py-2 px-3 text-center font-bold uppercase ${
                      row.status === 'EXCELLENT' ? 'text-[#008000]' : 
                      row.status === 'NEEDS ATTENTION' ? 'text-[#cc0000]' : 'text-[#e65100]'
                    }`}>
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}