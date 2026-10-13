# ADR 0001: Phase 0 Scope Reconciliation, Domain Strategy, and Service Boundaries

**Status:** Accepted  
**Date:** 2026-10-13  
**Deciders:** Product Owner (Md. Sabbir Hossen), Principal Software Architect  
**Technical Context:** Initial repository audit of `https://github.com/MSabbirHossen/MSabbirHossen.github.io` (commit `db32ec579b7af695ee785ed38f2c23541ae8e2ab`)  
**Task ID:** IMP-P0-06  

---

## 1. Context & Problem Statement

Before entering Phase 1 foundation development, three architectural decisions require explicit reconciliation between the audited legacy portfolio and the target specifications (`PRD.md`, `TRD.md`, `BACKEND_SCHEMA.md`):

1. **Deployment & Domain Cutover Strategy:** The live portfolio currently operates on GitHub Pages (`https://msabbirhossen.github.io`). The new system is a dynamic full-stack Next.js application requiring server execution, MongoDB, and Firebase Admin.
2. **Contact Inquiry Pipeline:** The legacy site relied on client-side `@emailjs/browser` with browser-exposed keys. The target requires private server-side processing and database storage.
3. **Legacy AI Assistant Scope:** The legacy site included a rule/intent-based client chatbot (`useAIChat.js`), whereas the PRD/TRD deferred AI features to V2 (Phase 10).
4. **Draft vs. Published Content Retention:** Commented-out and placeholder entries exist in the legacy source code.

---

## 2. Decision Outcomes

### 2.1 Domain & Deployment Cutover Strategy
- **Decision:** The new Next.js application will be deployed and verified on Vercel under a dedicated project domain (e.g., `sabbir-3d-portfolio.vercel.app` or custom domain configured by the owner).
- **Zero Downtime / Non-Destructive:** The existing GitHub Pages repository and live site (`https://msabbirhossen.github.io`) will remain untouched during development.
- **Production Cutover (Phase 6):** Once Phase 6 acceptance tests and owner verification pass, DNS or CNAME redirect options will be presented to the owner for cutover.

### 2.2 Contact Service Boundary
- **Decision:** Remove `@emailjs/browser` entirely.
- **Implementation:** Visitor messages submitted via `/contact` POST to `/api/v1/contact`. The endpoint validates inputs using Zod, enforces IP rate limits, filters spam honeypots, and persists the message into the MongoDB `contact_messages` collection. The owner views and manages inquiries in `/admin/messages`. Server-side notification dispatch (via Resend or SMTP) is an optional server enhancement.

### 2.3 Legacy AI Assistant Deferred to V2
- **Decision:** The legacy AI chatbot will NOT be ported to the MVP release.
- **Rationale:** Aligns strictly with PRD Section 1.3 and TRD Section 1.1 ("Explicit exclusions in MVP: AI assistant"). The focus for MVP is a rock-solid, ultra-fast, accessible core portfolio with single-owner CMS. AI assistant capabilities grounded in published CMS content will be developed in Phase 10 (V2).

### 2.4 Content Retention & Draft State
- **Decision:** All authentic, completed records (7 projects, 5 active certs, 5 active education milestones, 3 experience sprints, 5 skill categories) will migrate with status `"published"`.
- **Draft Safeguard:** All commented-out entries from legacy source code (`portfolio-website`, `exploratory-lab`, `learning-tracker`, commented certs, and commented degrees) will be imported into MongoDB with status `"draft"`. They will not be visible on public routes until edited and published by the owner in the CMS.

---

## 3. Consequences

- **Positive:** Protects existing production availability; enforces zero credential exposure in browser bundles; prevents premature complexity from client chatbots; ensures zero unverified claims appear on public routes.
- **Negative:** Requires external MongoDB Atlas and Firebase setup starting in Phase 2; GitHub Pages cannot host the server components directly.
