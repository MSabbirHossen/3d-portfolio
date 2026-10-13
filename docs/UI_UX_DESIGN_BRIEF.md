# Dynamic 3D Portfolio & Personal CMS — UI/UX Design Brief

**Document ID:** D3DP-UX-001  
**Version:** 1.0 | **Date:** 2026-10-13 | **Status:** Implementation-ready design direction  
**Companion documents:** `PRD.md`, `TRD.md`, `APP_FLOW.md`  
**Product:** Personal 3D portfolio for Md. Sabbir Hossen with private owner CMS  
**Approved direction:** Premium minimal + selective 3D | phased delivery | migration of existing React/Vite portfolio | Next.js full stack  
**Audience:** Product/design owners, UX/UI designers, Figma designers, frontend developers and AI coding agents

> **Source of truth:** PRD defines product scope; TRD defines engineering/security contracts; APP_FLOW defines states and journeys; this brief defines presentation, interaction, layout, accessibility and visual acceptance. If any conflict emerges, record an ADR and resolve it explicitly rather than silently changing the contract. Examples, mock metrics and sample data in this document are *illustrative*, not verified biographical or production data.

---

## 1. Product positioning and design outcome

### 1.1 One-sentence vision
A polished, fast and credible digital portfolio that makes the owner's engineering, learning, research and community contributions easy to discover—while a secure CMS makes every published detail easy to maintain without editing code.

### 1.2 Product experience pillars
1. **Credibility before spectacle:** Evidence-rich projects, clear role/outcomes and verified credentials take priority over animation.
2. **Selective immersion:** A memorable 3D hero and restrained dimensional motion, never a game-like obstacle to reading.
3. **Editorial clarity:** Strong typography, coherent hierarchy, generous whitespace and concise storytelling.
4. **Publishing without friction:** Owner can create, preview and publish confidently, from one place.
5. **Inclusive and resilient:** All critical tasks function via keyboard, touch, screen reader, reduced motion and static 3D fallback.
6. **Audience relevance without fragmentation:** Same trusted content organized differently for recruiter, client, developer, researcher or general visitor.

### 1.3 Non-goals
- Entire site as a 3D game or mandatory 3D navigation.
- Artificial skill-percentage meters or unverifiable impact numbers.
- Auto-detecting visitor profession or covert personalization.
- Heavy dashboards on public pages, infinite motion, auto-play audio, scroll hijacking.
- Different source-of-truth content per audience.

### 1.4 UX success measures
| Outcome | Measurement | Release target / interpretation |
|---|---|---|
| Understand professional identity | Moderated 5-second impression testing | Majority accurately describe owner as developer/CS student and identify primary CTA |
| Find relevant work | Task completion from home to project detail | ≥ 90% completion in usability testing |
| Find resume/contact | Task completion from any main public route | ≥ 95% completion in usability testing |
| Publish content safely | Admin task from new draft through preview and publish | ≥ 90% completion without facilitation |
| Avoid unintended publication | Production draft leakage testing | 0 leaks |
| Accessibility | Automated + manual WCAG review | Target WCAG 2.2 AA |
| Core Web Vitals | Real-user p75 | LCP ≤ 2.5s; INP ≤ 200ms; CLS ≤ 0.1 |

---

## 2. Users, jobs to be done and prioritized journeys

| Persona | Questions they need answered | Desired path | Primary CTA |
|---|---|---|---|
| Recruiter | Who is this candidate? What skills and proof? Resume? | Home → selected work → skills/experience → resume | Download resume / Contact |
| Client | What can they build? What outcomes and process? | Home → project case study → capabilities → contact | Discuss a project |
| Developer | What code/stack/architecture is available? | Projects → case study → repository/architecture | View GitHub |
| Researcher | What research interests and academic work exist? | About → research (V1.5) → education → contact | Collaborate |
| General visitor | Who is this person and what do they do? | Home → story → projects → contact | Explore work |
| Owner/admin | Can I safely update the site fast? | Login → content list → edit → preview → publish | Create / Publish |

**UX rule:** Only owner/admin needs sign-in. Public visitors never encounter authentication gates or personalized-account requirements.

---

## 3. Release design scope and screen priority

**MVP:** Public home, about, projects/index+detail, skills, experience, education, certifications/index+detail, resume, contact, privacy, error/404; admin login, dashboard, projects, certificates, skills, experience, education, profile, media, resume, messages, settings; one progressive-enhancement 3D hero.

**V1.5:** `/for/{recruiters,clients,developers,researchers,visitors}`, `/research`, `/blog`, `/timeline`, achievements/uses/now/links, advanced admin tools, GitHub sync and optional subtle card depth.

