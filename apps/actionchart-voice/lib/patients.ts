import patientData from "@/app/data/patients.generated.json";
import type { PatientCase } from "@/lib/types";

export const patients = patientData as unknown as PatientCase[];

export function defaultPatient(): PatientCase {
  return (
    patients.find((patient) => patient.givenName === "Ali") ??
    patients[0]
  );
}

export function findPatient(patientId: string): PatientCase | undefined {
  return patients.find((patient) => patient.patientId === patientId);
}

export function searchPatients(query: string): PatientCase[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return patients;
  return patients.filter((patient) =>
    [patient.fullName, patient.visitTitle, patient.visitType]
      .join(" ")
      .toLowerCase()
      .includes(normalized),
  );
}

export function patientInitials(patient: PatientCase): string {
  return `${patient.givenName[0] ?? ""}${patient.familyName[0] ?? ""}`.toUpperCase();
}

export function formatEncounterDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Date not recorded";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function cleanClinicalLabel(value: string): string {
  return value.replace(/\s*\((finding|disorder|procedure|situation)\)$/i, "");
}
