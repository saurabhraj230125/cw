"use server";

import { createClient } from "@supabase/supabase-js";

export async function terminateMasterAccountAction(userId: string, instituteId: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // 🚨 DEEP FIX: Validate environment variables to prevent server crashes
  if (!supabaseUrl || !supabaseServiceKey) {
    return { 
      success: false, 
      error: "Server Configuration Error: SUPABASE_SERVICE_ROLE_KEY is missing from your .env.local file." 
    };
  }

  // 🚨 Initialize with the validated Admin Service Role Key
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Force Delete the Institute (Bypasses RLS)
    await supabaseAdmin.from('institutes').delete().eq('id', instituteId);

    // 2. Force Delete the Membership Link
    await supabaseAdmin.from('core_memberships').delete().eq('user_id', userId);

    // 3. PERMANENTLY DESTROY THE LOGIN ACCOUNT
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (authError) throw authError;

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}