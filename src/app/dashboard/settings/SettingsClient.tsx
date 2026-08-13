"use client";

import { useState } from "react";
import {
  Building2, CreditCard, Shield, Save, Upload,
  CheckCircle2, Zap, DownloadCloud, Eye, EyeOff,
  Smartphone, Monitor, Globe, LogOut, ChevronRight,
  AlertTriangle, RefreshCw, Star, ArrowUpRight,
  Lock, Mail, Phone, MapPin, Hash, Clock
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Props = {
  userEmail: string;
  instituteName: string;
  instituteSlug: string;
  city: string;
  isTrialExpired: boolean;
  daysLeft: number;
  isPaid: boolean;
  currentPlan: string;
};

type Tab = "general" | "billing" | "security";

// ─── Shared Primitives ────────────────────────────────────────────────────────
const inputCls =
  "w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 bg-white " +
  "focus:border-[#0055a5] focus:ring-2 focus:ring-[#0055a5]/10 outline-none transition-all placeholder:text-slate-400";

const labelCls = "block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white border border-slate-200 rounded-2xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon?: any }) => (
  <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
    {Icon && (
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#0055a5]" />
      </div>
    )}
    <div>
      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ─── General Tab ──────────────────────────────────────────────────────────────
function GeneralTab({ instituteName, userEmail, city }: Pick<Props, "instituteName" | "userEmail" | "city">) {
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Institute Identity */}
      <Card>
        <CardHeader title="Institute Identity" subtitle="Your public-facing brand information" icon={Building2} />
        <div className="p-6 space-y-5">
          {/* Logo Upload */}
          <div>
            <label className={labelCls}>Institute Logo</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); }}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                dragOver
                  ? "border-[#0055a5] bg-blue-50"
                  : "border-slate-200 hover:border-[#0055a5]/50 hover:bg-slate-50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-xl bg-[#003366] flex items-center justify-center text-white font-black text-xl shadow-md">
                  {instituteName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mt-2">
                    <span className="text-[#0055a5]">Click to upload</span> or drag & drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG up to 2MB. Recommended: 400×400px</p>
                </div>
                <button className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#0055a5] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Logo
                </button>
              </div>
            </div>
          </div>

          {/* Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><Building2 className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Institute Name</label>
              <input type="text" defaultValue={instituteName} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><Hash className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Registration Number</label>
              <input type="text" defaultValue="EDU-REG-2024-00847" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><Mail className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Support Email</label>
              <input type="email" defaultValue={userEmail} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><Phone className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Contact Phone</label>
              <input type="tel" defaultValue="+91 63068 14355" className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}><MapPin className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Full Address</label>
              <input type="text" defaultValue={`Near Bus Stand, Civil Lines, ${city}, Uttar Pradesh - 273001`} className={inputCls} />
            </div>
          </div>
        </div>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader title="Preferences" subtitle="Regional and display settings" icon={Globe} />
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Default Currency</label>
              <div className="relative">
                <select defaultValue="INR" className={inputCls + " appearance-none pr-8"}>
                  <option value="INR">INR — Indian Rupee (₹)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                  <option value="GBP">GBP — British Pound (£)</option>
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}><Clock className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />Timezone</label>
              <div className="relative">
                <select defaultValue="Asia/Kolkata" className={inputCls + " appearance-none pr-8"}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Save Bar */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all ${
            saved
              ? "bg-green-500 text-white"
              : "bg-[#0055a5] hover:bg-[#004080] text-white"
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────
const INVOICES = [
  { id: "INV-2026-08", date: "01 Aug 2026", amount: "₹2,499", status: "Paid" },
  { id: "INV-2026-07", date: "01 Jul 2026", amount: "₹2,499", status: "Paid" },
  { id: "INV-2026-06", date: "01 Jun 2026", amount: "₹2,499", status: "Paid" },
];

function BillingTab({ isPaid, currentPlan, daysLeft, isTrialExpired }: Pick<Props, "isPaid" | "currentPlan" | "daysLeft" | "isTrialExpired">) {
  const planLabel = isPaid ? (currentPlan || "Pro Plan") : (isTrialExpired ? "Trial Expired" : "Free Trial");
  const studentsUsed = 342;
  const studentsMax  = 500;
  const storageUsed  = 45;
  const storageMax   = 100;

  return (
    <div className="space-y-5">
      {/* Current Plan */}
      <Card>
        <div className="bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-xs font-black text-amber-300 uppercase tracking-widest">Pro Plan</span>
              </div>
              <p className="text-3xl font-black text-white">₹2,499<span className="text-base font-semibold text-white/60"> / month</span></p>
              <p className="text-sm text-white/60 mt-1">Billed monthly · Next renewal: 1 Sep 2026</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              {isPaid ? (
                <span className="flex items-center gap-1.5 bg-green-500 text-white text-[11px] font-black px-3 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> ACTIVE
                </span>
              ) : (
                <span className={`text-[11px] font-black px-3 py-1 rounded-full ${isTrialExpired ? "bg-red-500 text-white" : "bg-amber-400 text-amber-900"}`}>
                  {isTrialExpired ? "EXPIRED" : `TRIAL · ${daysLeft}d left`}
                </span>
              )}
              <button className="flex items-center gap-1.5 bg-white text-[#0055a5] text-xs font-black px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-[#0055a5]" /> Upgrade Plan <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Active Students", used: studentsUsed, max: studentsMax, unit: "students", color: "bg-[#0055a5]" },
            { label: "Storage Used",    used: storageUsed,  max: storageMax,  unit: "GB",        color: "bg-purple-500" },
          ].map(s => (
            <div key={s.label}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-600">{s.label}</span>
                <span className="text-xs font-black text-slate-900">{s.used} / {s.max} {s.unit}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${s.color} ${(s.used / s.max) > 0.85 ? "animate-pulse" : ""}`}
                  style={{ width: `${(s.used / s.max) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{Math.round((s.used / s.max) * 100)}% used</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader title="Payment Method" subtitle="Saved payment details for auto-renewal" icon={CreditCard} />
        <div className="p-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-slate-800 rounded-md flex items-center justify-center shrink-0">
              <div className="text-white text-[9px] font-black tracking-wider">VISA</div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Visa ending in <span className="font-black text-slate-900">4242</span></p>
              <p className="text-xs text-slate-500 mt-0.5">Expires 08/2028 · Billing to {">"}admin@futureq.com</p>
            </div>
          </div>
          <button className="text-xs font-bold text-[#0055a5] hover:underline flex items-center gap-1 whitespace-nowrap">
            <RefreshCw className="w-3.5 h-3.5" /> Update Method
          </button>
        </div>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader title="Billing History" subtitle="Past invoices and payment records" icon={Clock} />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Invoice</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wide">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INVOICES.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-600">{inv.id}</td>
                  <td className="px-6 py-3.5 text-slate-700 font-medium text-[13px]">{inv.date}</td>
                  <td className="px-6 py-3.5 font-black text-slate-900 tabular-nums">{inv.amount}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0055a5] transition-colors" title="Download PDF">
                      <DownloadCloud className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
const SESSIONS = [
  { device: "Windows 11", browser: "Chrome 126", ip: "192.168.97.161", current: true,  time: "Active now"       },
  { device: "Android 14", browser: "Chrome Mobile", ip: "103.21.58.4", current: false, time: "2 hours ago"     },
  { device: "macOS 14",   browser: "Safari 17",   ip: "157.47.92.10", current: false, time: "Yesterday, 9 PM" },
];

function SecurityTab() {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [twoFA, setTwoFA]               = useState(false);
  const [pwSaved, setPwSaved]           = useState(false);

  const handlePwSave = () => {
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Password Management */}
      <Card>
        <CardHeader title="Password Management" subtitle="Change your account login password" icon={Lock} />
        <div className="p-6 space-y-4 max-w-lg">
          {[
            { label: "Current Password", show: showCurrent, toggle: () => setShowCurrent(p => !p) },
            { label: "New Password",     show: showNew,     toggle: () => setShowNew(p => !p)     },
            { label: "Confirm Password", show: showConfirm, toggle: () => setShowConfirm(p => !p) },
          ].map(f => (
            <div key={f.label}>
              <label className={labelCls}>{f.label}</label>
              <div className="relative">
                <input
                  type={f.show ? "text" : "password"}
                  placeholder="••••••••••••"
                  className={inputCls + " pr-10"}
                />
                <button
                  type="button"
                  onClick={f.toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {f.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <p className="text-[11px] font-semibold text-[#0055a5]">
              Use 8+ characters with a mix of uppercase, lowercase, numbers, and symbols.
            </p>
          </div>

          <button
            onClick={handlePwSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
              pwSaved ? "bg-green-500 text-white" : "bg-[#0055a5] hover:bg-[#004080] text-white"
            }`}
          >
            {pwSaved ? <CheckCircle2 className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            {pwSaved ? "Password Updated!" : "Update Password"}
          </button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader title="Two-Factor Authentication" subtitle="Add an extra layer of security to your account" icon={Smartphone} />
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFA ? "bg-green-100" : "bg-slate-100"}`}>
                <Smartphone className={`w-5 h-5 ${twoFA ? "text-green-600" : "text-slate-400"}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Authenticator App (TOTP)</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {twoFA ? "Active — your account is protected with 2FA" : "Not configured — enable to secure your login"}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => setTwoFA(p => !p)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#0055a5]/30 ${
                twoFA ? "bg-[#0055a5]" : "bg-slate-200"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                  twoFA ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {twoFA && (
            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-green-800">2FA is enabled</p>
                <p className="text-xs text-green-700 mt-0.5">Your account is now protected with time-based one-time passwords via Google Authenticator or Authy.</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader title="Active Sessions" subtitle="Devices currently signed into your account" icon={Monitor} />
        <div className="divide-y divide-slate-100">
          {SESSIONS.map((s, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${s.current ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                <div>
                  <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {s.device} · {s.browser}
                    {s.current && (
                      <span className="text-[10px] font-black bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">IP: {s.ip} · {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                  Sign Out
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
          <button className="flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out of all other devices
          </button>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader title="Danger Zone" subtitle="Irreversible account actions" icon={AlertTriangle} />
        <div className="p-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-800">Delete Institute Account</p>
            <p className="text-xs text-slate-500 mt-0.5">Permanently deletes all data. This action cannot be undone.</p>
          </div>
          <button className="flex items-center gap-2 text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap">
            <AlertTriangle className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </Card>
    </div>
  );
}

// ─── Main Shell ───────────────────────────────────────────────────────────────
export default function SettingsClient({
  userEmail, instituteName, instituteSlug, city,
  isTrialExpired, daysLeft, isPaid, currentPlan,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const TABS: { id: Tab; label: string; icon: any; desc: string }[] = [
    { id: "general",  label: "General",       icon: Building2,  desc: "Profile & preferences"  },
    { id: "billing",  label: "Billing & Plans", icon: CreditCard, desc: "Subscription & invoices" },
    { id: "security", label: "Security",      icon: Shield,     desc: "Password & sessions"    },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4f6]">

      {/* ── Page Header ── */}
      <div className="bg-gradient-to-r from-[#003366] via-[#004b87] to-[#0066cc] px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-1">Institute Settings</p>
          <h1 className="text-2xl font-black text-white tracking-tight">{instituteName}</h1>
          <p className="text-white/50 text-sm mt-0.5">Manage your institute profile, billing, and security settings.</p>
        </div>
      </div>

      {/* ── Tab Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: Tab Navigation */}
          <nav className="lg:w-64 shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</p>
            </div>
            <div className="p-2 space-y-0.5">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all group ${
                    activeTab === tab.id
                      ? "bg-blue-50 border-l-4 border-[#0055a5] pl-2.5"
                      : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    activeTab === tab.id ? "bg-[#0055a5]" : "bg-slate-100 group-hover:bg-slate-200"
                  }`}>
                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-slate-500"}`} />
                  </div>
                  <div>
                    <p className={`text-sm font-bold transition-colors ${
                      activeTab === tab.id ? "text-[#0055a5]" : "text-slate-700"
                    }`}>{tab.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{tab.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Account Mini-card */}
            <div className="m-2 mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1">Logged in as</p>
              <p className="text-xs font-bold text-slate-700 truncate">{userEmail}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">ID: {instituteSlug}</p>
            </div>
          </nav>

          {/* Right: Content */}
          <div className="flex-1 min-w-0">
            {activeTab === "general" && (
              <GeneralTab instituteName={instituteName} userEmail={userEmail} city={city} />
            )}
            {activeTab === "billing" && (
              <BillingTab isPaid={isPaid} currentPlan={currentPlan} daysLeft={daysLeft} isTrialExpired={isTrialExpired} />
            )}
            {activeTab === "security" && <SecurityTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
