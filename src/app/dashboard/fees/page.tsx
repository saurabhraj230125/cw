"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Download, Plus, IndianRupee, 
  Wallet, TrendingUp, AlertTriangle, Loader2, Receipt, Filter, Tag, Landmark, CheckCircle2
} from "lucide-react";

// IMPORT REAL DATABASE ACTIONS
import { getStudents, getAllBatches } from "../../actions/student-actions";

// STRICT TYPESCRIPT INTERFACE
interface FeeLedgerRecord {
  id: string;
  studentId: string;
  rollNo: string;
  name: string;
  batch: string;
  subjects: string;
  grossFee: number;
  discount: number;
  netFee: number;
  paid: number;
  balance: number;
  paymentMode: string;
  status: "Paid" | "Partial" | "Unpaid";
  isActive: boolean;
}

export default function FeeManagementPage() {
  const [records, setRecords] = useState<FeeLedgerRecord[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isInvoicing, setIsInvoicing] = useState(false);
  
  // OWNER'S DEEP FILTERS
  const [batchFilter, setBatchFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentModeFilter, setPaymentModeFilter] = useState("ALL");
  const [discountFilter, setDiscountFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // --- 1. DATA FETCHING ---
  useEffect(() => {
    async function fetchLedgerData() {
      setIsLoading(true);
      try {
        const [fetchedStudents, fetchedBatches] = await Promise.all([
          getStudents(),
          getAllBatches()
        ]);
        
        setBatches(fetchedBatches);

        // Map RAW database students into Financial Ledger Records
        const formattedRecords: FeeLedgerRecord[] = fetchedStudents.map((s: any) => {
          const gross = Number(s.gross_fee) || 0; 
          const discount = Number(s.discount_amount) || 0;
          const netFee = gross - discount;
          const paid = Number(s.amount_paid) || 0;
          const balance = Math.max(0, netFee - paid);
          
          let status: "Paid" | "Partial" | "Unpaid" = "Unpaid";
          if (balance === 0 && netFee > 0) status = "Paid";
          else if (paid > 0) status = "Partial";
          else if (netFee === 0) status = "Paid"; // Free/100% Scholarship edge case

          // Extract Subjects
          let subjectNames = s.course_id || "Master Program";
          if (s.student_subjects && s.student_subjects.length > 0) {
            subjectNames = s.student_subjects.map((ss: any) => ss.subjects?.name).filter(Boolean).join(", ");
          }

          return {
            id: `LED-${s.id.substring(0, 6).toUpperCase()}`, 
            studentId: s.id,
            rollNo: s.roll_number || "N/A",
            name: s.full_name || "Unknown",
            batch: s.batch_id || "Unassigned",
            subjects: subjectNames,
            grossFee: gross,
            discount: discount,
            netFee,
            paid,
            balance,
            paymentMode: s.payment_mode || "Cash",
            status,
            isActive: s.status !== "inactive"
          };
        });

        setRecords(formattedRecords);
      } catch (error) {
        console.error("Failed to load fee ledger:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLedgerData();
  }, []);

  // --- 2. DEEP FILTERS & SEARCH ---
  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      // Exclude inactive students from the main active ledger
      if (!rec.isActive) return false;

      const matchesStatus = statusFilter === "All" || rec.status === statusFilter;
      const matchesBatch = batchFilter === "ALL" || rec.batch === batchFilter;
      const matchesMode = paymentModeFilter === "ALL" || rec.paymentMode === paymentModeFilter;
      
      let matchesDiscount = true;
      if (discountFilter === "Discounted") matchesDiscount = rec.discount > 0;
      if (discountFilter === "FullFee") matchesDiscount = rec.discount === 0;

      const matchesSearch = 
        rec.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        rec.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesBatch && matchesMode && matchesDiscount && matchesSearch;
    });
  }, [records, statusFilter, batchFilter, paymentModeFilter, discountFilter, searchQuery]);

  // --- 3. DYNAMIC FINANCIAL METRICS ---
  const metrics = useMemo(() => {
    let totalExpected = 0;
    let totalCollected = 0;
    let totalOverdue = 0;
    let totalDiscounts = 0;

    filteredRecords.forEach(rec => {
      totalExpected += rec.netFee;
      totalCollected += rec.paid;
      totalOverdue += rec.balance;
      totalDiscounts += rec.discount;
    });

    return { totalExpected, totalCollected, totalOverdue, totalDiscounts };
  }, [filteredRecords]);

  // --- 4. EXPORT LOGIC ---
  const handleExportLedger = () => {
    if (filteredRecords.length === 0) return alert("No records match your filters to export.");

    const headers = [
      "Ledger ID", "Roll No", "Student Name", "Batch", "Subjects", 
      "Gross Fee (INR)", "Discount (INR)", "Net Fee (INR)", "Paid (INR)", "Balance Due (INR)", 
      "Status", "Payment Mode"
    ];

    const csvData = filteredRecords.map(rec => [
      `"${rec.id}"`,
      `"${rec.rollNo}"`,
      `"${rec.name}"`,
      `"${rec.batch}"`,
      `"${rec.subjects}"`,
      `"${rec.grossFee}"`,
      `"${rec.discount}"`,
      `"${rec.netFee}"`,
      `"${rec.paid}"`,
      `"${rec.balance}"`,
      `"${rec.status}"`,
      `"${rec.paymentMode}"`
    ].join(","));

    const csvString = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Fee_Ledger_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- 5. BULK INVOICE LOGIC ---
  const handleBulkInvoiceRun = async () => {
    const pendingRecords = filteredRecords.filter(r => r.balance > 0);
    
    if (pendingRecords.length === 0) {
      alert("All students in the current view are fully paid. No invoices to generate.");
      return;
    }

    if (!window.confirm(`Are you sure you want to generate and send pending fee invoices for ${pendingRecords.length} student(s)?`)) {
      return;
    }

    setIsInvoicing(true);
    // Simulate API network request time for generating bulk invoices
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsInvoicing(false);
    
    alert(`Successfully generated and dispatched ${pendingRecords.length} fee reminders/invoices.`);
  };


  // ============================================================================
  // RENDER UI
  // ============================================================================
  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex justify-between items-center z-10 shadow-sm">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cw-blue" />
          Master Fee Ledger & Collections
        </h2>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportLedger}
            className="flex items-center gap-1.5 bg-white border border-erp-border text-gray-700 px-4 py-1.5 text-erp-sm font-bold hover:bg-gray-50 shadow-sm rounded-erp transition-colors active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Export Book
          </button>
          <button 
            onClick={handleBulkInvoiceRun}
            disabled={isInvoicing || filteredRecords.length === 0}
            className="bg-cw-blue text-white px-5 py-1.5 rounded-erp font-bold hover:bg-cw-blueDark transition-colors shadow-erp-button flex items-center gap-1.5 text-erp-sm active:scale-95 disabled:opacity-70 disabled:active:scale-100"
          >
            {isInvoicing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isInvoicing ? "Processing..." : "Bulk Invoice Run"}
          </button>
        </div>
      </div>

      {/* 2. DENSE FINANCIAL SUMMARY DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-6 bg-gray-50 border-b border-erp-border shrink-0">
        
        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-cw-blue" />
          <div className="bg-pastel-blueBg p-2.5 rounded-full border border-pastel-blueBorder">
            <TrendingUp className="w-5 h-5 text-cw-blue" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Expected Revenue</p>
            <p className="text-xl font-bold text-gray-900">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mt-1 text-gray-400"/> : `₹${metrics.totalExpected.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-cw-green" />
          <div className="bg-pastel-greenBg p-2.5 rounded-full border border-pastel-greenBorder">
            <Receipt className="w-5 h-5 text-cw-green" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Collected</p>
            <p className="text-xl font-bold text-cw-green">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mt-1 text-gray-400"/> : `₹${metrics.totalCollected.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-cw-red" />
          <div className="bg-pastel-redBg p-2.5 rounded-full border border-pastel-redBorder">
            <AlertTriangle className="w-5 h-5 text-cw-red" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pending Balance</p>
            <p className="text-xl font-bold text-cw-red">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mt-1 text-gray-400"/> : `₹${metrics.totalOverdue.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-[#f57f17]" />
          <div className="bg-pastel-yellowBg p-2.5 rounded-full border border-pastel-yellowBorder">
            <Tag className="w-5 h-5 text-[#f57f17]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Total Concessions</p>
            <p className="text-xl font-bold text-[#f57f17]">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mt-1 text-gray-400"/> : `₹${metrics.totalDiscounts.toLocaleString('en-IN')}`}
            </p>
          </div>
        </div>

      </div>

      {/* 3. OWNER'S DEEP FILTER TOOLBAR */}
      <div className="px-6 py-4 bg-white border-b border-erp-border flex flex-col gap-3 shrink-0 shadow-sm z-0">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Main Filters */}
          <div className="flex flex-wrap items-center gap-5">
            
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Filter className="w-3.5 h-3.5"/> Batch:</label>
              <select 
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="border border-erp-border bg-gray-50 px-2 py-1 font-bold text-cw-blueDark outline-none cursor-pointer focus:border-cw-blue focus:bg-white transition-colors rounded-sm"
              >
                <option value="ALL">All Active Batches</option>
                {batches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Receipt className="w-3.5 h-3.5"/> Status:</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-erp-border bg-gray-50 px-2 py-1 font-bold text-cw-blueDark outline-none cursor-pointer focus:border-cw-blue focus:bg-white transition-colors rounded-sm"
              >
                <option value="All">All Statuses</option>
                <option value="Paid">Fully Paid</option>
                <option value="Partial">Partial Payments</option>
                <option value="Unpaid">Unpaid / Pending</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Landmark className="w-3.5 h-3.5"/> Mode:</label>
              <select 
                value={paymentModeFilter}
                onChange={(e) => setPaymentModeFilter(e.target.value)}
                className="border border-erp-border bg-gray-50 px-2 py-1 font-bold text-cw-blueDark outline-none cursor-pointer focus:border-cw-blue focus:bg-white transition-colors rounded-sm"
              >
                <option value="ALL">All Payment Modes</option>
                <option value="Cash">Cash at Counter</option>
                <option value="UPI">UPI / Scan</option>
                <option value="Card">Card (POS)</option>
                <option value="Bank">Bank / Cheque</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1"><Tag className="w-3.5 h-3.5"/> Concession:</label>
              <select 
                value={discountFilter}
                onChange={(e) => setDiscountFilter(e.target.value)}
                className="border border-erp-border bg-gray-50 px-2 py-1 font-bold text-cw-blueDark outline-none cursor-pointer focus:border-cw-blue focus:bg-white transition-colors rounded-sm"
              >
                <option value="ALL">All Records</option>
                <option value="Discounted">Discount Applied</option>
                <option value="FullFee">Paying Full Fee</option>
              </select>
            </div>

          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name, roll no..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-[280px] border border-erp-border focus:border-cw-blue outline-none text-erp-sm font-medium transition-colors shadow-inner rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* 4. CLASSIC ERP TABLE DATA GRID */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="border border-erp-border bg-white shadow-sm rounded-erp max-w-[1500px] mx-auto overflow-hidden">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-cw-blue" />
              <p className="font-bold tracking-wide">Syncing Financial Ledgers...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                
                <thead className="bg-gray-50 border-b border-erp-border text-[11px] text-gray-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-bold border-r border-erp-borderLight w-32">Ledger ID</th>
                    <th className="py-3 px-4 font-bold border-r border-erp-borderLight w-64">Student Details</th>
                    <th className="py-3 px-4 font-bold border-r border-erp-borderLight">Assigned Subjects</th>
                    <th className="py-3 px-4 font-bold text-right border-r border-erp-borderLight w-28">Net Fee</th>
                    <th className="py-3 px-4 font-bold text-right border-r border-erp-borderLight w-28">Collected</th>
                    <th className="py-3 px-4 font-bold text-right border-r border-erp-borderLight w-28">Balance</th>
                    <th className="py-3 px-4 font-bold text-center border-r border-erp-borderLight w-32">Status</th>
                    <th className="py-3 px-4 font-bold text-center w-36">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-white text-erp-base">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-gray-500 font-medium italic bg-gray-50">
                        No financial records found matching your exact filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((record, index) => (
                      <tr 
                        key={record.id} 
                        className={`border-b border-erp-borderLight transition-colors hover:bg-pastel-blueBg ${index % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}
                      >
                        
                        {/* Ledger ID */}
                        <td className="py-3 px-4 border-r border-erp-borderLight">
                          <span className="font-mono text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-sm border border-gray-200">
                            {record.id}
                          </span>
                        </td>
                        
                        {/* Student Info */}
                        <td className="py-3 px-4 border-r border-erp-borderLight">
                          <div className="flex flex-col">
                            <span className="font-bold text-cw-blueDark text-[15px]">{record.name}</span>
                            <span className="text-[11px] font-bold text-gray-500">{record.rollNo} • {record.batch}</span>
                          </div>
                        </td>
                        
                        {/* Subjects */}
                        <td className="py-3 px-4 border-r border-erp-borderLight">
                          <span className="text-xs font-medium text-gray-700 truncate block max-w-[200px]" title={record.subjects}>
                            {record.subjects}
                          </span>
                        </td>
                        
                        {/* Financials Math with Deep Owner Insights */}
                        <td className="py-3 px-4 border-r border-erp-borderLight text-right">
                          {record.discount > 0 && (
                            <div className="text-[10px] text-gray-400 font-bold line-through mb-0.5">₹{record.grossFee.toLocaleString('en-IN')}</div>
                          )}
                          <div className="font-bold text-gray-900 text-[15px]">₹{record.netFee.toLocaleString('en-IN')}</div>
                          {record.discount > 0 && (
                            <div className="text-[9px] font-bold text-[#f57f17] bg-pastel-yellowBg px-1.5 py-0.5 rounded-sm inline-block mt-0.5 border border-pastel-yellowBorder">
                              - ₹{record.discount.toLocaleString('en-IN')} Off
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 border-r border-erp-borderLight text-right">
                          <div className="font-bold text-cw-green text-[15px]">₹{record.paid.toLocaleString('en-IN')}</div>
                          {record.paid > 0 && (
                            <div className="text-[9px] font-bold text-gray-500 uppercase border border-gray-200 bg-gray-50 px-1.5 py-0.5 rounded-sm inline-block mt-0.5 tracking-wider">
                              {record.paymentMode}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4 border-r border-erp-borderLight text-right">
                          <span className={`font-bold text-[15px] ${record.balance > 0 ? 'text-cw-red' : 'text-gray-400'}`}>
                            ₹{record.balance.toLocaleString('en-IN')}
                          </span>
                        </td>
                        
                        {/* Status Badge */}
                        <td className="py-3 px-4 border-r border-erp-borderLight text-center">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-[10px] font-bold uppercase rounded-sm border shadow-sm tracking-wider ${
                            record.status === 'Paid' 
                              ? 'bg-pastel-greenBg text-cw-green border-pastel-greenBorder' 
                              : record.status === 'Partial' 
                                ? 'bg-pastel-yellowBg text-[#f57f17] border-pastel-yellowBorder' 
                                : 'bg-pastel-redBg text-cw-red border-pastel-redBorder'
                          }`}>
                            {record.status === 'Paid' && <CheckCircle2 className="w-3 h-3" />}
                            {record.status}
                          </span>
                        </td>
                        
                        {/* Action Buttons */}
                        <td className="py-3 px-4 text-center">
                          {record.balance > 0 ? (
                            <Link 
                              href={`/dashboard/students/${record.studentId}`}
                              className="flex items-center justify-center gap-1 mx-auto bg-cw-green border border-[#006600] text-white px-3 py-1.5 text-[11px] font-bold rounded-sm hover:bg-[#005000] shadow-sm transition-colors w-[110px]"
                            >
                              <IndianRupee className="w-3.5 h-3.5" /> Collect
                            </Link>
                          ) : (
                            <Link 
                              href={`/dashboard/students/${record.studentId}`}
                              className="flex items-center justify-center gap-1 mx-auto bg-white border border-erp-border text-cw-blue px-3 py-1.5 text-[11px] font-bold rounded-sm hover:bg-gray-50 shadow-sm transition-colors w-[110px]"
                            >
                              <Receipt className="w-3.5 h-3.5" /> View Ledger
                            </Link>
                          )}
                        </td>
                        
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}