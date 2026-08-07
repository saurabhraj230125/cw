"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// ==========================================
// 1. FETCH ALL STUDENTS (Directory View)
// ==========================================
export async function getStudents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  const { data, error } = await supabase
    .from("students")
    .select(`
      *,
      student_subjects (
        subjects (
          id,
          name
        )
      )
    `)
    .eq("branch_id", membership.branch_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching students:", error.message);
    return [];
  }

  return data || [];
}

// ==========================================
// 2. FETCH ALL UNIQUE BATCHES
// ==========================================
export async function getAllBatches() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  const { data, error } = await supabase
    .from("students")
    .select("batch_id")
    .eq("branch_id", membership.branch_id)
    .not("batch_id", "is", null);

  if (error || !data) return [];

  // Extract unique batch names dynamically
  const uniqueBatches = Array.from(new Set(data.map(s => s.batch_id).filter(Boolean)));
  return uniqueBatches;
}

// ==========================================
// 3. FETCH ACTIVE SUBJECTS (For Master Wizard)
// ==========================================
export async function getBranchSubjects() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .eq("branch_id", membership.branch_id)
    .eq("status", "active")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching subjects:", error.message);
    return [];
  }

  return data || [];
}

// ==========================================
// 4. CREATE NEW STUDENT (From 5-Step Wizard)
// ==========================================
export async function addStudentAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const roll_number = formData.get("roll_number") as string;
  
  const insertData = {
    branch_id: membership.branch_id,
    roll_number: roll_number,
    full_name: formData.get("full_name") as string,
    parent_phone: formData.get("parent_phone") as string,
    whatsapp_number: formData.get("whatsapp_number") as string,
    email: formData.get("email") as string,
    status: "active",
    
    date_of_birth: formData.get("dob") as string || null,
    gender: formData.get("gender") as string,
    category: formData.get("category") as string,
    government_id: formData.get("government_id") as string,
    
    batch_id: formData.get("batch_id") as string,
    course_id: formData.get("course_name") as string, 
    
    guardian_name: formData.get("guardian_name") as string,
    guardian_relation: formData.get("guardian_relation") as string,
    guardian_email: formData.get("guardian_email") as string,
    sec_guardian_name: formData.get("sec_guardian_name") as string,
    sec_guardian_relation: formData.get("sec_guardian_relation") as string,
    sec_guardian_phone: formData.get("sec_guardian_phone") as string,
    sec_guardian_email: formData.get("sec_guardian_email") as string,
    
    gross_fee: parseInt(formData.get("gross_fee") as string) || 0,
    discount_amount: parseInt(formData.get("discount_amount") as string) || 0,
    amount_paid: parseInt(formData.get("amount_paid") as string) || 0,
    payment_mode: formData.get("payment_mode") as string,
  };

  const { data: newStudent, error: studentError } = await supabase
    .from("students")
    .insert([insertData])
    .select()
    .single();

  if (studentError) {
    if (studentError.code === '23505' || studentError.message.includes('students_branch_id_roll_number_key')) {
      throw new Error(`Registration Failed: Roll Number "${roll_number}" is already assigned to another student.`);
    }
    throw new Error(studentError.message || "An error occurred while saving the student record.");
  }

  const subject_ids = formData.getAll("subject_ids") as string[];
  if (subject_ids.length > 0 && newStudent) {
    const enrollments = subject_ids.map(sub_id => ({
      branch_id: membership.branch_id,
      student_id: newStudent.id,
      subject_id: sub_id
    }));
    await supabase.from("student_subjects").insert(enrollments);
  }

  // If there's an initial payment during admission, record it in the ledger!
  if (insertData.amount_paid > 0 && newStudent) {
    await supabase.from("fee_collections").insert([{
      student_id: newStudent.id,
      amount: insertData.amount_paid,
      payment_mode: insertData.payment_mode,
      particulars: "Initial Admission Fee"
    }]);
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

// ==========================================
// 5. UPDATE EXISTING STUDENT
// ==========================================
export async function updateStudentAction(studentId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const roll_number = formData.get("roll_number") as string;
  
  const updateData = {
    roll_number: roll_number,
    full_name: formData.get("full_name") as string,
    parent_phone: formData.get("parent_phone") as string,
    whatsapp_number: formData.get("whatsapp_number") as string,
    email: formData.get("email") as string,
    
    date_of_birth: formData.get("dob") as string || null,
    gender: formData.get("gender") as string,
    category: formData.get("category") as string,
    government_id: formData.get("government_id") as string,
    
    batch_id: formData.get("batch_id") as string,
    course_id: formData.get("course_name") as string, 
    
    guardian_name: formData.get("guardian_name") as string,
    guardian_relation: formData.get("guardian_relation") as string,
    guardian_email: formData.get("guardian_email") as string,
    sec_guardian_name: formData.get("sec_guardian_name") as string,
    sec_guardian_relation: formData.get("sec_guardian_relation") as string,
    sec_guardian_phone: formData.get("sec_guardian_phone") as string,
    sec_guardian_email: formData.get("sec_guardian_email") as string,
    
    gross_fee: parseInt(formData.get("gross_fee") as string) || 0,
    discount_amount: parseInt(formData.get("discount_amount") as string) || 0,
    amount_paid: parseInt(formData.get("amount_paid") as string) || 0,
    payment_mode: formData.get("payment_mode") as string,
  };

  const { error: updateError } = await supabase
    .from("students")
    .update(updateData)
    .eq("id", studentId)
    .eq("branch_id", membership.branch_id);

  if (updateError) {
    throw new Error(updateError.message || "Failed to update student record.");
  }

  // Update enrolled subjects securely
  const subject_ids = formData.getAll("subject_ids") as string[];
  if (subject_ids.length > 0) {
    await supabase.from("student_subjects").delete().eq("student_id", studentId);
    
    const enrollments = subject_ids.map(sub_id => ({
      branch_id: membership.branch_id,
      student_id: studentId,
      subject_id: sub_id
    }));
    await supabase.from("student_subjects").insert(enrollments);
  }

  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${studentId}`);
  return { success: true };
}

// ==========================================
// 6. FETCH SINGLE STUDENT BY ID (Deeply Updated for POS)
// ==========================================
export async function getStudentById(studentId: string) {
  try {
    const supabase = await createClient();
    
    // DEEP FIX: Added fee_collections to the select query to build the Transaction History
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        student_subjects (
          subjects ( id, name )
        ),
        attendance (
          status,
          date
        ),
        fee_collections (
          id,
          amount,
          payment_mode,
          particulars,
          collection_date
        )
      `)
      .eq("id", studentId)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching student profile:", error.message);
    return { success: false, message: error.message };
  }
}

