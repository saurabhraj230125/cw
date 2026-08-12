"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

// SERVER-SIDE PRICING TRUTH (Never trust the frontend price)
const PRICING_MATRIX = {
  monthly: { essential: 799, starter: 1499, pro: 2499 },
  yearly: { essential: 7999, starter: 14999, pro: 24999 },
} as const;

export async function submitUtrPaymentAction(planId: keyof typeof PRICING_MATRIX.monthly, billingCycle: "monthly" | "yearly", utrNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("institute_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) throw new Error("Workspace not found.");

  const actualAmount = PRICING_MATRIX[billingCycle][planId];
  if (!actualAmount) throw new Error("Invalid plan selection.");

  const { error } = await supabase
    .from("core_payments")
    .insert({
      user_id: user.id,
      institute_id: membership.institute_id,
      plan_id: planId,
      billing_cycle: billingCycle,
      amount: actualAmount,
      utr: utrNumber.trim(),
      status: "pending"
    });

  if (error) {
    if (error.code === '23505') throw new Error("This UTR number has already been submitted.");
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function adminVerifyPaymentAction(paymentId: string, action: "approve" | "reject", adminNote?: string) {
  const supabase = await createClient(); 
  
  const { data: payment } = await supabase.from("core_payments").select("*").eq("id", paymentId).single();
  if (!payment || payment.status !== "pending") throw new Error("Payment is not pending or does not exist.");

  if (action === "approve") {
    await supabase.from("core_payments").update({ status: "approved", verified_at: new Date().toISOString() }).eq("id", paymentId);
    await supabase.from("institutes").update({ 
      subscription_status: "active", 
      subscription_plan: payment.plan_id 
    }).eq("id", payment.institute_id);
  } else {
    await supabase.from("core_payments").update({ 
      status: "rejected", 
      admin_note: adminNote,
      verified_at: new Date().toISOString()
    }).eq("id", paymentId);
  }

  revalidatePath("/admin/payments");
  return { success: true };
}