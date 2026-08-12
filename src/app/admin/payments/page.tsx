import { createClient } from "../../../lib/supabase/server";
import { adminVerifyPaymentAction } from "../../actions/billing";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  
  // 1. Fetch payments, but REMOVE the auth.users join to prevent PostgREST errors
  const { data: payments, error } = await supabase
    .from("core_payments")
    .select(`
      id,
      plan_id,
      billing_cycle,
      amount,
      utr,
      status,
      created_at,
      institutes:institute_id ( name, slug )
    `)
    .order("created_at", { ascending: false });

  // 2. Log any database errors directly to your VS Code terminal
  if (error) {
    console.error("🚨 ADMIN FETCH ERROR:", error.message, error.details);
  }

  return (
    <div className="p-10 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Verification</h1>
      <p className="text-slate-500 font-medium mb-8">Review and approve manual UTR transactions.</p>

      {/* Show an error box on the screen if Supabase blocks the fetch */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center gap-3 font-bold text-sm">
          <AlertCircle className="w-5 h-5" />
          Database Error: {error.message}. Check terminal for details.
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[11px] font-black">
            <tr>
              <th className="p-4">Date & Institute</th>
              <th className="p-4">Plan Details</th>
              <th className="p-4">UTR Reference</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(!payments || payments.length === 0) && !error && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 font-bold">
                  No payment records found. <br/>
                  <span className="text-xs font-medium">If you just submitted one, ensure you are logged into the Admin page with the same account, or temporarily disable RLS on core_payments.</span>
                </td>
              </tr>
            )}

            {payments?.map((payment: any) => (
              <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  {/* Safely handle cases where institute data might be an array */}
                  <div className="font-bold text-slate-900">
                    {Array.isArray(payment.institutes) ? payment.institutes[0]?.name : payment.institutes?.name || "Unknown Institute"}
                  </div>
                  <div className="text-xs text-slate-500">{new Date(payment.created_at).toLocaleDateString()}</div>
                </td>
                <td className="p-4">
                  <div className="font-black text-[#0055a5] uppercase">{payment.plan_id}</div>
                  <div className="text-xs font-bold text-slate-500">₹{payment.amount} ({payment.billing_cycle})</div>
                </td>
                <td className="p-4 font-mono font-bold text-slate-700">{payment.utr}</td>
                <td className="p-4">
                  {payment.status === 'pending' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><Clock className="w-3 h-3"/> Pending</span>}
                  {payment.status === 'approved' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><CheckCircle className="w-3 h-3"/> Approved</span>}
                  {payment.status === 'rejected' && <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><XCircle className="w-3 h-3"/> Rejected</span>}
                </td>
                <td className="p-4 text-right">
                  {payment.status === 'pending' && (
                    <form className="flex justify-end gap-2">
                      <button 
                        formAction={async () => {
                          "use server";
                          await adminVerifyPaymentAction(payment.id, "approve");
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        formAction={async () => {
                          "use server";
                          await adminVerifyPaymentAction(payment.id, "reject", "Invalid UTR");
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                      >
                        Reject
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}