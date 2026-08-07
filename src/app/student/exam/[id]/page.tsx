"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { fetchLiveExamForStudent, submitStudentExamAction } from "../../../actions/cbt-student-actions";
import { Loader2, Clock, CheckCircle2 } from "lucide-react";

export default function StudentExamEngine({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  const resolvedParams = use(params);
  const testId = resolvedParams.id;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  
  const [testInfo, setTestInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qStatus, setQStatus] = useState<Record<string, string>>({}); 
  
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    async function initExam() {
      try {
        const data = await fetchLiveExamForStudent(testId);
        setTestInfo(data.test);
        setQuestions(data.questions);
        
        const initialStatus: Record<string, string> = {};
        data.questions.forEach((q: any, i: number) => {
          initialStatus[q.id] = i === 0 ? "not_answered" : "not_visited";
        });
        setQStatus(initialStatus);

        setTimeLeft((data.test.duration_minutes || 180) * 60);
      } catch (error: any) {
        alert(error.message);
        router.push("/student/dashboard");
      } finally {
        setIsLoading(false);
      }
    }
    initExam();
  }, [testId, router]);

  useEffect(() => {
    if (timeLeft <= 0 || isLoading || testComplete) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    if (timeLeft === 1) handleFinalSubmit();
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, testComplete]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  const handleOptionSelect = (optionKey: string) => {
    setAnswers({ ...answers, [currentQ.id]: optionKey });
  };

  const handleSaveAndNext = () => {
    const newStatus = { ...qStatus };
    if (answers[currentQ.id]) newStatus[currentQ.id] = "answered";
    else newStatus[currentQ.id] = "not_answered";
    
    if (currentIndex < questions.length - 1) {
      if (newStatus[questions[currentIndex + 1].id] === "not_visited") {
        newStatus[questions[currentIndex + 1].id] = "not_answered";
      }
      setCurrentIndex(currentIndex + 1);
    }
    setQStatus(newStatus);
  };

  const handleMarkForReview = () => {
    const newStatus = { ...qStatus };
    newStatus[currentQ.id] = "marked";
    
    if (currentIndex < questions.length - 1) {
      if (newStatus[questions[currentIndex + 1].id] === "not_visited") {
        newStatus[questions[currentIndex + 1].id] = "not_answered";
      }
      setCurrentIndex(currentIndex + 1);
    }
    setQStatus(newStatus);
  };

  const handleClearResponse = () => {
    const newAnswers = { ...answers };
    delete newAnswers[currentQ.id];
    setAnswers(newAnswers);
  };

  const jumpToQuestion = (index: number) => {
    const newStatus = { ...qStatus };
    if (!answers[currentQ.id] && newStatus[currentQ.id] !== "marked") {
      newStatus[currentQ.id] = "not_answered";
    }
    if (newStatus[questions[index].id] === "not_visited") {
      newStatus[questions[index].id] = "not_answered";
    }
    setQStatus(newStatus);
    setCurrentIndex(index);
  };

  const handleFinalSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit the exam?")) return;
    setIsSubmitting(true);
    try {
      await submitStudentExamAction(testId, answers);
      setTestComplete(true);
    } catch (error: any) {
      alert("Failed to submit exam. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center flex-col gap-4"><Loader2 className="w-10 h-10 animate-spin text-blue-600"/> <p className="font-bold text-gray-500 tracking-wider">Loading Exam Engine...</p></div>;

  if (testComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-lg shadow-xl text-center max-w-lg w-full animate-in zoom-in">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Submitted!</h1>
          <p className="text-gray-500 font-medium mb-8">Your answers have been securely saved and graded.</p>
          <button onClick={() => router.push("/student/dashboard")} className="w-full bg-blue-600 text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-colors">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-200 font-sans flex flex-col h-screen overflow-hidden select-none">
      
      <div className="bg-white border-b border-gray-300 px-6 py-2 flex justify-between items-center shrink-0">
        <h1 className="font-extrabold text-gray-800 text-lg tracking-wide">FUTURE Q <span className="text-blue-600">CBT ENGINE</span></h1>
        <div className="text-right">
          <p className="text-xs font-bold text-gray-500 uppercase">Candidate Session</p>
          <p className="font-bold text-sm text-gray-800">{testInfo.title}</p>
        </div>
      </div>

      <div className="bg-blue-600 text-white px-6 py-2 flex justify-between items-center shadow-md shrink-0">
        <h2 className="font-bold text-sm uppercase">{testInfo.batch_name}</h2>
        <div className="flex items-center gap-2 bg-black/20 px-4 py-1 rounded-sm border border-black/10">
          <Clock className="w-4 h-4" />
          <span className="font-mono text-lg font-bold tracking-widest">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* QUESTION VIEWER */}
        <div className="flex-1 flex flex-col bg-white m-2 rounded-sm shadow-sm border border-gray-300 overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-300 px-6 py-3 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 text-lg">Question {currentIndex + 1}</h3>
            <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-sm border border-green-200">
              +{currentQ.marks_positive} / -{currentQ.marks_negative} Marks
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <p className="text-lg text-gray-900 font-medium whitespace-pre-wrap mb-10 leading-relaxed">
              {currentQ.question_text}
            </p>

            <div className="space-y-4 max-w-3xl">
              {['A', 'B', 'C', 'D'].map((opt) => (
                <label 
                  key={opt} 
                  onClick={() => handleOptionSelect(opt)}
                  className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'bg-blue-50 border-blue-500 shadow-sm' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${answers[currentQ.id] === opt ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {answers[currentQ.id] === opt && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                  </div>
                  <span className="font-bold text-gray-700 w-8">{opt}.</span>
                  <span className="text-gray-800 font-medium">{currentQ[`option_${opt.toLowerCase()}` as keyof typeof currentQ]}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-100 border-t border-gray-300 px-6 py-4 flex justify-between items-center shrink-0">
            <div className="flex gap-3">
              <button onClick={handleMarkForReview} className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-sm shadow-sm transition-colors text-sm uppercase">
                Mark for Review & Next
              </button>
              <button onClick={handleClearResponse} className="bg-white border border-gray-400 hover:bg-gray-50 text-gray-700 font-bold px-6 py-2.5 rounded-sm shadow-sm transition-colors text-sm uppercase">
                Clear Response
              </button>
            </div>
            <button onClick={handleSaveAndNext} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-2.5 rounded-sm shadow-sm transition-colors text-sm uppercase tracking-wide">
              Save & Next
            </button>
          </div>
        </div>

        {/* NTA PALETTE */}
        <div className="w-80 bg-white m-2 ml-0 rounded-sm shadow-sm border border-gray-300 flex flex-col overflow-hidden shrink-0">
          <div className="bg-gray-100 border-b border-gray-300 px-4 py-3 shrink-0">
            <h4 className="font-bold text-gray-800 text-sm uppercase">Question Palette</h4>
          </div>
          <div className="p-4 border-b border-gray-200 grid grid-cols-2 gap-y-3 gap-x-2 shrink-0 bg-gray-50">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-6 h-6 border border-gray-400 bg-white rounded-sm shrink-0"></div> Not Visited</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-6 h-6 bg-red-500 rounded-sm shrink-0"></div> Not Answered</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600"><div className="w-6 h-6 bg-green-500 rounded-sm shrink-0"></div> Answered</div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-600 col-span-2"><div className="w-6 h-6 bg-purple-600 rounded-full shrink-0"></div> Marked for Review</div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-5 gap-3">
              {questions.map((q, i) => {
                const status = qStatus[q.id] || "not_visited";
                let style = "bg-white border-gray-400 text-gray-700";
                
                if (status === "not_answered") style = "bg-red-500 border-red-600 text-white";
                else if (status === "answered") style = "bg-green-500 border-green-600 text-white";
                else if (status === "marked") style = "bg-purple-600 border-purple-700 text-white rounded-full";

                return (
                  <button 
                    key={q.id}
                    onClick={() => jumpToQuestion(i)}
                    className={`h-10 border shadow-sm font-bold text-sm transition-transform hover:scale-105 flex items-center justify-center ${style} ${status !== 'marked' ? 'rounded-sm' : ''} ${currentIndex === i ? 'ring-2 ring-blue-600 ring-offset-1' : ''}`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-4 border-t border-gray-300 bg-gray-100 shrink-0">
            <button 
              onClick={handleFinalSubmit} disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-sm shadow-md transition-colors uppercase tracking-widest text-sm flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Final Exam"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}