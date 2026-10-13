# Dynamic 3D Portfolio & Personal CMS — Production Product Requirements Document

**Document ID:** PORTFOLIO-PRD-001  
**Version:** 1.0  
**Date:** 2026-10-13  
**Status:** Approved architecture / proposed implementation specification  
**Owner:** Md. Sabbir Hossen  
**Delivery model:** Phased, AI-assisted development with human approval gates  
**Baseline site:** https://msabbirhossen.github.io/  
**Baseline source:** https://github.com/MSabbirHossen/MSabbirHossen.github.io  

> This is an implementation specification, not a claim that the existing repository has been audited. Before changing existing content, the implementation agent MUST inspect the repository, document actual fields and assets, and create an approved migration inventory. Versions below are technology choices; install current compatible stable releases after checking official compatibility and locking dependencies.

---

## 1. Executive summary

Build a distinctive yet accessible portfolio and single-owner content management system (CMS). Public visitors receive a fast, SEO-indexable professional website with a selective 3D visual layer; its owner receives a private admin panel to update projects, certificates, skills, education, research, articles, work history, navigation, SEO and media without editing code. The site incorporates existing portfolio content after verified migration and supports explicitly selected audience modes for recruiters, clients, developers, researchers and general visitors.

**Decisions:** Next.js App Router + TypeScript; premium minimal/editorial visual direction with selective 3D; phased MVP-to-V2 delivery; migrate existing React/Vite portfolio content. No public registration, student roles, payments, ecommerce, or multi-admin permissions in V1.

**North-star success:** The owner can publish a fully formed project case study, with media, skills, metadata and links, using only the admin dashboard; the public page becomes indexable, discoverable and accessible after publish without deployment or code edits.

### 1.1 Product principles
1. Content ownership: all professional content must be managed by structured records and portable exports.
2. Progressive enhancement: an excellent HTML-first experience works without 3D, motion or JavaScript where technically practicable.
3. Secure by default: one verified admin; server-side authorization on every mutation; private storage boundaries.
4. No fake proof: never fabricate experience, credentials, endorsements, visitor counts or metrics.
5. Editorial polish: consistent hierarchy, whitespace, motion, real screenshots and detailed engineering narratives.
6. Continuous delivery: deploy smaller verified increments with rollback rather than one enormous release.

### 1.2 Users and jobs-to-be-done
| Persona | Need | Critical action | Success signal |
|---|---|---|---|
| Owner/admin | Maintain portfolio without code | Create/preview/publish content | New project published end-to-end |
| Recruiter | Assess fit quickly | Skills, experience, projects, resume, contact | Finds evidence and resume in <=3 clicks |
| Client | Evaluate capability and reach out | Case studies, services, contact | Submits valid inquiry |
| Developer | Examine technical decisions | Stack, repos, architecture, articles | Navigates to repository and case study |
| Research collaborator | Explore interests and work | Education, research, contact | Finds accurate interests and email |
| General visitor | Discover professional story | Hero, highlights, timeline | Navigation remains intuitive on mobile |

### 1.3 Scope priorities
- **P0 / MVP:** Authentication; content models; core CMS CRUD and publishing; media uploads; public homepage/about/projects/project detail/skills/education/certifications/experience/contact/resume; migrations; SEO; analytics basics; production security and testing; modest progressive 3D hero.
- **P1 / V1.5:** Audience selector and audience landing pages; richer case studies; blog; research; timeline; testimonials; revisions; GitHub integration; dynamic navigation and settings; advanced analytics and search.
- **P2 / V2:** AI portfolio assistant grounded in approved content; multilingual UI; advanced 3D experiences; scheduled publishing; advanced resume variants; collaboration/calendar integrations.
- **Out of scope:** public accounts; multi-tenancy; payment processing; open user-generated reviews without moderation; automatic claims about skills; live code execution on public site.

---

## 2. Information architecture and routing

### 2.1 Public pages
| Path | Phase | Data | Required behavior |
|---|---|---|---|
| `/` | MVP | Page settings, featured projects, short bio | Clear hero, selected projects, CTA, selective 3D fallback |
| `/about` | MVP | Profile, story | Bio, experience, professional interests |
| `/projects` | MVP | Projects | Search/filter by tags/stack/category; published only |
| `/projects/[slug]` | MVP | Project record | Case study, stack, media, GitHub/demo, SEO |
| `/skills` | MVP | Skills | Categorized skills with evidence links; no arbitrary percentages required |
| `/experience` | MVP | Experience | Work, volunteering, leadership chronology |
| `/education` | MVP | Education | Institutions, degrees, dates |
| `/certifications` | MVP | Certificates | Grid/list, category filtering, verification |
| `/certifications/[slug]` | MVP | Certificate | Validity, credential link, downloadable/public media where permitted |
| `/resume` | MVP | Resume | Accessible HTML summary plus maintained downloadable PDF |
| `/contact` | MVP | Settings / messages | Form, contact destinations, legal notice |
| `/for/recruiters` | V1.5 | Shared records | Resume, qualifications, top evidence, CTA |
| `/for/clients` | V1.5 | Shared records | Services, portfolio, outcomes, CTA |
| `/for/developers` | V1.5 | Shared records | Repos, case studies, architecture |
| `/for/researchers` | V1.5 | Shared records | Publications, research interests, collaborations |
| `/for/visitors` | V1.5 | Shared records | Broad exploration, personal story |
| `/research`, `/research/[slug]` | V1.5 | Research | Publication/project pages with verified links |
| `/blog`, `/blog/[slug]` | V1.5 | Posts | Category filters, sanitized rich content |
| `/timeline` | V1.5 | Events | Accessible chronological list with optional 3D embellishment |
| `/achievements`, `/uses`, `/now`, `/links` | V1.5 | CMS records | Curated supporting content |
| `/guestbook` | V2 optional | Moderated submissions | Off until spam and moderation controls exist |
| `/privacy` | MVP | Policy | Transparent analytics, cookies and contact handling |
| `/sitemap.xml`, `/robots.txt` | MVP | Published pages | Accurate indexable routes; exclude admin/drafts |
| `/not-found` and error boundaries | MVP | Static | Helpful recovery paths |

Use clean canonical URLs, consistent trailing-slash policy, and permanent redirects for changed slugs. Do not leak draft slugs in sitemap or search.

