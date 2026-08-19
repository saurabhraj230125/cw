"use client";

import { useEffect, useState } from "react";
import { Download, Filter, BarChart3, TrendingUp, CalendarDays, Loader2, Award } from "lucide-react";
import { getMasterAnalytics } from "../../actions/analytics-actions";

// 🚨 DEEP FIX: Imported the Master Security Gate
import ProFeatureGate from "../../../components/ProFeatureGate";

export default function AnalyticsReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [reportYear, setReportYear] = useState("2026-27");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const result = await getMasterAnalytics();
        setData(result);
      } catch (error) {
        console.error("Failed to load analytics");
      } finally {
        setIsLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const handleExport = () => {
    alert("Exporting ledger data to CSV...");
    // Future integration for actual CSV export
  };

  // Derive Status for Batches based on real percentage
  const getAcademicStatus = (percentage: number) => {
    if (percentage >= 75) return "EXCELLENT";
    if (percentage >= 50) return "AVERAGE";
    return "NEEDS ATTENTION";
  };

  return (
    // 🚨 WRAPPED THE ENTIRE PAGE IN THE FEATURE GATE
    <ProFeatureGate featureName="Enterprise Analytics & Reports">
      
      {/* Handle Loading State Inside the Gate */}
      {isLoading ? (
        <div className="min-h-screen bg-white flex justify-center items-center flex-col gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-[#0055a5]" />
          <span className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Generating Ledger...</span>
        </div>
      ) : !data ? null : (
        
        <main className="min-h-screen bg-white font-sans flex flex-col selection:bg-[#0055a5] selection:text-white">
          
          {/* 1. CLASSIC SUB-HEADER */}
          <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0 flex justify-between items-center">
            <h2 className="text-[18px] text-gray-900 font-normal flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#0055a5]" /> Enterprise Analytics & Reports
            </h2>
            <span className="text-[11px] font-bold text-[#008000] bg-[#e6ffe6] border border-[#b3ffb3] px-2 py-0.5 uppercase tracking-wide">
              Live Data Active
            </span>
          </div>

          {/* 2. DENSE STATUS BAR (Using Real KPIs) */}
          <div className="px-4 py-2.5 border-b border-gray-300 bg-[#f9f9f9] flex flex-wrap gap-x-10 gap-y-2 text-[13px] font-bold shrink-0">
            <span className="text-[#0055a5]">Total Active Students: {data.kpis.totalStudents}</span>
            <span className="text-[#008000]">Exams Deployed: {data.kpis.totalExams}</span>
            <span className="text-[#800080]">Total Submissions: {data.kpis.totalSubmissions}</span>
            <span className={`${data.kpis.instituteAccuracy >= 60 ? 'text-[#008000]' : 'text-[#cc0000]'}`}>
              Institute Global Accuracy: {data.kpis.instituteAccuracy}%
            </span>
          </div>

          {/* 3. FUNCTIONAL TOOLBAR */}
          <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm z-10 relative">
            <div className="flex items-center gap-2">
              <label className="text-[13px] font-bold text-gray-900 uppercase">Academic Year:</label>
              <select 
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="px-2 py-1.5 border border-gray-300 bg-white text-[13px] text-gray-700 font-bold focus:outline-none focus:border-[#0055a5] shadow-inner cursor-pointer"
              >
                <option value="2026-27">AY 2026-27</option>
                <option value="2025-26">AY 2025-26</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 bg-[#f5f5f5] border border-gray-400 text-gray-800 px-4 py-1.5 text-[13px] font-bold hover:bg-gray-200 transition-colors shadow-sm">
                <Filter className="h-4 w-4" /> Advanced Filter
              </button>
              <button onClick={handleExport} className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors shadow-sm active:scale-[0.98]">
                <Download className="h-4 w-4" strokeWidth={2.5} /> Export Complete Ledger (CSV)
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 bg-white overflow-auto space-y-6">
            
            {/* REPORT TABLE 1: Institute Hall of Fame (Top Performers Ledger) */}
            <div>
              <h3 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Institute Toppers Ledger
              </h3>
              <div className="border border-gray-400 min-w-max shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[13px] font-bold">
                    <tr>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-16">Rank</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Student Name</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Target Batch</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Exams Attempted</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right">Aggregate Score</th>
                      <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">System Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[13px] text-gray-800">
                    {data.topStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-500 font-bold italic border-b border-gray-300">No examination records found.</td>
                      </tr>
                    ) : (
                      data.topStudents.map((student: any, idx: number) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-gray-300 hover:bg-[#eef5fa]`}>
                          <td className="py-2 px-3 border-r border-gray-300 font-bold text-center text-[#0055a5]">#{idx + 1}</td>
                          <td className="py-2 px-3 border-r border-gray-300 font-bold">{student.name}</td>
                          <td className="py-2 px-3 border-r border-gray-300 uppercase">{student.batch}</td>
                          <td className="py-2 px-3 border-r border-gray-300 text-center font-bold">{student.examsTaken}</td>
                          <td className="py-2 px-3 border-r border-gray-300 text-right font-black text-[#008000]">{student.totalScore} Pts</td>
                          <td className="py-2 px-3 text-center font-bold text-[#0055a5] uppercase text-[11px]">TOP TIER</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* REPORT TABLE 2: Academic Performance */}
            <div>
              <h3 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-2">
                <CalendarDays className="w-4 h-4" /> Batch-wise Academic Ledger
              </h3>
              <div className="border border-gray-400 min-w-max shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gradient-to-b from-[#666666] via-[#4d4d4d] to-[#333333] text-white text-[13px] font-bold">
                    <tr>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Target Batch</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Avg Test Score</th>
                      <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-48">Academic Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[13px] text-gray-800">
                    {data.batchPerformance.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-4 text-center text-gray-500 font-bold italic border-b border-gray-300">No batch metrics available.</td>
                      </tr>
                    ) : (
                      data.batchPerformance.map((row: any, idx: number) => {
                        const status = getAcademicStatus(row.avgPercentage);
                        return (
                          <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-gray-300 hover:bg-[#eef5fa]`}>
                            <td className="py-2 px-3 border-r border-gray-300 font-bold uppercase">{row.name}</td>
                            <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-[#0055a5]">{row.avgPercentage}%</td>
                            <td className={`py-2 px-3 text-center font-bold uppercase ${
                              status === 'EXCELLENT' ? 'text-[#008000]' : 
                              status === 'NEEDS ATTENTION' ? 'text-[#cc0000]' : 'text-[#e65100]'
                            }`}>
                              {status}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* REPORT TABLE 3: Recent Submissions Audit Log */}
            <div>
              <h3 className="text-[14px] font-bold text-[#0055a5] uppercase tracking-wider mb-2 flex items-center gap-1.5 mt-2">
                <TrendingUp className="w-4 h-4" /> Live Exam Submissions Audit Log
              </h3>
              <div className="border border-gray-400 min-w-max shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gradient-to-b from-[#005c73] via-[#004d60] to-[#003d4d] text-white text-[13px] font-bold">
                    <tr>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-24">Attempt ID</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Student Name</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Batch</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Attempted</th>
                      <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center">Correct</th>
                      <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right">Net Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[13px] text-gray-800">
                    {data.recentAttempts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-gray-500 font-bold italic border-b border-gray-300">No recent submissions.</td>
                      </tr>
                    ) : (
                      data.recentAttempts.map((attempt: any, idx: number) => (
                        <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} border-b border-gray-300 hover:bg-[#eef5fa]`}>
                          <td className="py-2 px-3 border-r border-gray-300 text-[10px] text-gray-500 font-mono">...{attempt.id.substring(0, 8)}</td>
                          <td className="py-2 px-3 border-r border-gray-300 font-bold">{attempt.students?.full_name}</td>
                          <td className="py-2 px-3 border-r border-gray-300 uppercase">{attempt.students?.batch_id}</td>
                          <td className="py-2 px-3 border-r border-gray-300 text-center font-bold">{attempt.total_attempted}</td>
                          <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-[#008000]">{attempt.total_correct}</td>
                          <td className={`py-2 px-3 text-right font-black ${attempt.score > 0 ? 'text-[#0055a5]' : 'text-[#cc0000]'}`}>
                            {attempt.score} Pts
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </main>
      )}
    </ProFeatureGate>
  );
}