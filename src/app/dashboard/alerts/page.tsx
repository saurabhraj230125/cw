"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { 
  BellRing, Loader2, AlertTriangle, Wallet, 
  CalendarX, UserX, MessageCircle, ArrowRight, 
  CheckCircle2, Info, Clock, RefreshCw, ShieldAlert
} from "lucide-react";

import { fetchLiveAlertsData } from "../../actions/alert-actions";

// 🚨 DEEP FIX: Replaced the "@/components" alias with the perfect relative path!
import ProFeatureGate from "../../../components/ProFeatureGate";

type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
type AlertCategory = 'FINANCE' | 'ACADEMIC' | 'SYSTEM';

interface SmartAlert {
  id: string;
  category: AlertCategory;
  severity: AlertSeverity;
  title: string;
  description: string;
  metrics?: { label: string; value: string | number; color?: string }[];
  actionText: string;
  actionType: 'LINK' | 'WHATSAPP';
  actionPayload: string | any;
}

export default function SystemAlertsPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<AlertCategory | 'ALL'>('ALL');

  async function generateLiveAlerts() {
    setIsLoading(true);
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) return;

      const { data: member } = await supabase
        .from('core_memberships')
        .select('institute_id')
        .eq('user_id', authData.user.id)
        .single();
      
      if (!member?.institute_id) return;

      const { students, batches, todayAttendance } = await fetchLiveAlertsData(member.institute_id);
      
      const newAlerts: SmartAlert[] = [];
      const attendedStudentIds = new Set(todayAttendance.map((a: any) => a.student_id));

      if (students && students.length > 0) {
        
        const defaulters = students.filter((s: any) => {
          const gross = Number(s.gross_fee) || 0;
          const discount = Number(s.discount_amount) || 0;
          const net = gross - discount;
          const paid = Number(s.amount_paid) || 0;
          return (net - paid) > 0;
        });

        defaulters.sort((a: any, b: any) => {
          const dueA = (Number(a.gross_fee) - Number(a.discount_amount)) - Number(a.amount_paid);
          const dueB = (Number(b.gross_fee) - Number(b.discount_amount)) - Number(b.amount_paid);
          return dueB - dueA;
        });

        defaulters.forEach((student: any) => {
          const netFee = (Number(student.gross_fee) || 0) - (Number(student.discount_amount) || 0);
          const paid = Number(student.amount_paid) || 0;
          const due = netFee - paid;
          
          newAlerts.push({
            id: `fee-${student.id}`,
            category: 'FINANCE',
            severity: due > 5000 ? 'CRITICAL' : 'WARNING',
            title: `Pending Fee: ${student.full_name}`,
            description: `Student has an outstanding balance. Tap to send an automated WhatsApp payment reminder.`,
            metrics: [
              { label: "Net Fee", value: `₹${netFee.toLocaleString('en-IN')}` },
              { label: "Total Paid", value: `₹${paid.toLocaleString('en-IN')}`, color: "text-cw-green" },
              { label: "Balance Due", value: `₹${due.toLocaleString('en-IN')}`, color: "text-cw-red" }
            ],
            actionText: "Send WhatsApp Reminder",
            actionType: 'WHATSAPP',
            actionPayload: {
              phone: student.whatsapp_number || student.parent_phone,
              name: student.full_name,
              due: due
            }
          });
        });

        const unassigned = students.filter((s: any) => !s.batch_id || s.batch_id === "Unassigned" || s.batch_id === "Batch Unassigned");
        unassigned.forEach((student: any) => {
          newAlerts.push({
            id: `unassigned-${student.id}`,
            category: 'SYSTEM',
            severity: 'WARNING',
            title: `Unmapped Student: ${student.full_name}`,
            description: `This active student was enrolled but never assigned to a batch. They are currently invisible on attendance sheets.`,
            metrics: [
              { label: "Roll No", value: student.roll_number || "N/A" },
              { label: "Phone", value: student.whatsapp_number || "N/A" }
            ],
            actionText: "Assign Batch Now",
            actionType: 'LINK',
            actionPayload: `/dashboard/students/${student.id}`
          });
        });

        if (batches && batches.length > 0) {
          batches.forEach((batch: any) => {
            const batchName = batch.batch_name || batch.name;
            const studentsInBatch = students.filter((s: any) => s.batch_id === batchName || s.batch_id === batch.id);
            
            if (studentsInBatch.length > 0) {
              const hasAttendance = studentsInBatch.some((s: any) => attendedStudentIds.has(s.id));
              
              if (!hasAttendance) {
                newAlerts.push({
                  id: `att-${batch.id}`,
                  category: 'ACADEMIC',
                  severity: 'CRITICAL',
                  title: `Attendance Missing: ${batchName}`,
                  description: `No attendance records logged for this batch today (${new Date().toLocaleDateString('en-GB')}).`,
                  metrics: [
                    { label: "Total Students", value: studentsInBatch.length },
                    { label: "Marked Today", value: "0", color: "text-cw-red" }
                  ],
                  actionText: "Mark Attendance",
                  actionType: 'LINK',
                  actionPayload: `/dashboard/attendance`
                });
              }
            }
          });
        }
      }

      const severityWeight = { 'CRITICAL': 3, 'WARNING': 2, 'INFO': 1 };
      newAlerts.sort((a, b) => severityWeight[b.severity] - severityWeight[a.severity]);

      setAlerts(newAlerts);

    } catch (error) {
      console.error("Alert Engine Failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    generateLiveAlerts();
  }, []);

  const handleWhatsAppAction = (payload: any) => {
    if (!payload.phone || payload.phone === "Not Provided") {
      return alert("No valid phone number found for this student.");
    }
    
    let cleanPhone = payload.phone.replace(/\D/g, '');
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

    const message = `Hello ${payload.name},\n\nThis is a gentle reminder from the institute that your fee balance of *₹${payload.due.toLocaleString('en-IN')}* is currently pending.\n\nPlease clear the dues at your earliest convenience. Let us know if you need assistance!`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const filteredAlerts = useMemo(() => {
    if (activeFilter === 'ALL') return alerts;
    return alerts.filter(a => a.category === activeFilter);
  }, [alerts, activeFilter]);

  const stats = useMemo(() => {
    return {
      critical: alerts.filter(a => a.severity === 'CRITICAL').length,
      warning: alerts.filter(a => a.severity === 'WARNING').length,
      total: alerts.length
    };
  }, [alerts]);

  return (
    <ProFeatureGate featureName="System Action Center">
      <main className="min-h-screen bg-erp-bg flex flex-col pb-10">
        
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-erp-border bg-white shrink-0 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <div>
            <h2 className="text-erp-lg text-gray-900 font-black uppercase tracking-wide flex items-center gap-2">
              <BellRing className="w-5 h-5 text-cw-blue" /> Action Center
            </h2>
            <p className="text-[11px] font-bold text-gray-500 mt-1">Alerts automatically resolve when database records are updated.</p>
          </div>
          <button onClick={generateLiveAlerts} className="flex items-center gap-1.5 bg-white border border-erp-border text-gray-700 px-4 py-2 text-erp-sm font-bold hover:bg-gray-50 shadow-sm rounded-erp transition-colors active:scale-95">
            <RefreshCw className={`w-3.5 h-3.5 text-cw-blue ${isLoading ? 'animate-spin' : ''}`} /> Sync Engine
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 py-6 bg-gray-50 border-b border-erp-border shrink-0">
          <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Pending Tasks</p>
              <p className="text-3xl font-black text-cw-blue">{isLoading ? "-" : stats.total}</p>
            </div>
            <div className="bg-pastel-blueBg p-3 rounded-full"><Info className="w-6 h-6 text-cw-blue" /></div>
          </div>
          <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Critical Priority</p>
              <p className="text-3xl font-black text-cw-red">{isLoading ? "-" : stats.critical}</p>
            </div>
            <div className="bg-pastel-redBg p-3 rounded-full"><ShieldAlert className="w-6 h-6 text-cw-red" /></div>
          </div>
          <div className="bg-white p-4 rounded-erp border border-erp-border shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">Warnings & Notices</p>
              <p className="text-3xl font-black text-amber-500">{isLoading ? "-" : stats.warning}</p>
            </div>
            <div className="bg-pastel-yellowBg p-3 rounded-full"><AlertTriangle className="w-6 h-6 text-amber-500" /></div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="px-6 py-4 bg-white border-b border-erp-border flex gap-3 overflow-x-auto hide-scrollbar shadow-sm">
          {(['ALL', 'FINANCE', 'ACADEMIC', 'SYSTEM'] as const).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full transition-colors border ${
                activeFilter === filter 
                  ? 'bg-cw-blue text-white border-cw-blueDark shadow-sm' 
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {filter === 'ALL' ? 'All Tasks' : filter}
            </button>
          ))}
        </div>

        {/* 🚨 DYNAMIC SMART ALERT FEED */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-5">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-cw-blue" />
                <p className="font-bold tracking-wide">Running Deep Database Scan...</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white border border-erp-border border-dashed rounded-2xl shadow-sm text-center px-4">
                <div className="w-20 h-20 bg-pastel-greenBg rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-cw-green" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Inbox Zero!</h3>
                <p className="text-erp-base text-gray-500 max-w-sm">
                  Your database is perfectly optimized. No pending fees, unassigned students, or missing attendance found.
                </p>
              </div>
            ) : (
              filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`bg-white border-2 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row gap-5 items-start transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 ${
                    alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50/10' : 
                    alert.severity === 'WARNING' ? 'border-amber-200 bg-amber-50/10' : 'border-blue-200 bg-blue-50/10'
                  }`}
                >
                  
                  {/* ICON MAPPER */}
                  <div className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    alert.category === 'FINANCE' ? 'bg-red-50 border-red-200 text-cw-red' :
                    alert.category === 'ACADEMIC' ? 'bg-blue-50 border-blue-200 text-cw-blue' :
                    'bg-amber-50 border-amber-200 text-amber-500'
                  }`}>
                    {alert.category === 'FINANCE' && <Wallet className="w-5 h-5" />}
                    {alert.category === 'ACADEMIC' && <CalendarX className="w-5 h-5" />}
                    {alert.category === 'SYSTEM' && <UserX className="w-5 h-5" />}
                  </div>

                  {/* DEEP METRICS CONTENT */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm border ${
                        alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' : 
                        alert.severity === 'WARNING' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                        'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Auto-Generated
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-black text-gray-900 leading-tight mb-1">{alert.title}</h3>
                    <p className="text-erp-sm font-medium text-gray-600 mb-3 max-w-xl">{alert.description}</p>

                    {/* 🚨 DYNAMIC METRIC CARDS INSIDE THE ALERT */}
                    {alert.metrics && (
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {alert.metrics.map(m => (
                          <div key={m.label} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 shadow-sm">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{m.label}</p>
                            <p className={`text-sm font-black ${m.color || 'text-gray-900'}`}>{m.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ONE-CLICK RESOLVER BUTTON */}
                  <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-200 flex flex-col justify-center h-full">
                    {alert.actionType === 'LINK' ? (
                      <Link 
                        href={alert.actionPayload}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider hover:border-cw-blue hover:text-cw-blue transition-colors active:scale-95 shadow-sm"
                      >
                        {alert.actionText} <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <button 
                        onClick={() => handleWhatsAppAction(alert.actionPayload)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-[#1da851] transition-colors active:scale-95 shadow-md shadow-[#25D366]/20"
                      >
                        <MessageCircle className="w-4 h-4" /> {alert.actionText}
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </ProFeatureGate>
  );
}