### 2.2 Owner-only pages
| Path | Phase | Permissions |
|---|---|---|
| `/admin/login` | MVP | Anonymous login entry |
| `/admin` | MVP | Overview, real metrics only |
| `/admin/projects`, `/admin/projects/new`, `/admin/projects/[id]/edit` | MVP | Project CRUD + publish |
| `/admin/certifications`, `/admin/certifications/new`, `/admin/certifications/[id]/edit` | MVP | Certificate CRUD |
| `/admin/skills`, `/admin/education`, `/admin/experience` | MVP | Managed CRUD |
| `/admin/media` | MVP | Signed uploads, metadata, cleanup |
| `/admin/messages` | MVP | Inquiries, reply-status, delete |
| `/admin/profile`, `/admin/settings` | MVP | Personal profile and site metadata |
| `/admin/resume` | MVP | Public PDF and content alignment |
| `/admin/seo`, `/admin/navigation`, `/admin/pages` | V1.5 | Fine-grained site editing |
| `/admin/blog`, `/admin/research`, `/admin/timeline` | V1.5 | Structured CRUD |
| `/admin/testimonials`, `/admin/revisions` | V1.5 | Moderation and rollback |
| `/admin/analytics`, `/admin/audit-logs` | MVP basics / V1.5 advanced | Readable reports and security audit |
| `/admin/backups`, `/admin/security` | V1.5 | Export/restore and sessions |

Admin pages must render only following server-side identity verification; client-side route guards alone are insufficient.

### 2.3 Navigation conventions
- Public header: Work, About, Skills, Credentials, Research (when populated), Contact; resume CTA; theme toggle; audience switch in V1.5.
- Mobile: single accessible menu with clear close control and focus management.
- Admin: sidebar grouped Dashboard, Content, Media, Communications, Insights, Configuration.
- Public audience preference must be explicit and reversible; no profession guessing. May persist locally with notice; site content remains available in all modes.

---

## 3. Experience and UI specification

### 3.1 Art direction
- Positioning: premium developer/researcher portfolio, **not a game**.
- Fonts: modern variable sans with strong typography and optional mono for code labels.
- Tokens: charcoal `#09090F`, deep surface `#181824`, light `#FAFAFC`, violet `#8B5CF6`, blue `#38BDF8`; contrast-tested refinements permitted.
- 8px spacing scale, 12-column desktop grid, generous whitespace; consistent max content width; responsive image grids.
- States for every control: default, hover, active, focus-visible, disabled, skeleton, empty, error, success.
- Reuse semantic HTML and accessible UI primitives; prevent layout shifts and motion-only disclosures.

### 3.2 Public home sections (ordered)
1. Navigation and skip link.
2. Hero with real name, clearly stated current professional identity, primary CTA (`Explore projects`), secondary (`Contact` or `Resume`), optional lightweight 3D scene.
3. Select case studies (maximum ~3-6 featured; CMS order).
4. Capabilities with validated evidence (project backlinks).
5. Short about/story section.
6. Featured credentials and education.
7. Research/teaching/community highlights only if verified and available.
8. Contact CTA.
9. Footer, social links, policy.

### 3.3 Project detail template
Breadcrumbs; title/subtitle; role/date/status; overview; problem; constraints; solution; significant features; stack; architecture diagram or image; implementation decisions; outcomes (qualitative or verifiable quantitative); gallery/video; challenges; learnings; GitHub/demo/related work. Missing optional data must omit gracefully, never show placeholder claims.

### 3.4 CMS usability
- Desktop-first admin with functional tablet/mobile layouts.
- Autosave **drafts only** with conflict detection or explicit save; published changes require explicit publish action.
- Unsaved changes guard; preview links with expiry and authorization; accessible confirmations for destructive actions.
- Tables with search, filtering, sort, pagination, status and bulk actions.
- Validation errors inline and summarized; server response errors actionable.
- Asset picker, alt-text requirement for informative images, input-length counters.
- Preview desktop/mobile without leaking drafts publicly.

### 3.5 Selective 3D
| Element | Phase | Interaction | Degradation |
|---|---|---|---|
| Hero scene | MVP | Subtle parallax and ambient movement | Static AVIF/WebP poster |
| Project cards | V1.5 | Small tilt/depth hover; CSS preferred | Flat cards |
| Skills constellation | V2 | Clickable nodes paired with HTML index | Accessible skills list |
| Journey timeline | V2 | Motion-assisted milestone visual | Semantic ordered list |

3D standards: `@react-three/fiber` + `@react-three/drei`; use GLB/glTF with compressed geometry/textures, cap draw calls, dynamically import browser-only canvas, pause hidden animations, adapt pixel ratio, avoid perpetual rendering when idle, and test WebGL context failures. Primary text and navigation are **never** rendered as inaccessible canvas-only text. Support `prefers-reduced-motion` and reduced-data or device constraints where available. Avoid auto-play sound.

---

## 4. Technical architecture

### 4.1 Stack
| Concern | Choice |
|---|---|
| Frontend + backend | Next.js App Router, TypeScript, React; Server Components where suitable, Route Handlers for HTTP API |
| UI | Tailwind CSS, shadcn/ui-style Radix primitives, CSS design tokens |
| 3D | Three.js, React Three Fiber, Drei; selective GSAP/Motion if necessary |
| DB | MongoDB Atlas + Mongoose, server-only access |
| Auth | Firebase Authentication Google sign-in; Firebase Admin verification; secure server session cookie |
| Validation | Zod shared DTO schemas + Mongoose schema validation |
| Forms | React Hook Form |
| Editor | Tiptap with a restrictive renderer/sanitizer, or Markdown pipeline |
| Media | Cloudinary or comparable managed image service; explicit storage adapter abstraction |
| Mail | Provider transactional email API; owner notifications and controlled reply links |
| Analytics | Privacy-conscious aggregated product analytics; no invented dashboard metrics |
| Monitoring | Sentry and hosting logs; alert on critical failures |
| CI | GitHub Actions; lint, format, typecheck, unit, integration, E2E, build, audits |
| Deployment | Vercel hosting, MongoDB Atlas, Firebase project, media service |

Do not commit to major version numbers until the bootstrap phase verifies compatibility. Keep Next.js and Firebase server libraries out of Edge runtime routes when Node APIs are required. Use shared Mongoose connection caching and register models safely under hot reload.