// ==========================================
// 7. TOGGLE STUDENT STATUS (Active/Inactive)
// ==========================================
export async function toggleStudentStatusAction(studentId: string, currentStatus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const newStatus = currentStatus === "active" ? "inactive" : "active";

  const { error } = await supabase
    .from("students")
    .update({ status: newStatus })
    .eq("id", studentId)
    .eq("branch_id", membership.branch_id);

  if (error) {
    throw new Error(error.message || "Failed to update student status.");
  }

  revalidatePath("/dashboard/students");
  revalidatePath(`/dashboard/students/${studentId}`);
  return { success: true, newStatus };
}

// ==========================================
// 8. PERMANENT HARD DELETE (With Cascading)
// ==========================================
export async function deleteStudentAction(studentId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  // CRITICAL: Prevent Foreign Key Crashes by wiping dependencies first
  await supabase.from("attendance").delete().eq("student_id", studentId);
  await supabase.from("student_subjects").delete().eq("student_id", studentId);
  await supabase.from("fee_collections").delete().eq("student_id", studentId); // Wipes payment history safely

  // Safely wipe the student record
  const { error } = await supabase
    .from("students")
    .delete()
    .eq("id", studentId)
    .eq("branch_id", membership.branch_id);

  if (error) {
    throw new Error(error.message || "Failed to permanently delete student.");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}

// ==========================================
// 9. PROCESS FEE PAYMENT (NEW POS SYSTEM)
// ==========================================
export async function collectPaymentAction(studentId: string, amount: number, mode: string, particulars: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Unauthorized access.");

    // 1. Fetch current paid amount
    const { data: student, error: fetchError } = await supabase
      .from("students")
      .select("amount_paid")
      .eq("id", studentId)
      .single();
      
    if (fetchError) throw new Error("Could not fetch student balance.");

    const currentPaid = Number(student?.amount_paid || 0);
    const newTotalPaid = currentPaid + amount;

    // 2. Update Master Student Record
    const { error: updateError } = await supabase
      .from("students")
      .update({ amount_paid: newTotalPaid })
      .eq("id", studentId);
      
    if (updateError) throw new Error("Failed to update student master balance.");

    // 3. Write individual receipt to Ledger
    const { error: insertError } = await supabase.from("fee_collections").insert([{
      student_id: studentId,
      amount: amount,
      payment_mode: mode,
      particulars: particulars || "Fee Installment"
    }]);
    
    if (insertError) throw new Error("Failed to write receipt to ledger.");

    revalidatePath(`/dashboard/students/${studentId}`);
    revalidatePath(`/dashboard/fees`); // Refresh the master fee ledger too
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to process payment.");
  }
}