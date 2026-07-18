import type { TranscriptSpeaker } from "@/lib/types";

export type VoiceSessionInput = {
  patientId: string;
  sessionId: string;
  status: "started" | "transcript" | "ended";
  transcript?: {
    speaker: TranscriptSpeaker;
    text: string;
    sequence: number;
    isFinal: boolean;
  };
};

export type ValidationResult =
  | { ok: true; value: VoiceSessionInput }
  | { ok: false; error: string };

const statuses = new Set(["started", "transcript", "ended"]);
const speakers = new Set(["patient", "clinician"]);
const MAX_TRANSCRIPT_LENGTH = 8_000;

export function validateVoiceSessionInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const value = input as Record<string, unknown>;
  if (!isShortString(value.patientId, 160) || !isShortString(value.sessionId, 160)) {
    return { ok: false, error: "patientId and sessionId are required." };
  }
  if (typeof value.status !== "string" || !statuses.has(value.status)) {
    return { ok: false, error: "status must be started, transcript, or ended." };
  }

  if (value.status === "transcript") {
    if (!value.transcript || typeof value.transcript !== "object") {
      return { ok: false, error: "Transcript events require a transcript object." };
    }
    const transcript = value.transcript as Record<string, unknown>;
    if (typeof transcript.speaker !== "string" || !speakers.has(transcript.speaker)) {
      return { ok: false, error: "Transcript speaker must be patient or clinician." };
    }
    if (!isShortString(transcript.text, MAX_TRANSCRIPT_LENGTH)) {
      return { ok: false, error: "Transcript text is required and must be under 8,000 characters." };
    }
    if (!Number.isInteger(transcript.sequence) || Number(transcript.sequence) < 0) {
      return { ok: false, error: "Transcript sequence must be a non-negative integer." };
    }
    if (typeof transcript.isFinal !== "boolean") {
      return { ok: false, error: "Transcript isFinal must be a boolean." };
    }
  }

  return { ok: true, value: input as VoiceSessionInput };
}

function isShortString(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}
