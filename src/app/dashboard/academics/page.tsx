"use client";

import { useState, useEffect } from "react";
import { BookOpen, FileText, Upload, CalendarDays, Loader2, GraduationCap, Link2, FileUp } from "lucide-react";
import { getBatches } from "../../actions/batch-actions";
import { getBranchAcademics, uploadStudyMaterialAction, scheduleTestAction } from "../../actions/academic-actions";

export default function AcademicsMasterPage() {
  const [activeTab, setActiveTab] = useState<"materials" | "tests">("materials");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [batches, setBatches] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  // Material Form (Deeply updated for real files)
  const [matBatch, setMatBatch] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("DPP");
  const [matFile, setMatFile] = useState<File | null>(null); 

  // Test Form
  const [testBatch, setTestBatch] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testMarks, setTestMarks] = useState("300");
  const [testSyllabus, setTestSyllabus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [fetchedBatches, academics] = await Promise.all([
        getBatches(),
        getBranchAcademics()
      ]);
      setBatches(fetchedBatches);
      setMaterials(academics.materials);
      setTests(academics.tests);
    } catch (error) {
      console.error("Failed to load academic data");
    } finally {
      setIsLoading(false);
    }
  }

  // --- SUBMIT REAL FILE TO BACKEND ---
  const handleUploadMaterial = async () => {
    if (!matBatch || !matTitle || !matFile) return alert("Please select a batch, enter a title, and attach a file.");
    
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("batch_name", matBatch);
      formData.append("title", matTitle);
      formData.append("document_type", matType);
      formData.append("file", matFile); // Appending the actual physical file

      await uploadStudyMaterialAction(formData);
      
      setMatTitle(""); 
      setMatFile(null); // Reset the file picker
      
      // Clear file input UI manually
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      await loadData();
    } catch (err: any) { 
      alert(err.message); 
    } finally { 
      setIsSaving(false); 
    }
  };

  const handleScheduleTest = async () => {
    if (!testBatch || !testTitle || !testDate) return alert("Fill all required fields");
    setIsSaving(true);
    try {
      await scheduleTestAction(testBatch, testTitle, testDate, Number(testMarks), testSyllabus);
      setTestTitle(""); setTestSyllabus("");
      await loadData();
    } catch (err: any) { alert(err.message); } 
    finally { setIsSaving(false); }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-erp-bg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cw-blue" /></div>;
  }

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
      
      {/* HEADER & TABS */}
      <div className="bg-white border-b border-erp-border shrink-0 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-cw-blue" /> Academic Control Center
          </h2>
        </div>
        <div className="flex px-6 gap-6 text-erp-md font-bold">
          <button 
            onClick={() => setActiveTab("materials")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "materials" ? "border-cw-blue text-cw-blue" : "border-transparent text-gray-500 hover:text-gray-800"}`}
          >
            <BookOpen className="w-4 h-4" /> Study Materials (DPPs)
          </button>
          <button 
            onClick={() => setActiveTab("tests")}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${activeTab === "tests" ? "border-cw-blue text-cw-blue" : "border-transparent text-gray-500 hover:text-gray-800"}`}
          >
            <CalendarDays className="w-4 h-4" /> Test Scheduler
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: THE FORMS */}
        <div className="xl:col-span-1">
          
          {/* MATERIAL UPLOAD FORM */}
          {activeTab === "materials" && (
            <div className="bg-white border border-erp-border rounded-erp shadow-sm p-6 space-y-5 animate-in slide-in-from-left-4 duration-300">
              <h3 className="text-erp-md font-bold text-gray-800 uppercase border-b border-erp-borderLight pb-2">Upload New Material</h3>
              
              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Assign to Batch <span className="text-cw-red">*</span></label>
                <select value={matBatch} onChange={e => setMatBatch(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer">
                  <option value="">-- Select Target Batch --</option>
                  {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Material Title <span className="text-cw-red">*</span></label>
                <input type="text" value={matTitle} onChange={e => setMatTitle(e.target.value)} placeholder="e.g. Vectors DPP 01" className="w-full border border-erp-border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm" />
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Document Type</label>
                <select value={matType} onChange={e => setMatType(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer">
                  <option value="DPP">Daily Practice Problem (DPP)</option>
                  <option value="Class Notes">Class Notes / PDF</option>
                  <option value="Formula Sheet">Formula Sheet</option>
                </select>
              </div>

              {/* REAL FILE ATTACHMENT UI */}
              <div className="space-y-1.5 pt-2">
                <label className="text-erp-sm font-bold text-gray-700">Attach Document (PDF/Image) <span className="text-cw-red">*</span></label>
                <label htmlFor="file-upload" className={`w-full border-2 border-dashed rounded-erp flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${matFile ? 'border-cw-green bg-pastel-greenBg' : 'border-gray-300 hover:border-cw-blue hover:bg-pastel-blueBg'}`}>
                  <FileUp className={`w-8 h-8 mb-2 ${matFile ? 'text-cw-green' : 'text-gray-400'}`} />
                  <span className="text-erp-sm font-bold text-gray-600 text-center">
                    {matFile ? (
                      <span className="text-cw-green">{matFile.name}</span>
                    ) : (
                      "Click to browse or drag file here"
                    )}
                  </span>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => setMatFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden" 
                  />
                </label>
              </div>

              <button 
                onClick={handleUploadMaterial} 
                disabled={isSaving || !matBatch || !matFile} 
                className="w-full bg-cw-blue text-white py-2.5 font-bold rounded-erp mt-4 hover:bg-cw-blueDark flex justify-center items-center gap-2 shadow-erp-button disabled:opacity-50 transition-colors"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
                {isSaving ? "Uploading to Cloud..." : "Publish to Student Portal"}
              </button>
            </div>
          )}

          {/* TEST SCHEDULER FORM */}
          {activeTab === "tests" && (
            <div className="bg-white border border-erp-border rounded-erp shadow-sm p-6 space-y-5 animate-in slide-in-from-left-4 duration-300">
              <h3 className="text-erp-md font-bold text-gray-800 uppercase border-b border-erp-borderLight pb-2">Schedule Exam</h3>
              
              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Target Batch <span className="text-cw-red">*</span></label>
                <select value={testBatch} onChange={e => setTestBatch(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer">
                  <option value="">-- Select Target Batch --</option>
                  {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Exam Title <span className="text-cw-red">*</span></label>
                <input type="text" value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="e.g. Weekly Mains Mock - 05" className="w-full border border-erp-border p-2 shadow-inner focus:border-cw-blue outline-none rounded-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-erp-sm font-bold text-gray-700">Test Date <span className="text-cw-red">*</span></label>
                  <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm cursor-pointer" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-erp-sm font-bold text-gray-700">Total Marks</label>
                  <input type="number" value={testMarks} onChange={e => setTestMarks(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm font-bold text-cw-blueDark" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Syllabus Covered</label>
                <textarea value={testSyllabus} onChange={e => setTestSyllabus(e.target.value)} rows={3} placeholder="Physics: Kinematics&#10;Chemistry: Mole Concept" className="w-full border border-erp-border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm resize-none"></textarea>
              </div>

              <button onClick={handleScheduleTest} disabled={isSaving || !testBatch} className="w-full bg-cw-blue text-white py-2.5 font-bold rounded-erp mt-4 hover:bg-cw-blueDark flex justify-center items-center gap-2 shadow-erp-button disabled:opacity-50 transition-colors">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />} Schedule Exam
              </button>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: THE DASHBOARDS */}
        <div className="xl:col-span-2">
          
          {/* MATERIALS LIST */}
          {activeTab === "materials" && (
            <div className="bg-white border border-erp-border rounded-erp shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex justify-between items-center">
                <h3 className="text-erp-md font-bold text-gray-800 uppercase">Live Vault Database</h3>
                <span className="text-xs font-bold text-gray-500">{materials.length} Items Indexed</span>
              </div>
              <div className="divide-y divide-erp-borderLight">
                {materials.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 italic">No materials uploaded yet.</div>
                ) : (
                  materials.map(mat => (
                    <div key={mat.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="bg-pastel-blueBg border border-pastel-blueBorder w-10 h-10 rounded-sm flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-cw-blue" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-erp-md">{mat.title}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 font-bold mt-1 uppercase tracking-wide">
                            <span className="bg-gray-200 px-1.5 py-0.5 rounded-sm">{mat.document_type}</span>
                            <span className="text-cw-blueDark">Batch: {mat.batch_name}</span>
                          </div>
                        </div>
                      </div>
                      <a href={mat.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-bold text-white bg-cw-blue hover:bg-cw-blueDark px-4 py-1.5 rounded-erp shadow-sm transition-colors">
                        <Link2 className="w-3.5 h-3.5" /> Open Document
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TESTS LIST */}
          {activeTab === "tests" && (
            <div className="bg-white border border-erp-border rounded-erp shadow-sm overflow-hidden animate-in fade-in duration-500">
              <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex justify-between items-center">
                <h3 className="text-erp-md font-bold text-gray-800 uppercase">Upcoming Exam Schedule</h3>
                <span className="text-xs font-bold text-gray-500">{tests.length} Exams Configured</span>
              </div>
              <div className="divide-y divide-erp-borderLight">
                {tests.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 italic">No exams scheduled yet.</div>
                ) : (
                  tests.map(test => {
                    const testDate = new Date(test.test_date);
                    const isPast = testDate < new Date();
                    
                    return (
                      <div key={test.id} className={`p-4 flex items-start justify-between transition-colors ${isPast ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50'}`}>
                        <div className="flex gap-4">
                          <div className={`w-14 h-14 rounded-sm border flex flex-col items-center justify-center shrink-0 shadow-sm ${isPast ? 'bg-gray-200 border-gray-300' : 'bg-white border-cw-blue'}`}>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${isPast ? 'text-gray-500' : 'text-cw-blue'}`}>{testDate.toLocaleString('default', { month: 'short' })}</span>
                            <span className={`text-xl font-bold leading-none ${isPast ? 'text-gray-600' : 'text-gray-900'}`}>{testDate.getDate()}</span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-erp-md">{test.title}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-600 font-bold mt-1 uppercase tracking-wide">
                              <span className="text-cw-blueDark">Batch: {test.batch_name}</span>
                              <span className="bg-gray-200 px-1.5 py-0.5 rounded-sm">{test.total_marks} Marks</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-1 max-w-lg font-medium">
                              <span className="font-bold uppercase text-[10px] bg-pastel-blueBg text-cw-blue border border-pastel-blueBorder px-1.5 py-0.5 rounded-sm mr-1 tracking-wider">Syllabus</span> 
                              {test.syllabus}
                            </p>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-sm border ${isPast ? 'bg-gray-200 text-gray-500 border-gray-300' : 'bg-pastel-greenBg text-cw-green border-pastel-greenBorder'}`}>
                            {isPast ? 'Completed' : 'Upcoming'}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}