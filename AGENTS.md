# AGENTS.md — Mandatory AI Engineering Rules

**Project:** Dynamic 3D Portfolio & Personal CMS  
**Version:** 1.0 · 2026-10-13  
**Applies to:** Codex, Antigravity, Cursor, Claude Code, Copilot, and any human/AI contributor.  
**Status:** Normative project operating instructions. Place this file at repository root as `AGENTS.md`.

> **Core operating rule:** Make one small, coherent change at a time; verify it; update the relevant docs; create one clean, descriptive Git commit for that change; then move to the next task. Do not batch unrelated work into one commit. Do not claim work passed a check that was not actually run.

## 1. Source of truth and conflict handling

Read these documents **before editing code**:

1. `docs/PRD.md` — product scope, priority, acceptance requirements.
2. `docs/TRD.md` — technical architecture, API, security, performance and testing contracts.
3. `docs/APP_FLOW.md` — journeys, transitions, publishing and failure states.
4. `docs/UI_UX_DESIGN_BRIEF.md` — design tokens, component behavior, accessibility, visual direction.
5. `docs/BACKEND_SCHEMA.md` — MongoDB models, indexes and validation contracts.
6. `docs/IMPLEMENTATION_PLAN.md` — tasks, dependencies, phase gates and release planning.

Check the repository's **actual** state: files, installed versions, tests, migration sources, Git history, environment, and configuration. Documents are planned contracts, **not proof of implementation**. Never fabricate prior work, missing personal details, analytics, testimonials, or achievements.

If documents conflict, stop the conflicting part, explain exact sections/impacts, record a proposed decision in `docs/ADR/`, and proceed only with unrelated safe tasks until resolved. Do not silently reinterpret requirements. Product scope follows PRD; engineering constraints follow TRD and BACKEND_SCHEMA; user journeys follow APP_FLOW; design details follow UI_UX_DESIGN_BRIEF; sequence follows IMPLEMENTATION_PLAN. Security and data integrity requirements always apply.

## 2. Non-negotiable technical decisions

- Next.js App Router + TypeScript; prefer server components for public read views.
- Tailwind CSS and reusable accessible UI primitives; clean, premium minimalist UI with **selective** rather than everywhere 3D.
- Three.js + React Three Fiber + Drei for optional progressively loaded 3D scenes.
- MongoDB Atlas + Mongoose through **server-side** service/repository boundaries; Zod for API validation.
- Firebase Authentication for the **single owner**; Firebase Admin SDK for server-side verification and restricted admin sessions.
- Cloudinary for authorized media assets; keep provider secrets server-side.
- Versioned `/api/v1` endpoints, consistent errors, published-only public reads and protected admin writes.
- Vercel deployments and GitHub Actions CI; follow dependency versions actually compatible with the repository.
- Release sequence: **MVP phases 0–6**, **V1.5 phases 7–9**, **V2 phase 10**. Do not pull optional features into MVP without explicit scope approval.

## 3. Required execution loop — for EVERY small change

**This workflow is mandatory, not merely a suggestion.**

1. **Identify** one implementation task ID (e.g. `IMP-P3-04`) and one narrowly scoped change. Review relevant requirements, dependencies and current code.
2. **Inspect Git state** with `git status --short` and `git branch --show-current`. Respect pre-existing uncommitted changes: never discard, stash, stage or commit another contributor's changes without explicit permission.
3. **Plan** the smallest viable modification; state files affected, purpose, verification steps, risks and expected commit message when working interactively.
4. **Implement** only that change. Avoid unrelated refactors, large rewrites, formatting churn and unnecessary new dependencies.
5. **Verify** with applicable checks (focused tests, lint, typecheck, build, accessibility or security checks). Run full suite at phase gates. If a check cannot run, explicitly report why and do not mark it passed.
6. **Inspect diff** with `git diff --check`, `git diff`, and `git status --short`. Confirm no secrets, generated artifacts, unintended deletions or unrelated modifications.
7. **Update docs** (task status, API/model contract, ADR, migration notes, README) **when behavior or implementation status changes**. Keep documentation changes in the same logical commit or a separate atomic `docs:` commit as appropriate.
8. **Stage only intended files** using explicit paths (`git add path/to/file ...`); avoid blind `git add .` when unrelated work exists. Review `git diff --cached` and run secret checks.
9. **Commit immediately after this independently useful, verified change**, using a clear **Conventional Commit** message (Section 4). Do not proceed to the next change without recording the commit, unless committing is blocked by environment/permissions/failed checks; report that blocker rather than pretending a commit exists.
10. **Report** task ID, what changed, tests and their outcomes, commit hash, remaining risks, and next task. Only say “committed” if `git log -1` verifies it.

