"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// ==========================================
// 1. FETCH ALL STUDENTS (For the Directory Table)
// ==========================================
export async function getStudents() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get the owner's active branch
  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  // Fetch students AND join their enrolled subjects
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
// 2. FETCH ACTIVE SUBJECTS (For the Admission Form Checkboxes)
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

  // Fetch all active subjects to display in the Add Student sheet
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
// 3. CREATE NEW STUDENT (With Duplicate Error Handling)
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
  const full_name = formData.get("full_name") as string;
  const parent_phone = formData.get("parent_phone") as string;
  const whatsapp_number = formData.get("whatsapp_number") as string;
  const subject_ids = formData.getAll("subject_ids") as string[];

  // Attempt to insert the student
  const { data: newStudent, error: studentError } = await supabase
    .from("students")
    .insert([{
      branch_id: membership.branch_id,
      roll_number,
      full_name,
      parent_phone,
      whatsapp_number,
      status: "active"
    }])
    .select()
    .single();

  // Intercept duplicate roll number constraints
  if (studentError) {
    if (studentError.code === '23505' || studentError.message.includes('students_branch_id_roll_number_key')) {
      throw new Error(`Registration Failed: Roll Number "${roll_number}" is already assigned to another student.`);
    }
    throw new Error("An error occurred while saving the student record.");
  }

  // Assign selected subjects (if any)
  if (subject_ids.length > 0 && newStudent) {
    const enrollments = subject_ids.map(sub_id => ({
      branch_id: membership.branch_id,
      student_id: newStudent.id,
      subject_id: sub_id
    }));

    const { error: enrollError } = await supabase.from("student_subjects").insert(enrollments);
    if (enrollError) throw new Error("Student created, but failed to assign subjects.");
  }

  revalidatePath("/dashboard/students");
  return { success: true };
}