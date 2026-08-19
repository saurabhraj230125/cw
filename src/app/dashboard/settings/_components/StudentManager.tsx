"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Users, Plus, Loader2, Search, MoreVertical } from "lucide-react";

type Student = {
  id: string;
  full_name: string;
  phone_number: string;
  course: string;
  status: string;
  enrollment_date: string;
};

export default function StudentManager({ membershipId, initialStudents }: { membershipId: string, initialStudents: Student[] }) {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({ full_name: "", phone_number: "", course: "JEE Foundation" });

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Insert into database
      const { data, error } = await supabase
        .from('students')
        .insert({
          institute_id: membershipId,
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          course: formData.course,
          status: 'Active'
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Update local state instantly
      setStudents([data, ...students]);
      setIsAdding(false);
      setFormData({ full_name: "", phone_number: "", course: "JEE Foundation" });

      // 3. 🚨 Force the server to re-fetch so the Settings Meter updates!
      router.refresh();

    } catch (error: any) {
      alert("Failed to add student: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredStudents = students.filter(s => s.full_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      
      {/* TOOLBAR */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0055a5]/10 focus:border-[#0055a5] outline-none transition-all"
          />
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0055a5] hover:bg-[#004080] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* ADD STUDENT FORM (DROPDOWN) */}
      {isAdding && (
        <div className="p-6 border-b border-slate-100 bg-blue-50/30">
          <form onSubmit={handleAddStudent} className="max-w-3xl flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
              <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0055a5]" placeholder="Rahul Kumar" />
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Phone Number</label>
              <input required type="text" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0055a5]" placeholder="+91 9876543210" />
            </div>
            <div className="w-full">
              <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1.5">Course / Batch</label>
              <select value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0055a5]">
                <option value="JEE Foundation">JEE Foundation</option>
                <option value="NEET Target">NEET Target</option>
                <option value="Class 12 Boards">Class 12 Boards</option>
              </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-[#0055a5] text-white text-sm font-bold rounded-lg shadow-sm w-full sm:w-auto min-w-[100px] flex justify-center">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STUDENTS TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Student Name</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Enrollment Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="font-bold text-slate-700">No students found.</p>
                  <p className="text-sm mt-1">Click "Add Student" to enroll your first student.</p>
                </td>
              </tr>
            ) : (
              filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{student.full_name}</td>
                  <td className="px-6 py-4 font-mono text-slate-600 text-xs">{student.phone_number}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium text-[13px]">{student.course}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-[10px] font-black px-2.5 py-1 rounded-md uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                    {new Date(student.enrollment_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}