import type { SavedReviewState } from "@/lib/types";

const STORAGE_PREFIX = "actionchart-review-v1";

export function loadReviewState(patientId: string): SavedReviewState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey(patientId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedReviewState>;
    if (
      parsed.version !== 1 ||
      parsed.patientId !== patientId ||
      !Array.isArray(parsed.actions) ||
      !Array.isArray(parsed.audit)
    ) {
      return null;
    }
    return parsed as SavedReviewState;
  } catch {
    return null;
  }
}

export function saveReviewState(state: SavedReviewState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey(state.patientId), JSON.stringify(state));
  } catch {
    // Replay mode stays usable when storage is unavailable.
  }
}

export function resetReviewState(patientId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(storageKey(patientId));
  } catch {
    // Reset still succeeds in memory when storage is unavailable.
  }
}

function storageKey(patientId: string): string {
  return `${STORAGE_PREFIX}:${patientId}`;
}
