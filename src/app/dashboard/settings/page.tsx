import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import SettingsClient from "./SettingsClient";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Institute Settings | CoachingWala ERP",
  description: "Manage your institute configuration, branding, and SaaS billing.",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/login");

  const user = authData.user;

  const { data: membership, error: membershipError } = await supabase
    .from("core_memberships")
    .select(`
      institute_id,
      role_key,
      institutes ( id, name, slug, created_at, subscription_status, subscription_plan ),
      branches ( name, city )
    `)
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) redirect("/onboarding");

  const instituteData = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;
  const branchData = Array.isArray(membership.branches) ? membership.branches[0] : membership.branches;

  const safeInstituteName = instituteData?.name || "Future Q Academy";
  const safeInstituteSlug = instituteData?.slug || "future-q";
  const safeCity = branchData?.city || "Bokaro";
  const safeEmail = user.email || "admin@futureq.com";

  // Check if they are paid
  const isPaid = instituteData?.subscription_status === 'active';
  const currentPlan = instituteData?.subscription_plan || 'Free Trial';

  const createdAt = new Date(instituteData?.created_at || new Date());
  const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const isTrialExpired = !isPaid && (now > trialExpiresAt);
  const daysLeft = (isPaid || isTrialExpired) ? 0 : Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <SettingsClient 
      userEmail={safeEmail}
      instituteName={safeInstituteName}
      instituteSlug={safeInstituteSlug}
      city={safeCity}
      isTrialExpired={isTrialExpired}
      daysLeft={daysLeft}
      isPaid={isPaid}
      currentPlan={currentPlan}
    />
  );
}