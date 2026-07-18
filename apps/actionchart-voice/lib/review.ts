import type {
  AuditEntry,
  ProposedAction,
  ReviewAction,
  ReviewStatus,
  SavedReviewState,
} from "@/lib/types";

export type ReviewUpdates = Partial<
  Pick<ReviewAction, "summary" | "owner" | "dueWindow" | "patientVisible" | "priority">
>;

export function createReviewState(
  patientId: string,
  actions: ProposedAction[],
): SavedReviewState {
  return {
    version: 1,
    patientId,
    actions: actions.map((action) => ({
      ...action,
      status: "pending",
      reviewedAt: null,
    })),
    audit: [],
  };
}

export function updateAction(
  state: SavedReviewState,
  actionId: string,
  updates: ReviewUpdates,
): SavedReviewState {
  return {
    ...state,
    actions: state.actions.map((action) =>
      action.id === actionId ? { ...action, ...sanitizeUpdates(updates) } : action,
    ),
  };
}

export function transitionAction(
  state: SavedReviewState,
  actionId: string,
  to: ReviewStatus,
  actor = "Reviewing clinician",
  now = new Date().toISOString(),
): SavedReviewState {
  const current = state.actions.find((action) => action.id === actionId);
  if (!current || current.status === to) return state;

  const event = statusEvent(to, current.summary);
  const entry: AuditEntry = {
    id: `${actionId}-${now}-${to}`,
    actionId,
    actionSummary: current.summary,
    event,
    from: current.status,
    to,
    actor,
    timestamp: now,
  };

  return {
    ...state,
    actions: state.actions.map((action) =>
      action.id === actionId
        ? { ...action, status: to, reviewedAt: now }
        : action,
    ),
    audit: [entry, ...state.audit],
  };
}

export function reviewProgress(state: SavedReviewState): {
  reviewed: number;
  total: number;
  approved: number;
} {
  return {
    reviewed: state.actions.filter((action) => action.status !== "pending").length,
    total: state.actions.length,
    approved: state.actions.filter((action) => action.status === "approved").length,
  };
}

function statusEvent(status: ReviewStatus, summary: string): string {
  const verbs: Record<ReviewStatus, string> = {
    pending: "Returned to review",
    approved: "Approved",
    deferred: "Deferred",
    rejected: "Rejected",
  };
  return `${verbs[status]}: ${summary}`;
}

function sanitizeUpdates(updates: ReviewUpdates): ReviewUpdates {
  const cleaned = { ...updates };
  if (typeof cleaned.summary === "string") cleaned.summary = cleaned.summary.trim().slice(0, 240);
  if (typeof cleaned.owner === "string") cleaned.owner = cleaned.owner.trim().slice(0, 80);
  if (typeof cleaned.dueWindow === "string") cleaned.dueWindow = cleaned.dueWindow.trim().slice(0, 80);
  return cleaned;
}
