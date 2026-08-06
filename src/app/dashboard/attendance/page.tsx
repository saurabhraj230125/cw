"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, Save, AlertTriangle, ChevronLeft, ChevronRight, 
  CheckCircle2, MessageSquare, Loader2, RefreshCw, Users
} from "lucide-react";

// CRITICAL FIX: Corrected relative path (2 levels up)
import { getActiveBatches, getAttendanceRoster, saveAttendanceAction } from "../../actions/attendance-actions";

// DEEP TYPESCRIPT FIX: Explicitly defining the data structures to remove 'any'
export type Status = "present" | "absent" | "late";

export interface RosterStudent {
  id: string;
  roll: string;
  name: string;
  status: Status | null;
}

export default function AttendancePage() {
  // --- CORE STATE ---
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [batches, setBatches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // FIXED: Using the strict interface instead of any[]
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, Status>>({});
  
  // --- UI/UX STATE ---
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false); 
  const [sendSms, setSendSms] = useState<boolean>(true);

  // --- INITIALIZATION: FETCH BATCHES ---
  useEffect(() => {
    async function init() {
      try {
        const fetchedBatches = await getActiveBatches();
        setBatches(fetchedBatches);
        if (fetchedBatches.length > 0) {
          setSelectedBatch(fetchedBatches[0]); 
        }
      } catch (error) {
        console.error("Failed to initialize batches", error);
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, []);

  // --- DATA FETCHING: LOAD STUDENTS & PAST ATTENDANCE ---
  useEffect(() => {
    if (!selectedBatch) return;

    let isMounted = true;
    
    async function loadRoster() {
      setIsLoading(true);
      try {
        const data = await getAttendanceRoster(selectedBatch, selectedDate);
        
        if (isMounted) {
          setStudents(data);
          
          // Auto-populate state with previously saved attendance (if any)
          const savedState: Record<string, Status> = {};
          data.forEach((stu: RosterStudent) => {
            if (stu.status) savedState[stu.id] = stu.status;
          });
          
          setAttendanceData(savedState);
          setIsDirty(false); 
        }
      } catch (error) {
        console.error("Failed to load roster", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRoster();

    return () => { isMounted = false; };
  }, [selectedBatch, selectedDate]); 

  // --- HANDLERS ---
  const toggleStatus = (studentId: string, status: Status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    setIsDirty(true);
  };

  const markAllPresent = () => {
    const allPresent: Record<string, Status> = {};
    students.forEach((s: RosterStudent) => {
      allPresent[s.id] = "present";
    });
    setAttendanceData(allPresent);
    setIsDirty(true);
  };

  const handleDateChange = (days: number) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved attendance marks. Discard changes?")) return;
    }
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleBatchChange = (newBatch: string) => {
    if (isDirty) {
      if (!window.confirm("You have unsaved attendance marks. Discard changes?")) return;
    }
    setSelectedBatch(newBatch);
  };

  const handleSave = async () => {
    if (Object.keys(attendanceData).length === 0) {
      alert("No attendance data marked.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await saveAttendanceAction(selectedBatch, selectedDate, attendanceData);
      if (res.success) {
        setIsDirty(false);
        alert(`Attendance permanently saved for ${selectedDate}.${sendSms ? "\n\nSMS Alerts queued for absentees." : ""}`);
      }
    } catch (error: unknown) {
      // TypeScript strict error handling fix
      const err = error as Error;
      alert(err.message || "Failed to save attendance.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DERIVED DATA & FILTERS ---
  const filteredStudents = useMemo(() => {
    return students.filter((s: RosterStudent) => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.roll.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [students, searchQuery]);

  const summary = useMemo(() => {
    const counts = { present: 0, absent: 0, late: 0, unmarked: 0 };
    students.forEach((s: RosterStudent) => {
      const status = attendanceData[s.id];
      if (status) counts[status]++;
      else counts.unmarked++;
    });
    return counts;
  }, [attendanceData, students]);

  // INITIAL LOADING UI
  if (isInitializing) {
    return (
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <p className="text-gray-500 font-bold flex items-center gap-2 text-erp-lg">
          <Loader2 className="w-5 h-5 animate-spin text-cw-blue" /> Initializing Attendance Module...
        </p>
      </main>
    );
  }

  // EMPTY STATE: NO BATCHES FOUND
  if (batches.length === 0) {
    return (
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <div className="bg-white p-8 rounded-erp border border-erp-border shadow-sm text-center max-w-md">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-erp-lg font-bold text-gray-800 mb-2">No Active Batches</h2>
          <p className="text-erp-base text-gray-600">You must complete a new student admission and assign them to a batch before taking attendance.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-erp-bg flex flex-col pb-10">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex justify-between items-center z-10 shadow-sm">
        <h2 className="text-[18px] text-gray-900 font-bold uppercase tracking-wide">
          Master Attendance Register
        </h2>
        {isDirty && <span className="text-cw-red text-erp-sm font-bold flex items-center gap-1.5 px-3 py-1 bg-pastel-redBg rounded-erp border border-pastel-redBorder animate-pulse"><AlertTriangle className="w-3.5 h-3.5" /> Unsaved Changes</span>}
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="px-6 py-3 bg-white border-b border-erp-border flex flex-wrap items-center gap-6 shrink-0 z-10 shadow-sm">
        
        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Batch Master:</label>
          <select 
            value={selectedBatch}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="w-[250px] font-bold text-cw-blueDark border border-erp-border px-2 py-1.5 focus:border-cw-blue outline-none cursor-pointer"
          >
            {batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Strict Date Navigator */}
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Ledger Date:</label>
          <div className="flex items-center border border-erp-border bg-white shadow-sm h-[32px]">
            <button onClick={() => handleDateChange(-1)} className="px-3 h-full hover:bg-gray-100 border-r border-erp-border transition-colors flex items-center justify-center">
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => {
                if (isDirty && !window.confirm("Discard unsaved marks?")) return;
                setSelectedDate(e.target.value);
              }}
              className="border-none shadow-none h-full w-[140px] text-center font-bold text-gray-800 outline-none focus:ring-0 cursor-pointer"
            />
            <button onClick={() => handleDateChange(1)} className="px-3 h-full hover:bg-gray-100 border-l border-erp-border transition-colors flex items-center justify-center">
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Actions (Right Aligned) */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search roster..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-[220px] border border-erp-border focus:border-cw-blue outline-none text-erp-sm font-medium"
            />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving || isLoading || !isDirty}
            className="flex items-center gap-1.5 bg-cw-green border border-[#006600] text-white px-6 py-1.5 text-erp-md font-bold hover:bg-[#005000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-erp-button rounded-erp"
          >
            {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            {isSaving ? "Writing to DB..." : "Save Register"}
          </button>
        </div>
      </div>

      {/* 3. STATUS BAR & BULK ACTIONS */}
      <div className="px-6 py-2.5 bg-erp-header border-b border-erp-border flex justify-between items-center text-erp-base shrink-0">
        <div className="flex gap-6 font-bold text-sm tracking-wide">
          <span className="text-gray-700 bg-white px-2 border border-erp-border rounded-sm">Total: {students.length}</span>
          <span className="text-cw-green">Present: {summary.present}</span>
          <span className="text-cw-red">Absent: {summary.absent}</span>
          <span className="text-[#f57f17]">Late: {summary.late}</span>
          {summary.unmarked > 0 && <span className="text-gray-500 animate-pulse">Unmarked: {summary.unmarked}</span>}
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-erp-sm font-bold text-gray-700 cursor-pointer">
            <input type="checkbox" checked={sendSms} onChange={() => setSendSms(!sendSms)} className="w-3.5 h-3.5 mt-0.5 accent-cw-blue" />
            <MessageSquare className="w-3.5 h-3.5 text-cw-blue" /> Auto-SMS Absentees
          </label>
          <span className="text-gray-300">|</span>
          <button onClick={markAllPresent} className="text-cw-green hover:underline font-bold text-erp-sm flex items-center gap-1 bg-white border border-erp-border px-2 py-0.5 rounded-sm shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> Mark All Present
          </button>
        </div>
      </div>

      {/* 4. CLASSIC ERP TABLE DATA GRID */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="border border-erp-border bg-white shadow-sm rounded-erp max-w-[1200px] mx-auto">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-20 text-gray-500">
              <RefreshCw className="w-8 h-8 animate-spin mb-4 text-cw-blue" />
              <p className="font-bold">Fetching secure database roster...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-erp-border text-erp-sm text-gray-600 uppercase tracking-wide">
                  <th className="py-3 px-6 w-24 text-center font-bold">Roll No</th>
                  <th className="py-3 px-6 w-[350px] font-bold">Student Name</th>
                  <th className="py-3 px-6 text-center font-bold">Attendance Matrix</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="p-8 text-center font-bold text-gray-500 italic">
                      No students found in {selectedBatch} for this date.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`border-b border-erp-borderLight ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'} hover:bg-pastel-blueBg transition-colors`}
                    >
                      <td className="py-3 px-6 text-center font-bold text-gray-800">{student.roll}</td>
                      
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-cw-blueDark text-erp-base">{student.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">{student.id}</span>
                        </div>
                      </td>
                      
                      {/* Segmented Control for Attendance Marking */}
                      <td className="py-3 px-6 text-center">
                        <div className="inline-flex shadow-sm border border-erp-border rounded-[3px] overflow-hidden">
                          
                          <button 
                            onClick={() => toggleStatus(student.id, "present")}
                            className={`px-6 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-colors ${
                              attendanceData[student.id] === "present" 
                                ? "bg-cw-green text-white" 
                                : "bg-white text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            Present
                          </button>
                          
                          <button 
                            onClick={() => toggleStatus(student.id, "absent")}
                            className={`px-6 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-colors ${
                              attendanceData[student.id] === "absent" 
                                ? "bg-cw-red text-white" 
                                : "bg-white text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            Absent
                          </button>
                          
                          <button 
                            onClick={() => toggleStatus(student.id, "late")}
                            className={`px-6 py-1.5 text-erp-sm font-bold uppercase transition-colors ${
                              attendanceData[student.id] === "late" 
                                ? "bg-[#f57f17] text-white" 
                                : "bg-white text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            Late
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}