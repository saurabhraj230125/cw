"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. GET ALL UNRESOLVED ALERTS
// ==========================================
export async function getActiveAlerts() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  // Note: We are fetching globally or by branch based on your setup. 
  // If you want to lock it to branch, we would fetch the branch_id first.
  // For now, we pull all unresolved alerts.
  const { data, error } = await supabase
    .from("system_alerts")
    .select("*")
    .eq("is_resolved", false)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// ==========================================
// 2. RESOLVE A SINGLE ALERT
// ==========================================
export async function resolveAlertAction(alertId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("system_alerts")
    .update({ is_resolved: true })
    .eq("id", alertId);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
  return { success: true };
}

// ==========================================
// 3. MARK ALL AS READ (RESOLVE ALL)
// ==========================================
export async function resolveAllAlertsAction() {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("system_alerts")
    .update({ is_resolved: true })
    .eq("is_resolved", false);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/alerts");
  return { success: true };
}