"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// 1. Fetch all study materials joined with subjects
export async function getStudyMaterials() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("study_materials")
    .select(`
      *,
      subjects ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// 2. Upload/Add Study Material Document
export async function addStudyMaterialAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user?.id).single();

  if (!membership) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const subject_id = formData.get("subject_id") as string;
  const category = formData.get("category") as string;
  const file_url = formData.get("file_url") as string; // URL link (Google Drive, Supabase Storage, etc.)

  const { error } = await supabase.from("study_materials").insert([{
    branch_id: membership.branch_id,
    subject_id,
    title,
    category,
    file_url: file_url || "https://example.com/sample.pdf",
    file_size: "3.2 MB"
  }]);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/materials");
  return { success: true };
}