### 4.2 Data flow
1. Server-rendered public pages query **published** data through a server-only repository layer.
2. Admin signs in through Firebase client SDK and exchanges a short-lived ID token for an `HttpOnly`, `Secure`, `SameSite=Lax` session cookie using a hardened session endpoint.
3. Admin mutations call protected Route Handlers; each verifies the session, UID allowlist/custom claim, revocation policy, origin/CSRF protection, and Zod payload.
4. Mutations update MongoDB and append audit logs; publish operations trigger exact cache revalidation for affected pages and lists.
5. Media goes through authorized signed/direct uploads, then a finalization endpoint validating ownership and asset metadata.
6. Contact submissions use server validation, rate limits, bot mitigation and an email notification queue/provider; users never receive private details.

### 4.3 Suggested repository layout
```text
src/
  app/
    (public)/
      page.tsx
      about/page.tsx
      projects/page.tsx
      projects/[slug]/page.tsx
      certifications/page.tsx
      ...
    admin/
      login/page.tsx
      (protected)/layout.tsx
      (protected)/page.tsx
      (protected)/projects/...
    api/v1/
      auth/session/route.ts
      auth/logout/route.ts
      public/...
      admin/...
      contact/route.ts
    sitemap.ts
    robots.ts
  components/
    ui/  layouts/  portfolio/  admin/  three/
  features/
    projects/  certifications/  skills/  content/  media/
  server/
    auth/  db/  repositories/  services/  security/
  lib/
    validators/  api/  seo/  constants/  utils/
  models/
  styles/
  types/
  tests/
    unit/  integration/  e2e/
public/
  fallback/  models/
scripts/
  inventory/  migrate/  seed/  backup/
docs/
  ADR/  plans/  runbooks/  api/
```
Strict dependency rule: public UI -> server services -> repositories -> models; never import database modules into Client Components. Use service-level authorization, not duplicated ad-hoc guards.

---

## 5. MongoDB data model specification

All collections: `_id: ObjectId`, `createdAt`, `updatedAt` where appropriate. For public entities: `status: draft|published|archived`, `publishedAt?`, `slug` unique, `seo?: {title,description,ogAssetId,canonicalUrl,noIndex}`, `sortOrder`, `createdByUid`, `updatedByUid`. Add unique indexes and indexes matching actual query plans. Keep publication state explicit. Avoid storing binary blobs inside MongoDB.

| Collection | Key fields | Indexes / relations |
|---|---|---|
| `admins` | `firebaseUid`, `email`, `enabled`, `lastLoginAt` | unique `firebaseUid`; single approved account |
| `projects` | `title`, `slug`, `tagline`, `summary`, `overview`, `problem`, `solution`, `features[]`, `outcomes[]`, `role`, `status`, `startDate`, `endDate`, `coverAssetId`, `galleryAssetIds[]`, `demoUrl`, `repositoryUrl`, `architecture`, `techSkillIds[]`, `categoryIds[]`, `featured`, `sortOrder`, `seo` | unique slug; compound status+featured+sortOrder; skills refs |
| `certifications` | `title`, `slug`, `issuer`, `issuedAt`, `expiresAt?`, `credentialId?`, `verificationUrl?`, `assetId?`, `skillIds[]`, `description`, `status`, `seo` | unique slug; status+issuedAt |
| `skills` | `name`, `slug`, `category`, `description?`, `iconAssetId?`, `evidenceProjectIds[]`, `sortOrder`, `visible` | unique slug; category+sortOrder |
| `experiences` | `organization`, `title`, `employmentType`, `location?`, `startDate`, `endDate?`, `highlights[]`, `links[]`, `visible`, `sortOrder` | startDate |
| `educations` | `institution`, `degree`, `field`, `startDate`, `endDate?`, `summary?`, `achievements[]`, `visible` | startDate |
| `posts` | `title`, `slug`, `excerpt`, `body` (sanitized rich content or Markdown), `tags[]`, `coverAssetId`, `status`, `publishedAt`, `seo` | unique slug, status+publishedAt; optional text/search index |
| `research` | `title`, `slug`, `type`, `summary`, `authors[]`, `date?`, `doi?`, `publicationUrl?`, `pdfAssetId?`, `relatedProjectIds[]`, `status`, `seo` | unique slug; status+date |
| `mediaAssets` | `storageProvider`, `providerAssetId`, `publicId`, `url`, `mimeType`, `width?`, `height?`, `bytes`, `altText?`, `caption?`, `ownerUid`, `usageRefs[]`, `visibility`, `status` | provider asset unique; usage refs; status |
| `messages` | `name`, `email`, `subject`, `message`, `status`, `receivedAt`, `metadata` (minimal, retention-limited) | status+receivedAt |
| `testimonials` | `name`, `relationship`, `quote`, `consentRecordedAt`, `status`, `sortOrder` | status+sortOrder |
| `timelineEvents` | `title`, `date`, `type`, `summary`, `linkedContent?`, `visible` | date |
| `pageContent` | `pageKey`, `sections[]` (typed discriminated block schema), `status`, `seo`, `revision` | unique pageKey |
| `siteSettings` | singleton `key`, `profile`, `contact`, `socials[]`, `theme`, `featureFlags`, `analyticsConsentConfig` | unique key |
| `navigation` | `key`, `items[]` with route/label/sort/visibility | unique key |
| `resumeVersions` | `label`, `audience`, `assetId`, `isDefault`, `publishedAt` | audience+isDefault |
| `contentRevisions` | `entityType`, `entityId`, `version`, `snapshot`, `authorUid`, `createdAt`, `changeNote` | entityType+entityId+version unique |
| `auditLogs` | `actorUid`, `action`, `entityType`, `entityId`, `timestamp`, `result`, `requestId`, sanitized metadata | timestamp+actorUid; append-only |
| `redirects` | `fromPath`, `toPath`, `httpStatus` | unique fromPath |

**Model rules:**
- Prevent unsafe HTML/script injection in stored content; sanitize on input **and** rendering where applicable.
- External links must be normalized and limited to `https:` (plus `mailto:` for approved contact URLs); block `javascript:`.
- `publishedAt` is not sufficient without `status=published` for visibility.
- Allow references to missing/unpublished related entities without crashing public pages; hide invalid references and report them in CMS.
- Hard delete only when not referenced, otherwise require unlinking or soft delete; media deletion verifies storage ownership and usage.
- Track edit revision or `updatedAt` precondition to prevent conflicting writes.

### 5.1 Example project DTO
```json
{
  "title": "Life-OS",
  "slug": "life-os",
  "tagline": "An integrated personal management dashboard",
  "summary": "A unified application for managing daily routines.",
  "categoryIds": [],
  "techSkillIds": [],
  "features": ["Dashboard", "Habit tracking"],
  "repositoryUrl": "https://github.com/MSabbirHossen/Life-OS",
  "demoUrl": null,
  "coverAssetId": null,
  "featured": true,
  "status": "draft",
  "seo": {"title": "Life-OS | Portfolio", "description": "Case study of Life-OS"}
}
```
**Example only:** confirm all real content, project links and claims during migration.

