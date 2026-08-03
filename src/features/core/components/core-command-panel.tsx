"use client";

import { useActionState, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Plus, Users, CalendarDays, BadgeCheck, ShieldCheck } from "lucide-react";
import { createBranchAction, createSessionAction, inviteMemberAction } from "../actions";
import { initialCoreActionState, type CoreActionState, type CoreRoleRow } from "../types";

type CoreCommandPanelProps = {
  instituteId: string;
  branches: Array<{ branch_id: string; name: string; code: string }>;
  roles: CoreRoleRow[];
  defaultBranchId?: string;
};

function ActionFeedback({ state }: { state: CoreActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${state.status === "error" ? "border-destructive/20 bg-destructive/5 text-destructive" : "border-success/20 bg-success/5 text-success"}`}>
      {state.message}
    </div>
  );
}

export function CoreCommandPanel({ instituteId, branches, roles, defaultBranchId }: CoreCommandPanelProps) {
  const [branchState, branchAction, branchPending] = useActionState(createBranchAction, initialCoreActionState);
  const [sessionState, sessionAction, sessionPending] = useActionState(createSessionAction, initialCoreActionState);
  const [inviteState, inviteAction, invitePending] = useActionState(inviteMemberAction, initialCoreActionState);
  const [branchId, setBranchId] = useState(defaultBranchId ?? branches[0]?.branch_id ?? "");

  useEffect(() => {
    setBranchId(defaultBranchId ?? branches[0]?.branch_id ?? "");
  }, [defaultBranchId, branches]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4 rounded-3xl border border-border bg-background p-5 shadow-soft"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">Global Actions</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-primary">Control Center</h2>
        </div>
        <div className="rounded-full border border-accent/15 bg-accent/5 px-3 py-1 text-xs font-semibold text-accent">Secure by RLS</div>
      </div>

      <div className="space-y-4">
        <form action={branchAction} className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <input type="hidden" name="institute_id" value={instituteId} />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Building2 className="h-4 w-4 text-accent" />
            Create Branch
          </div>
          <div className="grid gap-3">
            <input name="name" placeholder="Branch name" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
            <div className="grid grid-cols-2 gap-3">
              <input name="code" placeholder="Code" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
              <input name="city" placeholder="City" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
            </div>
            <button disabled={branchPending} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60">
              <Plus className="h-4 w-4" />
              {branchPending ? "Creating..." : "Add Branch"}
            </button>
            <ActionFeedback state={branchState} />
          </div>
        </form>

        <form action={sessionAction} className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <input type="hidden" name="institute_id" value={instituteId} />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <CalendarDays className="h-4 w-4 text-accent" />
            Open Academic Session
          </div>
          <div className="grid gap-3">
            <input name="label" placeholder="Session label" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
            <div className="grid grid-cols-2 gap-3">
              <input name="academic_year" placeholder="Academic year" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
              <select name="branch_id" value={branchId} onChange={(event) => setBranchId(event.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent">
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" name="start_date" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
              <input type="date" name="end_date" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
            </div>
            <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium text-primary">
              <input type="checkbox" name="is_current" className="h-4 w-4 rounded border-border text-accent focus:ring-accent" />
              Mark as current session
            </label>
            <input type="hidden" name="status" value="active" />
            <button disabled={sessionPending} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
              <BadgeCheck className="h-4 w-4" />
              {sessionPending ? "Opening..." : "Create Session"}
            </button>
            <ActionFeedback state={sessionState} />
          </div>
        </form>

        <form action={inviteAction} className="space-y-3 rounded-2xl border border-border bg-muted/20 p-4">
          <input type="hidden" name="institute_id" value={instituteId} />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Users className="h-4 w-4 text-accent" />
            Invite Team Member
          </div>
          <div className="grid gap-3">
            <input name="display_name" placeholder="Display name" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
            <input name="email" type="email" placeholder="name@institute.com" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent" />
            <div className="grid grid-cols-2 gap-3">
              <select name="role_key" defaultValue={roles[0]?.role_key ?? "viewer"} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <option key={role.id} value={role.role_key}>
                      {role.display_name}
                    </option>
                  ))
                ) : (
                  <option value="viewer">Viewer</option>
                )}
              </select>
              <select name="branch_id" value={branchId} onChange={(event) => setBranchId(event.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent">
                <option value="">Institute wide</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <input type="hidden" name="status" value="invited" />
            <button disabled={invitePending} type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
              <ShieldCheck className="h-4 w-4" />
              {invitePending ? "Sending..." : "Invite Member"}
            </button>
            <ActionFeedback state={inviteState} />
          </div>
        </form>
      </div>
    </motion.aside>
  );
}