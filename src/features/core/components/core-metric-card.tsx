"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/utils";

type CoreMetricCardProps = {
  title: string;
  value: string;
  caption: string;
  icon: LucideIcon;
  tone?: "accent" | "success" | "primary" | "amber";
};

const toneStyles: Record<NonNullable<CoreMetricCardProps["tone"]>, string> = {
  accent: "bg-accent/10 text-accent border-accent/15",
  success: "bg-success/10 text-success border-success/15",
  primary: "bg-primary/10 text-primary border-primary/15",
  amber: "bg-amber-500/10 text-amber-600 border-amber-500/20",
};

export function CoreMetricCard({ title, value, caption, icon: Icon, tone = "accent" }: CoreMetricCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-2xl border border-border bg-background p-5 shadow-soft"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl border", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-primary">{value}</div>
      <p className="mt-2 text-sm text-muted-foreground">{caption}</p>
    </motion.article>
  );
}