---

## 6. API contract (versioned)

**Base path:** `/api/v1` for JSON API. Public pages may query repository services directly on the server instead of using HTTP internally; keep these APIs for client filtering and admin operations.

### 6.1 Conventions
- JSON UTF-8; `Content-Type: application/json` on writes.
- Success: `{ "success": true, "data": ..., "meta"?: { "page", "limit", "total", "nextCursor" } }`.
- Failure: `{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details"?: [...] }, "requestId": "..." }`.
- Expected error codes: `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `VALIDATION_ERROR` (422), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500).
- Queries use validated bounded `limit` (e.g. default 12/max 50) and cursor or page; sort fields strictly allowlisted.
- Admin writes require cookie session + CSRF/origin checks + authorization; POST create, PATCH partial update, DELETE soft-delete or archival (document per resource).
- `Idempotency-Key` on important actions such as media finalization and publishing where duplicate retries are plausible.
- Do not expose raw Mongoose documents, internal secrets, private audit fields or contact messages in public endpoints.
- Swagger/OpenAPI schema should be generated or manually maintained and checked in CI.

### 6.2 Public read routes
| Method | Route | Notes |
|---|---|---|
| GET | `/public/profile` | Public bio and social links |
| GET | `/public/projects?category=&skill=&q=&cursor=&limit=` | Published only |
| GET | `/public/projects/:slug` | Published details or 404 |
| GET | `/public/certifications?...` | Public credentials |
| GET | `/public/certifications/:slug` | Verified detail |
| GET | `/public/skills` | Displayable skills |
| GET | `/public/experience` | Visible records |
| GET | `/public/education` | Visible records |
| GET | `/public/posts?...` | V1.5 |
| GET | `/public/research?...` | V1.5 |
| GET | `/public/navigation` | Public menu |
| POST | `/contact` | Validated and rate limited; no public messages listing |

### 6.3 Auth routes
| Method | Route | Function |
|---|---|---|
| POST | `/auth/session` | Verify Firebase ID token, allowed UID, CSRF, token recency; issue secure session cookie |
| GET | `/auth/me` | Current authorized admin identity or 401 |
| POST | `/auth/logout` | Clear cookie; optionally revoke refresh tokens for all-device logout |

Session cookies must be `HttpOnly`, `Secure` in production, `SameSite=Lax` or stricter after testing, restricted `Path`, short TTL appropriate to single admin; no persistence of Firebase tokens in localStorage. Check revocation for sensitive routes/session lifecycle per Firebase guidance. Protect against login CSRF and session fixation. Use Admin SDK **only** server-side. Rate-limit login exchange and contact endpoints.

### 6.4 Admin endpoints
| Method | Route | Function |
|---|---|---|
| GET, POST | `/admin/projects` | List all states / create draft |
| GET, PATCH, DELETE | `/admin/projects/:id` | Retrieve/update/archive |
| POST | `/admin/projects/:id/publish` | Validate required fields, publish, revalidate caches |
| POST | `/admin/projects/:id/unpublish` | Hide from public and revalidate |
| POST | `/admin/projects/:id/duplicate` | Create new draft clone |
| GET, POST | `/admin/certifications` | List/create |
| GET, PATCH, DELETE | `/admin/certifications/:id` | Retrieve/update/archive |
| GET, POST, PATCH, DELETE | `/admin/skills`, `/admin/skills/:id` | Skill CRUD |
| GET, POST, PATCH, DELETE | `/admin/education`, `/admin/education/:id` | Education CRUD |
| GET, POST, PATCH, DELETE | `/admin/experience`, `/admin/experience/:id` | Experience CRUD |
| GET, PATCH | `/admin/profile` | Owner profile |
| GET, PATCH | `/admin/settings` | Site settings |
| POST | `/admin/media/sign-upload` | Generate constrained signed upload authorization |
| POST | `/admin/media/finalize` | Verify asset and persist metadata |
| GET, PATCH, DELETE | `/admin/media`, `/admin/media/:id` | Library management |
| GET, PATCH, DELETE | `/admin/messages`, `/admin/messages/:id` | Inbox status/delete |
| GET, PATCH | `/admin/resume` | PDF references and summary |
| GET | `/admin/audit-logs` | Read own actions with pagination |
| GET | `/admin/dashboard` | Actual counts, never placeholders |
| GET | `/admin/export` | Authenticated portable export; later phase |

V1.5 repeat standard CRUD conventions for posts, research, timeline, testimonials, page content, navigation, revisions and redirect rules.

### 6.5 Representative request and response
`POST /api/v1/admin/projects`
```json
{
  "title": "Import Export Hub",
  "slug": "import-export-hub",
  "summary": "An importer-exporter web application",
  "status": "draft",
  "techSkillIds": []
}
```
`201 Created`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "title": "Import Export Hub",
    "slug": "import-export-hub",
    "status": "draft",
    "revision": 1
  }
}
```
`PATCH` requires current revision or `If-Match` and returns `409 CONFLICT` for stale edits. `POST publish` requires title, unique slug, summary, valid links, cover media (or approved placeholder fallback), public-ready case study minimum fields and valid SEO metadata. Publishing is a privileged distinct action.

### 6.6 Contact anti-abuse
Form: name, validated email, subject, message, consent checkbox where legally required; hidden honeypot, server throttling, duplicate suppression, spam challenge based on abuse level. Store only necessary details; avoid logging email/body; prevent header injection. Send notification via server-side email API with verified sender domain. Always give users an accessible success/failure state and avoid leaking internal deliverability details.

---

## 7. Authentication and security threat model

**Adversaries:** unauthorized users guessing admin URLs; forged sessions; cross-site request attacks; XSS in content; malicious file uploads; contact spam; leaked tokens; insecure dependency; NoSQL query injection; server-side request forgery; destructive accidental edits; poisoned analytics.

