# Legacy Portfolio Repository Audit & Component Inventory

**Document ID:** PORTFOLIO-AUD-001  
**Version:** 1.0  
**Date:** 2026-10-13  
**Status:** Complete (Verified)  
**Task IDs:** IMP-P0-01, IMP-P0-02  
**Auditor:** Principal Software Architect & Engineering Agent  
**Source Repository:** `https://github.com/MSabbirHossen/MSabbirHossen.github.io`  
**Live Site:** `https://msabbirhossen.github.io/`  
**Audited Commit Hash:** `db32ec579b7af695ee785ed38f2c23541ae8e2ab`  
**Audited Branch:** `main` (also verified branches `dev` and `3d-portfolio` at `df84b15d313fd860971a6a15d795dcc5a44cf753`)  

---

## 1. Executive Summary

This document establishes the verified technical baseline of the existing personal portfolio of Md. Sabbir Hossen before any migration or new application development. In accordance with `AGENTS.md` and Phase 0 of `docs/IMPLEMENTATION_PLAN.md`, this audit preserves existing data integrity without fabricating credentials, achievements, or biographical facts.

The legacy application is a client-rendered Single Page Application (SPA) built with React 19, Vite, and Tailwind CSS v4, deployed via GitHub Pages (`https://msabbirhossen.github.io`). Content is stored in static JavaScript files (`src/data/*`).

---

## 2. Repository & Runtime Environment

### 2.1 Git Metadata
- **Origin URL:** `https://github.com/MSabbirHossen/MSabbirHossen.github.io.git`
- **Default Branch:** `main`
- **Head Commit:** `db32ec579b7af695ee785ed38f2c23541ae8e2ab`
- **Author:** `MSabbirHossen <mshossen724@gmail.com>`
- **Date:** `Tue Oct 13 19:28:08 2026 +0300`
- **Commit Message:** `Merge branch 'main' of https://github.com/MSabbirHossen/MSabbirHossen.github.io`

