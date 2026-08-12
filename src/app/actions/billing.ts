"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

const PRICING_MATRIX = {
  monthly: { essential: 799, starter: 1499, pro: 2499 },
  yearly: { essential: 7999, starter: 14999, pro: 24999 },
} as const;

// Replace with your actual webhook URL (e.g., an n8n workflow URL)
const WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL || "https://your-webhook-url.com/catch";

export async function requestInvoiceAction(planId: keyof typeof PRICING_MATRIX.monthly, billingCycle: "monthly" | "yearly") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("institutes(id, name), user_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) throw new Error("Workspace not found.");
  
  const instituteData = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;
  const actualAmount = PRICING_MATRIX[billingCycle][planId];

  // 1. Log the Invoice Request
  const { data: payment, error } = await supabase
    .from("core_payments")
    .insert({
      user_id: user.id,
      institute_id: instituteData.id,
      plan_id: planId,
      billing_cycle: billingCycle,
      amount: actualAmount,
      utr: `REQ-${Date.now()}`, // Placeholder since UTR comes later
      status: "invoice_requested"
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // 2. Fire Webhook to Admin (Notify you to create Zoho Invoice)
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "invoice_requested",
        institute_name: instituteData.name,
        user_email: user.email,
        plan: planId,
        cycle: billingCycle,
        amount: actualAmount,
      })
    });
  } catch (e) {
    console.error("Webhook failed, but request saved.");
  }

  revalidatePath("/dashboard/settings");
  return { success: true };
}

// Admin Switch to manually activate the account after verifying bank transfer
export async function adminActivateSubscriptionAction(paymentId: string, instituteId: string, planId: string, billingCycle: "monthly" | "yearly", userEmail: string) {
  const supabase = await createClient(); 
  
  // 1. Calculate Expiration Date
  const daysToAdd = billingCycle === "yearly" ? 365 : 30;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + daysToAdd);

  // 2. Activate Institute
  await supabase.from("institutes").update({ 
    subscription_status: "active", 
    subscription_plan: planId,
    plan_expires_at: expiresAt.toISOString()
  }).eq("id", instituteId);

  // 3. Mark Request as Paid
  await supabase.from("core_payments").update({ 
    status: "active", 
    verified_at: new Date().toISOString()
  }).eq("id", paymentId);

  // 4. Fire Webhook to Client (Triggers email/WhatsApp confirmation)
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "subscription_activated",
        user_email: userEmail,
        plan: planId,
        expires_at: expiresAt.toISOString(),
        message: "Payment received with thanks! Your account is now fully active."
      })
    });
  } catch (e) {
    console.error("Webhook failed.");
  }

  revalidatePath("/admin/payments");
  return { success: true };
}