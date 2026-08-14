"use client";

/**
 * DashboardTour.tsx — Lightweight Custom Tour Engine v4
 *
 * Key Design Decisions:
 *  - ZERO overlay / dark shade. Dashboard stays 100% visible and interactive.
 *  - react-joyride dropped. Pure React + getBoundingClientRect() tooltip engine.
 *  - Highlights target with a non-blocking box-shadow ring (pointer-events: none).
 *  - Instant state transitions — no async lag.
 *  - One-time via localStorage "cw_tour_completed".
 *  - Exports `resetTour()` so any button can restart the guide.
 */

import {
  useEffect,
  useState,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Rocket,
  Sparkles,
  BookMarked,
  Layers,
  Users,
  CalendarCheck,
  Wallet,
} from "lucide-react";

// ── localStorage key ──────────────────────────────────────────
const LS_DONE = "cw_tour_completed";

/** Call this from any button to restart the tour */
export function resetTour() {
  localStorage.removeItem(LS_DONE);
  // Emit a custom event so the mounted tour component picks it up
  window.dispatchEvent(new CustomEvent("cw:restart-tour"));
}

// ── Step Definitions ──────────────────────────────────────────
type Placement = "right" | "bottom" | "left" | "top" | "center";

interface TourStep {
  target: string | "body";
  title: string;
  content: string;
  placement: Placement;
  icon: React.ElementType;
  accent: string;
}

const STEPS: TourStep[] = [
  {
    target: "body",
    title: "Welcome to CoachingWala! 👋",
    content:
      "This is your institute's command center. Let us take you on a 30-second tour of the 5 most important modules you'll use every day.",
    placement: "center",
    icon: Sparkles,
    accent: "#f59e0b",
  },
  {
    target: "#tour-courses",
    title: "Step 1 · Courses Master",
    content:
      "Start here. Define the courses or subjects you teach — JEE Main, NEET Biology, Class 12 Maths. Everything else links back to these.",
    placement: "right",
    icon: BookMarked,
    accent: "#0055a5",
  },
  {
    target: "#tour-batches",
    title: "Step 2 · Batches Master",
    content:
      "Create operational batches, set timings, control strength, and assign courses. Every student will be enrolled in one of these.",
    placement: "right",
    icon: Layers,
    accent: "#7c3aed",
  },
  {
    target: "#tour-students",
    title: "Step 3 · Student Records",
    content:
      "Your complete Student CRM. Take new admissions, track fee ledgers, view parent details, attendance history, and academic profiles.",
    placement: "right",
    icon: Users,
    accent: "#0891b2",
  },
  {
    target: "#tour-attendance",
    title: "Step 4 · Daily Attendance",
    content:
      "Mark Present / Absent / Late / Leave for every student in seconds. SMS alerts fire automatically to parents of absentees.",
    placement: "right",
    icon: CalendarCheck,
    accent: "#16a34a",
  },
  {
    target: "#tour-fees",
    title: "Step 5 · Fee Management",
    content:
      "Track collections, view pending dues, collect installments, and generate beautiful printable receipts — all from one screen.",
    placement: "right",
    icon: Wallet,
    accent: "#dc2626",
  },
];

const TOTAL = STEPS.length;

// ── Tooltip position calculator ───────────────────────────────
interface Coords {
  top: number;
  left: number;
  transformOrigin: string;
}

function calcPosition(el: Element | null, placement: Placement, tooltipW: number, tooltipH: number): Coords {
  if (!el || placement === "center") {
    return {
      top: window.innerHeight / 2 - tooltipH / 2,
      left: window.innerWidth / 2 - tooltipW / 2,
      transformOrigin: "center center",
    };
  }

  const rect = el.getBoundingClientRect();
  const GAP = 18;

  switch (placement) {
    case "right":
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2,
        left: rect.right + GAP,
        transformOrigin: "left center",
      };
    case "left":
      return {
        top: rect.top + rect.height / 2 - tooltipH / 2,
        left: rect.left - tooltipW - GAP,
        transformOrigin: "right center",
      };
    case "bottom":
      return {
        top: rect.bottom + GAP,
        left: rect.left + rect.width / 2 - tooltipW / 2,
        transformOrigin: "top center",
      };
    case "top":
      return {
        top: rect.top - tooltipH - GAP,
        left: rect.left + rect.width / 2 - tooltipW / 2,
        transformOrigin: "bottom center",
      };
    default:
      return { top: 200, left: 200, transformOrigin: "center center" };
  }
}

// ── Spotlight Ring ─────────────────────────────────────────────
// A non-blocking ::after-style ring rendered over the target element.
function SpotlightRing({ target }: { target: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useLayoutEffect(() => {
    if (target === "body") { setRect(null); return; }
    const el = document.querySelector(target);
    if (!el) { setRect(null); return; }

    const update = () => setRect(el.getBoundingClientRect());
    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [target]);

  if (!rect) return null;

  const PAD = 6;
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
        borderRadius: "10px",
        boxShadow: "0 0 0 3px #0055a5, 0 0 0 7px rgba(0,85,165,0.18)",
        pointerEvents: "none",
        zIndex: 9998,
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
      }}
    />
  );
}

