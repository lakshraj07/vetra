import type { FrontDeskCallLog, PatientCase, TriageLevel } from "@/lib/types";

export function buildFrontDeskCallLog(patient: PatientCase): FrontDeskCallLog {
  const urgency = classifyTriageLevel(patient);
  const isAli = patient.givenName === "Ali" && /migraine/i.test(patient.visitTitle);
  const route = routeFor(urgency);

  return {
    id: `CALL-${patient.encounterId.slice(0, 8).toUpperCase()}`,
    channel: "Voice",
    caller: patient.fullName,
    patientId: patient.patientId,
    patientMatched: true,
    reason: isAli
      ? "Annual physical, migraine check-in, and help getting to care"
      : sentenceCase(patient.visitTitle.replace(/[—-]/g, ":")),
    reportedConcerns: isAli
      ? ["Stable migraine pattern", "Transportation barrier", "Preventive follow-up overdue"]
      : patient.planSections.slice(0, 3).map((section) => section.heading),
    urgency,
    urgencyLabel: urgencyLabel(urgency),
    urgencyRationale: isAli
      ? "Returning patient reports the same migraine pattern and no new neurologic warning signs. Route for routine clinician review."
      : rationaleFor(urgency),
    route,
    owner: urgency === "emergency" ? "Clinical triage team" : "Front desk",
    nextStep: isAli
      ? "Book primary-care visit and flag transportation support for the care coordinator"
      : nextStepFor(urgency),
    callbackState: urgency === "emergency" ? "Warm transfer" : "Resolved on call",
    reviewRequired: true,
    sourceNote:
      "Synthetic demo call log derived from the supplied encounter context. Triage routes care and does not diagnose.",
  };
}

function classifyTriageLevel(patient: PatientCase): TriageLevel {
  const visit = `${patient.visitType} ${patient.visitTitle}`.toLowerCase();
  if (/emergency|critical|life-threatening/.test(visit)) return "emergency";
  if (/hospital admission|isolation/.test(visit)) return "urgent";
  if (/hospice|prenatal/.test(visit)) return "clinical_review";
  return "routine";
}

function routeFor(urgency: TriageLevel): string {
  const routes: Record<TriageLevel, string> = {
    emergency: "Immediate clinical escalation",
    urgent: "Same-day clinical review",
    clinical_review: "Clinician review queue",
    routine: "Primary care scheduling",
  };
  return routes[urgency];
}

function nextStepFor(urgency: TriageLevel): string {
  const steps: Record<TriageLevel, string> = {
    emergency: "Keep caller connected and begin a warm clinical handoff",
    urgent: "Request same-day review and confirm the callback channel",
    clinical_review: "Send structured context to a clinician before scheduling",
    routine: "Book the suitable visit and confirm the follow-up channel",
  };
  return steps[urgency];
}

function urgencyLabel(urgency: TriageLevel): string {
  if (urgency === "clinical_review") return "Clinical review";
  return sentenceCase(urgency);
}

function rationaleFor(urgency: TriageLevel): string {
  const rationale: Record<TriageLevel, string> = {
    emergency: "The source encounter indicates an emergency pathway. Human clinical authority remains required.",
    urgent: "The source encounter indicates a time-sensitive pathway that should reach the clinical team today.",
    clinical_review: "The request needs clinician context before the front desk chooses a final scheduling path.",
    routine: "The source encounter does not indicate an emergency disposition. Route through standard scheduling with review.",
  };
  return rationale[urgency];
}

function sentenceCase(value: string): string {
  const trimmed = value.trim();
  return trimmed ? `${trimmed[0].toUpperCase()}${trimmed.slice(1)}` : "Reason not recorded";
}
