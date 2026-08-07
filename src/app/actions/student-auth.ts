"use server";

import { cookies } from "next/headers";
import { createClient } from "../../lib/supabase/server";

export async function studentLoginAction(rollNumber: string, dob: string) {
  const supabase = await createClient();

  const cleanRollNumber = rollNumber.trim();
  const cleanDob = dob.trim();

  // 1. Ask database ONLY for the Roll Number (Use .eq to prevent Type errors)
  const { data: student, error } = await supabase
    .from("students")
    .select("id, full_name, batch_id, date_of_birth")
    .eq("roll_number", cleanRollNumber)
    .single();

  // If we couldn't find the roll number, or there was a database error
  if (error || !student) {
    console.error("Database Lookup Error:", error?.message || "Student not found");
    throw new Error("Invalid Roll Number. Please check your credentials.");
  }

  // 2. Smart Date Verification in JavaScript
  // We check if the database date starts with or includes the typed date 
  // (This fixes the "2007-10-27" vs "2007-10-27T00:00:00" mismatch)
  const dbDate = student.date_of_birth || "";
  
  if (!dbDate.includes(cleanDob)) {
    console.error(`DOB Mismatch. Typed: ${cleanDob}, Database has: ${dbDate}`);
    throw new Error("Invalid Date of Birth.");
  }

  // 3. Success! Set the secure session cookie
  const cookieStore = await cookies();
  cookieStore.set("erp_student_session", student.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 Week
    path: "/"
  });

  return { success: true, studentId: student.id };
}

export async function studentLogoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("erp_student_session");
  return { success: true };
}