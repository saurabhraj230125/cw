"use client";

import { useState } from "react";
import { Plus, Search, MoreVertical, ChevronLeft } from "lucide-react";

const allSubjects = ["Physics", "Chemistry", "Biology", "Maths", "English", "Science", "History"];

export default function CoursesMasterPage() {
  const [isCreating, setIsCreating] = useState(false);
  
  // Dual Listbox State
  const [availableSubjects, setAvailableSubjects] = useState(allSubjects);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const handleSelectSubject = (sub: string) => {
    setAvailableSubjects(availableSubjects.filter(s => s !== sub));
    setSelectedSubjects([...selectedSubjects, sub]);
  };

  const handleRemoveSubject = (sub: string) => {
    setSelectedSubjects(selectedSubjects.filter(s => s !== sub));
    setAvailableSubjects([...availableSubjects, sub]);
  };

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col">
      {/* HEADER */}
      <div className="px-6 py-3 border-b border-gray-300 bg-white shrink-0 flex items-center justify-between">
        <h2 className="text-[20px] text-gray-800 font-normal">
          {isCreating ? "New Course" : "Courses (Future Q Academy)"}
        </h2>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[#0066cc] hover:bg-[#0055a5] text-white px-4 py-1.5 text-[13px] font-bold rounded-[2px] flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Course
          </button>
        )}
      </div>

      <div className="flex-1 p-6 flex gap-6">
        
        {/* MAIN CONTENT AREA */}
        <div className="flex-1">
          {!isCreating ? (
            /* LIST VIEW (image_4b1551.png) */
            <>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="Enter course name to filter ..." 
                  className="w-full border border-[#cccccc] p-2 text-[13px] focus:border-[#0055a5] outline-none shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-3 text-[12px] font-bold text-gray-600 mb-2 px-2">
                <span>Select: <a href="#" className="text-[#0066cc] hover:underline">All</a> | <a href="#" className="text-[#0066cc] hover:underline">None</a></span>
                <span className="bg-gray-500 text-white px-1.5 py-0.5 rounded-[2px]">2 courses</span>
              </div>

              <div className="border-t border-gray-300">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-[#f9f9f9] group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-3.5 h-3.5" />
                    <span className="text-[14px] text-gray-800">tsete</span>
                  </div>
                  <div className="flex items-center gap-4 text-[13px]">
                    <span>Rs. 1,000</span>
                    <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border-b border-gray-200 hover:bg-[#f9f9f9] group">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-3.5 h-3.5" />
                    <span className="text-[14px] text-white bg-[#0066cc] px-1 selection-highlight">10th Std</span>
                  </div>
                  <div className="flex items-center gap-4 text-[13px]">
                    <span>Rs. 15,000</span>
                    <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* CREATE VIEW (image_4b15af.png & image_4b1571.png) */
            <div className="max-w-3xl">
              <button onClick={() => setIsCreating(false)} className="text-[#0066cc] hover:underline text-[13px] font-bold flex items-center gap-1 mb-6">
                <ChevronLeft className="w-4 h-4" /> Back to Courses
              </button>

              <h3 className="text-[18px] font-normal text-gray-700 mb-6 border-b border-gray-200 pb-2">Course Details</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <label className="w-[120px] text-right text-[13px] font-bold text-gray-700 pt-1">
                    Course Name<span className="text-[#cc0000]">*</span>
                  </label>
                  <div>
                    <input type="text" defaultValue="10th Std" className="w-[300px] border border-[#cccccc] p-1.5 text-[13px] focus:border-[#0055a5] outline-none shadow-inner" />
                    <p className="text-[11px] text-gray-500 mt-1"><strong>example:</strong> XI Sci. + XII Sci. + MH-CET</p>
                  </div>
                </div>

                {/* DUAL LISTBOX for Subjects */}
                <div className="flex items-start gap-4">
                  <label className="w-[120px] text-right text-[13px] font-bold text-gray-700 pt-1">
                    Subjects<span className="text-[#cc0000]">*</span>
                  </label>
                  <div className="flex gap-4">
                    {/* Available Box */}
                    <div className="w-[220px] border border-[#cccccc] shadow-sm flex flex-col h-[250px]">
                      <div className="bg-[#333333] text-white text-center text-[12px] font-bold py-1.5">Select Subjects</div>
                      <input type="text" placeholder="enter name to search" className="w-full border-b border-[#cccccc] p-1.5 text-[12px] outline-none" />
                      <div className="flex-1 overflow-auto bg-white p-1">
                        <div className="text-[11px] font-bold text-gray-400 px-2 py-1">Available</div>
                        {availableSubjects.map(sub => (
                          <div key={sub} onClick={() => handleSelectSubject(sub)} className="px-2 py-1 text-[13px] text-gray-700 hover:bg-[#eef5fa] cursor-pointer">
                            {sub}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Selected Box */}
                    <div className="w-[220px] border border-[#cccccc] shadow-sm flex flex-col h-[250px]">
                      <div className="bg-[#333333] text-white text-center text-[12px] font-bold py-1.5">Selected Subjects</div>
                      <input type="text" placeholder="enter name to search" className="w-full border-b border-[#cccccc] p-1.5 text-[12px] outline-none" />
                      <div className="flex-1 overflow-auto bg-white p-1">
                        <div className="text-[11px] font-bold text-gray-400 px-2 py-1">10th Std</div>
                        {selectedSubjects.map(sub => (
                          <div key={sub} onClick={() => handleRemoveSubject(sub)} className="px-2 py-1 text-[13px] text-gray-700 hover:bg-[#fff0f0] cursor-pointer">
                            {sub}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Fees */}
                <div className="flex items-start gap-4 pt-4">
                  <label className="w-[120px] text-right text-[13px] font-bold text-gray-700 pt-1">
                    Course Fees<span className="text-[#cc0000]">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="bg-[#eeeeee] border border-[#cccccc] border-r-0 px-2 py-1.5 text-[13px] text-gray-600 font-bold">Rs.</span>
                    <input type="number" defaultValue="15000" className="w-[150px] border border-[#cccccc] p-1.5 text-[13px] focus:border-[#0055a5] outline-none shadow-inner" />
                  </div>
                </div>

                <div className="pl-[136px] flex gap-2 pt-4">
                  <button className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-5 py-1.5 text-[13px] font-bold rounded-[2px] shadow-sm">Save</button>
                  <button className="bg-[#5bc0de] hover:bg-[#46b8da] text-white px-5 py-1.5 text-[13px] font-bold rounded-[2px] shadow-sm">Save & Add Another</button>
                  <button onClick={() => setIsCreating(false)} className="bg-white border border-[#cccccc] text-gray-700 px-5 py-1.5 text-[13px] font-bold rounded-[2px] hover:bg-gray-50 shadow-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (Filters & Tips) */}
        <div className="w-[250px] shrink-0 border-l border-gray-200 pl-6 hidden md:block">
          {!isCreating ? (
            <>
              <h3 className="text-[18px] text-gray-700 font-normal mb-4">Filters</h3>
              <div className="mb-4">
                <label className="block text-[13px] font-bold text-gray-700 mb-1">Show</label>
                <div className="flex gap-1">
                  <span className="bg-gray-500 text-white px-2 py-0.5 text-[11px] rounded-[2px] cursor-pointer">All</span>
                  <span className="bg-[#5cb85c] text-white px-2 py-0.5 text-[11px] rounded-[2px] cursor-pointer">Active</span>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 text-[11px] rounded-[2px] cursor-pointer">Archived</span>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-1">By standard:</label>
                <select className="w-full border border-[#cccccc] p-1.5 text-[13px] outline-none">
                  <option>Select a standard</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-[18px] text-gray-700 font-normal mb-4">Tips</h3>
              <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
                You can <strong>add multiple standards</strong> from standards page.
              </p>
              <p className="text-[12px] text-gray-500 leading-relaxed">
                You can also permanently delete standards which are not relevant to your organization.
              </p>
            </>
          )}
        </div>

      </div>
    </main>
  );
}