import type {
  FhirTarget,
  PatientCase,
  PlanSection,
  ProposedAction,
  TranscriptTurn,
} from "@/lib/types";

const completedPatterns = [
  /\bcompleted\b/i,
  /\badministered\b/i,
  /\bscreening.+reassuring\b/i,
  /\bassessment.+completed\b/i,
  /\bchart list updated\b/i,
];

const servicePatterns =
  /\b(referral|refer|lab|panel|test|screen|imaging|x-ray|ultrasound|therapy|consult|evaluation|clinic)\b/i;
const sensitivePatterns =
  /\b(abuse|afraid|rape|suicid|self-harm|violence|safety at home|domestic|drug abuse|overdose|depress|partner)\b/i;

export function extractActions(patient: PatientCase): ProposedAction[] {
  const candidates = patient.planSections.flatMap((section) =>
    section.bullets
      .filter((bullet) => !completedPatterns.some((pattern) => pattern.test(bullet)))
      .map((bullet, index) => createAction(patient, section, bullet, index)),
  );

  return candidates.slice(0, 8);
}

function createAction(
  patient: PatientCase,
  section: PlanSection,
  bullet: string,
  index: number,
): ProposedAction {
  const summary = actionSummary(bullet);
  const sensitive = sensitivePatterns.test(`${section.heading} ${bullet}`);
  const transcript = bestTranscriptEvidence(patient.transcript, bullet, section.heading);
  const fhirTarget: FhirTarget = servicePatterns.test(bullet)
    ? "ServiceRequest"
    : "Task";

  return {
    id: stableId(`${patient.encounterId}-${section.heading}-${index}-${bullet}`),
    section: section.heading,
    summary,
    originalSummary: bullet.replace(/[.;]+$/, ""),
    owner: suggestedOwner(bullet),
    dueWindow: suggestedDueWindow(bullet),
    priority: /\b(urgent|immediate|today|emergency|safety)\b/i.test(bullet)
      ? "urgent"
      : "routine",
    patientVisible: !sensitive,
    sensitive,
    fhirTarget,
    confidence: transcript ? transcript.confidence : 0.72,
    evidence: {
      note: bullet,
      transcript: transcript?.turn.text ?? null,
      transcriptTurnId: transcript?.turn.id ?? null,
    },
  };
}

function actionSummary(value: string): string {
  const clean = value.replace(/[.;]+$/, "").trim();
  const rewrites: Array<[RegExp, string]> = [
    [/patient referral for dental care placed.*/i, "Schedule sliding-scale dental care"],
    [/daily flossing and twice-daily brushing.*/i, "Follow daily dental care plan"],
    [/keep a simple headache log.*/i, "Start a simple headache log"],
    [/care coordinator outreach this week.*/i, "Care coordinator outreach this week"],
    [/enrollment in medical ride-service.*/i, "Enroll in the medical ride service"],
    [/lifestyle counseling.+repeat lipid panel.*/i, "Repeat lipid panel after lifestyle follow-up"],
    [/return visit in one year.*/i, "Schedule the next annual visit"],
  ];
  for (const [pattern, replacement] of rewrites) {
    if (pattern.test(clean)) return replacement;
  }
  return clean.length > 120 ? `${clean.slice(0, 117).trim()}...` : clean;
}

function suggestedOwner(value: string): string {
  if (/\b(coordinator|ride|transport|outreach|social)\b/i.test(value)) return "Care coordinator";
  if (/\b(referral|dental|specialist|consult)\b/i.test(value)) return "Referral team";
  if (/\b(lab|panel|sample|imaging|x-ray|test)\b/i.test(value)) return "Clinical staff";
  if (/\b(medication|prescription|dose|pharmacy)\b/i.test(value)) return "Clinician";
  if (/\b(return|follow-up|schedule|visit)\b/i.test(value)) return "Front desk";
  return "Patient and care team";
}

function suggestedDueWindow(value: string): string {
  if (/\bthis week\b/i.test(value)) return "This week";
  if (/\btoday\b/i.test(value)) return "Today";
  if (/\bdaily\b|twice-daily/i.test(value)) return "Daily";
  if (/\bone year\b|annual/i.test(value)) return "12 months";
  if (/\breturn precautions\b|as needed/i.test(value)) return "As needed";
  return "Within 2 weeks";
}

function bestTranscriptEvidence(
  turns: TranscriptTurn[],
  bullet: string,
  heading: string,
): { turn: TranscriptTurn; confidence: number } | null {
  const sourceTerms = terms(`${heading} ${bullet}`);
  let best: { turn: TranscriptTurn; score: number } | null = null;
  for (const turn of turns) {
    const turnTerms = new Set(terms(turn.text));
    const matches = sourceTerms.filter((term) => turnTerms.has(term)).length;
    const score = sourceTerms.length ? matches / Math.min(sourceTerms.length, 10) : 0;
    if (!best || score > best.score) best = { turn, score };
  }
  if (!best || best.score < 0.09) return null;
  return {
    turn: best.turn,
    confidence: Math.min(0.98, Math.max(0.78, 0.76 + best.score)),
  };
}

function terms(value: string): string[] {
  const stop = new Set([
    "the", "and", "for", "with", "this", "that", "from", "patient", "care",
    "reviewed", "completed", "today", "will", "was", "were", "has", "have",
  ]);
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((term) => term.length > 3 && !stop.has(term));
}

function stableId(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `action-${(hash >>> 0).toString(36)}`;
}
