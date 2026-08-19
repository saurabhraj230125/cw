"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Building2, Save, UploadCloud, Loader2, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { SettingsSection, SettingsSectionHeader, Label, inputCls } from "./Primitives";
import { SettingsShellProps } from "./index";

export default function GeneralTab(props: SettingsShellProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Form State
  const [formData, setFormData] = useState({
    name: props.instituteName !== "Not Set" ? props.instituteName : "",
    slug: props.instituteSlug !== "Not Set" ? props.instituteSlug : "",
    regNumber: props.registrationNumber !== "Not Set" ? props.registrationNumber : "",
    ownerName: props.ownerName !== "Not Set" ? props.ownerName : "",
    aadhaar: props.aadhaarNumber !== "Not Set" ? props.aadhaarNumber : "",
    pan: props.panNumber !== "Not Set" ? props.panNumber : "",
    city: props.city !== "Not Set" ? props.city : "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // 🚨 DEEP FIX: REAL LOGO UPLOAD TO SUPABASE STORAGE
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Logo must be less than 2MB.");
      return;
    }

    setIsUploadingLogo(true);
    setSuccessMessage("");

    try {
      // 1. Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${props.membershipId}-logo-${Date.now()}.${fileExt}`;

      // 2. Upload to Supabase Storage (institute_logos bucket)
      const { error: uploadError } = await supabase.storage
        .from('institute_logos')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;

      // 3. Get the Public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('institute_logos')
        .getPublicUrl(fileName);

      // 4. Save the URL to the institutes table
      const { error: dbError } = await supabase
        .from('institutes')
        .update({ logo_url: publicUrl })
        .eq('id', props.membershipId);

      if (dbError) throw dbError;

      setSuccessMessage("Logo updated successfully!");
      
      // 5. 🚨 CRITICAL: Force Next.js to refresh the layout, instantly updating the sidebar!
      router.refresh();

    } catch (error: any) {
      console.error(error);
      alert("Failed to upload logo. Ensure 'institute_logos' bucket exists and is Public. Error: " + error.message);
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  // 🚨 SAVE GENERAL INFO
  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      const { error: instError } = await supabase
        .from('institutes')
        .update({
          name: formData.name,
          slug: formData.slug,
          registration_number: formData.regNumber,
          owner_name: formData.ownerName,
          aadhaar_number: formData.aadhaar,
          pan_number: formData.pan,
        })
        .eq('id', props.membershipId);

      if (instError) throw instError;

      // Update City in Branches
      await supabase
        .from('branches')
        .update({ city: formData.city })
        .eq('institute_id', props.membershipId);

      setSuccessMessage("Institute details updated successfully!");
      router.refresh();
      
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error: any) {
      alert("Failed to update details: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = formData.name ? formData.name.substring(0, 2).toUpperCase() : "CW";

  return (
    <div className="space-y-5">
      
      {/* ── BRANDING & LOGO SECTION ── */}
      <SettingsSection>
        <SettingsSectionHeader icon={ImageIcon} subtitle="Update your institute's visual identity" title="Brand Logo"/>
        <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
          
          {/* Logo Preview */}
          <div className="w-24 h-24 rounded-2xl border-2 border-slate-100 shadow-sm overflow-hidden flex flex-col items-center justify-center bg-slate-50 shrink-0 relative group">
            {isUploadingLogo ? (
              <Loader2 className="w-8 h-8 animate-spin text-[#0055a5]" />
            ) : props.logoUrl ? (
              <img src={props.logoUrl} alt="Institute Logo" className="w-full h-full object-contain bg-white p-1" />
            ) : (
              <span className="text-3xl font-black text-[#0055a5]/30">{initials}</span>
            )}
            
            {/* Hover Overlay */}
            {!isUploadingLogo && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex flex-col items-center justify-center text-white"
              >
                <UploadCloud className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
              </div>
            )}
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-900 mb-1">Institute Logo</h4>
            <p className="text-xs text-slate-500 font-medium max-w-sm mb-4">
              This logo will be displayed on your main dashboard sidebar, student portal, and generated fee receipts. Recommended size: 256x256px (Max 2MB).
            </p>
            
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg, image/webp" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleLogoUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-[#0055a5] hover:text-[#0055a5] text-slate-700 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-sm disabled:opacity-50"
            >
              {isUploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4"/>}
              {isUploadingLogo ? "Uploading..." : "Upload New Logo"}
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* ── INSTITUTE DETAILS FORM ── */}
      <form onSubmit={handleSaveInfo}>
        <SettingsSection>
          <SettingsSectionHeader icon={Building2} subtitle="Official registry and operational details" title="Institute Details"/>
          <div className="p-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <div className="sm:col-span-2">
                <Label>Registered Institute Name</Label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="e.g. CoachingWala Academy"/>
              </div>

              <div>
                <Label>Institute Slug (URL)</Label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className={inputCls} placeholder="coachingwala-academy"/>
              </div>

              <div>
                <Label>Registration Number (CIN / Udyam)</Label>
                <input type="text" value={formData.regNumber} onChange={e => setFormData({...formData, regNumber: e.target.value})} className={inputCls} placeholder="Not Set"/>
              </div>

              <div>
                <Label>Owner Full Name</Label>
                <input required type="text" value={formData.ownerName} onChange={e => setFormData({...formData, ownerName: e.target.value})} className={inputCls} placeholder="John Doe"/>
              </div>

              <div>
                <Label>Primary Operating City</Label>
                <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={inputCls} placeholder="e.g. Delhi"/>
              </div>

              <div>
                <Label>Aadhaar Number (Owner)</Label>
                <input type="text" value={formData.aadhaar} onChange={e => setFormData({...formData, aadhaar: e.target.value})} className={inputCls} placeholder="Not Set"/>
              </div>

              <div>
                <Label>PAN Number (Business / Individual)</Label>
                <input type="text" value={formData.pan} onChange={e => setFormData({...formData, pan: e.target.value.toUpperCase()})} className={inputCls} placeholder="Not Set"/>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-bold text-green-600 flex items-center gap-1.5 h-6">
                {successMessage && <><CheckCircle2 className="w-4 h-4" /> {successMessage}</>}
              </div>
              
              <button 
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0055a5] hover:bg-[#004080] text-white font-black px-8 py-3 rounded-xl shadow-lg shadow-[#0055a5]/20 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5"/>}
                {isSaving ? "Saving Changes..." : "Save Institute Details"}
              </button>
            </div>

          </div>
        </SettingsSection>
      </form>
    </div>
  );
}