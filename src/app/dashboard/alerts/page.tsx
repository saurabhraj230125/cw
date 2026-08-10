"use client";

import { useState, useEffect } from "react";
import { Bell, Search, AlertTriangle, CheckSquare, MessageCircle, XCircle, Loader2 } from "lucide-react";
import { getActiveAlerts, resolveAlertAction, resolveAllAlertsAction } from "../../actions/alert-actions";

export default function SystemAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Filters
  const [severityFilter, setSeverityFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadAlerts();
  }, []);

  async function loadAlerts() {
    setIsLoading(true);
    try {
      const data = await getActiveAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to load alerts");
    } finally {
      setIsLoading(false);
    }
  }

  // --- ACTIONS ---
  const handleResolve = async (id: string) => {
    setIsProcessing(true);
    try {
      await resolveAlertAction(id);
      // Remove from local state instantly for snappy UI
      setAlerts(alerts.filter(a => a.id !== id));
    } catch (error) {
      alert("Failed to resolve alert.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResolveAll = async () => {
    if (!window.confirm("Are you sure you want to mark all active alerts as resolved?")) return;
    setIsProcessing(true);
    try {
      await resolveAllAlertsAction();
      setAlerts([]); // Clear UI
    } catch (error) {
      alert("Failed to resolve all alerts.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- DYNAMIC FILTERING ---
  const filteredAlerts = alerts.filter(alt => {
    const matchesSeverity = severityFilter === "All" || alt.severity === severityFilter;
    const matchesSearch = alt.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alt.target_entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          alt.alert_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  // --- KPI COUNTERS ---
  const criticalCount = alerts.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = alerts.filter(a => a.severity === 'WARNING').length;
  const infoCount = alerts.filter(a => a.severity === 'INFO').length;

  // --- DATE FORMATTER ---
  const formatAlertDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (isLoading) {
    return <div className="min-h-screen bg-white flex justify-center items-center"><Loader2 className="w-8 h-8 animate-spin text-[#0055a5]"/></div>;
  }

  return (
    <main className="min-h-screen bg-white font-sans flex flex-col selection:bg-[#0055a5] selection:text-white">
      
      {/* 1. CLASSIC SUB-HEADER */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white shrink-0 flex justify-between items-center">
        <h2 className="text-[18px] text-gray-900 font-normal flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#cc0000]" /> Operational System Alerts
        </h2>
        {isProcessing && <span className="text-[11px] font-bold text-[#0055a5] bg-[#e6f2ff] border border-[#b3d9ff] px-2 py-0.5 uppercase flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Processing Update...</span>}
      </div>

      {/* 2. DENSE STATUS BAR (Dynamically Calculated) */}
      <div className="px-4 py-2.5 border-b border-gray-300 bg-white flex flex-wrap gap-x-10 gap-y-2 text-[13px] font-bold shrink-0">
        <span className="text-[#cc0000]">Critical Issues: {criticalCount}</span>
        <span className="text-[#e65100]">Active Warnings: {warningCount}</span>
        <span className="text-[#0055a5]">System Info: {infoCount}</span>
      </div>

      {/* 3. FUNCTIONAL TOOLBAR */}
      <div className="px-4 py-2.5 bg-[#f8f9fa] border-b border-gray-300 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-sm z-10 relative">
        <div className="flex items-center gap-2">
          <label className="text-[13px] font-bold text-gray-900 uppercase">Severity Filter:</label>
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-2 py-1.5 border border-gray-300 bg-white text-[13px] text-gray-700 font-bold focus:outline-none focus:border-[#0055a5] shadow-inner cursor-pointer w-40"
          >
            <option value="All">All Alerts</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="WARNING">Warnings Only</option>
            <option value="INFO">Info Only</option>
          </select>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert ID or description..." 
              className="pl-8 pr-3 py-1.5 w-64 border border-gray-300 bg-white text-[13px] focus:outline-none focus:border-[#0055a5] shadow-inner placeholder:text-gray-400"
            />
          </div>
          <button 
            onClick={handleResolveAll}
            disabled={alerts.length === 0 || isProcessing}
            className="flex items-center gap-1.5 bg-[#008000] border border-[#006600] text-white px-4 py-1.5 text-[13px] font-bold hover:bg-[#006600] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckSquare className="h-4 w-4" /> Mark All as Read
          </button>
        </div>
      </div>

      {/* 4. CLASSIC ERP ALERTS TABLE */}
      <div className="flex-1 p-4 bg-white overflow-auto">
        <div className="border border-gray-300 min-w-max shadow-sm">
          <table className="w-full text-left border-collapse">
            
            {/* GLOSSY BLUE HEADER */}
            <thead className="bg-gradient-to-b from-[#00a3cc] via-[#007a99] to-[#005c73] text-white text-[13px] font-bold">
              <tr>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-24 text-center">Alert ID</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-28 text-center">Severity</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-36">Category</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">Alert Description & Context</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-48">Target Entity</th>
                <th className="py-2 px-3 border-r border-white/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] w-36 text-center">Timestamp</th>
                <th className="py-2 px-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] text-center w-36">Action</th>
              </tr>
            </thead>

            {/* STRICT BORDERED ROWS */}
            <tbody className="bg-white text-[13px] text-gray-800">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center border-t border-gray-300 text-gray-500 font-bold italic bg-gray-50">
                    No active system alerts match your criteria. Everything is operational.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert, index) => (
                  <tr 
                    key={alert.id} 
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#f9f9f9]'} hover:bg-[#eef5fa] transition-colors border-b border-gray-300`}
                  >
                    <td className="py-2.5 px-3 border-r border-gray-300 text-center font-bold text-gray-600">
                      {alert.alert_code}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 text-center font-bold">
                      <div className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded-[2px] text-[11px] uppercase tracking-wider ${
                        alert.severity === 'CRITICAL' ? 'bg-[#ffebee] text-[#cc0000] border-[#ffcdd2]' :
                        alert.severity === 'WARNING' ? 'bg-[#fff8e1] text-[#e65100] border-[#ffecb3]' :
                        'bg-[#e3f2fd] text-[#0055a5] border-[#bbdefb]'
                      }`}>
                        {alert.severity === 'CRITICAL' && <AlertTriangle className="w-3 h-3" />}
                        {alert.severity}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-bold text-[#0055a5]">
                      {alert.category}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 leading-snug">
                      {alert.description}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 font-bold text-gray-700">
                      {alert.target_entity}
                    </td>
                    <td className="py-2.5 px-3 border-r border-gray-300 text-center text-gray-500 font-medium">
                      {formatAlertDate(alert.created_at)}
                    </td>
                    <td className="py-2.5 px-3 text-center flex items-center justify-center gap-2">
                      {alert.severity === 'CRITICAL' || alert.severity === 'WARNING' ? (
                        <>
                          <button className="text-[#0066cc] hover:underline flex items-center gap-1 font-bold disabled:opacity-50" title="Take Action">
                            <MessageCircle className="w-3.5 h-3.5" /> Action
                          </button>
                          <span className="text-gray-300 font-light">|</span>
                          <button 
                            onClick={() => handleResolve(alert.id)}
                            disabled={isProcessing}
                            className="text-[#008000] hover:underline flex items-center gap-1 font-bold disabled:opacity-50" 
                            title="Resolve Alert"
                          >
                            <CheckSquare className="w-3.5 h-3.5" /> Clear
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleResolve(alert.id)}
                          disabled={isProcessing}
                          className="text-gray-500 hover:text-black hover:underline flex items-center gap-1 font-bold mx-auto disabled:opacity-50" 
                          title="Dismiss Info"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Dismiss
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
    </main>
  );
}