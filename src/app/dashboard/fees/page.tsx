"use client";

import { useState } from "react";
import { Search, Download, Plus, IndianRupee } from "lucide-react";

// MOCK DATA
const mockInvoices = [
  { 
    id: "INV-2045", 
    student: { name: "Rahul Sharma", roll: "2026-SCI-01" }, 
    month: "Aug 2026",
    subjects: [
      { name: "Class 12 Physics", fee: 1500 },
      { name: "Class 12 Math", fee: 1500 }
    ],
    financials: { total: 3000, paid: 1000, balance: 2000 }, 
    status: "Partial" 
  },
  { 
    id: "INV-2046", 
    student: { name: "Ananya Patel", roll: "2027-MED-14" }, 
    month: "Aug 2026",
    subjects: [
      { name: "NEET Target Biology", fee: 2500 },
      { name: "NEET Chemistry", fee: 2000 }
    ],
    financials: { total: 4500, paid: 4500, balance: 0 }, 
    status: "Paid" 
  },
  { 
    id: "INV-2047", 
    student: { name: "Amit Kumar", roll: "2026-COM-05" }, 
    month: "Jul 2026",
    subjects: [
      { name: "Class 11 Accounts", fee: 1200 }
    ],
    financials: { total: 1200, paid: 0, balance: 1200 }, 
    status: "Overdue" 
  },
  { 
    id: "INV-2048", 
    student: { name: "Vikram Yadav", roll: "2026-SCI-11" }, 
    month: "Aug 2026",
    subjects: [
      { name: "Class 12 Physics", fee: 1500 }
    ],
    financials: { total: 1500, paid: 1500, balance: 0 }, 
    status: "Paid" 
  },
];

export default function FeeManagementPage() {
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter logic
  const filteredInvoices = mockInvoices.filter(inv => 
    statusFilter === "All" || inv.status === statusFilter
  );

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2 border-b border-gray-300 bg-white shrink-0 flex justify-between items-center">
        <h2 className="text-[17px] text-black font-normal">Fee Ledger & Collections</h2>
      </div>

      {/* 2. DENSE FINANCIAL SUMMARY BAR */}
      <div className="px-4 py-1.5 bg-[#eef5fa] border-b border-gray-300 flex flex-wrap gap-x-8 gap-y-2 text-[12px] font-bold shrink-0">
        <span className="text-[#0055a5]">Total Expected (Aug): ₹1,42,500</span>
        <span className="text-[#008000]">Total Collected: ₹98,000</span>
        <span className="text-[#cc0000]">Overdue Balance: ₹18,500</span>
      </div>

      {/* 3. FUNCTIONAL TOOLBAR (Strict & Compact) */}
      <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0">
        
        <div className="flex items-center gap-4">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[12px] font-bold text-gray-800 uppercase">Status:</label>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2 py-1 border border-gray-400 bg-white text-[12px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] w-32"
            >
              <option value="All">All Records</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
          
          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-[12px] font-bold text-gray-800 uppercase">Subject:</label>
            <select className="px-2 py-1 border border-gray-400 bg-white text-[12px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] w-40">
              <option value="">All Subjects</option>
              <option value="physics">Class 12 Physics</option>
              <option value="neet">NEET Biology</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search roll or name..." 
              className="pl-7 pr-3 py-1 w-48 border border-gray-400 bg-white text-[12px] focus:outline-none focus:border-[#0055a5] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]"
            />
          </div>
          
          {/* Action Buttons */}
          <button className="flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f5] border border-gray-400 text-gray-700 text-[12px] font-bold hover:bg-gray-200 transition-colors shadow-sm">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-3 py-1 text-[12px] font-bold hover:bg-[#004080] transition-colors shadow-sm">
            <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Generate Bills
          </button>
        </div>
      </div>

      {/* 4. CLASSIC ERP TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-400 min-w-max">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[12px] font-bold">
              <tr>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-28">
                  Invoice No
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-56">
                  Student Details
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Subject Breakdown
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right w-24">
                  Total Bill
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right w-24">
                  Paid
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-right w-24">
                  Balance
                </th>
                <th className="py-1.5 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-24">
                  Status
                </th>
                <th className="py-1.5 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-28">
                  Action
                </th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[12px] text-gray-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center border-t border-gray-300 text-gray-500">
                    No billing records found.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice, index) => (
                  <tr 
                    key={invoice.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                  >
                    
                    {/* Invoice & Month */}
                    <td className="py-2 px-3 border-r border-gray-300 align-top">
                      <div className="font-bold text-black">{invoice.id}</div>
                      <div className="text-[11px] text-gray-500">{invoice.month}</div>
                    </td>
                    
                    {/* Student Info */}
                    <td className="py-2 px-3 border-r border-gray-300 align-top">
                      <div className="font-bold text-[#0055a5]">{invoice.student.roll}</div>
                      <div className="font-semibold">{invoice.student.name}</div>
                    </td>
                    
                    {/* Subject Breakdown (Strict Line items) */}
                    <td className="py-2 px-3 border-r border-gray-300 align-top">
                      <table className="w-full text-[11px]">
                        <tbody>
                          {invoice.subjects.map((sub, idx) => (
                            <tr key={idx}>
                              <td className="py-0.5 text-gray-700">{sub.name}</td>
                              <td className="py-0.5 text-right font-medium">₹{sub.fee}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    
                    {/* Financials - Split into explicit columns for ERP readability */}
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold align-top">
                      ₹{invoice.financials.total}
                    </td>
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold text-[#008000] align-top">
                      ₹{invoice.financials.paid}
                    </td>
                    <td className="py-2 px-3 border-r border-gray-300 text-right font-bold text-[#cc0000] align-top">
                      ₹{invoice.financials.balance}
                    </td>
                    
                    {/* Status */}
                    <td className="py-2 px-3 border-r border-gray-300 text-center font-bold uppercase align-top">
                      <span className={
                        invoice.status === 'Paid' ? 'text-[#008000]' : 
                        invoice.status === 'Partial' ? 'text-[#ff9900]' : 
                        'text-[#cc0000]'
                      }>
                        {invoice.status}
                      </span>
                    </td>
                    
                    {/* Action Links */}
                    <td className="py-2 px-3 text-center align-top">
                      {invoice.status !== 'Paid' ? (
                        <button className="flex items-center justify-center gap-1 mx-auto bg-[#008000] border border-[#006600] text-white px-2 py-0.5 text-[11px] font-bold hover:bg-[#006600] shadow-sm">
                          <IndianRupee className="w-3 h-3" /> Collect
                        </button>
                      ) : (
                        <a href="#" className="text-[#0066cc] hover:text-[#003399] hover:underline font-medium text-[11px]">
                          View Receipt
                        </a>
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