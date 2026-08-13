"use client";

/**
 * DashboardTour.tsx — User-Driven State Machine v2
 *
 * Architecture: "Listen & React"
 *  - NO programmatic router.push() from the Next button.
 *  - spotlightClicks: true → the user clicks the ACTUAL UI elements.
 *  - Tour advances by:
 *    a) Route change (usePathname) for sidebar-nav steps.
 *    b) DOM click detection (addEventListener) for button steps.
 *  - DOM polling (setInterval) guards every step transition so we
 *    never spotlight an element that hasn't rendered yet.
 *  - localStorage key `cw_tour_step` persists progress across refreshes.
 *  - localStorage key `cw_tour_completed` permanently dismisses the tour (strictly one-time).
 */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { X, Rocket, MousePointerClick } from "lucide-react";

// SSR-safe Joyride import (prevents Next.js hydration errors)
const Joyride = dynamic<any>(
  () =>
    (import("react-joyride") as Promise<any>).then(
      (mod) => mod.default || mod.Joyride
    ),
  { ssr: false }
);

// Tour Step Definitions
type TourStep = {
  target: string;
  title: string;
  content: string;
  placement: string;
  listenRoute?: string;
  listenClick?: boolean;
  disableBeacon: boolean;
};

const TOUR_STEPS: TourStep[] = [
  {
    target: ".tour-courses",
    title: "1 of 7 · Courses Master",
    content: "Let's start by clicking Courses Master in the sidebar.",
    placement: "right",
    listenRoute: "/dashboard/courses",
    disableBeacon: true,
  },
  {
    target: ".tour-add-course",
    title: "2 of 7 · Create a Course",
    content: "Great! Now click here to create your first course.",
    placement: "bottom",
    listenClick: true,
    disableBeacon: true,
  },
  {
    target: ".tour-batches",
    title: "3 of 7 · Batches Master",
    content: "Course created! Next, click Batches Master in the sidebar.",
    placement: "right",
    listenRoute: "/dashboard/batches",
    disableBeacon: true,
  },
  {
    target: ".tour-add-batch",
    title: "4 of 7 · Schedule a Batch",
    content: "Click here to schedule a batch for your course.",
    placement: "bottom",
    listenClick: true,
    disableBeacon: true,
  },
  {
    target: ".tour-enquiry",
    title: "5 of 7 · New Enquiry",
    content: "Got a walk-in? Click New Enquiry to capture leads.",
    placement: "bottom",
    listenClick: true,
    disableBeacon: true,
  },
  {
    target: ".tour-students",
    title: "6 of 7 · Student Records",
    content: "Finally, let's admit a student. Click Student Records.",
    placement: "right",
    listenRoute: "/dashboard/students",
    disableBeacon: true,
  },
  {
    target: ".tour-add-student",
    title: "7 of 7 · Official Admission",
    content: "Click here to process an official admission. You're done!",
    placement: "bottom",
    listenClick: true,
    disableBeacon: true,
  },
];

const TOTAL = TOUR_STEPS.length;
const LS_STEP = "cw_tour_step";
// Strictly one-time key — once set to "true", the tour NEVER runs again.
const LS_DONE = "cw_tour_completed";

