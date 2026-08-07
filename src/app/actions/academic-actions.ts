"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// ==========================================
// 1. FETCH ACADEMIC DATA FOR THIS SPECIFIC BRANCH
// ==========================================
export async function getBranchAcademics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { materials: [], tests: [] };

  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user.id).single();
  if (!membership) return { materials: [], tests: [] };

  const [materialsRes, testsRes] = await Promise.all([
    supabase.from("study_materials").select("*").eq("branch_id", membership.branch_id).order("created_at", { ascending: false }),
    supabase.from("batch_tests").select("*").eq("branch_id", membership.branch_id).order("test_date", { ascending: true })
  ]);

  return {
    materials: materialsRes.data || [],
    tests: testsRes.data || []
  };
}

// ==========================================
// 2. REAL FILE UPLOAD: STUDY MATERIAL (DPP/PDF)
// ==========================================
export async function uploadStudyMaterialAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id, institute_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const batchName = formData.get("batch_name") as string;
  const title = formData.get("title") as string;
  const docType = formData.get("document_type") as string;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) throw new Error("A valid file is required.");

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${membership.branch_id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("academic-vault")
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) throw new Error(`File upload failed: ${uploadError.message}`);

    const { data: urlData } = supabase.storage.from("academic-vault").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    const insertPayload: any = {
      branch_id: membership.branch_id,
      batch_name: batchName,
      title: title,
      document_type: docType,
      file_url: publicUrl
    };

    if (membership.institute_id) insertPayload.institute_id = membership.institute_id;

    const { error: dbError } = await supabase.from("study_materials").insert([insertPayload]);
    if (dbError) throw new Error(dbError.message);

    revalidatePath("/dashboard/material");
    return { success: true };
  } catch (error: any) {
    throw new Error(error.message || "Failed to process the upload.");
  }
}

// ==========================================
// 3. SCHEDULE A NEW TEST
// ==========================================
export async function scheduleTestAction(batchName: string, title: string, date: string, marks: number, syllabus: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase.from("core_memberships").select("branch_id, institute_id").eq("user_id", user?.id).single();
  if (!membership) throw new Error("Unauthorized access.");

  const insertPayload: any = {
    branch_id: membership.branch_id,
    batch_name: batchName,
    title: title,
    test_date: date,
    total_marks: marks,
    syllabus: syllabus
  };

  if (membership.institute_id) insertPayload.institute_id = membership.institute_id;

  const { error } = await supabase.from("batch_tests").insert([insertPayload]);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/test");
  return { success: true };
}

// ==========================================
// 4. DELETE STUDY MATERIAL
// ==========================================
export async function deleteStudyMaterialAction(materialId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication required.");

  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user.id).single();
  if (!membership) throw new Error("Unauthorized access.");

  const { error } = await supabase.from("study_materials").delete().eq("id", materialId).eq("branch_id", membership.branch_id);
  if (error) throw new Error(error.message);
  
  revalidatePath("/dashboard/material");
  return { success: true };
}

// ==========================================
// 5. TOGGLE EXAM LIVE STATUS
// ==========================================
export async function toggleTestLiveAction(testId: string, isLive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("batch_tests").update({ is_live: isLive }).eq("id", testId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/test");
  return { success: true };
}

// ==========================================
// 6. ADD QUESTION TO EXAM (CBT ENGINE)
// ==========================================
export async function addTestQuestionAction(testId: string, qText: string, optA: string, optB: string, optC: string, optD: string, correct: string, pos: number, neg: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase.from("core_memberships").select("branch_id, institute_id").eq("user_id", user?.id).single();
  if (!membership) throw new Error("Unauthorized");

  const { error } = await supabase.from("test_questions").insert([{
    test_id: testId, institute_id: membership.institute_id, branch_id: membership.branch_id,
    question_text: qText, option_a: optA, option_b: optB, option_c: optC, option_d: optD,
    correct_option: correct, marks_positive: pos, marks_negative: neg
  }]);

  if (error) throw new Error(error.message);
  return { success: true };
}

// ==========================================
// 7. GET EXAM QUESTIONS
// ==========================================
export async function getExamQuestions(testId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("test_questions").select("*").eq("test_id", testId).order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data || [];
}

// ==========================================
// 8. FETCH STUDENT ATTEMPTS (OWNER ANALYTICS)
// ==========================================
export async function getExamAttempts(testId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("student_test_attempts")
    .select(`*, students ( full_name, roll_number )`)
    .eq("test_id", testId)
    .order("score", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ==========================================
// 9. PUBLISH RESULTS TO STUDENTS
// ==========================================
export async function toggleResultsPublishAction(testId: string, status: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("batch_tests").update({ results_published: status }).eq("id", testId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/test");
  return { success: true };
}