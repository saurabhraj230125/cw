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

  // Catch the Supabase "Fake Success" email enumeration trap
  if (authData.user.identities && authData.user.identities.length === 0) {
    throw new Error("This email is already registered. Please click 'Log In Here' below.");
  }

  return { success: true };
}

// ==========================================
// 3. COMPLETE ONBOARDING (Step 2 of SaaS Flow)
// ==========================================
export async function completeOnboardingAction(
  instituteName: string,
  location: string,
  category: string,
  studentCount: string,
  mainProblem: string
) {
  const supabase = await createClient();
  
  // Verify they are logged in before allowing them to create an institute
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Authentication lost. Please log in again.");
  if (!user.email) throw new Error("User email not found. Please log in again.");

  // 1. DYNAMIC SLUG GENERATOR 
  const baseSlug = instituteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const uniqueSlug = `${baseSlug || 'institute'}-${Math.random().toString(36).substring(2, 8)}`;

  // 2. CREATE INSTITUTE
  const { data: instData, error: instError } = await supabase
    .from("institutes")
    .insert([{ 
      name: instituteName,
      slug: uniqueSlug
    }])
    .select("id")
    .single();

  if (instError) {
    console.error("SUPABASE INSTITUTE ERROR:", instError);
    throw new Error(`Database Error (Institute): ${instError.message}`);
  }
  
  // 3. CREATE MAIN BRANCH
  const uniqueBranchCode = `MAIN-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const { data: branchData, error: branchError } = await supabase
    .from("branches")
    .insert([{ 
      institute_id: instData.id, 
      name: "Main Branch", 
      code: uniqueBranchCode, 
      is_head_office: true,
      city: location 
    }])
    .select("id")
    .single();

  if (branchError) {
    console.error("SUPABASE BRANCH ERROR:", branchError);
    throw new Error(`Database Error (Branch): ${branchError.message}`);
  }

  // 4. LINK ADMIN USER (🚨 FIXED: Passing user.email to satisfy the not-null constraint)
  const { error: memberError } = await supabase
    .from("core_memberships")
    .insert([{
      user_id: user.id,
      institute_id: instData.id,
      branch_id: branchData.id,
      role_key: 'admin',
      email: user.email // <-- This satisfies the missing email constraint!
    }]);

  if (memberError) {
    console.error("SUPABASE MEMBERSHIP ERROR:", memberError);
    throw new Error(`Database Error (Membership): ${memberError.message}`);
  }

  return { success: true };
}
// ==========================================
// 4. SECURE LOGOUT
// ==========================================
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}