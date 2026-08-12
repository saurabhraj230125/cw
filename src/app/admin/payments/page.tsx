import { createClient } from "../../../lib/supabase/server";
import { adminActivateSubscriptionAction } from "../../actions/billing";
import { FileText, CheckCircle, Zap } from "lucide-react";

export default async function AdminPaymentsPage() {
  const supabase = await createClient();
  
  const { data: requests } = await supabase
    .from("core_payments")
    .select(`
      *,
      users:user_id ( email ),
      institutes:institute_id ( id, name, slug )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-10 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-black text-slate-900 mb-2">Workspace Activation</h1>
      <p className="text-slate-500 font-medium mb-8">Manage invoice requests and activate workspaces after bank confirmation.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-widest text-[11px] font-black">
            <tr>
              <th className="p-4">Institute & Request Date</th>
              <th className="p-4">Plan Requested</th>
              <th className="p-4">Amount Due</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests?.map((req: any) => {
              const institute = Array.isArray(req.institutes) ? req.institutes[0] : req.institutes;
              const userEmail = Array.isArray(req.users) ? req.users[0]?.email : req.users?.email;

              return (
                <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{institute?.name || "Unknown"}</div>
                    <div className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4 font-black text-[#0055a5] uppercase">{req.plan_id}</td>
                  <td className="p-4 font-bold text-slate-700">₹{req.amount} ({req.billing_cycle})</td>
                  <td className="p-4">
                    {req.status === 'invoice_requested' && <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><FileText className="w-3 h-3"/> Pending Invoice / Payment</span>}
                    {req.status === 'active' && <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold flex items-center w-max gap-1"><CheckCircle className="w-3 h-3"/> Active</span>}
                  </td>
                  <td className="p-4 text-right">
                    {req.status === 'invoice_requested' && (
                      <form className="flex justify-end gap-2">
                        <button 
                          formAction={async () => {
                            "use server";
                            await adminActivateSubscriptionAction(req.id, institute.id, req.plan_id, req.billing_cycle, userEmail);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                        >
                          <Zap className="w-3 h-3" /> Activate Account
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}