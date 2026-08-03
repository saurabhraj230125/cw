import { z } from "zod";

const phonePattern = /^[0-9()+\-\s]{7,20}$/;

const statusSchema = z.enum(["active", "archived"]);

const subjectSchema = z.object({
  id: z.string().uuid(),
  branch_id: z.string().uuid(),
  name: z.string().trim().min(2, "Subject name is required.").max(120, "Subject name is too long."),
  monthly_fee: z.number().nonnegative("Monthly fee cannot be negative."),
  status: statusSchema,
});

const enrolledSubjectSchema = z.object({
  subject_id: z.string().uuid(),
  discount_amount: z.number().nonnegative(),
  subject: subjectSchema,
});

const studentSchema = z.object({
  id: z.string().uuid(),
  branch_id: z.string().uuid(),
  roll_number: z.string().trim().min(1),
  full_name: z.string().trim().min(2),
  parent_phone: z.string().trim().regex(phonePattern, "Enter a valid parent phone number."),
  whatsapp_number: z.string().trim().regex(phonePattern, "Enter a valid WhatsApp number."),
  status: statusSchema,
  created_at: z.string(),
  subjects: z.array(enrolledSubjectSchema),
});

export const AddStudentSchema = z.object({
  roll_number: z.string().trim().min(1, "Roll number is required.").max(32, "Roll number is too long."),
  full_name: z.string().trim().min(2, "Full name is required.").max(120, "Full name is too long."),
  parent_phone: z
    .string()
    .trim()
    .min(7, "Parent phone is required.")
    .max(20, "Parent phone is too long.")
    .regex(phonePattern, "Enter a valid parent phone number."),
  whatsapp_number: z
    .string()
    .trim()
    .min(7, "WhatsApp number is required.")
    .max(20, "WhatsApp number is too long.")
    .regex(phonePattern, "Enter a valid WhatsApp number."),
  subject_ids: z.array(z.string().uuid()).min(1, "Select at least one subject."),
}).strict();

export type AddStudentInput = z.infer<typeof AddStudentSchema>;
export type StudentSubjectSelection = z.infer<typeof enrolledSubjectSchema>;
export type SubjectOption = z.infer<typeof subjectSchema>;
export type StudentDirectoryRow = z.infer<typeof studentSchema>;

export type StudentWorkspace = {
  instituteId: string;
  branchId: string;
  branchName: string;
  instituteName: string;
  activeCount: number;
  subjects: SubjectOption[];
  students: StudentDirectoryRow[];
};

export type StudentActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Record<string, string[]>;
};

export const initialStudentActionState: StudentActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};