**V2:** Optional skills constellation, enhanced dimensional timeline, AI portfolio assistant and optional guestbook, all gated by separate approval/abuse/performance requirements.

A design can prototype future pages, but **do not imply the feature is implemented** in an MVP release. Hide unpublished and unimplemented navigation destinations.

---

## 4. Creative direction, mood and design language

### 4.1 Visual identity
**Keywords:** refined, engineering-led, considered, kinetic, confident, approachable, slightly futuristic, human.  
**Avoid:** generic SaaS template, rainbow gradient overload, noisy glassmorphism, token-heavy UI, random floating icons, fake terminal output, illegible neon, perpetual animated backgrounds.

**Narrative metaphor:** “A studio of ideas” rather than “a video game world.” Use a single carefully built 3D workspace/abstract engineered artifact as visual signature. Real portfolio content remains in crisp semantic HTML.

### 4.2 Art direction proposals
- **Default: Midnight Atelier.** Near-black backdrop; restrained violet and cyan; soft localized highlights; substantial negative space; disciplined typography; 3D forms in brushed metal/glass with physically plausible, subtle lighting.
- **Alternate: Paper & Precision.** Warm/cool white surface; graphite type; selective violet; softer shadows; nearly monochrome imagery; the same layout tokens and 3D poster still work.
- Both themes are first-class, not simple invert filters. System follows OS setting; manually chosen setting persists without flash.

### 4.3 Visual inspiration guidelines
Use references for **quality of typography, motion restraint and composition**, not to duplicate proprietary designs. Design hero and case studies around *real source images, project UI screenshots and authentic verified data*.

### 4.4 Color palette — starting tokens, not blindly final contrast guarantees
| Role | Dark | Light | Notes |
|---|---|---|---|
| Page canvas | `#09090F` | `#FAFAFC` | PRD baseline |
| Surface | `#181824` | `#FFFFFF` | Primary panels |
| Raised surface | `#222232` | `#F2F2F7` | Menus/cards |
| Main text | `#F7F7FB` | `#161622` | Contrast test |
| Secondary text | `#B8B8CA` | `#515164` | Contrast test |
| Accent / violet | `#8B5CF6` | `#6D28D9` | Non-text highlights/CTA; verify white text on accent |
| Support / cyan | `#38BDF8` | `#0369A1` | Signals, links after contrast testing |
| Outline | `#333345` | `#D7D7E1` | Subtle dividers |
| Focus ring | `#C4B5FD` | `#6D28D9` | Visible on every surface |
| Destructive | `#F87171` | `#B91C1C` | Never color alone |
| Success | `#4ADE80` | `#166534` | Use semantic label and icon |

**Contrast:** WCAG AA at final computed colors; ≥4.5:1 for normal text, ≥3:1 for large text and required non-text UI. Check gradient overlays, translucent surfaces, hover and disabled treatment individually. Do not assume table swatches meet these ratios without testing.

### 4.5 Typography
- Suggested headings: **Sora** or **Manrope**; suggested body: **Inter**; monospace accents: **JetBrains Mono** (subject to font availability/licensing and load-budget review).
- Prefer **one primary variable font** and **one sparingly used mono font** for MVP performance; different heading font is optional.
- Type scale desktop: Display 64–88px (fluid), H1 48–64, H2 36–48, H3 24–32, H4 20–24, body large 18–20, body 16–18, helper 14; line-height 1.1–1.2 for display, 1.45–1.65 for body.
- Mobile type uses `clamp()`; body stays at least 16px. Reading measure ~65–75 characters for article paragraphs.
- Avoid ALL CAPS for long copy; small uppercase labels can be used with tracking.

### 4.6 Layout and spacing
- 8px base spacing; 4px for micro-alignment; standard token set `4,8,12,16,24,32,48,64,96,128`.
- Desktop content container max-width ~1200–1280px; article body ~720–780px; full-bleed hero backdrop without full-bleed text.
- 12-column desktop grid, 8-column tablet where useful, 4-column mobile conceptual grid.
- Border radii: 8px inputs, 12–16px cards, 20–24px feature panels; consistent, not mixed arbitrarily.
- Shadow/glow only where it conveys elevation or interactive focus. Borders provide structure in dark mode.

---

## 5. Navigation, information architecture and global components

### 5.1 Public navigation
- Desktop: logo/wordmark left; `Work`, `About`, `Skills`, `Credentials`, contextual `Research` when live; `Contact`; resume CTA; theme control.
- Compact header on scroll with no content-shifting height jump; sticky if tested for usability.
- Mobile: accessible menu button; a standard overlay/drawer with focus trap and escape close; all links reachable; background scroll management.
- Logo click returns to `/`; breadcrumb follows public detail routes.
- V1.5 audience switch is explicit and reversible. Do not secretly change copy or omit work based on inferred persona.

