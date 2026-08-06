"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

export default function BatchesMasterPage() {
  // Simulating the view state (list vs details vs create)
  const [viewState, setViewState] = useState<"list" | "details" | "create">("details");

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      {/* TOP HEADER STATUS */}
      {viewState === "details" && (
        <div className="bg-[#dff0d8] text-[#3c763d] text-center py-1.5 text-[12px] font-bold border-b border-[#d6e9c6]">
          Batch was successfully created.
        </div>
      )}

      {/* HEADER */}
      <div className="px-6 py-3 border-b border-gray-300 bg-white shrink-0">
        <h2 className="text-[22px] text-gray-800 font-normal">
          {viewState === "create" ? "New Batch" : "Batch Students (Future Q Academy)"}
        </h2>
        {viewState === "details" && (
          <p className="text-[13px] text-gray-600 mt-1">
            <span className="font-bold text-gray-800">Name:</span> 10th Std (2026-27) &nbsp;&nbsp;&nbsp; 
            <span className="font-bold text-gray-800">Academic Year:</span> 2026-2027
          </p>
        )}
      </div>

      {viewState === "details" && (
        <div className="flex-1 bg-white">
          {/* TABS */}
          <div className="flex border-b border-[#cccccc] px-6 mt-4 gap-6">
            <div className="bg-[#0066cc] text-white px-4 py-2 text-[13px] font-bold rounded-t-[2px] cursor-pointer">Students</div>
            <div className="text-[#0066cc] px-4 py-2 text-[13px] hover:bg-gray-50 cursor-pointer">Share Videos</div>
            <div className="text-[#0066cc] px-4 py-2 text-[13px] hover:bg-gray-50 cursor-pointer">Share Documents</div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[18px] text-gray-700 font-normal">Students</h3>
              <div className="flex gap-2">
                <button className="bg-[#0066cc] hover:bg-[#0055a5] text-white px-4 py-1.5 text-[13px] font-bold rounded-[2px] shadow-sm">Add Students</button>
                <button className="bg-white border border-[#cccccc] text-gray-700 px-4 py-1.5 text-[13px] font-bold rounded-[2px] hover:bg-gray-50 flex items-center gap-1 shadow-sm">↑ Import</button>
                <button className="bg-white border border-[#cccccc] text-gray-700 px-4 py-1.5 text-[13px] font-bold rounded-[2px] hover:bg-gray-50 flex items-center gap-1 shadow-sm">↓ Export</button>
              </div>
            </div>

            {/* FILTERS & STATS */}
            <div className="border border-[#cccccc] bg-[#f9f9f9] p-3 rounded-[2px] mb-4">
              <div className="flex gap-4 mb-3">
                <select className="flex-1 border border-[#cccccc] p-1.5 text-[13px] outline-none text-gray-500">
                  <option>Select a Subject</option>
                </select>
                <input type="text" placeholder="Enter student name to filter ..." className="flex-1 border border-[#cccccc] p-1.5 text-[13px] outline-none" />
                <select className="flex-1 border border-[#cccccc] p-1.5 text-[13px] outline-none text-gray-500">
                  <option>Select a School</option>
                </select>
              </div>
              <div className="flex justify-around items-center border-t border-[#cccccc] pt-3 text-[14px] text-gray-800">
                <div className="font-bold text-center w-1/3">Total: 0</div>
                <div className="font-bold text-center w-1/3 border-l border-r border-[#cccccc]">Boys: 0</div>
                <div className="font-bold text-center w-1/3">Girls: 0</div>
              </div>
            </div>

            <div className="text-[12px] font-bold text-gray-600">
              <span>View: <a href="#" className="text-[#0066cc] hover:underline">All</a> | <span className="text-gray-800">Active</span> | <a href="#" className="text-[#0066cc] hover:underline">Archived</a></span>
            </div>
            
            {/* Empty State Table */}
            <div className="mt-4 border border-[#cccccc] p-8 text-center text-[13px] text-gray-500 font-bold bg-white">
              No students enrolled in this batch yet.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}