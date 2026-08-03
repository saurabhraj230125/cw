"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import {
  type CoreActionState,
  createBranchSchema,
  createInstituteSchema,
  createSessionSchema,
  inviteMemberSchema,
  updateSettingsSchema,
  type CoreDashboardSnapshot,
} from "./types";

function validationState(error: { flatten: () => { fieldErrors: Record<string, string[]> } }, message = "Please fix the highlighted fields."): CoreActionState {
  return {
    status: "error",
    message,
    fieldErrors: error.flatten().fieldErrors,
  };
}

function successState(message: string): CoreActionState {
  return {
    status: "success",
    message,
    fieldErrors: {},
  };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readOptionalText(formData: FormData, key: string) {
  const value = readText(formData, key);
  return value.length > 0 ? value : undefined;
}

function readBoolean(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true";
}

export async function getCoreDashboardSnapshot(): Promise<CoreDashboardSnapshot> {
  const { supabase, user } = await requireUser();

  const { data: membershipRows } = await supabase
    .from("core_memberships")
    .select("institute_id, branch_id, session_id, role_key, status")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(1);

  const activeMembership = membershipRows?.[0] ?? null;

  if (!activeMembership) {
    return {
      institute: null,
      settings: null,
      branches: [],
      sessions: [],
      roles: [],
      memberships: [],
      metrics: {
        institutes: 0,
        branches: 0,
        sessions: 0,
        roles: 0,
        members: 0,
      },
    };
  }

  const instituteId = activeMembership.institute_id;

  const [instituteResult, settingsResult, branchesResult, sessionsResult, rolesResult, membershipsResult] = await Promise.all([
    supabase
      .from("institutes")
      .select("id, institute_id, name, slug, legal_name, plan_tier, status, timezone, brand_color, logo_url, website_url, contact_email, contact_phone, created_at, updated_at")
      .eq("institute_id", instituteId)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("institute_settings")
      .select("id, institute_id, branch_id, session_id, settings, feature_flags, pricing_plan, created_at, updated_at")
      .eq("institute_id", instituteId)
      .is("deleted_at", null)
      .maybeSingle(),
    supabase
      .from("branches")
      .select("id, institute_id, branch_id, name, code, city, status, is_primary, created_at, updated_at")
      .eq("institute_id", instituteId)
      .is("deleted_at", null)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("academic_sessions")
      .select("id, institute_id, branch_id, session_id, label, academic_year, start_date, end_date, status, is_current, created_at, updated_at")
      .eq("institute_id", instituteId)
      .is("deleted_at", null)
      .order("is_current", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("core_roles")
      .select("id, institute_id, branch_id, session_id, role_key, display_name, scope, permissions, is_system, created_at, updated_at")
      .eq("institute_id", instituteId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false }),
    supabase
      .from("core_memberships")
      .select("id, institute_id, branch_id, session_id, user_id, role_key, email, display_name, status, last_active_at, created_at, updated_at")
      .eq("institute_id", instituteId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(12),
  ]);

  return {
    institute: instituteResult.data ?? null,
    settings: settingsResult.data ?? null,
    branches: branchesResult.data ?? [],
    sessions: sessionsResult.data ?? [],
    roles: rolesResult.data ?? [],
    memberships: membershipsResult.data ?? [],
    metrics: {
      institutes: 1,
      branches: branchesResult.data?.length ?? 0,
      sessions: sessionsResult.data?.length ?? 0,
      roles: rolesResult.data?.length ?? 0,
      members: membershipsResult.data?.length ?? 0,
    },
  };
}

export async function createInstituteAction(_previousState: CoreActionState, formData: FormData): Promise<CoreActionState> {
  const parsed = createInstituteSchema.safeParse({
    instituteId: readOptionalText(formData, "institute_id"),
    name: readText(formData, "name"),
    slug: readText(formData, "slug"),
    legalName: readOptionalText(formData, "legal_name"),
    planTier: readText(formData, "plan_tier") || "starter",
    timezone: readText(formData, "timezone") || "Asia/Kolkata",
    brandColor: readText(formData, "brand_color") || "#1353E5",
    contactEmail: readOptionalText(formData, "contact_email"),
    contactPhone: readOptionalText(formData, "contact_phone"),
    status: readText(formData, "status") || "draft",
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const { supabase } = await requireUser();
  const payload = parsed.data;

  const { error } = await supabase.from("institutes").insert({
    institute_id: payload.instituteId,
    name: payload.name,
    slug: payload.slug,
    legal_name: payload.legalName ?? null,
    plan_tier: payload.planTier,
    timezone: payload.timezone,
    brand_color: payload.brandColor,
    contact_email: payload.contactEmail ?? null,
    contact_phone: payload.contactPhone ?? null,
    status: payload.status,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard");
  return successState("Institute created successfully.");
}

export async function createBranchAction(_previousState: CoreActionState, formData: FormData): Promise<CoreActionState> {
  const parsed = createBranchSchema.safeParse({
    instituteId: readText(formData, "institute_id"),
    name: readText(formData, "name"),
    code: readText(formData, "code"),
    city: readText(formData, "city"),
    state: readOptionalText(formData, "state"),
    address: readOptionalText(formData, "address"),
    email: readOptionalText(formData, "email"),
    phone: readOptionalText(formData, "phone"),
    isPrimary: readBoolean(formData, "is_primary"),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const { supabase } = await requireUser();
  const payload = parsed.data;

  const { error } = await supabase.from("branches").insert({
    institute_id: payload.instituteId,
    name: payload.name,
    code: payload.code,
    city: payload.city,
    state: payload.state ?? null,
    address: payload.address ?? null,
    email: payload.email ?? null,
    phone: payload.phone ?? null,
    is_primary: payload.isPrimary,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard");
  return successState("Branch created successfully.");
}

export async function createSessionAction(_previousState: CoreActionState, formData: FormData): Promise<CoreActionState> {
  const parsed = createSessionSchema.safeParse({
    instituteId: readText(formData, "institute_id"),
    branchId: readText(formData, "branch_id"),
    label: readText(formData, "label"),
    academicYear: readText(formData, "academic_year"),
    startDate: readText(formData, "start_date"),
    endDate: readText(formData, "end_date"),
    status: readText(formData, "status") || "planned",
    isCurrent: readBoolean(formData, "is_current"),
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const { supabase } = await requireUser();
  const payload = parsed.data;

  if (payload.isCurrent) {
    const { error: resetError } = await supabase
      .from("academic_sessions")
      .update({ is_current: false })
      .eq("institute_id", payload.instituteId)
      .eq("branch_id", payload.branchId)
      .is("deleted_at", null);

    if (resetError) {
      return {
        status: "error",
        message: resetError.message,
        fieldErrors: {},
      };
    }
  }

  const { error } = await supabase.from("academic_sessions").insert({
    institute_id: payload.instituteId,
    branch_id: payload.branchId,
    label: payload.label,
    academic_year: payload.academicYear,
    start_date: payload.startDate,
    end_date: payload.endDate,
    status: payload.status,
    is_current: payload.isCurrent,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard");
  return successState("Academic session created successfully.");
}

export async function inviteMemberAction(_previousState: CoreActionState, formData: FormData): Promise<CoreActionState> {
  const parsed = inviteMemberSchema.safeParse({
    instituteId: readText(formData, "institute_id"),
    branchId: readOptionalText(formData, "branch_id"),
    sessionId: readOptionalText(formData, "session_id"),
    email: readText(formData, "email"),
    displayName: readOptionalText(formData, "display_name"),
    roleKey: readText(formData, "role_key"),
    status: readText(formData, "status") || "invited",
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const { supabase } = await requireUser();
  const payload = parsed.data;

  const { error } = await supabase.from("core_memberships").insert({
    institute_id: payload.instituteId,
    branch_id: payload.branchId ?? null,
    session_id: payload.sessionId ?? null,
    user_id: null,
    role_key: payload.roleKey,
    email: payload.email,
    display_name: payload.displayName ?? null,
    status: payload.status,
  });

  if (error) {
    return {
      status: "error",
      message: error.message,
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard");
  return successState("Team member invited successfully.");
}

export async function updateInstituteSettingsAction(_previousState: CoreActionState, formData: FormData): Promise<CoreActionState> {
  const parsed = updateSettingsSchema.safeParse({
    instituteId: readText(formData, "institute_id"),
    name: readText(formData, "name"),
    legalName: readOptionalText(formData, "legal_name"),
    brandColor: readText(formData, "brand_color") || "#1353E5",
    websiteUrl: readOptionalText(formData, "website_url"),
    contactEmail: readOptionalText(formData, "contact_email"),
    contactPhone: readOptionalText(formData, "contact_phone"),
    timezone: readText(formData, "timezone") || "Asia/Kolkata",
    planTier: readText(formData, "plan_tier") || "starter",
  });

  if (!parsed.success) {
    return validationState(parsed.error);
  }

  const { supabase } = await requireUser();
  const payload = parsed.data;

  const { error } = await supabase
    .from("institutes")
    .update({
      name: payload.name,
      legal_name: payload.legalName ?? null,
      brand_color: payload.brandColor,
      website_url: payload.websiteUrl ?? null,
      contact_email: payload.contactEmail ?? null,
      contact_phone: payload.contactPhone ?? null,
      timezone: payload.timezone,
      plan_tier: payload.planTier,
    })
    .eq("institute_id", payload.instituteId);

  if (error) {
    return {
      status: "error",
      message: error.message,
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard");
  return successState("Institute settings updated successfully.");
}