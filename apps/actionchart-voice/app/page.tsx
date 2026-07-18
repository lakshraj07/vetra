"use client";

import { useEffect, useMemo, useState } from "react";
import { extractActions } from "@/lib/actions";
import { buildFhirDrafts } from "@/lib/fhir";
import {
  cleanClinicalLabel,
  defaultPatient,
  formatEncounterDate,
  patientInitials,
  patients,
  searchPatients,
} from "@/lib/patients";
import { prettyJson } from "@/lib/outputs";
import { buildPatientRecap, recapAsText } from "@/lib/recap";
import {
  createReviewState,
  reviewProgress,
  transitionAction,
  updateAction,
} from "@/lib/review";
import {
  loadReviewState,
  resetReviewState,
  saveReviewState,
} from "@/lib/review-storage";
import { buildFrontDeskCallLog } from "@/lib/triage";
import type {
  AuditEntry,
  FhirDraft,
  FrontDeskCallLog,
  PatientCase,
  ReviewAction,
  ReviewStatus,
} from "@/lib/types";

type WorkspaceTab = "review" | "soap" | "outputs";

const owners = [
  "Referral team",
  "Care coordinator",
  "Clinical staff",
  "Clinician",
  "Front desk",
  "Patient and care team",
];

const dueWindows = [
  "Today",
  "This week",
  "Within 2 weeks",
  "Daily",
  "As needed",
  "12 months",
];

