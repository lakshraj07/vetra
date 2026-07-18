import type {
  FhirDraft,
  PatientCase,
  ReviewAction,
  ServiceRequestDraft,
  TaskDraft,
} from "@/lib/types";

export function buildFhirDrafts(
  patient: PatientCase,
  actions: ReviewAction[],
): FhirDraft[] {
  const drafts: FhirDraft[] = [];
  for (const action of actions) {
    if (action.status !== "approved" || !isValidAction(action)) continue;
    drafts.push(
      action.fhirTarget === "ServiceRequest"
        ? buildServiceRequest(patient, action)
        : buildTask(patient, action),
    );
  }
  return drafts;
}

function buildTask(patient: PatientCase, action: ReviewAction): TaskDraft {
  return {
    resourceType: "Task",
    id: `draft-${action.id}`,
    status: "draft",
    intent: "proposal",
    priority: action.priority,
    description: action.summary,
    for: { reference: patient.patientReference, display: patient.fullName },
    encounter: { reference: patient.encounterReference },
    authoredOn: action.reviewedAt ?? patient.encounterDate,
    owner: { display: action.owner },
    note: [evidenceNote(action)],
  };
}

function buildServiceRequest(
  patient: PatientCase,
  action: ReviewAction,
): ServiceRequestDraft {
  return {
    resourceType: "ServiceRequest",
    id: `draft-${action.id}`,
    status: "draft",
    intent: "proposal",
    priority: action.priority,
    code: { text: action.summary },
    subject: { reference: patient.patientReference, display: patient.fullName },
    encounter: { reference: patient.encounterReference },
    authoredOn: action.reviewedAt ?? patient.encounterDate,
    requester: { display: patient.clinician },
    note: [evidenceNote(action)],
  };
}

function evidenceNote(action: ReviewAction): { text: string } {
  return {
    text: `Proposed from synthetic encounter evidence: ${action.evidence.note}`.slice(0, 500),
  };
}

function isValidAction(action: ReviewAction): boolean {
  return Boolean(action.summary.trim() && action.owner.trim() && action.dueWindow.trim());
}
