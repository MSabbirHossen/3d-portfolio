# Dynamic 3D Portfolio & Personal CMS — Technical Requirements Document (TRD)

**Document ID:** PORTFOLIO-TRD-001  
**Version:** 1.0  
**Date:** 2026-10-13  
**Status:** Implementation baseline; subject to Phase 0 repository audit  
**Companion:** `3D_Portfolio_Production_PRD.md` (PORTFOLIO-PRD-001 v1.0)  
**Owner:** Md. Sabbir Hossen  
**Existing site:** https://msabbirhossen.github.io/  
**Source to audit:** https://github.com/MSabbirHossen/MSabbirHossen.github.io

> **Reading rule:** The PRD defines the *what and why* (features and release priorities). This TRD defines the *how and how to verify it*. Where an implementation detail below conflicts with the PRD's declared product behavior, flag an ADR and resolve it explicitly; do not silently change scope. The existing repository has not been audited in preparing this specification. Names, examples, existing data and compatibility assumptions must be verified before implementation.

---

## 1. System objectives, constraints and quality attributes

### 1.1 Product contract

Deliver a secure single-owner full-stack portfolio. Public pages are responsive, accessible and indexable, with selective optional 3D. Owner-only admin pages can create, revise, preview, publish and archive portfolio content without editing source files. Existing React/Vite portfolio data and assets will be inventoried, cleaned, migrated and checked before launch.

**Confirmed decisions:** Next.js App Router + TypeScript; balanced premium-minimal visual language with progressive React Three Fiber visuals; phased MVP → V1.5 → V2; migrate existing content. **Explicit exclusions in MVP:** public accounts, public login, payments, unmoderated user posts, multi-admin permission matrix, AI assistant, arbitrary custom HTML publishing, and requiring WebGL for navigation.

### 1.2 Engineering principles

1. Server-render critical public content; JavaScript and WebGL are enhancements.
2. Never trust browser-provided identity, role, content status, storage IDs or query operators.
3. Business logic must live in services, not route handlers or React components.
4. Share typed request/response and validation contracts across boundary layers.
5. Use explicit publication state and bounded queries.
6. Keep media in external object/media storage, metadata in MongoDB.
7. Treat code generation as untrusted until lint, build, tests and review pass.
8. Avoid unnecessary microservices: deploy one Next.js application initially.
9. Ensure portability by providing documented backup/export and migration pathways.
10. Record substantial architecture changes as Architecture Decision Records (ADRs).

### 1.3 Requirement levels

- **MUST (P0):** Blocks MVP launch; acceptance tests required.
- **SHOULD (P1):** Scheduled for V1.5 unless justified earlier.
- **MAY (P2):** Post-launch experiment or V2 feature.

### 1.4 Quantitative targets

| ID | Attribute | MVP requirement | Measurement |
|---|---|---|---|
| NFR-001 | LCP | ≤ 2.5s at 75th percentile for representative production users | Real-user Web Vitals |
| NFR-002 | INP | ≤ 200ms at 75th percentile | Real-user Web Vitals |
| NFR-003 | CLS | ≤ 0.1 at 75th percentile | Real-user Web Vitals |
| NFR-004 | Accessibility | WCAG 2.2 AA target on key flows; no critical automated issues | axe + keyboard/manual QA |
| NFR-005 | API responsiveness | p95 public list/detail ≤ 500ms server processing under agreed test load; exclude user network | Instrumented staging load test |
| NFR-006 | Reliability | Core public content remains usable without WebGL, and with failed optional third-party integrations | Fault injection |
| NFR-007 | SEO | Published routes have canonical metadata, server-rendered content, sitemap entry | Crawler/HTML checks |
| NFR-008 | Security | Zero known critical/high findings accepted without documented mitigation | Scans + manual security review |
| NFR-009 | Release quality | All P0 test cases pass; builds reproduce from lockfile | CI evidence |
| NFR-010 | Portability | Documented content and media inventory export; a restore drill completed before launch | Runbook execution |

Targets are engineering acceptance goals, not achieved performance claims. Establish baselines during Phase 0/1, including mobile mid-tier hardware and throttled network benchmarks.

---

## 2. Scope, phases and dependencies

| Area | MVP P0 | V1.5 P1 | V2 P2 |
|---|---|---|---|
| Public | Home, About, Projects, Project detail, Skills, Experience, Education, Certifications/detail, Resume, Contact, Privacy | Audience routes, Blog, Research, Timeline, Achievements, Uses/Now/Links | Optional guestbook, further immersive navigation |
| Admin | Login, dashboard, projects, certifications, skills, experience, education, media, messages, profile/settings, resume, audit basics | Blog/research/timeline/testimonials, revisions, navigation, SEO/page editor, analytics, exports | Advanced editorial workflows |
| Platform | Firebase auth, MongoDB, Cloudinary, secure APIs, monitoring, CI, migration | GitHub sync, search, rich analytics | AI grounded in published content, i18n |
| Visual | HTML-first premium UI; optional lightweight 3D hero | More 3D components, audience variations | Experimental rich 3D experiences |

Dependency critical path: **audit → schema contracts → auth/data foundation → CMS → public rendering → migration → release hardening**. Optional 3D and external integrations must not block content delivery.

---

## 3. Reference architecture

```text
Browser (public / admin)
  |
  +--> Next.js App Router
  |      +--> Server Components / metadata / public pages
  |      +--> Client islands (forms, filters, R3F scenes)
  |      +--> /api/v1/* Route Handlers (edge boundary; Node runtime where SDKs require)
  |      +--> authenticated admin layouts and server guards
  |
  +--> Firebase client SDK (Google sign-in ONLY)
           | Firebase ID token -> /api/v1/auth/session

Next.js server layer
  +--> security: identity verification / admin authorization / CSRF-or-origin / rate limiting
  +--> Zod DTO validation / transport serialization
  +--> domain services: content / publication / media / contact / settings / migration
  +--> repositories: Mongoose -> MongoDB Atlas
  +--> Firebase Admin SDK (session verification and creation)
  +--> Cloudinary (signed upload + verification)
  +--> Email provider (server-only)
  +--> GitHub API (P1 cached, read-only)
  +--> observability (redacted structured logging, error/latency metrics)
```

### 3.1 Runtime and deployment

- **Single deployable:** Next.js App Router in Vercel with Node.js-compatible route handlers for Mongoose and Firebase Admin SDK. Mark relevant handlers `export const runtime = 'nodejs'` where needed.
- **Database:** MongoDB Atlas, dedicated databases/users per environment; pooled Mongoose client reused across invocation lifetimes when possible.
- **Identity:** Firebase Authentication for login and Admin SDK for session cookie validation, server-only.
- **Assets:** Cloudinary managed transformations and storage, with tightly scoped signed direct browser uploads.
- **Email:** Server-side provider with verified sending domain; contact success must not depend on browser SDK.
- **Optional limiter:** Durable Redis-backed rate limit for multi-instance deployment; never rely solely on in-memory counters.
- **Telemetry:** Sentry or equivalent for runtime errors; Web Vitals and aggregate analytics only under applicable disclosure/consent rules.

### 3.2 Component responsibility and data access rules

| Component | Allowed responsibility | Forbidden responsibility |
|---|---|---|
| Server page | Query published content, render HTML and metadata | Trust raw client-provided publish status |
| Client component | Local interaction, controlled forms, 3D canvas | Read MongoDB or server secrets |
| Route handler | Auth boundary, parse and validate DTO, call service, return response | Business transactions directly in handler |
| Service | Domain rules, authorization intent, publish/revision operations | Render UI |
| Repository | Database persistence and safe query construction | Decide who is admin |
| Provider adapter | Cloudinary/email/GitHub-specific integration | Accept unverified provider IDs from public callers |
| Shared schema | Zod and derived types, enums, DTO shape | Embed privileged secrets |