### 5.2 Shared shell
`Skip to main` → header → main → section anchors → contact CTA → footer. Footer includes concise professional context, social links, contact, privacy and last-updated if available.

### 5.3 Feedback patterns
- Skeletons match target component geometry and avoid CLS.
- Empty states explain why nothing appears and offer a recovery action.
- Error states say what failed, whether data was saved and how to retry.
- External links are clearly indicated when useful and include safe `rel` handling.
- No false metrics, fictional endorsements or implied employment statuses.

---

## 6. Screen-by-screen public UI specifications

### 6.1 `/` — Home (MVP; primary impression)
**Sequence:**
1. Header + skip link.
2. **Hero:** identity/name, succinct truthful headline, 1–2 line value statement, primary `Explore projects`, secondary `Contact`/`Resume`; optional availability badge only when CMS-verified.
3. **Selected work:** 3–6 owner-curated cards; one visual feature card may span extra columns; project details always one click away.
4. **Capabilities:** 3–5 meaningful areas, each supported by real projects/skills.
5. **About teaser:** professional story with authentic photo or text-driven treatment; read-more link.
6. **Credentials & education:** small curated set; compact credibility strip.
7. **Research/teaching/community teaser** only when data exists.
8. **Contact invitation:** clear next step and channels.
9. Footer.

**Layout:** Desktop hero copy ~6 columns, scene ~6; stack on mobile with text/CTA first. Max hero height only if content fits; no forced full-viewport scrolling trap. Cards use a clear visual aspect ratio (e.g. 16:10), consistent metadata and status labels. 3D canvas sits behind or beside content, nonessential.

**States:** hero loads before 3D; no-WebGL poster; no featured projects shows genuine skills/story + `All projects` if populated; external GitHub outage does not remove CMS-curated content.

### 6.2 `/projects` — Projects index (MVP)
- Intro, visible total where factual, accessible keyword search; filters for technology/category/status where populated; optional featured toggle.
- Desktop 3-column grid where screenshots allow; tablet 2; mobile 1. Toggle list mode later if user research supports it.
- Each card: image, title, concise one-line challenge/value, role or category, 2–4 stack tags, internal `View case study`. A dedicated external icon link is optional and not the card's only action.
- Filters persist in query parameters when practical (shareable back-button-friendly state).
- Empty result state: `No projects match these filters` + `Clear filters`; error state includes Retry.

### 6.3 `/projects/[slug]` — Case study (MVP)
Order: breadcrumbs → title/short summary → role/timeline/stack and demo/repo links → primary media → problem/context → goals/constraints → solution/architecture → key features → implementation decisions → challenges/trade-offs → outcomes (verified only) → learnings → gallery → related work → contact.

- Desktop: readable content column with compact sticky table of contents only where length justifies it.
- Accessible images/video have captions; no auto-play sound; diagrams available as explanatory text.
- Hide sections without valid data; do not manufacture case-study narrative from tags alone.
- A page must remain complete without a 3D render.

### 6.4 `/about` (MVP)
Narrative intro; professional identity; honest career focus; education and relevant milestones; interests, current work and community contribution; links to work/research. Use a real photo only if supplied/approved. Avoid long résumé dumps.

### 6.5 `/skills` (MVP)
Groups (frontend, backend, data, tools, security/research as applicable); icons + names + evidence tags; clicking evidence navigates to supporting project. Avoid numeric proficiency bars unless measurable assessment method is supplied. Provide basic list view if any diagram enhancement exists later.

### 6.6 `/experience` and `/education` (MVP)
Readable chronology, dates and organizations, role/degree, responsibilities and selected evidence. Use an HTML timeline/list; visual line may enhance but cannot encode sole meaning. Make active/ongoing state explicit where verified.

### 6.7 `/certifications` and `/certifications/[slug]` (MVP)
Filter/search gallery, issuer, title, issue/expiry date where known, view credential details, verification source link. Detail uses true certificate asset, alt/description, issuer data and authenticity disclaimer where appropriate. Handle expired/not provided without implying invalidity or verified status.

### 6.8 `/resume` (MVP)
Accessible live HTML summary + current PDF link, explicit `Last updated` if available, consistent title. PDF download should be labeled by format and ideally size; fallback contact route if asset unavailable.

### 6.9 `/contact` (MVP)
Form fields: name, email, subject/category optional, message, privacy notice, CAPTCHA/anti-spam approach only if necessary. Show field errors near input and concise error summary; confirm success only after verified API response; protect from duplicate sends. Provide alternate email/social contact path without revealing private contact data not intended for publication.

