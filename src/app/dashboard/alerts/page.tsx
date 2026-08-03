"use client";

import { useState } from "react";
import { Bell, Search, AlertTriangle, CheckSquare, MessageCircle, XCircle } from "lucide-react";

// MOCK DATA: Strict Operational Alerts
const mockAlerts = [
  { id: "ALT-8091", severity: "CRITICAL", category: "Fee Default", description: "12 students in NEET Achievers batch have crossed the 15-day overdue limit for August Installments.", date: "Today, 08:30 AM", target: "NEET Achievers" },
  { id: "ALT-8090", severity: "WARNING", category: "Attendance", description: "Rahul Sharma (Roll: 21) has been absent for 4 consecutive days without prior leave application.", date: "Today, 09:15 AM", target: "Rahul Sharma" },
  { id: "ALT-8089", severity: "INFO", category: "System", description: "Automated Daily Database Backup completed successfully. Cloud sync verified.", date: "Today, 02:00 AM", target: "System Core" },
  { id: "ALT-8088", severity: "CRITICAL", category: "Academic", description: "Class 11 Commerce syllabus is lagging by 2 weeks behind the master schedule.", date: "02 Aug 2026", target: "Class 11 Commerce" },
  { id: "ALT-8087", severity: "WARNING", category: "Storage", description: "Study Material Cloud Storage is at 85% capacity. Consider upgrading plan.", date: "01 Aug 2026", target: "Admin" },
];

export default function SystemAlertsPage() {
  const [severityFilter, setSeverityFilter] = useState("All");

  const filteredAlerts = mockAlerts.filter(alt => 
    severityFilter === "All" || alt.severity === severityFilter
  );

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[18px] text-gray-900 font-normal flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#cc0000]" /> Operational System Alerts
        </h2>
      </div>

      {/* 2. DENSE STATUS BAR */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white flex flex-wrap gap-x-10 gap-y-2 text-[13px] font-bold shrink-0">
        <span className="text-[#cc0000]">Critical Issues: 2</span>
        <span className="text-[#e65100]">Active Warnings: 2</span>
        <span className="text-[#0055a5]">System Info: 1</span>
      </div>

      {/* 3. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-bold text-gray-900 uppercase">Severity Filter:</label>
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 bg-white text-[13px] text-gray-700 focus:outline-none focus:border-[#0055a5] shadow-inner cursor-pointer w-40"
          >
            <option value="All">All Alerts</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search alert description..." 
              className="pl-8 pr-3 py-1.5 w-64 border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-inner placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-[#008000] border border-[#006600] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#006600] transition-colors shadow-sm">
            <CheckSquare className="h-4 w-4" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* 4. CLASSIC ERP ALERTS TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-300 min-w-max">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[13px] font-bold">
              <tr>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-24 text-center">Alert ID</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-28 text-center">Severity</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-36">Category</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Alert Description & Context</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-48">Target Entity</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-36 text-center">Timestamp</th>
                <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-36">Action</th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[13px] text-gray-800">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center border-t border-gray-300 text-gray-500 font-bold">
                    No active system alerts.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <tr 
                    key={alert.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                  >
                    <td className="py-2.5 px-3 border-r border-gray-300 text-center font-bold text-gray-600">
                      {alert.id}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 text-center font-bold">
                      <div className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-[2px] text-[11px] uppercase tracking-wider ${
                        alert.severity === 'CRITICAL' ? 'bg-[#ffebee] text-[#cc0000] border-[#ffcdd2]' :
                        alert.severity === 'WARNING' ? 'bg-[#fff8e1] text-[#e65100] border-[#ffecb3]' :
                        'bg-[#e3f2fd] text-[#0055a5] border-[#bbdefb]'
                      }`}>
                        {alert.severity === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                        {alert.severity}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-bold text-[#0055a5]">
                      {alert.category}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 leading-snug">
                      {alert.description}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-bold text-gray-700">
                      {alert.target}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 text-center text-gray-500">
                      {alert.date}
                    </td>
                    <td className="py-2.5 px-3 text-center flex items-center justify-center gap-2">
                      {alert.severity === 'CRITICAL' || alert.severity === 'WARNING' ? (
                        <>
                          <button className="text-[#0066cc] hover:underline flex items-center gap-1 font-bold" title="Take Action">
                            <MessageCircle className="w-3.5 h-3.5" /> Action
                          </button>
                          <span className="text-gray-300 font-light">|</span>
                          <button className="text-[#008000] hover:underline flex items-center gap-1 font-bold" title="Resolve Alert">
                            <CheckSquare className="w-3.5 h-3.5" /> Clear
                          </button>
                        </>
                      ) : (
                        <button className="text-gray-500 hover:text-black hover:underline flex items-center gap-1 font-bold mx-auto" title="Dismiss Info">
                          <XCircle className="w-3.5 h-3.5" /> Dismiss
                        </button>
                      )}
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