**Atomicity rule:** One commit = one coherent purpose, such as adding a project model, fixing a validation bug, adjusting a reusable button, or adding a focused test. A large phase must contain multiple meaningful commits, never one giant end-of-phase commit. Avoid useless micro-commits for temporary/broken states; the change must be self-contained and testable.

**Working-tree rule:** Do not overwrite uncommitted changes made by the user or other agents. If the tree is dirty, carefully isolate your work; if separation is unsafe, stop and explain. Never reset/clean/force-push/rebase shared history or amend someone else's commit without explicit authorization.

## 4. Mandatory Git commit conventions

Use the pattern:

```text
<type>(<scope>): <imperative summary>
```

- Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `style`, `chore`, `build`, `ci`, `security`.
- Scopes: `auth`, `admin`, `projects`, `certifications`, `media`, `api`, `db`, `ui`, `3d`, `seo`, `migration`, `tests`, `deps`, `docs`, etc.
- Keep subject focused, preferably <=72 characters; imperative present tense, lowercase after colon, no trailing period.
- Add a short body when a change has non-obvious impact. Reference the implementation task ID (`Refs: IMP-Px-yy`) when known.
- Never write vague messages such as `update`, `fix bugs`, `changes`, `done`, `final`, `misc`, or `AI-generated code`.

**Examples (illustrative, not claims of actual commits):**

```text
chore(app): initialize Next.js App Router with TypeScript
feat(auth): verify owner session on protected admin routes
feat(db): add project schema with publish-state indexes
feat(projects): add validated project creation endpoint
feat(admin): build project creation form with draft autosave
feat(media): verify signed Cloudinary upload completion
feat(3d): lazy load hero scene with static fallback
fix(api): reject stale project updates with revision conflict
perf(home): defer noncritical 3D assets until idle
security(auth): enforce CSRF protection on session mutations
test(projects): cover draft visibility and slug collisions
docs(migration): record source-to-target project field mapping
ci(checks): add typecheck and test jobs to pull requests
```

**Example safe workflow:**

```bash
git status --short
git branch --show-current
# Implement ONE cohesive change and run its checks
npm run lint
npm run typecheck
npm test -- --run               # adjust to actual package.json scripts
git diff --check
git diff -- src/features/projects
# Verify secrets/unrelated files are excluded
git add src/features/projects docs/IMPLEMENTATION_PLAN.md
git diff --cached --check
git diff --cached
git commit -m "feat(projects): validate draft creation" -m "Refs: IMP-P3-04"
git log -1 --format='%h %s'
git status --short
```

Adapt commands to scripts found in `package.json`; do not assume `npm test` or `npm run typecheck` exists. If verification fails, fix it before committing; do not bypass hooks with `--no-verify`. **Never auto-push** to a remote or merge a PR unless the user explicitly authorized those actions. Commits are local unless push authorization is clearly given. Prefer a feature branch and PR for review.

## 5. Task boundaries, phase gates and status reporting

- Begin Phase 0 by auditing and documenting the original portfolio. Never destroy the old site or infer missing details.
- Follow phase dependencies and acceptance gates in `docs/IMPLEMENTATION_PLAN.md`. **No phase marked complete without passing its gate**, including test evidence.
- Each task report must include: task ID, changed files, business behavior, tests executed/results, edge cases, commit hash, remaining TODOs and whether scope changed.
- Keep one running progress tracker (`docs/IMPLEMENTATION_STATUS.md`) with `Not started / In progress / Blocked / Done`, links to commits, and proof for acceptance criteria. Update it only with verified facts.
- If the agent cannot finish a task, leave an honest partial report and a clean boundary. Do not claim `COMPLETE`, `FULLY VERIFIED`, `PRODUCTION READY`, or successful deployment without evidence.
- Never make a build green by deleting failing tests, weakening authorization, disabling TypeScript strictness, suppressing critical lint rules or bypassing CI.

