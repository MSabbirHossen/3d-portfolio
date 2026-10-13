# Legacy Portfolio Data Migration Strategy & Schema Mappings

**Document ID:** PORTFOLIO-MIG-001  
**Version:** 1.0  
**Date:** 2026-10-13  
**Status:** Approved Migration Blueprint  
**Task ID:** IMP-P0-05  
**Auditor:** Principal Software Architect & Full-Stack Engineer  
**Companion Documents:** `docs/AUDIT.md`, `docs/BACKEND_SCHEMA.md`, `docs/TRD.md`  

---

## 1. Migration Objectives & Principles

1. **Preserve Authentic Data:** Maintain original names, dates, links, credentials, and achievements from the legacy repository (`MSabbirHossen.github.io` commit `db32ec579b7af695ee785ed38f2c23541ae8e2ab`).
2. **Never Fabricate Content:** Where data is commented out or missing (e.g., credentials without links or projects without live demos), import with status `draft`.
3. **Idempotence:** Migration scripts (to run in Phase 6) must be safely repeatable without duplicating records, using unique natural keys (`slug`, `credentialId`, `name`).
4. **Decouple Data from UI Bundles:** Convert hardcoded React icon components (`SiReact`) into string icon identifiers (`si-react`, `lucide-code`).
5. **Asset Integrity:** Screenshots and resume PDFs must be uploaded to Cloudinary or secure media storage, recording verified metadata in MongoDB `media_assets`.

---

## 2. Source-to-Target Field Mapping Matrix

### 2.1 Profile (`src/data/personal/*` -> `profiles` collection)
| Legacy Source Field | Target Mongoose Field | Type | Transformation / Default Rule |
|---|---|---|---|
| `name` | `fullName` | `String` | Copied as `"Md. Sabbir Hossen"` |
| `title` | `headline` | `String` | Copied as `"MERN Stack Developer"` |
| `secondaryTitle` | `subheadline` | `String` | Copied as `"AI Integration - Security-Aware Development"` |
| `tagline` & `mission` | `shortBio` | `String` | Combined editorial summary |
| `journey` | `fullBio` | `String` | Formatted markdown biography |
| `location` | `location` | `String` | `"Medina, Saudi Arabia (Originally from Bangladesh)"` |
| `email` | `contactEmail` | `String` | `"mshossen724@gmail.com"` |
| `availability` | `availability` | `[String]` | `["Full-time", "Internship", "Freelance"]` |
| `github`, `linkedin`, `facebook` | `socialLinks` | `[{ platform, url }]` | Structured array of verified URLs |
| `languages` | `languages` | `[{ language, level, percentage }]` | Normalized array from `languages.js` |
| `values` | `values` | `[{ title, description }]` | Normalized array from `values.js` |
| `vision` | `vision` | `[String]` | Array of vision statements from `vision.js` |
| `resumeUrl` | `resumeMediaId` | `ObjectId` | Linked to migrated resume PDF asset |

### 2.2 Projects (`src/data/projects/*` -> `projects` collection)
| Legacy Source Field | Target Mongoose Field | Type | Transformation / Default Rule |
|---|---|---|---|
| `id` | `slug` | `String` | Lowercase URL-safe string (e.g., `eta-digital-education-platform`) |
| `title` | `title` | `String` | Direct string copy |
| `category` | `category` | `String` | Normalized category (`Full-Stack`, `MERN Stack`, etc.) |
| `overview` | `summary` | `String` | Concise paragraph for project cards |
| `overview` | `description` | `String` | Expanded markdown case study |
| `featured` | `featured` | `Boolean` | Boolean flag (7 active = true/false per source) |
| `featuredOrder` | `featuredOrder` | `Number` | Integer ordering (1 to 7) |
| `year` / `duration` | `period` | `String` | Period string (e.g., `"2026"`) |
| `role` | `role` | `String` | Author role (e.g., `"Solo Developer"`, `"Full Stack MERN Developer"`) |
| `technologies` | `technologies` | `[String]` | Array of technology names (e.g., `["React 19", "TypeScript", "Node.js"]`) |
| `architecture` | `architecture` | `[String]` | Array of bulleted architectural highlights |
| `challenges` | `challenges` | `[String]` | Array of technical challenges faced |
| `lessonsLearned` | `lessonsLearned` | `[String]` | Array of engineering takeaways |
| `futureImprovements` | `futureImprovements` | `[String]` | Array of planned capabilities |
| `features` / `keyFeatures` | `features` | `[String]` | Array of product features |
| `apiEndpoints` | `apiEndpoints` | `[String]` | Array of documented endpoints |
| `githubUrl` | `githubUrl` | `String` | Verified repository link |
| `liveUrl` | `liveUrl` | `String` | Deployed URL (omit or draft if placeholder) |
| `screenshots[0]` | `coverMediaId` | `ObjectId` | Resolved to Cloudinary `media_assets` ID |
| `status` (legacy) | `status` | `String` | Active verified -> `"published"`; Incomplete/commented -> `"draft"` |

### 2.3 Certifications (`src/data/certifications/*` -> `certifications` collection)
| Legacy Source Field | Target Mongoose Field | Type | Transformation / Default Rule |
|---|---|---|---|
| `title` | `title` | `String` | Direct string copy |
| `title` | `slug` | `String` | Slugified title (`slugify(title, { lower: true })`) |
| `issuer` | `issuer` | `String` | Organization name |
| `date` | `issueDate` | `Date` | Normalized ISO Date (`"2026-01-01T00:00:00.000Z"`) |
| `id` | `credentialId` | `String` | Preserved ID (e.g., `"WEB12-3517"`, `"UC-a15ae6ed..."`) |
| `link` | `credentialUrl` | `String` | Verification link or Google Drive proof link |
| (active vs commented) | `status` | `String` | Active with link -> `"published"`; Commented -> `"draft"` |

