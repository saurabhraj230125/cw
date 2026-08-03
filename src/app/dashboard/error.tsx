"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl border border-destructive/20 bg-background p-8 text-center shadow-soft">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Core dashboard failed to load</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">The control plane hit an unexpected error while loading tenant data. Retry the request after checking the Supabase connection and RLS policies.</p>
        <button onClick={reset} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90">
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    </div>
  );
}