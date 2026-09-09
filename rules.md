# 📏 Project Rules — GenericMed Help

> **Purpose:** Mandatory rules that **every AI assistant and contributor** must follow when working on this project.
> Violations of these rules should be flagged immediately. Never silently break a rule.

---

## Table of Contents

- [1. Coding Standards](#1-coding-standards)
- [2. Folder Structure Rules](#2-folder-structure-rules)
- [3. Naming Conventions](#3-naming-conventions)
- [4. UI/UX Consistency Rules](#4-uiux-consistency-rules)
- [5. Git Commit Rules](#5-git-commit-rules)
- [6. Security & Environment Variable Rules](#6-security--environment-variable-rules)
- [7. Behavioral Rules for AI Assistants](#7-behavioral-rules-for-ai-assistants)

---

## 1. Coding Standards

### Language & Framework

- **TypeScript** is mandatory for all source files (`.ts`, `.tsx`). No plain `.js` files in `src/`.
- **React 19** functional components only. No class components.
- **Strict typing:** Avoid `any`. All function parameters, return types, and props must be typed.
- Use **explicit interfaces** for component props (e.g., `interface DrugDetailScreenProps { ... }`).

### Code Quality

- Use `const` by default; use `let` only when reassignment is necessary. Never use `var`.
- Prefer **arrow functions** for inline callbacks and component definitions.
- Use **destructuring** for props and state.
- Keep components under **300 lines**. If a component exceeds this, extract sub-components.
- Use **early returns** for guard clauses instead of deep nesting.
- All magic numbers must be extracted to named constants or theme tokens.

### Formatting

- Indentation: **2 spaces** (configured in `tsconfig.json` / editor).
- Semicolons: **omit** (follow the existing codebase convention).
- Quotes: **single quotes** for strings.
- Trailing commas: **always** in multi-line structures.
- Max line length: **120 characters** (soft guideline).

### Imports

- Group imports in this order, separated by blank lines:
  1. React / React DOM
  2. Third-party libraries (`lucide-react`, `motion`, `@google/genai`)
  3. Internal types (`./types`)
  4. Internal data (`./data/*`)
  5. Internal components (`./components/*`)
  6. Styles (`./index.css`)
- Use the `@/` path alias for imports from the project root when needed.

### Comments

- Preserve all existing comments and docstrings unless the code they describe is being removed.
- Add `// TODO:` comments for known incomplete work.
- Add `// HACK:` comments for temporary workarounds with a link to the issue.
- License headers (`@license SPDX-License-Identifier: Apache-2.0`) must not be removed.

---

## 2. Folder Structure Rules

```
GenericMed-Help/
├── public/                  # Static assets (images, icons, fonts)
│   └── assets/              # Organized sub-folders for media
├── src/
│   ├── components/          # React screen/page components (one file per screen)
│   ├── data/                # Mock data and static data modules
│   ├── App.tsx              # Root component with state & navigation logic
│   ├── main.tsx             # React DOM entry point (DO NOT MODIFY)
│   ├── types.ts             # All TypeScript interfaces and type definitions
│   └── index.css            # Global styles and Tailwind @theme tokens
├── .env.example             # Environment variable template (committed)
├── .env                     # Actual environment variables (NEVER commit)
├── index.html               # HTML entry point with meta tags & fonts
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite + Tailwind + React plugin config
├── tsconfig.json            # TypeScript compiler configuration
├── decisions.md             # Architectural decisions log
├── rules.md                 # This file — project rules
├── memory.md                # Long-term project memory
└── changelog.md             # Chronological change history
```

### Rules

- **DO NOT** create files outside of this structure without updating this document.
- **Components go in `src/components/`** — one file per screen/page component.
- **Shared utilities** (if created) must go in `src/utils/`.
- **Custom hooks** (if created) must go in `src/hooks/`.
- **API client code** (when backend is added) must go in `src/api/` or `src/services/`.
- **DO NOT** put business logic in `public/`.
- **DO NOT** nest component folders deeper than one level (e.g., no `components/shared/buttons/`).
- `main.tsx` is the entry point — **do not add logic here** beyond rendering `<App />`.

---

## 3. Naming Conventions

### Files

| Type               | Convention              | Example                     |
|--------------------|-------------------------|-----------------------------|
| React Components   | PascalCase `.tsx`       | `DrugDetailScreen.tsx`      |
| TypeScript modules | camelCase `.ts`         | `mockData.ts`               |
| CSS files          | camelCase `.css`        | `index.css`                 |
| Config files       | camelCase / dot-prefix  | `vite.config.ts`, `.env`    |
| Markdown docs      | kebab-case `.md`        | `decisions.md`, `changelog.md` |

### Code

| Type               | Convention              | Example                     |
|--------------------|-------------------------|-----------------------------|
| Components         | PascalCase              | `CatalogSearchScreen`       |
| Interfaces / Types | PascalCase              | `CanonicalMedicine`         |
| Functions          | camelCase               | `showToast()`               |
| Variables / state  | camelCase               | `currentMedicine`           |
| Constants (exported)| UPPER_SNAKE_CASE       | `MEDICINES`, `PHARMACY_OFFERS` |
| CSS theme tokens   | kebab-case              | `--color-primary`           |
| Event handlers     | `handle` + Event        | `handleAddToCart`           |
| Boolean variables  | `is` / `has` / `should` prefix | `isVerified`, `isFreeDelivery` |

### Type Naming

- Interfaces for domain objects: noun (`CanonicalMedicine`, `PharmacyOffer`).
- Interfaces for component props: `ComponentNameProps` (e.g., `DrugDetailScreenProps`).
- Union types for enums: `AppScreen`, use string literal unions.

---

## 4. UI/UX Consistency Rules

### Design System

- **Primary color:** `#00685f` (teal) — use `--color-primary` token.
- **Savings/success color:** `#059669` (emerald) — use `--color-savings-emerald`.
- **Alert/warning color:** `#d97706` (amber) — use `--color-alert-amber`.
- **Verified badge color:** `#0284c7` (sky blue) — use `--color-badge-verified`.
- **Font:** Plus Jakarta Sans — loaded from Google Fonts. Never use a different font.
- **Icons:** Lucide React (`lucide-react`) and Material Symbols Outlined. No mixing icon libraries beyond these two.

### Component Design

- All interactive elements must have **hover and focus states**.
- Use **rounded corners** (`rounded-xl`, `rounded-2xl`) consistently. No sharp corners.
- Cards must use `bg-white rounded-2xl shadow-sm border border-border-subtle` as the base pattern.
- Buttons follow this hierarchy:
  - **Primary:** `bg-primary text-on-primary` — for main CTAs.
  - **Secondary:** `bg-surface-container text-on-surface` — for secondary actions.
  - **Ghost/Text:** transparent with text color — for tertiary actions.
- Use `motion` (Framer Motion) for page transitions and micro-animations.
- **Responsive design is mandatory.** The app supports both mobile frame and desktop views (`isMobileFrame` toggle).

### Spacing & Layout

- Use Tailwind's spacing scale consistently (`p-4`, `gap-3`, `mt-6`, etc.).
- Section spacing: `py-6` or `py-8` between major sections.
- Card internal padding: `p-4` or `p-5`.
- Never use inline styles. Use Tailwind utility classes exclusively.

### Accessibility

- All images must have `alt` attributes.
- Interactive elements must be keyboard accessible.
- Color contrast must meet WCAG AA standards.
- Use semantic HTML (`<nav>`, `<main>`, `<section>`, `<article>`).

---

## 5. Git Commit Rules

### Commit Message Format

Use **Conventional Commits** format:

```
<type>(<scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type       | Usage                                        |
|------------|----------------------------------------------|
| `feat`     | New feature or screen                        |
| `fix`      | Bug fix                                      |
| `refactor` | Code restructuring without behavior change   |
| `style`    | CSS / UI changes only                        |
| `docs`     | Documentation changes                        |
| `chore`    | Build config, dependencies, tooling          |
| `test`     | Adding or modifying tests                    |
| `perf`     | Performance improvements                     |

### Scopes

Use the component or module name: `auth`, `cart`, `drug-detail`, `search`, `offers`, `orders`, `partner`, `types`, `data`, `config`.

### Rules

- Keep subject line under **72 characters**.
- Use **imperative mood** ("Add feature" not "Added feature").
- Reference related decision IDs when applicable: `See DEC-003`.
- One logical change per commit — do not bundle unrelated changes.

---

## 6. Security & Environment Variable Rules

### Environment Variables

- **NEVER** commit `.env` files. The `.gitignore` already excludes `.env*` (except `.env.example`).
- All environment variables must be documented in `.env.example` with placeholder values.
- Required variables:
  - `GEMINI_API_KEY` — Google Gemini AI API key.
  - `APP_URL` — Deployed application URL.
- Access env vars server-side only. **Never expose API keys in client-side code.**
- Use `import.meta.env.VITE_*` prefix only for client-safe variables.

### API Keys & Secrets

- API keys must be passed through server-side proxies (Express).
- Never hardcode secrets, tokens, or API keys in source code.
- Never log sensitive data (API keys, user PII, medical data) to console.

### Medical Data Compliance

- User health/medical data must be treated as sensitive PII.
- Do not store medical data in localStorage or sessionStorage without encryption.
- All pharmacy/drug data must include proper disclaimers and compliance badges.

---

## 7. Behavioral Rules for AI Assistants

> These rules apply specifically to AI coding assistants working on this project.

### ❗ Critical Rules

- [ ] **NEVER break existing functionality** unless explicitly requested by the user.
- [ ] **NEVER remove or modify existing features** without explicit approval.
- [ ] **ALWAYS read `memory.md`** before starting work to understand project context.
- [ ] **ALWAYS read `decisions.md`** before proposing architectural changes.
- [ ] **ALWAYS update `changelog.md`** after making any meaningful code change.
- [ ] **ALWAYS update `memory.md`** when completing a feature or discovering a new issue.

### Before Writing Code

1. Read `memory.md` for project context and current state.
2. Read `decisions.md` for past architectural decisions.
3. Read `rules.md` (this file) for coding standards.
4. Check `changelog.md` for recent changes that might affect your work.

### While Writing Code

1. Follow all coding standards in Section 1.
2. Follow all naming conventions in Section 3.
3. Follow all UI/UX rules in Section 4.
4. Preserve existing comments, docstrings, and license headers.
5. Do not introduce new dependencies without documenting in `decisions.md`.

### After Writing Code

1. Update `changelog.md` with what changed.
2. Update `memory.md` if a feature was completed, an issue was found, or the roadmap changed.
3. Update `decisions.md` if an architectural decision was made.
4. Verify the build passes (`npm run lint`).

---

> **Last Updated:** 2026-09-08