### 2.2 Directory Structure
```text
legacy-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment workflow
├── public/
│   ├── resume/
│   │   └── Md_Sabbir_Hossen_Resume.pdf (3,986,655 bytes)
│   ├── screenshots/
│   │   ├── app-store-hero.png (285,329 bytes)
│   │   ├── digital-life-lessons-hero.png (227,154 bytes)
│   │   ├── eta-dashboard.png (572,339 bytes)
│   │   ├── game-library-hero.png (1,122,032 bytes)
│   │   ├── import-export-hub-hero.png (523,964 bytes)
│   │   ├── life-os-dashboard.png (256,355 bytes)
│   │   └── movie-explorer-hero.png (688,061 bytes)
│   ├── 404.html
│   ├── favicon.svg
│   ├── icons.svg
│   ├── llms.txt
│   ├── og-image.svg
│   └── stats.json
├── scripts/
│   ├── generate-llms-txt.mjs
│   ├── resolve-src-imports.mjs
│   └── update-stats.js
├── src/
│   ├── components/             # 45+ UI presentation components
│   │   ├── about/
│   │   ├── animations/
│   │   ├── common/
│   │   ├── contact/
│   │   ├── current-focus/
│   │   ├── experience/
│   │   ├── footer/
│   │   ├── github/
│   │   ├── hero/
│   │   ├── layout/
│   │   ├── project-details/
│   │   ├── projects/
│   │   ├── sections/
│   │   └── skills/
│   ├── data/                   # Static content modules
│   │   ├── certifications/
│   │   ├── collaboration/
│   │   ├── education/
│   │   ├── experience/
│   │   ├── focus/
│   │   ├── icons/
│   │   ├── personal/
│   │   ├── projects/
│   │   └── skills/
│   ├── hooks/                  # Custom React hooks (useAIChat, useCountAnimation)
│   ├── layouts/                # MainLayout
│   ├── lib/                    # AI intent matcher & knowledge engine
│   ├── pages/                  # Home, NotFound, ProjectDetails
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

### 2.3 Dependency Analysis (`package.json`)
| Package | Version | Role in Legacy App | Target Next.js 15+ Equivalent |
|---|---|---|---|
| `react` / `react-dom` | `^19.2.7` | UI library | React 19 (Server + Client Components) |
| `vite` | `^8.1.0` | Build tool / Bundler | Next.js App Router compiler (Turbopack) |
| `@tailwindcss/vite` / `tailwindcss` | `^4.3.2` | Utility CSS | Tailwind CSS (standard configured for Next.js) |
| `react-router-dom` | `^7.18.0` | Client routing | Next.js App Router file-system routing |
| `framer-motion` | `^12.42.0` | Micro-interactions | Motion / Framer Motion (client islands) |
| `@emailjs/browser` | `^4.4.1` | Client-side contact emails | Replaced by server route `/api/v1/contact` (Resend/Nodemailer) |
| `react-helmet-async` | `^3.0.0` | Document head metadata | Built-in Next.js `generateMetadata` (Server-side SEO) |
| `react-hook-form` | `^7.80.0` | Form state | React Hook Form + Zod resolvers |
| `react-icons` | `^5.7.0` | SVG icons | Lucide React / React Icons |
| `react-toastify` | `^11.1.0` | Toast notifications | Sonner / shadcn-ui toast |
| `react-countup` | `^6.5.3` | Stat counters | Lightweight client counter / Framer Motion |
| `date-fns` | `^4.4.0` | Date utility | `date-fns` or native Intl |

---

## 3. Routes & UI Component Matrix (IMP-P0-02)

### 3.1 Legacy Routes (`react-router-dom`)
| Legacy Path | Component | Description | Data Source |
|---|---|---|---|
| `/` | `Home.jsx` | Single-page scroll layout containing Hero, About, Skills, Projects, Education, Certifications, Experience, GitHub Stats, Contact | Multiple files in `src/data/*` |
| `/projects/:id` | `ProjectDetails.jsx` | Dedicated project case study view | `src/data/projects/*` |
| `*` | `NotFound.jsx` | 404 fallback page | Static UI |

### 3.2 Legacy Component Inventory
| Module | Components | State & Interactive Behavior | Reusability Assessment |
|---|---|---|---|
| **Layout** | `Header`, `NavLinks`, `MobileMenu`, `ThemeToggle`, `MainLayout` | Sticky header with blur, dark/light theme switch via class toggle, mobile drawer | Redesign using Tailwind + shadcn/ui; leverage Next.js layouts |
| **Hero** | `HeroContent`, `HeroActions`, `HeroImage`, `heroVariants` | Text motion, social links, download resume CTA, avatar card | Re-architect with selective React Three Fiber 3D canvas and static fallback |
| **About** | `About.jsx`, `VisionCard`, `ValueCard`, `LanguageCard` | Displays bio, values, vision, spoken languages | Transform to Server Component querying `/api/v1/profile` |
| **Skills** | `Skills.jsx`, `SkillCategoryCard`, `categoryIcons` | Filter tabs / categorized cards with icons | Model as dynamic skills from MongoDB Atlas |
| **Projects** | `ProjectCard`, `ProjectGrid`, `ProjectFilters`, `ProjectMeta`, `ProjectLinks` | Filter by category (MERN, React, AI), responsive grid, links to demo/github/details | Core MVP feature; migrate to MongoDB `projects` collection |
| **Project Details**| `ProjectHero`, `ProjectTechStack`, `ProjectArchitecture`, `ProjectChallenges`, `ProjectLessons`, `ProjectApiEndpoints`, `ProjectLinks` | Rich case study layout | Move to dynamic Server Component `/projects/[slug]` with SEO metadata |
| **Certifications**| `Certifications.jsx`, `CertificateCard` | Grid of certificates with external links & IDs | Move to `/certifications` & `/certifications/[slug]` backed by CMS |
| **Education** | `Education.jsx`, `TimelineCard` | Academic milestones | Move to dynamic collection |
| **Experience** | `Experience.jsx`, `ExperienceCard` | Practical & self-initiated product sprints | Move to dynamic collection |
| **GitHub Stats** | `GitHubStats.jsx`, `RecentRepos.jsx`, `LanguagesChart`, `StatsCards` | Consumes static `public/stats.json` or live GitHub API | Defer live sync to Phase 9 (V1.5); use cached server route |
| **Contact** | `ContactForm.jsx`, `ContactInfo.jsx`, `CollaborationCard` | EmailJS form with validation | Replace with secure Next.js Route Handler `/api/v1/contact` |
| **AI Assistant** | `useAIChat.js`, `intentMatcher.js`, `responseBuilder.js` | Rule/intent-based client chatbot | **Explicitly out of scope for MVP** (scheduled for V2 Phase 10) |

---

## 4. Asset Manifest (IMP-P0-03)

| Asset Path | Type | File Size | Content Description | Target Storage |
|---|---|---|---|---|
| `/resume/Md_Sabbir_Hossen_Resume.pdf` | PDF Document | 3.98 MB | Official Curriculum Vitae / Resume of Md. Sabbir Hossen | Cloudinary / Private asset storage with public CDN route |
| `/screenshots/eta-dashboard.png` | PNG Image | 572 KB | Exploratory Training Academy project hero banner | Cloudinary / WebP optimized |
| `/screenshots/import-export-hub-hero.png` | PNG Image | 524 KB | Import Export Hub marketplace hero banner | Cloudinary / WebP optimized |
| `/screenshots/digital-life-lessons-hero.png`| PNG Image | 227 KB | Digital Life Lessons discussion platform hero | Cloudinary / WebP optimized |
| `/screenshots/life-os-dashboard.png` | PNG Image | 256 KB | Life OS personal dashboard interface screenshot | Cloudinary / WebP optimized |
| `/screenshots/movie-explorer-hero.png` | PNG Image | 688 KB | MovieExplorer title browser screenshot | Cloudinary / WebP optimized |
| `/screenshots/game-library-hero.png` | PNG Image | 1.12 MB | Online Game Library showcase hero | Cloudinary / WebP optimized |
| `/screenshots/app-store-hero.png` | PNG Image | 285 KB | Personal App Store application interface | Cloudinary / WebP optimized |
| `/favicon.svg` | SVG Vector | 9.5 KB | Site branding icon | `public/favicon.svg` |
| `/og-image.svg` | SVG Vector | 1.7 KB | Social OpenGraph sharing card | Generated dynamic OG route or static asset |
| `/stats.json` | JSON Data | 2.7 KB | Cached GitHub repository statistics | MongoDB or dynamic cache |

---

## 5. Issues Register & Credential Remediation Plan (IMP-P0-04)

### 5.1 Credential & Security Analysis
| Issue ID | Severity | Component / Location | Description | Remediation Plan |
|---|---|---|---|---|
| SEC-01 | Medium | `src/components/contact/ContactForm.jsx` | Client-side EmailJS integration exposes template and service IDs in browser bundles; susceptible to script automated spam without CAPTCHA or server rate-limiting. | Eliminate `@emailjs/browser`. Route all submissions through `/api/v1/contact` with Zod validation, IP rate-limiting, honeypot fields, and server-side storage in MongoDB `contact_messages`. Server dispatches notifications via secure server credentials. |
| SEC-02 | Low | `.env.example` | Legacy `.env.example` contains only EmailJS keys. Missing templates for future database and authentication credentials. | Create comprehensive, sanitized `.env.example` covering `MONGODB_URI`, `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `SESSION_SECRET`, and `CLOUDINARY_*`. |
| SEC-03 | Low | `public/stats.json` & `scripts/update-stats.js` | Update script requires `process.env.GH_TOKEN` to fetch GitHub statistics. | Run GitHub metadata queries on the Next.js server with caching and ISR; never expose GitHub tokens to the browser. |

### 5.2 Content & Data Quality Findings
| Finding ID | Severity | Affected Entity | Finding | Recommended Policy |
|---|---|---|---|---|
| DAT-01 | Medium | Projects | `etaProject.js` lists placeholder `liveUrl: 'https://eta.example.com/'`. | Mark `etaProject` publication status as `published` only if live URL is verified, or omit `liveUrl` rendering when equal to placeholder. |
| DAT-02 | Medium | Projects | `src/data/projects/` contains both `etaProject.js` and duplicate file `eta-project.ts`. | Canonicalize to a single source entity during migration. |
| DAT-03 | Low | Projects | Three projects in `projects/index.js` are commented out (`portfolio-website`, `exploratory-lab`, `learning-tracker`) with dummy URLs (`sabbir.dev`, `lab.sabbir.dev`). | Import as `draft` in MongoDB. Do not publish until verified by owner. |
| DAT-04 | Low | Certifications | Two certifications commented out (`IELTS Preparation Course`, `Basic IT Course`) without credential links. | Import as `draft` in MongoDB. |
| DAT-05 | Low | Education | Two education entries commented out (`Islami Arabic University`, `Oakland English Research Centre`). | Import as `draft` in MongoDB. |
| DAT-06 | Low | Skills | Skill icons are coupled to React icon components (`SiReact`, etc.) inside data files. | Decouple data from icon packages; store icon identifier strings (`si-react`, `lucide-code`) in MongoDB. |

---

## 6. Technical Debt & Scope Gaps

1. **State Persistence Debt:** All content in the legacy portfolio is statically bundled. Any typo fix or project addition required a Git commit and GitHub Actions redeploy. The target CMS eliminates this completely.
2. **SEO & Indexing Debt:** Client-side React 19 SPA relies on `react-helmet-async`. Crawlers without JavaScript execution cannot index case study pages. Next.js Server Components solve this natively.
3. **No Draft or Concurrency Safeguards:** Zero draft capability existed in the legacy application.
4. **AI Assistant Portability:** The legacy client chatbot was built on a custom intent matcher. Per PRD and TRD scope decisions, this feature is explicitly deferred to V2 (Phase 10) to keep the MVP launch focused, performant, and secure.

