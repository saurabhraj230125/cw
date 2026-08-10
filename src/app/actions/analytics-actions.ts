"use server";

import { createClient } from "../../lib/supabase/server";

export async function getMasterAnalytics() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Authentication required.");

  const { data: membership } = await supabase
    .from("core_memberships")
    .select("branch_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) throw new Error("Unauthorized access.");

  const branchId = membership.branch_id;

  // 1. Fetch all raw data simultaneously for maximum speed
  const [studentsRes, testsRes, attemptsRes] = await Promise.all([
    supabase.from("students").select("id, full_name, batch_id").eq("branch_id", branchId),
    supabase.from("batch_tests").select("id, title, total_marks, batch_name, is_live").eq("branch_id", branchId),
    supabase.from("student_test_attempts").select(`
      id, test_id, student_id, score, total_correct, total_wrong, total_attempted,
      students (full_name, batch_id),
      batch_tests (total_marks)
    `)
  ]);

  const students = studentsRes.data || [];
  const tests = testsRes.data || [];
  const attempts = attemptsRes.data || [];

  // ==========================================
  // DATA CRUNCHING ENGINE
  // ==========================================

  // 1. Top Level KPIs
  const totalStudents = students.length;
  const totalExams = tests.length;
  const totalSubmissions = attempts.length;

  let totalQuestionsAttempted = 0;
  let totalQuestionsCorrect = 0;
  
  attempts.forEach(a => {
    totalQuestionsAttempted += a.total_attempted || 0;
    totalQuestionsCorrect += a.total_correct || 0;
  });

  const instituteAccuracy = totalQuestionsAttempted > 0 
    ? Math.round((totalQuestionsCorrect / totalQuestionsAttempted) * 100) 
    : 0;

  // 2. Batch-wise Performance (Native Bar Chart Data)
  const batchStats: Record<string, { totalPercentage: number; count: number }> = {};
  
  attempts.forEach(a => {
    const batchName = a.students?.batch_id || "Unassigned";
    const maxMarks = a.batch_tests?.total_marks || 1; // Prevent divide by zero
    const percentage = (Math.max(0, a.score) / maxMarks) * 100; // Cap floor at 0%

    if (!batchStats[batchName]) batchStats[batchName] = { totalPercentage: 0, count: 0 };
    batchStats[batchName].totalPercentage += percentage;
    batchStats[batchName].count += 1;
  });

  const batchPerformance = Object.keys(batchStats).map(batchName => ({
    name: batchName,
    avgPercentage: Math.round(batchStats[batchName].totalPercentage / batchStats[batchName].count)
  })).sort((a, b) => b.avgPercentage - a.avgPercentage); // Sort highest to lowest

  // 3. Institute Toppers (Aggregate across all tests)
  const studentStats: Record<string, { name: string; batch: string; totalScore: number; examsTaken: number }> = {};
  
  attempts.forEach(a => {
    const sId = a.student_id;
    if (!studentStats[sId]) {
      studentStats[sId] = { 
        name: a.students?.full_name || "Unknown", 
        batch: a.students?.batch_id || "Unassigned", 
        totalScore: 0, 
        examsTaken: 0 
      };
    }
    studentStats[sId].totalScore += a.score;
    studentStats[sId].examsTaken += 1;
  });

  const topStudents = Object.values(studentStats)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5); // Get Top 5

  return {
    kpis: { totalStudents, totalExams, totalSubmissions, instituteAccuracy },
    batchPerformance,
    topStudents,
    recentAttempts: attempts.slice(-5).reverse() // Last 5 submissions
  };
}