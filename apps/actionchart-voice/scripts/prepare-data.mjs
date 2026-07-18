import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(
  root,
  "data/source/synthetic-ambient-fhir-25.json",
);
const outputPath = resolve(root, "app/data/patients.generated.json");

const source = JSON.parse(await readFile(sourcePath, "utf8"));
if (!Array.isArray(source) || source.length === 0) {
  throw new Error("Synthetic source must be a non-empty JSON array.");
}

const patients = source.map(normalizeRecord);
const ids = new Set(patients.map((patient) => patient.id));
if (ids.size !== patients.length) {
  throw new Error("Synthetic source contains duplicate record IDs.");
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(patients, null, 2)}\n`, "utf8");
console.log(`Prepared ${patients.length} synthetic patient cases.`);

function normalizeRecord(record, index) {
  const patient = record?.patient_context?.patient;
  const metadata = record?.metadata;
  const encounter = record?.encounter_fhir?.encounter;
  if (!record?.id || !patient?.id || !metadata?.encounter_id) {
    throw new Error(`Record ${index + 1} is missing required FHIR references.`);
  }

  const officialName =
    patient.name?.find((name) => name.use === "official") ?? patient.name?.[0] ?? {};
  const given = Array.isArray(officialName.given) ? officialName.given : [];
  const fullName = [...given, officialName.family].filter(Boolean).join(" ");
  const encounterDate = metadata.date ?? encounter?.period?.start ?? "";
  const note = String(record.note ?? "");
  const soap = parseSoap(note);
  const planSections = parsePlanSections(soap.plan);
  const clinician = findClinician(record.encounter_fhir?.related_resources);

  return {
    id: String(record.id),
    patientId: String(patient.id),
    patientReference: `Patient/${patient.id}`,
    encounterId: String(metadata.encounter_id),
    encounterReference: `Encounter/${metadata.encounter_id}`,
    fullName: fullName || `Synthetic patient ${index + 1}`,
    givenName: given[0] ?? "Patient",
    familyName: officialName.family ?? "",
    birthDate: patient.birthDate ?? "",
    age: calculateAge(patient.birthDate, encounterDate),
    gender: patient.gender ?? "unknown",
    location: formatLocation(patient.address?.[0]),
    language:
      patient.communication?.[0]?.language?.text ??
      patient.communication?.[0]?.language?.coding?.[0]?.display ??
      "Not recorded",
    encounterDate,
    visitTitle: metadata.visit_title ?? metadata.visit_type ?? "Clinical encounter",
    visitType: metadata.visit_type ?? "Encounter",
    encounterStatus: metadata.status ?? encounter?.status ?? "unknown",
    clinician,
    conditions: cleanLabels(
      record.patient_context?.longitudinal_summary?.condition_labels,
    ),
    medications: cleanLabels(
      record.patient_context?.longitudinal_summary?.medication_labels,
    ),
    longitudinalCounts:
      record.patient_context?.longitudinal_summary?.resource_counts ?? {},
    encounterCounts: metadata.related_resource_counts ?? {},
    transcript: parseTranscript(record.transcript),
    soap,
    planSections,
    afterVisitSummary: String(record.after_visit_summary ?? ""),
    source: {
      system: metadata.source ?? "synthea-fhir-r4",
      synthetic: metadata.synthetic === true,
      documentStatus: metadata.document_status ?? "unknown",
    },
  };
}

function parseSoap(note) {
  const subjective = between(note, "**Subjective:**", "**Objective:**");
  const objective = between(note, "**Objective:**", "**Assessment and Plan:**");
  const planIndex = note.indexOf("**Assessment and Plan:**");
  const plan = planIndex >= 0
    ? note.slice(planIndex + "**Assessment and Plan:**".length).trim()
    : note.trim();
  return { subjective, objective, plan };
}

function between(value, start, end) {
  const startIndex = value.indexOf(start);
  if (startIndex < 0) return "";
  const contentStart = startIndex + start.length;
  const endIndex = value.indexOf(end, contentStart);
  return value.slice(contentStart, endIndex < 0 ? undefined : endIndex).trim();
}

function parsePlanSections(plan) {
  const matches = [...plan.matchAll(/^###\s+(.+)$/gm)];
  if (matches.length === 0) {
    return [{ heading: "Assessment and plan", context: "", bullets: bulletLines(plan) }];
  }

  return matches.map((match, index) => {
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? plan.length;
    const body = plan.slice(start, end).trim();
    const firstBullet = body.search(/^\s*-\s+/m);
    return {
      heading: match[1].trim(),
      context: firstBullet < 0 ? body : body.slice(0, firstBullet).trim(),
      bullets: bulletLines(body),
    };
  });
}

function bulletLines(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean);
}

function parseTranscript(value) {
  return String(value ?? "")
    .split(/\r?\n/)
    .map((line, index) => {
      const match = line.match(/^(DR|PT):\s*(.+)$/);
      if (!match) return null;
      return {
        id: `turn-${index + 1}`,
        speaker: match[1] === "DR" ? "clinician" : "patient",
        text: match[2].trim(),
      };
    })
    .filter(Boolean);
}

function findClinician(related) {
  const groups = Object.values(related ?? {});
  for (const resources of groups) {
    if (!Array.isArray(resources)) continue;
    for (const resource of resources) {
      const display = resource?.performer?.[0]?.display;
      if (display) return display.replace(/\d+/g, "").replace(/\s+/g, " ").trim();
    }
  }
  return "Attending clinician";
}

function calculateAge(birthDate, encounterDate) {
  if (!birthDate || !encounterDate) return null;
  const birth = new Date(`${birthDate}T00:00:00Z`);
  const encounter = new Date(encounterDate);
  if (Number.isNaN(birth.valueOf()) || Number.isNaN(encounter.valueOf())) return null;
  let age = encounter.getUTCFullYear() - birth.getUTCFullYear();
  const month = encounter.getUTCMonth() - birth.getUTCMonth();
  if (month < 0 || (month === 0 && encounter.getUTCDate() < birth.getUTCDate())) age -= 1;
  return age;
}

function formatLocation(address) {
  return [address?.city, address?.state].filter(Boolean).join(", ") || "Not recorded";
}

function cleanLabels(labels) {
  return [...new Set(Array.isArray(labels) ? labels.filter(Boolean) : [])];
}
