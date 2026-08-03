"use client";

import { useState } from "react";
import { Plus, Search, Download, Trash2, Share2, FileText } from "lucide-react";

// MOCK DATA
const mockMaterials = [
  { id: "MAT-01", type: "PDF", title: "Newton's Laws of Motion - Theory Notes", course: "Class 12th Physics", subject: "Physics", size: "2.4 MB", date: "28 Jul 2026" },
  { id: "MAT-02", type: "DPP", title: "Daily Practice Problem #12 - Electrostatics", course: "Class 12th Physics", subject: "Physics", size: "1.1 MB", date: "28 Jul 2026" },
  { id: "MAT-03", type: "PDF", title: "Thermodynamics - Important Derivations", course: "Class 11th Physics", subject: "Physics", size: "3.8 MB", date: "25 Jul 2026" },
  { id: "MAT-04", type: "DPP", title: "DPP #08 - Trigonometry Basics", course: "Class 11th Maths", subject: "Mathematics", size: "1.5 MB", date: "24 Jul 2026" },
  { id: "MAT-05", type: "PDF", title: "Biomolecules - Unit Notes", course: "Medical Achievers", subject: "Biology", size: "4.2 MB", date: "22 Jul 2026" },
];

export default function StudyMaterialsPage() {
  const [activeType, setActiveType] = useState("All Types");

  const filteredMaterials = mockMaterials.filter(mat => 
    activeType === "All Types" || mat.type === activeType
  );

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[18px] text-gray-900 font-normal">Study Material & DPP Repository</h2>
      </div>

      {/* 2. DENSE STATUS BAR (White background, specific text colors) */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white flex flex-wrap gap-x-10 gap-y-2 text-[13px] font-bold shrink-0">
        <span className="text-[#0066cc]">Total Files: 48</span>
        <span className="text-[#008000]">Downloads Today: 128</span>
        <span className="text-[#cc0000]">Storage Used: 1.4 GB / 10 GB</span>
      </div>

      {/* 3. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0">
        
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-bold text-gray-900 uppercase">Document Type:</label>
          <select 
            value={activeType}
            onChange={(e) => setActiveType(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 bg-white text-[13px] text-gray-700 focus:outline-none focus:border-[#0055a5] shadow-inner w-48 cursor-pointer"
          >
            <option value="All Types">All Types</option>
            <option value="PDF">PDF</option>
            <option value="DPP">DPP</option>
          </select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search file name..." 
              className="pl-8 pr-3 py-1.5 w-64 border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-inner placeholder:text-gray-400"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors shadow-sm">
            <Plus className="h-4 w-4" strokeWidth={3} /> Upload Material
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
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-24 text-center">
                  Doc ID
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-24 text-center">
                  Type
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
                  Document Title
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-64">
                  Assigned Batch
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-24 text-center">
                  Size
                </th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-32 text-center">
                  Upload Date
                </th>
                <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-40">
                  Action
                </th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[13px] text-gray-800">
              {filteredMaterials.map((file, index) => (
                <tr 
                  key={file.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                >
                  <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-black">
                    {file.id}
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300 text-center font-bold text-[#cc0000]">
                    {file.type}
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300 font-semibold flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400 shrink-0" /> <span className="text-gray-800">{file.title}</span>
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300 text-gray-700">
                    {file.course} <span className="text-gray-400 font-normal">({file.subject})</span>
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300 text-center text-gray-500">
                    {file.size}
                  </td>
                  <td className="py-2 px-3 border-r border-gray-300 text-center text-gray-500">
                    {file.date}
                  </td>
                  <td className="py-2 px-3 text-center flex items-center justify-center gap-2 text-[12px] font-semibold">
                    <button className="text-[#0066cc] hover:underline flex items-center gap-1" title="Download">
                      <Download className="w-3.5 h-3.5" /> DL
                    </button>
                    <span className="text-gray-300 font-light">|</span>
                    <button className="text-[#008000] hover:underline flex items-center gap-1" title="Share">
                      <Share2 className="w-3.5 h-3.5" /> Shr
                    </button>
                    <span className="text-gray-300 font-light">|</span>
                    <button className="text-[#cc0000] hover:underline flex items-center gap-1" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" /> Del
                    </button>
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