### 6.10 `/privacy`, 404, error, loading (MVP)
Explain contact submission, analytics, local UI preferences, third-party embeds where applicable; clear 404 with `Home` and `Projects`; error boundary with Retry; progress state never blocks reading accessible HTML indefinitely.

### 6.11 V1.5 audience landing pages
Each `/for/...` uses the same design system and database records; the page differs in hero phrasing, prioritized modules, evidence and CTA. Explicit audience switch in public shell or landing experience. `Return to full portfolio` visible.

| Audience | Content order | CTA |
|---|---|---|
| Recruiters | Identity → relevant projects → skills → experience → résumé | View résumé / Contact |
| Clients | Offer → featured case studies → process → testimonials if approved → contact | Discuss project |
| Developers | Tech focus → repos/case studies → architecture → articles → collaboration | Explore code |
| Researchers | Interests → verified work → education → publications when present → contact | Discuss collaboration |
| Visitors | Short story → visual work → milestones → more ways to explore | Discover projects |

### 6.12 V1.5 additional pages
Blog with metadata, table of contents, syntax highlighting and semantic headings; research with actual citation data/DOI and linked publications; timeline with HTML list and optional motion; `/now`, `/uses`, `/achievements`, `/links` with compact factual templates.

---

## 7. 3D creative direction and motion system

### 7.1 MVP hero scene specification
- **Concept:** sculptural abstract technical workspace/object floating in a controlled studio environment; subtle material response and purposeful parallax.
- **Camera:** fixed composition, small controlled response to pointer/scroll, stable on touch and reduced-motion.
- **Light:** one key and restrained rim/fill; no flashing/overexposure; background gradient behind scene, not text.
- **Interaction:** pointer response is decorative; user must never need to drag object to access content; optional click only if redundant HTML action exists.
- **Rendering:** React Three Fiber + Drei lazy-loaded into isolated client component; optimized GLB/glTF/texture sizes; DPR cap/adaptive logic; stop or suspend work when hidden; avoid complex post-processing at launch.
- **Fallback:** static pre-rendered poster with identical intended composition, useful alt if informative; if purely decorative, empty alt and `aria-hidden`.

### 7.2 Motion tokens / language
| Type | Recommended starting duration | Usage |
|---|---|---|
| Micro interaction | 120–180ms | Button feedback, icons |
| Card emphasis | 180–280ms | Hover lift/outline |
| Component entrance | 250–450ms | Gentle opacity/translate |
| Page transition | 180–350ms | Route content transition if no loading delay |
| Ambient scene | 8–20s loops where necessary | Very low-amplitude nonessential movement |

Use ease-out for entrances, ease-in-out for reversible motion; stagger only small groups. No continuous large parallax, no cursor-chasing elements that impair reading, no scroll-snap hijacking. For `prefers-reduced-motion: reduce`, remove nonessential movement rather than merely making it faster.

### 7.3 Scene fallback state machine
`HTML_VISIBLE` → optionally `POSTER_VISIBLE` → `CANVAS_LOADING` → `CANVAS_READY`; on unsupported WebGL/network failure/context loss → `POSTER_VISIBLE`; reduced motion/save-data may go straight to poster. Failures do not raise a visible alert unless there is a user-facing functional consequence.

### 7.4 V1.5 / V2 enhancements
- V1.5: CSS-based card tilt on capable pointer devices, with reduced-motion fallback and touch equivalent.
- V2: skills constellation paired with HTML directory; optional timeline depth paired with semantic ordered list. Each enhancement needs separate usability and performance review before release.

---

## 8. Private admin — information architecture and visual style

### 8.1 Admin design principle
Admin is a **calm productivity application**, not an extension of the 3D showcase. Use dense but legible information, strong affordances, minimal motion, and zero decorative WebGL.

### 8.2 Layout
- Desktop: persistent collapsible left sidebar (~240–272px), top utility bar with page title, breadcrumb, `View site`, account and save state.
- Tablet: condensed navigation drawer or icon rail with clear labels on expansion.
- Mobile: dedicated drawer, full-width forms, stacked cards replacing oversized tables, persistent primary action where appropriate.
- Group navigation: Dashboard; Content (projects, certificates, skills, education, experience, resume); Media; Communications (messages); Insights; Configuration. New V1.5 sections appear only when enabled.

### 8.3 Dashboard `/admin`
- Welcome/title and quick actions `New project`, `Add certificate`, `View site`.
- Content totals by state (draft/published) from real records; inbox unread only if measured.
- Recent drafts, recent publishes, contact messages and system reminders (e.g. failed upload) with next actions.
- **Never display illustrative/fabricated traffic stats in production.** Hide unavailable integrations with informative setup state.

