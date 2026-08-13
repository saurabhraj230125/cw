"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, ChevronLeft, Save, Trash2, Loader2, BookOpen, 
  Filter, Users, CalendarDays, UserPlus, X, CheckSquare 
} from "lucide-react";
import { getBatches, createBatchAction, deleteBatchAction, assignStudentsToBatchAction } from "../../actions/batch-actions";
import { getCourses } from "../../actions/course-actions";
import { getStudents } from "../../actions/student-actions"; // Need this to fetch students

export default function BatchesMasterPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  
  // Database State
  const [batches, setBatches] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  
  // Form State
  const [batchName, setBatchName] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [linkedCourse, setLinkedCourse] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // ====================================
  // MODAL STATE FOR ASSIGNING STUDENTS
  // ====================================
  const [assignModalBatch, setAssignModalBatch] = useState<any | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [fetchedBatches, fetchedCourses, fetchedStudents] = await Promise.all([
        getBatches(),
        getCourses(),
        getStudents() // Fetch all students so we can assign them and count them
      ]);
      setBatches(fetchedBatches);
      setCourses(fetchedCourses);
      setAllStudents(fetchedStudents);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveBatch = async () => {
    if (!batchName.trim()) return alert("Please enter a Batch Name.");
    if (!academicYear) return alert("Please select an Academic Year.");

    setIsSaving(true);
    try {
      await createBatchAction(batchName, academicYear, linkedCourse);
      setBatchName("");
      setIsCreating(false);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to save batch.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBatch = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this batch?")) return;
    setIsDeletingId(id);
    try {
      await deleteBatchAction(id);
      await loadData();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsDeletingId(null);
    }
  };

  // --- BULK ASSIGNMENT LOGIC ---
  const handleOpenAssignModal = (batch: any) => {
    setAssignModalBatch(batch);
    // Pre-select students who are already in this batch!
    const alreadyInBatch = allStudents.filter(s => s.batch_id === batch.name).map(s => s.id);
    setSelectedStudentIds(alreadyInBatch);
    setStudentSearch("");
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId) 
        : [...prev, studentId]
    );
  };

  const handleSaveAssignments = async () => {
    if (!assignModalBatch) return;
    setIsAssigning(true);
    try {
      await assignStudentsToBatchAction(assignModalBatch.name, selectedStudentIds);
      setAssignModalBatch(null);
      await loadData(); // Refresh the list to update live counts
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsAssigning(false);
    }
  };

  const filteredBatches = useMemo(() => 
    batches.filter(b => b.name.toLowerCase().includes(searchFilter.toLowerCase())), 
  [batches, searchFilter]);

  const filteredStudents = useMemo(() => 
    allStudents.filter(s => s.full_name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.roll_number?.toLowerCase().includes(studentSearch.toLowerCase())),
  [allStudents, studentSearch]);

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10 relative">
      
      {/* ================================================================= */}
      {/* ADD STUDENTS MODAL OVERLAY */}
      {/* ================================================================= */}
      {assignModalBatch && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-erp shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            
            <div className="bg-cw-blue p-4 flex justify-between items-center text-white shrink-0">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <UserPlus className="w-5 h-5"/> Assign Students to: {assignModalBatch.name}
              </h3>
              <button onClick={() => setAssignModalBatch(null)} className="hover:bg-white/20 p-1 rounded-sm transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-4 border-b border-erp-border bg-gray-50 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search students by name or roll number..." 
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-cw-blue outline-none text-erp-sm rounded-sm transition-colors shadow-inner"
                />
              </div>
              <p className="text-[11px] font-bold text-gray-500 mt-2">
                Selected: <span className="text-cw-blue">{selectedStudentIds.length}</span> / {allStudents.length} Total Students
              </p>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-white space-y-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-10 text-gray-500 italic">No students found matching your search.</div>
              ) : (
                filteredStudents.map(student => {
                  const isSelected = selectedStudentIds.includes(student.id);
                  const isAnotherBatch = student.batch_id && student.batch_id !== assignModalBatch.name;
                  
                  return (
                    <div 
                      key={student.id} 
                      onClick={() => handleToggleStudent(student.id)}
                      className={`flex items-center justify-between p-3 border rounded-sm cursor-pointer transition-colors ${isSelected ? 'bg-pastel-blueBg border-cw-blue' : 'border-erp-borderLight hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${isSelected ? 'bg-cw-blue border-cw-blue' : 'bg-white border-gray-300'}`}>
                          {isSelected && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                        </div>
                        <div>
                          <p className={`text-erp-sm font-bold ${isSelected ? 'text-cw-blueDark' : 'text-gray-800'}`}>{student.full_name}</p>
                          <p className="text-[10px] text-gray-500 font-medium">Roll: {student.roll_number}</p>
                        </div>
                      </div>
                      
                      {isAnotherBatch && !isSelected && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">
                          Currently in: {student.batch_id}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-erp-border flex gap-3 shrink-0">
              <button 
                onClick={() => setAssignModalBatch(null)} 
                className="flex-1 bg-white border border-erp-border text-gray-700 py-2 font-bold rounded-erp hover:bg-gray-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveAssignments} 
                disabled={isAssigning}
                className="flex-1 bg-cw-blue text-white py-2 font-bold rounded-erp hover:bg-cw-blueDark flex items-center justify-center gap-2 shadow-erp-button disabled:opacity-50 transition-colors"
              >
                {isAssigning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Confirm Assignments
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================================================================= */}

      {/* HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex items-center justify-between shadow-sm z-10">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide flex items-center gap-2">
          <Users className="w-5 h-5 text-cw-blue" />
          {isCreating ? "Create New Batch" : "Batches Master"}
        </h2>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-cw-blue hover:bg-cw-blueDark text-white px-5 py-1.5 text-erp-sm font-bold rounded-erp flex items-center gap-1.5 shadow-sm transition-colors tour-add-batch"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Batch
          </button>
        )}
      </div>

      <div className="flex-1 p-6 flex gap-6 max-w-[1200px] mx-auto w-full items-start">
        
        {/* MAIN WORKSPACE */}
        <div className="flex-1 bg-white border border-erp-border rounded-erp shadow-sm overflow-hidden min-h-[500px]">
          
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-32 text-gray-500">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-cw-blue" />
               <p className="font-bold tracking-wide">Syncing Batch Database...</p>
             </div>
          ) : !isCreating ? (
            
            // ==========================================
            // LIST VIEW (With Deep Integration)
            // ==========================================
            <div className="flex flex-col h-full">
              
              <div className="p-4 border-b border-erp-border bg-white">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Enter batch name to filter ..." 
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-cw-blue outline-none text-erp-base rounded-sm transition-colors shadow-inner"
                  />
                </div>
                
                <div className="flex items-center justify-between text-[12px] font-bold text-gray-600 mt-3 px-1">
                  <div>
                    <span>Select: <span className="text-cw-blue cursor-pointer hover:underline">All</span> | <span className="text-cw-blue cursor-pointer hover:underline">None</span></span>
                  </div>
                  <span className="bg-gray-500 text-white px-2 py-0.5 rounded-sm">{batches.length} total batches</span>
                </div>
              </div>

              <div className="divide-y divide-erp-borderLight">
                {filteredBatches.length === 0 ? (
                  <div className="py-12 text-center text-gray-500 italic">No batches found.</div>
                ) : (
                  filteredBatches.map(batch => {
                    // LIVE CALCULATION: How many students are in this batch?
                    const enrolledCount = allStudents.filter(s => s.batch_id === batch.name).length;

                    return (
                      <div key={batch.id} className="flex items-start justify-between p-4 hover:bg-gray-50 transition-colors group">
                        
                        <div className="flex items-start gap-4">
                          <input type="checkbox" className="mt-1.5 w-3.5 h-3.5 cursor-pointer" />
                          
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="bg-gray-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                                {batch.academic_year}
                              </span>
                              <span className="text-erp-md font-bold text-cw-blueDark">{batch.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-600 font-medium mt-1">
                              {batch.course_name && (
                                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {batch.course_name}</span>
                              )}
                              <span className="flex items-center gap-1 font-bold text-cw-green"><Users className="w-3.5 h-3.5" /> {enrolledCount} students</span>
                            </div>
                            
                            <div className="flex items-center gap-3 mt-3">
                              <button 
                                onClick={() => handleOpenAssignModal(batch)}
                                className="flex items-center gap-1 text-[11px] font-bold text-cw-blue bg-pastel-blueBg px-2 py-1 rounded-sm border border-pastel-blueBorder hover:bg-cw-blue hover:text-white transition-colors"
                              >
                                <UserPlus className="w-3 h-3" /> Add / Remove Students
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-end gap-2">
                          {isDeletingId === batch.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-cw-red" />
                          ) : (
                            <button onClick={() => handleDeleteBatch(batch.id)} className="p-2 hover:bg-pastel-redBg rounded-sm text-gray-400 hover:text-cw-red transition-colors" title="Delete Batch">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                          <p className="text-[9px] text-gray-400 font-bold uppercase mt-6">
                            created {new Date(batch.created_at).toLocaleDateString('en-GB')}
                          </p>
                        </div>

                      </div>
                    )
                  })
                )}
              </div>
            </div>

          ) : (
            // ==========================================
            // CREATE VIEW
            // ==========================================
            <div className="flex flex-col h-full bg-gray-50/30">
              
              <div className="px-6 py-4 border-b border-erp-border bg-white flex items-center justify-between">
                <button onClick={() => setIsCreating(false)} className="text-gray-500 hover:text-cw-blue text-erp-sm font-bold flex items-center gap-1 transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Back to Batches
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveBatch}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 bg-cw-blue text-white px-8 py-1.5 text-erp-sm font-bold rounded-erp hover:bg-cw-blueDark transition-colors shadow-erp-button disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Batch
                  </button>
                </div>
              </div>

              <div className="p-8 max-w-2xl space-y-6">
                <div className="bg-white border border-erp-border p-6 rounded-erp shadow-sm space-y-5">
                  <h3 className="text-erp-sm font-bold text-cw-blue uppercase tracking-wider border-b border-erp-borderLight pb-2 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" /> Batch Configuration
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-erp-sm font-bold text-gray-800">Batch Name <span className="text-cw-red">*</span></label>
                      <input 
                        type="text" 
                        value={batchName}
                        onChange={(e) => setBatchName(e.target.value)}
                        placeholder="e.g. 10th Std Morning Batch" 
                        className="w-full border border-erp-border p-2 text-erp-base focus:border-cw-blue outline-none shadow-inner rounded-sm" 
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-erp-sm font-bold text-gray-800">Academic Year <span className="text-cw-red">*</span></label>
                        <select 
                          value={academicYear}
                          onChange={(e) => setAcademicYear(e.target.value)}
                          className="w-full border border-erp-border p-2 text-erp-base focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer"
                        >
                          <option value="2025-2026">2025-2026</option>
                          <option value="2026-2027">2026-2027</option>
                          <option value="2027-2028">2027-2028</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-erp-sm font-bold text-gray-800">Link to Master Course</label>
                        <select 
                          value={linkedCourse}
                          onChange={(e) => setLinkedCourse(e.target.value)}
                          className="w-full border border-erp-border p-2 text-erp-base focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer"
                        >
                          <option value="">-- Optional: Select Course --</option>
                          {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[280px] shrink-0 space-y-6 hidden xl:block">
          {!isCreating && (
            <div className="bg-white border border-erp-border rounded-erp shadow-sm p-5">
              <h3 className="text-erp-md text-gray-800 font-bold mb-4 flex items-center gap-2 uppercase tracking-wide border-b border-erp-borderLight pb-2">
                <Filter className="w-4 h-4 text-cw-blue" /> Filters
              </h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Show</label>
                  <div className="flex gap-1.5">
                    <span className="bg-gray-500 text-white px-2 py-0.5 text-[11px] font-bold rounded-sm cursor-pointer shadow-sm">All</span>
                    <span className="bg-cw-green text-white px-2 py-0.5 text-[11px] font-bold rounded-sm cursor-pointer shadow-sm">Active</span>
                    <span className="bg-gray-200 text-gray-600 px-2 py-0.5 text-[11px] font-bold rounded-sm cursor-pointer border border-gray-300 shadow-sm">Archived</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">By standard (Course):</label>
                  <select className="w-full border border-erp-border p-1.5 text-xs font-medium outline-none rounded-sm bg-gray-50 cursor-pointer">
                    <option>Select a standard</option>
                    {courses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1.5">By Academic Period:</label>
                  <select className="w-full border border-erp-border p-1.5 text-xs font-medium outline-none rounded-sm bg-gray-50 cursor-pointer">
                    <option>Select an Academic year</option>
                    <option>2025-2026</option>
                    <option>2026-2027</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}