export default function Home() {
  const initialPatient = defaultPatient();
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatient.patientId);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<WorkspaceTab>("review");
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [reviewState, setReviewState] = useState(() =>
    createReviewState(initialPatient.patientId, extractActions(initialPatient)),
  );
  const [reviewHydrated, setReviewHydrated] = useState(false);
  const [replayPosition, setReplayPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const [jsonDraft, setJsonDraft] = useState<FhirDraft | null>(null);

  const patient =
    patients.find((candidate) => candidate.patientId === selectedPatientId) ??
    initialPatient;
  const patientActions = useMemo(() => extractActions(patient), [patient]);
  const callLog = useMemo(() => buildFrontDeskCallLog(patient), [patient]);
  const filteredPatients = useMemo(() => searchPatients(query), [query]);
  const progress = reviewProgress(reviewState);
  const drafts = buildFhirDrafts(patient, reviewState.actions);
  const recap = buildPatientRecap(patient, reviewState.actions);
  const currentAction =
    reviewState.actions.find((action) => action.id === selectedActionId) ??
    reviewState.actions[0] ??
    null;
  const visibleTranscript = showFullTranscript
    ? patient.transcript
    : patient.transcript.slice(Math.max(0, replayPosition - 5), replayPosition);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextState =
        loadReviewState(patient.patientId) ??
        createReviewState(patient.patientId, patientActions);
      setReviewState(nextState);
      setSelectedActionId(nextState.actions[0]?.id ?? null);
      setReplayPosition(0);
      setIsPlaying(false);
      setShowFullTranscript(false);
      setJsonDraft(null);
      setReviewHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [patient.patientId, patientActions]);

  useEffect(() => {
    if (reviewHydrated && reviewState.patientId === patient.patientId) {
      saveReviewState(reviewState);
    }
  }, [patient.patientId, reviewHydrated, reviewState]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setReplayPosition((position) => {
        if (position >= patient.transcript.length) {
          setIsPlaying(false);
          return position;
        }
        return Math.min(patient.transcript.length, position + 2);
      });
    }, 720);
    return () => window.clearInterval(timer);
  }, [isPlaying, patient.transcript.length]);

  function selectPatient(nextPatient: PatientCase): void {
    const nextState =
      loadReviewState(nextPatient.patientId) ??
      createReviewState(nextPatient.patientId, extractActions(nextPatient));
    setReviewState(nextState);
    setSelectedActionId(nextState.actions[0]?.id ?? null);
    setSelectedPatientId(nextPatient.patientId);
    setReplayPosition(0);
    setIsPlaying(false);
    setShowFullTranscript(false);
    setJsonDraft(null);
    setTab("review");
  }

  function updateCurrent(updates: Partial<ReviewAction>): void {
    if (!currentAction) return;
    setReviewState((state) => updateAction(state, currentAction.id, updates));
  }

  function setStatus(status: ReviewStatus): void {
    if (!currentAction) return;
    const currentIndex = reviewState.actions.findIndex(
      (action) => action.id === currentAction.id,
    );
    const nextState = transitionAction(reviewState, currentAction.id, status);
    setReviewState(nextState);
    const nextPending = nextState.actions
      .slice(currentIndex + 1)
      .find((action) => action.status === "pending");
    if (status === "approved" && nextPending) setSelectedActionId(nextPending.id);
  }

  function resetCase(): void {
    resetReviewState(patient.patientId);
    const fresh = createReviewState(patient.patientId, patientActions);
    setReviewState(fresh);
    setSelectedActionId(fresh.actions[0]?.id ?? null);
    setReplayPosition(0);
    setIsPlaying(false);
    setShowFullTranscript(false);
    setJsonDraft(null);
    setTab("review");
  }

  function playRecap(): void {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(recapAsText(recap)));
  }

  const reviewPercent = progress.total
    ? Math.round((progress.reviewed / progress.total) * 100)
    : 0;
  const replayPercent = patient.transcript.length
    ? Math.round((replayPosition / patient.transcript.length) * 100)
    : 0;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <PulseMark />
          </span>
          <div>
            <div className="brand-name">ActionChart</div>
            <div className="brand-subtitle">Patient memory to owned action</div>
          </div>
        </div>
        <div className="topbar-status">
          <span className="data-badge"><span className="status-dot" /> Synthetic FHIR R4</span>
          <span className="voice-badge"><Icon name="wave" /> Vapi + Nova-3 slot ready</span>
          <button className="quiet-button" onClick={resetCase} type="button">
            <Icon name="reset" /> Reset case
          </button>
          <div className="clinician-avatar" title="Reviewing clinician">LD</div>
        </div>
      </header>

      <div className="workspace">
        <aside className="patient-rail" aria-label="Synthetic patient cohort">
          <div className="rail-heading">
            <div>
              <span className="eyebrow">Demo cohort</span>
              <h2>Returning patients</h2>
            </div>
            <span className="count-pill">{patients.length}</span>
          </div>
          <label className="search-box">
            <Icon name="search" />
            <span className="sr-only">Search patients</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or visit"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>
            ) : null}
          </label>
          <div className="patient-list">
            {filteredPatients.map((candidate) => {
              const selected = candidate.patientId === patient.patientId;
              return (
                <button
                  type="button"
                  className={`patient-row ${selected ? "selected" : ""}`}
                  key={candidate.id}
                  onClick={() => selectPatient(candidate)}
                  aria-current={selected ? "true" : undefined}
                >
                  <span className="patient-avatar">{patientInitials(candidate)}</span>
                  <span className="patient-row-copy">
                    <strong>{candidate.fullName}</strong>
                    <span>{candidate.age ?? "?"} · {shortVisitType(candidate.visitType)}</span>
                  </span>
                  {candidate.givenName === "Ali" ? <span className="demo-tag">Demo</span> : null}
                </button>
              );
            })}
            {filteredPatients.length === 0 ? (
              <div className="empty-search">No patient matches that search.</div>
            ) : null}
          </div>
          <div className="rail-note">
            <Icon name="shield" />
            <p><strong>Demo data only</strong><br />No real patient information or live EHR connection.</p>
          </div>
        </aside>

        <section className="main-workspace">
          <PatientHeader patient={patient} drafts={drafts.length} progress={progress} />

          <div className="workflow-strip" aria-label="Workflow progress">
            <WorkflowStep number="01" label="Log call" detail={callLog.id} complete />
            <WorkflowConnector />
            <WorkflowStep
              number="02"
              label="Triage and route"
              detail={callLog.urgencyLabel}
              complete
            />
            <WorkflowConnector />
            <WorkflowStep number="03" label="Restore context" detail="Longitudinal FHIR" complete />
            <WorkflowConnector />
            <WorkflowStep
              number="04"
              label="Clinician review"
              detail={`${progress.reviewed} of ${progress.total} reviewed`}
              complete={progress.total > 0 && progress.reviewed === progress.total}
              active={progress.reviewed < progress.total}
            />
            <WorkflowConnector />
            <WorkflowStep
              number="05"
              label="Create outputs"
              detail={`${drafts.length} FHIR drafts`}
              complete={drafts.length > 0}
            />
          </div>

          <FrontDeskHandoff log={callLog} patient={patient} />

          <div className="context-grid">
            <section className="memory-card panel-card">
              <PanelHeading
                eyebrow="Before this visit"
                title="Patient memory"
                accessory={<span className="verified-label"><Icon name="check" /> Context restored</span>}
              />
              <p className="memory-lead">
                Assembled from {patient.longitudinalCounts.Encounter ?? 1} encounters and {sumCounts(patient.longitudinalCounts)} FHIR resources.
              </p>
              <div className="memory-section">
                <h4>Active context</h4>
                <div className="chip-list">
                  {patient.conditions.slice(-5).map((condition) => (
                    <span className="context-chip" key={condition}>{cleanClinicalLabel(condition)}</span>
                  ))}
                  {patient.conditions.length === 0 ? <span className="muted-copy">No conditions in summary.</span> : null}
                </div>
              </div>
              <div className="memory-section">
                <h4>Medication memory</h4>
                {patient.medications.length ? (
                  <ul className="plain-list">
                    {patient.medications.slice(0, 3).map((medication) => <li key={medication}>{medication}</li>)}
                  </ul>
                ) : (
                  <div className="empty-inline"><Icon name="medication" /> No active medications in the longitudinal summary.</div>
                )}
              </div>
              <div className="resource-row">
                {topCounts(patient.longitudinalCounts).map(([label, value]) => (
                  <div className="resource-stat" key={label}>
                    <strong>{value}</strong><span>{label}</span>
                  </div>
                ))}
              </div>
              <details className="source-disclosure">
                <summary>Source and provenance</summary>
                <p>{patient.source.system} · {patient.patientReference} · {patient.source.documentStatus}</p>
              </details>
            </section>

            <section className="encounter-card panel-card">
              <PanelHeading
                eyebrow="Current encounter"
                title="Encounter replay"
                accessory={<span className="adapter-label"><span className="status-dot amber" /> API pending</span>}
              />
              <div className="voice-stage">
                <div className={`voice-orb ${isPlaying ? "playing" : ""}`} aria-hidden="true">
                  <Icon name="wave" />
                </div>
                <div className="voice-copy">
                  <strong>{isPlaying ? "Replaying encounter" : replayPosition ? "Replay paused" : "Transcript ready"}</strong>
                  <span>{isPlaying ? "Provider-neutral events streaming" : "Same event contract planned for Vapi"}</span>
                </div>
                <button
                  type="button"
                  className="play-button"
                  onClick={() => setIsPlaying((value) => !value)}
                  disabled={replayPosition >= patient.transcript.length}
                  aria-label={isPlaying ? "Pause encounter replay" : "Play encounter replay"}
                >
                  <Icon name={isPlaying ? "pause" : "play"} />
                </button>
              </div>
              <div className="replay-progress">
                <span style={{ width: `${replayPercent}%` }} />
              </div>
              <div className="replay-meta">
                <span>{replayPosition} / {patient.transcript.length} turns</span>
                <button type="button" onClick={() => { setReplayPosition(patient.transcript.length); setIsPlaying(false); }}>
                  Process full encounter <Icon name="arrow" />
                </button>
              </div>
              <div className="transcript-window" aria-live="polite">
                {visibleTranscript.length ? visibleTranscript.map((turn) => (
                  <div className={`transcript-turn ${turn.speaker}`} key={turn.id}>
                    <span>{turn.speaker === "clinician" ? "DR" : "PT"}</span>
                    <p>{turn.text}</p>
                  </div>
                )) : (
                  <div className="transcript-empty">
                    <Icon name="wave" />
                    <p>Play the synthetic encounter or process it instantly for the demo.</p>
                  </div>
                )}
              </div>
              <button className="text-button" type="button" onClick={() => setShowFullTranscript((value) => !value)}>
                {showFullTranscript ? "Show replay window" : "Open full transcript"} <Icon name="chevron" />
              </button>
            </section>
          </div>

          <section className="review-workspace panel-card">
            <div className="review-topline">
              <div>
                <span className="eyebrow">Doctor workbench</span>
                <h2>Turn the visit into owned next steps</h2>
                <p>The front desk captured and routed the call. Every clinical next step still requires your review.</p>
              </div>
              <div className="review-score">
                <div className="score-ring" style={{ "--score": `${reviewPercent * 3.6}deg` } as React.CSSProperties}>
                  <span>{reviewPercent}%</span>
                </div>
                <div><strong>{progress.reviewed} reviewed</strong><span>{progress.approved} approved</span></div>
              </div>
            </div>

            <nav className="workspace-tabs" aria-label="Encounter workspace">
              <TabButton active={tab === "review"} onClick={() => setTab("review")} icon="review">
                Action review <span>{progress.total}</span>
              </TabButton>
              <TabButton active={tab === "soap"} onClick={() => setTab("soap")} icon="note">
                SOAP snapshot
              </TabButton>
              <TabButton active={tab === "outputs"} onClick={() => setTab("outputs")} icon="output">
                Approved outputs <span className={drafts.length ? "ready-count" : ""}>{drafts.length}</span>
              </TabButton>
            </nav>

            {tab === "review" ? (
              <div className="review-layout">
                <div className="action-queue" aria-label="Proposed action queue">
                  <div className="queue-label"><span>Proposed actions</span><small>Highest confidence first</small></div>
                  {reviewState.actions.map((action, index) => (
                    <button
                      type="button"
                      key={action.id}
                      className={`queue-item ${currentAction?.id === action.id ? "active" : ""}`}
                      onClick={() => setSelectedActionId(action.id)}
                    >
                      <span className={`queue-number ${action.status}`}>{action.status === "pending" ? index + 1 : <Icon name={statusIcon(action.status)} />}</span>
                      <span className="queue-copy">
                        <strong>{action.summary}</strong>
                        <span>{action.section} · {Math.round(action.confidence * 100)}% confidence</span>
                      </span>
                      <span className={`status-label ${action.status}`}>{action.status}</span>
                    </button>
                  ))}
                  {reviewState.actions.length === 0 ? (
                    <div className="empty-queue">No open follow-up action was found in this note.</div>
                  ) : null}
                </div>

                {currentAction ? (
                  <ActionDetail
                    action={currentAction}
                    onUpdate={updateCurrent}
                    onStatus={setStatus}
                  />
                ) : (
                  <div className="action-detail empty-detail">
                    <Icon name="check" />
                    <h3>No proposed action to review</h3>
                    <p>Open another patient or inspect the SOAP snapshot.</p>
                  </div>
                )}
              </div>
            ) : null}

            {tab === "soap" ? <SoapSnapshot patient={patient} /> : null}

            {tab === "outputs" ? (
              <ApprovedOutputs
                patient={patient}
                drafts={drafts}
                recap={recap}
                audit={reviewState.audit}
                onShowJson={setJsonDraft}
                onPlayRecap={playRecap}
                onReturnToReview={() => setTab("review")}
              />
            ) : null}
          </section>
        </section>
      </div>

      {jsonDraft ? (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setJsonDraft(null)}>
          <section className="json-modal" role="dialog" aria-modal="true" aria-label={`${jsonDraft.resourceType} draft JSON`} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="eyebrow">FHIR R4 draft</span><h2>{jsonDraft.resourceType}</h2></div>
              <button type="button" onClick={() => setJsonDraft(null)} aria-label="Close JSON view">×</button>
            </div>
            <div className="draft-warning"><Icon name="shield" /> Draft proposal only. Not transmitted to an EHR.</div>
            <pre>{prettyJson(jsonDraft)}</pre>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function PatientHeader({
  patient,
  drafts,
  progress,
}: {
  patient: PatientCase;
  drafts: number;
  progress: { reviewed: number; total: number; approved: number };
}) {
  return (
    <header className="patient-header">
      <div className="patient-identity">
        <span className="large-avatar">{patientInitials(patient)}</span>
        <div>
          <div className="identity-line">
            <h1>{patient.fullName}</h1>
            <span className="returning-badge"><Icon name="history" /> Returning patient</span>
          </div>
          <p>{patient.age ?? "Age not recorded"} years · {capitalize(patient.gender)} · DOB {formatBirthDate(patient.birthDate)} · {patient.location}</p>
          <p className="visit-line"><strong>{patient.visitTitle}</strong> · {formatEncounterDate(patient.encounterDate)}</p>
        </div>
      </div>
      <div className="header-metrics">
        <div><span>Review</span><strong>{progress.reviewed}/{progress.total}</strong></div>
        <div><span>Approved</span><strong>{progress.approved}</strong></div>
        <div className={drafts ? "metric-ready" : ""}><span>FHIR drafts</span><strong>{drafts}</strong></div>
      </div>
    </header>
  );
}

function FrontDeskHandoff({
  log,
  patient,
}: {
  log: FrontDeskCallLog;
  patient: PatientCase;
}) {
  return (
    <section className="front-desk-card panel-card">
      <div className="front-desk-heading">
        <div className="call-id-block">
          <span className="call-icon"><Icon name="phone" /></span>
          <div>
            <span className="eyebrow">Vetra front-door workflow</span>
            <h2>Call logged and triaged</h2>
            <p>{log.id} · {formatEncounterDate(patient.encounterDate)} · Returning patient matched</p>
          </div>
        </div>
        <span className={`triage-badge ${log.urgency}`}><span className="status-dot" /> {log.urgencyLabel}</span>
      </div>
      <div className="front-door-grid">
        <div className="front-door-stage capture-stage">
          <span className="stage-icon"><Icon name="phone" /></span>
          <div className="stage-copy"><span>Capture</span><strong>{log.reason}</strong><small>{log.channel} · {log.caller}</small></div>
        </div>
        <div className="front-door-arrow"><Icon name="arrow" /></div>
        <div className="front-door-stage route-stage">
          <span className="stage-icon"><Icon name="route" /></span>
          <div className="stage-copy"><span>Route</span><strong>{log.route}</strong><small>{log.urgencyRationale}</small></div>
        </div>
        <div className="front-door-arrow"><Icon name="arrow" /></div>
        <div className="front-door-stage assign-stage">
          <span className="stage-icon"><Icon name="assign" /></span>
          <div className="stage-copy"><span>Assign</span><strong>{log.owner}</strong><small>{log.nextStep}</small></div>
        </div>
      </div>
      <div className="call-log-footer">
        <div className="concern-list">
          {log.reportedConcerns.map((concern) => <span key={concern}>{concern}</span>)}
        </div>
        <p><Icon name="shield" /> {log.sourceNote}</p>
      </div>
    </section>
  );
}

function ActionDetail({
  action,
  onUpdate,
  onStatus,
}: {
  action: ReviewAction;
  onUpdate: (updates: Partial<ReviewAction>) => void;
  onStatus: (status: ReviewStatus) => void;
}) {
  return (
    <div className="action-detail">
      <div className="action-detail-heading">
        <div>
          <span className="section-label">{action.section}</span>
          <h3>Review proposed action</h3>
        </div>
        <div className="action-badges">
          <span className={`resource-badge ${action.fhirTarget.toLowerCase()}`}>{action.fhirTarget}</span>
          {action.sensitive ? <span className="sensitive-badge"><Icon name="lock" /> Sensitive</span> : null}
        </div>
      </div>

      <label className="field-group full-field">
        <span>Action summary</span>
        <textarea value={action.summary} onChange={(event) => onUpdate({ summary: event.target.value })} rows={2} />
      </label>

      <div className="field-grid">
        <label className="field-group">
          <span>Owner</span>
          <select value={action.owner} onChange={(event) => onUpdate({ owner: event.target.value })}>
            {owners.map((owner) => <option key={owner}>{owner}</option>)}
          </select>
        </label>
        <label className="field-group">
          <span>Due window</span>
          <select value={action.dueWindow} onChange={(event) => onUpdate({ dueWindow: event.target.value })}>
            {dueWindows.map((window) => <option key={window}>{window}</option>)}
          </select>
        </label>
      </div>

      <label className={`visibility-control ${!action.patientVisible ? "internal" : ""}`}>
        <span className="toggle-copy">
          <Icon name={action.patientVisible ? "eye" : "lock"} />
          <span><strong>{action.patientVisible ? "Visible in patient recap" : "Internal care-team item"}</strong><small>{action.sensitive ? "Sensitive evidence starts internal by default." : "Change what the patient receives after review."}</small></span>
        </span>
        <input
          type="checkbox"
          checked={action.patientVisible}
          onChange={(event) => onUpdate({ patientVisible: event.target.checked })}
          aria-label="Include action in patient recap"
        />
        <span className="toggle-track" aria-hidden="true"><span /></span>
      </label>

      <details className="evidence-panel" open>
        <summary>
          <span><Icon name="evidence" /> Evidence used</span>
          <span className="confidence-label"><i style={{ width: `${Math.round(action.confidence * 100)}%` }} /> {Math.round(action.confidence * 100)}%</span>
        </summary>
        <div className="evidence-content">
          <div><span>SOAP plan</span><p>“{action.evidence.note}”</p></div>
          <div><span>Transcript match</span><p>{action.evidence.transcript ? `“${action.evidence.transcript}”` : "No exact transcript turn matched. Review the note evidence before approval."}</p></div>
        </div>
      </details>

      <div className="review-actions">
        <button className="approve-button" type="button" onClick={() => onStatus("approved")}>
          <Icon name="check" /> {action.status === "approved" ? "Approved" : "Approve and continue"}
        </button>
        <button className="secondary-button" type="button" onClick={() => onStatus("deferred")}><Icon name="clock" /> Defer</button>
        <button className="reject-button" type="button" onClick={() => onStatus("rejected")}><Icon name="close" /> Reject</button>
        {action.status !== "pending" ? <button className="text-reset" type="button" onClick={() => onStatus("pending")}>Return to review</button> : null}
      </div>
      <p className="approval-footnote"><Icon name="shield" /> Approval creates a draft proposal. It does not place an order or contact a patient.</p>
    </div>
  );
}

function SoapSnapshot({ patient }: { patient: PatientCase }) {
  return (
    <div className="soap-layout">
      <section className="soap-section subjective"><span>S</span><div><h3>Subjective</h3><p>{patient.soap.subjective || "Not recorded."}</p></div></section>
      <section className="soap-section objective"><span>O</span><div><h3>Objective</h3><p>{patient.soap.objective || "Not recorded."}</p></div></section>
      <section className="soap-section plan"><span>A/P</span><div><h3>Assessment and plan</h3>{patient.planSections.map((section) => <div className="plan-block" key={section.heading}><h4>{section.heading}</h4><p>{section.context}</p><ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div>)}</div></section>
    </div>
  );
}

function ApprovedOutputs({
  patient,
  drafts,
  recap,
  audit,
  onShowJson,
  onPlayRecap,
  onReturnToReview,
}: {
  patient: PatientCase;
  drafts: FhirDraft[];
  recap: ReturnType<typeof buildPatientRecap>;
  audit: AuditEntry[];
  onShowJson: (draft: FhirDraft) => void;
  onPlayRecap: () => void;
  onReturnToReview: () => void;
}) {
  return (
    <div className="outputs-layout">
      <section className="output-column">
        <div className="output-heading">
          <div><span className="eyebrow">Care-team output</span><h3>FHIR draft queue</h3></div>
          <span className="draft-count">{drafts.length} draft{drafts.length === 1 ? "" : "s"}</span>
        </div>
        {drafts.length ? (
          <div className="draft-list">
            {drafts.map((draft) => (
              <article className="draft-card" key={draft.id}>
                <span className={`draft-icon ${draft.resourceType.toLowerCase()}`}><Icon name={draft.resourceType === "Task" ? "task" : "service"} /></span>
                <div>
                  <span className="draft-kind">{draft.resourceType} · draft / proposal</span>
                  <strong>{draft.resourceType === "Task" ? draft.description : draft.code.text}</strong>
                  <small>{draft.resourceType === "Task" ? draft.owner.display : draft.requester.display} · {draft.priority}</small>
                </div>
                <button type="button" onClick={() => onShowJson(draft)}>View JSON <Icon name="code" /></button>
              </article>
            ))}
          </div>
        ) : (
          <div className="output-empty"><Icon name="output" /><h4>No draft resources yet</h4><p>Approve an action to create a FHIR draft.</p><button type="button" onClick={onReturnToReview}>Return to review</button></div>
        )}

        <div className="audit-block">
          <div className="audit-heading"><h4>Review audit</h4><span>{audit.length} events</span></div>
          {audit.slice(0, 5).map((entry) => (
            <div className="audit-row" key={entry.id}><span className="audit-dot" /><div><strong>{entry.event}</strong><small>{entry.actor} · {formatTime(entry.timestamp)}</small></div></div>
          ))}
          {audit.length === 0 ? <p className="muted-copy">Decisions will appear here with actor and time.</p> : null}
        </div>
      </section>

      <section className="recap-card">
        <div className="recap-heading">
          <div><span className="eyebrow">Patient-facing output</span><h3>Approved recap</h3></div>
          <span className="safe-badge"><Icon name="shield" /> Safety filter on</span>
        </div>
        <div className="recap-rule"><Icon name="filter" /><span>Only <strong>approved + patient-visible</strong> items can appear here.</span></div>
        <div className="message-preview">
          <div className="message-recipient"><span>{patientInitials(patient)}</span><div><strong>To {patient.givenName}</strong><small>After-visit recap · not sent</small></div></div>
          <p>{recap.greeting}</p>
          <p>{recap.intro}</p>
          {recap.items.length ? <ol>{recap.items.map((item) => <li key={`${item.summary}-${item.timing}`}><strong>{item.summary}</strong><span>{item.timing}</span></li>)}</ol> : <div className="recap-empty">No approved patient-visible item yet.</div>}
          <p>{recap.closing}</p>
        </div>
        <button className="play-recap" type="button" onClick={onPlayRecap} disabled={recap.items.length === 0}><Icon name="volume" /> Play recap with browser voice</button>
        <p className="recap-note">Internal, deferred, rejected, and pending actions are excluded in code before this recap is composed.</p>
      </section>
    </div>
  );
}

function PanelHeading({ eyebrow, title, accessory }: { eyebrow: string; title: string; accessory: React.ReactNode }) {
  return <div className="panel-heading"><div><span className="eyebrow">{eyebrow}</span><h3>{title}</h3></div>{accessory}</div>;
}

function WorkflowStep({ number, label, detail, complete = false, active = false }: { number: string; label: string; detail: string; complete?: boolean; active?: boolean }) {
  return <div className={`workflow-step ${complete ? "complete" : ""} ${active ? "active" : ""}`}><span>{complete ? <Icon name="check" /> : number}</span><div><strong>{label}</strong><small>{detail}</small></div></div>;
}

function WorkflowConnector() {
  return <span className="workflow-connector"><Icon name="arrow" /></span>;
}

function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: IconName; children: React.ReactNode }) {
  return <button type="button" className={active ? "active" : ""} onClick={onClick}><Icon name={icon} /> {children}</button>;
}