### 2.4 Skills (`src/data/skills/*` -> `skills` collection)
| Legacy Source Field | Target Mongoose Field | Type | Transformation / Default Rule |
|---|---|---|---|
| `name` | `name` | `String` | Direct string (e.g., `"React 19"`, `"TypeScript"`) |
| `name` | `slug` | `String` | Slugified name (`slugify(name, { lower: true })`) |
| `category` | `category` | `String` | `"Frontend"`, `"Backend"`, `"Tools"`, `"Soft Skills"`, `"Learning / Exploring"` |
| `icon` | `iconIdentifier` | `String` | Decoupled icon token (e.g., `"si:SiReact"`, `"si:SiTypescript"`) |
| (category position) | `displayOrder` | `Number` | Integer sequence within category |
| Default | `status` | `String` | `"published"` |

### 2.5 Education (`src/data/education/*` -> `education` collection)
| Legacy Source Field | Target Mongoose Field | Type | Transformation / Default Rule |
|---|---|---|---|
| `institution` | `institution` | `String` | Institution name |
| `degree` | `degree` | `String` | Degree or certificate title |
| `period` | `period` | `String` | Direct string (e.g., `"Present"`, `"2021"`) |
| `desc` | `description` | `String` | Narrative and GPA achievement details |
| (active vs commented) | `status` | `String` | Active -> `"published"`; Commented -> `"draft"` |

### 2.6 Experience (`src/data/experience/*` -> `experience` collection)
| Legacy Source Field | Target Mongoose Field | Type | Transformation / Default Rule |
|---|---|---|---|
| `company` | `company` | `String` | Project / Company name |
| `role` | `role` | `String` | Role title |
| `period` | `period` | `String` | Sprint / period string (e.g., `"2026 · 3-week build"`) |
| `desc` | `description` | `String` | Overview narrative |
| `outcomes` | `outcomes` | `[String]` | Array of demonstrable outcomes |
| Default | `status` | `String` | `"published"` |

---

## 3. Media Preservation & Asset Pipeline

1. **Local Asset Staging:** Existing images in `public/screenshots/` and PDF in `public/resume/` will be preserved in the repository assets during development.
2. **Cloudinary Asset Upload (Phase 6):**
   - Upload screenshots to Cloudinary folder `portfolio/projects/`.
   - Upload resume PDF to Cloudinary folder `portfolio/documents/`.
   - Record returned `secure_url`, `public_id`, `width`, `height`, and `format` into MongoDB `media_assets`.
3. **Reference Linking:** Project and certification migration records will link to `coverMediaId` matching the corresponding uploaded `media_assets` document.

---

## 4. Sample Normalized JSON Fixtures

### 4.1 Sample Project Fixture (`eta-digital-education-platform.json`)
```json
{
  "slug": "eta-digital-education-platform",
  "title": "Exploratory Training Academy (ETA)",
  "category": "Full-Stack Education Platform",
  "summary": "A complete digital education management platform designed for educational institutions operating online, physically, or in a hybrid model.",
  "description": "A complete digital education management platform designed for educational institutions operating online, physically, or in a hybrid model. Built with TypeScript, React, Node.js, Express, PostgreSQL, and Docker to provide seamless multi-modal learning workflows, automated attendance, dynamic course scheduling, and secure role-based portals.",
  "role": "Solo Developer",
  "period": "2026",
  "featured": true,
  "featuredOrder": 1,
  "status": "published",
  "technologies": [
    "TypeScript",
    "React 19",
    "Node.js",
    "Express.js",
    "PostgreSQL",
    "Docker",
    "Tailwind CSS",
    "Vite",
    "JWT Auth",
    "RESTful API"
  ],
  "architecture": [
    "TypeScript-based full-stack architecture ensuring strict end-to-end type safety.",
    "Modular component hierarchy with responsive glassmorphism layouts.",
    "Express and Node.js REST API layer with controllers, services, and secure middleware.",
    "PostgreSQL relational schema modeling complex course hierarchies and attendance records.",
    "Containerized multi-stage Docker configuration ensuring environment parity."
  ],
  "challenges": [
    "Accommodating divergent workflows for online, physical classroom, and hybrid delivery.",
    "Managing concurrent student enrollments and multi-tier prerequisite validations.",
    "Designing an intuitive role-based permissions matrix spanning four user roles."
  ],
  "lessonsLearned": [
    "Adopting TypeScript across the full stack drastically reduces contract drift.",
    "Docker containerization streamlines PostgreSQL database migrations and team onboarding."
  ],
  "futureImprovements": [
    "AI-powered personalized learning recommendations.",
    "Advanced analytics dashboard with predictive drop-out detection."
  ],
  "githubUrl": "https://github.com/MSabbirHossen/ETA",
  "liveUrl": "https://eta.example.com/",
  "coverAssetFilename": "eta-dashboard.png"
}
```

### 4.2 Sample Certification Fixture (`complete-web-dev.json`)
```json
{
  "slug": "complete-web-development-course",
  "title": "Complete Web Development Course",
  "issuer": "Programming Hero",
  "issueDate": "2026-01-01T00:00:00.000Z",
  "credentialId": "WEB12-3517",
  "credentialUrl": "https://drive.google.com/file/d/1TXbu_27BV0e6ttHZ5iOIk0iH6GrYfZYi/view?usp=sharing",
  "featured": true,
  "status": "published"
}
```

### 4.3 Sample Skill Fixture (`react-19.json`)
```json
{
  "slug": "react-19",
  "name": "React 19",
  "category": "Frontend",
  "iconIdentifier": "si:SiReact",
  "displayOrder": 1,
  "status": "published"
}
```
