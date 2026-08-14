"use client";

import { Suspense, useState, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronRight, ChevronLeft, Save, Plus, 
  Upload, Trash2, CheckSquare, Edit3, AlertTriangle, Loader2, Calculator, CalendarClock,
  Zap, Mail, BellRing, SplitSquareHorizontal, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";

// IMPORT REAL DATABASE ACTIONS
import { getCourses } from "../../../actions/course-actions";
import { getBatches } from "../../../actions/batch-actions"; 
import { addStudentAction, updateStudentAction, getStudentById } from "../../../actions/student-actions"; 

const steps = [
  { id: 1, name: "1. Student Details" },
  { id: 2, name: "2. Guardian Details" },
  { id: 3, name: "3. Admission Details" },
  { id: 4, name: "4. Payment Details" },
  { id: 5, name: "5. Batch & Automations" },
];

export default function NewStudentAdmissionPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <p className="text-gray-500 font-bold flex items-center gap-2 text-erp-lg">
          <Loader2 className="w-5 h-5 animate-spin text-cw-blue" /> Loading Admission Wizard...
        </p>
      </main>
    }>
      <AdmissionWizard />
    </Suspense>
  );
}

function AdmissionWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditMode = !!editId; 

  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // DYNAMIC MASTER DATABASE STATE
  const [masterCourses, setMasterCourses] = useState<any[]>([]);
  const [masterBatches, setMasterBatches] = useState<any[]>([]);
  const [isFetchingMasterData, setIsFetchingMasterData] = useState(true);
  
  const [showSecondaryGuardian, setShowSecondaryGuardian] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);

  // CENTRALIZED FORM STATE
  const [formData, setFormData] = useState({
    firstName: "", middleName: "", lastName: "",
    phone: "", email: "", gender: "Male", category: "Select",
    aadhar: "", dob: "", rollNo: "",
    guardianName: "", guardianRelation: "Father", guardianPhone: "", guardianEmail: "",
    secGuardianName: "", secGuardianRelation: "Mother", secGuardianPhone: "", secGuardianEmail: "",
    admissionDate: new Date().toISOString().split('T')[0],
    courseId: "", courseName: "", baseFee: 0, discount: 0,
    amountPaid: 0, paymentMode: "Cash",
    batch: "",
    sendWelcomeEmail: true,
    setupInstallmentReminders: true
  });

  const [installments, setInstallments] = useState<any[]>([]);
  const [splitCount, setSplitCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadMasterData() {
      setIsFetchingMasterData(true);
      try {
        const [courses, batches] = await Promise.all([ getCourses(), getBatches() ]);
        if (isMounted) {
          setMasterCourses(courses || []);
          setMasterBatches(batches || []);
        }
      } catch (err) {
        console.error("Failed to load master data", err);
      } finally {
        if (isMounted) setIsFetchingMasterData(false);
      }
    }
    loadMasterData();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function fetchEditStudent() {
      if (!isEditMode || !editId) return;

      setIsLoadingEditData(true);
      try {
        const res = await getStudentById(editId);
        if (isMounted && res.success && res.data) {
          const s = res.data;

          const nameParts = (s.full_name || "").trim().split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
          const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

          const linkedCourseId = s.student_subjects?.[0]?.subjects?.id || ""; 
          const linkedCourseName = s.course_id || "";

          if (s.sec_guardian_name) {
            setShowSecondaryGuardian(true);
          }

          setFormData({
            firstName, middleName, lastName,
            phone: s.whatsapp_number || s.parent_phone || "",
            email: s.email || "",
            gender: s.gender || "Male",
            category: s.category || "General",
            aadhar: s.government_id || "",
            dob: s.date_of_birth || "",
            rollNo: s.roll_number || "",
            guardianName: s.guardian_name || s.father_name || "",
            guardianRelation: s.guardian_relation || "Father",
            guardianPhone: s.parent_phone || "",
            guardianEmail: s.guardian_email || "",
            secGuardianName: s.sec_guardian_name || "",
            secGuardianRelation: s.sec_guardian_relation || "Mother",
            secGuardianPhone: s.sec_guardian_phone || "",
            secGuardianEmail: s.sec_guardian_email || "",
            admissionDate: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            courseId: linkedCourseId,
            courseName: linkedCourseName,
            baseFee: Number(s.gross_fee) || 0,
            discount: Number(s.discount_amount) || 0,
            amountPaid: Number(s.amount_paid) || 0,
            paymentMode: s.payment_mode || "Cash",
            batch: s.batch_id || "",
            sendWelcomeEmail: true,
            setupInstallmentReminders: true
          });
        }
      } catch (err) {
        console.error("Error loading edit data:", err);
        setSaveError("Failed to fetch student record for editing.");
      } finally {
        if (isMounted) setIsLoadingEditData(false);
      }
    }

    fetchEditStudent();
    return () => { isMounted = false; };
  }, [isEditMode, editId]);

  // THE REAL-TIME FINANCIAL ENGINE
  const netTotal = Math.max(0, formData.baseFee - formData.discount);
  const balanceDue = Math.max(0, netTotal - formData.amountPaid);
  const currentInstallmentSum = installments.reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);

  // AUTO-SPLITTER MATH ENGINE
  useEffect(() => {
    if (splitCount > 0 && balanceDue > 0) {
      const baseAmount = Math.floor(balanceDue / splitCount);
      const lastAmount = balanceDue - (baseAmount * (splitCount - 1));
      
      const newInstalments = [];
      const today = new Date();

      for (let i = 0; i < splitCount; i++) {
        const instDate = new Date(today);
        instDate.setDate(instDate.getDate() + (30 * (i + 1))); 
        
        newInstalments.push({
          id: Date.now() + i, 
          date: instDate.toISOString().split('T')[0],
          amount: i === splitCount - 1 ? lastAmount : baseAmount
        });
      }
      setInstallments(newInstalments);
    }
  }, [balanceDue, splitCount]);

  const validateStep = (step: number) => {
    setSaveError(null);
    if (step === 1) {
      if (!formData.rollNo.trim()) { setSaveError("Roll Number is required to proceed."); return false; }
      if (!formData.firstName.trim()) { setSaveError("First Name is required to proceed."); return false; }
      if (!formData.phone.trim() || formData.phone.length < 10) { setSaveError("A valid 10-digit Primary Contact Number is required."); return false; }
    }
    if (step === 3) {
      if (!formData.courseId && formData.baseFee === 0) { 
        setSaveError("You must select a Master Course from the configuration table."); 
        return false; 
      }
    }
    if (step === 4 && showInstallments && balanceDue > 0) {
      if (currentInstallmentSum !== balanceDue) {
        setSaveError(`Installment Ledger mismatch! The sum of installments (₹${currentInstallmentSum}) must exactly equal the Balance Due (₹${balanceDue}).`);
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, 5));
  };
  const handlePrev = () => {
    setSaveError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleCourseSelect = (selectedId: string) => {
    const selectedCourse = masterCourses.find((c: any) => c.id === selectedId);
    setFormData(prev => ({
      ...prev,
      courseId: selectedId,
      courseName: selectedCourse ? selectedCourse.name : "",
      baseFee: selectedCourse ? Number(selectedCourse.fee) : 0, 
      discount: 0, amountPaid: 0
    }));
    setSplitCount(0); setInstallments([]); setShowInstallments(false);
  };

  const generateInstallments = () => {
    setShowInstallments(true);
  };

  // =======================================================
  // DEEP FINTECH FIX: AUTO-BALANCING SMART LEDGER
  // =======================================================
  const updateInstallment = (id: number, field: string, value: string | number) => {
    let updated = installments.map((inst: any) => 
      inst.id === id ? { ...inst, [field]: value } : inst
    );

    // If they manually edit an AMOUNT, auto-adjust the LAST installment to keep math perfect
    if (field === "amount" && updated.length > 1) {
      const editedIndex = updated.findIndex((inst: any) => inst.id === id);
      const lastIndex = updated.length - 1;

      if (editedIndex !== lastIndex) {
        const sumWithoutLast = updated.reduce((acc: number, curr: any, idx: number) => 
          acc + (idx !== lastIndex ? (Number(curr.amount) || 0) : 0), 0
        );
        updated[lastIndex].amount = Math.max(0, balanceDue - sumWithoutLast);
      }
    }

    setInstallments(updated);
    if (field === "amount") setSplitCount(0); // Break auto-split lock
  };

  const addInstallment = () => {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + installments.length + 1);
    setInstallments([...installments, { id: Date.now(), date: nextDate.toISOString().split('T')[0], amount: 0 }]);
    setSplitCount(0);
  };

  const removeInstallment = (id: number) => {
    setInstallments(installments.filter((inst: any) => inst.id !== id));
    setSplitCount(0);
  };

  const handleFinish = async () => {
    if (!validateStep(5)) return; 
    if (!formData.batch) return setSaveError("You must strictly assign the student to an active batch before saving.");

    setIsSaving(true);
    setSaveError(null);

    try {
      const submitData = new FormData();
      submitData.append("roll_number", formData.rollNo);
      submitData.append("full_name", `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim());
      submitData.append("parent_phone", formData.guardianPhone || formData.phone);
      submitData.append("whatsapp_number", formData.phone);
      submitData.append("email", formData.email);
      submitData.append("dob", formData.dob);
      submitData.append("gender", formData.gender);
      submitData.append("category", formData.category);
      submitData.append("government_id", formData.aadhar);

      submitData.append("guardian_name", formData.guardianName);
      submitData.append("guardian_relation", formData.guardianRelation);
      submitData.append("guardian_email", formData.guardianEmail);
      submitData.append("sec_guardian_name", formData.secGuardianName);
      submitData.append("sec_guardian_relation", formData.secGuardianRelation);
      submitData.append("sec_guardian_phone", formData.secGuardianPhone);
      submitData.append("sec_guardian_email", formData.secGuardianEmail);

      submitData.append("batch_id", formData.batch);
      submitData.append("course_name", formData.courseName);

      const isUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(formData.courseId);
      if (formData.courseId && isUUID) submitData.append("subject_ids", formData.courseId);

      submitData.append("gross_fee", formData.baseFee.toString());
      submitData.append("discount_amount", formData.discount.toString());
      submitData.append("amount_paid", formData.amountPaid.toString());
      submitData.append("payment_mode", formData.paymentMode);

      let response = isEditMode && editId ? await updateStudentAction(editId, submitData) : await addStudentAction(submitData);

      if (response.success) {
        
        // 🚀 LIVE MAKE.COM AUTOMATION TRIGGER
        if (formData.sendWelcomeEmail || formData.setupInstallmentReminders) {
           const webhookPayload = {
             studentName: `${formData.firstName} ${formData.lastName}`.trim(),
             email: formData.email, phone: formData.phone, batch: formData.batch, courseName: formData.courseName,
             amountPaid: formData.amountPaid, sendWelcomeEmail: formData.sendWelcomeEmail,
             setupInstallmentReminders: formData.setupInstallmentReminders, installments: installments 
           };
           try {
             await fetch("https://hook.eu1.make.com/kv91rgntri5l3zd9qcte3q4io1r4kdj3", {
               method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(webhookPayload)
             });
             console.log("Successfully fired to Make.com", webhookPayload);
           } catch (webhookError) { console.error("Webhook firing failed.", webhookError); }
        }

        alert(isEditMode ? "Student record successfully updated." : "Admission securely written to database.");
        router.push(isEditMode ? `/dashboard/students/${editId}` : "/dashboard/students"); 
      }
    } catch (err: any) {
      setSaveError(err.message || "Database execution failed. Ensure Master Tables are properly configured.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingEditData) {
    return (
      <main className="min-h-screen bg-erp-bg flex items-center justify-center">
        <p className="text-gray-500 font-bold flex items-center gap-2 text-erp-lg">
          <Loader2 className="w-5 h-5 animate-spin text-cw-blue" /> Fetching student record...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
      <div className="px-6 py-3 border-b border-erp-border bg-white shrink-0 flex justify-between items-center shadow-sm">
        <h2 className="text-erp-lg text-gray-900 font-bold flex items-center gap-2 uppercase tracking-wide">
          {isEditMode ? <Edit3 className="w-5 h-5 text-cw-blue" /> : <Plus className="w-5 h-5 text-cw-green" />}
          {isEditMode ? `Edit Master Record : ${formData.rollNo}` : "New Master Admission"}
        </h2>
        <Link href={isEditMode ? `/dashboard/students/${editId}` : "/dashboard/students"} className="text-erp-md text-cw-blue hover:underline font-bold">
          Cancel & Return
        </Link>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-[1200px] mx-auto bg-white border border-erp-border shadow-sm rounded-erp flex flex-col min-h-[700px]">
          
          {saveError && (
            <div className="bg-pastel-redBg border-b border-pastel-redBorder p-3 flex items-start gap-2 animate-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 text-cw-red shrink-0 mt-0.5" />
              <p className="text-erp-base font-bold text-cw-red leading-tight">System Blocked: <span className="font-medium">{saveError}</span></p>
            </div>
          )}

          <div className="flex border-b border-erp-border bg-erp-header overflow-x-auto hide-scrollbar">
            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isPast = currentStep > step.id;
              return (
                <div key={step.id} className={`flex-1 min-w-[160px] py-3 px-4 text-center text-erp-md font-bold border-r border-erp-border transition-colors ${isActive ? "bg-white text-cw-blue border-b-2 border-b-cw-blue shadow-sm" : isPast ? "bg-pastel-blueBg text-gray-700" : "text-gray-400"}`}>
                  {step.name}
                </div>
              );
            })}
          </div>

          <div className="flex-1 p-8 bg-white relative">
            
            {/* STEP 1: IDENTITY */}
            {currentStep === 1 && (
              <div className="flex gap-10 animate-in fade-in duration-200">
                <div className="flex-1 space-y-3 max-w-2xl">
                  <Field label="Biometric ID" placeholder="Leave blank to auto-generate" disabled={isEditMode} />
                  <div className="flex items-start mb-3">
                    <label className="w-[160px] shrink-0 text-right pr-3 text-erp-base text-black pt-1 font-bold">Picture :</label>
                    <button className="flex items-center gap-2 border border-erp-border bg-erp-header px-4 py-1 text-erp-base text-gray-700 hover:bg-gray-200 rounded-erp shadow-sm transition-colors">
                      <Upload className="w-3.5 h-3.5" /> Upload Image
                    </button>
                  </div>
                  <Field 
                    label="Roll No." 
                    placeholder="Enter roll number" 
                    value={formData.rollNo}
                    onChange={(val: string) => { setSaveError(null); setFormData({...formData, rollNo: val}); }}
                    disabled={isEditMode} required 
                  />
                  <div className="flex items-start mb-3">
                    <label className="w-[160px] shrink-0 text-right pr-3 text-erp-base text-black pt-1 font-bold"><span className="text-cw-red">*</span> Name :</label>
                    <div className="flex gap-2 flex-1 max-w-sm">
                      <input type="text" placeholder="Firstname" value={formData.firstName} onChange={(e: ChangeEvent<HTMLInputElement>) => {setSaveError(null); setFormData({...formData, firstName: e.target.value})}} className="w-1/3 border border-erp-border px-2 py-1 focus:border-cw-blue outline-none" />
                      <input type="text" placeholder="Middlename" value={formData.middleName} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, middleName: e.target.value})} className="w-1/3 border border-erp-border px-2 py-1 focus:border-cw-blue outline-none" />
                      <input type="text" placeholder="Lastname" value={formData.lastName} onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, lastName: e.target.value})} className="w-1/3 border border-erp-border px-2 py-1 focus:border-cw-blue outline-none" />
                    </div>
                  </div>
                  <Field label="Student Phone" placeholder="10-digit mobile" value={formData.phone} onChange={(val: string) => {setSaveError(null); setFormData({...formData, phone: val})}} required />
                  <Field label="Student Email" type="email" placeholder="student@domain.com" value={formData.email} onChange={(val: string) => setFormData({...formData, email: val})} />
                  <div className="flex items-center mb-3">
                    <label className="w-[160px] shrink-0 text-right pr-3 text-erp-base text-black font-bold"><span className="text-cw-red">*</span> Gender :</label>
                    <div className="flex gap-4 items-center h-[26px]">
                      <label className="flex items-center gap-1.5 text-erp-base cursor-pointer">
                        <input type="radio" checked={formData.gender === "Male"} onChange={() => setFormData({...formData, gender: "Male"})} /> Male
                      </label>
                      <label className="flex items-center gap-1.5 text-erp-base cursor-pointer">
                        <input type="radio" checked={formData.gender === "Female"} onChange={() => setFormData({...formData, gender: "Female"})} /> Female
                      </label>
                    </div>
                  </div>
                  <Field label="Category" isSelect options={["Select", "General", "OBC", "SC/ST"]} value={formData.category} onChange={(val: string) => setFormData({...formData, category: val})} />
                  <Field label="Govt. ID Number" placeholder="Enter strictly numerical ID" value={formData.aadhar} onChange={(val: string) => setFormData({...formData, aadhar: val})} />
                  <Field label="Date of Birth" type="date" value={formData.dob} onChange={(val: string) => setFormData({...formData, dob: val})} />
                </div>
              </div>
            )}

            {/* STEP 2: GUARDIANS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200 max-w-2xl">
                <div className="bg-erp-header border border-erp-border p-6 rounded-erp shadow-sm">
                  <h3 className="text-erp-lg font-bold text-gray-800 mb-5 uppercase tracking-wide border-b border-erp-borderLight pb-2">Primary Guardian Setup</h3>
                  <Field label="Guardian Name" placeholder="Full Legal Name" value={formData.guardianName} onChange={(val: string) => setFormData({...formData, guardianName: val})} />
                  <Field label="Relationship" isSelect options={["Father", "Mother", "Legal Guardian", "Uncle/Aunt"]} value={formData.guardianRelation} onChange={(val: string) => setFormData({...formData, guardianRelation: val})} />
                  <Field label="Primary Phone" placeholder="For administrative SMS alerts" value={formData.guardianPhone} onChange={(val: string) => setFormData({...formData, guardianPhone: val})} />
                  <Field label="Email Address" type="email" placeholder="guardian@domain.com" value={formData.guardianEmail} onChange={(val: string) => setFormData({...formData, guardianEmail: val})} />
                </div>

                {!showSecondaryGuardian ? (
                  <button type="button" onClick={() => setShowSecondaryGuardian(true)} className="flex items-center gap-1.5 bg-white border border-erp-border text-cw-blue px-4 py-1.5 text-erp-base font-bold hover:bg-gray-50 shadow-sm rounded-erp transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Secondary Emergency Contact
                  </button>
                ) : (
                  <div className="bg-white border border-erp-border p-6 rounded-erp shadow-sm relative animate-in fade-in slide-in-from-top-2 duration-300">
                    <button type="button" onClick={() => {setShowSecondaryGuardian(false); setFormData({...formData, secGuardianName: "", secGuardianPhone: "", secGuardianEmail: ""});}} className="absolute top-4 right-4 text-gray-400 hover:text-cw-red transition-colors flex items-center gap-1 text-erp-sm font-bold">
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                    <h3 className="text-erp-lg font-bold text-gray-800 mb-5 uppercase tracking-wide border-b border-erp-borderLight pb-2 text-cw-blue">Secondary Emergency Contact</h3>
                    <Field label="Guardian Name" placeholder="Full Legal Name" value={formData.secGuardianName} onChange={(val: string) => setFormData({...formData, secGuardianName: val})} />
                    <Field label="Relationship" isSelect options={["Mother", "Father", "Local Guardian", "Sibling"]} value={formData.secGuardianRelation} onChange={(val: string) => setFormData({...formData, secGuardianRelation: val})} />
                    <Field label="Emergency Phone" placeholder="Alternate mobile number" value={formData.secGuardianPhone} onChange={(val: string) => setFormData({...formData, secGuardianPhone: val})} />
                    <Field label="Email Address" type="email" placeholder="alternate@domain.com" value={formData.secGuardianEmail} onChange={(val: string) => setFormData({...formData, secGuardianEmail: val})} />
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: COURSES */}
            {currentStep === 3 && (
              <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
                <div>
                  <h3 className="text-erp-lg font-bold text-gray-800 border-b border-erp-border pb-2 mb-4 uppercase tracking-wide">Course Configuration</h3>
                  <table>
                    <thead>
                      <tr>
                        <th className="w-[150px]">Academic Year</th>
                        <th>Subject / Course Master</th>
                        <th className="w-[80px] text-center">Qty</th>
                        <th className="w-[140px] text-right">Base Fee (₹)</th>
                        <th className="w-[40px]"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><select className="w-full border border-erp-border px-2 py-1"><option>2026-2027</option></select></td>
                        <td>
                          <select 
                            value={formData.courseId}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSaveError(null); handleCourseSelect(e.target.value); }}
                            className="w-full bg-pastel-yellowBg border border-erp-border font-bold cursor-pointer text-cw-blueDark px-2 py-1"
                            disabled={isFetchingMasterData}
                          >
                            <option value="">-- Assign Master Course --</option>
                            {isFetchingMasterData ? (
                              <option disabled>Fetching courses from database...</option>
                            ) : masterCourses.length === 0 ? (
                              <option disabled>No courses found. Create one in Course Master.</option>
                            ) : (
                              masterCourses.map((course: any) => (
                                <option key={course.id} value={course.id}>{course.name} (Base Fee: ₹{course.fee})</option>
                              ))
                            )}
                          </select>
                        </td>
                        <td className="text-center"><input type="number" value="1" readOnly className="w-12 text-center bg-erp-header border border-erp-border py-1" /></td>
                        <td><input type="text" value={formData.baseFee.toLocaleString()} className="w-full text-right bg-erp-header font-bold text-gray-800 border border-erp-border px-2 py-1" readOnly /></td>
                        <td className="text-center" title="Master course cannot be removed"><Trash2 className="w-4 h-4 text-cw-red cursor-not-allowed opacity-50 mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <div className="flex justify-end mt-8">
                    <div className="w-[320px] bg-white p-4 border border-erp-border rounded-erp shadow-sm">
                      <h4 className="text-erp-md font-bold text-cw-blue uppercase flex items-center gap-1.5 mb-3 border-b border-erp-borderLight pb-2">
                        <Calculator className="w-4 h-4" /> Invoice Calculation
                      </h4>
                      <div className="flex justify-between items-center text-erp-base mb-2">
                        <span className="font-bold text-gray-600">Gross Master Fee</span>
                        <span className="font-bold text-gray-900">₹{formData.baseFee.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-erp-base mb-3">
                        <span className="font-bold text-gray-600">Concession / Discount (₹)</span>
                        <input 
                          type="number" 
                          min="0"
                          value={formData.discount || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFormData({...formData, discount: Number(e.target.value) || 0});
                            setInstallments([]); setShowInstallments(false); setSplitCount(0);
                          }}
                          className="w-[100px] text-right font-bold text-cw-red bg-pastel-redBg border border-pastel-redBorder px-2 py-1 outline-none focus:ring-1 focus:ring-cw-red" 
                        />
                      </div>
                      <div className="flex justify-between items-center text-lg pt-3 border-t border-erp-border">
                        <span className="font-bold text-gray-900">Net Invoice Total</span>
                        <span className="font-bold text-cw-blue">₹{netTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: POS & SMART LEDGER */}
            {currentStep === 4 && (
              <div className="flex gap-8 animate-in fade-in duration-200">
                <div className="flex-1 space-y-6">
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-pastel-blueBg border border-pastel-blueBorder p-4 rounded-erp shadow-sm">
                      <p className="text-erp-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Net Total Due (₹)</p>
                      <p className="text-3xl font-normal text-cw-blue">{netTotal.toLocaleString()}</p>
                    </div>
                    <div className="bg-pastel-greenBg border border-pastel-greenBorder p-4 rounded-erp shadow-sm">
                      <p className="text-erp-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Paying Now (₹)</p>
                      <p className="text-3xl font-normal text-cw-green">{formData.amountPaid.toLocaleString()}</p>
                    </div>
                    <div className="bg-pastel-redBg border border-pastel-redBorder p-4 rounded-erp shadow-sm">
                      <p className="text-erp-sm font-bold text-gray-600 mb-1 uppercase tracking-wide">Balance Remaining (₹)</p>
                      <p className="text-3xl font-bold text-cw-red">{balanceDue.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border border-erp-border bg-white rounded-erp shadow-sm overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b border-erp-border bg-erp-header">
                      <h3 className="text-erp-lg text-gray-900 font-bold tracking-wide">Initial Collection POS</h3>
                      {balanceDue > 0 && (
                        <button 
                          onClick={generateInstallments}
                          className={`border px-3 py-1.5 text-erp-sm font-bold rounded-erp shadow-sm transition-colors flex items-center gap-1 ${showInstallments ? 'bg-cw-blue text-white border-cw-blueDark cursor-default' : 'bg-white text-cw-blue border-cw-blue hover:bg-gray-50'}`}
                        >
                          <CalendarClock className="w-4 h-4" /> {showInstallments ? "Installments Active" : "Reconfigure Installments"}
                        </button>
                      )}
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-erp-borderLight">
                      <div>
                        <label className="block text-erp-base font-bold text-gray-700 mb-2">Amount Collected Today (₹)</label>
                        <input 
                          type="number" 
                          min="0"
                          max={netTotal}
                          value={formData.amountPaid || ""}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setFormData({...formData, amountPaid: Number(e.target.value) || 0});
                            setInstallments([]); setShowInstallments(false); setSplitCount(0);
                          }}
                          className="w-full text-2xl font-bold text-cw-green border-2 border-cw-green focus:border-cw-blue bg-pastel-greenBg p-3 h-auto outline-none transition-colors rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-erp-base font-bold text-gray-700 mb-2">Transaction Mode</label>
                        <select 
                          value={formData.paymentMode}
                          onChange={(e: ChangeEvent<HTMLSelectElement>) => setFormData({...formData, paymentMode: e.target.value})}
                          className="w-full text-lg font-bold p-3 h-auto cursor-pointer border border-erp-border bg-white shadow-sm outline-none focus:border-cw-blue rounded-sm"
                        >
                          <option value="Cash">Cash at Counter</option>
                          <option value="UPI">UPI Transfer / Scan</option>
                          <option value="Card">Credit/Debit Card (POS)</option>
                          <option value="Bank">Bank Cheque / NEFT</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-erp-base font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                          <SplitSquareHorizontal className="w-4 h-4 text-cw-blue" /> Auto-Split Balance
                        </label>
                        <div className="flex bg-white border border-erp-border rounded-sm overflow-hidden shadow-sm h-[52px]">
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => { setSplitCount(num); setShowInstallments(true); setSaveError(null); }}
                              disabled={balanceDue <= 0}
                              className={`flex-1 text-sm font-black transition-colors border-r border-erp-borderLight last:border-0 ${
                                splitCount === num 
                                  ? "bg-cw-blue text-white" 
                                  : "text-gray-500 hover:bg-pastel-blueBg disabled:opacity-50 disabled:hover:bg-white"
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {showInstallments && balanceDue > 0 && (
                      <div className="p-6 bg-pastel-blueBg animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex justify-between items-end mb-4 border-b border-pastel-blueBorder pb-2">
                          <h4 className="text-erp-md font-bold text-cw-blueDark uppercase tracking-wide">Future Installment Ledger</h4>
                          <button 
                            type="button"
                            onClick={() => {setInstallments([]); setShowInstallments(false); setSplitCount(0); setSaveError(null);}}
                            className="text-erp-sm font-bold text-cw-red hover:underline"
                          >
                            Cancel Installments
                          </button>
                        </div>
                        
                        <table className="w-full mb-4">
                          <thead>
                            <tr className="text-left text-gray-600 text-erp-sm border-b border-pastel-blueBorder">
                              <th className="pb-2 pl-2 w-1/4">Installment No.</th>
                              <th className="pb-2 w-1/3">Due Date</th>
                              <th className="pb-2 text-right w-1/3">Amount Due (₹)</th>
                              <th className="pb-2 w-[40px]"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {installments.map((inst: any, index: number) => (
                              <tr key={inst.id} className="border-b border-pastel-blueBorder/50">
                                <td className="py-2 pl-2 font-bold text-gray-700">Inst. {index + 1}</td>
                                <td className="py-2">
                                  <input 
                                    type="date" 
                                    value={inst.date}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => updateInstallment(inst.id, "date", e.target.value)}
                                    className="w-full border border-erp-border px-2 py-1.5 text-erp-base outline-none focus:border-cw-blue bg-white rounded-sm shadow-inner"
                                  />
                                </td>
                                <td className="py-2 text-right">
                                  <input 
                                    type="number" 
                                    value={inst.amount || ""}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                      setSaveError(null);
                                      updateInstallment(inst.id, "amount", Number(e.target.value));
                                    }}
                                    className="w-full border border-erp-border px-2 py-1.5 text-erp-base font-black text-cw-blueDark text-right outline-none focus:border-cw-blue bg-white rounded-sm shadow-inner"
                                  />
                                </td>
                                <td className="py-2 text-center">
                                  <Trash2 onClick={() => removeInstallment(inst.id)} className="w-4 h-4 text-cw-red cursor-pointer hover:text-red-700 mx-auto" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        <div className="flex justify-between items-center mt-2">
                          <button 
                            type="button"
                            onClick={addInstallment}
                            className="text-erp-sm font-bold text-cw-blue hover:text-cw-blueDark flex items-center gap-1 bg-white border border-cw-blue px-4 py-1.5 rounded-erp shadow-sm transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Custom Split
                          </button>
                          
                          <div className="text-erp-sm font-bold text-gray-700 flex items-center">
                            Ledger Math Check: 
                            <span className={`ml-2 px-3 py-1.5 rounded-sm shadow-sm font-black ${currentInstallmentSum === balanceDue ? 'bg-pastel-greenBg text-cw-green border border-cw-green/30' : 'bg-pastel-redBg text-cw-red border border-cw-red/30 animate-pulse'}`}>
                              ₹{currentInstallmentSum} / ₹{balanceDue}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: BATCH ASSIGNMENT & MAKE.COM AUTOMATION */}
            {currentStep === 5 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border border-erp-border bg-white rounded-erp shadow-sm overflow-hidden p-6">
                  <h3 className="text-erp-lg font-bold text-gray-800 mb-5 uppercase tracking-wide border-b border-erp-borderLight pb-2 flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-cw-blue" /> Finalize Batch Assignment
                  </h3>
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <div className="w-full md:w-1/2">
                      <label className="text-erp-base font-bold text-gray-700 block mb-2">
                        Select Active Batch / Batch Assign Karein <span className="text-cw-red">*</span>
                      </label>
                      <select 
                        value={formData.batch}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => { setSaveError(null); setFormData({...formData, batch: e.target.value}); }}
                        className="w-full font-bold text-cw-blueDark cursor-pointer border border-erp-border p-3 outline-none focus:border-cw-blue shadow-inner bg-gray-50"
                        disabled={isFetchingMasterData}
                      >
                        <option value="">-- Please select a batch --</option>
                        {isFetchingMasterData ? (
                          <option disabled>Fetching live batches from database...</option>
                        ) : masterBatches.length === 0 ? (
                          <option disabled>No active batches found in Master.</option>
                        ) : (
                          masterBatches.map((batch: any) => (
                            <option key={batch.id} value={batch.name}>{batch.name} ({batch.academic_year})</option>
                          ))
                        )}
                      </select>
                    </div>
                    <div className={`w-full md:w-1/2 border p-5 flex flex-col items-center justify-center text-center rounded-erp shadow-inner transition-colors ${formData.batch ? 'bg-pastel-greenBg border-pastel-greenBorder text-cw-green' : 'bg-erp-header border-erp-border text-gray-500'}`}>
                      {formData.batch ? (
                        <p className="text-erp-md font-bold flex flex-col items-center gap-2"><CheckSquare className="w-8 h-8"/> Student successfully queued for:<br/><span className="text-xl text-cw-green">{formData.batch}</span></p>
                      ) : (
                        <p className="text-erp-md font-medium text-cw-red">Action Required: Student cannot be saved without an active batch assignment.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border border-erp-border bg-white rounded-erp shadow-sm overflow-hidden p-6 relative">
                  <div className="absolute top-0 right-0 bg-pastel-yellowBg text-amber-600 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-lg border-b border-l border-amber-200">
                    Make.com Integration
                  </div>
                  <h3 className="text-erp-lg font-bold text-gray-800 mb-5 uppercase tracking-wide border-b border-erp-borderLight pb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-500" /> Automated Communications
                  </h3>
                  <div className="space-y-4">
                    <label className={`flex items-start gap-3 cursor-pointer p-4 border rounded-erp transition-colors ${formData.sendWelcomeEmail ? 'bg-pastel-blueBg border-pastel-blueBorder' : 'border-erp-border hover:bg-gray-50'}`}>
                      <input 
                        type="checkbox" 
                        checked={formData.sendWelcomeEmail} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, sendWelcomeEmail: e.target.checked})} 
                        className="mt-1 w-4 h-4 text-cw-blue border-gray-300 rounded focus:ring-cw-blue cursor-pointer" 
                      />
                      <div>
                        <p className="text-erp-md font-bold text-gray-800 flex items-center gap-1.5"><Mail className="w-4 h-4 text-cw-blue"/> Send Admission Welcome Email</p>
                        {formData.email ? (
                          <p className="text-erp-sm font-medium text-gray-600 mt-1">Triggers Make.com to send a welcome email, fee receipt, and portal credentials to <span className="font-bold text-cw-blue">{formData.email}</span></p>
                        ) : (
                          <p className="text-erp-sm font-bold text-cw-red mt-1 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> No email address provided in Step 1. Automation cannot send the email.</p>
                        )}
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 cursor-pointer p-4 border rounded-erp transition-colors ${!showInstallments ? 'opacity-50 grayscale cursor-not-allowed bg-gray-50 border-erp-border' : formData.setupInstallmentReminders ? 'bg-pastel-greenBg border-pastel-greenBorder' : 'border-erp-border hover:bg-gray-50'}`}>
                      <input 
                        type="checkbox" 
                        checked={formData.setupInstallmentReminders} 
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({...formData, setupInstallmentReminders: e.target.checked})} 
                        disabled={!showInstallments}
                        className="mt-1 w-4 h-4 text-cw-green border-gray-300 rounded focus:ring-cw-green cursor-pointer disabled:cursor-not-allowed" 
                      />
                      <div>
                        <p className="text-erp-md font-bold text-gray-800 flex items-center gap-1.5"><BellRing className="w-4 h-4 text-cw-green"/> Schedule Automated Fee Reminders</p>
                        {showInstallments && installments.length > 0 ? (
                          <p className="text-erp-sm font-medium text-gray-600 mt-1">Make.com will log these due dates and remind the student before <span className="font-bold text-cw-green">{installments[0]?.date}</span>.</p>
                        ) : (
                          <p className="text-erp-sm font-medium text-gray-500 mt-1">You have not configured any future installments in Step 4.</p>
                        )}
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-erp-header border-t border-erp-border p-4 flex justify-between items-center rounded-b-erp">
            <div>
              {currentStep > 1 && (
                <button type="button" onClick={handlePrev} className="bg-white border border-erp-border text-gray-700 px-5 py-2 text-erp-md font-bold hover:bg-gray-100 shadow-sm flex items-center gap-1.5 rounded-erp transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Previous Step
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {currentStep < 5 ? (
                <button type="button" onClick={handleNext} className="bg-white border border-erp-border text-gray-900 px-8 py-2 text-erp-md font-bold hover:bg-gray-100 shadow-sm flex items-center gap-1.5 rounded-erp transition-colors">
                  Proceed <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={handleFinish} disabled={isSaving} className="bg-cw-green border border-[#006600] text-white px-10 py-2 text-erp-md font-bold hover:bg-[#005000] shadow-erp-button flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-erp">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {isSaving ? "Triggering Automations..." : isEditMode ? "Update & Save" : "Finalize Admission"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// ----------------------------------------------------
// STRICTLY TYPED REUSABLE FIELD COMPONENT
// ----------------------------------------------------
interface FieldProps {
  label: string;
  required?: boolean;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (val: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  isSelect?: boolean;
  options?: string[];
}

function Field({ 
  label, required = false, value, defaultValue, onChange, placeholder = "", type = "text", disabled = false, isSelect = false, options = [] 
}: FieldProps) {
  const isControlled = value !== undefined;
  const valueProps = isControlled ? { value } : { defaultValue };

  return (
    <div className="flex items-start mb-3">
      <label className="w-[160px] shrink-0 text-right pr-3 text-erp-base text-gray-800 pt-1 font-bold leading-tight">
        {required && <span className="text-cw-red">*</span>} {label} :
      </label>
      <div className="flex-1 max-w-sm">
        {isSelect ? (
          <select 
            disabled={disabled} 
            {...valueProps} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange && onChange(e.target.value)} 
            className="w-full cursor-pointer font-medium text-gray-900 border border-erp-border px-2 py-1 focus:border-cw-blue outline-none shadow-inner bg-white"
          >
            {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type={type} 
            {...valueProps} 
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange && onChange(e.target.value)} 
            placeholder={placeholder} 
            disabled={disabled} 
            className="w-full font-medium text-gray-900 border border-erp-border px-2 py-1 focus:border-cw-blue outline-none shadow-inner" 
          />
        )}
      </div>
    </div>
  );
}