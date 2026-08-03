import { z } from "zod";

export const corePlanTierSchema = z.enum(["starter", "growth", "pro"]);
export const coreScopeSchema = z.enum(["institute", "branch", "session"]);
export const coreRoleKeySchema = z.enum([
  "owner",
  "admin",
  "academic_head",
  "branch_manager",
  "finance_lead",
  "teacher",
  "counsellor",
  "viewer",
]);

export const coreInstituteSchema = z.object({
  instituteId: z.string().uuid(),
  name: z.string().min(2, "Institute name is required."),
  slug: z.string().min(2, "Workspace slug is required.").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  legalName: z.string().min(2).optional(),
  planTier: corePlanTierSchema,
  timezone: z.string().min(3),
  brandColor: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Use a valid hex color."),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(6).optional(),
  status: z.enum(["draft", "active", "paused", "archived"]),
});

export const createInstituteSchema = coreInstituteSchema.extend({
  instituteId: z.string().uuid().optional(),
});

export const createBranchSchema = z.object({
  instituteId: z.string().uuid(),
  name: z.string().min(2, "Branch name is required."),
  code: z.string().min(2, "Branch code is required."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2).optional(),
  address: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(6).optional(),
  isPrimary: z.boolean().default(false),
});

export const createSessionSchema = z.object({
  instituteId: z.string().uuid(),
  branchId: z.string().uuid(),
  label: z.string().min(2, "Session label is required."),
  academicYear: z.string().min(4, "Academic year is required."),
  startDate: z
    .string()
    .min(1, "Start date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Use a valid start date."),
  endDate: z
    .string()
    .min(1, "End date is required.")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Use a valid end date."),
  status: z.enum(["planned", "active", "completed", "archived"]),
  isCurrent: z.boolean().default(false),
});

export const inviteMemberSchema = z.object({
  instituteId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  sessionId: z.string().uuid().optional(),
  email: z.string().email("Use a valid email address."),
  displayName: z.string().min(2).optional(),
  roleKey: coreRoleKeySchema,
  status: z.enum(["invited", "active", "suspended"]).default("invited"),
});

export const updateSettingsSchema = z.object({
  instituteId: z.string().uuid(),
  name: z.string().min(2),
  legalName: z.string().min(2).optional(),
  brandColor: z.string().regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i),
  websiteUrl: z.string().url().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(6).optional(),
  timezone: z.string().min(3),
  planTier: corePlanTierSchema,
});

export type CoreActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  fieldErrors: Record<string, string[]>;
};

export const initialCoreActionState: CoreActionState = {
  status: "idle",
  message: null,
  fieldErrors: {},
};

export type CoreInstituteRow = {
  id: string;
  institute_id: string;
  name: string;
  slug: string;
  legal_name: string | null;
  plan_tier: z.infer<typeof corePlanTierSchema>;
  status: "draft" | "active" | "paused" | "archived";
  timezone: string;
  brand_color: string;
  logo_url: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  created_at: string;
  updated_at: string;
};

export type CoreBranchRow = {
  id: string;
  institute_id: string;
  branch_id: string;
  name: string;
  code: string;
  city: string;
  status: "draft" | "active" | "paused" | "archived";
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type CoreSessionRow = {
  id: string;
  institute_id: string;
  branch_id: string;
  session_id: string;
  label: string;
  academic_year: string;
  start_date: string;
  end_date: string;
  status: "planned" | "active" | "completed" | "archived";
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

export type CoreRoleRow = {
  id: string;
  institute_id: string;
  branch_id: string | null;
  session_id: string | null;
  role_key: z.infer<typeof coreRoleKeySchema>;
  display_name: string;
  scope: z.infer<typeof coreScopeSchema>;
  permissions: unknown[];
  is_system: boolean;
  created_at: string;
  updated_at: string;
};

export type CoreMembershipRow = {
  id: string;
  institute_id: string;
  branch_id: string | null;
  session_id: string | null;
  user_id: string | null;
  role_key: z.infer<typeof coreRoleKeySchema>;
  email: string;
  display_name: string | null;
  status: "invited" | "active" | "suspended";
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CoreSettingsRow = {
  id: string;
  institute_id: string;
  branch_id: string | null;
  session_id: string | null;
  settings: Record<string, unknown>;
  feature_flags: Record<string, unknown>;
  pricing_plan: z.infer<typeof corePlanTierSchema>;
  created_at: string;
  updated_at: string;
};

export type CoreDashboardSnapshot = {
  institute: CoreInstituteRow | null;
  settings: CoreSettingsRow | null;
  branches: CoreBranchRow[];
  sessions: CoreSessionRow[];
  roles: CoreRoleRow[];
  memberships: CoreMembershipRow[];
  metrics: {
    institutes: number;
    branches: number;
    sessions: number;
    roles: number;
    members: number;
  };
};