## 6. Architecture and maintainability

- Organize by feature/module and keep UI, validation, domain services, repositories, and provider adapters separated.
- Avoid calling MongoDB, Firebase Admin or privileged integrations directly from client components.
- Prefer clear names, strict types, small reusable components and explicit request/response DTOs; do not use `any` or massive utility files as a shortcut.
- Use common API response envelopes and typed errors; honor documented HTTP status codes.
- Keep secrets out of logs and client bundles. Do not expose internal MongoDB IDs unnecessarily where stable slugs/public IDs suffice.
- Do not add packages until existing dependencies, bundle impact, licenses and maintenance cost have been reviewed.
- Prefer established compatible package APIs, and record architecture decisions that affect data or security.
- Avoid premature abstraction. Add comments where intent or security behavior is non-obvious rather than narrating every line.

## 7. Firebase auth and security boundaries

- Public viewers require **no account**; admin access is **single-owner only**.
- Authenticate using Firebase; server verifies identity through Firebase Admin and an owner UID allowlist. **Client-side route hiding does not grant authorization**.
- Verify a secure, appropriate admin session on every protected API and sensitive server action; use `HttpOnly`, `Secure` (production), `SameSite` cookies with CSRF mitigation on mutations.
- Default deny: an authenticated but non-owner account must receive forbidden access and must never see private drafts, admin records or messages.
- Never commit `.env*` secrets, private keys, Firebase service accounts, database URLs, session cookies, tokens or production user data. Provide sanitized `.env.example` only.
- Validate body, query, params and file metadata with Zod; sanitize rich text and reject unsafe protocols/URLs.
- Rate-limit contact endpoints, validate requests server-side, protect uploads and enforce file type/size policies.
- Keep a meaningful audit trail for admin content mutations. Use least-privilege credentials and inspect dependency/security advisories.
- If any credential is found in Git, stop, alert the owner, rotate/revoke it and follow a documented cleanup procedure; merely deleting it in a new commit is insufficient.

## 8. Database, API and publication rules

- Implement collections, field definitions, indexes and relationships from `docs/BACKEND_SCHEMA.md` and `docs/TRD.md` without quietly changing contracts.
- Public read APIs return only published and publicly allowed content; never leak drafts, archived entries, private asset information or owner-only fields.
- Enforce server-side schema validation, slug uniqueness, ownership and referential integrity.
- Respect `draft → published → archived` state transitions, publication requirements, timestamps and revision-based conflict handling.
- Use soft deletion/recovery rules where specified; never irreversibly destroy imported data without explicit approval and backups.
- Ensure idempotent migrations and safe retries; document schema changes, index additions, API contract changes, and backwards-compatibility impact.
- Never trust client-submitted roles, published status, upload URLs or audit actor IDs without server-side validation.
- Invalidate relevant caches on successful publication changes and test the public view before declaring success.

## 9. UI/UX and 3D rules

- Follow `docs/UI_UX_DESIGN_BRIEF.md` and `docs/APP_FLOW.md`; protect consistent typography, spacing, design tokens, responsive layouts and understandable navigation.
- Public content must remain readable, navigable and indexable **without JavaScript-powered 3D**.
- 3D is a progressive enhancement: lazy-load scenes, limit draw calls/assets, provide a lightweight poster/fallback for mobile, low-power, WebGL failure and reduced motion.
- Honor `prefers-reduced-motion`, keyboard operation, focus management, alt text, color contrast and semantic page structure; target WCAG 2.2 AA.
- Do not replace useful project evidence with decorative 3D. Avoid generic AI-looking visual clutter, unnecessary glowing cards and unmotivated motion.
- Use optimized image formats, explicit sizes, bounded animation effects and sensible caching. Record performance impact of any new 3D scene.
- Admin UI prioritizes speed and clarity: validation messages, loading/empty/error/success states, autosave feedback if implemented, and protection against unsaved changes.

