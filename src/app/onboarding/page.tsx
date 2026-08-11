import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import { OnboardingWizard } from "../../components/onboarding/OnboardingWizard";


export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .limit(1)
    .maybeSingle();

  // If they already have a membership, redirect them to the dashboard
  if (membership) {
    redirect("/dashboard");
  }

  return <OnboardingWizard />;
}