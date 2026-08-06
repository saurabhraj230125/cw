"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, Save, AlertTriangle, ChevronLeft, ChevronRight, 
  CheckCircle2, MessageSquare, Loader2, RefreshCw, Users, Info
} from "lucide-react";

// IMPORT REAL DATABASE ACTIONS
import { getActiveBatches, getAttendanceRoster, saveAttendanceAction } from "../../actions/attendance-actions";

export type Status = "present" | "absent" | "late";

export interface RosterStudent {
  id: string;
  roll: string;
  name: string;
  status: Status | null;
  batch: string;
}

export default function AttendancePage() {
  // --- CORE STATE ---
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [batches, setBatches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string>("ALL"); 
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const [students, setStudents] = useState<RosterStudent[]>([]);
  const [attendanceData, setAttendanceData] = useState<Record<string, Status>>({});
  
  // --- UI/UX STATE ---
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false); 
  const [sendSms, setSendSms] = useState<boolean>(true);

  const isAllBatchesView = selectedBatch === "ALL";

  // --- 1. INITIALIZATION: FETCH BATCHES ---
  useEffect(() => {
    async function init() {
      try {
        const fetchedBatches = await getActiveBatches();
        setBatches(["ALL", ...fetchedBatches]); 
        setSelectedBatch("ALL"); 
      } catch (error) {
        console.error("Failed to initialize batches", error);
      } finally {
        setIsInitializing(false);
      }
    }
    init();
  }, []);

  // --- 2. PREVENT ACCIDENTAL TAB CLOSURE ---
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved attendance marks. Are you sure you want to leave?";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // --- 3. DATA FETCHING: LOAD STUDENTS & PAST ATTENDANCE ---
  useEffect(() => {
    if (!selectedBatch) return;

    let isMounted = true;
    
    async function loadRoster() {
      setIsLoading(true);
      try {
        const data = await getAttendanceRoster(selectedBatch, selectedDate);
        
        if (isMounted) {
          setStudents(data);
          
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
    if (isAllBatchesView) return; // Prevent marking in ALL view to protect DB integrity
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
    setIsDirty(true);
  };

  const markAllPresent = () => {
    if (isAllBatchesView) return;
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
    if (isAllBatchesView) return; // Hard guard
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
      const err = error as Error;
      alert(err.message || "Failed to save attendance.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DERIVED DATA & FILTERS ---
  const filteredStudents = useMemo(() => {
    return students.filter((s: RosterStudent) => {
      const safeName = s.name || "";
      const safeRoll = s.roll || "";
      return safeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
             safeRoll.toLowerCase().includes(searchQuery.toLowerCase());
    });
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

  const completionPercentage = students.length === 0 ? 0 : Math.round(((students.length - summary.unmarked) / students.length) * 100);

  // --- INITIAL UI STATE ---
  if (isInitializing) {
    return (
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-cw-blue" />
          <p className="text-gray-500 font-bold text-erp-md">Initializing Attendance Module...</p>
        </div>
      </main>
    );
  }

  // --- EMPTY STATE ---
  if (batches.length <= 1) { // Only "ALL" is in the list
    return (
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <div className="bg-white p-8 rounded-erp border border-erp-border shadow-sm text-center max-w-md">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-erp-lg font-bold text-gray-800 mb-2">No Active Batches</h2>
          <p className="text-erp-base text-gray-600">You must complete a new student admission and strictly assign them to a batch before taking attendance.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-erp-bg flex flex-col pb-10">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex justify-between items-center z-10 shadow-sm">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide">
          Master Attendance Register
        </h2>
        {isDirty && (
          <span className="text-cw-red text-erp-sm font-bold flex items-center gap-1.5 px-3 py-1.5 bg-pastel-redBg rounded-erp border border-pastel-redBorder animate-in fade-in zoom-in-95 duration-200">
            <AlertTriangle className="w-4 h-4" /> Unsaved Changes
          </span>
        )}
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="px-6 py-3 bg-white border-b border-erp-border flex flex-wrap items-center gap-6 shrink-0 z-10 shadow-sm relative">
        
        {/* Batch Selector */}
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Batch Master:</label>
          <select 
            value={selectedBatch}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="w-[260px] font-bold text-cw-blueDark border border-erp-border px-2 py-1.5 focus:border-cw-blue outline-none cursor-pointer bg-white shadow-sm"
          >
            {batches.map(b => (
              <option key={b} value={b}>{b === "ALL" ? "== View All Active Students ==" : b}</option>
            ))}
          </select>
        </div>

        {/* Strict Date Navigator */}
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Ledger Date:</label>
          <div className="flex items-center border border-erp-border bg-white shadow-sm h-[32px] rounded-sm overflow-hidden">
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
              className="border-none shadow-none h-full w-[140px] text-center font-bold text-gray-800 outline-none focus:ring-0 cursor-pointer text-erp-sm"
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
              className="pl-8 pr-3 py-1.5 w-[240px] border border-erp-border focus:border-cw-blue outline-none text-erp-sm font-medium shadow-sm"
            />
          </div>
          
          <button 
            onClick={handleSave}
            disabled={isSaving || isLoading || !isDirty || isAllBatchesView}
            className={`flex items-center gap-1.5 px-6 py-1.5 text-erp-md font-bold rounded-erp shadow-sm transition-colors ${
              isAllBatchesView 
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed" 
                : "bg-cw-green border border-[#006600] text-white hover:bg-[#005000] shadow-erp-button disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Writing to DB..." : "Save Register"}
          </button>
        </div>

        {/* PROGRESS BAR OVERLAY */}
        {!isAllBatchesView && students.length > 0 && (
          <div className="absolute bottom-0 left-0 h-[3px] bg-gray-200 w-full">
            <div 
              className={`h-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-cw-green' : 'bg-cw-blue'}`}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        )}
      </div>

      {/* 3. STATUS BAR & BULK ACTIONS */}
      <div className="px-6 py-2.5 bg-erp-header border-b border-erp-border flex justify-between items-center text-erp-base shrink-0">
        <div className="flex gap-6 font-bold tracking-wide items-center">
          <span className="text-gray-700 bg-white px-2 py-0.5 border border-erp-border shadow-sm rounded-sm">Roster: {students.length}</span>
          <span className="text-cw-green">Present: {summary.present}</span>
          <span className="text-cw-red">Absent: {summary.absent}</span>
          <span className="text-[#f57f17]">Late: {summary.late}</span>
          {summary.unmarked > 0 && !isAllBatchesView && (
            <span className="text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" /> Unmarked: {summary.unmarked}</span>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-erp-sm font-bold text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              checked={sendSms} 
              onChange={() => setSendSms(!sendSms)} 
              disabled={isAllBatchesView}
              className="w-3.5 h-3.5 mt-0.5 accent-cw-blue disabled:opacity-50 cursor-pointer" 
            />
            <MessageSquare className={`w-3.5 h-3.5 ${isAllBatchesView ? 'text-gray-400' : 'text-cw-blue'}`} /> 
            <span className={isAllBatchesView ? 'text-gray-400' : ''}>Auto-SMS Absentees</span>
          </label>
          <span className="text-gray-300">|</span>
          <button 
            onClick={markAllPresent} 
            disabled={isAllBatchesView || isLoading}
            className={`font-bold text-erp-sm flex items-center gap-1 px-3 py-1 border rounded-sm shadow-sm transition-colors ${
              isAllBatchesView 
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
                : "bg-white text-cw-green border-erp-border hover:bg-pastel-greenBg hover:border-cw-green"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All Present
          </button>
        </div>
      </div>

      {/* 4. ALL BATCHES WARNING BANNER */}
      {isAllBatchesView && (
        <div className="bg-pastel-yellowBg border-b border-pastel-yellowBorder px-6 py-2 flex items-center gap-2 text-erp-sm text-gray-800 shadow-sm shrink-0">
          <Info className="w-4 h-4 text-[#f57f17]" />
          <strong>Read-Only Mode:</strong> You are currently viewing the master list of all students. Please select a specific batch from the dropdown above to mark and save attendance.
        </div>
      )}

      {/* 5. CLASSIC ERP TABLE DATA GRID */}
      <div className="flex-1 p-6 overflow-auto bg-erp-bg">
        <div className="border border-erp-border bg-white shadow-sm rounded-erp max-w-[1400px] mx-auto overflow-hidden flex flex-col h-full relative">
          
          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin mb-4 text-cw-blue" />
              <p className="font-bold text-gray-600">Fetching secure database roster...</p>
            </div>
          )}

          <div className="overflow-auto flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b border-erp-border shadow-sm">
                <tr className="text-erp-sm text-gray-600 uppercase tracking-wide">
                  <th className="py-3 px-6 w-24 text-center font-bold border-r border-erp-borderLight">Roll No</th>
                  <th className="py-3 px-6 font-bold border-r border-erp-borderLight">Student Name</th>
                  {isAllBatchesView && <th className="py-3 px-6 font-bold border-r border-erp-borderLight">Batch</th>}
                  <th className="py-3 px-6 text-center font-bold w-[380px]">Attendance Matrix</th>
                </tr>
              </thead>

              <tbody className="bg-white text-erp-base">
                {filteredStudents.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={isAllBatchesView ? 4 : 3} className="py-12 text-center font-bold text-gray-500 italic bg-gray-50">
                      No student records found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student, index) => (
                    <tr 
                      key={student.id} 
                      className={`border-b border-erp-borderLight ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'} hover:bg-pastel-blueBg transition-colors group`}
                    >
                      <td className="py-3 px-6 text-center font-bold text-gray-800 border-r border-erp-borderLight">{student.roll}</td>
                      
                      <td className="py-3 px-6 border-r border-erp-borderLight">
                        <div className="flex flex-col">
                          <span className="font-bold text-cw-blueDark text-erp-base">{student.name}</span>
                          <span className="text-[10px] font-mono text-gray-400 group-hover:text-cw-blue transition-colors">{student.id}</span>
                        </div>
                      </td>

                      {isAllBatchesView && (
                        <td className="py-3 px-6 border-r border-erp-borderLight">
                          <span className="bg-white text-gray-600 border border-gray-300 px-2.5 py-0.5 text-[11px] font-bold rounded-[2px] shadow-sm uppercase">
                            {student.batch}
                          </span>
                        </td>
                      )}
                      
                      {/* Segmented Control for Attendance Marking */}
                      <td className="py-2.5 px-6 text-center bg-white group-hover:bg-transparent transition-colors">
                        <div className={`inline-flex shadow-sm border rounded-[3px] overflow-hidden ${isAllBatchesView ? 'border-gray-200 opacity-60' : 'border-erp-border'}`}>
                          
                          <button 
                            onClick={() => toggleStatus(student.id, "present")}
                            disabled={isAllBatchesView}
                            className={`px-7 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-all ${
                              attendanceData[student.id] === "present" 
                                ? "bg-cw-green text-white shadow-inner" 
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:hover:bg-gray-50"
                            }`}
                          >
                            Present
                          </button>
                          
                          <button 
                            onClick={() => toggleStatus(student.id, "absent")}
                            disabled={isAllBatchesView}
                            className={`px-7 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-all ${
                              attendanceData[student.id] === "absent" 
                                ? "bg-cw-red text-white shadow-inner" 
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:hover:bg-gray-50"
                            }`}
                          >
                            Absent
                          </button>
                          
                          <button 
                            onClick={() => toggleStatus(student.id, "late")}
                            disabled={isAllBatchesView}
                            className={`px-7 py-1.5 text-erp-sm font-bold uppercase transition-all ${
                              attendanceData[student.id] === "late" 
                                ? "bg-[#f57f17] text-white shadow-inner" 
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 disabled:hover:bg-gray-50"
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
          </div>
        </div>
      </div>
    </main>
  );
}