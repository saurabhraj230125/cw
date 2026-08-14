"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Printer, Building2, Phone, MapPin,
  Banknote, Smartphone, CreditCard, Landmark,
  CheckCircle2, AlertTriangle, Loader2,
  GraduationCap, Hash, CalendarDays,
} from "lucide-react";
import { getStudentById } from "../../../../../actions/student-actions";

// ============================================================
// AMOUNT TO WORDS UTILITY (Indian Number System)
// ============================================================
function amountToWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function convertHundreds(n: number): string {
    let result = "";
    if (n >= 100) { result += ones[Math.floor(n / 100)] + " Hundred "; n %= 100; }
    if (n >= 20) { result += tens[Math.floor(n / 10)] + " "; n %= 10; }
    if (n > 0) result += ones[n] + " ";
    return result;
  }
  let words = "";
  if (num >= 10000000) { words += convertHundreds(Math.floor(num / 10000000)) + "Crore "; num %= 10000000; }
  if (num >= 100000) { words += convertHundreds(Math.floor(num / 100000)) + "Lakh "; num %= 100000; }
  if (num >= 1000) { words += convertHundreds(Math.floor(num / 1000)) + "Thousand "; num %= 1000; }
  if (num > 0) { words += convertHundreds(num); }
  return words.trim() + " Rupees Only";
}

// ============================================================
// PAYMENT MODE ICON TAG
// ============================================================
function PaymentModeTag({ mode }: { mode: string }) {
  const lc = (mode || "").toLowerCase();
  let Icon = Banknote;
  let colorClass = "bg-green-50 text-green-700 border-green-200";
  if (lc === "upi") { Icon = Smartphone; colorClass = "bg-violet-50 text-violet-700 border-violet-200"; }
  else if (lc === "card") { Icon = CreditCard; colorClass = "bg-sky-50 text-sky-700 border-sky-200"; }
  else if (lc === "bank" || lc === "neft" || lc === "cheque") { Icon = Landmark; colorClass = "bg-orange-50 text-orange-700 border-orange-200"; }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
      <Icon className="w-3.5 h-3.5" />{mode}
    </span>
  );
}

function generateReceiptNo(txId: string): string {
  const hash = txId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `REC-${(hash % 90000) + 10000}`;
}

function DetailItem({ label, value, bold = false, icon }: { label: string; value: string; bold?: boolean; icon?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 flex items-center gap-1">{icon}{label}</p>
      <p className={`text-sm ${bold ? "font-black text-slate-800" : "font-semibold text-slate-700"}`}>{value}</p>
    </div>
  );
}

