import { useState } from "react";
import {
  Building2, Mail, Phone, MapPin, Hash, Globe, Clock,
  Save, CheckCircle2, Upload, ChevronRight
} from "lucide-react";
import { Label, inputCls, SettingsSection, SettingsSectionHeader, SaveBar } from "./Primitives";

type Props = {
  instituteName: string;
  userEmail: string;
  city: string;
};

export default function GeneralTab({ instituteName, userEmail, city }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Landscape combined identity section */}
      <SettingsSection>
        <SettingsSectionHeader icon={Building2} subtitle="Manage branding & fallbacks" title="Institute Identity"/>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            
            {/* Logo Left Column (Landscape) */}
            <div className="lg:col-span-1 flex flex-col items-center">
              <Label>Institute Logo</Label>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); }}
                className={`relative border-2 border-dashed rounded-2xl w-full h-full aspect-square text-center transition-all cursor-pointer group flex items-center justify-center ${
                  dragOver ? "border-[#0055a5] bg-blue-50" : "border-slate-200 hover:border-[#0055a5]/50 hover:bg-slate-50"
                }`}
              >
                <div className="w-16 h-16 rounded-2xl bg-[#003366] flex items-center justify-center text-white font-black text-2xl shadow-md border-4 border-white">
                  {instituteName.substring(0, 2).toUpperCase()}
                </div>
                <div className="absolute inset-2 bg-white/70 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-5 h-5 text-[#0055a5]"/>
                  <span className="text-[10px] font-black text-[#0055a5] uppercase">Click or Drag</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 font-medium">SVG, PNG, JPG (Max 2MB)</p>
            </div>

            {/* Combined Main Fields Column */}
            <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <FallbackInput defaultValue={instituteName} icon={Building2} label="Institute Name"/>
              <FallbackInput defaultValue="future-q" icon={Hash} label="Slug / ID"/>
              <FallbackInput defaultValue="EDU-REG-2024-847" icon={Hash} label="Registration Number"/>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Landscape Contact Grid */}
      <SettingsSection>
        <SettingsSectionHeader icon={MapPin} subtitle="Manage how we reach you" title="Contact & Address"/>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FallbackInput defaultValue={userEmail} icon={Mail} label="Support Email"/>
            <FallbackInput defaultValue="+91 63068 14355" icon={Phone} label="Contact Phone"/>
            <div className="md:col-span-2">
              <FallbackInput defaultValue={`Near Bus Stand, Civil Lines, ${city}, Uttar Pradesh - 273001`} icon={MapPin} label="Full Registered Address"/>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Landscape Preferences */}
      <SettingsSection>
        <SettingsSectionHeader icon={Globe} subtitle="Currency & display preferences" title="Regional Settings"/>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Default Currency</Label>
              <div className="relative">
                <select defaultValue="INR" className={inputCls + " appearance-none pr-8"}>
                  <option value="INR">INR — Indian Rupee (₹)</option>
                  <option value="USD">USD — US Dollar ($)</option>
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"/>
              </div>
            </div>
            <div>
              <Label icon={Clock}>Timezone</Label>
              <div className="relative">
                <select defaultValue="Asia/Kolkata" className={inputCls + " appearance-none pr-8"}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                </select>
                <ChevronRight className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none"/>
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SaveBar>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all ${
            saved ? "bg-green-500 text-white" : "bg-[#0055a5] hover:bg-[#004080] text-white"
          }`}
        >
          {saved ? <CheckCircle2 className="w-4 h-4"/> : <Save className="w-4 h-4"/>}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </SaveBar>
    </div>
  );
}

// Internal standard component for fallbacks
function FallbackInput({ label, defaultValue, icon: Icon }: { label: string; defaultValue: string; icon?: any }) {
  const isFallback = typeof defaultValue === "string" && defaultValue.includes("Not Set");
  return (
    <div>
      <Label icon={Icon}>{label}</Label>
      <input
        type="text"
        defaultValue={defaultValue}
        className={`${inputCls} ${
          isFallback
            ? "border-red-200 text-red-700 bg-red-50 focus:border-red-400 focus:ring-red-100 focus:bg-white"
            : ""
        }`}
      />
      {isFallback && <p className="text-[10px] text-red-500 mt-1 font-medium">Fallback value detected.</p>}
    </div>
  );
}