### 3.3 Proposed repository layout

```text
src/
  app/
    (public)/
      page.tsx
      about/page.tsx
      projects/page.tsx
      projects/[slug]/page.tsx
      skills/page.tsx
      experience/page.tsx
      education/page.tsx
      certifications/page.tsx
      certifications/[slug]/page.tsx
      resume/page.tsx
      contact/page.tsx
      privacy/page.tsx
    (auth)/admin/login/page.tsx
    (admin)/admin/
      layout.tsx
      page.tsx
      projects/{page.tsx,new/page.tsx,[id]/edit/page.tsx}
      certifications/{page.tsx,new/page.tsx,[id]/edit/page.tsx}
      skills/page.tsx
      experience/page.tsx
      education/page.tsx
      media/page.tsx
      messages/page.tsx
      resume/page.tsx
      profile/page.tsx
      settings/page.tsx
      audit-logs/page.tsx
    api/v1/
      auth/{session,me,logout}/route.ts
      public/{profile,projects,certifications,skills,experience,education,navigation}/...
      admin/{projects,certifications,skills,experience,education,media,messages,profile,settings,resume,dashboard,audit-logs,export}/...
      contact/route.ts
    sitemap.ts
    robots.ts
    layout.tsx
    globals.css
  components/
    ui/                 # Accessible design primitives
    public/             # Public sections and cards
    admin/              # Admin fields, tables, dialogs
    three/              # Lazy-loaded WebGL islands and fallbacks
  features/
    projects/{schemas,components,services}.ts*
    certifications/...
    contact/...
    auth/...
  lib/
    auth/{firebase-client,firebase-admin,session,authorize,csrf}.ts
    db/{connect,models,repositories}.ts
    api/{responses,errors,pagination,handler}.ts
    media/{cloudinary,validation}.ts
    seo/metadata.ts
    observability/{logger,metrics}.ts
    cache/revalidate.ts
    env.ts
  schemas/             # Shared Zod DTOs
  types/               # Public-safe types
  hooks/
scripts/
  migration/
  tests/{unit,integration,e2e,accessibility,security}/
public/{images,models,fonts}/
docs/{PRD.md,TRD.md,ADR/,RUNBOOK.md,MIGRATION.md,API.md}
.github/workflows/
```

This structure is illustrative; agree to naming and feature boundaries in an ADR during Phase 1, then keep consistent. Avoid nested `src/app` route-group path collisions.

### 3.4 Version management

Use compatible **current stable** versions at implementation time rather than unverified fixed versions. Pin Node.js LTS major and lockfile; use `npm ci`. Validate Next.js ↔ React ↔ React Three Fiber compatibility, Tailwind plugin compatibility, Firebase client/Admin SDK Node support, Mongoose runtime requirements, and deployment build constraints. Record exact versions in ADR-001 and `package.json`/lockfile.

---

## 4. Route specification and rendering model

### 4.1 Public pages (MVP)

| Route | Rendering | Data | SEO / special behavior |
|---|---|---|---|
| `/` | SSR/static revalidated | Profile, featured projects, settings | Static metadata, semantic H1, optional 3D scene |
| `/about` | SSR/static revalidated | Profile/experience | Public bio and proof links |
| `/projects` | SSR initial + client filter enhancement | Published projects | Shareable validated filter query; paginated |
| `/projects/[slug]` | SSR/ISR-style revalidation | Single published project | Per-record metadata, 404 for unpublished |
| `/skills` | SSR/static revalidated | Visible skills | Evidence links; categories |
| `/experience` | SSR/static revalidated | Visible experience | Accessible chronology |
| `/education` | SSR/static revalidated | Visible education | Accurate dates |
| `/certifications` | SSR initial + client filter | Published certifications | Verification links |
| `/certifications/[slug]` | SSR/revalidated | Published credential | Return 404 if archived/unpublished |
| `/resume` | SSR | Public resume summary/default PDF | HTML alternative to PDF |
| `/contact` | SSR + client-enhanced form | Site contact config | Server POST to `/api/v1/contact` |
| `/privacy` | SSR/static | Policy | Public and linked in footer |
| `/sitemap.xml`, `/robots.txt` | Generated server-side | Published URLs | No admin/drafts/staging indexing |

`/for/*`, blog, research, timeline, and secondary informational pages are P1 as in PRD. Admin list/detail routes are authenticated server-rendered shells with client-side forms as needed. Avoid presenting protected HTML before server session verification.

### 4.2 Publication visibility invariant

A public query MUST include an explicit condition such as `{ status: 'published', publishedAt: { $lte: now } }` for publishable entities, and never return drafts. Scheduled publishing is P2; for MVP, set `publishedAt` at publish time, and never rely on future dates alone to transition status automatically. Non-status entities use `visible=true` and approved public field projections. Archives return 404 and are excluded from sitemap.

### 4.3 Redirects and slugs

Slug regex: `^[a-z0-9]+(?:-[a-z0-9]+)*$`, 2–100 chars (allow migration exceptions only with documented redirect); enforce unique slug index case-normalized. On slug change create a 308 redirect from prior canonical path (detect loops, reject redirects to external origins by default). Canonical base URL comes from controlled `SITE_URL` configuration.

---

## 5. Data contracts and MongoDB models

### 5.1 Common fields and lifecycle

```ts
type PublicationStatus = 'draft' | 'published' | 'archived';
type MongoId = string; // 24-char hex serialized to API clients
interface PublicSEO {
  title?: string;          // 10–70 chars recommended
  description?: string;    // 40–170 chars recommended
  ogAssetId?: MongoId | null;
  canonicalUrl?: string | null; // same-origin or validated policy
  noIndex?: boolean;
}
interface ManagedRecord {
  id: MongoId;
  createdAt: string;      // ISO 8601 UTC on wire
  updatedAt: string;
  revision: number;       // increment each content mutation
  createdByUid: string;
  updatedByUid: string;
}
interface PublishableRecord extends ManagedRecord {
  slug: string;
  status: PublicationStatus;
  publishedAt: string | null;
  sortOrder: number;
  seo: PublicSEO;
}
```

Store dates as BSON Date, IDs as ObjectId internally; serialize to API-safe strings. Mongoose schemas use `strict: 'throw'` for unexpected model fields where viable and service-level DTO allowlists; no arbitrary `req.body` spreading into updates. `revision` optimistic concurrency is mandatory for admin edits. All mutations receive an audit entry.

### 5.2 Collections and index plan

