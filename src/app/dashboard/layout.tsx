import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import DashboardShell from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 1. Secure Authentication Check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Actual Institute Data (Respects RLS Privacy)
  const { data: membership } = await supabase
    .from("core_memberships")
    .select(`
      institutes ( name, city )
    `)
    .eq("user_id", user.id)
    .single();

  // If onboarding was bypassed, redirect back
  if (!membership) {
    redirect("/onboarding");
  }

  const instituteName = (membership.institutes as any)?.name || "My Institute";

  return (
    <DashboardShell instituteName={instituteName}>
      {children}
    </DashboardShell>
  );
}