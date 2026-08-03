"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

export async function saveExamMarksAction(examId: string, marksData: { student_id: string, marks_obtained: number }[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user?.id).single();

  if (!membership) throw new Error("Unauthorized");

  // Format data for bulk upsert
  const upsertData = marksData.map(mark => ({
    branch_id: membership.branch_id,
    exam_id: examId,
    student_id: mark.student_id,
    marks_obtained: mark.marks_obtained,
  }));

  // Upsert allows us to insert new marks or update existing ones seamlessly
  const { error } = await supabase
    .from("exam_marks")
    .upsert(upsertData, { onConflict: 'exam_id, student_id' });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/exams");
  return { success: true };
}