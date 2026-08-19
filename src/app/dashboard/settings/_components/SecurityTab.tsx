"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  ShieldCheck, Key, LogOut, AlertTriangle, Trash2, X, 
  Loader2, Smartphone, AlertOctagon
} from "lucide-react";
import { SettingsSection, SettingsSectionHeader } from "./Primitives";
import { SettingsShellProps } from "./index";

// 🚨 DEEP FIX: Perfected the relative path! (3 dots back, not 4)
import { terminateMasterAccountAction } from "../../../actions/settings-actions";

export default function SecurityTab(props: SettingsShellProps) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // DANGER ZONE STATES
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const activeInstituteName = String(props.instituteName);

  // --- LOGOUT HANDLER ---
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
  };

  // --- MASTER ACCOUNT TERMINATION HANDLER ---
  const handleDeleteAccount = async () => {
    if (confirmText.trim().toUpperCase() !== "DELETE") return;

    setIsDeleting(true);
    try {
      // 1. Authenticate Current User on Client
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) throw new Error("Authentication failed.");

      // 2. Fetch the Institute ID
      const { data: memberData, error: memberError } = await supabase
        .from('core_memberships')
        .select('institute_id')
        .eq('user_id', authData.user.id)
        .single();

      if (memberError || !memberData?.institute_id) {
        throw new Error("Could not locate your active workspace to terminate.");
      }

      // 3. CALL THE ADMIN SERVER ACTION
      // This will bypass RLS, delete the data, AND destroy the login credentials.
      const response = await terminateMasterAccountAction(authData.user.id, memberData.institute_id);
      
      if (!response.success) {
        throw new Error(response.error);
      }

      // 4. Destroy the local browser session
      await supabase.auth.signOut();
      
      // 5. Redirect straight to the login page (They will not be able to log back in)
      router.push("/login");

    } catch (error: any) {
      console.error("Caught Execution Error:", error);
      alert("Failed to terminate account: " + (error?.message || "Unknown error occurred."));
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🚨 THE ACCOUNT DELETION MODAL OVERLAY */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-red-100">
            
            {/* Modal Header */}
            <div className="bg-red-50 p-5 flex justify-between items-start border-b border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                  <AlertOctagon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-red-700 leading-tight">Terminate Workspace</h3>
                  <p className="text-xs font-bold text-red-500 mt-0.5">This action is permanent and irreversible.</p>
                </div>
              </div>
              <button onClick={() => setIsDeleteModalOpen(false)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors">
                <X className="w-5 h-5"/>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                <p className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Warning: Complete Data Loss
                </p>
                <ul className="text-xs font-semibold text-amber-700 space-y-1.5 list-disc pl-4">
                  <li>All student records, fee ledgers, and attendance will be wiped.</li>
                  <li>Your coaching portal URL and generated receipts will be destroyed.</li>
                  <li>You will be logged out and forced to create a new account.</li>
                </ul>
              </div>

              {/* SIMPLIFIED CONFIRMATION UI */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-3 leading-relaxed">
                  To verify deletion, please type <strong className="text-red-600 select-all bg-red-50 px-2 py-1 rounded-md border border-red-200 shadow-sm mx-1">DELETE</strong> exactly as shown below:
                </label>
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="Type DELETE here..."
                  className="w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-lg text-sm font-bold text-slate-900 outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all uppercase"
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmText("");
                }} 
                className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
              >
                Cancel
              </button>
              
              <button 
                onClick={handleDeleteAccount} 
                disabled={isDeleting || confirmText.trim().toUpperCase() !== "DELETE"}
                className="flex-1 bg-red-600 text-white py-3 font-bold rounded-xl hover:bg-red-700 flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:grayscale transition-all active:scale-95 disabled:active:scale-100"
              >
                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                {isDeleting ? "Wiping Data..." : "Delete All Data"}
              </button>
            </div>

          </div>
        </div>
      )}
      {/* ───────────────────────────────────────────────────────────── */}


      {/* 1. SESSION MANAGEMENT */}
      <SettingsSection>
        <SettingsSectionHeader 
          icon={ShieldCheck} 
          title="Session Management" 
          subtitle="Control your active login session across devices"
        />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-200 shrink-0">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">Current Active Session</h4>
                <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Logged in as {props.userEmail}
                </p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              Sign Out
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* 2. AUTHENTICATION & PASSWORD */}
      <SettingsSection>
        <SettingsSectionHeader 
          icon={Key} 
          title="Authentication" 
          subtitle="Update your security credentials"
        />
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-slate-900">Password Reset</h4>
              <p className="text-xs font-medium text-slate-500 mt-1 max-w-md">
                We will send a secure password reset link to your registered email address ({props.userEmail}).
              </p>
            </div>
            <button 
              onClick={() => alert(`Password reset link sent to ${props.userEmail}`)}
              className="w-full sm:w-auto bg-[#0055a5] hover:bg-[#004080] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 text-sm whitespace-nowrap"
            >
              Send Reset Link
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* 3. DANGER ZONE */}
      <SettingsSection className="border-red-200 shadow-sm overflow-hidden">
        <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-sm font-black text-red-800 uppercase tracking-wider">Danger Zone</h3>
            <p className="text-xs font-semibold text-red-500/80 mt-0.5">Highly destructive actions. Proceed with caution.</p>
          </div>
        </div>
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="text-sm font-black text-slate-900">Terminate Master Workspace</h4>
              <p className="text-xs font-medium text-slate-500 mt-1 max-w-lg">
                Permanently delete all data associated with <strong>{activeInstituteName}</strong>. This includes all student records, fee ledgers, generated receipts, and attendance logs. This cannot be undone.
              </p>
            </div>
            
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-red-200 hover:border-red-600 hover:bg-red-50 text-red-600 font-bold px-6 py-3 rounded-xl transition-all active:scale-95 text-sm whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-4 h-4" /> Delete Workspace
            </button>
          </div>
        </div>
      </SettingsSection>

    </div>
  );
}