# 📋 Architectural & Product Decisions Log

> **Purpose:** Document every important technical and product decision for GenericMed Help.
> AI assistants **must** read this file before proposing changes and **must** append new entries when making significant decisions.

---

## Decision Template

<!--
Copy and fill this template for each new decision.

### DEC-XXX: [Decision Title]

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-XXX                              |
| **Date**               | YYYY-MM-DD                           |
| **Status**             | `accepted` / `proposed` / `deprecated` / `superseded` |
| **Deciders**           | Name / Role                          |

**Context / Problem:**
_Describe the situation or problem that prompted this decision._

**Decision:**
_State the decision clearly and concisely._

**Reasoning:**
_Explain why this decision was made over alternatives._

**Alternatives Considered:**

| Alternative            | Pros                    | Cons                     |
|------------------------|-------------------------|--------------------------|
| Alt A                  | ...                     | ...                      |
| Alt B                  | ...                     | ...                      |

**Impact on Project:**
- _Impact item 1_
- _Impact item 2_
-->

---

## Accepted Decisions

---

### DEC-007: SQLite for the Phase 1 Local Backend

| Field | Details |
|---|---|
| **Decision ID** | DEC-007 |
| **Date** | 2026-09-09 |
| **Status** | `accepted` |
| **Deciders** | Project implementation |

**Context / Problem:** Phase 1 needs a running, seedable relational database without requiring external infrastructure during local development.

**Decision:** Use SQLite through Node.js's built-in `node:sqlite` for the Phase 1 development backend. Preserve the existing Prisma schema as a model reference; migrate to PostgreSQL before multi-instance production deployment.

**Reasoning:** SQLite provides transactional relational storage, foreign keys, indexes, and a zero-setup developer experience. Node 22 supplies the driver, so no native dependency or database service is required.

**Impact on Project:** `prisma/dev.db` is generated locally; the server initializes the relational schema and seeds the existing typed mock catalog on startup. Production data infrastructure remains a Phase 3 deployment decision.

---

### DEC-008: Guardrailed Server-Side Gemini Access

| Field | Details |
|---|---|
| **Decision ID** | DEC-008 |
| **Date** | 2026-09-09 |
| **Status** | `accepted` |
| **Deciders** | Project implementation |

**Decision:** Gemini requests are made only from the Express server. Results must be JSON, are cached for ten minutes, rate-limited per client IP, and always carry a medical-information disclaimer.

**Reasoning:** This protects the API key and keeps model output within catalog discovery and safety education. The dosage endpoint intentionally does not supply individualized dosage or treatment instructions.

**Impact on Project:** `GEMINI_API_KEY` is required only on the server; browsers call `/api/ai/*` endpoints and never receive the key.

---

### DEC-001: React + Vite + TypeScript as Frontend Stack

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-001                              |
| **Date**               | 2025-12-01 (estimated)               |
| **Status**             | `accepted`                           |
| **Deciders**           | Project founder                      |

**Context / Problem:**
Needed a performant, type-safe frontend framework for a medicine price-comparison SPA that requires complex state management (cart, orders, multi-screen navigation) and rapid iteration.

**Decision:**
Use **React 19** with **Vite 6** as the build tool and **TypeScript 5.8** for type safety.

**Reasoning:**
- React 19 provides the latest concurrent features and is the industry standard for SPAs.
- Vite offers near-instant HMR and superior DX compared to webpack-based alternatives.
- TypeScript catches interface/type mismatches at compile time—critical for the complex domain types (`CanonicalMedicine`, `PharmacyOffer`, `CartItem`, etc.).

**Alternatives Considered:**

| Alternative            | Pros                              | Cons                                |
|------------------------|-----------------------------------|-------------------------------------|
| Next.js (SSR/SSG)      | SEO, server components            | Over-engineering for SPA; no SSR needed for this use case |
| Plain JavaScript       | Zero config overhead              | No type safety for 10+ domain interfaces |
| Svelte / SvelteKit     | Smaller bundle, reactive by default | Smaller ecosystem, team expertise is in React |

**Impact on Project:**
- All source code lives in `src/` with `.tsx` / `.ts` extensions.
- Vite dev server runs on port 3000 (`npm run dev`).
- Path aliases configured: `@/*` maps to project root.

---

### DEC-002: Tailwind CSS v4 for Styling

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-002                              |
| **Date**               | 2025-12-01 (estimated)               |
| **Status**             | `accepted`                           |
| **Deciders**           | Project founder                      |

**Context / Problem:**
Need a utility-first CSS framework that supports rapid UI prototyping with a custom medical/pharmaceutical design system (teal primaries, savings-green, alert-amber, etc.).

**Decision:**
Use **Tailwind CSS v4** with the `@tailwindcss/vite` plugin and a custom `@theme` block in `src/index.css`.

**Reasoning:**
- Tailwind v4's `@theme` directive allows defining design tokens (colors, fonts) inline without a separate config file.
- The `@tailwindcss/vite` plugin provides zero-config integration with the existing Vite pipeline.
- Utility classes accelerate development without writing bespoke CSS.

**Alternatives Considered:**

| Alternative            | Pros                              | Cons                                |
|------------------------|-----------------------------------|-------------------------------------|
| Vanilla CSS            | Full control                      | Slow iteration, no utility classes  |
| Tailwind CSS v3        | Stable, widely adopted            | Requires `tailwind.config.js`; v4 is simpler |
| Chakra UI / MUI        | Pre-built components              | Heavy bundle size, design lock-in   |

**Impact on Project:**
- Design tokens are defined in `src/index.css` under `@theme { ... }`.
- All components use Tailwind utility classes directly in JSX `className` props.
- Custom scrollbar styles are in plain CSS in the same file.
- Font: **Plus Jakarta Sans** (loaded via Google Fonts in `index.html`).

