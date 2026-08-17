import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server"; 
import DashboardShell from "./DashboardShell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const supabase = await createClient();

  // 1. Authenticate User
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/login");

  // 2. Fetch Membership and Institute Data
  const { data: memberships, error: membershipError } = await supabase
    .from("core_memberships")
    .select(`
      institutes ( name, created_at, subscription_status, subscription_plan )
    `)
    .eq("user_id", authData.user.id)
    .limit(1);

  // 🚨 DEEP FIX: Smarter Error Handling
  if (membershipError) {
    console.error("DashboardLayout membership error:", membershipError);
    
    // If it is a database crash (like your RLS recursion bug), DO NOT redirect to onboarding.
    // Instead, trap the error here so the user doesn't get stuck in a fake loop.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-200">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-black">!</div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">System Error</h2>
          <p className="text-slate-600 font-medium mb-6">
            We couldn't load your workspace due to a database connection issue.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl text-left text-sm font-mono text-red-500 overflow-auto border border-red-100">
            {membershipError.message || "Unknown Database Error"}
          </div>
        </div>
      </div>
    );
  }
  
  // 3. Verify Membership Exists
  const membership = memberships && memberships.length > 0 ? memberships[0] : null;
  
  // If the query succeeded, but returned NO rows, they actually need to onboard.
  if (!membership) {
    redirect("/onboarding");
  }

  // 4. Extract Institute Data safely
  const instituteData = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;
  
  // Edge Case: If they have a membership but the institute was deleted
  if (!instituteData) {
    redirect("/onboarding");
  }

  const instituteName = instituteData.name || "CoachingWala";
  
  // 5. Subscription & Trial Logic
  // 🚨 INSTANT UNLOCK: If status is active, they are paid. No expiration check.
  const isPaid = instituteData.subscription_status === 'active';
  const currentPlan = instituteData.subscription_plan || 'Free Trial';

  const createdAt = new Date(instituteData.created_at || new Date());
  const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const isTrialExpired = !isPaid && (now > trialExpiresAt);
  
  // Calculate days left securely without negative numbers
  const daysLeft = (isPaid || isTrialExpired) 
    ? 0 
    : Math.max(0, Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <DashboardShell 
      instituteName={instituteName} 
      isTrialExpired={isTrialExpired} 
      daysLeft={daysLeft}
      isPaid={isPaid}
      currentPlan={currentPlan}
    >
      {children}
    </DashboardShell>
  );
}