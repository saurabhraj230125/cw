import { useState } from "react";
import { Lock, Eye, EyeOff, Shield, Smartphone, Monitor, AlertTriangle, LogOut, CheckCircle2 } from "lucide-react";
import { Label, inputCls, SettingsSection, SettingsSectionHeader } from "./Primitives";

const SESSIONS = [
  { device: "Windows 11", browser: "Chrome", ip: "192.168.97.161", current: true, time: "Active now" },
  { device: "Android 14", browser: "Chrome Mobile", ip: "103.21.58.4", current: false, time: "2 hours ago" },
  { device: "macOS 14", browser: "Safari 17", ip: "157.47.92.10", current: false, time: "Yesterday, 9 PM" },
];

export default function SecurityTab() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);

  const handlePwSave = () => {
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Landscape Passwords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        <SettingsSection>
          <SettingsSectionHeader icon={Lock} subtitle="Change login credentials" title="Account Password"/>
          <div className="p-6 space-y-4">
            {[
              { label: "Current Password", show: showCurrent, toggle: () => setShowCurrent(p => !p) },
              { label: "New Password", show: showNew, toggle: () => setShowNew(p => !p) },
              { label: "Confirm Password", show: showConfirm, toggle: () => setShowConfirm(p => !p) },
            ].map(f => (
              <div key={f.label}>
                <Label>{f.label}</Label>
                <div className="relative">
                  <input
                    type={f.show ? "text" : "password"}
                    placeholder="••••••••••••"
                    className={inputCls + " pr-10"}
                  />
                  <button type="button" onClick={f.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {f.show ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handlePwSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                pwSaved ? "bg-green-500 text-white" : "bg-[#0055a5] hover:bg-[#004080] text-white"
              }`}
            >
              {pwSaved ? <CheckCircle2 className="w-4 h-4"/> : <Shield className="w-4 h-4"/>}
              {pwSaved ? "Password Updated!" : "Update Password"}
            </button>
          </div>
        </SettingsSection>

        {/* 2FA (Landscape) */}
        <SettingsSection>
          <SettingsSectionHeader icon={Smartphone} subtitle="Extra layer of protection" title="Two-Factor Auth"/>
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between gap-4 mb-4 flex-1">
              <p className="text-sm font-bold text-slate-800">Authenticator App (TOTP)</p>
              <button
                onClick={() => setTwoFA(p => !p)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0055a5]/30 ${
                  twoFA ? "bg-[#0055a5]" : "bg-slate-200"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${twoFA ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
            {twoFA ? (
              <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-xs font-semibold text-green-800">
                2FA is Active. Account is secure.
              </div>
            ) : (
              <p className="text-xs text-slate-500">Enable to require a security code on each login attempt.</p>
            )}
          </div>
        </SettingsSection>
      </div>

      {/* Landscape Session Grid */}
      <SettingsSection>
        {/* Fixed Header Syntax Error Here */}
        <SettingsSectionHeader 
          icon={Monitor} 
          subtitle="Devices currently signed into your account" 
          title="Active Sessions"
          action={
            <button className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
              <LogOut className="w-4 h-4"/>
              Sign out of all other devices
            </button>
          }
        />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SESSIONS.map((s, i) => (
              <div key={i} className={`border border-slate-100 rounded-2xl p-5 flex flex-col justify-between ${s.current ? "bg-blue-50/50 border-[#0055a5]/30 ring-2 ring-[#0055a5]/5" : "bg-white"}`}>
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.current ? "bg-white text-[#0055a5] border" : "bg-slate-100 text-slate-400"}`}>
                    {s.device.includes("Win") ? <Monitor className="w-5 h-5"/> : <Smartphone className="w-5 h-5"/>}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-950 truncate flex items-center gap-2">
                      {s.device} · {s.browser}
                      {s.current && <span className="text-[10px] font-black bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full">Current</span>}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">IP: {s.ip} · {s.time}</p>
                  </div>
                </div>
                {!s.current && (
                  <button className="w-full text-center bg-red-100 hover:bg-red-200 text-red-700 text-xs font-black px-4 py-2.5 rounded-xl transition-colors">
                    Sign Out
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* Danger zone */}
      <SettingsSection>
        <SettingsSectionHeader icon={AlertTriangle} subtitle="Irreversible actions" title="Danger Zone"/>
        <div className="p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-950">Delete Institute Account</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently deletes all data. This cannot be undone.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
            <AlertTriangle className="w-4 h-4"/> Delete Account
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}