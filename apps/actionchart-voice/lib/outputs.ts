import type { AuditEntry, FhirDraft } from "@/lib/types";

export function groupDrafts(drafts: FhirDraft[]): {
  tasks: FhirDraft[];
  serviceRequests: FhirDraft[];
} {
  return {
    tasks: drafts.filter((draft) => draft.resourceType === "Task"),
    serviceRequests: drafts.filter(
      (draft) => draft.resourceType === "ServiceRequest",
    ),
  };
}

export function sortedAudit(entries: AuditEntry[]): AuditEntry[] {
  return [...entries].sort(
    (first, second) =>
      new Date(second.timestamp).valueOf() - new Date(first.timestamp).valueOf(),
  );
}

export function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
