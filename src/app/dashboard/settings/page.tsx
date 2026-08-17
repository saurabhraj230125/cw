// src/app/dashboard/settings/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { Metadata } from "next";
import SettingsShell from "./_components"; // Importing our new structured client shell

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

  // Clear fallback values indicating "not set" state where appropriate.
  const genericInstituteFallback = {
    name: "Placeholder Institute",
    slug: "placeholder-slug",
    city: "Bokaro", // Assuming a placeholder city is required
    created_at: new Date().toISOString(),
  };

  const { data: membership, error: membershipError } = await supabase
    .from("core_memberships")
    .select(`
      institute_id,
      institutes ( id, name, slug, created_at, subscription_status, subscription_plan ),
      branches ( city )
    `)
    .eq("user_id", user.id)
    .single();

  if (membershipError || !membership) redirect("/onboarding");

  // Improved safe data extraction with generic fallbacks
  const instituteData =
    (Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes) || genericInstituteFallback;
  const branchData =
    (Array.isArray(membership.branches) ? membership.branches[0] : membership.branches) || {
      city: genericInstituteFallback.city,
    };

  const currentPlan = instituteData?.subscription_plan || "Free Trial";
  const userEmail = user.email || "owner@example.com";

  // Check paid status
  const isPaid = instituteData?.subscription_status === "active";

  const createdAt = new Date(instituteData?.created_at || genericInstituteFallback.created_at);
  const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();

  const isTrialExpired = !isPaid && now > trialExpiresAt;
  const daysLeft =
    isPaid || isTrialExpired ? 0 : Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <SettingsShell
      membershipId={membership.institute_id}
      createdAt={createdAt.toISOString()}
      instituteName={instituteData.name}
      instituteSlug={instituteData.slug}
      city={branchData.city}
      userEmail={userEmail}
      daysLeft={daysLeft}
      isPaid={isPaid}
      isTrialExpired={isTrialExpired}
      currentPlan={currentPlan}
    />
  );
}