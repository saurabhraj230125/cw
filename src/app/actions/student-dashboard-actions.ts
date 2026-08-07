"use server";

import { cookies } from "next/headers";
import { createClient } from "../../lib/supabase/server";

export async function getStudentDashboardData() {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("erp_student_session")?.value;

  if (!studentId) {
    throw new Error("UNAUTHORIZED");
  }

  const supabase = await createClient();

  // 1. Get the exact student's profile to find their batch_id
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("id, full_name, roll_number, batch_id, branch_id")
    .eq("id", studentId)
    .single();

  if (studentError || !student) {
    throw new Error("Student profile not found.");
  }

  // 2. Fetch ONLY the materials and tests that belong to their exact batch
  const [materialsRes, testsRes] = await Promise.all([
    supabase
      .from("study_materials")
      .select("*")
      .eq("batch_name", student.batch_id) // Locked to their batch
      .order("created_at", { ascending: false }),
    
    supabase
      .from("batch_tests")
      .select("*")
      .eq("batch_name", student.batch_id) // Locked to their batch
      .order("test_date", { ascending: true })
  ]);

  return {
    student,
    materials: materialsRes.data || [],
    tests: testsRes.data || []
  };
}