### 8.4 List views
Page title, description, primary create button, query search, status and category filters, sortable columns, pagination, row actions (edit, preview, duplicate if supported, archive), bulk actions only if safe. Status represented by color + text. Table must have mobile-friendly alternative and keyboard-accessible row actions.

### 8.5 Create/edit form template
Header: breadcrumb, title or `Untitled draft`, status badge, last saved information. Main area: structured form sections. Optional side rail: publication state, SEO preview, feature/order, cover media. Footer/action bar: `Save draft`, `Preview`, `Publish` or `Update published`; dangerous actions separated. Autosave drafts only if conflict resolution and clear state indication exist.

**Publishing confirmation:** `You are about to make this content visible to everyone` with exact title and publication state. Show missing required items and block invalid publish. Allow edit of published record without silently taking draft changes live until explicit publish.

### 8.6 Media manager
Upload dropzone + browse; file preview, format/size metadata, crop where supported, alt text, owner usage references. Asset picker with search and collection filters. Confirm deletion if referenced by live content; prevent breaking references. Distinguish upload completion from final asset database registration.

### 8.7 Messages
List shows date, sender, subject, spam/handled status, sanitized text body, and protected reply channel. Never execute rich HTML from incoming message. Use accessible status actions and audit on sensitive changes.

### 8.8 Profile, resume and settings
Support form groups, preview and validation. Public-facing fields clearly labeled `Visible on website`; owner-only secret controls separate. Resume file replacement displays currently active PDF and a verification step before publish. SEO/settings edits include previews and warning when changing critical canonical URL settings.

---

## 9. Admin task flows and state contracts

### 9.1 Login
`/admin/login` → Google Firebase sign-in → server verifies identity/allowlist → secure session established → admin overview. Unapproved account: access denied with safe route back, no disclosure of allowlisted identity. Expired session: explain re-authentication and preserve *local unsaved form values* where safe, not credentials.

### 9.2 Project publishing journey
`Projects list` → `New project` → details → screenshots/media → save draft → preview (authorized) → publish validation → confirmation → publish → toast/status and `View public page` → verify public representation. Edit-published path uses controlled state/versioning and explicit republish.

### 9.3 Content state model
`draft` → `published` → `archived`; edits may be captured as draft revisions depending on TRD. Do not create UI states unsupported by the backend (e.g. scheduled publishing) until API scheduling exists. `Delete` is soft-delete where supported, with clear restore policy.

### 9.4 Autosave and conflicts
Autosave for draft only after debounce, if implemented; show `Saving…`, `Saved`, `Could not save`. For revision conflict use a blocking banner `This item changed elsewhere` with options to reload or compare/retain local copy; never silently overwrite someone else's update even for single-admin environments (multiple tabs exist).

### 9.5 Failure/recovery
- Upload rejected: explain type/size limit and retain draft fields.
- API offline: reversible retry; no false `Saved` state.
- Publish validation: list precise fields; focus first invalid field.
- Unauthorized: redirect to login or show access denied, never show private data.
- Network drop midpublish: re-fetch status before offering retry to avoid duplicates.

---

## 10. Reusable component inventory

### 10.1 Public primitives
`SiteHeader`, `MobileMenu`, `Breadcrumbs`, `ThemeSwitch`, `AudienceSwitcher` (V1.5), `HeroContent`, `HeroScene`, `HeroPoster`, `PrimaryButton`, `TextLink`, `SectionHeader`, `ProjectCard`, `ProjectGallery`, `TechTag`, `SkillGroup`, `CredentialCard`, `TimelineList`, `ResumeDownload`, `ContactForm`, `SocialLinks`, `SiteFooter`, `EmptyState`, `ErrorPanel`, `Skeleton`, `SEOPreview` where admin appropriate.

### 10.2 Admin primitives
`AdminShell`, `SidebarNav`, `Topbar`, `DataTable`, `MobileRecordList`, `Toolbar`, `StatusBadge`, `SearchInput`, `FilterBar`, `ContentEditor`, `MarkdownPreview`, `MediaPicker`, `AssetUpload`, `DateInput`, `TagInput`, `SlugInput`, `SEOFields`, `PublicationPanel`, `FormActionBar`, `ConfirmationDialog`, `UnsavedChangesDialog`, `SessionExpiredNotice`, `ConflictBanner`, `ToastRegion`, `AuditSummary`.

### 10.3 Component rules
Every interactive component documents keyboard behavior, focus, pointer/touch targets, validation, pending and disabled states, high-contrast variant and mobile layout. No duplicated one-off CSS for canonical components.

---

## 11. Screen state matrix

