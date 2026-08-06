"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// 1. FETCH ALL COURSES
export async function getCourses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) return [];

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("branch_id", membership.branch_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error.message);
    return [];
  }

  return data || [];
}

// 2. CREATE NEW COURSE (Deeply Updated for institute_id)
export async function createCourseAction(name: string, fee: number, subjects: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // DEEP FIX: Fetch BOTH branch_id and institute_id from the membership table
  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id, institute_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  // DEEP FIX: Insert BOTH IDs so the database constraint is fully satisfied
  const { error } = await supabase.from("courses").insert([{
    institute_id: membership.institute_id,
    branch_id: membership.branch_id,
    name: name,
    fee: fee,
    subjects: subjects,
    status: "active"
  }]);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/courses");
  return { success: true };
}

// 3. DELETE COURSE
export async function deleteCourseAction(courseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user?.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId)
    .eq("branch_id", membership.branch_id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/courses");
  return { success: true };
}