// ============================================================
// MAIN RECEIPT PAGE
// ============================================================
export default function FeeReceiptPage() {
  const params = useParams();
  const studentId = params?.id as string;
  const txId = params?.txId as string;
  const [student, setStudent] = useState<any>(null);
  const [transaction, setTransaction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const response = await getStudentById(studentId);
      if (response.success && response.data) {
        const dbData = response.data;
        let courseName = dbData.course_id || "Course Unassigned";
        if (dbData.student_subjects && dbData.student_subjects.length > 0) {
          const names = dbData.student_subjects.map((ss: any) => ss.subjects?.name).filter(Boolean).join(", ");
          if (names) courseName = names;
        }
        const tx = (dbData.fee_collections || []).find((fc: any) => fc.id === txId);
        if (!tx) { setFetchError(true); setIsLoading(false); return; }
        setStudent({
          id: dbData.id,
          name: dbData.full_name || "N/A",
          rollNo: dbData.roll_number || "N/A",
          batch: dbData.batch_id || "N/A",
          course: courseName,
          phone: dbData.whatsapp_number || "N/A",
          guardianName: dbData.guardian_name || dbData.father_name || "N/A",
        });
        setTransaction(tx);
        setFetchError(false);
      } else { setFetchError(true); }
      setIsLoading(false);
    }
    if (studentId && txId) loadData();
  }, [studentId, txId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-[#0055a5] mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Generating Receipt...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !student || !transaction) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-xl p-10 text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-800 mb-2">Receipt Not Found</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Transaction ID <span className="font-mono bg-gray-100 px-1 rounded">{txId}</span> could not be located for this student.
          </p>
          <Link href={`/dashboard/students/${studentId}`} className="inline-flex items-center gap-2 bg-[#0055a5] text-white px-6 py-2.5 rounded font-bold hover:bg-[#004080] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const receiptNo = generateReceiptNo(transaction.id);
  const txDate = new Date(transaction.collection_date);
  const formattedDate = txDate.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const formattedTime = txDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  const amount = Number(transaction.amount);
  const amountWords = amountToWords(amount);

  return (
    <>
      <style>{`
        @media print {
          @page { size: A4; margin: 0; }
          body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .no-print { display: none !important; }
          .print-page { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; border: none !important; max-width: 100% !important; }
        }
      `}</style>

      {/* ---- FLOATING ACTION BAR (screen only) ---- */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link
            href={`/dashboard/students/${studentId}`}
            className="flex items-center gap-2 text-[#0055a5] font-bold text-sm hover:text-[#004080] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Student Profile
          </Link>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-bold">Receipt</p>
              <p className="text-sm font-black text-gray-700">#{receiptNo}</p>
            </div>
            <button
              id="btn-print-receipt"
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-[#0055a5] text-white px-5 py-2.5 rounded font-black text-sm hover:bg-[#004080] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              <Printer className="w-4 h-4" />
              Print / Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* ---- PAGE BACKGROUND + PAPER CONTAINER ---- */}
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 pt-20 pb-16 px-4">
        <div className="print-page max-w-3xl mx-auto bg-white shadow-2xl border border-slate-200 overflow-hidden font-sans">

          {/* TOP BRAND BAR */}
          <div className="h-2 bg-gradient-to-r from-[#0055a5] via-[#0077cc] to-[#0055a5]" />

          {/* ---- HEADER: INSTITUTE + RECEIPT META ---- */}
          <div className="px-12 pt-10 pb-8 flex items-start justify-between border-b border-slate-100">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-50 border-2 border-[#0055a5]/20 rounded-xl flex items-center justify-center shrink-0 shadow-inner">
                <Building2 className="w-8 h-8 text-[#0055a5]" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0055a5] tracking-tight leading-tight">Future Q Coaching</h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />123, Education Hub, Sector 18, Noida, UP - 201301
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3" />+91 98765 43210 | info@futureqcoaching.in
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-3xl font-black text-slate-700 tracking-widest uppercase">Fee Receipt</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="text-gray-500">
                  <span className="font-bold text-gray-700">Receipt No:</span>{" "}
                  <span className="font-black text-[#0055a5]">#{receiptNo}</span>
                </p>
                <p className="text-gray-500"><span className="font-bold text-gray-700">Date:</span> {formattedDate}</p>
                <p className="text-gray-400 text-xs">Time: {formattedTime}</p>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />Payment Confirmed
                </span>
              </div>
            </div>
          </div>

          {/* ---- STUDENT DETAILS ---- */}
          <div className="px-12 py-7 bg-slate-50 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-4 h-4 text-[#0055a5]" />
              <h2 className="text-xs font-black text-[#0055a5] uppercase tracking-widest">Student Details</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <DetailItem label="Student Name" value={student.name} bold />
              <DetailItem label="Roll No / Adm. No" value={student.rollNo} icon={<Hash className="w-3 h-3" />} />
              <DetailItem label="Batch" value={student.batch} />
              <DetailItem label="Course / Subject" value={student.course} />
              <DetailItem label="Contact No." value={student.phone} />
              <DetailItem label="Guardian Name" value={student.guardianName} />
            </div>
          </div>

          {/* ---- TRANSACTION TABLE ---- */}
          <div className="px-12 py-7">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />Transaction Details
            </h2>
            <table className="w-full border border-slate-200 overflow-hidden text-sm">
              <thead>
                <tr className="bg-[#0055a5] text-white">
                  <th className="py-3 px-4 text-left font-black text-xs uppercase tracking-wider w-12">S.No</th>
                  <th className="py-3 px-4 text-left font-black text-xs uppercase tracking-wider">Description / Particulars</th>
                  <th className="py-3 px-4 text-center font-black text-xs uppercase tracking-wider w-36">Payment Mode</th>
                  <th className="py-3 px-4 text-right font-black text-xs uppercase tracking-wider w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-slate-400 font-bold text-center">01</td>
                  <td className="py-4 px-4">
                    <p className="font-black text-slate-800">{transaction.particulars || "Tuition Fee"}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Batch: {student.batch} - {formattedDate}</p>
                  </td>
                  <td className="py-4 px-4 text-center"><PaymentModeTag mode={transaction.payment_mode || "Cash"} /></td>
                  <td className="py-4 px-4 text-right font-black text-slate-800 text-base">Rs. {amount.toLocaleString("en-IN")}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50">
                  <td colSpan={2} />
                  <td className="py-3 px-4 text-right text-xs font-black text-slate-500 uppercase tracking-wider">Total Amount</td>
                  <td className="py-3 px-4 text-right">
                    <span className="text-xl font-black text-[#0055a5]">Rs. {amount.toLocaleString("en-IN")}</span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ---- AMOUNT IN WORDS + SIGNATORY ---- */}
          <div className="px-12 pb-10 flex items-end justify-between gap-8">
            <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-[10px] font-black text-[#0055a5] uppercase tracking-widest mb-1">Amount in Words</p>
              <p className="text-sm font-black text-slate-700 capitalize leading-snug">{amountWords}</p>
            </div>
            <div className="text-center min-w-[180px]">
              <div className="w-36 h-16 mx-auto border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-2 bg-slate-50">
                <div className="text-center">
                  <Building2 className="w-5 h-5 text-[#0055a5]/40 mx-auto" />
                  <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Official Seal</p>
                </div>
              </div>
              <div className="border-t border-slate-300 pt-2 mt-1">
                <p className="text-xs font-black text-slate-600">Authorized Signatory</p>
                <p className="text-[10px] text-slate-400">Future Q Coaching</p>
              </div>
            </div>
          </div>

          {/* ---- FOOTER ---- */}
          <div className="border-t border-slate-100 px-12 py-4 bg-slate-50 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 italic">
              This is a computer-generated receipt and does not require a physical signature.
            </p>
            <p className="text-[10px] text-slate-300 font-mono">
              TXN#{transaction.id?.slice(0, 12).toUpperCase()}
            </p>
          </div>

          {/* BOTTOM BRAND BAR */}
          <div className="h-1.5 bg-gradient-to-r from-[#0055a5] via-[#0077cc] to-[#0055a5]" />
        </div>
      </div>
    </>
  );
}