"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, Plus, Loader2, Eye, PowerOff, Trash2, 
  ShieldAlert, Users, TrendingUp, UserMinus, Download 
} from "lucide-react";
import { getStudents, getAllBatches, toggleStudentStatusAction, deleteStudentAction } from "../../actions/student-actions";

export default function StudentDirectoryPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [selectedBatch, setSelectedBatch] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [fetchedStudents, fetchedBatches] = await Promise.all([
        getStudents(),
        getAllBatches()
      ]);
      setStudents(fetchedStudents);
      setBatches(fetchedBatches);
    } catch (error) {
      console.error("Failed to fetch directory data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- ACTIONS ---
  const handleToggleStatus = async (studentId: string, currentStatus: string) => {
    const isActivating = currentStatus === "inactive";
    if (!window.confirm(`Are you sure you want to mark this student as ${isActivating ? "ACTIVE" : "INACTIVE"}?`)) return;
    
    setIsProcessingId(studentId);
    try {
      await toggleStudentStatusAction(studentId, currentStatus);
      await loadData(); 
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message);
    } finally {
      setIsProcessingId(null);
    }
  };

  const handleDelete = async (studentId: string) => {
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to PERMANENTLY delete this student? All attendance and fee ledgers tied to them will be wiped. This action cannot be undone.")) return;
    
    setIsProcessingId(studentId);
    try {
      await deleteStudentAction(studentId);
      await loadData(); 
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message);
    } finally {
      setIsProcessingId(null);
    }
  };

  // --- FILTERS & DERIVED METRICS ---
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const safeName = s.full_name || "";
      const safeRoll = s.roll_number || "";
      const safePhone = s.whatsapp_number || s.parent_phone || "";
      
      const matchesSearch = 
        safeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        safeRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
        safePhone.includes(searchQuery);

      const matchesBatch = selectedBatch === "ALL" || s.batch_id === selectedBatch;
      const matchesStatus = selectedStatus === "ALL" || (s.status || "active") === selectedStatus;

      return matchesSearch && matchesBatch && matchesStatus;
    });
  }, [students, searchQuery, selectedBatch, selectedStatus]);

  // Executive Summary Metrics
  const metrics = useMemo(() => {
    let active = 0;
    let inactive = 0;
    students.forEach(s => {
      if (s.status === "inactive") inactive++;
      else active++;
    });
    return { active, inactive, total: students.length };
  }, [students]);

  return (
    <main className="min-h-screen bg-erp-bg flex flex-col pb-10">
      
      {/* 1. EXECUTIVE SUB-HEADER */}
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex justify-between items-center shadow-sm z-10">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide">
          Student Master Directory
        </h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-white border border-erp-border text-gray-700 px-4 py-1.5 text-erp-sm font-bold hover:bg-gray-50 shadow-sm rounded-erp transition-colors">
            <Download className="w-3.5 h-3.5" /> Export Roster
          </button>
          <Link 
            href="/dashboard/enquiries/new" 
            className="bg-cw-green border border-[#005000] text-white px-5 py-1.5 rounded-erp font-bold hover:bg-[#005000] transition-colors shadow-erp-button flex items-center gap-1.5 text-erp-sm"
          >
            <Plus className="w-4 h-4" strokeWidth={3} /> New Admission
          </Link>
        </div>
      </div>

      {/* 2. OWNER'S METRICS DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6 bg-gray-50 border-b border-erp-border shrink-0">
        
        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-4">
          <div className="bg-pastel-blueBg p-3 rounded-full border border-pastel-blueBorder">
            <Users className="w-6 h-6 text-cw-blue" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Database Records</p>
            <p className="text-2xl font-bold text-gray-900">{isLoading ? "-" : metrics.total}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-4">
          <div className="bg-pastel-greenBg p-3 rounded-full border border-pastel-greenBorder">
            <TrendingUp className="w-6 h-6 text-cw-green" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Enrollments</p>
            <p className="text-2xl font-bold text-cw-green">{isLoading ? "-" : metrics.active}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center gap-4">
          <div className="bg-pastel-redBg p-3 rounded-full border border-pastel-redBorder">
            <UserMinus className="w-6 h-6 text-cw-red" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Inactive / Dropped</p>
            <p className="text-2xl font-bold text-cw-red">{isLoading ? "-" : metrics.inactive}</p>
          </div>
        </div>

      </div>

      {/* 3. FILTER & SEARCH TOOLBAR */}
      <div className="px-6 py-3 bg-white border-b border-erp-border flex flex-wrap items-center gap-5 shrink-0 shadow-sm">
        
        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Batch:</label>
          <select 
            value={selectedBatch} 
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="border border-erp-border bg-gray-50 px-3 py-1.5 font-bold text-cw-blueDark outline-none cursor-pointer focus:border-cw-blue focus:bg-white transition-colors"
          >
            <option value="ALL">-- View All Batches --</option>
            {batches.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-erp-sm font-bold text-gray-600 uppercase">Status:</label>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-erp-border bg-gray-50 px-3 py-1.5 font-bold text-cw-blueDark outline-none cursor-pointer focus:border-cw-blue focus:bg-white transition-colors"
          >
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="ALL">Show All Statuses</option>
          </select>
        </div>

        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by name, roll no, or phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 w-[300px] border border-erp-border focus:border-cw-blue outline-none text-erp-sm font-medium transition-colors shadow-inner"
          />
        </div>

      </div>

      {/* 4. MAIN DATA TABLE */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="border border-erp-border bg-white shadow-sm rounded-erp max-w-[1500px] mx-auto overflow-hidden">
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-gray-500">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-cw-blue" />
              <p className="font-bold tracking-wide">Syncing with Master Database...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-erp-border text-[11px] text-gray-600 uppercase tracking-wider">
                    <th className="py-3 px-4 font-bold w-24 text-center border-r border-erp-borderLight">Roll No</th>
                    <th className="py-3 px-4 font-bold border-r border-erp-borderLight">Student Identity</th>
                    <th className="py-3 px-4 font-bold border-r border-erp-borderLight">Batch Assignment</th>
                    <th className="py-3 px-4 font-bold border-r border-erp-borderLight">Contact Information</th>
                    <th className="py-3 px-4 font-bold text-right border-r border-erp-borderLight">Net Fee (₹)</th>
                    <th className="py-3 px-4 font-bold text-center w-[160px]">System Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-erp-base">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-16 text-center text-gray-500 font-medium italic bg-gray-50">
                        No student records found matching your current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s, idx) => {
                      const isInactive = s.status === "inactive";
                      const isProcessing = isProcessingId === s.id;
                      const netFee = (Number(s.gross_fee) || 30000) - (Number(s.discount_amount) || 0);

                      return (
                        <tr 
                          key={s.id} 
                          className={`border-b border-erp-borderLight transition-colors group ${
                            isInactive ? 'bg-gray-50 opacity-80' : idx % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'
                          } hover:bg-pastel-blueBg`}
                        >
                          
                          {/* ROLL NO */}
                          <td className="py-3 px-4 text-center font-bold text-gray-800 border-r border-erp-borderLight">
                            {s.roll_number || "N/A"}
                          </td>
                          
                          {/* STUDENT IDENTITY */}
                          <td className="py-3 px-4 border-r border-erp-borderLight">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className={`font-bold text-[15px] ${isInactive ? 'text-gray-500 line-through' : 'text-cw-blueDark'}`}>
                                  {s.full_name}
                                </span>
                                {isInactive && (
                                  <span className="bg-white border border-gray-300 text-gray-500 text-[9px] px-1.5 py-0.5 rounded-sm uppercase font-bold flex items-center gap-1 shadow-sm">
                                    <ShieldAlert className="w-3 h-3"/> Inactive
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-gray-400 mt-0.5 group-hover:text-cw-blue transition-colors">
                                ID: {s.id.split('-')[0].toUpperCase()}
                              </span>
                            </div>
                          </td>
                          
                          {/* BATCH ASSIGNMENT */}
                          <td className="py-3 px-4 border-r border-erp-borderLight">
                            <span className={`inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-[2px] border ${
                              isInactive 
                                ? 'bg-gray-200 border-gray-300 text-gray-500' 
                                : 'bg-pastel-blueBg text-cw-blue border-pastel-blueBorder'
                            }`}>
                              {s.batch_id || "Unassigned"}
                            </span>
                          </td>
                          
                          {/* CONTACT */}
                          <td className="py-3 px-4 border-r border-erp-borderLight">
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-800 text-sm">
                                {s.whatsapp_number || s.parent_phone || "No Phone"}
                              </span>
                            </div>
                          </td>
                          
                          {/* NET FEE */}
                          <td className="py-3 px-4 text-right border-r border-erp-borderLight">
                            <span className={`font-bold text-[15px] ${isInactive ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                              ₹{netFee.toLocaleString()}
                            </span>
                          </td>
                          
                          {/* SYSTEM ACTIONS (Owner Controls) */}
                          <td className="py-3 px-4 bg-white group-hover:bg-transparent transition-colors">
                            <div className="flex items-center justify-center gap-1.5">
                              {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin text-cw-blue mx-auto" />
                              ) : (
                                <>
                                  <Link 
                                    href={`/dashboard/students/${s.id}`} 
                                    title="View Comprehensive Profile"
                                    className="text-cw-blue border border-transparent hover:bg-pastel-blueBg hover:border-cw-blue/30 p-1.5 rounded-sm transition-all"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  
                                  <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                                  
                                  <button 
                                    onClick={() => handleToggleStatus(s.id, s.status || "active")}
                                    title={isInactive ? "Reactivate Student" : "Suspend Student"}
                                    className={`${isInactive ? 'text-cw-green hover:bg-pastel-greenBg hover:border-cw-green/30' : 'text-[#f57f17] hover:bg-pastel-yellowBg hover:border-[#f57f17]/30'} border border-transparent p-1.5 rounded-sm transition-all`}
                                  >
                                    <PowerOff className="w-4 h-4" />
                                  </button>

                                  <button 
                                    onClick={() => handleDelete(s.id)}
                                    title="Permanently Delete Database Record"
                                    className="text-cw-red border border-transparent hover:bg-pastel-redBg hover:border-cw-red/30 p-1.5 rounded-sm transition-all"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>

                        </tr>
                      );
                    })
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