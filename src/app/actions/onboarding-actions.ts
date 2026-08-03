"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { createClient } from "../../lib/supabase/server";
import { onboardingWizardSchema, type OnboardingWizardData } from "../../lib/validations/onboarding";

export type OnboardingActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  redirectTo: string | null;
  fieldErrors: Record<string, string[]>;
};

// FIX 1: Removed 'export' from this constant to prevent Next.js "use server" crash.
// Note: If your UI component needs this, declare it directly inside the UI component file instead!
const initialOnboardingActionState: OnboardingActionState = {
  status: "idle",
  message: null,
  redirectTo: null,
  fieldErrors: {},
};

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function fieldErrorsFromZod(error: ZodError) {
  return error.issues.reduce<Record<string, string[]>>((accumulator, issue) => {
    const key = issue.path.join(".");
    accumulator[key] = [...(accumulator[key] ?? []), issue.message];
    return accumulator;
  }, {});
}

function parseWizardFormData(formData: FormData): OnboardingWizardData {
  return onboardingWizardSchema.parse({
    institute: {
      name: getFormValue(formData, "institute.name"),
      slug: slugify(getFormValue(formData, "institute.slug")),
      contact_email: getFormValue(formData, "institute.contact_email"),
    },
    branch: {
      name: getFormValue(formData, "branch.name"),
      city: getFormValue(formData, "branch.city"),
      phone: getFormValue(formData, "branch.phone"),
    },
  });
}

export async function setupNewTenant(data: OnboardingWizardData): Promise<OnboardingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return {
      status: "error",
      message: "Please sign in again to finish onboarding.",
      redirectTo: null,
      fieldErrors: {},
    };
  }

  const instituteId = crypto.randomUUID();
  const branchId = crypto.randomUUID();
  const displayEmail = data.institute.contact_email ?? user.email ?? null;

  // FIX 2: Updated column from 'institute_id' to 'id' to match the new SQL schema
  const { error: instituteError } = await supabase.from("institutes").insert({
    id: instituteId, 
    name: data.institute.name,
    slug: data.institute.slug,
    contact_email: data.institute.contact_email ?? null,
    plan_tier: "starter",
    status: "active",
  });

  if (instituteError) {
    return {
      status: "error",
      message: instituteError.message,
      redirectTo: null,
      fieldErrors: {},
    };
  }

  // FIX 3: Updated column from 'branch_id' to 'id' and added the required 'code' field
  const { error: branchError } = await supabase.from("branches").insert({
    id: branchId,
    institute_id: instituteId, // Links back to the institute we just created
    name: data.branch.name,
    code: slugify(data.branch.name).substring(0, 10).toUpperCase(), // Auto-generate a branch code
    city: data.branch.city,
    phone: data.branch.phone,
    is_primary: true,
    status: "active",
  });

  if (branchError) {
    return {
      status: "error",
      message: branchError.message,
      redirectTo: null,
      fieldErrors: {},
    };
  }

  const { error: membershipError } = await supabase.from("core_memberships").insert({
    institute_id: instituteId,
    branch_id: branchId,
    user_id: user.id,
    role_key: "owner",
    email: displayEmail,
    display_name: user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Owner",
    status: "active",
  });

  if (membershipError) {
    return {
      status: "error",
      message: membershipError.message,
      redirectTo: null,
      fieldErrors: {},
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboarding");

  return {
    status: "success",
    message: "Tenant created successfully.",
    redirectTo: "/dashboard",
    fieldErrors: {},
  };
}

export async function setupNewTenantAction(_previousState: OnboardingActionState, formData: FormData): Promise<OnboardingActionState> {
  try {
    return await setupNewTenant(parseWizardFormData(formData));
  } catch (error) {
    // 🔍 ADD THIS LINE TO DEBUG IN YOUR TERMINAL
    console.log("SERVER ZOD ERROR:", error);

    if (error instanceof ZodError) {
      return {
        status: "error",
        message: "Please fix the highlighted fields.",
        redirectTo: null,
        fieldErrors: fieldErrorsFromZod(error),
      };
    }

    return {
      status: "error",
      message: error instanceof Error ? error.message : "Unable to complete onboarding.",
      redirectTo: null,
      fieldErrors: {},
    };
  }
}