// Custom Tooltip — no Next button, user MUST click the spotlight
const CustomTooltip = ({
  step,
  closeProps,
  index,
}: {
  step: any;
  closeProps: any;
  index: number;
}) => {
  return (
    <div
      style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] w-[320px] overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-300"
    >
      <div className="bg-gradient-to-r from-[#003366] to-[#0055a5] px-4 py-3 flex justify-between items-center text-white">
        <h3 className="font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
          <Rocket className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          {step.title}
        </h3>
        <button
          {...closeProps}
          className="text-white/60 hover:text-white transition-colors ml-2 shrink-0"
          title="Skip tour"
        >
          <X className="w-3.5 h-3.5" strokeWidth={3} />
        </button>
      </div>

      <div className="px-4 py-4">
        <p className="text-[13px] font-semibold text-slate-600 leading-relaxed">
          {step.content}
        </p>
      </div>

      <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i < index
                  ? "w-3 bg-[#0055a5]"
                  : i === index
                  ? "w-4 bg-[#0055a5]"
                  : "w-1.5 bg-slate-200"
              }`}
            />
          ))}
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
          <MousePointerClick className="w-3.5 h-3.5 shrink-0" />
          Click the highlight
        </span>
      </div>
    </div>
  );
};

// Main Component
export default function DashboardTour() {
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [run, setRun] = useState(false);

  const stepRef = useRef(stepIndex);
  stepRef.current = stepIndex;
  const isDoneRef = useRef(false);

  // 1. Hydration guard + restore persisted progress
  useEffect(() => {
    setIsMounted(true);

    if (localStorage.getItem(LS_DONE)) {
      isDoneRef.current = true;
      return;
    }

    const saved = localStorage.getItem(LS_STEP);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed < TOTAL) {
        setStepIndex(parsed);
        stepRef.current = parsed;
      }
    }
  }, []);

  // 2. DOM polling: wait until target element exists, then show tour
  useEffect(() => {
    if (!isMounted || isDoneRef.current) return;

    setRun(false);

    const step = TOUR_STEPS[stepIndex];
    if (!step) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const check = (): boolean => {
      const el = document.querySelector(step.target);
      if (el) {
        const style = window.getComputedStyle(el);
        if (style.display !== "none" && style.visibility !== "hidden") {
          setRun(true);
          return true;
        }
      }
      return false;
    };

    if (check()) return;

    intervalId = setInterval(() => {
      if (check() && intervalId) clearInterval(intervalId);
    }, 250);

    timeoutId = setTimeout(() => {
      if (intervalId) clearInterval(intervalId);
    }, 15_000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [stepIndex, isMounted]);

  // 3. Route listener: advance when pathname matches the expected route
  useEffect(() => {
    if (!isMounted || isDoneRef.current) return;

    const step = TOUR_STEPS[stepRef.current];
    if (!step?.listenRoute) return;

    if (pathname === step.listenRoute) {
      advance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMounted]);

  // 4. Click listener: advance when the user clicks the target element
  useEffect(() => {
    if (!isMounted || isDoneRef.current) return;

    const step = TOUR_STEPS[stepIndex];
    if (!step?.listenClick) return;
    if (!run) return;

    const el = document.querySelector(step.target);
    if (!el) return;

    const handleClick = () => {
      setTimeout(() => advance(), 100);
    };

    el.addEventListener("click", handleClick, { once: true });

    return () => {
      el.removeEventListener("click", handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, stepIndex, isMounted]);

  // 5. Advance helper
  const advance = () => {
    const next = stepRef.current + 1;

    if (next >= TOTAL) {
      completeTour();
      return;
    }

    localStorage.setItem(LS_STEP, next.toString());
    setRun(false);
    setStepIndex(next);
    stepRef.current = next;
  };

  // 6. Complete / Dismiss
  const completeTour = () => {
    isDoneRef.current = true;
    setRun(false);
    localStorage.setItem(LS_DONE, "true");
    localStorage.removeItem(LS_STEP);
  };

  // 7. Joyride callback (handles close/skip only)
  const handleCallback = (data: any) => {
    const { action, status } = data;
    if (
      action === "close" ||
      action === "skip" ||
      status === "skipped" ||
      status === "finished"
    ) {
      completeTour();
    }
  };

  // 8. Guard renders
  if (!isMounted || isDoneRef.current) return null;

  const activeStepDef = TOUR_STEPS[stepIndex];
  if (!activeStepDef) return null;

  const joyrideSteps = [
    {
      target: activeStepDef.target,
      title: activeStepDef.title,
      content: activeStepDef.content,
      placement: activeStepDef.placement as any,
      // Hardcoded — never let Joyride default this to false
      disableBeacon: true as const,
      stepIndex,
    },
  ];

  return (
    <Joyride
      key={stepIndex}
      run={run}
      steps={joyrideSteps}
      stepIndex={0}
      continuous={false}
      spotlightClicks={true}
      disableOverlayClose={true}
      disableScrolling={false}
      scrollToFirstStep={false}
      tooltipComponent={(props: any) => (
        <CustomTooltip {...props} index={stepIndex} />
      )}
      callback={handleCallback}
      styles={{
        options: {
          overlayColor: "rgba(10, 20, 40, 0.75)",
          zIndex: 10000,
        },
      }}
    />
  );
}