// ── Main Tooltip Card ─────────────────────────────────────────
function TooltipCard({
  step,
  stepIdx,
  onNext,
  onPrev,
  onClose,
}: {
  step: TourStep;
  stepIdx: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<Coords>({ top: -9999, left: -9999, transformOrigin: "center" });
  const [visible, setVisible] = useState(false);

  // Reposition whenever step changes
  useLayoutEffect(() => {
    setVisible(false);
    const TOOLTIP_W = 340;
    const TOOLTIP_H = 220;

    const position = () => {
      const el = step.target === "body" ? null : document.querySelector(step.target);
      const pos = calcPosition(el, step.placement, TOOLTIP_W, TOOLTIP_H);

      // Clamp to viewport
      const maxLeft = window.innerWidth - TOOLTIP_W - 12;
      const maxTop = window.innerHeight - TOOLTIP_H - 12;
      pos.left = Math.max(12, Math.min(pos.left, maxLeft));
      pos.top = Math.max(12, Math.min(pos.top, maxTop));

      setCoords(pos);
      setVisible(true);
    };

    // Wait one tick for DOM to settle
    const t = requestAnimationFrame(position);
    return () => cancelAnimationFrame(t);
  }, [step]);

  const StepIcon = step.icon;
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === TOTAL - 1;

  return (
    <div
      ref={cardRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        zIndex: 9999,
        width: 340,
        transformOrigin: coords.transformOrigin,
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.92)",
        transition: "opacity 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        pointerEvents: "auto",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="px-5 py-4 flex items-start justify-between gap-3"
          style={{ background: `linear-gradient(135deg, #002855 0%, #0055a5 100%)` }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <StepIcon className="w-4.5 h-4.5 w-[18px] h-[18px]" style={{ color: step.accent === "#0055a5" ? "#93c5fd" : "#fde68a" }} />
            </div>
            <div className="min-w-0">
              <p className="text-white/55 text-[9px] font-black uppercase tracking-[0.14em] leading-none mb-1">
                {stepIdx + 1} of {TOTAL}
              </p>
              <h3 className="text-white font-black text-[13.5px] leading-snug">
                {step.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors shrink-0 mt-0.5 rounded-lg p-1 hover:bg-white/10"
            title="Close tour"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-5 py-4">
          <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
            {step.content}
          </p>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-4 pt-0 flex items-center justify-between gap-2">
          {/* Progress dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span
                key={i}
                className="inline-block rounded-full transition-all duration-300"
                style={{
                  width: i === stepIdx ? 16 : 6,
                  height: 6,
                  backgroundColor: i <= stepIdx ? "#0055a5" : "#e2e8f0",
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <button
                onClick={onPrev}
                className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            )}

            {!isLast && (
              <button
                onClick={onClose}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                Skip
              </button>
            )}

            <button
              onClick={isLast ? onClose : onNext}
              className="flex items-center gap-1.5 text-white text-[12px] font-black px-4 py-2 rounded-xl transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #0055a5, #0077cc)", boxShadow: "0 2px 8px rgba(0,85,165,0.35)" }}
            >
              {isLast ? (
                <>
                  <Rocket className="w-3.5 h-3.5" />
                  {"Let's Go!"}
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Export ────────────────────────────────────────────────
export default function DashboardTour() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);

  // Hydration guard + auto-start for first-time users
  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem(LS_DONE)) {
      const t = setTimeout(() => {
        setStepIdx(0);
        setActive(true);
      }, 700);
      return () => clearTimeout(t);
    }
  }, []);

  // Listen for external restart signal
  useEffect(() => {
    const handler = () => {
      setStepIdx(0);
      setActive(true);
    };
    window.addEventListener("cw:restart-tour", handler);
    return () => window.removeEventListener("cw:restart-tour", handler);
  }, []);

  const close = useCallback(() => {
    setActive(false);
    localStorage.setItem(LS_DONE, "true");
  }, []);

  const next = useCallback(() => {
    setStepIdx((i) => {
      const n = i + 1;
      if (n >= TOTAL) {
        close();
        return i;
      }
      return n;
    });
  }, [close]);

  const prev = useCallback(() => {
    setStepIdx((i) => Math.max(0, i - 1));
  }, []);

  if (!mounted || !active) return null;

  const step = STEPS[stepIdx];
  if (!step) return null;

  return (
    <>
      <SpotlightRing target={step.target} />
      <TooltipCard
        step={step}
        stepIdx={stepIdx}
        onNext={next}
        onPrev={prev}
        onClose={close}
      />
    </>
  );
}
