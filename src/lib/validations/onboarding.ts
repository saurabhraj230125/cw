import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Matches standard international/local formats: +91 98765 43210, 044-2435-5555, etc.
const phonePattern = /^[0-9()+\-\s]{7,20}$/;

export const onboardingStepOneSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Institute name must be at least 2 characters.")
    .max(120, "Institute name is too long."),
  slug: z
    .string()
    .trim()
    .min(2, "Workspace slug must be at least 2 characters.")
    .max(48, "Workspace slug is too long.")
    .regex(slugPattern, "Use lowercase letters, numbers, and hyphens only (e.g., apex-tutors)."),
  // Elegant way to handle empty string as optional in React Hook Form
  contact_email: z
    .string()
    .trim()
    .email("Enter a valid contact email address.")
    .optional()
    .or(z.literal("")),
});

export const onboardingStepTwoSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Branch name must be at least 2 characters.")
    .max(120, "Branch name is too long."),
  city: z
    .string()
    .trim()
    .min(2, "City is required.")
    .max(80, "City name is too long."),
  phone: z
    .string()
    .trim()
    .min(7, "Valid phone number is required.")
    .max(20, "Phone number is too long.")
    .regex(phonePattern, "Enter a valid phone number (e.g., +91 98765 43210)."),
});

export const onboardingWizardSchema = z.object({
  institute: onboardingStepOneSchema,
  branch: onboardingStepTwoSchema,
});

// Export strict inferred types for the UI and Server Actions
export type OnboardingWizardData = z.infer<typeof onboardingWizardSchema>;
export type OnboardingStepOneData = z.infer<typeof onboardingStepOneSchema>;
export type OnboardingStepTwoData = z.infer<typeof onboardingStepTwoSchema>;