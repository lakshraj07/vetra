# Vetra — project context for Claude

Vetra is the **AI operating system for veterinary clinics**. Four named agents — Mochi, Pip, Hazel, Willow — handle the phones, the chart, the pharmacy, and the conversations that need the most care. We sell to two distinct buyers: **independent clinics** (owner-DVM, 1–3 sites) and **multi-location groups** (ops director / group CMO, 4–80+ sites).

This file orients you. Treat it as the source of truth for positioning, vocabulary, and design — over anything you find on the web — unless explicitly told otherwise.

---

## File layout

```
vETRA/
├── CLAUDE.md                                ← you are here
└── outputs/
    └── vetra-landing-preview/
        └── index.html                       ← marketing landing page (single file)
```

The landing is intentionally a single self-contained HTML file. No build step. Inline `<style>`. Google Fonts via CDN. Keep it that way unless we explicitly migrate to a framework.

---

## Positioning

- **One-liner**: The AI operating system for veterinary clinics.
- **Hero promise**: A team of four agents for every part of the clinic.
- **Wedge**: Voice/front desk (Mochi) — fastest path to measurable ROI via missed-call recovery.
- **Expansion**: Records (Pip), refills/reminders (Hazel), companion/EOL (Willow), plus future agents on request ("We'll build the agent for it.").
- **Not**: "an AI receptionist." Don't reduce Vetra to a single agent. Always frame as the OS.

---

## The four agents

Naming pattern: short, soft, pet-like (≤2 syllables, vowel or soft consonant endings). Inspired by AskCompanion's Otto/Summi/Quill/Sage. Each agent owns a slice of the clinic workflow and has a distinct visual identity.

| Agent | Owns | Avatar gradient | Card tone |
|---|---|---|---|
| **Mochi** | Voice & front desk — first-ring pickup, multi-species triage, ER routing, calendar booking, callback queue, missed-call recovery, SOAP-style call summaries | `#fbb591 → #d97757` (coral/peach) | Cream/pine-mist |
| **Pip** | Records & PIMS — files faxes/IDEXX/Antech labs/referrals into the right chart, flags abnormal values, drafts discharge summaries, microchip sync; PIMS-agnostic (AVImark, Cornerstone, ezyVet, Provet, IntraVet, Pulse, Hippo) | `#5fae87 → #0e5c43` (pine) | Pine-mist band |
| **Hazel** | Refills, reminders & follow-up — chronic refill pre-fetch (NSAIDs, thyroid, seizure, derm), monthly preventive compliance (HW/flea/tick), 24h/72h/2-wk post-visit cadence, insurance pre-auth, pharmacy routing (Chewy, Vetsource, in-clinic) | `#e3b964 → #8a5a1a` (amber) | Cream/pine-mist |
| **Willow** | Companion & end-of-life — HHHHHMM & QoL scale check-ins, hospice planning, in-home euthanasia scheduling, bereavement follow-up, multilingual empathy support | `#c4b8d6 → #6f6582` (lavender/sage) | Soft lavender (`#f4f0f7 → #ece6f4`) |

Vetra (the brand) is the orchestrator — the OS that ties them together. We do **not** add a fifth orchestrator-agent character. The product is the orchestrator.

---

## User personas

### Independent clinic
- **Sites**: 1–3
- **Buyer**: Owner DVM, practice manager
- **Pain**: Missed calls = lost revenue; staff burnout; nights/weekends uncovered
- **Proof they need**: ROI in 30 days; testimonial from a peer DVM
- **CTA copy**: "Book a 15-min demo" · "From $499/mo"
- **Visual cue**: Pine badge

### Multi-location group
- **Sites**: 4–80+
- **Buyer**: Director of Operations, Group CMO, RVT Lead
- **Pain**: Standardization across sites; per-site visibility; rollout speed; vendor consolidation; mixed-PIMS estates
- **Proof they need**: Multi-site dashboard, SOC 2 II, SSO/SAML, audit logs, PIMS-agnostic, staged rollout playbook with a deployment lead
- **CTA copy**: "Talk to ops team" · "Custom · SOC 2 II"
- **Visual cue**: Dark ink badge

Treat these as two parallel lanes throughout the page — never collapse them into a generic "clinics" message in the hero, segments section, trust logos, testimonials, or final CTA.

---

## Design tokens

