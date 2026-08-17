import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { Metadata } from "next";
import SettingsShell from "./_components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Institute Configuration | CoachingWala ERP",
  description: "Manage your institute details, branding, billing, and security.",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/login");

  const user = authData.user;

  // 1. Fetch Membership & Institute Data
  const { data: membership, error: membershipError } = await supabase
    .from("core_memberships")
    .select(`
      institute_id,
      institutes ( id, name, slug, logo_url, created_at, subscription_status, subscription_plan, registration_number, owner_name, aadhaar_number, pan_number ),
      branches ( city )
    `)
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) redirect("/onboarding");

  const instituteData = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;
  const branchData = Array.isArray(membership.branches) ? membership.branches[0] : membership.branches;

  // 2. Fetch REAL Student Count for this specific Institute
  const { count: studentsCount } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("institute_id", membership.institute_id);

  const currentPlan = instituteData?.subscription_plan || "Free Trial";
  const userEmail = user.email || "owner@example.com";
  const isPaid = instituteData?.subscription_status === "active";

  const createdAt = new Date(instituteData?.created_at || new Date());
  const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const isTrialExpired = !isPaid && now > trialExpiresAt;
  const daysLeft = isPaid || isTrialExpired ? 0 : Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Generate Unique Fallback ID using the UUID if registration_number is empty
  const uniqueRegFallback = instituteData?.id ? `CW-${instituteData.id.split('-')[0].toUpperCase()}` : "Not Set";

  return (
    <SettingsShell
      membershipId={membership.institute_id}
      createdAt={createdAt.toISOString()}
      instituteName={instituteData?.name || "Not Set"}
      instituteSlug={instituteData?.slug || "Not Set"}
      registrationNumber={instituteData?.registration_number || uniqueRegFallback}
      ownerName={instituteData?.owner_name || "Not Set"}
      aadhaarNumber={instituteData?.aadhaar_number || "Not Set"}
      panNumber={instituteData?.pan_number || "Not Set"}
      logoUrl={instituteData?.logo_url || null}
      city={branchData?.city || "Not Set"}
      userEmail={userEmail}
      daysLeft={daysLeft}
      isPaid={isPaid}
      isTrialExpired={isTrialExpired}
      currentPlan={currentPlan}
      studentsCount={studentsCount || 0}
    />
  );
}