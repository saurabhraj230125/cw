"use server";

import { cookies } from "next/headers";
import { createClient } from "../../lib/supabase/server";

// ==========================================
// 1. FETCH EXAM SECURELY (Hide Correct Answers)
// ==========================================
export async function fetchLiveExamForStudent(testId: string) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("erp_student_session")?.value;
  if (!studentId) throw new Error("UNAUTHORIZED");

  const supabase = await createClient();

  // Get Test Details
  const { data: test } = await supabase.from("batch_tests").select("*").eq("id", testId).single();
  if (!test || !test.is_live) throw new Error("Exam is not currently live.");

  // Get Questions BUT explicitly exclude the correct answers so kids can't hack it
  const { data: questions } = await supabase
    .from("test_questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, marks_positive, marks_negative")
    .eq("test_id", testId)
    .order("created_at", { ascending: true });

  return { test, questions: questions || [] };
}

// ==========================================
// 2. THE SECURE AUTO-GRADER
// ==========================================
export async function submitStudentExamAction(testId: string, studentAnswers: Record<string, string>) {
  const cookieStore = await cookies();
  const studentId = cookieStore.get("erp_student_session")?.value;
  if (!studentId) throw new Error("UNAUTHORIZED");

  const supabase = await createClient();

  // Fetch the SECRET answer key from the database
  const { data: answerKey } = await supabase
    .from("test_questions")
    .select("id, correct_option, marks_positive, marks_negative")
    .eq("test_id", testId);

  if (!answerKey) throw new Error("Critical Error: Answer key missing.");

  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let attemptedCount = 0;

  // Grade the test question by question
  answerKey.forEach((q) => {
    const studentChoice = studentAnswers[q.id];
    
    if (studentChoice) {
      attemptedCount++;
      if (studentChoice === q.correct_option) {
        score += q.marks_positive;
        correctCount++;
      } else {
        score -= q.marks_negative; // Subtract negative marks
        wrongCount++;
      }
    }
  });

  // Save the final result permanently
  const { error } = await supabase.from("student_test_attempts").insert([{
    student_id: studentId,
    test_id: testId,
    answers_submitted: studentAnswers,
    score: score,
    total_attempted: attemptedCount,
    total_correct: correctCount,
    total_wrong: wrongCount
  }]);

  if (error) throw new Error("Failed to save exam attempt.");

  return { success: true, score };
}