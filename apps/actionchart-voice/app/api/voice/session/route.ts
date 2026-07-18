import { NextResponse } from "next/server";
import { validateVoiceSessionInput } from "@/lib/voice-contract";

const MAX_REQUEST_BYTES = 16_000;

export async function POST(request: Request): Promise<NextResponse> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { code: "invalid_content_type", message: "Use application/json." },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json(
      { code: "request_too_large", message: "Voice event exceeds 16 KB." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "invalid_json", message: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const result = validateVoiceSessionInput(body);
  if (!result.ok) {
    return NextResponse.json(
      { code: "invalid_event", message: result.error },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      code: "config_required",
      message: "The voice event contract is ready. Add Vapi credentials to enable live sessions.",
      accepted: {
        patientId: result.value.patientId,
        sessionId: result.value.sessionId,
        status: result.value.status,
      },
    },
    { status: 501 },
  );
}