| Collection | Required fields and constraints | Indexes (minimum) |
|---|---|---|
| `admins` | `firebaseUid` unique, `email`, `enabled`, `lastLoginAt?` | unique `firebaseUid` |
| `projects` | `title` 2–120, `slug`, `tagline?` 0–180, `summary` 10–500, long-form `overview/problem/solution`, `features[]`, `outcomes[]`, `role?`, `coverAssetId?`, `galleryAssetIds[]`, `techSkillIds[]`, `categoryIds[]`, `repositoryUrl?`, `demoUrl?`, `featured`, `startDate?`, `endDate?`, common publish fields | unique `slug`; `{status:1,featured:-1,sortOrder:1,_id:1}`; `{status:1,updatedAt:-1}` |
| `certifications` | `title`, `slug`, `issuer`, `issuedAt`, `expiresAt?`, `credentialId?`, `verificationUrl?`, `assetId?`, `skillIds[]`, `description?`, common fields | unique `slug`; `{status:1,issuedAt:-1}` |
| `skills` | `name`, `slug`, `category`, `description?`, `iconAssetId?`, `evidenceProjectIds[]`, `sortOrder`, `visible` | unique `slug`; `{visible:1,category:1,sortOrder:1}` |
| `experiences` | `organization`, `title`, `employmentType?`, `location?`, `startDate`, `endDate?`, `highlights[]`, `links[]`, `visible`, `sortOrder` | `{visible:1,startDate:-1}` |
| `educations` | `institution`, `degree`, `field`, `startDate`, `endDate?`, `summary?`, `achievements[]`, `visible` | `{visible:1,startDate:-1}` |
| `mediaAssets` | `storageProvider`, `providerAssetId`, `publicId`, `url`, `mimeType`, `bytes`, dimensions?, `altText?`, `caption?`, `ownerUid`, `usageRefs[]`, `visibility`, `status` | unique `{storageProvider:1,providerAssetId:1}`; `{status:1,createdAt:-1}` |
| `messages` | `name`, `email`, `subject`, `message`, `status`, `receivedAt`, minimal abuse metadata | `{status:1,receivedAt:-1}`; retention index *only if policy calls for expiry* |
| `siteSettings` | singleton key, profile, socials, contact, theme, feature flags | unique `key` |
| `resumeVersions` | `label`, `audience`, `assetId`, `isDefault`, `publishedAt` | `{audience:1,isDefault:1}`; enforce one active default in service/transaction |
| `navigation` | `key`, typed items, visibility | unique `key` |
| `pageContent` | `pageKey`, typed section blocks, common publish fields, `revision` | unique `pageKey` |
| `auditLogs` | `actorUid`, `action`, `entityType`, `entityId?`, `timestamp`, `result`, `requestId`, sanitized metadata | `{timestamp:-1,actorUid:1}` |
| `contentRevisions` | `entityType`, `entityId`, `version`, `snapshot`, `authorUid`, `createdAt`, `changeNote?` | unique `{entityType:1,entityId:1,version:1}` |
| `redirects` | `fromPath`, `toPath`, `httpStatus:308` | unique `fromPath` |

**V1.5 collections:** `posts`, `research`, `testimonials`, `timelineEvents` per PRD Section 5; activate schemas only when their features are implemented. Additional `categories` collection is optional; decide normalized vs enum categories in an ADR. Store references as ObjectIds, validate that referenced content exists when publishing, and avoid circular eager population.

### 5.3 Example schemas (wire-level shape)

```ts
const ProjectCreateSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(2).max(100),
  tagline: z.string().trim().max(180).optional(),
  summary: z.string().trim().min(10).max(500),
  overview: z.string().max(50000).optional(),
  problem: z.string().max(20000).optional(),
  solution: z.string().max(20000).optional(),
  features: z.array(z.string().max(300)).max(50).default([]),
  outcomes: z.array(z.string().max(300)).max(30).default([]),
  techSkillIds: z.array(ObjectIdSchema).max(60).default([]),
  categoryIds: z.array(ObjectIdSchema).max(20).default([]),
  coverAssetId: ObjectIdSchema.nullish(),
  galleryAssetIds: z.array(ObjectIdSchema).max(30).default([]),
  repositoryUrl: PublicHttpsUrlSchema.nullish(),
  demoUrl: PublicHttpsUrlSchema.nullish(),
  featured: z.boolean().default(false),
  seo: SeoSchema.optional(),
  // status is NOT accepted from generic create in MVP: always start draft
}).strict();
```

Code illustrates rules rather than a drop-in source file; `ObjectIdSchema`, `PublicHttpsUrlSchema` and `SeoSchema` must be defined/tested. All external links must be `https:` except separately approved `mailto:` contact links. Reject URLs resolving to internal/private hosts when any server-side fetch is later introduced.

### 5.4 Publish validation

`publishProject(id)` MUST check: draft or previously published entity exists; actor is allowed; current revision if supplied; title/slug/summary nonempty and valid; unique slug; cover image present **or** approved standardized fallback (record policy in ADR); external URLs valid; all visible referenced skills/assets exist; SEO metadata has safe values; publishedAt set atomically with `status='published'`; revision increment; audit recorded; affected cache paths/tags revalidated. On any validation failure, return 422 with field-specific errors and leave state unchanged.

### 5.5 Referential integrity and deletions

MongoDB has no automatic foreign-key enforcement. Service layer MUST verify references on publish and delete. `DELETE` for content is archive/soft delete by default; hard delete only via explicit maintenance workflow with references resolved. A media asset referenced by a published page cannot be deleted without unlinking or replacing it; verify provider asset ownership before deleting upstream bytes. Never expose internal IDs or admin fields accidentally through public query projections.

### 5.6 Content revision mechanics

A PATCH with `revision: 4` updates using `{ _id, revision:4 }` and increments revision to 5; stale revision produces 409. Before mutation save a revision snapshot where enabled; initial MVP must at least preserve optimistic concurrency and backup, while full browse/restore UI is P1. For multi-document operations use a MongoDB transaction where supported by the deployment; otherwise design an idempotent consistency workflow and test failure recovery.

---

## 6. API design and detailed contracts

**Version prefix:** `/api/v1` (aligned with PRD Section 6). Internal server components may call repositories/services directly, not the site's own HTTP API. Use UTF-8 JSON, Zod parsing, explicit allowlisted sort/filter inputs, a bounded limit default 12/max 50, and envelope shape below.

```json
{ "success": true, "data": { "id": "..." }, "meta": { "nextCursor": null } }
```
```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Invalid payload", "details": [{ "path": "title", "message": "Required" }] }, "requestId": "req_..." }
```

### 6.1 Public API

| Method | URI | Auth | Contract |
|---|---|---|---|
| GET | `/public/profile` | None | Public profile/social DTO; no personal unpublished fields |
| GET | `/public/projects` | None | Query: `q?`, `category?`, `skill?`, `cursor?`, `limit?`; published only |
| GET | `/public/projects/:slug` | None | Published project or 404 |
| GET | `/public/certifications` | None | `category?`, `cursor?`, `limit?`; published only |
| GET | `/public/certifications/:slug` | None | Published credential or 404 |
| GET | `/public/skills` | None | Visible skills, bounded response |
| GET | `/public/experience` | None | Visible experience |
| GET | `/public/education` | None | Visible education |
| GET | `/public/navigation` | None | Public enabled navigation links |
| POST | `/contact` | None | Validated name, email, subject, message, consent as applicable; rate-limited |
| GET | `/public/posts`, `/public/research` | None | V1.5; only published records |

Cursor must be opaque and tamper-resistant or validated against allowed sort dimensions; indexes must support stable sorting with `_id` tie-break. Public responses include only DTO-selected fields, never raw Mongoose documents.

### 6.2 Authentication API

| Method | URI | Request | Response / behavior |
|---|---|---|---|
| POST | `/auth/session` | Firebase ID token in body or auth header + origin/CSRF proof | Validate UID allowlist, recent login; set secure session cookie; `{success:true,data:{admin:true}}` |
| GET | `/auth/me` | Session cookie | Minimal admin profile or 401; `Cache-Control: no-store` |
| POST | `/auth/logout` | Session cookie + CSRF/origin | Clear cookie; optionally revoke sessions if user requested all-device logout |

### 6.3 Admin content API

