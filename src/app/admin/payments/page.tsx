import { createClient } from "../../../lib/supabase/server";
import { adminVerifyPaymentAction } from "../../actions/billing";
import { Clock, CheckCircle, XCircle } from "lucide-react";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  
  const { data: payments } = await supabase
    .from("core_payments")
    .select(`
      *,
      institutes:institute_id ( name )
    `)
    .order("created_at", { ascending: false });

  // Fallback: Fetch user emails manually to avoid Supabase cross-schema join errors
  const userIds = payments?.map(p => p.user_id) || [];
  const { data: users } = await supabase.rpc('get_user_emails_by_ids', { user_ids: userIds }).match(() => ({ data: [] }));

  return (
    <div className="p-10 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Verification</h1>
      <p className="text-slate-500 font-medium mb-8">Approve UTRs to automatically unlock user workspaces and dispatch emails.</p>

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
            {payments?.map((payment: any) => {
              const instituteName = Array.isArray(payment.institutes) ? payment.institutes[0]?.name : payment.institutes?.name;
              // Hardcoded placeholder email if RPC fails. In prod, you'll join against a public user profiles table.
              const customerEmail = "owner@institute.com"; 

              return (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{instituteName || "Unknown Institute"}</div>
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
                            await adminVerifyPaymentAction(payment.id, "approve", customerEmail, instituteName);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors"
                        >
                          Approve & Email
                        </button>
                        <button 
                          formAction={async () => {
                            "use server";
                            await adminVerifyPaymentAction(payment.id, "reject", customerEmail, instituteName, "Invalid UTR");
                          }}
                          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-xs transition-colors"
                        >
                          Reject
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}