"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { AddStudentSheet } from "./AddStudentSheet";
import { StudentDirectoryTable } from "./StudentDirectoryTable";
import type { StudentWorkspace } from "../../lib/validations/students";

type StudentsWorkspaceProps = {
  workspace: StudentWorkspace;
};

export function StudentsWorkspace({ workspace }: StudentsWorkspaceProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2 border-b border-gray-300 bg-white shrink-0 flex items-center justify-between">
        <h2 className="text-[17px] text-black font-normal flex items-center gap-2">
          <Users className="w-5 h-5 text-[#0055a5]" />
          Student Master Directory
        </h2>
        <div className="text-[12px] text-gray-600 font-bold uppercase tracking-wider">
          {workspace.instituteName} • {workspace.branchName}
        </div>
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f5f5f5] border-b border-gray-300 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4 text-[13px] text-gray-700 font-bold">
          Total Active Records: <span className="text-[#0055a5] text-[15px]">{workspace.activeCount}</span>
        </div>

        <button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 bg-[#0055a5] border border-[#004080] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#004080] transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
          Add Student
        </button>
      </div>

      {/* 3. DATA TABLE AREA */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <StudentDirectoryTable students={workspace.students} />
      </div>

      {/* 4. MODAL/SHEET (Passing the corrected props) */}
      <AddStudentSheet 
        open={open} 
        onOpenChange={setOpen} 
        subjects={workspace.subjects} 
      />
    </div>
  );
}