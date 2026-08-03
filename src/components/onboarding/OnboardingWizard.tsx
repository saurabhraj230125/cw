"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { setupNewTenantAction, type OnboardingActionState } from "../../app/actions/onboarding-actions";
import { onboardingWizardSchema, type OnboardingWizardData } from "../../lib/validations/onboarding";

// FIX: Define the initial state directly in the client component
const initialOnboardingActionState: OnboardingActionState = {
  status: "idle",
  message: null,
  redirectTo: null,
  fieldErrors: {},
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

function StepPill({ active, done, label, index }: { active: boolean; done: boolean; label: string; index: number }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${active || done ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-400"}`}>
        {done ? <CheckCircle2 className="h-4 w-4" /> : index}
      </div>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${active || done ? "text-slate-900" : "text-slate-400"}`}>{label}</p>
      </div>
    </div>
  );
}

function ErrorBanner({ state }: { state: OnboardingActionState }) {
  if (state.status !== "error" || !state.message) {
    return null;
  }

  return <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>;
}

export function OnboardingWizard() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const slugLockedRef = useRef(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [serverState, formAction, isPending] = useActionState(setupNewTenantAction, initialOnboardingActionState);

  const {
    register,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingWizardData>({
    resolver: zodResolver(onboardingWizardSchema),
    mode: "onChange",
    defaultValues: {
      institute: {
        name: "",
        slug: "",
        contact_email: "",
      },
      branch: {
        name: "",
        city: "",
        phone: "",
      },
    },
  });

  const instituteName = watch("institute.name");

  useEffect(() => {
    if (!slugLockedRef.current && instituteName) {
      setValue("institute.slug", slugify(instituteName), { shouldValidate: true, shouldDirty: true });
    }
  }, [instituteName, setValue]);

  useEffect(() => {
    if (serverState.status === "success" && serverState.redirectTo) {
      router.replace(serverState.redirectTo);
    }
  }, [router, serverState]);

  const handleContinue = async () => {
    const valid = await trigger(["institute.name", "institute.slug", "institute.contact_email"]);
    if (valid) {
      setStep(2);
    }
  };

  const handleSlugChange = (value: string) => {
    slugLockedRef.current = true;
    setValue("institute.slug", slugify(value), { shouldValidate: true, shouldDirty: true });
  };

  return (
    <main className="min-h-screen bg-[#FCFDFF] text-slate-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <aside className="space-y-6">
            <div className="rounded-[16px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                  <span className="text-sm font-bold tracking-tight">CW</span>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Tenant Setup</p>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your workspace</h1>
                </div>
              </div>

              <p className="mt-6 max-w-md text-sm leading-6 text-slate-600">
                One onboarding pass creates the institute, its first branch, and the owner membership. No spreadsheets, no duplicate setup, no dead ends.
              </p>

              <div className="mt-8 grid gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-slate-900" />
                    <p className="text-sm font-medium text-slate-900">RLS-ready tenant creation</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-5 w-5 text-slate-900" />
                    <p className="text-sm font-medium text-slate-900">Stripe-like step flow</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.28)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">What gets created</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>Institute record with slug and contact email</li>
                <li>Primary branch with city and phone</li>
                <li>Owner membership tied to your auth user</li>
              </ul>
            </div>
          </aside>

          <section className="rounded-[16px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.32)] sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Onboarding</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Set up your tenant</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">Two field groups. One clean launch path.</p>
              </div>
              <div className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500">Step {step} of 2</div>
            </div>

            <div className="mt-8 flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <StepPill index={1} label="Institute" active={step === 1} done={step > 1} />
              <StepPill index={2} label="Branch" active={step === 2} done={false} />
            </div>

            <ErrorBanner state={serverState} />

            {/* 🔥 FIXED FORM TAG: Added onSubmit handler and hidden inputs for Step 1 data */}
            <form 
              ref={formRef} 
              action={formAction} 
              className="mt-8 space-y-6"
              onSubmit={(e) => {
                if (step === 1) {
                  e.preventDefault();
                  handleContinue();
                }
              }}
            >
              {step === 2 && (
                <>
                  <input type="hidden" name="institute.name" value={watch("institute.name")} />
                  <input type="hidden" name="institute.slug" value={watch("institute.slug")} />
                  <input type="hidden" name="institute.contact_email" value={watch("institute.contact_email") || ""} />
                </>
              )}

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="step-one"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Institute name</label>
                      <input
                        {...register("institute.name", {
                          onChange: (event) => {
                            if (!slugLockedRef.current) {
                              setValue("institute.slug", slugify(event.target.value), { shouldValidate: true, shouldDirty: true });
                            }
                          },
                        })}
                        placeholder="Apex Tutorials"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                      />
                      <FieldError message={errors.institute?.name?.message} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Workspace slug</label>
                      <input
                        {...register("institute.slug", {
                          onChange: (event) => handleSlugChange(event.target.value),
                        })}
                        placeholder="apex-tutorials"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                      />
                      <FieldError message={errors.institute?.slug?.message} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Contact email</label>
                      <input
                        {...register("institute.contact_email")}
                        placeholder="director@apex.in"
                        type="email"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                      />
                      <FieldError message={errors.institute?.contact_email?.message} />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleContinue}
                        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step-two"
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Primary branch name</label>
                      <input
                        {...register("branch.name")}
                        placeholder="Main Campus"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                      />
                      <FieldError message={errors.branch?.name?.message} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">City</label>
                      <input
                        {...register("branch.city")}
                        placeholder="Mumbai"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                      />
                      <FieldError message={errors.branch?.city?.message} />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-900">Branch phone</label>
                      <input
                        {...register("branch.phone")}
                        placeholder="+91 98765 43210"
                        type="tel"
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
                      />
                      <FieldError message={errors.branch?.phone?.message} />
                    </div>

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                      </button>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isPending ? (
                          <>
                            Creating workspace
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            Finish setup
                            <CheckCircle2 className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}