type IconName = "arrow" | "assign" | "check" | "chevron" | "clock" | "close" | "code" | "evidence" | "eye" | "filter" | "history" | "lock" | "medication" | "note" | "output" | "pause" | "phone" | "play" | "reset" | "review" | "route" | "search" | "service" | "shield" | "task" | "volume" | "wave";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    assign: <><circle cx="9" cy="8" r="3"/><path d="M4 19a5 5 0 0 1 10 0M16 11h5M18.5 8.5v5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    chevron: <path d="m9 7 5 5-5 5"/>,
    clock: <><circle cx="12" cy="12" r="8"/><path d="M12 8v5l3 2"/></>,
    close: <><path d="m7 7 10 10"/><path d="M17 7 7 17"/></>,
    code: <><path d="m9 7-5 5 5 5"/><path d="m15 7 5 5-5 5"/></>,
    evidence: <><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    eye: <><path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2"/></>,
    filter: <path d="M4 6h16l-6 7v5l-4 2v-7Z"/>,
    history: <><path d="M4 12a8 8 0 1 0 2-5.3"/><path d="M4 4v5h5M12 8v5l3 2"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    medication: <><path d="M7 7a4 4 0 0 1 6-3l7 7a4 4 0 0 1-6 6Z"/><path d="m10 10 4 4"/></>,
    note: <><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/></>,
    output: <><path d="M4 12h11"/><path d="m11 8 4 4-4 4"/><path d="M14 5h6v14h-6"/></>,
    pause: <><path d="M9 7v10M15 7v10"/></>,
    phone: <path d="M7 3h3l1.5 5-2 1.5a15 15 0 0 0 5 5l1.5-2 5 1.5v3c0 2-1 4-4 4C9 21 3 15 3 7c0-3 2-4 4-4Z"/>,
    play: <path d="m9 6 9 6-9 6Z"/>,
    reset: <><path d="M4 12a8 8 0 1 0 2-5.3"/><path d="M4 4v5h5"/></>,
    review: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    route: <><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 4 4v6M12 18H8a2 2 0 0 1-2-2v-3"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/></>,
    service: <><path d="M4 7h16v12H4z"/><path d="M8 7V4h8v3M12 10v6M9 13h6"/></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6Z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></>,
    task: <><path d="M5 4h14v16H5z"/><path d="m8 10 2 2 4-4M8 16h7"/></>,
    volume: <><path d="M5 10h4l5-4v12l-5-4H5z"/><path d="M17 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12"/></>,
    wave: <path d="M3 12h3l2-7 4 14 3-10 2 6 2-3h2"/>,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function PulseMark() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 16h6l3-8 4 16 3-8h6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/><circle cx="25" cy="8" r="3" fill="currentColor" opacity=".55"/></svg>;
}

function topCounts(counts: Record<string, number>): Array<[string, number]> {
  const preferred = ["Encounter", "Observation", "Procedure", "DiagnosticReport"];
  return preferred.map((key) => [key === "DiagnosticReport" ? "Reports" : `${key}s`, counts[key] ?? 0]);
}

function sumCounts(counts: Record<string, number>): number {
  return Object.values(counts).reduce((sum, value) => sum + value, 0);
}

function shortVisitType(value: string): string {
  return value.replace(/\s*\(procedure\)$/i, "").replace("General examination of patient", "General exam");
}

function statusIcon(status: ReviewStatus): IconName {
  if (status === "approved") return "check";
  if (status === "deferred") return "clock";
  if (status === "rejected") return "close";
  return "review";
}

function capitalize(value: string): string {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : "Not recorded";
}

function formatBirthDate(value: string): string {
  if (!value) return "not recorded";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function formatTime(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "Time not recorded" : new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(date);
}
