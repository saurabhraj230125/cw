"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// 1. FETCH ACTUAL ACTIVE BATCHES FROM ENROLLED STUDENTS
export async function getActiveBatches() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  // Fetch unique batch IDs from active students
  const { data, error } = await supabase
    .from("students")
    .select("batch_id")
    .eq("branch_id", membership.branch_id)
    .eq("status", "active")
    .not("batch_id", "is", null);

  if (error || !data) return [];

  // Deduplicate the batch list
  const uniqueBatches = Array.from(new Set(data.map(s => s.batch_id)));
  return uniqueBatches;
}

// 2. FETCH ROSTER AND PRE-EXISTING ATTENDANCE FOR A SPECIFIC DATE
export async function getAttendanceRoster(batchId: string, date: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user?.id).single();
  if (!membership) return [];

  // Fetch all students in this batch, and LEFT JOIN their attendance for the specific date
  const { data: students, error } = await supabase
    .from("students")
    .select(`
      id,
      roll_number,
      full_name,
      attendance (
        status
      )
    `)
    .eq("branch_id", membership.branch_id)
    .eq("batch_id", batchId)
    .eq("status", "active")
    .eq("attendance.date", date) // Only join attendance for the selected date
    .order("roll_number", { ascending: true });

  if (error) {
    console.error("Error fetching roster:", error.message);
    return [];
  }

  // Map the data into a clean frontend format
  return students.map((stu: any) => ({
    id: stu.id,
    roll: stu.roll_number || "N/A",
    name: stu.full_name,
    // Extract the status if it exists for this date, otherwise null
    status: stu.attendance && stu.attendance.length > 0 ? stu.attendance[0].status : null
  }));
}

// 3. SAVE / UPSERT ATTENDANCE REGISTER
export async function saveAttendanceAction(batchId: string, date: string, attendanceData: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user?.id).single();
  if (!membership) throw new Error("Unauthorized");

  // Format the dictionary state into an array of database rows
  const upsertPayload = Object.entries(attendanceData).map(([studentId, status]) => ({
    branch_id: membership.branch_id,
    batch_id: batchId,
    student_id: studentId,
    date: date,
    status: status
  }));

  if (upsertPayload.length === 0) return { success: true };

  // UPSERT: Insert if new, Update if already exists (based on the UNIQUE constraint)
  const { error } = await supabase
    .from("attendance")
    .upsert(upsertPayload, { onConflict: "student_id, date" });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/attendance");
  return { success: true };
}