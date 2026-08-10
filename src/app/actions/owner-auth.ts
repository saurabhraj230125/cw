"use server";

import { createClient } from "../../lib/supabase/server";
import { cookies } from "next/headers";

export async function loginOwnerAction(email: string, pass: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: pass,
  });

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function registerFreeTrialAction(instituteName: string, email: string, pass: string) {
  const supabase = await createClient();

  // 1. Create the Auth User
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: pass,
  });

  if (authError) throw new Error(authError.message);
  if (!authData.user) throw new Error("Failed to create account.");

  const userId = authData.user.id;

  // 2. Create the Institute (Gets the 7-Day Trial automatically from SQL Default)
  const { data: instData, error: instError } = await supabase
    .from("institutes")
    .insert([{ name: instituteName }])
    .select("id")
    .single();

  if (instError) throw new Error("Failed to configure Institute.");
  const instId = instData.id;

  // 3. Create the Main Branch
  const { data: branchData, error: branchError } = await supabase
    .from("branches")
    .insert([{ institute_id: instId, name: "Main Branch", is_head_office: true }])
    .select("id")
    .single();

  if (branchError) throw new Error("Failed to configure Main Branch.");

  // 4. Link the User as the Admin of this Institute
  const { error: memberError } = await supabase
    .from("core_memberships")
    .insert([{
      user_id: userId,
      institute_id: instId,
      branch_id: branchData.id,
      role: 'admin'
    }]);

  if (memberError) throw new Error("Failed to setup Admin privileges.");

  return { success: true };
}