### 7.1 Mandatory defenses
1. Explicit Firebase UID allowlist from server environment; optionally Firebase admin custom claim but claim alone must not authorize an unapproved UID.
2. Verify Firebase session cookies using Admin SDK server side for every admin API call and protected rendering; session expiry/revocation policy.
3. Harden login exchange: CSRF tokens/origin verification, allowlist, recent authentication, HTTPS, no caching.
4. On every state-changing cookie-authenticated route, verify CSRF token and/or robust Origin/Referer policy plus `SameSite`; include defense in depth.
5. Strong `Content-Security-Policy`, strict `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS on HTTPS domain; accommodate Firebase and media hosts precisely.
6. Zod validate and length-limit request bodies; prevent arbitrary MongoDB operators and mass assignment by allowlisting update fields.
7. Sanitize rich text and URLs; do not dangerously render untrusted markup.
8. Upload allowlists for MIME and extension plus server/provider file checks, size limits, safe filenames, max pixels, and private/public policy. No executable content; treat PDF preview separately; scan if supported.
9. Rate limit authentication, contact and sensitive mutation endpoints. Use durable provider-backed limiter for multi-instance environments.
10. Least-privilege database user, separate staging and production resources and secret sets, encrypted HTTPS connections.
11. Never ship Firebase Admin private key, MONGODB_URI, provider signing secret or mail key to client or GitHub. `.env.example` has placeholders only.
12. Structured audit logging for login, content publish/unpublish, delete, settings and media changes; sanitize IP/user agent retention.
13. Backup and restore tests; recovery runbook; secret rotation procedure.
14. Dependency updates with lockfile, SCA and secret scan in CI. 2FA on GitHub, Firebase and hosting accounts.
15. Privacy policy, data retention, delete/export contact requests as applicable; no fingerprint-based audience profiling.

### 7.2 Admin access acceptance tests
- Anonymous request to admin API => 401.
- Valid non-owner Firebase user => 403 even with a valid Firebase identity token.
- Client-side role spoofing => no elevated privileges.
- Expired/revoked session => 401 and reauthentication.
- Malicious HTML field => sanitized/rejected; no execution.
- CSRF mutation without valid defense => rejected.
- Public visitor cannot retrieve draft via slug, API, sitemap, OG endpoint or cached result.

---

## 8. SEO, accessibility and web performance

### 8.1 Public technical SEO
- Meaningful server-rendered page headings and text, unique title/description and Open Graph/Twitter cards.
- Dynamic sitemap contains only published indexable routes; `/admin`, preview and APIs disallowed from indexing.
- `robots.txt`, canonical URL, 301 redirects for changed slugs and structured data (`Person`, `WebSite`, `Article` where appropriate, `BreadcrumbList`).
- 404 for unpublished/removed content; revalidate sitemap and lists on publish/unpublish.
- Social preview smoke test with real image/metadata.

### 8.2 Accessibility
WCAG 2.2 AA as a release goal: keyboard operation; visible focus; skip link; semantic headings; sufficient contrast; accessible controls/forms; sensible motion reduction; screen-reader compatible content; correct alt text/captions; no essential 3D interaction; accessible error summaries; disabled animation toggle. Automated scans are necessary but manual checks remain mandatory.

### 8.3 Performance budgets and targets
- Field Core Web Vitals at p75 on production mobile: **LCP <=2.5s, INP <=200ms, CLS <=0.1**.
- Lighthouse CI guidance for representative mobile pages: performance >=90 on non-3D pages; accessibility >=95; SEO >=95, interpreted as lab checks rather than guarantees.
- Initial JavaScript goal: avoid Three.js loading on non-3D routes; monitor route-specific transferred bytes; establish measured budgets in phase 1.
- Compressed hero 3D asset initially aim <=500KB-1MB over wire, tune after device tests; static poster must be significantly lighter.
- No autoplay heavy scenes on low-powered devices; adaptive DPR and scene complexity; stop loops when offscreen or page hidden.
- Images sized with explicit aspect ratios and optimized responsive derivatives; no render-blocking third-party scripts.
- Cache public page responses appropriately; cache invalidation on publish and delete verified via integration tests.

---

## 9. Content migration plan

Current React/Vite portfolio is the **source inventory**, not an assumed schema. Do not overwrite production before parity is verified.

1. **Audit baseline repo**: clone exact default branch; record commit hash; enumerate pages/components, hardcoded arrays, assets, project URLs, resume, certificate files, emails, theme behaviors, social links and SEO fields.
2. **Map fields**: create `docs/migration-map.md` mapping source -> `projects`, `skills`, `educations`, `certifications`, `experiences`, `pageContent`, `siteSettings`; flag uncertain facts for owner approval.
3. **Preserve originals**: make Git tag and export JSON/assets; hash source filenames and generate migration manifest.
4. **Create idempotent import**: scripts accept `--dry-run`, `--apply`, `--rollback`; upsert by stable legacy key/slug, not repeated blind inserts; log counts and failures.
5. **Transform assets**: upload images to managed storage, preserve alt text or require manual review; never expose secrets or private files.
6. **Create redirects**: identify changed URLs; maintain 301 redirects and canonical metadata.
7. **Verify parity**: counts, featured order, visible texts, project demo/GitHub links, certificate validity, social links, resume and contact mechanisms.
8. **Stage preview**: compare key pages screenshot-by-screenshot across breakpoints; review all migrated fields and decide publication state.
9. **Launch with rollback**: retain old site and exported content; switch domain only after staging gate; have DNS rollback steps.
10. **Post-launch audit**: search console/indexing, redirects, broken links, media, analytics and contact delivery.

**Important:** Data unavailable or unverifiable in the existing portfolio remains blank/draft rather than invented by AI. Do not migrate exposed `.env` credentials; rotate them if any are found in history.

---

## 10. Delivery roadmap with hard gates

Each phase ends with an implementation walkthrough, automated test output, build verification, security review for affected surfaces, screenshots, migration/runbook updates and **explicit human approval** before proceeding. Parallel feature work may occur only on independent areas after contracts are fixed.

### Phase 0 — Repository audit + source inventory
**Deliverables:** Repo assessment; route/component inventory; current content JSON; screenshot baseline; `migration-map.md`; open questions; threat/architecture decision records.  
**Exit:** All existing public sections mapped, no guesswork about deployed code; backups saved.

### Phase 1 — Foundations, design system and CI
**Deliverables:** Next.js/TypeScript App Router; Tailwind tokens; typography; accessible layout/components; environment validation; ESLint/Prettier; Vitest/Playwright; GitHub Actions; error handling and typed response envelopes.  
**Exit:** CI passes, responsive shell works, production build succeeds; no credentials in bundle.

### Phase 2 — Auth, database and security
**Deliverables:** MongoDB/Mongoose connection; models/indexes; Firebase Google login and hardened admin session; owner UID authorization; protected route/API middleware helpers; audit logger; CSRF, security headers and rate limiter baseline.  
**Exit:** unauthorized/CSRF tests pass; owner sign-in/out works; no unauthorized writes.

### Phase 3 — CMS MVP: projects + media
**Deliverables:** projects list/edit/create/draft/publish/archive, rich case study fields, media upload and gallery, preview, ordering/featured, audit trails and cache revalidation.  
**Exit:** Admin creates draft, uploads poster, previews privately, publishes, edits and archives; changes reflect publicly with correct cache behavior.

### Phase 4 — CMS MVP: remaining content
**Deliverables:** certifications, skills, education, experience, profile/settings, resume asset, contact inbox, core SEO fields.  
**Exit:** all required core content editable without code change; deletion/reference protection tested.

### Phase 5 — Public MVP + selective 3D
**Deliverables:** public routes, SSR/metadata, SEO, mobile nav, project detail pages, contact form, semantic content and accessible light 3D hero with fallback and theme controls.  
**Exit:** content/indexing, keyboard nav, contact email, responsive tests, non-WebGL rendering pass. This is the **MVP launch candidate**.

### Phase 6 — Migration, hardening and MVP launch
**Deliverables:** audited migration, redirects, backup/restore, e2e suite, load/performance baselines, deployed staging -> production pipeline, launch runbook, old-site rollback.  
**Exit:** owner signs off migrated content, critical test suite green, production health and contact verified. **MVP LIVE**.

### Phase 7 — Personalized public experiences (V1.5)
**Deliverables:** explicit audience switch, five audience landing pages, shared-content ranking, remembers local choice where opted in, project search/filter polish.  
**Exit:** every role mode remains accessible, does not hide important content and does not infer personal identity.

### Phase 8 — Research, blog, timeline, revisions (V1.5)
**Deliverables:** CMS/content pages for posts and research, timeline and verified achievements, Tiptap schema, revision history/rollback, content previews and editorial tools.  
**Exit:** verified publications and posts, safe rendered content, rollback restores previous version.

### Phase 9 — Integrations and operations (V1.5)
**Deliverables:** GitHub metadata sync through server cache, actual visitor analytics, admin reporting, export/restore, uptime/error monitoring, privacy controls, optional contact scheduling.  
**Exit:** API failures fail gracefully, sync does not overwrite curated descriptions, operational alerts and restores tested.

### Phase 10 — Advanced V2 experiments
**Deliverables:** optional AI assistant with citations to published pages, localized content, enhanced 3D skills/timeline, audience-tailored resume variants and advanced tools only if justified by actual usage.  
**Exit:** incremental opt-in rollout, accessibility/performance gates remain passing, AI refuses to invent absent facts.

### Dependencies
`0 -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> MVP` and `6 -> 7 / 8 / 9 -> 10`. Blog/research schema can begin after core CMS services stabilize; no critical launch dependency on V2.

### Issue sizing and statuses
Use **epic -> story -> task**. Prefer a task small enough for one bounded code-reviewable PR, ideally one concern or route family at a time. States: Backlog, Ready, In Progress, Blocked, In Review, QA, Approved, Released. Require acceptance checks and link to PRD requirement for each story.

---

## 11. Test strategy and release gates

| Layer | Tools | Tests |
|---|---|---|
| Type/static | TypeScript, ESLint, Prettier | Strict types, no lint errors, formatted files |
| Unit | Vitest | DTO schemas, slug logic, permission predicates, transforms, publication rules |
| Component | Testing Library | Form validation, error states, accessibility, filters |
| Integration | Vitest + isolated test MongoDB | CRUD, revisions, cache invalidation, session guards, sanitization |
| API contract | OpenAPI validation | Status codes, envelopes, pagination, auth responses |
| E2E | Playwright | Realistic owner publishing, public browsing, mobile, contact, roles |
| Accessibility | axe + manual keyboard/screen reader | WCAG basics, reduced motion, focus, forms |
| Performance | Lighthouse CI + Web Vitals | Mobile/home/project detail/3D fallback |
| Security | SCA/secret scan + manual | Unauthorized writes, XSS/CSRF, upload abuse, information leakage |
| Visual | Playwright screenshots | Desktop, tablet, mobile, light/dark, reduced motion |
| Operations | staging restore drills | Backup, rollback, alerts, contact deliveries |

### 11.1 Critical E2E paths
- Admin allowed UID signs in, creates project draft, attaches image, previews and publishes; public listing/detail update; metadata present; analytics not required for functionality.
- Unapproved valid Firebase account denied all admin operations.
- Public visitor cannot access draft through URL, JSON, or OG generation.
- Mobile user navigates all core pages without using 3D.
- Reduced-motion and WebGL-unavailable users can view entire hero and click both CTAs.
- Contact valid input stores/sends once; spam/invalid input is rejected without leaking internal details.
- Old project URL redirects to correct canonical new URL.
- Owner archives content; no sitemap result or stale cached project remains.
- Certificate image/PDF opens safely; missing/expired verification URL represented accurately.
- Restore a staged backup into isolated DB and compare record counts and representative values.

### 11.2 Definition of done (mandatory for every story)
- Implementation matches numbered PRD requirements and agreed wireframe.
- Types and Zod validation implemented; errors and empty states handled.
- Tests added/updated; no test weakened or silently skipped.
- Security, SEO, accessibility and performance consequences assessed.
- Developer documentation and data migrations updated.
- `lint`, `typecheck`, `test`, `build`, and appropriate E2E all pass in CI.
- Screenshots or screen recording of changed UI; PR description explains changes and known limitations.
- No fabricated data, secrets, debug logs, production-breaking TODOs or uncaught promise paths.

### 11.3 Explicit launch acceptance criteria
**AC-01** Owner can manage projects, certificates, skills, education, experience, profile, resume, home highlights and contact destination without committing code.  
**AC-02** Only authorized owner can make changes; invalid, missing, expired and revoked sessions denied.  
**AC-03** Drafts never appear publicly, in metadata, sitemap, OG images or API queries.  
**AC-04** CRUD actions validate fields, show feedback and do not create corrupt references.  
**AC-05** Project publish/unpublish changes both listing and detail without manual redeploy.  
**AC-06** Public pages are semantic, responsive, keyboard-accessible, SEO-indexable and readable with 3D disabled.  
**AC-07** Critical Core Web Vitals meet targets on representative production field data when sufficient sample exists; lab scores tracked until then.  
**AC-08** Contact form is rate-limited, validated and proven to deliver owner notifications from staging and production.  
**AC-09** Migrated visible content matches approved legacy inventory, with broken links reviewed and redirects configured.  
**AC-10** Backup export and tested restore documented; staging and production secrets/resources separated.  
**AC-11** CI green and smoke tests pass on deployment; rollback process exercised.  
**AC-12** Content edit audit logs visible and do not disclose confidential input.

---

## 12. Environments, deployment and operations

### 12.1 Environments
- `local`: developer Firebase test project/config or emulator, isolated dev MongoDB, sandbox media/email.
- `preview/staging`: separate MongoDB, Firebase project, media folder/account and test mail; protected preview URL where possible.
- `production`: dedicated resources and restricted credentials; no staging artifacts or secrets shared.

### 12.2 Environment variable contract (names only)
```dotenv
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
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
Client-side Firebase identifiers are public configuration, not admin secrets; do **not** expose Firebase Admin keys or other server secrets. Use platform environment secrets, validated at startup; optional integrations need corresponding feature flags. Never put actual credentials into PRD or `.env.example`.

