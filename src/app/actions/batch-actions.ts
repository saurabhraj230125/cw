"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// 1. FETCH ALL BATCHES
export async function getBatches() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  const { data, error } = await supabase
    .from("batches")
    .select("*")
    .eq("branch_id", membership.branch_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. CREATE NEW BATCH (Deeply fixed for Missing Institute IDs)
export async function createBatchAction(name: string, academicYear: string, courseName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  // DEEP FIX: Fetch BOTH branch_id and institute_id from membership
  const { data: membership, error: membershipError } = await supabase
    .from("core_memberships")
    .select("branch_id, institute_id")
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) {
    throw new Error("Unauthorized access. Could not find branch membership.");
  }

  // Build a dynamic payload that handles the strict database constraints
  const insertPayload: any = {
    branch_id: membership.branch_id,
    name: name,
    academic_year: academicYear,
    course_name: courseName || null,
    status: "active"
  };

  // Defensive check: Only attach institute_id if the user actually has one attached to their profile
  if (membership.institute_id) {
    insertPayload.institute_id = membership.institute_id;
  }

  // Insert into database
  const { error } = await supabase.from("batches").insert([insertPayload]);

  if (error) {
    console.error("Database Insert Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/batches");
  return { success: true };
}

// 3. DELETE BATCH
export async function deleteBatchAction(batchId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const { error } = await supabase
    .from("batches")
    .delete()
    .eq("id", batchId)
    .eq("branch_id", membership.branch_id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/batches");
  return { success: true };
}
// ==========================================
// 4. BULK ASSIGN STUDENTS TO BATCH
// ==========================================
export async function assignStudentsToBatchAction(batchName: string, studentIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  // If the user unchecks everyone, we don't want to crash. 
  // We first clear this batch from anyone who currently has it.
  await supabase
    .from("students")
    .update({ batch_id: null })
    .eq("batch_id", batchName)
    .eq("branch_id", membership.branch_id);

  // Then, if they selected students, we bulk-assign them to this batch!
  if (studentIds.length > 0) {
    const { error } = await supabase
      .from("students")
      .update({ batch_id: batchName })
      .in("id", studentIds) // The magic ".in" command updates an entire array of IDs at once
      .eq("branch_id", membership.branch_id);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard/batches");
  revalidatePath("/dashboard/students");
  return { success: true };
}