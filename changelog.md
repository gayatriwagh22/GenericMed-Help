# 📝 Changelog — GenericMed Help

> **Purpose:** Chronological history of all project changes.
> AI assistants **must** append a new entry after every meaningful code change.
> Format follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).

---

## Changelog Template

<!--
Copy this template for each new release. Place newest entries at the top.

## [X.Y.Z] — YYYY-MM-DD

### Added
- New feature or capability.

### Changed
- Modifications to existing features.

### Fixed
- Bug fixes.

### Removed
- Removed features or deprecated code.

### Security
- Security-related changes.

### Documentation
- Documentation updates.
-->

---

## [Unreleased]

_Changes that are in development but not yet tagged for release._

---

## [0.1.0] — 2026-09-08

> **Initial prototype release.** Full frontend demo with mock data, 9 screens, and comprehensive UI.

### Added

- **Project Setup**
  - Initialized Vite 6 + React 19 + TypeScript 5.8 project.
  - Configured Tailwind CSS v4 with `@tailwindcss/vite` plugin.
  - Set up custom `@theme` design tokens in `src/index.css` (primary teal, savings emerald, alert amber, etc.).
  - Loaded Plus Jakarta Sans font from Google Fonts.
  - Configured Material Symbols Outlined icon font.
  - Set up path alias `@/*` for project root imports.
  - Added `.env.example` with `GEMINI_API_KEY` and `APP_URL` placeholders.
  - Added `.gitignore` for `node_modules/`, `dist/`, `.env*`, and common OS files.

- **Type System** (`src/types.ts`)
  - Defined `DosageStrength` interface (label, multiplier, prices, dissolution, bioavailability).
  - Defined `DosageForm` interface (label, icon).
  - Defined `PackSize` interface (label, count, price, isBestValue).
  - Defined `CanonicalMedicine` interface (full medicine model with batch inspection, strengths, forms, pack sizes, brand equivalents).
  - Defined `PharmacyOffer` interface (pharmacy details, pricing, delivery, stock, verification).
  - Defined `CartItem` interface (medicine + selected variant + offer + quantity).
  - Defined `Order` interface (full order model with status, address, payment, tracking).
  - Defined `UserProfile` interface (multi-role: patient, doctor, pharmacist; ABHA ID support).
  - Defined `AppScreen` union type (9 screens: home, drug_detail, compare_offers, search_catalog, cart_checkout, order_tracking, partner_portal, architecture, auth).

- **Mock Data** (`src/data/mockData.ts`)
  - Created comprehensive `MEDICINES` array with realistic Indian pharmaceutical data (Paracetamol IP and others).
  - Created `PHARMACY_OFFERS` array with multiple pharmacy types (retail, government, chain, online).
  - Included realistic pricing, bioequivalence data, batch inspection records, and NABL lab certifications.

- **Screens & Components**
  - `App.tsx` — Root component with all navigation, state management, home screen UI, bottom navigation bar, and mobile/desktop view toggle.
  - `DrugDetailScreen.tsx` — Full medicine detail view with variant matrix selector, price comparison, bioequivalence panel, batch inspection, brand equivalents.
  - `CatalogSearchScreen.tsx` — Medicine catalog with search and browse functionality.
  - `CompareOffersScreen.tsx` — Multi-pharmacy offer comparison with sorting, filtering, and badges.
  - `CartCheckoutScreen.tsx` — Shopping cart with delivery address form, payment selection, and order summary.
  - `OrderTrackingScreen.tsx` — Order tracking with status timeline.
  - `PartnerPortal.tsx` — Pharmacy partner dashboard.
  - `ArchitectureView.tsx` — Technical architecture documentation and visualization.
  - `AuthScreen.tsx` — Login and registration screen with role selection.
  - `LabCertificateModal.tsx` — Modal for viewing NABL lab certificates and batch QC data.

- **UI/UX Features**
  - Mobile frame / desktop view toggle.
  - Bottom navigation bar with screen switching.
  - Toast notification system.
  - Bookmark/save medicines functionality.
  - Responsive design across all screens.
  - Micro-animations with Framer Motion.
  - Custom scrollbar styling.

- **AI Context Files**
  - Created `decisions.md` with 6 initial architectural decisions (DEC-001 through DEC-006).
  - Created `rules.md` with comprehensive project rules (coding standards, naming conventions, UI/UX, git, security, AI behavior).
  - Created `memory.md` with full project context (overview, tech stack, features, API plans, schema, business logic, known issues, roadmap).
  - Created `changelog.md` (this file).

### Known Issues

- Browser back button does not navigate between screens (no URL-based routing).
- Cart supports only a single item at a time.
- No form validation on checkout delivery address.
- Authentication is mocked (hardcoded user profile).
- `package.json` name is `react-example` instead of `genericmed-help`.

---

## Version History Summary

| Version  | Date       | Highlights                          |
|----------|------------|-------------------------------------|
| `0.1.0`  | 2026-09-08 | Initial prototype — 9 screens, mock data, full UI |

---

> **Last Updated:** 2026-09-08