### 12.3 CI/CD
PR: install locked dependencies -> lint -> typecheck -> unit/integration -> build -> E2E preview -> accessibility smoke -> security scan -> review. Main: deploy staging/production according to protected branch workflow; manually approve production migrations and domain switches. Automatic deployments must be repeatable, observable and reversible.

### 12.4 Monitoring and maintenance
- Instrument API error rates, contact failures, slow DB queries, Web Vitals and JS exceptions; don't collect private contact messages as telemetry.
- Daily or provider-managed backups based on actual service features, tested restore at least before major releases and periodically thereafter.
- Dependabot/Renovate with reviewed updates; document security response, admin lockout recovery, key rotation and media provider failures.
- Cost guardrails: track DB connections/storage, media transforms/bandwidth, email requests, server invocations and rate-limit store. Free-tier limits are not guaranteed SLAs.
- Incident runbook: identify, contain, roll back, rotate compromised secrets, restore data, assess user notification requirements.

### 12.5 Launch sequence
1. Provision domain and records; HTTPS works.
2. Lock production admin UID; add MFA to identity/provider accounts.
3. Verify latest approved content export and dry-run migration.
4. Apply migrations to staging, then production with backup.
5. Deploy production; run smoke tests for homepage, project pages, login, publish, contact, media, sitemap and 404.
6. Validate canonical URLs, OG thumbnails, robots, redirects, cookie controls and security headers.
7. Point custom domain to production and keep previous site rollback-ready.
8. Watch logs and Web Vitals; resolve broken images, links and forms before announcement.

