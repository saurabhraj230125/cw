"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, ChevronLeft, BookOpen, Layers, 
  IndianRupee, Save, ArrowRightLeft, CheckCircle2, X, Trash2, Loader2, Filter, Info
} from "lucide-react";

// IMPORT BACKEND ACTIONS
import { getCourses, createCourseAction, deleteCourseAction } from "../../actions/course-actions";
// We don't need getBranchSubjects anymore because we are providing the ULTIMATE MASTER DICTIONARY below.

interface Subject {
  id: string;
  name: string;
  category: string;
}

interface Course {
  id: string;
  name: string;
  fee: number;
  subjects: string[];
  status: string;
}

// ============================================================================
// ULTIMATE ERP SUBJECT DICTIONARY (INDIAN CURRICULUM)
// ============================================================================
const MASTER_SUBJECTS: Subject[] = [
  // --- SCIENCE (MEDICAL & NON-MEDICAL) ---
  { id: "sci-1", name: "Physics", category: "Science (Class 11-12)" },
  { id: "sci-2", name: "Chemistry", category: "Science (Class 11-12)" },
  { id: "sci-3", name: "Mathematics", category: "Science (Class 11-12)" },
  { id: "sci-4", name: "Biology", category: "Science (Class 11-12)" },
  { id: "sci-5", name: "Computer Science (C++)", category: "Science (Class 11-12)" },
  { id: "sci-6", name: "Computer Science (Python)", category: "Science (Class 11-12)" },
  { id: "sci-7", name: "Informatics Practices (IP)", category: "Science (Class 11-12)" },
  { id: "sci-8", name: "Biotechnology", category: "Science (Class 11-12)" },
  { id: "sci-9", name: "Electronics", category: "Science (Class 11-12)" },
  { id: "sci-10", name: "Physical Education", category: "Science (Class 11-12)" },

  // --- COMMERCE ---
  { id: "com-1", name: "Accountancy", category: "Commerce (Class 11-12)" },
  { id: "com-2", name: "Business Studies", category: "Commerce (Class 11-12)" },
  { id: "com-3", name: "Economics", category: "Commerce (Class 11-12)" },
  { id: "com-4", name: "Applied Mathematics", category: "Commerce (Class 11-12)" },
  { id: "com-5", name: "Entrepreneurship", category: "Commerce (Class 11-12)" },

  // --- ARTS & HUMANITIES ---
  { id: "art-1", name: "History", category: "Arts & Humanities" },
  { id: "art-2", name: "Geography", category: "Arts & Humanities" },
  { id: "art-3", name: "Political Science", category: "Arts & Humanities" },
  { id: "art-4", name: "Psychology", category: "Arts & Humanities" },
  { id: "art-5", name: "Sociology", category: "Arts & Humanities" },
  { id: "art-6", name: "Fine Arts", category: "Arts & Humanities" },
  { id: "art-7", name: "Home Science", category: "Arts & Humanities" },
  { id: "art-8", name: "Legal Studies", category: "Arts & Humanities" },

  // --- LANGUAGES ---
  { id: "lan-1", name: "English Core", category: "Languages" },
  { id: "lan-2", name: "English Elective", category: "Languages" },
  { id: "lan-3", name: "Hindi Core", category: "Languages" },
  { id: "lan-4", name: "Hindi Elective", category: "Languages" },
  { id: "lan-5", name: "Sanskrit", category: "Languages" },

  // --- FOUNDATION (CLASS 6-10) ---
  { id: "fnd-1", name: "Science (Class 9-10)", category: "Foundation (Class 8-10)" },
  { id: "fnd-2", name: "Mathematics (Class 9-10)", category: "Foundation (Class 8-10)" },
  { id: "fnd-3", name: "Social Science (SST)", category: "Foundation (Class 8-10)" },
  { id: "fnd-4", name: "Mental Ability (MAT)", category: "Foundation (Class 8-10)" },
  { id: "fnd-5", name: "Science (Class 6-8)", category: "Foundation (Class 8-10)" },
  { id: "fnd-6", name: "Maths (Class 6-8)", category: "Foundation (Class 8-10)" },

  // --- COMPETITIVE & ENTRANCE TARGETS ---
  { id: "cmp-1", name: "JEE Mains Target", category: "Competitive Exams" },
  { id: "cmp-2", name: "JEE Advanced Target", category: "Competitive Exams" },
  { id: "cmp-3", name: "NEET-UG Target", category: "Competitive Exams" },
  { id: "cmp-4", name: "CA Foundation", category: "Competitive Exams" },
  { id: "cmp-5", name: "CUET (General Test)", category: "Competitive Exams" },
  { id: "cmp-6", name: "CUET (Domain Specific)", category: "Competitive Exams" },
  { id: "cmp-7", name: "NDA Preparation", category: "Competitive Exams" },
  { id: "cmp-8", name: "CLAT / Law Entrance", category: "Competitive Exams" },
];

