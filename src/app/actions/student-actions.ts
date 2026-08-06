"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// ==========================================
// 1. FETCH ALL STUDENTS
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
// 2. FETCH ACTIVE SUBJECTS
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
// 3. CREATE NEW STUDENT
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
    
    // Demographics
    date_of_birth: formData.get("dob") as string || null,
    gender: formData.get("gender") as string,
    category: formData.get("category") as string,
    government_id: formData.get("government_id") as string,
    
    // Academics & Batch
    batch_id: formData.get("batch_id") as string,
    course_id: formData.get("course_name") as string, 
    
    // Guardians
    guardian_name: formData.get("guardian_name") as string,
    guardian_relation: formData.get("guardian_relation") as string,
    guardian_email: formData.get("guardian_email") as string,
    sec_guardian_name: formData.get("sec_guardian_name") as string,
    sec_guardian_relation: formData.get("sec_guardian_relation") as string,
    sec_guardian_phone: formData.get("sec_guardian_phone") as string,
    sec_guardian_email: formData.get("sec_guardian_email") as string,
    
    // Financials
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

  revalidatePath("/dashboard/students");
  return { success: true };
}

// ==========================================
// 4. UPDATE EXISTING STUDENT
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
    
    // Demographics
    date_of_birth: formData.get("dob") as string || null,
    gender: formData.get("gender") as string,
    category: formData.get("category") as string,
    government_id: formData.get("government_id") as string,
    
    // Academics & Batch
    batch_id: formData.get("batch_id") as string,
    course_id: formData.get("course_name") as string, 
    
    // Guardians
    guardian_name: formData.get("guardian_name") as string,
    guardian_relation: formData.get("guardian_relation") as string,
    guardian_email: formData.get("guardian_email") as string,
    sec_guardian_name: formData.get("sec_guardian_name") as string,
    sec_guardian_relation: formData.get("sec_guardian_relation") as string,
    sec_guardian_phone: formData.get("sec_guardian_phone") as string,
    sec_guardian_email: formData.get("sec_guardian_email") as string,
    
    // Financials
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

  // Update enrolled subjects
  const subject_ids = formData.getAll("subject_ids") as string[];
  if (subject_ids.length > 0) {
    // Delete existing links first
    await supabase.from("student_subjects").delete().eq("student_id", studentId);
    
    // Re-insert selected subjects
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
// 5. FETCH SINGLE STUDENT BY ID
// ==========================================
export async function getStudentById(studentId: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("students")
      .select(`
        *,
        student_subjects (
          subjects ( id, name )
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