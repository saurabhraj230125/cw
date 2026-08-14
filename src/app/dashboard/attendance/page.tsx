"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search, Save, AlertTriangle, ChevronLeft, ChevronRight,
  CheckCircle2, MessageSquare, Loader2, RefreshCw, Users, BookOpen
} from "lucide-react";

// IMPORT REAL DATABASE ACTIONS
import { getActiveBatches, getAttendanceRoster, saveAttendanceAction } from "../../actions/attendance-actions";

export type Status = "present" | "absent" | "late" | "leave";

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

  // DEEP FIX: Default back to "ALL", but this time it is fully unlocked!
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
        // Add "ALL" as the first option
        setBatches(["ALL", ...(fetchedBatches || [])]);
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

  // --- HANDLERS (READ-ONLY LOCKS COMPLETELY REMOVED) ---
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
    const counts = { present: 0, absent: 0, late: 0, leave: 0, unmarked: 0 };
    students.forEach((s: RosterStudent) => {
      const status = attendanceData[s.id];
      if (status === "present") counts.present++;
      else if (status === "absent") counts.absent++;
      else if (status === "late") counts.late++;
      else if (status === "leave") counts.leave++;
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
          <p className="text-gray-500 font-bold text-erp-md">Loading Master Register...</p>
        </div>
      </main>
    );
  }

  // --- EMPTY STATE (NO BATCHES IN DB) ---
  if (batches.length <= 1) {
    return (
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <div className="bg-white p-8 rounded-erp border border-erp-border shadow-sm text-center max-w-md">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h2 className="text-erp-lg font-bold text-gray-800 mb-2">No Active Batches</h2>
          <p className="text-erp-base text-gray-600">You must create a batch in Batch Master and assign students before taking attendance.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-erp-bg flex flex-col pb-10">

      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex justify-between items-center z-10 shadow-sm">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide">
          Daily Attendance Register
        </h2>
        {isDirty && (
          <span className="text-cw-red text-erp-sm font-bold flex items-center gap-1.5 px-3 py-1.5 bg-pastel-redBg rounded-erp border border-pastel-redBorder animate-in fade-in zoom-in-95 duration-200">
            <AlertTriangle className="w-4 h-4" /> Unsaved Changes
          </span>
        )}
      </div>

      {/* 2. FUNCTIONAL TOOLBAR */}
      <div className="px-6 py-3 bg-white border-b border-erp-border flex flex-wrap items-center gap-6 shrink-0 z-10 shadow-sm relative">

        {/* Localized Batch Selector */}
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cw-blue" />
            Select Batch:
          </label>
          <select
            value={selectedBatch}
            onChange={(e) => handleBatchChange(e.target.value)}
            className="w-[320px] font-bold text-cw-blueDark border border-erp-border px-2 py-1.5 focus:border-cw-blue outline-none cursor-pointer bg-white shadow-sm"
          >
            <option value="ALL">-- All Students (Sabhi Batches) --</option>
            {batches.filter(b => b !== "ALL").map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Strict Date Navigator */}
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Date:</label>
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
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 w-[240px] border border-erp-border focus:border-cw-blue outline-none text-erp-sm font-medium shadow-sm"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || isLoading || !isDirty}
            className={`flex items-center gap-1.5 px-6 py-1.5 text-erp-md font-bold rounded-erp shadow-sm transition-colors ${!isDirty
                ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-cw-green border border-[#006600] text-white hover:bg-[#005000] shadow-erp-button disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Register"}
          </button>
        </div>

        {/* PROGRESS BAR OVERLAY */}
        {students.length > 0 && (
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
          <span className="text-cw-green">P: {summary.present}</span>
          <span className="text-cw-red">A: {summary.absent}</span>
          <span className="text-[#f57f17]">L: {summary.late}</span>
          <span className="text-gray-500">Leave: {(summary as any).leave ?? 0}</span>
          {summary.unmarked > 0 && (
            <span className="text-gray-500 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" /> Unmarked: {summary.unmarked}</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 text-erp-sm font-bold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={sendSms}
              onChange={() => setSendSms(!sendSms)}
              className="w-3.5 h-3.5 mt-0.5 accent-cw-blue cursor-pointer"
            />
            <MessageSquare className="w-3.5 h-3.5 text-cw-blue" />
            <span>Auto-SMS Absentees</span>
          </label>
          <span className="text-gray-300">|</span>
          <button
            onClick={markAllPresent}
            disabled={isLoading || students.length === 0}
            className={`font-bold text-erp-sm flex items-center gap-1 px-3 py-1 border rounded-sm shadow-sm transition-colors ${students.length === 0
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white text-cw-green border-erp-border hover:bg-pastel-greenBg hover:border-cw-green"
              }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Mark All Present
          </button>
        </div>
      </div>

      {/* 4. CLASSIC ERP TABLE DATA GRID */}
      <div className="flex-1 p-6 overflow-auto bg-erp-bg">
        <div className="border border-erp-border bg-white shadow-sm rounded-erp max-w-[1400px] mx-auto overflow-hidden flex flex-col h-full relative">

          {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
              <RefreshCw className="w-8 h-8 animate-spin mb-4 text-cw-blue" />
              <p className="font-bold text-gray-600">Fetching roster...</p>
            </div>
          )}

          <div className="overflow-auto flex-1 relative">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-gray-50 border-b border-erp-border shadow-sm">
                <tr className="text-erp-sm text-gray-600 uppercase tracking-wide">
                  <th className="py-3 px-6 w-24 text-center font-bold border-r border-erp-borderLight">Roll No</th>
                  <th className="py-3 px-6 font-bold border-r border-erp-borderLight">Student Name</th>
                  {/* Show Batch Column only when viewing ALL so they know who belongs where */}
                  {isAllBatchesView && <th className="py-3 px-6 font-bold border-r border-erp-borderLight">Batch</th>}
                  <th className="py-3 px-6 text-center font-bold w-[380px]">Attendance Matrix</th>
                </tr>
              </thead>

              <tbody className="bg-white text-erp-base">
                {filteredStudents.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={isAllBatchesView ? 4 : 3} className="py-12 text-center font-bold text-gray-500 italic bg-gray-50">
                      No student records found.
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

                      {/* Fully Unlocked Segmented Control for Attendance Marking */}
                      <td className="py-2.5 px-6 text-center bg-white group-hover:bg-transparent transition-colors">
                        <div className={`inline-flex shadow-sm border rounded-[3px] overflow-hidden border-erp-border`}>

                          <button
                            onClick={() => toggleStatus(student.id, "present")}
                            className={`px-7 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-all ${attendanceData[student.id] === "present"
                                ? "bg-cw-green text-white shadow-inner"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                              }`}
                          >
                            Present
                          </button>

                          <button
                            onClick={() => toggleStatus(student.id, "absent")}
                            className={`px-7 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-all ${attendanceData[student.id] === "absent"
                                ? "bg-cw-red text-white shadow-inner"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                              }`}
                          >
                            Absent
                          </button>

                          <button
                            onClick={() => toggleStatus(student.id, "late")}
                            className={`px-5 py-1.5 border-r border-erp-border text-erp-sm font-bold uppercase transition-all ${attendanceData[student.id] === "late"
                                ? "bg-[#f57f17] text-white shadow-inner"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                              }`}
                          >
                            Late
                          </button>

                          <button
                            onClick={() => toggleStatus(student.id, "leave")}
                            className={`px-5 py-1.5 text-erp-sm font-bold uppercase transition-all ${attendanceData[student.id] === "leave"
                                ? "bg-gray-500 text-white shadow-inner"
                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                              }`}
                          >
                            Leave
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

      {/* ================================================================= */}
      {/* STICKY BOTTOM: SUBMIT REGISTER BAR */}
      {/* ================================================================= */}
      {students.length > 0 && (
        <div className="shrink-0 sticky bottom-0 left-0 right-0 z-30 bg-white border-t-2 border-cw-blue shadow-[0_-4px_20px_rgba(0,85,165,0.12)] px-6 py-3 flex items-center justify-between animate-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cw-green" />
              <span className="text-erp-sm font-bold text-gray-700">P: <span className="text-cw-green">{summary.present}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-cw-red" />
              <span className="text-erp-sm font-bold text-gray-700">A: <span className="text-cw-red">{summary.absent}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#f57f17]" />
              <span className="text-erp-sm font-bold text-gray-700">Late: <span className="text-[#f57f17]">{summary.late}</span></span>
            </div>
            {summary.unmarked > 0 && (
              <span className="text-erp-sm font-bold text-cw-red flex items-center gap-1.5 bg-pastel-redBg border border-pastel-redBorder px-2.5 py-1 rounded-sm animate-pulse">
                ⚠ {summary.unmarked} unmarked
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-erp-sm text-gray-500 font-medium hidden sm:block">
              Batch: <strong className="text-gray-800">{selectedBatch === "ALL" ? "Sabhi Batches" : selectedBatch}</strong> &nbsp;·&nbsp; Date: <strong className="text-gray-800">{selectedDate}</strong>
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading || !isDirty}
              className="flex items-center gap-2 bg-cw-blue text-white px-8 py-2.5 font-black text-erp-md rounded-erp shadow-erp-button hover:bg-cw-blueDark transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isSaving ? "Writing to DB..." : "Submit Attendance Register"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}