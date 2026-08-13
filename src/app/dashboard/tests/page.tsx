"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, Loader2, PlayCircle, Settings, Plus, X, ListChecks, CheckCircle2, 
  Users, Award, Eye
} from "lucide-react";
import { getBatches } from "../../actions/batch-actions";
import { 
  getBranchAcademics, scheduleTestAction, toggleTestLiveAction, addTestQuestionAction, 
  getExamQuestions, getExamAttempts, toggleResultsPublishAction 
} from "../../actions/academic-actions";

// 🚨 IMPORT THE BANNER
import StudentPortalBanner from "../../../components/StudentPortalBanner";

export default function TestSchedulerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [batches, setBatches] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);

  // Form State for Scheduling
  const [testBatch, setTestBatch] = useState("");
  const [testTitle, setTestTitle] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testDuration, setTestDuration] = useState("180");
  const [testMarks, setTestMarks] = useState("300");
  const [testSyllabus, setTestSyllabus] = useState("");

  // CBT MANAGER MODAL STATE
  const [manageExam, setManageExam] = useState<any | null>(null);
  const [managerTab, setManagerTab] = useState<"questions" | "analytics">("questions");
  
  const [examQuestions, setExamQuestions] = useState<any[]>([]);
  const [examAttempts, setExamAttempts] = useState<any[]>([]);
  const [isLoadingQs, setIsLoadingQs] = useState(false);
  
  // New Question Form
  const [qText, setQText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correctOpt, setCorrectOpt] = useState("A");
  const [posMarks, setPosMarks] = useState("4");
  const [negMarks, setNegMarks] = useState("1");

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [fetchedBatches, academics] = await Promise.all([getBatches(), getBranchAcademics()]);
      setBatches(fetchedBatches);
      setTests(academics.tests);
    } catch (error) {} 
    finally { setIsLoading(false); }
  }

  const handleScheduleTest = async () => {
    if (!testBatch || !testTitle || !testDate) return alert("Fill required fields");
    setIsSaving(true);
    try {
      await scheduleTestAction(testBatch, testTitle, testDate, Number(testMarks), testSyllabus);
      setTestTitle(""); setTestSyllabus("");
      await loadData();
    } catch (err: any) { alert(err.message); } 
    finally { setIsSaving(false); }
  };

  const openExamManager = async (exam: any) => {
    setManageExam(exam);
    setManagerTab("questions");
    setIsLoadingQs(true);
    try {
      const [qs, attempts] = await Promise.all([
        getExamQuestions(exam.id),
        getExamAttempts(exam.id)
      ]);
      setExamQuestions(qs);
      setExamAttempts(attempts);
    } catch (error) {} 
    finally { setIsLoadingQs(false); }
  };

  const handleAddQuestion = async () => {
    if (!qText || !optA || !optB || !optC || !optD) return alert("All options and question text are required.");
    setIsSaving(true);
    try {
      await addTestQuestionAction(manageExam.id, qText, optA, optB, optC, optD, correctOpt, Number(posMarks), Number(negMarks));
      setQText(""); setOptA(""); setOptB(""); setOptC(""); setOptD("");
      const qs = await getExamQuestions(manageExam.id);
      setExamQuestions(qs);
    } catch (err: any) { alert(err.message); } 
    finally { setIsSaving(false); }
  };

  const handleToggleLive = async () => {
    if (examQuestions.length === 0) return alert("You cannot make an exam live with 0 questions!");
    setIsSaving(true);
    try {
      const newStatus = !manageExam.is_live;
      await toggleTestLiveAction(manageExam.id, newStatus);
      setManageExam({ ...manageExam, is_live: newStatus });
      await loadData();
    } catch (err: any) { alert(err.message); } 
    finally { setIsSaving(false); }
  };

  const handleTogglePublish = async () => {
    try {
      const newStatus = !manageExam.results_published;
      await toggleResultsPublishAction(manageExam.id, newStatus);
      setManageExam({...manageExam, results_published: newStatus});
      await loadData();
    } catch (error: any) { alert(error.message); }
  };

  if (isLoading) return <div className="min-h-screen bg-erp-bg flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-cw-blue"/></div>;

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10 relative">
      
      {/* MODAL: EXAM MANAGER */}
      {manageExam && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-erp w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="bg-erp-header border-b border-erp-border p-4 flex justify-between items-end shrink-0">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-cw-blue" /> Exam Engine Configuration
                </h3>
                <div className="flex gap-4">
                  <button onClick={() => setManagerTab("questions")} className={`text-sm font-bold uppercase tracking-wide pb-2 border-b-2 transition-colors ${managerTab === 'questions' ? 'border-cw-blue text-cw-blue' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                    Question Builder
                  </button>
                  <button onClick={() => setManagerTab("analytics")} className={`text-sm font-bold uppercase tracking-wide pb-2 border-b-2 transition-colors ${managerTab === 'analytics' ? 'border-cw-blue text-cw-blue' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                    Student Analytics
                  </button>
                </div>
              </div>
              <button onClick={() => setManageExam(null)} className="p-2 hover:bg-gray-200 rounded-sm mb-2"><X className="w-6 h-6 text-gray-600"/></button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              
              {/* TAB: QUESTIONS */}
              {managerTab === "questions" && (
                <>
                  <div className="w-1/3 bg-gray-50 border-r border-erp-border flex flex-col">
                    <div className="p-4 border-b border-erp-border bg-white flex justify-between items-center">
                      <h4 className="font-bold text-gray-700 uppercase text-xs flex items-center gap-1"><ListChecks className="w-4 h-4"/> Question Bank</h4>
                      <span className="bg-cw-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">{examQuestions.length} Qs</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {isLoadingQs ? <div className="flex justify-center p-5"><Loader2 className="w-5 h-5 animate-spin text-cw-blue" /></div> : examQuestions.length === 0 ? <div className="text-center p-5 text-xs font-bold text-gray-400">No questions added.</div> : examQuestions.map((q, i) => (
                        <div key={q.id} className="bg-white p-3 rounded-sm border border-erp-border shadow-sm">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-cw-blueDark text-xs">Q {i + 1}.</span>
                            <span className="text-[9px] font-bold bg-pastel-greenBg text-cw-green px-1 rounded-sm">+{q.marks_positive} / -{q.marks_negative}</span>
                          </div>
                          <p className="text-xs text-gray-700 line-clamp-2">{q.question_text}</p>
                          <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase">Ans: Option {q.correct_option}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-white border-t border-erp-border">
                      <button onClick={handleToggleLive} disabled={isSaving} className={`w-full py-3 rounded-erp font-bold flex items-center justify-center gap-2 transition-all ${manageExam.is_live ? 'bg-cw-red text-white hover:bg-red-700' : 'bg-cw-green text-white hover:bg-green-700 shadow-erp-button'}`}>
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (manageExam.is_live ? <><X className="w-5 h-5" /> Revoke Live Status</> : <><PlayCircle className="w-5 h-5" /> Publish Exam Live</>)}
                      </button>
                    </div>
                  </div>

                  <div className="w-2/3 bg-white p-6 overflow-y-auto">
                    <h4 className="font-bold text-gray-800 uppercase tracking-wide border-b border-erp-borderLight pb-2 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cw-blue" /> Add New Question
                    </h4>
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Question Text</label>
                        <textarea value={qText} onChange={e=>setQText(e.target.value)} rows={4} className="w-full border border-erp-border p-3 focus:border-cw-blue outline-none shadow-inner rounded-sm resize-none text-sm"></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div><label className="text-xs font-bold text-gray-700 block mb-1">Option A</label><input type="text" value={optA} onChange={e=>setOptA(e.target.value)} className="w-full border p-2 focus:border-cw-blue outline-none text-sm rounded-sm shadow-inner" /></div>
                          <div><label className="text-xs font-bold text-gray-700 block mb-1">Option C</label><input type="text" value={optC} onChange={e=>setOptC(e.target.value)} className="w-full border p-2 focus:border-cw-blue outline-none text-sm rounded-sm shadow-inner" /></div>
                        </div>
                        <div className="space-y-3">
                          <div><label className="text-xs font-bold text-gray-700 block mb-1">Option B</label><input type="text" value={optB} onChange={e=>setOptB(e.target.value)} className="w-full border p-2 focus:border-cw-blue outline-none text-sm rounded-sm shadow-inner" /></div>
                          <div><label className="text-xs font-bold text-gray-700 block mb-1">Option D</label><input type="text" value={optD} onChange={e=>setOptD(e.target.value)} className="w-full border p-2 focus:border-cw-blue outline-none text-sm rounded-sm shadow-inner" /></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 border border-erp-border p-4 rounded-sm flex items-center justify-between">
                        <div>
                          <label className="text-xs font-bold text-cw-green uppercase tracking-wide block mb-1">Correct Answer</label>
                          <select value={correctOpt} onChange={e=>setCorrectOpt(e.target.value)} className="border p-1.5 font-bold outline-none rounded-sm bg-white cursor-pointer w-32">
                            <option value="A">Option A</option><option value="B">Option B</option><option value="C">Option C</option><option value="D">Option D</option>
                          </select>
                        </div>
                        <div className="flex gap-4">
                          <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">+ Marks</label><input type="number" value={posMarks} onChange={e=>setPosMarks(e.target.value)} className="w-16 border p-1.5 text-center font-bold text-cw-green outline-none" /></div>
                          <div><label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">- Marks</label><input type="number" value={negMarks} onChange={e=>setNegMarks(e.target.value)} className="w-16 border p-1.5 text-center font-bold text-cw-red outline-none" /></div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-2">
                        <button onClick={handleAddQuestion} disabled={isSaving} className="bg-cw-blue text-white px-8 py-2.5 font-bold rounded-erp hover:bg-cw-blueDark flex items-center gap-2 shadow-erp-button transition-colors">
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Save Question
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB: ANALYTICS */}
              {managerTab === "analytics" && (
                <div className="w-full bg-gray-50 flex flex-col overflow-hidden">
                  <div className="p-4 bg-white border-b border-erp-border flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2 bg-pastel-blueBg text-cw-blue px-3 py-1.5 rounded-sm border border-pastel-blueBorder font-bold text-sm">
                      <Users className="w-4 h-4" /> {examAttempts.length} Submissions
                    </div>
                    <button 
                      onClick={handleTogglePublish}
                      className={`font-bold px-6 py-2 rounded-sm shadow-sm transition-colors text-sm uppercase tracking-wide flex items-center gap-2 ${manageExam.results_published ? 'bg-gray-200 text-gray-600 hover:bg-gray-300' : 'bg-cw-blue text-white hover:bg-cw-blueDark'}`}
                    >
                      {manageExam.results_published ? <Eye className="w-4 h-4"/> : <Award className="w-4 h-4"/>}
                      {manageExam.results_published ? "Hide Results from Students" : "Publish Scorecards"}
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    {examAttempts.length === 0 ? (
                      <div className="text-center py-20 text-gray-400 font-medium">No students have taken this exam yet.</div>
                    ) : (
                      <table className="w-full bg-white border border-erp-border rounded-sm shadow-sm overflow-hidden text-left">
                        <thead className="bg-erp-header border-b border-erp-border">
                          <tr>
                            <th className="p-3 text-xs font-bold text-gray-600 uppercase">Rank</th>
                            <th className="p-3 text-xs font-bold text-gray-600 uppercase">Student Name</th>
                            <th className="p-3 text-xs font-bold text-gray-600 uppercase text-center">Score</th>
                            <th className="p-3 text-xs font-bold text-gray-600 uppercase text-center">Accuracy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-erp-borderLight">
                          {examAttempts.map((attempt, idx) => (
                            <tr key={attempt.id} className="hover:bg-gray-50">
                              <td className="p-3 font-bold text-gray-500 text-sm">#{idx + 1}</td>
                              <td className="p-3">
                                <p className="font-bold text-gray-900 text-sm">{attempt.students?.full_name}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{attempt.students?.roll_number}</p>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`font-black text-lg ${attempt.score > 0 ? 'text-cw-green' : 'text-cw-red'}`}>{attempt.score}</span>
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-2 text-xs font-bold">
                                  <span className="text-cw-green bg-pastel-greenBg px-1.5 rounded-sm">{attempt.total_correct} ✓</span>
                                  <span className="text-cw-red bg-pastel-redBg px-1.5 rounded-sm">{attempt.total_wrong} ✗</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD LIST */}
      <div className="bg-white border-b border-erp-border shrink-0 shadow-sm px-6 py-4">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-cw-blue" /> CBT Exam Engine Scheduler
        </h2>
      </div>

      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full">
        
        {/* 🚨 THE STUDENT PORTAL BANNER */}
        <StudentPortalBanner />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <div className="bg-white border border-erp-border rounded-erp shadow-sm p-6 space-y-5 sticky top-6">
              <h3 className="text-erp-md font-bold text-gray-800 uppercase border-b border-erp-borderLight pb-2">Schedule CBT Exam</h3>
              
              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Target Batch</label>
                <select value={testBatch} onChange={e => setTestBatch(e.target.value)} className="w-full border p-2 focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer">
                  <option value="">-- Select Target Batch --</option>
                  {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Exam Title</label>
                <input type="text" value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="e.g. NTA JEE Mains Mock 01" className="w-full border p-2 shadow-inner focus:border-cw-blue outline-none rounded-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-erp-sm font-bold text-gray-700">Date</label>
                  <input type="date" value={testDate} onChange={e => setTestDate(e.target.value)} className="w-full border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm cursor-pointer" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-erp-sm font-bold text-gray-700">Duration (Mins)</label>
                  <input type="number" value={testDuration} onChange={e => setTestDuration(e.target.value)} className="w-full border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm font-bold text-cw-blueDark" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Syllabus</label>
                <textarea value={testSyllabus} onChange={e => setTestSyllabus(e.target.value)} rows={2} className="w-full border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm resize-none"></textarea>
              </div>
              <button onClick={handleScheduleTest} disabled={isSaving || !testBatch} className="w-full bg-cw-blue text-white py-2.5 font-bold rounded-erp mt-4 hover:bg-cw-blueDark shadow-erp-button transition-colors">
                Deploy Exam Container
              </button>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="bg-white border border-erp-border rounded-erp shadow-sm overflow-hidden">
              <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex justify-between items-center">
                <h3 className="text-erp-md font-bold text-gray-800 uppercase">Exam Control Center</h3>
              </div>
              <div className="divide-y divide-erp-borderLight max-h-[700px] overflow-y-auto p-4 space-y-3">
                {tests.length === 0 ? <div className="text-center py-20 text-gray-500 italic">No exams scheduled.</div> : tests.map(test => (
                  <div key={test.id} className="border border-erp-border rounded-erp p-5 flex items-center justify-between hover:border-cw-blue transition-colors bg-white shadow-sm group">
                    <div className="flex gap-5">
                      <div className="w-16 h-16 rounded-sm bg-gray-50 border border-gray-200 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">{new Date(test.test_date).toLocaleString('default', { month: 'short' })}</span>
                        <span className="text-2xl font-bold text-cw-blueDark leading-none">{new Date(test.test_date).getDate()}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold text-gray-900 text-lg">{test.title}</h4>
                          {test.is_live && <span className="bg-cw-green text-white text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider flex items-center gap-1 animate-pulse"><PlayCircle className="w-3 h-3"/> Live</span>}
                        </div>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wide text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-sm">Batch: {test.batch_name}</span>
                          <span>{test.duration_minutes || 180} Mins</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => openExamManager(test)} className="bg-pastel-blueBg text-cw-blue border border-pastel-blueBorder hover:bg-cw-blue hover:text-white px-5 py-2 rounded-erp font-bold text-sm transition-all shadow-sm flex items-center gap-2">
                      <Settings className="w-4 h-4" /> Manage Exam
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}