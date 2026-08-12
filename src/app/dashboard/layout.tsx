import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server"; 
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode; }) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/login");

  const { data: membership, error: membershipError } = await supabase
    .from("core_memberships")
    .select(`
      institutes ( name, city, created_at, subscription_status, subscription_plan )
    `)
    .eq("user_id", authData.user.id)
    .single();

  if (membershipError) {
    if (membershipError.code === 'PGRST116') redirect("/onboarding");
  }

  if (!membership) redirect("/onboarding");

  const instituteData = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;
  const instituteName = instituteData?.name || "Future Q";
  
  const isPaid = instituteData?.subscription_status === 'active';
  const currentPlan = instituteData?.subscription_plan || 'Free Trial';

  const createdAt = new Date(instituteData?.created_at || new Date());
  const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const isTrialExpired = !isPaid && (now > expiresAt);
  const daysLeft = (isPaid || isTrialExpired) ? 0 : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

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