"use server";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

// We use standard supabase client here because we are bypassing standard Auth for custom usernames
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function loginStudentAction(username: string, password: string) {
  try {
    // 1. Find the student in the database
    const { data: student, error } = await supabase
      .from('students')
      .select('id, status')
      .eq('portal_username', username)
      .eq('portal_password', password)
      .single();

    if (error || !student) {
      throw new Error("Invalid username or password.");
    }

    if (student.status === "inactive") {
      throw new Error("Your account has been suspended. Please contact the institute.");
    }

    // 2. 🚨 DEEP FIX: Await the cookies() Promise before setting
    const cookieStore = await cookies();
    
    cookieStore.set({
      name: 'cw_student_session',
      value: student.id,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutStudentAction() {
  // 🚨 DEEP FIX: Await the cookies() Promise before deleting
  const cookieStore = await cookies();
  cookieStore.delete('cw_student_session');
}