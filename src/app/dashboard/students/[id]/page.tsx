"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, MapPin, 
  BookOpen, Edit3, Download, GraduationCap, Percent, Wallet, AlertTriangle,
  Mail, Users, CreditCard, Receipt, CalendarClock, Tag, ShieldCheck, Plus 
} from "lucide-react";

// Import the real database fetcher
import { getStudentById } from "../../../actions/student-actions";

export default function StudentProfileView() {
  const params = useParams();
  const studentId = params?.id as string;

  const [student, setStudent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    async function loadStudent() {
      setIsLoading(true);
      const response = await getStudentById(studentId);
      
      if (isMounted) {
        if (response.success && response.data) {
          const dbData = response.data;
          
          // =========================================================
          // CRITICAL FIX: Smart Course Name Extraction & Fallback
          // =========================================================
          let finalCourseName = dbData.course_id || "Course Unassigned"; // Uses the text fallback from the DB
          if (dbData.student_subjects && dbData.student_subjects.length > 0) {
            const fetchedNames = dbData.student_subjects
              .map((ss: any) => ss.subjects?.name)
              .filter(Boolean)
              .join(", ");
            if (fetchedNames) finalCourseName = fetchedNames;
          }

          // =========================================================
          // SECURE AADHAAR MASKING (e.g. XXXX-XXXX-4859)
          // =========================================================
          const rawAadhaar = dbData.government_id;
          const maskedAadhaar = rawAadhaar && rawAadhaar.length >= 4 
            ? `XXXX-XXXX-${rawAadhaar.slice(-4)}` 
            : (rawAadhaar ? "[Secured ID]" : "Not Configured");
          
          // DEEP MAPPER: Safely mapping all fields from the 5-Step Wizard
          setStudent({
            id: dbData.id,
            // Step 1: Identity & Demographics
            rollNo: dbData.roll_number || "N/A",
            name: dbData.full_name || "UNKNOWN RECORD",
            phone: dbData.whatsapp_number || "Not Provided",
            email: dbData.email || "Not Configured",
            gender: dbData.gender?.toUpperCase() || "NOT SPECIFIED",
            category: dbData.category || "General",
            aadhar: maskedAadhaar,
            dob: dbData.date_of_birth ? new Date(dbData.date_of_birth).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Not Configured",
            
            // Step 2: Guardians (Primary & Secondary)
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
            
            // Step 3 & 5: Academics & Batch
            batch: dbData.batch_id || "Batch Unassigned",
            course: finalCourseName, 
            admissionDate: dbData.created_at ? new Date(dbData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Unknown",
            status: dbData.status?.toUpperCase() || "ACTIVE",
            
            // Step 4: Financials & POS
            financials: {
              grossFee: Number(dbData.gross_fee) || 0,
              discount: Number(dbData.discount_amount) || 0,
              netFee: (Number(dbData.gross_fee) || 0) - (Number(dbData.discount_amount) || 0),
              paid: Number(dbData.amount_paid) || 0,
              due: ((Number(dbData.gross_fee) || 0) - (Number(dbData.discount_amount) || 0)) - (Number(dbData.amount_paid) || 0),
              paymentMode: dbData.payment_mode || "Cash",
            },
            
            // Address 
            currentAddress: dbData.current_address || "Not Configured",
            permanentAddress: dbData.permanent_address || "Not Configured",
          });
          setFetchError(false);
        } else {
          setFetchError(true);
        }
        setIsLoading(false);
      }
    }

    if (studentId) {
      loadStudent();
    }

    return () => { isMounted = false; };
  }, [studentId]);

  // =========================================================
  // PREMIUM SKELETON LOADER UI
  // =========================================================
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

  // =========================================================
  // ERROR STATE: NOT FOUND
  // =========================================================
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

  // =========================================================
  // MAIN PROFILE RENDER
  // =========================================================
  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
      
      {/* CLASSIC SUB-HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex items-center justify-between shadow-sm z-10 animate-in fade-in slide-in-from-top-2 duration-300">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/students" className="text-cw-blue hover:text-cw-blueDark transition-colors">
            <ArrowLeft className="h-5 w-5" strokeWidth={2.5} />
          </Link>
          <h2 className="text-erp-lg text-gray-900 font-normal uppercase tracking-wide">
            Student Profile : <span className="font-bold">{student.name}</span>
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-white border border-erp-border text-gray-700 px-4 py-1.5 text-erp-base font-bold hover:bg-gray-50 shadow-sm rounded-erp transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Record
          </button>
          <Link 
            href={`/dashboard/enquiries/new?edit=${student.id}`} 
            className="flex items-center gap-1.5 bg-cw-blue border border-cw-blueDark text-white px-4 py-1.5 text-erp-base font-bold hover:bg-cw-blueDark shadow-erp-button rounded-erp transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit Profile
          </Link>
        </div>
      </div>

      {/* THREE-COLUMN DATA DENSITY LAYOUT */}
      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-6 items-start animate-in fade-in duration-500">
        
        {/* LEFT COLUMN: IDENTITY & GUARDIANS */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Identity Card */}
          <div className="bg-white border border-erp-border shadow-sm rounded-erp overflow-hidden">
            <div className="bg-gradient-to-b from-pastel-greenBg to-[#c8e6c9] py-2 text-center border-b border-erp-border">
              <h2 className="text-[#2e7d32] text-erp-md font-bold tracking-wide uppercase">Identity Card</h2>
            </div>
            <div className="flex justify-center py-6 bg-white border-b border-erp-borderLight">
              <div className="w-24 h-28 bg-erp-bg rounded-erp border border-erp-border flex items-center justify-center overflow-hidden shadow-sm">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <DataRow label="Roll No / Adm No" value={student.rollNo} bgClass="bg-pastel-yellowBg" />
              <DataRow label="Student Name" value={student.name} bgClass="bg-pastel-greenBg" boldValue />
              <DataRow label="Target Batch" value={student.batch} bgClass="bg-pastel-blueBg" />
              <DataRow label="Status" value={student.status} bgClass="bg-white" valueColor="text-cw-green" boldValue />
            </div>
          </div>

          {/* Demographics & Contact */}
          <div className="bg-white border border-erp-border shadow-sm rounded-erp p-5">
            <h2 className="text-erp-md font-bold text-cw-blue uppercase mb-4 border-b border-erp-borderLight pb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Demographics & Identity
            </h2>
            <div className="space-y-3 text-erp-base">
              <div className="grid grid-cols-2 gap-y-3">
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Date of Birth</span>{student.dob}</div>
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Gender</span>{student.gender}</div>
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Category</span>{student.category}</div>
                <div><span className="font-bold text-gray-600 block text-[11px] uppercase">Aadhaar Govt ID</span><span className="font-mono text-xs">{student.aadhar}</span></div>
              </div>
              <div className="border-t border-erp-borderLight pt-3 mt-2">
                <div className="flex items-center gap-2 mb-2"><Phone className="w-3.5 h-3.5 text-gray-500" /> <span className="font-medium">{student.phone}</span></div>
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-500" /> <span className="font-medium truncate text-cw-blue">{student.email}</span></div>
              </div>
            </div>
          </div>

          {/* Guardians Configuration */}
          <div className="bg-white border border-erp-border shadow-sm rounded-erp">
            <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex items-center gap-2">
              <Users className="w-4 h-4 text-cw-blue" />
              <h2 className="text-erp-md font-bold text-gray-800 uppercase">Guardian Configuration</h2>
            </div>
            
            <div className="p-5 space-y-4 text-erp-base">
              {/* Primary Guardian */}
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

              {/* Secondary Guardian */}
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

        {/* RIGHT COLUMN: ACADEMICS & FEE LEDGER */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Academic Assignment Snapshot */}
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

            <div className="bg-white border border-erp-border shadow-sm rounded-erp p-5">
              <h2 className="text-erp-md font-bold text-cw-blue uppercase mb-3 border-b border-erp-borderLight pb-2 flex items-center gap-2">
                <Percent className="w-4 h-4" /> Current Metrics
              </h2>
              <div className="space-y-3 text-erp-base flex flex-col justify-center h-full pb-6">
                 <p className="text-gray-500 italic text-center font-medium">Metrics will populate once academic session begins.</p>
              </div>
            </div>
          </div>

          {/* Deep Financial Summary */}
          <div className="bg-white border border-erp-border shadow-sm rounded-erp overflow-hidden">
            <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex items-center justify-between">
              <h2 className="text-erp-md font-bold text-gray-800 uppercase flex items-center gap-2">
                <Wallet className="w-4 h-4 text-cw-blue" /> Financial Ledger & Summary
              </h2>
            </div>
            
            <div className="p-5">
              {/* Financial Math Flow */}
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
                <div className="text-center bg-white border border-cw-blue/30 px-6 py-2 rounded-erp shadow-sm">
                  <p className="text-[11px] font-bold text-cw-blue uppercase">Net Final Fee</p>
                  <p className="text-2xl font-bold text-cw-blue">₹{student.financials.netFee.toLocaleString()}</p>
                </div>
              </div>

              {/* Status Cards */}
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
                    <p className="text-3xl font-bold text-cw-red">₹{student.financials.due.toLocaleString()}</p>
                  </div>
                  <CalendarClock className="w-10 h-10 text-cw-red opacity-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Ledger Table */}
          <div className="bg-white border border-erp-border shadow-sm rounded-erp overflow-hidden">
            <div className="bg-erp-header px-5 py-3 border-b border-erp-border flex items-center justify-between">
              <h2 className="text-erp-md font-bold text-gray-800 uppercase flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cw-blue" /> Transaction History
              </h2>
              {student.financials.due > 0 && (
                <button className="bg-cw-green text-white px-4 py-1.5 text-erp-sm font-bold rounded-erp shadow-erp-button hover:bg-[#006600] transition-colors flex items-center gap-1.5">
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
                {student.financials.paid > 0 ? (
                  <tr className="hover:bg-pastel-blueBg transition-colors border-b border-erp-borderLight">
                    <td className="py-3 px-4 text-gray-700 font-medium">{student.admissionDate}</td>
                    <td className="py-3 px-4 font-bold text-gray-900">Initial Admission Fee</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-gray-100 text-gray-600 border border-gray-300 px-2 py-0.5 text-[11px] font-bold rounded-sm uppercase">{student.financials.paymentMode}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-cw-green">₹{student.financials.paid.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-cw-blue hover:underline font-bold flex items-center justify-center gap-1 mx-auto text-[11px]">
                        <Download className="w-3.5 h-3.5" /> Print
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr className="border-b border-erp-borderLight">
                    <td colSpan={5} className="py-6 text-center text-gray-500 font-medium italic">No payments have been recorded yet.</td>
                  </tr>
                )}
                
                {student.financials.due > 0 && (
                  <tr className="bg-pastel-redBg hover:brightness-95 transition-colors">
                    <td className="py-3 px-4 text-cw-red font-bold">Pending</td>
                    <td className="py-3 px-4 font-bold text-cw-red">Remaining Ledger Balance</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-gray-400 text-xl">-</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-cw-red">₹{student.financials.due.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="bg-white text-cw-red border border-cw-red px-2 py-0.5 text-[10px] font-bold shadow-sm uppercase">Overdue</span>
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

// Utility component for the Identity Card rows using native Tailwind v4 ERP variables
function DataRow({ label, value, bgClass = "bg-white", boldValue = false, valueColor = "text-gray-900" }: { label: string; value: string; bgClass?: string; boldValue?: boolean; valueColor?: string; }) {
  return (
    <div className={`flex items-center ${bgClass} px-4 py-3 border-b border-erp-borderLight hover:brightness-95 transition-all`}>
      <span className="w-2/5 text-cw-blue font-bold text-erp-sm uppercase tracking-wide truncate">{label}</span>
      <span className={`w-3/5 ${valueColor} ${boldValue ? 'font-bold' : 'font-medium'} text-erp-base truncate pl-2`} title={value}>{value}</span>
    </div>
  );
}