import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { Metadata } from "next";
import SettingsShell from "./_components";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Institute Configuration | CoachingWala ERP",
};

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData?.user) redirect("/login");

  const user = authData.user;

  // 1. Fetch Membership & Institute Data
  const { data: memberships, error: membershipError } = await supabase
    .from("core_memberships")
    .select(`
      institute_id,
      institutes ( id, name, slug, logo_url, created_at, subscription_status, subscription_plan, registration_number, owner_name, aadhaar_number, pan_number )
    `)
    .eq("user_id", user.id)
    .limit(1);

  if (membershipError || !memberships?.[0]) redirect("/onboarding");

  const membership = memberships[0];
  const instituteData = Array.isArray(membership.institutes) ? membership.institutes[0] : membership.institutes;

  // 2. Fetch City
  const { data: branchesData } = await supabase
    .from("branches")
    .select("city")
    .eq("institute_id", membership.institute_id)
    .limit(1);

  // 3. 🚨 DEEP FIX: REAL DATABASE STUDENT COUNT
  // This physically counts how many rows in the students table belong to this institute
  const { count: realStudentCount, error: countError } = await supabase
    .from("students")
    .select("*", { count: "exact", head: true })
    .eq("institute_id", membership.institute_id);

  if (countError) {
    console.error("Failed to count students:", countError);
  }

  // 4. Fetch REAL Transaction History
  const { data: transactionsData } = await supabase
    .from("institute_transactions")
    .select("*")
    .eq("institute_id", membership.institute_id)
    .order("created_at", { ascending: false });

  const currentPlan = instituteData?.subscription_plan || "Free Trial";
  const isPaid = instituteData?.subscription_status === "active";
  const createdAt = new Date(instituteData?.created_at || new Date());
  const trialExpiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const now = new Date();
  
  const isTrialExpired = !isPaid && now > trialExpiresAt;
  const daysLeft = isPaid || isTrialExpired ? 0 : Math.max(0, Math.ceil((trialExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <SettingsShell
      membershipId={membership.institute_id}
      createdAt={createdAt.toISOString()}
      instituteName={instituteData?.name || "Not Set"}
      instituteSlug={instituteData?.slug || "Not Set"}
      registrationNumber={instituteData?.registration_number || "Not Set"}
      ownerName={instituteData?.owner_name || "Not Set"}
      aadhaarNumber={instituteData?.aadhaar_number || "Not Set"}
      panNumber={instituteData?.pan_number || "Not Set"}
      logoUrl={instituteData?.logo_url || null}
      city={branchesData?.[0]?.city || "Not Set"}
      userEmail={user.email || ""}
      daysLeft={daysLeft}
      isPaid={isPaid}
      isTrialExpired={isTrialExpired}
      currentPlan={currentPlan}
      studentsCount={realStudentCount || 0} // 🚨 PASSING THE REAL NUMBER HERE
      transactions={transactionsData || []} 
    />
  );
}