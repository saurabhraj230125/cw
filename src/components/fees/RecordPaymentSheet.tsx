"use client";

import { useState } from "react";
import { X, IndianRupee, Loader2, Wallet, CreditCard } from "lucide-react";
import { recordPaymentAction } from "../../app/actions/fee-actions";

export function RecordPaymentSheet({ invoice }: { invoice: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const balance = Number(invoice.total_amount) - Number(invoice.amount_paid);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await recordPaymentAction(formData);
      setIsOpen(false);
    } catch (err) {
      alert("Failed to record payment.");
    } finally {
      setIsPending(false);
    }
  }

  // If already paid, don't render the button
  if (invoice.status === "paid") {
    return (
      <span className="inline-flex items-center text-emerald-600 font-semibold text-sm">
        Fully Paid
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-slate-900 hover:bg-black text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors"
      >
        <IndianRupee className="w-4 h-4" /> Collect
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Record Payment</h2>
            <p className="text-sm text-slate-500 mt-1">{invoice.students.full_name} • {invoice.billing_month}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Total Bill:</span>
              <span className="font-semibold text-slate-900">₹{invoice.total_amount}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-semibold text-emerald-600">₹{invoice.amount_paid}</span>
            </div>
            <div className="flex justify-between text-base border-t border-slate-200 pt-2 mt-2 font-bold">
              <span className="text-slate-900">Remaining Balance:</span>
              <span className="text-red-600">₹{balance}</span>
            </div>
          </div>

          <form id="payment-form" action={handleSubmit} className="space-y-5">
            <input type="hidden" name="invoice_id" value={invoice.id} />
            
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Collection Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  required 
                  type="number" 
                  name="amount" 
                  max={balance} 
                  defaultValue={balance}
                  className="w-full h-12 pl-9 pr-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Payment Method</label>
              <select name="payment_method" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="cash">Cash (Counter)</option>
                <option value="upi">UPI / QR Code</option>
                <option value="bank_transfer">Bank Transfer (NEFT/RTGS)</option>
              </select>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            type="submit"
            form="payment-form"
            disabled={isPending}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Payment"}
          </button>
        </div>
      </div>
    </>
  );
}