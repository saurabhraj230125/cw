"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../../lib/supabase/server";

// 1. Generate Monthly Invoices for all active students
export async function generateMonthlyInvoices(formData: FormData) {
  const supabase = await createClient();
  const month = formData.get("billing_month") as string;
  const dueDate = formData.get("due_date") as string;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user.id)
    .single();

  // Fetch all active students and their subjects
  const { data: students } = await supabase
    .from("students")
    .select(`
      id,
      student_subjects (
        subjects ( monthly_fee )
      )
    `)
    .eq("status", "active")
    .eq("branch_id", membership?.branch_id);

  if (!students) return { error: "No students found" };

  // Fetch existing invoices for this month so we don't duplicate
  const { data: existingInvoices } = await supabase
    .from("fee_invoices")
    .select("student_id")
    .eq("billing_month", month)
    .eq("branch_id", membership?.branch_id);

  const existingStudentIds = new Set(existingInvoices?.map(i => i.student_id));

  // Calculate totals and prepare inserts
  const invoicesToInsert = students
    .filter(s => !existingStudentIds.has(s.id)) // Skip if already billed
    .map(student => {
      const totalAmount = student.student_subjects.reduce((sum: number, enrollment: any) => {
        return sum + Number(enrollment.subjects.monthly_fee);
      }, 0);

      return {
        branch_id: membership?.branch_id,
        student_id: student.id,
        billing_month: month,
        total_amount: totalAmount,
        due_date: dueDate,
        amount_paid: 0,
        status: totalAmount === 0 ? "paid" : "unpaid"
      };
    })
    .filter(inv => inv.total_amount > 0); // Don't bill 0 amounts

  if (invoicesToInsert.length > 0) {
    const { error } = await supabase.from("fee_invoices").insert(invoicesToInsert);
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard/fees");
  return { success: true, count: invoicesToInsert.length };
}

// 2. Get All Invoices
export async function getInvoices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fee_invoices")
    .select(`
      *,
      students ( roll_number, full_name, parent_phone )
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
}

// 3. Record a Payment
export async function recordPaymentAction(formData: FormData) {
  const supabase = await createClient();
  const invoice_id = formData.get("invoice_id") as string;
  const amount = Number(formData.get("amount"));
  const payment_method = formData.get("payment_method") as string;

  const { data: { user } } = await supabase.auth.getUser();
  const { data: membership } = await supabase.from("core_memberships").select("branch_id").eq("user_id", user?.id).single();

  // Fetch the current invoice to calculate new totals
  const { data: invoice } = await supabase.from("fee_invoices").select("*").eq("id", invoice_id).single();
  if (!invoice) throw new Error("Invoice not found");

  const newAmountPaid = Number(invoice.amount_paid) + amount;
  const newStatus = newAmountPaid >= Number(invoice.total_amount) ? "paid" : "partial";

  // 1. Insert Payment Record
  await supabase.from("fee_payments").insert([{
    branch_id: membership?.branch_id,
    invoice_id,
    amount,
    payment_method
  }]);

  // 2. Update Invoice
  await supabase.from("fee_invoices").update({
    amount_paid: newAmountPaid,
    status: newStatus
  }).eq("id", invoice_id);

  revalidatePath("/dashboard/fees");
  return { success: true };
}