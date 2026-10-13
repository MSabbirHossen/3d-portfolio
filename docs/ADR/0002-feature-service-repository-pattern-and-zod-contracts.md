# ADR 0002: Feature-Oriented Architecture, Service-Repository Boundaries, and Zod Contracts

**Status:** Accepted  
**Date:** 2026-10-13  
**Deciders:** Principal Software Architect, Full-Stack Lead  
**Task ID:** IMP-P1-03  
**Companion Documents:** `docs/TRD.md`, `docs/BACKEND_SCHEMA.md`  

---

## 1. Context & Problem Statement

Next.js App Router applications frequently suffer from architectural drift when database queries, authentication logic, and authorization checks are scattered across client components, Server Actions, and Route Handlers. To guarantee maintainability, strict typing, security, and independent testability:

1. How should business logic, data persistence, and HTTP route handlers be organized?
2. How should validation contracts be enforced at system boundaries?
3. How should public read operations be protected from leaking unverified drafts?

---

## 2. Decision Outcomes

### 2.1 Feature-Oriented Modular Directory Layout
- Each content domain lives inside `src/features/<domain>/` containing:
  - `schemas.ts`: Zod validation schemas for requests, responses, and entities.
  - `types.ts`: TypeScript types inferred directly from Zod schemas (`z.infer<T>`).
  - `repository.ts`: Persistence abstraction (`I<Domain>Repository`) decoupling data access.
  - `service.ts`: Domain service executing business rules, slug collision checks, and authorization constraints.

### 2.2 Boundary Separation
- **Route Handlers (`src/app/api/v1/*`):** Thin controllers responsible only for deserializing HTTP requests, invoking Zod validators, calling domain services, and serializing responses through standardized `apiSuccess()` or `apiError()` envelopes.
- **Server Components:** Can call domain services directly without redundant HTTP loopbacks (`fetch('/api/v1/...')`), maximizing rendering performance.
- **Browser Client Components:** Interact with the backend exclusively via versioned `/api/v1/*` endpoints.

### 2.3 Strict Zod Validation & Typed DTOs
- All query parameters, path arguments, and mutation payloads MUST pass Zod schema parsing before reaching domain logic.
- Zod validation errors automatically map to HTTP `422 Unprocessable Entity` with structured field errors.

### 2.4 Strict Publication Guards
- Public service queries enforce `status: "published"` at the service layer. Drafts and archived records can never be retrieved by public routes.
- Attempting to retrieve a draft via public slug endpoints throws a domain `AppError.notFound()`, returning HTTP 404 to prevent information leakage.

---

## 3. Consequences

- **Positive:** Guarantees 100% type safety and contract consistency across API and UI; enables trivial unit and integration testing without mocking Next.js HTTP internals; prevents accidental draft leaks.
- **Negative:** Requires creating repository and service layers for each content module rather than writing ad-hoc Mongoose queries inside components.
