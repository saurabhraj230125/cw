"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// ==========================================================
// 1. FETCH ACTUAL BATCHES (Rescue old data)
// ==========================================================
export async function getActiveBatches() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  // DEEP FIX: Removed the .eq("status", "active") filter so older students aren't hidden
  const { data, error } = await supabase
    .from("students")
    .select("batch_id")
    .eq("branch_id", membership.branch_id);

  if (error || !data) return [];

  // Clean up the list, removing nulls and empties
  const uniqueBatches = Array.from(new Set(data.map(s => s.batch_id).filter(b => b && b.trim() !== "")));
  return uniqueBatches;
}

// ==========================================================
// 2. FETCH ROSTER (The Ultimate Fail-Safe Query)
// ==========================================================
export async function getAttendanceRoster(batchId: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  // STEP A: Fetch the students
  let query = supabase
    .from("students")
    .select("id, roll_number, full_name, batch_id")
    .eq("branch_id", membership.branch_id)
    .order("roll_number", { ascending: true });

  // If a specific batch is selected (and it's not "ALL"), filter by it.
  if (batchId && batchId !== "ALL") {
    query = query.eq("batch_id", batchId);
  }

  const { data: students, error: studentError } = await query;

  if (studentError || !students) {
    console.error("Error fetching students:", studentError?.message);
    return [];
  }

  // STEP B: Fetch existing attendance marks strictly for today
  let attQuery = supabase
    .from("attendance")
    .select("student_id, status")
    .eq("branch_id", membership.branch_id)
    .eq("date", date);

  const { data: attendanceRecords } = await attQuery;

  // STEP C: Merge them. (Ensures "Unmarked" students appear perfectly)
  return students.map((stu: any) => {
    const record = attendanceRecords?.find(a => a.student_id === stu.id);
    return {
      id: stu.id,
      roll: stu.roll_number || "N/A",
      name: stu.full_name || "Unknown Record",
      status: record ? record.status : null,
      batch: stu.batch_id || "Unassigned"
    };
  });
}

// ==========================================================
// 3. SAVE / UPSERT ATTENDANCE REGISTER
// ==========================================================
export async function saveAttendanceAction(batchId: string, date: string, attendanceData: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized");

  const upsertPayload = Object.entries(attendanceData).map(([studentId, status]) => ({
    branch_id: membership.branch_id,
    batch_id: batchId === "ALL" ? "Mixed" : batchId, // Fallback if saving from the "ALL" view
    student_id: studentId,
    date: date,
    status: status
  }));

  if (upsertPayload.length === 0) return { success: true };

  const { error } = await supabase
    .from("attendance")
    .upsert(upsertPayload, { onConflict: "student_id, date" });

  if (error) {
    console.error("Upsert Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/attendance");
  return { success: true };
}