| UI context | Loading | Empty | Error | Success | Edge cases |
|---|---|---|---|---|---|
| Public project list | Grid skeleton | Explain none published | Retry preserving filters | Results shown | 0 matches vs 0 published distinct |
| Project detail | Layout skeleton | 404 not found | Error boundary + retry | Full content | Archived/draft => 404 |
| Contact form | Sending + disabled submit | N/A | Field/general message | Confirm after API success | Duplicate submission, rate limit |
| Login | Sign-in progress | N/A | Denied/network/session fail | Redirect dashboard | Pop-up blocked or canceled |
| Admin table | Row skeleton | Onboarding CTA | Retry | Data rows | Filters return none |
| Admin editor | Skeleton | New blank draft | Validation/conflict/network | Saved/published notices | Session expires, unsaved changes |
| Media upload | Per-file progress | Empty library instructions | Type/size/network rejected | Registered asset | Orphan asset cleanup |
| 3D hero | Static poster | N/A | Poster persists | Canvas ready | Reduced motion, context loss |

---

## 12. Responsive specification

| Viewport | Public experience | Admin experience |
|---|---|---|
| 320–479px small mobile | Single column, compact hero, poster preferred; touch targets ≥44×44px as a design goal | Stacked forms, mobile record cards, simple action bar |
| 480–767px large mobile | Single column, larger media, full CTA width as needed | Drawer nav, content editor one column |
| 768–1023px tablet | Two-column cards, hero may stack, no hover dependency | Collapsible sidebar, two-column forms selectively |
| 1024–1439px laptop | Full header, 2–3 col project grid, split hero | Persistent sidebar, structured tables |
| ≥1440px wide | Constrained reading width with graceful gutters | Max-width main region; do not stretch forms excessively |

Breakpoints are **design checkpoints**, not a mandate for these exact CSS media values; centralize actual tokens in code. Test device zoom to 200–400%, landscape, coarse pointer and narrow browser windows.

---

## 13. Accessibility and inclusive UX checklist

- Meet WCAG 2.2 AA where applicable; use semantic landmarks and sensible heading order.
- All essential tasks keyboard-operable. Tab sequence follows visible order; focus visibly outlined; dialogs manage focus and return it on close.
- Links/buttons named by purpose; icons have labels when interactive; contrast manually verified for both themes.
- Form fields have visible labels, helper text and programmatically associated errors; `aria-live` for asynchronous result/status announcements.
- At least WCAG-required target sizing; aim 44×44px for major touch targets.
- Skip link visible on focus; menus/drawers/dialogs close via Escape when appropriate.
- Respect reduced motion, high contrast, text resizing and data-saving preferences. Do not use animations as sole explanation.
- Complex diagrams/3D have equivalent descriptions or structured HTML alternatives; decorative canvas removed from accessibility tree.
- Video has captions/transcripts when applicable; image alt text must describe informative content rather than repeat adjacent title.
- Test common screen-reader/browser combinations, not only automated scanner scores.
- For Arabic in a later release, support RTL layout and proper language attributes; do not flip brand logos, code blocks or numeric identifiers naively.

---

## 14. Performance, SEO and UX quality constraints

- Critical identity, hero copy, navigation and first useful links render as server HTML before Canvas initializes.
- Reserve intrinsic dimensions for images/3D surfaces, preventing layout shift.
- Next.js image optimization, appropriate responsive `sizes`, modern formats, progressive loading of below-fold images.
- Static poster always available; defer/dynamically import WebGL; validate compressed asset weight with actual budgets in phase gate.
- Avoid unnecessary frontend-only data fetching for public indexable content; metadata and structured data must represent published data.
- No indexable admin, drafts or previews; preview must require authorization or expiring tokens per TRD.
- Real-user p75 thresholds: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Measure mobile and low-powered hardware as part of sign-off.
- No animations that cause input jank; pause offscreen work; handle slow 3G/4G in testing.

---

## 15. Content and microcopy guidelines

### 15.1 Brand voice
Confident but not exaggerated; direct; technically literate but accessible to recruiters. Use first person appropriately; distinguish *built*, *contributed*, *learning*, *research interest*; avoid claiming expertise on technology solely because it appears in a skills list.

### 15.2 Suggested primary CTA language
`Explore projects`, `Read case study`, `View source code`, `View certificate`, `Download resume (PDF)`, `Contact me`, `Discuss a project`, `Save draft`, `Preview`, `Publish`, `Archive`.

### 15.3 Content design guardrails
- Every project must have a specific problem, role and artifact if available; omit unsupported impact statistics.
- Date/issuer and credential claims may be published only after owner verifies them during migration.
- Admin messages explain consequences of state changes; publication UI never says `Saved` when the action only queued a request.
- Avoid placeholders such as fake projects or fabricated testimonials in shipping content.

---

## 16. Figma organization and handoff package

