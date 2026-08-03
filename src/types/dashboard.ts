// src/types/dashboard.ts

export type SubscriptionTier = 'STARTER' | 'GROWTH' | 'PRO';

export interface DashboardContext {
  tier: SubscriptionTier;
  isWorkspaceEmpty: boolean;
  user: {
    displayName: string;
    role: string;
  };
  metrics: {
    activeStudents: number;
    todayCollections: number;
    pendingTasks: number;
    liveClasses: number;
  };
}