---

### DEC-003: Client-Side State Management (useState Only)

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-003                              |
| **Date**               | 2025-12-01 (estimated)               |
| **Status**             | `accepted`                           |
| **Deciders**           | Project founder                      |

**Context / Problem:**
The app manages several pieces of state: current screen, selected medicine/strength/form/pack, cart, orders, user profile, and bookmarks. Needed to decide on a state management approach.

**Decision:**
Use React's built-in `useState` hooks in the root `App` component, passing state and setters as props to child screen components.

**Reasoning:**
- The app currently has a flat, single-level component hierarchy (App → Screen).
- No deep prop drilling beyond one level.
- Avoids the complexity of Redux, Zustand, or Context API for a prototype-stage app.

**Alternatives Considered:**

| Alternative            | Pros                              | Cons                                |
|------------------------|-----------------------------------|-------------------------------------|
| Redux Toolkit          | Scalable, devtools, middleware    | Boilerplate for current app size    |
| Zustand                | Minimal boilerplate               | Extra dependency for simple state   |
| React Context          | No extra dependency               | Re-render issues without memoization |

**Impact on Project:**
- All top-level state lives in `src/App.tsx`.
- Screen components receive props for data and callbacks.
- If the app grows significantly, this decision should be revisited (see DEC-003 for potential migration).

---

### DEC-004: Google Gemini AI Integration via `@google/genai`

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-004                              |
| **Date**               | 2025-12-01 (estimated)               |
| **Status**             | `accepted`                           |
| **Deciders**           | Project founder                      |

**Context / Problem:**
The platform requires AI capabilities for features like intelligent medicine search, drug interaction checks, and smart recommendations.

**Decision:**
Integrate **Google Gemini AI** via the `@google/genai` SDK (v2.4+), with the API key managed as a server-side environment variable (`GEMINI_API_KEY`).

**Reasoning:**
- Gemini offers strong medical/scientific knowledge capabilities.
- The official `@google/genai` SDK provides a clean TypeScript API.
- Server-side API key management prevents client-side exposure.

**Alternatives Considered:**

| Alternative            | Pros                              | Cons                                |
|------------------------|-----------------------------------|-------------------------------------|
| OpenAI API             | Widely adopted, GPT-4 quality     | Higher cost, no native Google integration |
| Local LLM (Ollama)     | Privacy, no API costs             | Requires GPU, lower quality for medical domain |
| No AI                  | Simplicity                        | Loses key differentiator            |

**Impact on Project:**
- `GEMINI_API_KEY` must be set in `.env` (see `.env.example`).
- Server-side code (Express) proxies AI requests to protect the API key.
- AI features are a major capability listed in `metadata.json`.

---

### DEC-005: Mock Data Architecture for Prototyping

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-005                              |
| **Date**               | 2025-12-01 (estimated)               |
| **Status**             | `accepted`                           |
| **Deciders**           | Project founder                      |

**Context / Problem:**
No backend API or database is available yet. The frontend needs realistic data to demonstrate all features (medicines, pharmacy offers, orders, etc.).

**Decision:**
Use a comprehensive mock data module (`src/data/mockData.ts`) exporting typed arrays (`MEDICINES`, `PHARMACY_OFFERS`) that the app consumes directly.

**Reasoning:**
- Enables full UI development and demonstration without backend dependencies.
- Mock data is fully typed against the domain interfaces, ensuring type parity with the future API.
- Easy to swap out for real API calls later.

**Alternatives Considered:**

| Alternative            | Pros                              | Cons                                |
|------------------------|-----------------------------------|-------------------------------------|
| JSON files             | Separates data from code          | No type safety at import time       |
| MSW (Mock Service Worker) | Realistic network simulation   | Over-engineering for current stage   |
| Live API from day one  | Real data                         | Blocks frontend development         |

**Impact on Project:**
- All mock data lives in `src/data/mockData.ts`.
- Components import from `./data/mockData` instead of making API calls.
- Migration path: replace imports with `fetch()` / API client calls.

---

### DEC-006: Screen-Based Navigation Without React Router

| Field                  | Details                              |
|------------------------|--------------------------------------|
| **Decision ID**        | DEC-006                              |
| **Date**               | 2025-12-01 (estimated)               |
| **Status**             | `accepted`                           |
| **Deciders**           | Project founder                      |

**Context / Problem:**
The app has 9 distinct screens (home, drug_detail, compare_offers, search_catalog, cart_checkout, order_tracking, partner_portal, architecture, auth). Needed to decide on a routing approach.

**Decision:**
Use a simple `AppScreen` union type with a `currentScreen` state variable in `App.tsx`. Render screens via conditional logic (switch/if statements).

**Reasoning:**
- No URL-based navigation is needed for the current prototype/demo stage.
- Avoids the complexity and bundle size of React Router.
- The `AppScreen` type provides compile-time exhaustiveness checks.

**Alternatives Considered:**

| Alternative            | Pros                              | Cons                                |
|------------------------|-----------------------------------|-------------------------------------|
| React Router v6        | URL-based nav, browser back button | Extra dependency, unnecessary for demo |
| TanStack Router        | Type-safe routing                 | New library, learning curve         |

**Impact on Project:**
- `AppScreen` type defined in `src/types.ts` with 9 screen values.
- No URL changes on navigation; browser back button does not work.
- Should be revisited when the app goes to production.

---

## How to Add a New Decision

1. Copy the **Decision Template** above.
2. Assign the next sequential `DEC-XXX` ID.
3. Fill in all fields thoroughly.
4. Place it under **Accepted Decisions** (or create a new status section if needed).
5. If a decision supersedes an older one, update the old decision's status to `superseded` and link to the new one.