Suggested Figma pages:
1. `00 — Cover & Decisions`
2. `01 — Foundations` (colors, type, spacing, grids, elevation)
3. `02 — Components` (public + admin with variants and states)
4. `03 — Public / Desktop`
5. `04 — Public / Mobile`
6. `05 — Admin / Desktop`
7. `06 — Admin / Mobile`
8. `07 — Interaction & Motion` (timing, easing, transition diagrams)
9. `08 — 3D Art Direction` (camera, hero composition, posters, failure state)
10. `09 — User Flows & Prototype`
11. `10 — Accessibility & QA`
12. `11 — Handoff / Specs / Assets`

**Naming:** `Component/Variant/State`, e.g. `ProjectCard/Featured/Hover`; `Page/Desktop/Home`; use shared token variables and semantic components rather than flattened bespoke copies.

**Minimum handoff artifacts:** high-fidelity desktop/mobile designs for all MVP routes; public/admin design systems; interactive home-to-project and admin publish prototypes; empty/loading/error/validation states; image/3D poster assets and approved licensing; responsive behavior notes; accessibility annotation; color/typography tokens in implementation-friendly form; component-to-code mapping; UX acceptance checklist.

### 16.1 Illustration/wireframe descriptions

**Public desktop home:** top nav; hero split 55/45; headline/CTAs left; subtle sculptural 3D right; featured case studies 3-column grid; alternating editorial sections; contact section; footer.

**Public mobile home:** brand and menu top; heading + two CTA rows; optimized scene poster below; stacked projects; concise about and evidence; footer. Main CTAs visible without waiting for 3D.

**Admin projects page:** sidebar; breadcrumb/title and create button; search/status filters; data table with cover/title/status/updated/actions; mobile cards instead of overflowing table.

**Admin project editor:** persistent heading/status; multi-section form; media panel; SEO preview; publication panel; sticky save/preview/publish area; unsaved changes and publish confirmation.

---

## 17. UX research and validation plan

### 17.1 Research tasks
1. Recruiter: locate a relevant project, identify owner's role, open résumé.
2. Developer: find repository and stack for a project; navigate back.
3. Client: find evidence of relevant work and submit inquiry.
4. General visitor: explain professional positioning after a 5-second home glimpse.
5. Owner: add certificate, attach file, preview and publish; later edit without accidentally changing live view.
6. Accessibility user: navigate main pages and form via keyboard and screen reader.

### 17.2 Recommended rounds
- **Concept review:** 2 art directions and one low-fidelity home/editor flow; pick one via clarity/performance criteria.
- **Prototype usability:** 5–8 diverse participants as available; capture task success, time, friction and misinterpretations (not statistically representative).
- **Pre-launch QA:** keyboard, screen reader, mobile, 3D fallback, slow network, localization-ready typography, theme review.

### 17.3 Design decision log
Each material deviation should record: decision ID, user problem, alternatives, accessibility impact, performance impact, selected direction, PRD/TRD reference, owner/date.

---

## 18. Design acceptance criteria by feature

| ID | Acceptance criterion | Release |
|---|---|---|
| UX-001 | Home communicates identity and CTA in readable HTML before 3D loads | MVP |
| UX-002 | Public navigation and all routes usable by keyboard and touch | MVP |
| UX-003 | Project card clearly exposes title, relevant stack and case-study link | MVP |
| UX-004 | Project detail renders verified content, omits unprovided fields gracefully | MVP |
| UX-005 | Draft/archived pages inaccessible to public navigation/indexing | MVP |
| UX-006 | Resume accessible as HTML and available PDF when configured | MVP |
| UX-007 | Contact form handles invalid, sending, failure and verified success states | MVP |
| UX-008 | Admin login failures and unauthorized access have safe UI | MVP |
| UX-009 | Owner can draft → preview → publish → verify live project | MVP |
| UX-010 | Unsaved changes, validation and revision conflicts are surfaced | MVP |
| UX-011 | Admin layouts usable at mobile, tablet and desktop sizes | MVP |
| UX-012 | Both themes meet contrast and have no initial theme flash | MVP |
| UX-013 | Reduced motion/no-WebGL renders successful hero poster | MVP |
| UX-014 | Real-user CWV targets and manual accessibility acceptance met | MVP |
| UX-015 | Content migration preserves provenance and verified claims | MVP |
| UX-016 | Audience switch is explicit, reversible, and preserves source content | V1.5 |
| UX-017 | Research/blog template handles unknown/missing records honestly | V1.5 |
| UX-018 | 3D skills/timeline have equivalent HTML access | V2 |

**Acceptance evidence:** screenshots (desktop/mobile/theme), annotated Figma frames, keyboard walkthrough, Lighthouse/axe results where useful, Playwright run, real-device notes, and CMS publish video or test log. A pretty screenshot alone does not close the requirement.