## 10. Tests and quality gates

For every change run the **smallest meaningful checks** plus any tests required by impact. At each phase gate or PR run the full applicable suite:

- Formatting and lint, strict TypeScript, production build.
- Unit tests for validators, services, formatters and state transitions.
- Integration tests for model/index behavior, API responses, unauthorized/forbidden cases, draft visibility and conflicts.
- E2E tests for public exploration, admin sign-in/out, project draft-preview-publish, certificates, contact and media upload.
- Accessibility audits and manual keyboard/reduced-motion checks; verify responsive mobile/tablet/desktop behavior.
- Security checks: non-owner rejection, CSRF, injection/unsafe URLs, file validation, secret scanning and rate limiting.
- Performance budgets/core web vitals; ensure 3D fallbacks and no catastrophic low-end device regressions.
- Backup/restore and migration repeatability checks before production launch.

Use mocks or emulators for external services where possible; keep secrets out of test fixtures. Never fabricate screenshots, logs, test output, metrics or deployment confirmation.

## 11. Data migration rules

- Treat the existing live React portfolio and its repository as a **read-only source of truth** during inventory.
- Audit actual skills, projects, certificates, education, experience, media URLs and social links and map them to new schema fields.
- Preserve original text, dates, links, names and attribution; no invented values or generic placeholder achievements masquerading as real accomplishments.
- Prefer repeatable migration scripts, dry-run mode, explicit field mapping and backup/rollback plan.
- Verify row counts, slug uniqueness, media accessibility and representative manually inspected records before cutover.
- Maintain old public URLs through redirects where feasible and verify SEO metadata and link integrity.

## 12. Deployment, branches and prohibited operations

- Favor a feature branch named `feat/<task-name>` or `fix/<task-name>` and a reviewed PR; protect `main` where project settings allow.
- GitHub Actions must validate lint, types, tests and build before merge. Require correct environment separation for local, preview and production.
- Preview must not expose private admin capabilities or production data. No production write without explicit owner approval.
- Do not change production secrets, deploy, delete remote branches, force-push, migrate live data or change DNS without explicit authorization.
- Document environment variables by name/purpose in `.env.example` (never values), setup steps and rollback procedures.
- For production changes, require backup availability, smoke tests, error monitoring and a rollback strategy.

## 13. Required response format after each completed task

```text
Task: IMP-Px-yy — <short task title>
Status: DONE / BLOCKED / PARTIAL
Changes: <specific changed behavior and files>
Validation: <commands and real pass/fail outcomes>
Security/accessibility/performance impact: <brief notes>
Docs updated: <paths or none, with reason>
Commit: <actual short hash> — <type(scope): summary>
Working tree: clean / existing unrelated changes / uncommitted (reason)
Next task: <task ID and short goal>
Blockers: <none or specific issue>
```

If no Git repository is available, committing is prohibited, Git configuration is missing, or the environment prevents writes, **do not invent a hash**; say `Commit: NOT CREATED — <reason>` and provide the exact suggested commit message. Do not imply automatic future execution.

## 14. Agent startup checklist

Before each coding session:

- [ ] Read the six source documents and any relevant ADRs.
- [ ] Inspect current branch, Git status, last commit and package scripts.
- [ ] Determine the current verified phase and next task ID.
- [ ] Confirm relevant tests, model/API contracts and file ownership.
- [ ] Identify secrets and protected files that must never be staged.
- [ ] Choose a small, testable implementation slice.
- [ ] Implement → validate → review diff → docs → **clean commit after each small change** → report.

**Final reminder:** The agent's job is to create a maintainable, production-quality portfolio with trustworthy data and a verifiable Git history—not merely to produce code quickly. Every completed, small change must leave an understandable, traceable Git commit, unless an explicitly reported technical or safety blocker prevents the commit.