export default function CoursesMasterPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  
  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Form State
  const [courseName, setCourseName] = useState("");
  const [courseFee, setCourseFee] = useState("");
  
  // Dual Listbox State (Using the Ultimate Dictionary)
  const [availableSubjects, setAvailableSubjects] = useState<Subject[]>(MASTER_SUBJECTS);
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>([]);
  
  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");
  const [searchCourses, setSearchCourses] = useState("");

  // --- 1. INITIAL LOAD ---
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const fetchedCourses = await getCourses();
      setCourses(fetchedCourses);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- 2. LISTBOX HANDLERS ---
  const handleSelectSubject = (subject: Subject) => {
    setAvailableSubjects(prev => prev.filter(s => s.id !== subject.id));
    setSelectedSubjects(prev => [...prev, subject]);
  };

  const handleRemoveSubject = (subject: Subject) => {
    setSelectedSubjects(prev => prev.filter(s => s.id !== subject.id));
    setAvailableSubjects(prev => [...prev, subject]);
  };

  const resetForm = () => {
    setCourseName("");
    setCourseFee("");
    setSelectedSubjects([]);
    setAvailableSubjects(MASTER_SUBJECTS);
    setSearchAvailable("");
    setSearchSelected("");
    setIsCreating(false);
  };

  // --- 3. DATABASE CRUD HANDLERS ---
  const handleSaveCourse = async () => {
    if (!courseName.trim()) return alert("Please enter a Course Name.");
    if (!courseFee) return alert("Please enter the Course Fee.");
    if (selectedSubjects.length === 0) return alert("Please select at least one subject from the list.");

    setIsSaving(true);
    try {
      const subjectNames = selectedSubjects.map(s => s.name);
      await createCourseAction(courseName, Number(courseFee), subjectNames);
      
      resetForm();
      await loadData();
      
    } catch (error: any) {
      alert(error.message || "Failed to save course.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm("CRITICAL: Are you sure you want to delete this course? It will be permanently removed from the master list.")) return;
    
    setIsDeletingId(courseId);
    try {
      await deleteCourseAction(courseId);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to delete course.");
    } finally {
      setIsDeletingId(null);
    }
  };

  // --- 4. FILTERS ---
  const filteredAvailable = useMemo(() => availableSubjects.filter(s => s.name.toLowerCase().includes(searchAvailable.toLowerCase())), [availableSubjects, searchAvailable]);
  const filteredSelected = useMemo(() => selectedSubjects.filter(s => s.name.toLowerCase().includes(searchSelected.toLowerCase())), [selectedSubjects, searchSelected]);
  const filteredCourses = useMemo(() => courses.filter(c => c.name.toLowerCase().includes(searchCourses.toLowerCase())), [courses, searchCourses]);

  // Group Available Subjects by Category for Beautiful UI Polish
  const groupedAvailable = useMemo(() => {
    const groups: Record<string, Subject[]> = {};
    filteredAvailable.forEach(sub => {
      if (!groups[sub.category]) groups[sub.category] = [];
      groups[sub.category].push(sub);
    });
    return groups;
  }, [filteredAvailable]);


  // ============================================================================
  // RENDER UI
  // ============================================================================
  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
      
      {/* HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex items-center justify-between shadow-sm z-10">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cw-blue" />
          {isCreating ? "Create New Course Bundle" : "Course Master Directory"}
        </h2>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-cw-green hover:bg-[#005000] text-white px-5 py-1.5 text-erp-sm font-bold rounded-erp flex items-center gap-1.5 shadow-erp-button transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> Add New Course
          </button>
        )}
      </div>

      <div className="flex-1 p-6 flex gap-6 max-w-[1400px] mx-auto w-full items-start">
        
        {/* MAIN WORKSPACE */}
        <div className="flex-1 bg-white border border-erp-border rounded-erp shadow-sm overflow-hidden">
          
          {isLoading ? (
             <div className="flex flex-col items-center justify-center py-32 text-gray-500">
               <Loader2 className="w-10 h-10 animate-spin mb-4 text-cw-blue" />
               <p className="font-bold tracking-wide">Syncing Course Database...</p>
             </div>
          ) : !isCreating ? (
            // ====================================================================
            // VIEW MODE: COURSE DIRECTORY
            // ====================================================================
            <div className="flex flex-col h-full">
              
              <div className="px-5 py-3 border-b border-erp-border bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="bg-cw-blue text-white px-2 py-0.5 rounded-sm text-[11px] font-bold shadow-sm">{courses.length} Courses</span>
                  <span className="text-erp-sm font-bold text-gray-500 uppercase tracking-wide">Course List</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search courses..." 
                    value={searchCourses}
                    onChange={(e) => setSearchCourses(e.target.value)}
                    className="pl-8 pr-3 py-1.5 w-[280px] border border-erp-border focus:border-cw-blue outline-none text-erp-sm font-medium transition-colors shadow-inner rounded-sm"
                  />
                </div>
              </div>

              <div className="overflow-x-auto min-h-[400px]">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white border-b border-erp-borderLight text-[11px] text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-5 font-bold border-r border-erp-borderLight w-[300px]">Course Name</th>
                      <th className="py-3 px-5 font-bold border-r border-erp-borderLight">Bundled Subjects</th>
                      <th className="py-3 px-5 font-bold text-right border-r border-erp-borderLight w-32">Base Fee</th>
                      <th className="py-3 px-5 font-bold text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-erp-base text-gray-800">
                    {filteredCourses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-16 text-center text-gray-500 italic">No courses found. Create one to get started.</td>
                      </tr>
                    ) : (
                      filteredCourses.map((course, idx) => (
                        <tr key={course.id} className={`border-b border-erp-borderLight hover:bg-pastel-blueBg transition-colors ${idx % 2 === 0 ? 'bg-transparent' : 'bg-gray-50/50'}`}>
                          
                          <td className="py-3 px-5 border-r border-erp-borderLight align-top">
                            <div className="font-bold text-cw-blueDark text-[15px]">{course.name}</div>
                            <div className="text-[10px] font-bold text-cw-green uppercase mt-0.5 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {course.status}</div>
                          </td>
                          
                          <td className="py-3 px-5 border-r border-erp-borderLight align-top">
                            <div className="flex flex-wrap gap-1.5">
                              {course.subjects.map(sub => (
                                <span key={sub} className="bg-white border border-gray-300 text-gray-700 px-2 py-0.5 text-[10px] font-bold rounded-sm shadow-sm whitespace-nowrap">
                                  {sub}
                                </span>
                              ))}
                              {course.subjects.length === 0 && <span className="text-gray-400 italic text-xs">No subjects mapped</span>}
                            </div>
                          </td>
                          
                          <td className="py-3 px-5 text-right font-bold text-gray-900 border-r border-erp-borderLight text-[15px] align-top">
                            ₹{course.fee.toLocaleString()}
                          </td>
                          
                          <td className="py-3 px-5 text-center align-top">
                            {isDeletingId === course.id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-cw-red mx-auto" />
                            ) : (
                              <button 
                                onClick={() => handleDeleteCourse(course.id)}
                                className="p-1.5 text-gray-400 hover:text-cw-red hover:bg-pastel-redBg border border-transparent hover:border-pastel-redBorder rounded-sm transition-all"
                                title="Delete Course"
                              >
                                <Trash2 className="w-4 h-4" />
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

          ) : (
            // ====================================================================
            // CREATE MODE: NEW COURSE WIZARD
            // ====================================================================
            <div className="flex flex-col h-full bg-gray-50/30">
              
              <div className="px-6 py-4 border-b border-erp-border bg-white flex items-center justify-between">
                <button 
                  onClick={resetForm} 
                  className="text-gray-500 hover:text-cw-blue text-erp-sm font-bold flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Cancel & Return
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveCourse}
                    disabled={isSaving}
                    className="flex items-center gap-1.5 bg-cw-blue border border-cw-blueDark text-white px-8 py-1.5 text-erp-sm font-bold rounded-erp hover:bg-cw-blueDark transition-colors shadow-erp-button disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Course"}
                  </button>
                </div>
              </div>

              <div className="p-8 max-w-4xl space-y-8">
                
                {/* Basic Details */}
                <div className="bg-white border border-erp-border p-6 rounded-erp shadow-sm space-y-5">
                  <h3 className="text-erp-sm font-bold text-cw-blue uppercase tracking-wider border-b border-erp-borderLight pb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Course Identity & Financials
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-erp-sm font-bold text-gray-800">Course Name <span className="text-cw-red">*</span></label>
                      <input 
                        type="text" 
                        value={courseName}
                        onChange={(e) => setCourseName(e.target.value)}
                        placeholder="e.g. Class 12 Science (PCM Target)" 
                        className="w-full border border-erp-border p-2 text-erp-base focus:border-cw-blue outline-none shadow-inner rounded-sm transition-colors" 
                      />
                      <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Visible on student fee receipts</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-erp-sm font-bold text-gray-800">Total Course Fee <span className="text-cw-red">*</span></label>
                      <div className="flex items-stretch shadow-inner rounded-sm overflow-hidden">
                        <span className="bg-gray-100 border border-erp-border border-r-0 px-4 flex items-center justify-center text-gray-500 font-bold">
                          <IndianRupee className="w-4 h-4" />
                        </span>
                        <input 
                          type="number" 
                          value={courseFee}
                          onChange={(e) => setCourseFee(e.target.value)}
                          placeholder="e.g. 45000" 
                          className="flex-1 border border-erp-border p-2 text-erp-base focus:border-cw-blue outline-none transition-colors font-bold text-gray-900" 
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">Base fee before any student discounts</p>
                    </div>
                  </div>
                </div>

                {/* Ultimate Subject Selector */}
                <div className="bg-white border border-erp-border p-6 rounded-erp shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-erp-borderLight pb-2">
                    <h3 className="text-erp-sm font-bold text-cw-blue uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" /> Select Subjects to Bundle <span className="text-cw-red">*</span>
                    </h3>
                    <span className="bg-pastel-blueBg border border-pastel-blueBorder text-cw-blue px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm">
                      {selectedSubjects.length} Subjects Selected
                    </span>
                  </div>
                  
                  <div className="flex items-stretch justify-center gap-4 h-[400px]">
                    
                    {/* AVAILABLE SUBJECTS (Grouped & Searchable) */}
                    <div className="flex-1 border border-erp-border rounded-sm flex flex-col overflow-hidden bg-gray-50 shadow-inner">
                      <div className="bg-gray-200 border-b border-erp-border px-3 py-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Master Subject Library</span>
                      </div>
                      <div className="p-2 border-b border-erp-border bg-white">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Search subjects or streams..." 
                            value={searchAvailable}
                            onChange={(e) => setSearchAvailable(e.target.value)}
                            className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 focus:border-cw-blue outline-none rounded-sm bg-gray-50 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-2 space-y-4 bg-white">
                        {Object.keys(groupedAvailable).length === 0 ? (
                          <div className="text-center text-xs text-gray-400 italic py-10">No subjects match your search.</div>
                        ) : (
                          Object.entries(groupedAvailable).map(([category, subjects]) => (
                            <div key={category} className="mb-3">
                              <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 uppercase tracking-widest rounded-sm mb-1.5 border border-gray-200">
                                {category}
                              </div>
                              {subjects.map(sub => (
                                <div 
                                  key={sub.id} 
                                  onClick={() => handleSelectSubject(sub)}
                                  className="flex items-center justify-between px-2 py-1.5 text-xs text-gray-700 font-bold hover:bg-pastel-blueBg hover:text-cw-blue border border-transparent cursor-pointer rounded-[2px] transition-all group"
                                >
                                  {sub.name}
                                  <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-cw-blue transition-colors" />
                                </div>
                              ))}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* TRANSFER VISUAL */}
                    <div className="flex flex-col justify-center items-center px-2">
                      <div className="bg-white p-2 rounded-full border border-gray-300 shadow-sm">
                        <ArrowRightLeft className="w-4 h-4 text-cw-blue" />
                      </div>
                    </div>

                    {/* SELECTED SUBJECTS */}
                    <div className="flex-1 border border-cw-blue rounded-sm flex flex-col overflow-hidden bg-pastel-blueBg/20 shadow-[0_0_10px_rgba(0,102,204,0.05)]">
                      <div className="bg-cw-blue border-b border-cw-blueDark px-3 py-2 flex items-center justify-between text-white">
                        <span className="text-xs font-bold uppercase tracking-wide">Included in this Course</span>
                      </div>
                      <div className="p-2 border-b border-cw-blue/20 bg-white">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                          <input 
                            type="text" 
                            placeholder="Filter selected..." 
                            value={searchSelected}
                            onChange={(e) => setSearchSelected(e.target.value)}
                            className="w-full pl-7 pr-2 py-1.5 text-xs border border-gray-300 focus:border-cw-blue outline-none rounded-sm bg-gray-50 focus:bg-white transition-colors"
                          />
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 bg-white">
                        {filteredSelected.length === 0 ? (
                          <div className="text-center text-xs text-gray-500 italic py-24 flex flex-col items-center">
                            <Layers className="w-10 h-10 text-gray-300 mb-3" />
                            Click subjects from the left <br/>to bundle them into this course.
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {filteredSelected.map(sub => (
                              <div 
                                key={sub.id} 
                                onClick={() => handleRemoveSubject(sub)}
                                className="flex items-center justify-between px-3 py-2 text-xs font-bold text-cw-blueDark bg-pastel-blueBg/50 border border-cw-blue/20 cursor-pointer rounded-sm transition-all hover:bg-pastel-redBg hover:border-pastel-redBorder hover:text-cw-red group"
                              >
                                <span>{sub.name}</span>
                                <X className="w-3.5 h-3.5 text-gray-400 group-hover:text-cw-red transition-colors" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* 3. RIGHT SIDEBAR (Intelligent Tips & Analytics) */}
        <div className="w-[300px] shrink-0 space-y-6 hidden xl:block">
          
          {!isCreating ? (
            <div className="bg-pastel-blueBg border border-pastel-blueBorder rounded-erp p-4 flex gap-3 shadow-sm">
              <Info className="w-5 h-5 text-cw-blue shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-cw-blue uppercase tracking-wider mb-1">How Courses Work</h4>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Courses created here act as <strong>templates</strong>. When you admit a student, they inherit these base fees and subjects. You can still apply individual discounts directly to their profile during admission.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-pastel-yellowBg border border-pastel-yellowBorder rounded-erp shadow-sm p-5">
              <h3 className="text-erp-sm font-bold text-[#f57f17] uppercase tracking-wide border-b border-[#f57f17]/30 pb-2 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> Creation Rules
              </h3>
              
              <ul className="space-y-3 text-xs text-gray-800 leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f57f17] mt-1.5 shrink-0" />
                  Ensure the Course Name is highly descriptive (e.g., "Class 12 Commerce - Target 95%").
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#f57f17] mt-1.5 shrink-0" />
                  Include every relevant subject in the bundle. This ensures the student's name appears on the correct Daily Attendance Registers.
                </li>
              </ul>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}