---

## 19. Phased design delivery roadmap

| Design phase | Maps to engineering phase | Deliverables | Exit gate |
|---|---|---|---|
| D0 — Audit | P0 | Existing portfolio screenshot/content inventory, IA, content gaps | No migration-critical page/content omitted |
| D1 — Foundation | P1 | Art direction, tokens, grids, typography, navigation, public+admin components | Light/dark and responsive primitives approved |
| D2 — Core CMS | P2–P4 | Login, dashboard, tables, form templates, publish states, media manager | CRUD/publish prototype completes tasks |
| D3 — Public MVP | P5 | Desktop/mobile public pages, project case study, credentials, contact | Task usability and accessibility pass |
| D4 — 3D and launch | P5–P6 | Hero scene storyboard/poster, reduced-motion/failure states, QA | Scene optional, performance and fallback pass |
| D5 — Audience and publishing | P7–P9 | Audience layouts, blog/research/timeline, integrations | Audience switch non-deceptive and reversible |
| D6 — Experiments | P10 | Optional advanced 3D/AI prototypes | Separate measured user value and performance approval |

---

## 20. AI design-agent prompt (copy/paste)

```text
You are the senior product designer, UX architect, accessibility specialist and UI systems designer for my Dynamic 3D Portfolio & Personal CMS.

Read docs/PRD.md, docs/TRD.md, docs/APP_FLOW.md and docs/UI_UX_DESIGN_BRIEF.md in full before starting. Treat the documents as binding; report conflicting requirements and propose a documented decision instead of silently improvising.

Brand direction: premium minimal + selective 3D, engineering/editorial credibility, strong typography, restrained violet/cyan on near-black with a genuinely accessible light theme. The 3D hero is a nonessential enhancement, not a navigation requirement. No invented experience, credentials, metrics or testimonials.

Implement in design order: (1) audit source content, (2) tokens and reusable components, (3) public home and project case study with desktop/mobile states, (4) admin list/editor/publish workflows, (5) remaining MVP screens, (6) 3D poster/canvas with reduced-motion/WebGL failure fallback, (7) responsive, accessibility and usability checks.

For each requested design task return: scope/related requirement IDs; user goal; annotated layout; components and variants; mobile/tablet/desktop behavior; theme behavior; loading/empty/error/success states; keyboard/focus/accessibility notes; API/content dependencies; motion/fallback notes; concrete acceptance checklist and unresolved questions.

Do not introduce V1.5/V2 features into MVP navigation unless implemented. Do not treat screenshots as complete specifications. Prefer honest, fast, readable UI over decorative complexity.
```

### 20.1 Repeatable per-screen agent prompt

```text
Design and implement [ROUTE/SCREEN] for release [MVP/V1.5/V2].
Use docs/UI_UX_DESIGN_BRIEF.md plus PRD/TRD/APP_FLOW as references.
Produce: information hierarchy, annotated desktop/mobile layout, component inventory, content contract, interactions, state matrix, accessibility requirements, visual tokens, 3D/performance constraints if relevant, and traceable acceptance IDs.
Inspect existing code before changes; reuse shared components; avoid unrelated changes; add tests/stories for all critical states. Report verified outcomes and remaining gaps.
```

---

## 21. Open decisions (resolve during D0–D1; not blockers for documentation)

1. Final wordmark/logo treatment and whether portrait photography is available and approved.
2. Exact case-study visual assets and media aspect ratios after source audit.
3. Final hero 3D model/art direction and asset-size budget after real-device profiling.
4. Primary font after performance/licensing review.
5. Public copy and supported languages for MVP (default English; later BN/AR optional).
6. Contact channel preference, public email visibility and policy details.
7. Whether analytics are enabled at launch, and resulting privacy copy.
8. Owner content-edit workflow: manual Save vs protected draft autosave based on TRD implementation readiness.

---

## 22. Repository handoff and artifact checklist

```text
docs/
  PRD.md
  TRD.md
  APP_FLOW.md
  UI_UX_DESIGN_BRIEF.md
  design/
    DESIGN_TOKENS.md
    COMPONENT_INVENTORY.md
    SCREEN_SPECS.md
    MOTION_3D_SPEC.md
    ACCESSIBILITY_CHECKLIST.md
    DESIGN_DECISIONS.md
```

**Definition of design-ready:** each MVP route has annotated responsive frames, content contract, all essential states, component references, accessibility notes, and an agreed acceptance checklist. **Definition of design-done:** designs are implemented and validated on real content and real devices, not merely approved in Figma.

---

**End of UI/UX Design Brief v1.0**