---

## 13. Suggested sprint / issue backlog

| ID | Priority | Epic | First independently testable task |
|---|---|---|---|
| FND-01 | P0 | Foundation | Scaffold app and protected CI |
| FND-02 | P0 | Foundation | Implement design tokens, semantic public/admin layouts |
| SEC-01 | P0 | Authentication | Firebase session exchange and admin allowlist |
| SEC-02 | P0 | Security | Central admin authorization and CSRF guards |
| DATA-01 | P0 | Database | Connection helper and core indexed schemas |
| DATA-02 | P0 | Database | Typed service/repository architecture |
| CMS-01 | P0 | Projects | Draft CRUD with Zod validation |
| CMS-02 | P0 | Projects | Publish/unpublish with cache revalidation |
| CMS-03 | P0 | Media | Authenticated signed upload + finalization |
| CMS-04 | P0 | Core content | Certifications CRUD |
| CMS-05 | P0 | Core content | Skills, experience, education CRUD |
| CMS-06 | P0 | Global | Site profile/settings/resume editing |
| PUB-01 | P0 | Public | Server-rendered homepage and projects list |
| PUB-02 | P0 | Public | Case study and credential detail routes |
| PUB-03 | P0 | Public | About, skills, education, experience and contact |
| 3D-01 | P0 | 3D | Progressive hero scene with static fallback |
| SEO-01 | P0 | SEO | Metadata, sitemap, robots, redirects |
| MSG-01 | P0 | Contact | Form, rate limit, mail, admin inbox |
| MIG-01 | P0 | Migration | Inventory/field mapping + dry-run importer |
| MIG-02 | P0 | Migration | Production-safe idempotent import and verification |
| QA-01 | P0 | Quality | E2E owner publishing + visitor flows |
| OPS-01 | P0 | Operations | Staging/prod deployment, rollback, backup test |
| UX-01 | P1 | Personalization | Audience selector and role landing pages |
| BLOG-01 | P1 | Editorial | Blog CMS/public SSR + sanitization |
| RSH-01 | P1 | Research | Research CMS and validated publication links |
| REV-01 | P1 | Editorial | Content revision history and rollback |
| INT-01 | P1 | Integrations | Cached GitHub repository enrichment |
| ANA-01 | P1 | Insights | Verified analytics dashboard |
| AI-01 | P2 | Assistant | Grounded retrieval assistant with refusals |

---

## 14. AI implementation protocol

This project will be built incrementally with AI coding tools (Codex, Antigravity or similar). AI is a contributor, **not** the product owner: it must report evidence and request owner approval for high-impact migration, credentials, external billing and production deploy steps.

### 14.1 Non-negotiable agent rules
1. Read this PRD and current repository before changing code. Never assume files/features exist.
2. Start each task by naming its PRD IDs, dependencies, affected files, test plan and risks.
3. Implement exactly one scoped deliverable/phase segment; do not redesign unrelated features.
4. Use current stable compatible package versions, pinned via lockfile; verify official API contracts before adding dependencies.
5. No placeholders presented as completed features; no fabricated metrics or achievements.
6. Never hardcode secrets or bypass authentication; never open privileged API endpoints for convenience.
7. Add Zod schemas and tests for each public/admin API; enforce access on server.
8. Preserve migrated data and old code until verification/rollback is approved.
9. Commit logical changes; document breaking changes and migrations.
10. Run applicable lint, typecheck, tests, build and smoke checks. If blocked, state failure honestly, identify needed intervention and do not claim completion.
11. Never deploy or apply irreversible production migrations without explicit user authorization.
12. On completion provide files changed, acceptance checklist, tests/results, screenshots, limitations and recommended next task.