| Method | URI | Semantics |
|---|---|---|
| GET, POST | `/admin/projects` | List all states/create draft |
| GET, PATCH, DELETE | `/admin/projects/:id` | Detail/partial edit/archive |
| POST | `/admin/projects/:id/publish` | Strict publish validation, audit, revalidation |
| POST | `/admin/projects/:id/unpublish` | Change to draft, remove from sitemap, revalidate |
| POST | `/admin/projects/:id/duplicate` | Copy into a new draft with unique provisional slug |
| GET, POST | `/admin/certifications` | List/create draft |
| GET, PATCH, DELETE | `/admin/certifications/:id` | Detail/edit/archive |
| GET, POST, PATCH, DELETE | `/admin/skills`, `/admin/skills/:id` | Visible skills CRUD |
| GET, POST, PATCH, DELETE | `/admin/experience`, `/admin/experience/:id` | Experience CRUD |
| GET, POST, PATCH, DELETE | `/admin/education`, `/admin/education/:id` | Education CRUD |
| GET, PATCH | `/admin/profile` | Owner public profile and bio |
| GET, PATCH | `/admin/settings` | Global config; protect feature flags and URLs |
| POST | `/admin/media/sign-upload` | Validate declared type/size; return short-lived signed provider parameters |
| POST | `/admin/media/finalize` | Independently verify provider asset and persist metadata idempotently |
| GET, PATCH, DELETE | `/admin/media`, `/admin/media/:id` | List metadata/edit alt/archive/validated delete |
| GET, PATCH, DELETE | `/admin/messages`, `/admin/messages/:id` | Inbox/status/deletion; all private |
| GET, PATCH | `/admin/resume` | Default resume PDF/content |
| GET | `/admin/dashboard` | Actual content counts, messages and recent actions |
| GET | `/admin/audit-logs` | Server-filtered, paginated, redacted |
| GET | `/admin/export` | Authenticated portable export, minimum JSON content export by launch if feasible per PRD |

V1.5 uses the same CRUD patterns for posts, research, timeline, testimonials, navigation, redirects and page blocks. Certificates use a publish action if the CMS supports drafts; add `POST /admin/certifications/:id/publish` with equivalent semantics in an OpenAPI amendment/ADR before implementing, since the PRD lists the generic CRUD but not a dedicated publish endpoint. Do not make an undocumented endpoint accidentally public.

### 6.4 Request examples

`POST /api/v1/admin/projects`:
```json
{
  "title": "Life-OS",
  "slug": "life-os",
  "summary": "A personal dashboard integrating daily management tools.",
  "techSkillIds": [],
  "featured": false
}
```

