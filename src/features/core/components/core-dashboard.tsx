"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, CalendarDays, Command, Layers3, Search, Shield, Users } from "lucide-react";
import Link from "next/link";
import { CoreMetricCard } from "./core-metric-card";
import { CoreEmptyState } from "./core-empty-state";
import { CoreCommandPanel } from "./core-command-panel";
import type { CoreDashboardSnapshot } from "../types";

type CoreDashboardProps = {
  data: CoreDashboardSnapshot;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function CoreDashboard({ data }: CoreDashboardProps) {
  const [search, setSearch] = useState("");
  const [activeBranchId, setActiveBranchId] = useState(data.branches[0]?.branch_id ?? "");

  const institute = data.institute;
  const visibleBranches = data.branches.filter((branch) => {
    const haystack = `${branch.name} ${branch.code} ${branch.city}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const visibleSessions = data.sessions.filter((session) => {
    const haystack = `${session.label} ${session.academic_year} ${session.status}`.toLowerCase();
    const branchMatch = activeBranchId ? session.branch_id === activeBranchId : true;
    return haystack.includes(search.toLowerCase()) && branchMatch;
  });

  const visibleMembers = data.memberships.filter((member) => {
    const haystack = `${member.display_name ?? ""} ${member.email} ${member.role_key}`.toLowerCase();
    const branchMatch = activeBranchId ? (member.branch_id ?? "") === activeBranchId || member.branch_id === null : true;
    return haystack.includes(search.toLowerCase()) && branchMatch;
  });

  const activeBranch = data.branches.find((branch) => branch.branch_id === activeBranchId) ?? data.branches[0] ?? null;

  if (!institute) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Core Control Plane</p>
          <h1 className="text-4xl font-semibold tracking-tight text-primary">No institute workspace linked</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">This account is authenticated, but it is not yet attached to an institute record. Seed an owner membership after onboarding, then return here to manage branches, sessions, and permissions.</p>
        </header>

        <CoreEmptyState
          title="Finish onboarding to unlock the control plane"
          description="Create the first institute record, assign an owner membership, and the core dashboard will start showing branches, academic sessions, and RBAC data in one place."
          primaryHref="/onboarding"
          primaryLabel="Complete Onboarding"
          secondaryHref="/login"
          secondaryLabel="Switch Account"
        />
      </div>
    );
  }

  const branchCount = data.metrics.branches;
  const sessionCount = data.metrics.sessions;
  const memberCount = data.metrics.members;

  return (
    <div className="space-y-8 pb-12">
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-accent/15 bg-accent/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-accent">Core</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">{institute.plan_tier.toUpperCase()} PLAN</span>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">{institute.timezone}</span>
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-primary">{institute.name}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">A tenancy-first command center for branches, sessions, and secure access. Every change is scoped to the institute and protected by row-level security.</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/dashboard/settings" className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-primary transition hover:bg-muted">
              <Command className="h-4 w-4" />
              Workspace Settings
            </Link>
            <Link href="/dashboard/students" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
              <Layers3 className="h-4 w-4" />
              Open Student Workflow
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <CoreMetricCard title="Branches" value={String(branchCount)} caption="Live operating locations" icon={Building2} tone="accent" />
          <CoreMetricCard title="Academic Sessions" value={String(sessionCount)} caption="Planned and active cycles" icon={CalendarDays} tone="primary" />
          <CoreMetricCard title="Team Members" value={String(memberCount)} caption="Owners, staff, and faculty" icon={Users} tone="success" />
          <CoreMetricCard title="Security" value="RLS" caption="Policy-gated by membership" icon={Shield} tone="amber" />
        </div>
      </motion.section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-background p-5 shadow-soft">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-primary">Search & Scope</h2>
                <p className="mt-1 text-sm text-muted-foreground">Filter the command plane by branch, session, or role assignment.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search branches, sessions, members" className="w-full rounded-xl border border-border bg-muted/30 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-accent" />
                </div>
                <select value={activeBranchId} onChange={(event) => setActiveBranchId(event.target.value)} className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-accent">
                  <option value="">All branches</option>
                  {data.branches.map((branch) => (
                    <option key={branch.branch_id} value={branch.branch_id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-background shadow-soft">
            <div className="border-b border-border px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight text-primary">Branch Network</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Branch operating context and local admin readiness.</p>
                </div>
                <div className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">{visibleBranches.length} shown</div>
              </div>
            </div>
            {visibleBranches.length > 0 ? (
              <div className="divide-y divide-border">
                {visibleBranches.map((branch) => (
                  <article key={branch.id} className={`flex flex-col gap-4 px-5 py-4 transition hover:bg-muted/30 sm:flex-row sm:items-center sm:justify-between ${activeBranchId === branch.branch_id ? "bg-accent/5" : ""}`}>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold tracking-tight text-primary">{branch.name}</h3>
                        {branch.is_primary ? <span className="rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">Primary</span> : null}
                      </div>
                      <p className="text-sm text-muted-foreground">{branch.code} · {branch.city}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className={`rounded-full px-2.5 py-1 ${branch.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{branch.status}</span>
                      <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{formatDate(branch.created_at)}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-5">
                <CoreEmptyState
                  title="No branches match the current filter"
                  description="Clear the search term or switch to another branch scope to reveal the operational records for this institute."
                  primaryHref="/dashboard"
                  primaryLabel="Reset View"
                />
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-border bg-background shadow-soft">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-lg font-semibold tracking-tight text-primary">Academic Sessions</h2>
                <p className="mt-1 text-sm text-muted-foreground">The active and upcoming planning windows.</p>
              </div>
              {visibleSessions.length > 0 ? (
                <div className="divide-y divide-border">
                  {visibleSessions.map((session) => {
                    const branchName = data.branches.find((branch) => branch.branch_id === session.branch_id)?.name ?? activeBranch?.name ?? "Branch";
                    return (
                      <div key={session.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold tracking-tight text-primary">{session.label}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{session.academic_year} · {branchName}</p>
                          </div>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${session.is_current ? "bg-primary text-primary-foreground" : session.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                            {session.is_current ? "Current" : session.status}
                          </span>
                        </div>
                        <p className="mt-3 text-xs text-muted-foreground">{formatDate(session.start_date)} → {formatDate(session.end_date)}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5">
                  <CoreEmptyState
                    title="No sessions to show"
                    description="Create a new academic session from the control panel to begin tracking batches, attendance, and revenue against the current cycle."
                    primaryHref="/dashboard/settings"
                    primaryLabel="Open Workspace Settings"
                  />
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-border bg-background shadow-soft">
              <div className="border-b border-border px-5 py-4">
                <h2 className="text-lg font-semibold tracking-tight text-primary">Team Access</h2>
                <p className="mt-1 text-sm text-muted-foreground">Who can touch the workspace, and at what scope.</p>
              </div>
              {visibleMembers.length > 0 ? (
                <div className="divide-y divide-border">
                  {visibleMembers.map((member) => (
                    <div key={member.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold tracking-tight text-primary">{member.display_name ?? member.email}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{member.email}</p>
                        </div>
                        <span className="rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">{member.role_key}</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className={`rounded-full px-2.5 py-1 ${member.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{member.status}</span>
                        <span className="rounded-full border border-border px-2.5 py-1 text-muted-foreground">{member.branch_id ? "Scoped branch" : "Institute wide"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-5">
                  <CoreEmptyState
                    title="No team members in scope"
                    description="Invite an owner, manager, or faculty member from the action panel to seed the RBAC graph for this institute."
                    primaryHref="/dashboard/settings"
                    primaryLabel="Open Workspace Settings"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <CoreCommandPanel instituteId={institute.institute_id} branches={data.branches} roles={data.roles} defaultBranchId={activeBranchId || data.branches[0]?.branch_id} />
      </section>

      <section className="rounded-3xl border border-border bg-background p-5 shadow-soft">
        <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-primary">Pricing & Policy Snapshot</h2>
            <p className="mt-1 text-sm text-muted-foreground">Feature flag state lives in data, not hardcoded UI.</p>
          </div>
          <div className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">{data.settings?.pricing_plan ?? institute.plan_tier}</div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Brand Color</p>
            <p className="mt-2 text-sm font-semibold text-primary">{institute.brand_color}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Current Branch</p>
            <p className="mt-2 text-sm font-semibold text-primary">{activeBranch?.name ?? "All branches"}</p>
          </div>
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Security Posture</p>
            <p className="mt-2 text-sm font-semibold text-primary">RLS policies and audit events enabled</p>
          </div>
        </div>
      </section>

      {!data.branches.length && !data.sessions.length && !data.memberships.length ? (
        <CoreEmptyState
          title="Workspace is structurally empty"
          description="The tables are connected, but there are no branches, sessions, or memberships yet. Seed the first branch and owner membership from the action panel to unlock the core workflow."
          primaryHref="/dashboard/settings"
          primaryLabel="Open Settings"
          secondaryHref="/onboarding"
          secondaryLabel="Review Onboarding"
        />
      ) : null}
    </div>
  );
}