### 14.2 Master prompt for AI coding agent
```text
You are the principal software architect and senior full-stack engineer for my
Dynamic 3D Portfolio + Single-Owner CMS.

AUTHORITATIVE REQUIREMENTS: Read docs/PRD.md in full. Decisions are Next.js App
Router + TypeScript, MongoDB/Mongoose, Firebase Authentication with server-verified
sessions and strict owner UID allowlist, Tailwind-based accessible UI, selective
React Three Fiber scenes, managed media uploads, phased development, and migration
of my existing React/Vite portfolio. Never replace real data with inventions.

BEFORE CODING:
1. Inspect current files, package versions, environment examples, and Git status.
2. Identify the current roadmap phase and dependencies; do not assume progress.
3. Summarize actual implementation status with evidence (file paths, commands).
4. Make a small actionable plan mapped to the PRD acceptance criteria.

IMPLEMENTATION:
- Complete only the approved phase/task scope.
- Add typed services, Zod validation, auth checks, empty/error states and tests.
- Keep admin APIs server-authorized and avoid secrets in the client.
- Make public content SSR/SEO-friendly and functional without WebGL.
- Never delete legacy content/assets before verified import and backup.
- Prefer minimal, reviewed dependencies and reusable maintainable code.

VERIFICATION:
Run lint, typecheck, unit/integration tests, production build and relevant E2E.
Report exact commands and outputs; do not invent successful results.
If something fails, fix it within scope or provide clear blockers.

END-OF-TASK FORMAT:
A. Phase / PRD requirement IDs
B. Work completed (with paths)
C. Test/build results
D. Security/accessibility/performance review
E. Screenshots or screenshots to review
F. Open issues / known limitations
G. Proposed next small task (do not start it automatically)

Do not deploy to production or migrate production data without explicit approval.
```

### 14.3 Phase task prompt template
```text
Implement PRD Phase [N], task [ID + title] only.
Read docs/PRD.md and inspect actual repo state first.
Required behavior: [measurable feature description].
Acceptance criteria: [specific AC IDs plus task-specific assertions].
Constraints: preserve other routes, data, privacy, auth and accessibility.
Deliver code, tests, docs, command results and a concise walkthrough.
Stop before production migration or deployment; report blockers honestly.
```

### 14.4 Phase-0 audit prompt
```text
Audit my existing portfolio repository at
https://github.com/MSabbirHossen/MSabbirHossen.github.io and the checked-out
workspace. Do not make changes initially. Produce:
1. Directory and architecture inventory.
2. Public routes/components and data sources.
3. Projects, skills, certifications, education, experience, contact, resume,
   research/blog data with original file references.
4. Media inventory, asset usage and potential license issues.
5. SEO, accessibility, performance, environment/secrets and deployment risks.
6. A field-by-field content mapping to the models in docs/PRD.md.
7. Missing or ambiguous facts that need owner validation.
8. A reversible migration plan and first scoped implementation tasks.
Quote actual file paths/lines/commands. Do not invent counts or existing features.
```

### 14.5 Phase-2 security verification prompt
```text
Audit the Next.js Firebase admin login implementation and all protected APIs.
Prove via source inspection and tests that: session exchange validates Firebase
identity; only the configured owner UID is authorized; invalid/expired/revoked
sessions fail; all mutations enforce server-side auth and CSRF/origin defenses;
no admin keys or MongoDB secrets reach the browser; session cookie flags are
secure; rate limits and input validation exist. Produce a threat-based gap list,
fix PR-sized issues, and rerun tests. Do not weaken controls to pass tests.
```

### 14.6 Phase-6 production readiness audit prompt
```text
Perform a release-candidate audit against AC-01..AC-12 of docs/PRD.md.
Provide PASS/FAIL/BLOCKED with concrete evidence per criterion. Verify
project/certificate publishing, unauthenticated API denial, draft leakage,
responsive/WebGL fallback, contacts, metadata/sitemap/redirects, migrated
content counts and links, backups/restore, monitoring, CI and rollbacks.
Do not deploy or change DNS. Produce an owner approval checklist and a safe
rollback plan. Do not claim readiness unless each release-blocking criterion
has supporting evidence.
```

---

## 15. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| 3D slows mobile or harms navigation | High | Static fallback, lazy imports, adaptive rendering, HTML-first core |
| Firebase valid user gains admin access | Critical | Server-verified UID allowlist, tests on every write route |
| Draft exposure through cache/sitemap | High | Published predicate everywhere, explicit cache revalidation and tests |
| Migration overwrites or corrupts content | High | Audit, backups, dry-run, idempotent import, rollback |
| Contact spam/cost explosion | Medium | Validation, honeypot, rate limits, provider quotas |
| Rich-text XSS | High | Restricted schema and sanitize on both store/render |
| Serverless DB connection saturation | Medium | Connection caching, managed DB limits, observe pool |
| Uncontrolled feature expansion | High | P0/P1/P2 gates, small PRs, explicit scope approval |
| AI fabricates records or claims success | High | Ground source facts, evidence-based acceptance and command output |
| Third-party free-tier restrictions | Medium | Quota monitoring, adapter abstractions, budget review |
| Domain SEO loss after migration | Medium | Redirect map, canonicals, sitemap and monitoring |
| Overengineering the CMS | Medium | Deliver actual publishing core before optional AI/3D modules |

---

## 16. Ownership, decisions and change control

**Owner approvals required:** factual content migration, public testimonials, externally displayed research/papers, permanent deletion, production import, provider account/billing changes, domain cutover and go-live. Everything else may proceed on isolated branches following task scope and passing tests.

Any feature change must document: motivation, impact, priority, risk, acceptance test, schema/API adjustments and whether it delays MVP. Record decisions in `docs/ADR/NNN-title.md`.

### Open design decisions for implementation discovery (not blockers)
- Select media provider plan, transactional email service and production domain after comparing current terms.
- Choose Markdown vs Tiptap JSON storage for long form body. Prefer one canonical representation.
- Choose durable rate limiting store according to selected hosting topology.
- Determine precise project media sizes, 3D model asset and launch copy from measured prototypes and migration audit.
- Confirm admin's Firebase UID after account setup; **never** put it in the public repository.

---

## 17. Authoritative references

- Next.js App Router: https://nextjs.org/docs/app
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers
- Firebase session cookies: https://firebase.google.com/docs/auth/admin/manage-cookies
- MongoDB Next.js integration: https://www.mongodb.com/docs/drivers/node-frameworks/next-integration/
- Mongoose Next.js integration: https://mongoosejs.com/docs/nextjs.html
- React Three Fiber performance: https://github.com/pmndrs/react-three-fiber/blob/master/docs/advanced/scaling-performance.mdx

**Approval standard:** Feature is not 'done' because the AI says so. It is done only when linked requirements, test evidence, visual review and owner sign-off satisfy the acceptance gates.