### Color
```css
--cream:       #f6f8f4;   /* page background */
--paper:       #ffffff;   /* card surfaces */
--band:        #ecf3ee;   /* section bands */
--ink:         #17231f;   /* primary text + dark CTAs */
--sage:        #5a6862;   /* secondary text */
--sage-soft:   #8a9690;   /* tertiary text */
--line:        #d5dfd8;   /* borders */
--line-soft:   #e8eee9;   /* subtle dividers */
--pine:        #0e5c43;   /* brand primary */
--pine-dark:   #073d2e;   /* hover/active */
--pine-light:  #e4f1e9;   /* accents */
--pine-mist:   #f0f7f2;   /* card backgrounds */
--oxblood:     #9a2638;   /* emergency / ER */
--gold:        #b9822d;   /* urgent / lab flags */
```

### Spacing (8pt grid)
```css
--s-1: 4px;   --s-2: 8px;    --s-3: 12px;  --s-4: 16px;  --s-5: 24px;
--s-6: 32px;  --s-7: 48px;   --s-8: 64px;  --s-9: 96px;  --s-10: 128px;
```
Use the tokens. No raw pixel values for padding/margin/gap.

### Type scale (1.250 Major Third)
```css
--t-xs: 12px; --t-sm: 14px; --t-base: 16px; --t-lg: 20px; --t-xl: 25px;
--t-2xl: 31px; --t-3xl: 39px; --t-4xl: 49px; --t-5xl: 61px; --t-6xl: 76px;
```

### Typefaces
- **Display**: Fraunces (serif, 700/900, letter-spacing -.025em, line-height 1.05)
- **Body**: Inter (400/500/600/700, line-height 1.55)
- **Labels/eyebrows**: JetBrains Mono (500/600, uppercase, letter-spacing .14em)

### Layout
- Container max-width 1240px, gutter `clamp(20px, 4vw, 40px)`
- Sticky header with backdrop blur
- Sections breathe at `--s-9` (96px) top/bottom
- Breakpoints: 980px (collapse multi-column → single), 640px (stack denser grids)

---

## Brand voice

- **Direct, not chatty.** "Mochi picks up. Every call, every time." Not "Meet Mochi, our friendly virtual assistant!"
- **Emotional honesty in the right place.** Willow's section is allowed to slow down and acknowledge difficulty. Mochi/Pip/Hazel stay crisp.
- **Veterinary, not generic healthcare.** Use real terms: SOAP, PIMS, HHHHHMM, IDEXX, Antech, Cal.com, microchip registry, EOL, QoL.
- **Specific over abstract.** "Pip flagged ALT 142 ↑ on Buddy's panel" > "Pip handles lab results."
- **Avoid**: "revolutionize," "AI-powered," "transform your practice," exclamation marks, em-dashes used as decoration. Smart-quotes okay. Real em-dashes (—) for asides, sparingly.

---

## Reference / inspiration

- **caregp.com.au** — IA pattern we cloned (announce strip → hero → product showcase → workflow band → compliance → trust logos → testimonials → mission → final CTA).
- **askcompanion.com** — Agent naming style (short, pet-like) and the "Meet the Companions" character-card pattern.
- **landing-gamma-nine-30.vercel.app** — Earlier Vetra landing; source of dashboard mock vocabulary (call queue, urgency dots, agent activity).
- **Owl-Listener/designer-skills** (GitHub) — Design principles applied: 8pt grid, modular type scale, hierarchy analysis, brand consistency, composition.

Reference sites are reference, not template. Don't blindly copy CareGP's copy or AskCompanion's exact characters — we have our own four agents and our own positioning.

---

## Working preferences

- **One file.** Keep `index.html` self-contained. No build step, no separate CSS, no JS framework — for now.
- **Edits over rewrites.** Prefer `Edit` over `Write` for changes. If you must rewrite the whole file, do it in one pass and verify the close (`</footer></body></html>`) with `Grep`. We have been bitten by truncated writes; always check the last few lines after a large edit.
- **Concise responses.** The user prefers tight prose. Skip recap paragraphs at the end. If you ran 5 tool calls, don't list them — show the diff or the outcome.
- **Persona parity.** Any new section, copy block, or visual must serve **both** independents and multi-location groups, or be explicitly scoped to one of them with a visual cue (badge color, section label).
- **No new agents without a conversation.** If a workflow comes up (e.g., billing, controlled substances tracking, behavior consults), first ask whether it belongs to one of the existing four agents or warrants a new one.

---

## Open threads / things to do next

- Deploy `index.html` to Vercel (pending: auth method — token, local CLI, or drag-drop).
- Alternate landing variants worth prototyping: editorial (`index-editorial.html`), operator console (`index-console.html`), 2×2 agent grid (`index-grid.html`).
- Pricing page is referenced but not built.
- Sub-pages for each agent (`/mochi`, `/pip`, `/hazel`, `/willow`) are linked but not implemented.
- ROI calculator (independents) and multi-site dashboard preview (groups) are mentioned in copy but not in the page.
