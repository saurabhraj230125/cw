"use server";

import { createClient } from "@supabase/supabase-js";

export async function fetchLiveAlertsData(instituteId: string) {
  if (!instituteId) return { students: [], batches: [], todayAttendance: [] };

  // 🚨 CRITICAL: Use the Service Role Key to act as an Admin and bypass browser RLS blocks
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Fetch all active students
  const { data: students } = await supabaseAdmin
    .from('students')
    .select('*')
    .eq('institute_id', instituteId)
    .eq('status', 'active');

  // 2. Fetch all active batches
  const { data: batches } = await supabaseAdmin
    .from('batches')
    .select('*')
    .eq('status', 'active');

  // 3. Fetch today's exact attendance logs
  const today = new Date().toISOString().split('T')[0];
  const { data: attendance } = await supabaseAdmin
    .from('attendance')
    .select('student_id, date')
    .eq('date', today);

  return { 
    students: students || [], 
    batches: batches || [], 
    todayAttendance: attendance || [] 
  };
}