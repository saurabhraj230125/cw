"use server";

import { createClient } from "../../lib/supabase/server";

// ==========================================
// 1. STANDARD SECURE LOGIN
// ==========================================
export async function loginOwnerAction(email: string, pass: string) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
  if (error) throw new Error(error.message);
  return { success: true };
}

// ==========================================
// 2. CREATE ACCOUNT ONLY (Step 1 of SaaS Flow)
// ==========================================
export async function signUpFreeTrialAction(email: string, pass: string) {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (authError) throw new Error(`Auth Error: ${authError.message}`);
  if (!authData.user) throw new Error("Failed to create account.");

  if (authData.user.identities && authData.user.identities.length === 0) {
    throw new Error("This email is already registered. Please click 'Log In Here' below.");
  }

  return { success: true };
}

// ==========================================
// 3. COMPLETE ONBOARDING (Step 2 of SaaS Flow)
// ==========================================
export async function completeOnboardingAction(instituteName: string) {
  const supabase = await createClient();
  
  // Verify they are logged in before allowing them to create an institute
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication lost. Please log in again.");

  // Create Institute
  const { data: instData, error: instError } = await supabase
    .from("institutes")
    .insert([{ name: instituteName }])
    .select("id")
    .single();

  if (instError) {
    console.error("SUPABASE INSTITUTE ERROR:", instError);
    throw new Error(`Database Error (Institute): ${instError.message}`);
  }
  
  // Create Main Branch
  const { data: branchData, error: branchError } = await supabase
    .from("branches")
    .insert([{ institute_id: instData.id, name: "Main Branch", is_head_office: true }])
    .select("id")
    .single();

  if (branchError) {
    console.error("SUPABASE BRANCH ERROR:", branchError);
    throw new Error(`Database Error (Branch): ${branchError.message}`);
  }

  // Link Admin
  const { error: memberError } = await supabase
    .from("core_memberships")
    .insert([{
      user_id: user.id,
      institute_id: instData.id,
      branch_id: branchData.id,
      role: 'admin'
    }]);

  if (memberError) {
    console.error("SUPABASE MEMBERSHIP ERROR:", memberError);
    throw new Error(`Database Error (Membership): ${memberError.message}`);
  }

  return { success: true };
}