`201 Created`:
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Life-OS",
    "slug": "life-os",
    "status": "draft",
    "revision": 1
  }
}
```

`PATCH /api/v1/admin/projects/507f1f77bcf86cd799439011`:
```json
{ "summary": "Updated verified project summary with enough detail.", "revision": 1 }
```

Expected: `200` with revision 2, or `409 CONFLICT` if another edit already changed it. Prefer `If-Match: "1"` or body `revision`; document exactly one authoritative convention in OpenAPI and use it consistently.

### 6.5 Error/status map

| Status | Machine code | When |
|---|---|---|
| 200/201 | success | Read/update or created record |
| 204 | no body | Logout/delete where chosen |
| 400 | `BAD_REQUEST` | Malformed JSON / unsupported query structure |
| 401 | `UNAUTHENTICATED` | Missing/expired/invalid session |
| 403 | `FORBIDDEN` | Authenticated but not allowed, or CSRF denied (may return dedicated code) |
| 404 | `NOT_FOUND` | Not available or unpublished resource |
| 409 | `CONFLICT` | Duplicate slug or stale revision |
| 413 | `PAYLOAD_TOO_LARGE` | Oversized upload/request |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | Disallowed media |
| 422 | `VALIDATION_ERROR` | Semantically invalid fields |
| 429 | `RATE_LIMITED` | Throttled requests; return Retry-After where possible |
| 500 | `INTERNAL_ERROR` | Unexpected failure; safe user message, logged request ID |
| 503 | `DEPENDENCY_UNAVAILABLE` | Temporary provider/DB outage |

### 6.6 OpenAPI specification

Maintain `docs/openapi.yaml` or a generated equivalent with every route, auth scheme, response schema, pagination, sample payload and error response. CI MUST fail for invalid schema and should detect drift between route DTOs and schema. Use Zod-to-OpenAPI generation or carefully governed manual contracts; do not keep two independently edited undocumented definitions.

---

## 7. Authentication, authorization and secure sessions

### 7.1 Login sequence

```text
1. Owner opens /admin/login.
2. Firebase client SDK performs Google sign-in (no public registration flow).
3. Client retrieves recent Firebase ID token.
4. Client POSTs ID token to /api/v1/auth/session with same-origin/CSRF protection.
5. Server validates token signature/audience/issuer/expiration via Firebase Admin SDK.
6. Server checks exact Firebase UID against ADMIN_FIREBASE_UID allowlist AND optional enabled admin record.
7. Server verifies recent sign-in (auth_time) and applies anti-fixation session rotation.
8. Server issues HttpOnly Secure SameSite=Lax (or stricter tested) cookie, restricted Path, TTL.
9. Browser navigates to /admin; server verifies cookie before rendering protected UI.
10. Every admin API mutation re-verifies session + authorization + CSRF/origin policy.
```

Prefer a `__Host-` cookie name in production if using `Path=/`, `Secure` and no Domain attribute. For local HTTP development use a distinct non-`__Host-` dev cookie name with secure equivalent in production. Document the chosen cookie TTL (e.g., 5 days or shorter) and revoke/refresh policy in ADR; don't claim Firebase ID token and session cookie are interchangeable.

### 7.2 Protected route authorization

Use a central `requireAdmin()` server function invoked by **all** admin route handlers, Server Components and privileged server actions (if used). `middleware.ts` or equivalent can redirect cosmetically but MUST NOT be the only authorization check. Reject direct API access from a non-admin Firebase account even if it has a valid Google/Firebase login.

### 7.3 CSRF and cookie safety

For cookie-authenticated state changes enforce an origin allowlist plus synchronizer/double-submit token as appropriate to architecture; do not rely solely on `SameSite`. Verify `Content-Type`, bound request size, `Origin` and/or signed CSRF token. Disallow CORS for admin mutation routes except same origin. Login exchange also needs login-CSRF protection.

### 7.4 Mandatory security headers

Implement Content-Security-Policy appropriate for Next.js scripts, Firebase Auth, Cloudinary, video embeds and 3D assets using nonce/hash policies when feasible; `frame-ancestors 'none'` or approved same-origin policy; `X-Content-Type-Options: nosniff`; `Referrer-Policy: strict-origin-when-cross-origin`; `Permissions-Policy` restricting unused capabilities; HSTS on final HTTPS domain. Review CSP against actual SDKs—never use a permissive wildcard merely to silence errors.

### 7.5 Sensitive actions

- Login failures, privilege decisions, settings changes, publish/unpublish, media deletes, and content archives generate audit records.
- Credentials come from secret manager; Firebase Admin keys never enter client code, public routes or preview logs.
- MFA required operationally for owner email, GitHub and hosting accounts; enable Firebase MFA for the admin account where supported.
- Rate-limit login exchange; ensure sustained abuse does not exhaust server/database quotas.
- Verify session revocation for privileged operations with a documented frequency/security tradeoff.
- Rotate credentials on suspicion of exposure; record and rehearse incident runbook.

---

## 8. Media storage and upload protocol

### 8.1 Allowed classes (policy configurable)

| Asset | Types | Suggested maximum | Handling |
|---|---|---|---|
| Portfolio image | JPEG/PNG/WebP/AVIF | 10 MB | Normalize dimensions and serve transformed responsive images |
| 3D model | GLB/glTF (+ trusted dependencies) | 15 MB compressed | Only reviewed owner content; lazy-load and fallback |
| Resume/certificate | PDF | 15 MB | Safe download/header handling; only publish intentionally |
| Video | Provider-hosted or Cloudinary media | Policy-dependent | Prefer embedded external video or optimized stream; don't self-host large media in Next.js |
| SVG | Disallow arbitrary uploads by default | N/A | Trusted, sanitized build assets only |

Limits are initial proposed budgets and should be tuned in ADR after actual source inventory. Browser-provided MIME is advisory, not proof of file safety.

### 8.2 Signed upload sequence

```text
Admin UI -> POST /admin/media/sign-upload (intent, type, expected bytes)
Server -> session/CSRF/size/type checks -> short-lived, scoped Cloudinary signing data
Browser -> direct upload to allowed Cloudinary folder/account
Browser -> POST /admin/media/finalize with provider public ID + idempotency key
Server -> query Cloudinary using server credentials; verify folder, type, size, owner intent
Server -> create mediaAssets metadata and return safe asset DTO
Admin -> choose asset ID in project/certificate form
```

A signed upload response MUST NOT expose the Cloudinary API secret. Finalization MUST independently verify upstream provider attributes; do not trust client URLs or claimed byte counts. Orphan uploads are periodically reconciled; referenced assets cannot be deleted. For SVG/glTF embeds enforce explicit CSP and content safety rules. PDF access is public only when the corresponding record is explicitly published.

### 8.3 Asset performance

Use responsive image sizes with `next/image` where supported; avoid unbounded original-resolution delivery. Supply meaningful alt text; decorative art uses empty alt. For 3D, compress geometry/textures, cap draw calls, and use browser/device fallback; honor reduced-motion settings.

---

## 9. Publishing, caching and consistency

1. Public content should be served using Next.js cache/revalidation strategy chosen per route; **document whether fetch caching or repository-level caching is active**. Do not assume all direct DB reads are automatically cached.
2. On publish/unpublish/update, explicitly invalidate content tags/paths for list, detail, home featured modules, sitemap as applicable, and metadata. Test both new publish and unpublish transitions.
3. Serve admin pages and auth endpoints with `no-store`/dynamic handling as appropriate. Do not accidentally cache personalized protected HTML across sessions.
4. Do not leak drafts through previews: owner preview requires authenticated signed/short-lived preview flow, no-index headers, and private URL handling.
5. For error recovery after partial external operations (media/provider, email), use idempotency keys, retry limits and documented reconciliation, not blind repeating DB mutations.
6. On DB outage return graceful public error/fallback where possible without showing stale unpublished records; preserve last known rendered static pages if platform behavior permits and is tested.

**Cache acceptance:** Publishing a project makes it visible at its detail URL, project list, featured home (if set), and sitemap within the defined revalidation window. Unpublishing hides it from all these surfaces and changes direct detail access to 404. No hard-coded timing promise without production validation.

---

## 10. UI systems and design implementation

### 10.1 Visual tokens

- Build a tokenized theme (CSS variables) for background, surface, raised surface, foreground, muted foreground, accent, border, focus, error, warning, success and overlays.
- Default design: near-black/neutral dark, accessible light mode, restrained violet/blue accent; no excessive glow.
- Responsive breakpoints are defined centrally; avoid viewport-specific magic numbers.
- Typography: system-optimized or licensed webfonts with `font-display: swap` and measured CLS; consistent 8px-derived spacing scale.
- Layout: mobile-first, logical heading hierarchy, content max-width, readable line lengths, meaningful whitespace.
- UI primitives: shadcn/ui/Radix-compatible controls; visible labels, validation, keyboard focus and ARIA semantics.
- Theme: user-selectable light/dark/system with non-flashing initialization and WCAG contrast checks.

### 10.2 Admin UI minimums

Every editable entity requires: list, search/filter where useful, create/edit, current publication/visibility status, validation feedback, unsaved-changes warning, safe destructive-action confirmation, loading/error/empty states, save-and-continue, and preview where public view exists. Use React Hook Form + Zod resolver. Prefer structured editors and allowed content blocks; rich-text is optional for MVP project narratives if Markdown is safer to deliver. Never provide arbitrary HTML insertion.

### 10.3 Audience-aware UX (P1)

Audience modes are explicitly selected and reversible; mode changes section order/featured content, not the truth or existence of records. Public navigation must permit switching to the general portfolio. Persist choice locally only with transparent policy; do not infer visitor identity or collect invasive behavioral profiles.

---

## 11. Three.js / React Three Fiber technical specification

### 11.1 Rendering contract

- The hero's headline, bio, navigation and CTA buttons are HTML in the normal document flow.
- The 3D hero runs as a dynamically imported client island only after critical content is usable.
- A static image/CSS design is available for `prefers-reduced-motion`, no WebGL, constrained hardware, failed model load and data-saving preferences.
- No essential navigation depends exclusively on 3D interaction, color, motion, hover or audio.
- Canvas respects container bounds and never traps keyboard focus; decorative canvas uses appropriate aria-hidden handling.

### 11.2 Scene constraints

- One high-value hero scene in MVP; do not add scene layers throughout all pages at first.
- Use React Three Fiber and Drei for renderer/camera, with optional GSAP for choreographed scroll sequences after measuring overhead.
- Cap device pixel ratio (example adaptive DPR 1–1.5 on low-powered devices), materials, textures and dynamic lights according to profiling.
- Ship compressed `.glb` (glTF/Draco/Meshopt as applicable), optimized textures and controlled animation loops. Pause/limit rendering when offscreen if compatible with scene behavior.
- Avoid uncontrolled pointer movement calculations; throttle and animate via frame loop rather than React state updates every pointer event.
- Prefer subtle depth, 3D object response and lighting rather than a full game engine.

### 11.3 Scene test matrix

Desktop recent Chrome/Firefox/Safari/Edge; Android Chrome midrange; iPhone Safari; reduced motion enabled; WebGL unavailable; offline model/network failure; low-power device and keyboard-only navigation. Verify fallback, no console crash, acceptable interaction responsiveness, and unchanged content semantics.

---

## 12. SEO, discoverability and accessibility

### 12.1 SEO requirements

- Implement `generateMetadata` for dynamic project and certificate pages using only published DTOs.
- Canonical URL and stable slug; correct OG/Twitter image dimensions; fallback OG card from verified site branding.
- `sitemap.xml` lists only published and permitted routes; robots excludes privileged paths and ensures preview/staging indexing controls.
- Use Schema.org JSON-LD when claims can be verified (`Person`, `WebSite`, `BreadcrumbList`, `CreativeWork`, `Article` P1); escape JSON-LD safely.
- Ensure server-rendered title, description, headings, project summaries and functional links remain available without relying on WebGL.
- Track redirects for changed slugs; avoid canonical duplication.

### 12.2 Accessibility requirements

- Keyboard operable primary navigation, menu, forms, dialogs, tabs and filters.
- Screen-reader landmarks (`main`, `nav`, etc.), sensible heading sequence, skip link, accessible dynamic success/error messages.
- Minimum touch target and contrast per WCAG 2.2 AA on tested components; clear form label/errors.
- Focus moves correctly after dialogs, route transitions and form submissions.
- Motion is disabled/reduced according to user preference; 3D fallback preserves content meaning.
- Images carry alt text, PDFs have useful adjacent descriptions, external-link behavior is clear.
- Test English content first; P2 Bengali/Arabic localization requires RTL and font/accessibility audit.

---

## 13. Contact form and communication service

**Request DTO:** `{name: string 2–100, email: RFC-compliant reasonable length, subject: string 3–160, message: string 10–5000, consent?: boolean, honeypot?: string}`. Require consent when applicable to configured policy. Use server validation, escaped content, no HTML email injection, durable per-IP or privacy-preserving rate limits, honeypot and duplicate fingerprint with bounded retention. Send email via verified sender; optionally persist message first and log delivery state. Avoid duplicate notifications on retries. Respond to humans with accessible status; suppress useful signals to spambots without losing legitimate validation UX. Do not include raw message/email in logs or third-party analytics.

Operational behavior: a provider outage should not silently discard a stored inquiry; queue/retry where infrastructure supports it or show honest failure and provide an alternate contact route. Define message retention and owner deletion/export process in privacy documentation.

---

## 14. Observability, privacy, backup and operations

### 14.1 Logging and tracing

Structured JSON logs containing timestamp, environment, request ID, route template, status, elapsed time, coarse actor state, error code and redacted stack/context. Do not log Firebase tokens, cookies, personal contact bodies, complete email addresses, secrets or raw provider payloads. Use correlation ID through service and adapter layers. Instrument rate limiting, authentication denials, publish failures, upload failures and DB performance.

### 14.2 Analytics

Provide real metrics only; dashboard defaults to content counts/messages and aggregates from an installed provider. Never invent visitor totals. Analytics must be disclosed in `/privacy`; evaluate consent requirements for tracking/cookies. Keep staging analytics separate from production.

### 14.3 Backup and restore

- Document MongoDB database export and restore that works with the chosen Atlas tier (do not assume provider backups exist on all plans).
- Export content in portable JSON with schema version; maintain separate asset manifest mapping stored IDs to Cloudinary identifiers.
- Encrypt and restrict any backups containing contact messages; exclude secrets by default.
- Define RPO/RTO targets at launch after choosing budget and backup method; don't promise untested near-zero recovery.
- Complete a restore drill in staging before release and after major schema changes; record evidence.
- Rollback must consider database schema compatibility; use additive/backward-compatible migrations before removing fields.

### 14.4 Operations runbooks

Maintain `RUNBOOK.md`: failed deploy rollback, disabled admin login, Firebase service outage, DB unreachable, email provider failure, storage overquota, spam burst, leaked secret, corrupted media links, backup recovery and sitemap/cache mismatch.

---

## 15. Environment configuration and secret contract

Create `.env.example` with placeholder values only and validate environment with Zod at server startup. Suggested variables, aligned to PRD, are:

```dotenv
# Public only; these are Firebase web config, NOT Firebase Admin secrets
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Server only
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
ADMIN_FIREBASE_UID=
MONGODB_URI=
MONGODB_DB_NAME=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_PROVIDER_API_KEY=
CONTACT_NOTIFICATION_EMAIL=
CONTACT_FROM_EMAIL=
RATE_LIMIT_REDIS_URL=
SENTRY_DSN=
```

**Configuration rules:**
- No server secret may use `NEXT_PUBLIC_` prefix.
- Firebase private key newline decoding must be handled safely server-side.
- Environment files are gitignored; `.env.example` contains no real secrets.
- Feature-flag optional integrations when credentials are absent in local dev.
- Separate dev/staging/production Firebase, database, Cloudinary folders or accounts, email keys and analytics projects.
- Use provider secret management for deployed secrets; log only a boolean/config validation outcome, never values.
- Use strict site URL allowlists for origin/redirect checks; preview URL behavior requires separate config policy.

---

## 16. Testing strategy and test IDs

### 16.1 Tooling

Use Vitest + Testing Library for units and component behavior, integration tests for service/repository/auth boundaries, Playwright for E2E, axe-core for automated accessibility scans, Lighthouse CI or equivalent for performance budgets, dependency/secret scanning for supply-chain review, and k6/Artillery or similar lightweight load tests for API baseline. Test against isolated DB/Firebase emulator or test project; never run destructive tests against production.

### 16.2 Traceable acceptance suite

| ID | Priority | Test | Pass condition |
|---|---|---|---|
| TST-001 | P0 | Unauthenticated admin page | Redirect to login/no private SSR payload |
| TST-002 | P0 | Non-allowlisted valid Firebase UID | Cannot create session/admin access |
| TST-003 | P0 | Forged/expired cookie | 401; no admin content |
| TST-004 | P0 | CSRF attempt on admin mutation | Rejected, DB unchanged |
| TST-005 | P0 | Admin creates project | Draft persisted; not public |
| TST-006 | P0 | Admin edits with current revision | Success, revision increment |
| TST-007 | P0 | Admin edits stale revision | 409, latest data preserved |
| TST-008 | P0 | Publish invalid project | 422 field errors, remains draft |
| TST-009 | P0 | Publish valid project | Detail/list/home/sitemap visible after revalidation |
| TST-010 | P0 | Unpublish project | Public URL 404 and sitemap/list removed |
| TST-011 | P0 | Upload invalid file | Reject before persist; no public exposure |
| TST-012 | P0 | Finalize forged Cloudinary asset | Reject, no metadata created |
| TST-013 | P0 | Delete referenced asset | Block or require unlink workflow |
| TST-014 | P0 | Public API requests draft ID/slug | 404/no draft fields |
| TST-015 | P0 | Contact spam/oversize/invalid | 422/429; no injection or provider send |
| TST-016 | P0 | Legitimate contact inquiry | Valid persistence/delivery signal; privacy-safe logs |
| TST-017 | P0 | Imported projects/certificates | Counts, media and links match approved inventory |
| TST-018 | P0 | Missing WebGL/reduced motion | Content and navigation remain fully functional |
| TST-019 | P0 | Keyboard nav and main forms | No critical a11y failure; focus and errors usable |
| TST-020 | P0 | Production build and sitemap | Correct metadata/no drafts/no admin URLs |
| TST-021 | P0 | Backup restore | Restored staging copy matches sample records/assets manifest |
| TST-022 | P0 | Logout / invalid session | Protected pages and mutations inaccessible |
| TST-023 | P0 | Public API pagination abuse | Bounded max and validated cursor/sort |
| TST-024 | P0 | Error from external provider | Controlled failure/fallback, no secret disclosure |
| TST-025 | P1 | Audience modes | Explicit, reversible; correct ordering, shared source of truth |
| TST-026 | P1 | Blog/research publisher | Draft private, published indexed, revisions safe |
| TST-027 | P1 | GitHub integration outage | Portfolio core unchanged, cached/stale indicator if needed |
| TST-028 | P2 | AI portfolio assistant | Answers sourced only from approved published content |

Use PRD Section 11 launch acceptance checklist as the controlling product signoff. Each story links at least one `TST-*` and `TR-*` requirement.

---

## 17. CI/CD and deployment specification

### 17.1 Branching and environments

- Branches: protected `main`, short-lived `feat/*`, `fix/*`, `chore/*`; optional staging branch if warranted.
- Pull requests mandatory for production code; CI must complete before merge.
- Environments: `local`, `preview/staging`, `production`, each with isolated secrets/data.
- Vercel deploys preview on PR; production on approved main release according to branch protection.

### 17.2 Proposed commands

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test tests/accessibility",
    "check": "npm run lint && npm run typecheck && npm run test && npm run build"
  }
}
```

Command names and paths are suggested; update based on selected tool versions and verified installed configuration. CI should execute `npm ci`, formatting check, lint, typecheck, unit/integration, build, E2E against preview or test server, basic accessibility smoke, dependency audit and secret scan. OpenAPI validation and schema checks become mandatory when routes are introduced.

### 17.3 Deployment procedure

1. Review PR / CI artifact / change log / DB schema diff.
2. Test migration in staging; take backup/snapshot/export as applicable.
3. Deploy preview and execute smoke tests, including owner login and one draft/publish/unpublish cycle using test content.
4. Configure custom domain, DNS, TLS and official `SITE_URL`/Firebase authorized domains.
5. Deploy release with release tag and rollout checks (auth, DB, media, contact, SEO, Web Vitals).
6. Confirm production monitoring, backups, logs, analytics privacy statement and robots/sitemap behavior.
7. Maintain old GitHub Pages portfolio until redirect plan and new production acceptance are complete.
8. If regression: rollback application deployment; use backward-compatible schema migration or documented recovery plan.

**GitHub Pages limitation:** A Next.js app requiring server-side API handlers, MongoDB and Firebase Admin cannot run as a pure static GitHub Pages export. It needs compatible server hosting such as Vercel; preserve old URLs with an intentional domain/redirect strategy.

---

## 18. Content migration design

### 18.1 Phase 0 discovery requirements

Inspect actual files, routes, component props, content arrays/objects, public assets, project screenshots, references, certificates, certifications, social links, image formats and deployed content. Verify any GitHub repository links without altering content. Do not hallucinate achievements, credentials, URLs, dates, collaborator names or professional claims.

### 18.2 Pipeline

```text
Inventory React/Vite content and assets
 -> Map source fields into versioned import DTOs
 -> Produce human-review CSV/JSON inventory and discrepancies report
 -> Normalize dates, slugs, links, tech tags and media references
 -> Upload/import media with checksum and verified metadata
 -> Upsert draft records using deterministic external source keys
 -> Verify record counts, missing assets and broken links
 -> Owner approves publication batch
 -> Publish selected records, revalidate routes, test redirects
```

### 18.3 Migration controls

- Scripts support `--dry-run` and `--apply`; apply requires explicit target environment and confirmation.
- Migration is idempotent: rerunning does not create duplicates (source IDs, deterministic keys and upsert strategy).
- Never override owner-modified CMS records silently on rerun; detect conflict and generate report.
- Preserve originals in versioned backup; do not delete original repo until new deployment verified.
- Separate draft import from publication approval; newly imported content should default to draft.
- Cross-check number of projects, certificates, skills, education entries and missing images against inventory.
- Store source-to-destination mapping in `migration/manifest.json` (without secrets) and migration report in protected build artifact.

---

## 19. Engineering requirements register

| ID | Level | Requirement | Verification |
|---|---|---|---|
| TR-001 | P0 | Next.js App Router + strict TypeScript architecture | Build/typecheck |
| TR-002 | P0 | Public routes SSR/indexable without 3D | TST-018,020 |
| TR-003 | P0 | Firebase allowlisted one-admin server sessions | TST-001–004,022 |
| TR-004 | P0 | Server authorization on all admin actions | TST-001–004 |
| TR-005 | P0 | MongoDB schema and indexes match published DTO/query contracts | Integration tests |
| TR-006 | P0 | Optimistic concurrency for edits | TST-006,007 |
| TR-007 | P0 | Draft/publish/unpublish + cache invalidation | TST-005,008–010 |
| TR-008 | P0 | Constrained, signed, verified media flow | TST-011–013 |
| TR-009 | P0 | Public-only allowlisted JSON projection | TST-014 |
| TR-010 | P0 | Contact validation, anti-spam, privacy | TST-015,016 |
| TR-011 | P0 | Source content migrates with verifiable manifest | TST-017 |
| TR-012 | P0 | Accessible reduced-motion / non-WebGL fallback | TST-018,019 |
| TR-013 | P0 | Dynamic SEO, robots and sitemap excludes drafts | TST-020 |
| TR-014 | P0 | Logging, monitoring and no fabricated analytics | Observability review |
| TR-015 | P0 | Backups, restore runbook and tested recovery | TST-021 |
| TR-016 | P0 | Contract-driven OpenAPI and reproducible CI | CI proof |
| TR-017 | P1 | Audience modes with opt-in choice | TST-025 |
| TR-018 | P1 | Research/blog/timeline/revisions | TST-026 |
| TR-019 | P1 | Resilient read-only GitHub integration | TST-027 |
| TR-020 | P2 | Optional grounded AI assistant, no fabricated claims | TST-028 |

---

## 20. Detailed phased implementation roadmap and hard gates

### Phase 0 — Audit and migration inventory (MUST first)

**Deliver:** `docs/AUDIT.md`, `docs/MIGRATION.md`, source inventory JSON/CSV, screen/route inventory, assets manifest, initial quality/performance baseline, open questions and ADR-000 baseline decisions. **Gate:** No files modified destructively; content mappings accepted; all unknown facts labeled unknown. **AI agent prompt:** “Read PRD and TRD. Audit the repository, identify actual app version, routes, data and assets. Produce verified inventory and proposed migration map with file path evidence. Do not refactor or implement. Report assumptions, risks and questions as nonblocking recommendations.”

### Phase 1 — Repository foundation and design system

**Deliver:** New Next.js/TS app, lint/typecheck/test/build, responsive tokens/UI kit, route skeletons, layout, CI, `.env.example`, Zod env validation, ADR-001 versions/runtime. **Gate:** Fresh clone + `npm ci && npm run check` pass; no secrets; accessible shell and 404/error boundary. **AI prompt:** “Implement only Phase 1 with small PR-sized changes. Do not invent portfolio content. Show changed files, commands run, outputs and remaining risks. Stop after passing tests.”

### Phase 2 — Auth, DB and security foundations

**Deliver:** Firebase Admin/client SDK boundary, allowlist session flow, secure cookies, admin guard, CSRF/origin middleware/helper, MongoDB connection/migrations, core repositories, API envelope, rate-limit adapter, audit records. **Gate:** TST-001–004 and TST-022 pass; non-admin and forged-cookie access denied; admin HTML not leaked. **AI prompt:** “Implement the verified one-admin session architecture. Treat client identity and admin route paths as untrusted. Add negative tests before shipping. Do not proceed to CMS until access tests pass.”

### Phase 3 — Projects + media CMS

**Deliver:** Project schema CRUD, version conflict detection, publish/unpublish, signed verified uploads, project admin forms/lists, storage cleanup rules. **Gate:** TST-005–014 pass, publication cache behavior verified, no draft leakage. **AI prompt:** “Deliver projects and media end to end; do not start unrelated UI redesign. Verify publish/unpublish, stale revision, upload forgery and 404 tests.”

### Phase 4 — Other MVP content + contact

**Deliver:** Certificates, skills, education, experience, profile/settings, resume, messages inbox, anti-spam/contact, basic dashboard and audit views. **Gate:** Owner can update each content type without editing code, routes enforce auth, forms validate and show errors. **AI prompt:** “Complete MVP CMS one resource at a time using existing shared patterns. Keep statuses/DTOs consistent; demonstrate create/edit/archive/publish where applicable and run tests.”

### Phase 5 — Public MVP + progressive 3D

**Deliver:** Public pages, responsive layouts, project/certificate detail views, OG metadata, sitemap, lightweight hero R3F scene and static fallback. **Gate:** TST-018–020 pass; real content renders without WebGL, SEO can crawl, measured performance meets targets or documented exceptions with action plan. **AI prompt:** “Build accessible HTML-first public views using repository services. Add ONE lazy 3D hero island, verify reduced motion and mobile fallback, then run Lighthouse/axe/Playwright checks.”

### Phase 6 — Migration + security hardening + launch

**Deliver:** Idempotent migration, verified media, content review, production deployment, backups, incident/rollback runbooks, launch checklist, production monitoring. **Gate:** TST-017,021 pass, all P0 tests green, security audit complete, backups restored in staging, owner approves real published content. **AI prompt:** “Run migration dry-run, produce discrepancy report, only apply to approved target. Verify content equality and publication, then execute hardening and deploy checklist. Never expose secrets or fabricate completion.”

### Phase 7 — Audience-specific experiences (P1)

**Deliver:** `/for/*` landing pages, explicit audience switch, reversible preference, CTA/presentation customization. **Gate:** TST-025, accessibility and SEO regression pass.

### Phase 8 — Editorial/research features (P1)

**Deliver:** Blog, research, timeline, revisions, testimonial approval and richer SEO/page management. **Gate:** TST-026 and content safety regression pass.

### Phase 9 — Integrations/analytics (P1)

**Deliver:** Read-only GitHub sync/caching, search, advanced analytics, exports and operator dashboards. **Gate:** TST-027 and privacy/third-party failure tests pass.

### Phase 10 — Optional V2 experiments

**Deliver:** AI assistant strictly grounded in approved published pages, localization, experimental immersive scenes, advanced resume generation. **Gate:** Each feature gated by measurable value, safety/privacy review and fallback tests; does not harm baseline performance.

### Every-phase Definition of Done

1. Planned scope and acceptance tests identified before coding.
2. Changes trace to `TR-*` and PRD story/route.
3. Types/Zod/DB/API schemas consistent; OpenAPI updated if contract changed.
4. Unit/integration/E2E/security/a11y tests appropriate to scope pass.
5. `npm run lint`, `npm run typecheck`, `npm run build` pass and test evidence attached.
6. Screenshots/performance evidence supplied for UI/3D changes.
7. No new secrets, broken links, fictitious claims or draft/public leaks.
8. Documentation, migration instructions and deployment flags updated.
9. Agent reports actual executed commands/results, blockers, files changed and next safe step—never claim verified without running checks.
10. Human review approves merge/release gate.

---

## 21. AI coding agent operating protocol

### 21.1 Master system prompt for Codex / Antigravity / Cursor

```text
You are the lead engineer for a production-quality, dynamic 3D portfolio and private CMS.
Read docs/PRD.md and docs/TRD.md fully before any changes.
The PRD controls product scope; the TRD controls implementation details.
Build in verified phases, starting with Phase 0 audit. Do not skip hard gates.

Nonnegotiable:
- Next.js App Router + TypeScript; single-owner Firebase session auth; MongoDB.
- Server-side authorization for all admin UI data and API mutations.
- Public content is indexable semantic HTML, never dependent on WebGL.
- All uploads verified server-side; secrets stay server-side.
- All published data must come from verified sources or owner-authored CMS entries.
- Use Zod schemas, explicit DTO projections, revision conflict checks and audit logs.
- Keep changes small and well-scoped; do not rewrite unrelated parts.
- Preserve source content until migration approved and verified.
- Match API envelope and /api/v1 routes specified in docs.
- Avoid untested claims. Never report 'complete' without command/test evidence.

For each assigned phase:
1. Read relevant requirements and inspect existing code.
2. Produce a concise file-level implementation plan and risk list.
3. Implement only approved scope, including negative/security tests.
4. Run available lint, typecheck, tests, build and relevant E2E.
5. Summarize changed files, API/schema diffs, exact test outcomes, risks and gaps.
6. Stop at the phase gate and request owner review before next phase.

If a requirement is ambiguous, select the safer reversible implementation,
document the assumption/ADR, and avoid blocking the whole phase unless
security, data loss or contract breakage would result.
```

### 21.2 Single-task prompt template

```text
Implement [TR-xxx / user story] in Phase [N].
Source of truth: docs/PRD.md and docs/TRD.md.
Scope: [specific routes/models/components].
Out of scope: [unrelated features].
Acceptance: [TST-xxx tests and exact observable behaviors].
Constraints: preserve public DTO and /api/v1 response contracts;
no secret exposure; no WebGL dependency for core functions.
Deliver: changed-file list, testing commands and output, screenshots when UI,
new/updated OpenAPI specification, risks, next gate status.
```

### 21.3 Phase verification prompt

```text
Audit Phase [N] against PRD/TRD. Do not implement new features.
For each requirement: classify PASS / FAIL / PARTIAL / NOT TESTED.
Provide file paths and exact evidence, tests actually executed, and reproduction steps
for each failure. Inspect auth bypasses, draft leakage, validation, stale edits,
cache behavior, security headers and performance as relevant.
Produce a prioritized fix backlog and say whether the phase gate is satisfied.
```

---

## 22. Architecture decisions, ambiguities and change control

Required ADRs before or during phases:

- **ADR-001:** Runtime versions, package manager, Next.js caching choice and hosting limitations.
- **ADR-002:** Firebase admin session-cookie TTL, revocation checks, CSRF design.
- **ADR-003:** Cloudinary upload constraints, SVG/PDF handling and media retention.
- **ADR-004:** Content editor format (Markdown vs structured rich text), sanitization rules.
- **ADR-005:** Slug change, redirect and SEO invalidation behavior.
- **ADR-006:** Backup method and selected RPO/RTO targets based on service tier.
- **ADR-007:** Project publish cover asset fallback policy and detailed case-study minimum.
- **ADR-008:** Certificates publication endpoint and public link policy.
- **ADR-009:** GitHub Pages old-site redirect / production domain strategy.

Any change in scope, contract or security posture needs a documented ADR/PRD amendment and updated test cases. Keep changes reversible and prioritize user content safety.

### Open items for Phase 0 (not invitations to invent answers)

1. Actual shape of existing projects/certificates/skills/experience and asset licensing.
2. Existing image/logo and 3D model availability; decide whether to create new assets.
3. Domain selection and whether old GitHub Pages URLs should redirect.
4. Preferred resume asset and public email/contact method.
5. Selected analytics, email and Redis providers/tier limitations.
6. Cloudinary folder and permission policies; expected upload size and volume.
7. Production traffic assumptions and selected budget/service quotas.
8. Appropriate privacy policy, retention and geographic legal requirements.

---

## 23. Release acceptance checklist

A production MVP release is **not approved** until all boxes have real evidence:

- [ ] Owner verifies migration inventory and factual content.
- [ ] `npm ci`, lint, TypeScript, unit/integration and production build pass in CI.
- [ ] All P0 `TST-*` acceptance tests pass, including forged auth, CSRF, draft leakage, media forgery and stale edit.
- [ ] Public pages, metadata, sitemap and redirects verified on preview and production domain.
- [ ] Admin CRUD/publish/edit/archive and media workflow tested by owner.
- [ ] Non-WebGL, reduced-motion, mobile and keyboard accessibility tested.
- [ ] LCP/INP/CLS monitored and launch performance budget reviewed on realistic devices.
- [ ] Security headers, admin allowlist, secret scan, dependency scan and origin protections verified.
- [ ] Contact delivery, anti-spam and failure handling tested without exposing personal messages.
- [ ] Database export/backup and restore rehearsed in staging.
- [ ] Monitoring, runbook, rollback, DNS/TLS and old-site migration plan checked.
- [ ] No placeholder metrics, unverified credentials, invented testimonials or stale draft links.
- [ ] Explicit owner production signoff recorded.

---

## 24. Source-of-truth and handoff artifacts

| Artifact | Owner/producer | Purpose |
|---|---|---|
| `docs/PRD.md` | Product owner | Scope, user flows and acceptance |
| `docs/TRD.md` | Engineering | Design and implementation contract |
| `docs/AUDIT.md` | Phase 0 agent | Evidence of existing repository state |
| `docs/MIGRATION.md` + manifest | Engineering + owner | Content mapping and integrity report |
| `docs/ADR/*.md` | Lead engineer | Tradeoffs and decisions |
| `docs/openapi.yaml` | API implementer | Versioned machine-readable contract |
| `docs/RUNBOOK.md` | Engineering/operator | Deploy, rollback, incident recovery |
| `.env.example` | Engineering | Config names and safe local bootstrap |
| CI test reports/screenshots | CI/QA | Objective gate evidence |
| Release checklist + signoff | Owner | Launch authorization |

**Authoritative references to verify during implementation:** Next.js App Router docs; Firebase Admin session-cookie and token verification docs; MongoDB/Mongoose docs; Cloudinary signed upload docs; React Three Fiber/Three.js docs; OWASP ASVS and cheat sheets; WCAG 2.2; Google Search Central and web.dev Core Web Vitals; Vercel hosting and environment docs. Version-dependent behaviors MUST be checked against current official documentation when installing/configuring dependencies.

---

**End of PORTFOLIO-TRD-001 v1.0.**
