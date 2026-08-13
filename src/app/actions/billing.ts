"use server";

import { createClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";

const PRICING_MATRIX = {
  monthly: { essential: 799, starter: 1499, pro: 2499 },
  yearly: { essential: 7999, starter: 14999, pro: 24999 },
} as const;

// 🚨 Your Make.com or n8n Webhook URL
const WEBHOOK_URL = process.env.PAYMENT_WEBHOOK_URL || "";
const YOUR_ADMIN_EMAIL = "admin@coachingwala.com"; 

export async function submitUtrPaymentAction(planId: keyof typeof PRICING_MATRIX.monthly, billingCycle: "monthly" | "yearly", utrNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership } = await supabase.from("core_memberships").select("institute_id, institutes(name)").eq("user_id", user.id).single();
  if (!membership) throw new Error("Workspace not found.");

  const institutes = membership.institutes as unknown;
  const instituteName = Array.isArray(institutes)
    ? (institutes[0] as { name?: string } | undefined)?.name
    : (institutes as { name?: string } | null)?.name;

  const actualAmount = PRICING_MATRIX[billingCycle][planId];
  if (!actualAmount) throw new Error("Invalid plan selection.");

  // 1. INSTANT APPROVAL: Save payment as approved immediately
  const { error } = await supabase.from("core_payments").insert({
    user_id: user.id,
    institute_id: membership.institute_id,
    plan_id: planId,
    billing_cycle: billingCycle,
    amount: actualAmount,
    utr: utrNumber.trim(),
    status: "approved", // 🔥 Bypassing 'pending'
    verified_at: new Date().toISOString()
  });

  if (error) {
    if (error.code === '23505') throw new Error("This UTR number has already been submitted.");
    throw new Error(error.message);
  }

  // 2. INSTANT UNLOCK: Make the subscription active in the database
  await supabase.from("institutes").update({ 
    subscription_status: "active", 
    subscription_plan: planId
  }).eq("id", membership.institute_id);

  // 3. INSTANT DUAL EMAILS: Fire the webhook immediately to Make.com/n8n
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "payment_approved",
          customer_email: user.email,
          admin_email: YOUR_ADMIN_EMAIL,
          institute_name: instituteName || "Unknown Institute",
          plan: planId.toUpperCase(),
          amount: actualAmount,
          utr: utrNumber.trim(),
          customer_message: `Great news! We have received your payment (UTR: ${utrNumber.trim()}). Your ${planId.toUpperCase()} Plan is now fully active. Log in to access your unlocked premium features.`,
          admin_message: `SUCCESS: Auto-activated a payment of ₹${actualAmount} from ${instituteName} (UTR: ${utrNumber.trim()}). Their account is unlocked.`
        })
      });
    } catch (e) {
      console.error("Webhook failed to send.");
    }
  }

  // Refresh the UI to instantly drop the padlocks
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard"); 
  return { success: true };
}

export async function adminVerifyPaymentAction(paymentId: string, action: "approve" | "reject", customerEmail: string, instituteName: string, reason?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: payment, error: fetchError } = await supabase.from("core_payments").select("*").eq("id", paymentId).single();
  if (fetchError || !payment) throw new Error("Payment not found");

  if (action === "approve") {
    await supabase.from("core_payments").update({ status: "approved", verified_at: new Date().toISOString() }).eq("id", paymentId);
    await supabase.from("institutes").update({ subscription_status: "active", subscription_plan: payment.plan_id }).eq("id", payment.institute_id);
    
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "payment_approved",
            customer_email: customerEmail,
            admin_email: YOUR_ADMIN_EMAIL,
            institute_name: instituteName,
            plan: payment.plan_id.toUpperCase(),
            amount: payment.amount,
            utr: payment.utr,
            customer_message: `Great news! Your payment (UTR: ${payment.utr}) has been approved by our admin. Your ${payment.plan_id.toUpperCase()} Plan is now fully active.`,
            admin_message: `Admin manually approved payment of ₹${payment.amount} from ${instituteName} (UTR: ${payment.utr}).`
          })
        });
      } catch (e) {
        console.error("Webhook failed to send.");
      }
    }
  } else {
    await supabase.from("core_payments").update({ status: "rejected" }).eq("id", paymentId);
    
    if (WEBHOOK_URL) {
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "payment_rejected",
            customer_email: customerEmail,
            admin_email: YOUR_ADMIN_EMAIL,
            institute_name: instituteName,
            plan: payment.plan_id.toUpperCase(),
            amount: payment.amount,
            utr: payment.utr,
            customer_message: `Unfortunately, we could not verify your payment (UTR: ${payment.utr}). Reason: ${reason || "Invalid UTR"}. Please contact support.`,
            admin_message: `Admin manually rejected payment of ₹${payment.amount} from ${instituteName} (UTR: ${payment.utr}).`
          })
        });
      } catch (e) {
        console.error("Webhook failed to send.");
      }
    }
  }

  revalidatePath("/admin/payments");
  return { success: true };
}