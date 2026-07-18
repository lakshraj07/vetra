export type TranscriptSpeaker = "patient" | "clinician";

export type TranscriptTurn = {
  id: string;
  speaker: TranscriptSpeaker;
  text: string;
};

export type SoapSections = {
  subjective: string;
  objective: string;
  plan: string;
};

export type PlanSection = {
  heading: string;
  context: string;
  bullets: string[];
};

export type PatientCase = {
  id: string;
  patientId: string;
  patientReference: string;
  encounterId: string;
  encounterReference: string;
  fullName: string;
  givenName: string;
  familyName: string;
  birthDate: string;
  age: number | null;
  gender: string;
  location: string;
  language: string;
  encounterDate: string;
  visitTitle: string;
  visitType: string;
  encounterStatus: string;
  clinician: string;
  conditions: string[];
  medications: string[];
  longitudinalCounts: Record<string, number>;
  encounterCounts: Record<string, number>;
  transcript: TranscriptTurn[];
  soap: SoapSections;
  planSections: PlanSection[];
  afterVisitSummary: string;
  source: {
    system: string;
    synthetic: boolean;
    documentStatus: string;
  };
};

export type FhirTarget = "Task" | "ServiceRequest";
export type ReviewStatus = "pending" | "approved" | "deferred" | "rejected";
export type ActionPriority = "routine" | "urgent";
export type TriageLevel = "routine" | "urgent" | "emergency" | "clinical_review";

export type FrontDeskCallLog = {
  id: string;
  channel: "Voice";
  caller: string;
  patientId: string;
  patientMatched: boolean;
  reason: string;
  reportedConcerns: string[];
  urgency: TriageLevel;
  urgencyLabel: string;
  urgencyRationale: string;
  route: string;
  owner: string;
  nextStep: string;
  callbackState: "Resolved on call" | "Callback required" | "Warm transfer";
  reviewRequired: boolean;
  sourceNote: string;
};

export type Evidence = {
  note: string;
  transcript: string | null;
  transcriptTurnId: string | null;
};

export type ProposedAction = {
  id: string;
  section: string;
  summary: string;
  originalSummary: string;
  owner: string;
  dueWindow: string;
  priority: ActionPriority;
  patientVisible: boolean;
  sensitive: boolean;
  fhirTarget: FhirTarget;
  confidence: number;
  evidence: Evidence;
};

export type ReviewAction = ProposedAction & {
  status: ReviewStatus;
  reviewedAt: string | null;
};

export type AuditEntry = {
  id: string;
  actionId: string;
  actionSummary: string;
  event: string;
  from: ReviewStatus;
  to: ReviewStatus;
  actor: string;
  timestamp: string;
};

export type SavedReviewState = {
  version: 1;
  patientId: string;
  actions: ReviewAction[];
  audit: AuditEntry[];
};

export type TaskDraft = {
  resourceType: "Task";
  id: string;
  status: "draft";
  intent: "proposal";
  priority: "routine" | "urgent";
  description: string;
  for: { reference: string; display: string };
  encounter: { reference: string };
  authoredOn: string;
  owner: { display: string };
  note: { text: string }[];
};

export type ServiceRequestDraft = {
  resourceType: "ServiceRequest";
  id: string;
  status: "draft";
  intent: "proposal";
  priority: "routine" | "urgent";
  code: { text: string };
  subject: { reference: string; display: string };
  encounter: { reference: string };
  authoredOn: string;
  requester: { display: string };
  note: { text: string }[];
};

export type FhirDraft = TaskDraft | ServiceRequestDraft;
