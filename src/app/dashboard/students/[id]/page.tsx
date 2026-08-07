"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, MapPin, 
  BookOpen, Edit3, Download, GraduationCap, Percent, Wallet, AlertTriangle,
  Mail, Users, CreditCard, Receipt, CalendarClock, Tag, ShieldCheck, Plus, 
  ShieldAlert, PowerOff, Trash2, Loader2, CalendarCheck, X, IndianRupee, CheckCircle2
} from "lucide-react";

// Import the real database fetchers and actions
import { 
  getStudentById, 
  toggleStudentStatusAction, 
  deleteStudentAction,
  collectPaymentAction // NEW: POS Backend Action
} from "../../../actions/student-actions";

export default function StudentProfileView() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  // --- NEW: PAYMENT POS MODAL STATE ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [payAmount, setPayAmount] = useState<string>("");
  const [payMode, setPayMode] = useState("Cash");
  const [payParticulars, setPayParticulars] = useState("Fee Installment");

  async function loadStudent() {
    setIsLoading(true);
    const response = await getStudentById(studentId);
    
    if (response.success && response.data) {
      const dbData = response.data;
      
      let finalCourseName = dbData.course_id || "Course Unassigned"; 
      if (dbData.student_subjects && dbData.student_subjects.length > 0) {
        const fetchedNames = dbData.student_subjects
          .map((ss: any) => ss.subjects?.name)
          .filter(Boolean)
          .join(", ");
        if (fetchedNames) finalCourseName = fetchedNames;
      }

      // SECURE GOVT ID HANDLING
      const maskedAadhaar = dbData.government_id ? "[Aadhaar Redacted]" : "Not Configured";
      
      // =========================================================
      // DEEP ATTENDANCE CALCULATOR
      // =========================================================
      const attendanceRecords = dbData.attendance || [];
      const totalSessions = attendanceRecords.length;
      const presentCount = attendanceRecords.filter((a: any) => a.status === "present").length;
      const absentCount = attendanceRecords.filter((a: any) => a.status === "absent").length;
      const lateCount = attendanceRecords.filter((a: any) => a.status === "late").length;
      
      // We calculate percentage treating "Late" as attended class
      const attPercentage = totalSessions > 0 
        ? Math.round(((presentCount + lateCount) / totalSessions) * 100) 
        : 0;

      // =========================================================
      // DEEP FINANCIAL CALCULATOR & LEDGER SORTING
      // =========================================================
      const gross = Number(dbData.gross_fee) || 0;
      const discount = Number(dbData.discount_amount) || 0;
      const netFee = gross - discount;
      const paid = Number(dbData.amount_paid) || 0;
      const due = Math.max(0, netFee - paid);

      const rawCollections = dbData.fee_collections || [];
      const sortedCollections = rawCollections.sort((a: any, b: any) => 
        new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime()
      );

      setStudent({
        id: dbData.id,
        rollNo: dbData.roll_number || "N/A",
        name: dbData.full_name || "UNKNOWN RECORD",
        phone: dbData.whatsapp_number || "Not Provided",
        email: dbData.email || "Not Configured",
        gender: dbData.gender?.toUpperCase() || "NOT SPECIFIED",
        category: dbData.category || "General",
        aadhar: maskedAadhaar,
        dob: dbData.date_of_birth ? new Date(dbData.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Not Configured",
        
        primaryGuardian: {
          name: dbData.guardian_name || dbData.father_name || "Not Configured",
          relation: dbData.guardian_relation || "Father",
          phone: dbData.parent_phone || "Not Provided",
          email: dbData.guardian_email || "Not Configured",
        },
        secondaryGuardian: {
          name: dbData.sec_guardian_name || dbData.mother_name || "Not Configured",
          relation: dbData.sec_guardian_relation || "Mother",
          phone: dbData.sec_guardian_phone || "Not Provided",
          email: dbData.sec_guardian_email || "Not Configured",
        },
        
        batch: dbData.batch_id || "Batch Unassigned",
        course: finalCourseName, 
        admissionDate: dbData.created_at ? new Date(dbData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Unknown",
        status: dbData.status?.toUpperCase() || "ACTIVE", 
        
        attendance: {
          total: totalSessions,
          present: presentCount,
          absent: absentCount,
          late: lateCount,
          percentage: attPercentage
        },

        financials: {
          grossFee: gross,
          discount: discount,
          netFee: netFee,
          paid: paid,
          due: due,
          paymentMode: dbData.payment_mode || "Cash",
        },
        transactions: sortedCollections,
      });
      setFetchError(false);
    } else {
      setFetchError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  // --- ACTIONS ---
  const handleToggleStatus = async () => {
    const isCurrentlyActive = student.status === "ACTIVE";
    if (!window.confirm(`Are you sure you want to mark this student as ${isCurrentlyActive ? "INACTIVE" : "ACTIVE"}?`)) return;
    
    setIsProcessing(true);
    try {
      await toggleStudentStatusAction(student.id, isCurrentlyActive ? "active" : "inactive");
      await loadStudent(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to PERMANENTLY delete this student? All attendance and fee ledgers tied to them will be wiped. This cannot be undone.")) return;
    
    setIsProcessing(true);
    try {
      await deleteStudentAction(student.id);
      router.push("/dashboard/students"); 
    } catch (err: any) {
      alert(err.message);
      setIsProcessing(false);
    }
  };

  // --- NEW: HANDLE PAYMENT SUBMISSION ---
  const handleProcessPayment = async () => {
    const amountNum = Number(payAmount);
    if (!amountNum || amountNum <= 0) return alert("Enter a valid amount.");
    if (amountNum > student.financials.due) return alert("Amount exceeds the pending balance!");

    setIsProcessingPayment(true);
    try {
      await collectPaymentAction(student.id, amountNum, payMode, payParticulars);
      setIsPaymentModalOpen(false); // Close Modal
      setPayAmount(""); // Reset Field
      setPayParticulars("Fee Installment"); // Reset
      await loadStudent(); // Deeply Refresh Page Data to show new transaction!
      alert("Payment successfully recorded into the ledger!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-erp-bg flex flex-col pb-10">
        <div className="h-14 bg-white border-b border-erp-border animate-pulse shadow-sm" />
        <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1 space-y-6">
            <div className="h-[450px] bg-gray-200/60 animate-pulse rounded-erp border border-erp-borderLight" />
            <div className="h-[250px] bg-gray-200/60 animate-pulse rounded-erp border border-erp-borderLight" />
          </div>
          <div className="xl:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="h-[120px] bg-gray-200/60 animate-pulse rounded-erp border border-erp-borderLight" />
              <div className="h-[120px] bg-gray-200/60 animate-pulse rounded-erp border border-erp-borderLight" />
            </div>
            <div className="h-[250px] bg-gray-200/60 animate-pulse rounded-erp border border-erp-borderLight" />
            <div className="h-[300px] bg-gray-200/60 animate-pulse rounded-erp border border-erp-borderLight" />
          </div>
        </div>
      </main>
    );
  }

  if (fetchError || !student) {
    return (
      <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
        <div className="px-6 py-3 border-b border-erp-border bg-white flex items-center gap-4 shadow-sm">
          <Link href="/dashboard/students" className="text-cw-blue hover:text-cw-blueDark">
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide">Record Not Found</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white border border-erp-border p-8 rounded-erp shadow-sm text-center max-w-md">
            <AlertTriangle className="w-10 h-10 text-cw-red mx-auto mb-3" />
            <h3 className="text-erp-lg font-bold text-gray-800 mb-2">Invalid Student ID</h3>
            <p className="text-erp-base text-gray-600 mb-6">The system could not locate a master record for ID: <span className="font-mono bg-erp-bg px-1 border border-erp-border break-all">{studentId}</span></p>
            <Link href="/dashboard/students" className="bg-cw-blue text-white px-6 py-2 rounded-erp font-bold hover:bg-cw-blueDark transition-colors shadow-erp-button">
              Return to Directory
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isInactive = student.status === "INACTIVE";

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10 relative">
      
      {/* ================================================================= */}
      {/* POS PAYMENT MODAL OVERLAY */}
      {/* ================================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-erp shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-cw-blue p-4 flex justify-between items-center text-white">
              <h3 className="font-bold flex items-center gap-2 text-lg"><IndianRupee className="w-5 h-5"/> POS Collection</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="hover:bg-white/20 p-1 rounded-sm transition-colors"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-pastel-blueBg border border-pastel-blueBorder p-3 rounded-sm flex justify-between items-center shadow-inner">
                <span className="text-erp-sm font-bold text-cw-blueDark uppercase">Balance Due:</span>
                <span className="text-xl font-bold text-cw-red">₹{student.financials.due.toLocaleString()}</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Amount Collecting Today (₹) <span className="text-cw-red">*</span></label>
                <input 
                  type="number" 
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder={`Max: ${student.financials.due}`}
                  max={student.financials.due}
                  className="w-full text-2xl font-bold text-cw-green border-2 border-cw-green focus:border-cw-blue bg-pastel-greenBg p-3 outline-none transition-colors shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Payment Mode <span className="text-cw-red">*</span></label>
                <select 
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  className="w-full border border-erp-border p-2.5 font-bold text-gray-900 outline-none focus:border-cw-blue cursor-pointer shadow-inner"
                >
                  <option value="Cash">Cash at Counter</option>
                  <option value="UPI">UPI / QR Scan</option>
                  <option value="Card">Credit/Debit Card (POS)</option>
                  <option value="Bank">Bank Cheque / NEFT</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-erp-sm font-bold text-gray-700">Particulars / Remarks <span className="text-cw-red">*</span></label>
                <input 
                  type="text" 
                  value={payParticulars}
                  onChange={(e) => setPayParticulars(e.target.value)}
                  className="w-full border border-erp-border p-2.5 text-erp-base outline-none focus:border-cw-blue shadow-inner"
                />
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-erp-border flex gap-3">
              <button 
                onClick={() => setIsPaymentModalOpen(false)} 
                className="flex-1 bg-white border border-erp-border text-gray-700 py-2.5 font-bold rounded-erp hover:bg-gray-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleProcessPayment} 
                disabled={isProcessingPayment || !payAmount}
                className="flex-1 bg-cw-green text-white py-2.5 font-bold rounded-erp hover:bg-[#006600] flex items-center justify-center gap-2 shadow-erp-button disabled:opacity-50 transition-colors"
              >
                {isProcessingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================================================================= */}


      {/* CLASSIC SUB-HEADER WITH ADVANCED CONTROLS */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex items-center justify-between shadow-sm z-10 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students" className="text-cw-blue hover:text-cw-blueDark transition-colors">
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <h2 className="text-erp-lg text-gray-900 font-normal uppercase tracking-wide flex items-center gap-2">
            Student Profile : <span className={`font-bold ${isInactive ? 'text-gray-500 line-through' : 'text-gray-900'}`}>{student.name}</span>
          </h2>
        </div>
        
        {/* RIGID ERP ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          {isInactive && (
            <span className="bg-pastel-redBg text-cw-red px-3 py-1.5 text-[11px] font-bold uppercase rounded-sm border border-pastel-redBorder flex items-center gap-1.5 shadow-sm mr-2 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" /> Inactive Record
            </span>
          )}
          
          <button 
            onClick={handleToggleStatus}
            disabled={isProcessing}
            title={isInactive ? "Reactivate Student" : "Mark as Inactive"}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-erp-sm font-bold shadow-sm rounded-erp transition-colors border disabled:opacity-50 ${
              isInactive 
                ? "bg-pastel-greenBg text-cw-green border-pastel-greenBorder hover:bg-[#d4edda]" 
                : "bg-pastel-yellowBg text-[#f57f17] border-pastel-yellowBorder hover:bg-[#fff9c4]"
            }`}
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PowerOff className="w-3.5 h-3.5" />}
            {isInactive ? "Reactivate" : "Disable"}
          </button>

          <button 
            onClick={handleDelete}
            disabled={isProcessing}
            title="Permanently Delete Record"
            className="flex items-center gap-1.5 bg-pastel-redBg border border-pastel-redBorder text-cw-red px-3 py-1.5 text-erp-sm font-bold hover:bg-[#f8d7da] shadow-sm rounded-erp transition-colors disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </button>

          <div className="w-[1px] h-6 bg-erp-border mx-1"></div>

          <button className="flex items-center gap-1.5 bg-white border border-erp-border text-gray-700 px-3 py-1.5 text-erp-sm font-bold hover:bg-gray-50 shadow-sm rounded-erp transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>

          <Link 
            href={`/dashboard/enquiries/new?edit=${student.id}`} 
            className="flex items-center gap-1.5 bg-cw-blue border border-cw-blueDark text-white px-4 py-1.5 text-erp-sm font-bold hover:bg-cw-blueDark shadow-erp-button rounded-erp transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </Link>
        </div>
      </div>

      {/* THREE-COLUMN DATA DENSITY LAYOUT */}
      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-6 items-start animate-in fade-in duration-500">
        
        {/* LEFT COLUMN: IDENTITY & GUARDIANS */}
        <div className="xl:col-span-1 space-y-6">
          
          <div className={`bg-white border shadow-sm rounded-erp overflow-hidden transition-colors ${isInactive ? 'border-pastel-redBorder' : 'border-erp-border'}`}>
            <div className={`py-2 text-center border-b border-erp-border ${isInactive ? 'bg-gray-200' : 'bg-gradient-to-b from-pastel-greenBg to-[#c8e6c9]'}`}>
              <h2 className={`${isInactive ? 'text-gray-600' : 'text-[#2e7d32]'} text-erp-md font-bold tracking-wide uppercase`}>
                Identity Card
              </h2>
            </div>
            <div className="flex justify-center py-6 bg-white border-b border-erp-borderLight">
              <div className={`w-24 h-28 rounded-erp border flex items-center justify-center overflow-hidden shadow-sm ${isInactive ? 'bg-gray-100 border-gray-300' : 'bg-erp-bg border-erp-border'}`}>
                <User className={`w-12 h-12 ${isInactive ? 'text-gray-300' : 'text-gray-400'}`} />
              </div>
            </div>
            <div className={`flex flex-col ${isInactive ? 'opacity-70' : ''}`}>
              <DataRow label="Roll No / Adm No" value={student.rollNo} bgClass="bg-pastel-yellowBg" />
              <DataRow label="Student Name" value={student.name} bgClass="bg-pastel-greenBg" boldValue />
              <DataRow label="Target Batch" value={student.batch} bgClass="bg-pastel-blueBg" />
              <DataRow 
                label="Status" 
                value={student.status} 
                bgClass="bg-white" 
                valueColor={isInactive ? "text-cw-red" : "text-cw-green"} 
                boldValue 
              />
            </div>
          </div>

          <div className="bg-white border border-erp-border shadow-sm rounded-erp p-5">
            <h2 className="text-erp-md font-bold text-cw-blue uppercase mb-4 border-b border-erp-borderLight pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Demographics & Identity
            </h2>
            <div className="space-y-3 text-erp-base">
              <div className="grid grid-cols-2 gap-y-3">
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Date of Birth</span>{student.dob}</div>
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Gender</span>{student.gender}</div>
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Category</span>{student.category}</div>
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Govt ID</span><span className="font-mono text-xs text-gray-500">{student.aadhar}</span></div>
              </div>
              <div className="border-t border-erp-borderLight pt-3 mt-2">
                <div className="flex items-center gap-2 mb-2"><Phone className="w-3.5 h-3.5 text-gray-500" /> <span className="font-medium">{student.phone}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-500" /> <span className="font-medium truncate text-cw-blue">{student.email}</span></div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-erp-border shadow-sm rounded-erp">
            <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex items-center gap-2">
              <Users className="w-4 h-4 text-cw-blue" />
              <h2 className="text-erp-md font-bold text-gray-800 uppercase">Guardian Configuration</h2>
            </div>
            <div className="p-5 space-y-4 text-erp-base">
              <div className="border border-erp-borderLight rounded-erp p-3 bg-pastel-blueBg/30">
                <span className="text-[10px] font-bold uppercase text-cw-blue bg-white px-2 py-0.5 border border-cw-blue/20 rounded-sm mb-2 inline-block">Primary Contact</span>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-gray-700">{student.primaryGuardian.name}</span>
                  <span className="text-gray-500 text-sm">({student.primaryGuardian.relation})</span>
                </div>
                <div className="flex flex-col text-sm text-gray-600">
                  <span>Phone: <span className="font-medium text-gray-900">{student.primaryGuardian.phone}</span></span>
                  <span className="truncate">Email: {student.primaryGuardian.email}</span>
                </div>
              </div>

              <div className="border border-erp-borderLight rounded-erp p-3">
                <span className="text-[10px] font-bold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 border border-gray-200 rounded-sm mb-2 inline-block">Secondary Contact</span>
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-gray-700">{student.secondaryGuardian.name}</span>
                  <span className="text-gray-500 text-sm">({student.secondaryGuardian.relation})</span>
                </div>
                <div className="flex flex-col text-sm text-gray-600">
                  <span>Phone: <span className="font-medium text-gray-900">{student.secondaryGuardian.phone}</span></span>
                  <span className="truncate">Email: {student.secondaryGuardian.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACADEMICS, ATTENDANCE & FEE LEDGER */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-erp-border shadow-sm rounded-erp p-5">
              <h2 className="text-erp-md font-bold text-cw-blue uppercase mb-3 border-b border-erp-borderLight pb-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" /> Academic Assignment
              </h2>
              <div className="space-y-3 text-erp-base">
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600">Enrolled Course:</span>
                  <span className="font-bold text-gray-900 truncate pl-4">{student.course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-gray-600">Admission Date:</span>
                  <span className="font-medium text-gray-900">{student.admissionDate}</span>
                </div>
              </div>
            </div>

            {/* LIVE ATTENDANCE SNAPSHOT CARD */}
            <div className="bg-white border border-erp-border shadow-sm rounded-erp p-5 flex flex-col">
              <h2 className="text-erp-md font-bold text-cw-blue uppercase mb-3 border-b border-erp-borderLight pb-2 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4" /> Attendance Overview
              </h2>
              
              {student.attendance.total === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 italic text-center text-sm font-medium">No attendance records mapped yet.</p>
                </div>
              ) : (
                <div className="space-y-4 text-erp-base">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-600">Overall Attendance</span>
                    <span className={`text-xl font-bold ${student.attendance.percentage >= 75 ? 'text-cw-green' : student.attendance.percentage >= 50 ? 'text-[#f57f17]' : 'text-cw-red'}`}>
                      {student.attendance.percentage}%
                    </span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${student.attendance.percentage >= 75 ? 'bg-cw-green' : student.attendance.percentage >= 50 ? 'bg-[#f57f17]' : 'bg-cw-red'}`} style={{ width: `${student.attendance.percentage}%` }}></div>
                  </div>
                  
                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3 text-center pt-2">
                    <div className="bg-pastel-greenBg border border-pastel-greenBorder rounded-sm p-2 shadow-sm">
                      <span className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Present</span>
                      <span className="text-lg font-bold text-cw-green">{student.attendance.present}</span>
                    </div>
                    <div className="bg-pastel-redBg border border-pastel-redBorder rounded-sm p-2 shadow-sm">
                      <span className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Absent</span>
                      <span className="text-lg font-bold text-cw-red">{student.attendance.absent}</span>
                    </div>
                    <div className="bg-pastel-yellowBg border border-pastel-yellowBorder rounded-sm p-2 shadow-sm">
                      <span className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Late</span>
                      <span className="text-lg font-bold text-[#f57f17]">{student.attendance.late}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`bg-white border shadow-sm rounded-erp overflow-hidden transition-colors ${isInactive ? 'opacity-80 border-gray-300' : 'border-erp-border'}`}>
            <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex items-center justify-between">
              <h2 className="text-erp-md font-bold text-gray-800 uppercase flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cw-blue" /> Financial Ledger & Summary
              </h2>
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-center mb-6 bg-gray-50 border border-erp-borderLight p-4 rounded-erp">
                <div className="text-center">
                  <p className="text-[11px] font-bold text-gray-500 uppercase">Gross Fee</p>
                  <p className="text-lg font-bold text-gray-800">₹{student.financials.grossFee.toLocaleString()}</p>
                </div>
                <div className="text-gray-400 font-bold text-xl">-</div>
                <div className="text-center">
                  <p className="text-[11px] font-bold text-gray-500 uppercase flex items-center justify-center gap-1"><Tag className="w-3 h-3"/> Discount</p>
                  <p className="text-lg font-bold text-cw-red">₹{student.financials.discount.toLocaleString()}</p>
                </div>
                <div className="text-gray-400 font-bold text-xl">=</div>
                <div className={`text-center bg-white border px-6 py-2 rounded-erp shadow-sm ${isInactive ? 'border-gray-300' : 'border-cw-blue/30'}`}>
                  <p className={`text-[11px] font-bold uppercase ${isInactive ? 'text-gray-500' : 'text-cw-blue'}`}>Net Final Fee</p>
                  <p className={`text-2xl font-bold ${isInactive ? 'text-gray-500 line-through' : 'text-cw-blue'}`}>₹{student.financials.netFee.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-pastel-greenBg border border-pastel-greenBorder p-4 rounded-erp shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-erp-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Total Paid</p>
                    <p className="text-3xl font-bold text-cw-green">₹{student.financials.paid.toLocaleString()}</p>
                  </div>
                  <Receipt className="w-10 h-10 text-cw-green opacity-20" />
                </div>
                <div className="bg-pastel-redBg border border-pastel-redBorder p-4 rounded-erp shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-erp-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Balance Due</p>
                    <p className={`text-3xl font-bold ${isInactive ? 'text-gray-500 line-through' : 'text-cw-red'}`}>₹{student.financials.due.toLocaleString()}</p>
                  </div>
                  <CalendarClock className={`w-10 h-10 opacity-20 ${isInactive ? 'text-gray-500' : 'text-cw-red'}`} />
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-white border shadow-sm rounded-erp overflow-hidden transition-colors ${isInactive ? 'opacity-80 border-gray-300' : 'border-erp-border'}`}>
            <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex items-center justify-between">
              <h2 className="text-erp-md font-bold text-gray-800 uppercase flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cw-blue" /> Transaction History
              </h2>
              {/* TRIGGER POS PAYMENT MODAL */}
              {student.financials.due > 0 && !isInactive && (
                <button 
                  onClick={() => {
                    setPayAmount(student.financials.due.toString()); // Auto-fill balance due
                    setIsPaymentModalOpen(true);
                  }}
                  className="bg-cw-green text-white px-4 py-1.5 text-erp-sm font-bold rounded-erp shadow-erp-button hover:bg-[#006600] transition-colors flex items-center gap-1.5 animate-bounce-short"
                >
                  <Plus className="w-3.5 h-3.5" /> Collect Payment
                </button>
              )}
            </div>
            
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-erp-border text-erp-sm text-gray-600">
                  <th className="font-bold py-3 px-4">Date</th>
                  <th className="font-bold py-3 px-4">Particulars</th>
                  <th className="font-bold py-3 px-4 text-center">Mode</th>
                  <th className="font-bold py-3 px-4 text-right">Amount</th>
                  <th className="font-bold py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white text-erp-base">
                
                {/* DYNAMIC DB TRANSACTIONS (FEE COLLECTIONS) */}
                {student.transactions && student.transactions.length > 0 ? (
                  student.transactions.map((tx: any) => (
                    <tr key={tx.id} className="hover:bg-pastel-blueBg transition-colors border-b border-erp-borderLight">
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {new Date(tx.collection_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{tx.particulars}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="bg-gray-100 text-gray-600 border border-gray-300 px-2 py-0.5 text-[10px] font-bold rounded-sm uppercase tracking-wider">{tx.payment_mode}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-cw-green">₹{Number(tx.amount).toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <button className="text-cw-blue hover:underline font-bold flex items-center justify-center gap-1 mx-auto text-[11px]">
                          <Download className="w-3.5 h-3.5" /> Print
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b border-erp-borderLight">
                    <td colSpan={5} className="py-8 text-center text-gray-500 font-medium italic">No payments have been recorded in the ledger yet.</td>
                  </tr>
                )}
                
                {/* PENDING BALANCE ROW */}
                {student.financials.due > 0 && (
                  <tr className={`${isInactive ? 'bg-gray-50' : 'bg-pastel-redBg'} hover:brightness-95 transition-colors border-t border-erp-border`}>
                    <td className={`py-3 px-4 font-bold ${isInactive ? 'text-gray-500' : 'text-cw-red'}`}>Pending</td>
                    <td className={`py-3 px-4 font-bold ${isInactive ? 'text-gray-500' : 'text-cw-red'}`}>Remaining Ledger Balance</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-400 text-xl">-</span>
                    </td>
                    <td className={`py-3 px-4 text-right font-bold ${isInactive ? 'text-gray-500 line-through' : 'text-cw-red'}`}>₹{student.financials.due.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`bg-white px-2 py-0.5 text-[10px] font-bold shadow-sm uppercase border ${isInactive ? 'text-gray-500 border-gray-300' : 'text-cw-red border-cw-red'}`}>
                        {isInactive ? 'Frozen' : 'Overdue'}
                      </span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </main>
  );
}

function DataRow({ label, value, bgClass = "bg-white", boldValue = false, valueColor = "text-gray-900" }: { label: string; value: string; bgClass?: string; boldValue?: boolean; valueColor?: string; }) {
  return (
    <div className={`flex items-center ${bgClass} px-4 py-3 border-b border-erp-borderLight hover:brightness-95 transition-all`}>
      <span className="w-2/5 text-cw-blue font-bold text-erp-sm uppercase tracking-wide truncate">{label}</span>
      <span className={`w-3/5 ${valueColor} ${boldValue ? 'font-bold' : 'font-medium'} text-erp-base truncate pl-2`} title={value}>{value}</span>
    </div>
  );
}