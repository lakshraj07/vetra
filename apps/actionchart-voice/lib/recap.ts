import type { PatientCase, ReviewAction } from "@/lib/types";

export type PatientRecap = {
  greeting: string;
  intro: string;
  items: Array<{ summary: string; timing: string }>;
  closing: string;
};

export function recapEligibleActions(actions: ReviewAction[]): ReviewAction[] {
  return actions.filter(
    (action) => action.status === "approved" && action.patientVisible === true,
  );
}

export function buildPatientRecap(
  patient: PatientCase,
  actions: ReviewAction[],
): PatientRecap {
  const eligible = recapEligibleActions(actions);
  return {
    greeting: `Hi ${patient.givenName},`,
    intro: eligible.length
      ? "Here is the follow-up plan your care team reviewed with you."
      : "Your care team is still reviewing the follow-up plan from this visit.",
    items: eligible.map((action) => ({
      summary: action.summary,
      timing: action.dueWindow,
    })),
    closing: eligible.length
      ? "Contact the clinic if your symptoms change or you have questions."
      : "The clinic will share the next steps after review.",
  };
}

export function recapAsText(recap: PatientRecap): string {
  const items = recap.items.map(
    (item, index) => `${index + 1}. ${item.summary} (${item.timing})`,
  );
  return [recap.greeting, recap.intro, ...items, recap.closing].join("\n");
}
