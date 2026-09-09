# 🧠 Project Memory — GenericMed Help

> **Purpose:** Long-term persistent memory for AI assistants working on this project.
> AI assistants **must** read this file at the start of every session and **must** update it when completing features, discovering issues, or changing the roadmap.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features Completed](#features-completed)
- [Pending Features](#pending-features)
- [API Endpoints](#api-endpoints)
- [Database Schema Summary](#database-schema-summary)
- [Important Business Logic](#important-business-logic)
- [Known Issues](#known-issues)
- [Future Roadmap](#future-roadmap)

---

## Project Overview

| Field             | Value                                                                 |
|-------------------|-----------------------------------------------------------------------|
| **Project Name**  | GenericMed Help                                                       |
| **Description**   | Online generic medicine price comparison & purchase platform with canonical variant matrix, bioequivalence verification, and multi-pharmacy offer comparison |
| **Target Users**  | Patients, Doctors, Pharmacists (India-focused)                        |
| **Current Stage** | Phase 1 backend foundation and Phase 2 safety features in progress    |
| **License**       | Apache-2.0                                                           |
| **Repository**    | `gayatriwagh22/GenericMed-Help`                                      |

### Value Proposition

GenericMed Help helps users find **affordable generic alternatives** to branded medicines by:

1. Comparing generic vs. branded prices with transparent savings calculations.
2. Displaying **bioequivalence data** (dissolution rate, bioavailability) to build trust.
3. Aggregating offers from multiple pharmacies (retail, government, chain, online).
4. Providing **NABL lab-verified** batch inspection data for quality assurance.

---

## Tech Stack

### Frontend

| Technology             | Version    | Purpose                                |
|------------------------|------------|----------------------------------------|
| React                  | 19.x       | UI framework                           |
| TypeScript             | 5.8.x      | Type safety                            |
| Vite                   | 6.2.x      | Build tool & dev server                |
| Tailwind CSS           | 4.1.x      | Utility-first CSS framework            |
| Lucide React           | 0.546.x    | Icon library (primary)                 |
| Material Symbols       | (CDN)      | Icon library (secondary)               |
| Motion (Framer Motion) | 12.x       | Animations & transitions               |
| Plus Jakarta Sans      | (CDN)      | Typography                             |

### Backend (Phase 1 Foundation)

| Technology             | Version    | Purpose                                |
|------------------------|------------|----------------------------------------|
| Express                | 4.21.x     | Server-side API proxy                  |
| `@google/genai`        | 2.4.x      | Google Gemini AI SDK                   |
| dotenv                 | 17.x       | Environment variable loading           |
| Node `node:sqlite`     | Node 22+   | Local relational development database  |

### Dev Tools

| Tool                   | Version    | Purpose                                |
|------------------------|------------|----------------------------------------|
| esbuild                | 0.25.x     | Fast JS bundler (used by Vite)         |
| tsx                    | 4.21.x     | TypeScript execution (scripts)         |
| autoprefixer           | 10.4.x     | CSS vendor prefixes                    |

---

## Features Completed

### ✅ Screens & Pages

- [x] **Home Screen** — Landing page with GenericMed Help branding, feature highlights, and navigation to all screens.
- [x] **Drug Detail Screen** (`DrugDetailScreen.tsx`) — Canonical medicine view with:
  - Dosage strength selector (500mg, 650mg, 1000mg ER)
  - Dosage form selector (Tablet, Syrup, Suppository)
  - Pack size selector with "Best Value" badge
  - Generic vs. Branded price comparison with savings percentage
  - Bioequivalence data display (dissolution rate, bioavailability)
  - Batch inspection panel (QC tests, assay, disintegration, impurity)
  - NABL lab certificate viewer
  - Brand equivalents comparison table
  - Guidance/warning display
- [x] **Catalog Search Screen** (`CatalogSearchScreen.tsx`) — Medicine search with filtering and browsing.
- [x] **Compare Offers Screen** (`CompareOffersScreen.tsx`) — Multi-pharmacy offer comparison with:
  - Price sorting and filtering
  - Pharmacy ratings and reviews
  - Delivery time and fee comparison
  - Stock status indicators
  - Verified partner badges
- [x] **Cart & Checkout Screen** (`CartCheckoutScreen.tsx`) — Shopping cart with:
  - Item quantity management
  - Delivery address form
  - Payment method selection
  - Order summary with savings display
- [x] **Order Tracking Screen** (`OrderTrackingScreen.tsx`) — Order status tracking with timeline.
- [x] **Partner Portal** (`PartnerPortal.tsx`) — Pharmacy partner dashboard.
- [x] **Architecture View** (`ArchitectureView.tsx`) — Technical architecture visualization.
- [x] **Auth Screen** (`AuthScreen.tsx`) — Login and registration with role selection (Patient, Doctor, Pharmacist).

### ✅ Core Features

- [x] Mobile frame / desktop view toggle (`isMobileFrame` state).
- [x] Screen-based navigation (`AppScreen` union type).
- [x] Toast notification system.
- [x] Bookmark/save functionality for medicines.
- [x] Mock user profile with ABHA ID integration.
- [x] Lab certificate modal (`LabCertificateModal.tsx`).

### ✅ Data Layer

- [x] Comprehensive TypeScript type definitions (`types.ts` — 10 interfaces/types).
- [x] Rich mock data (`mockData.ts` — medicines, pharmacy offers with realistic Indian pharmaceutical data).

---

## Pending Features

### 🔲 High Priority

- [x] **Backend API** — Express server with medicines, authentication, cart, order, profile, and AI endpoints.
- [ ] **Database integration** — PostgreSQL or MongoDB for persistent data storage.
- [ ] **Real authentication** — JWT/session-based auth (currently mock user).
- [ ] **Gemini AI integration** — Smart medicine search, drug interaction checks, dosage recommendations.
- [ ] **Real pharmacy data** — Connect to pharmacy APIs or build admin panel for data entry.

### 🔲 Medium Priority

- [ ] **Search autocomplete** — AI-powered medicine name suggestions.
- [ ] **Drug interaction checker** — Warn users about contraindications.
- [ ] **Prescription upload** — OCR-based prescription parsing.
- [x] **Persistent order placement** — Authenticated checkout creates idempotent server-side orders.
- [x] **Live catalog and order tracking** — Home catalog, offer discovery, and order tracking query the backend with user-facing fallback states.
- [x] **Resilient AI catalog search** — Search recognizes common symptom classes plus brand and salt names, and remains usable through catalog matching if Gemini is unavailable.
- [x] **Dosage safety guidance** — The medicine detail flow collects validated optional context and returns education-only clinician/pharmacist questions, never dosing instructions.
- [ ] **Pharmacy reviews system** — User-generated ratings and reviews.
- [ ] **Push notifications** — Order status updates.
- [ ] **PWA support** — Offline access and installability.

### 🔲 Low Priority

- [ ] **Multi-language support** — Hindi, Marathi, Tamil, etc.
- [ ] **Dark mode** — Theme toggle.
- [ ] **Price alerts** — Notify users when medicine prices drop.
- [ ] **Bulk ordering** — For clinics and hospitals.
- [ ] **Insurance integration** — Connect with health insurance providers.

---

## API Endpoints

> **Status:** No backend API exists yet. Below is the planned API structure.

### Planned REST API

| Method | Endpoint                          | Description                        | Status    |
|--------|-----------------------------------|------------------------------------|-----------|
| GET    | `/api/medicines`                  | List all medicines                 | 🔲 Planned |
| GET    | `/api/medicines/:id`              | Get medicine by ID                 | 🔲 Planned |
| GET    | `/api/medicines/search?q=`        | Search medicines by name/salt      | 🔲 Planned |
| GET    | `/api/medicines/:id/offers`       | Get pharmacy offers for a medicine | 🔲 Planned |
| POST   | `/api/cart`                       | Add item to cart                   | 🔲 Planned |
| GET    | `/api/cart`                       | Get cart contents                  | 🔲 Planned |
| PUT    | `/api/cart/:itemId`               | Update cart item quantity          | 🔲 Planned |
| DELETE | `/api/cart/:itemId`               | Remove item from cart              | 🔲 Planned |
| POST   | `/api/orders`                     | Place an order                     | 🔲 Planned |
| GET    | `/api/orders/:id`                 | Get order details                  | 🔲 Planned |
| GET    | `/api/orders/:id/tracking`        | Get order tracking status          | 🔲 Planned |
| POST   | `/api/auth/login`                 | User login                         | 🔲 Planned |
| POST   | `/api/auth/register`              | User registration                  | 🔲 Planned |
| GET    | `/api/user/profile`               | Get current user profile           | 🔲 Planned |
| POST   | `/api/ai/search`                  | AI-powered medicine search         | 🔲 Planned |
| POST   | `/api/ai/interactions`            | Drug interaction check             | 🔲 Planned |

### Gemini AI Integration

| Feature                  | Gemini Model   | Status     |
|--------------------------|----------------|------------|
| Smart medicine search    | Gemini Pro     | 🔲 Planned  |
| Drug interaction checker | Gemini Pro     | 🔲 Planned  |
| Dosage recommendations   | Gemini Pro     | 🔲 Planned  |
| Prescription OCR parsing | Gemini Vision  | 🔲 Planned  |

---

## Database Schema Summary

> **Status:** No database exists yet. Below is the planned schema design.

### Planned Tables / Collections

```
┌─────────────────────┐     ┌─────────────────────┐
│     medicines       │     │   pharmacy_offers    │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │────▶│ id (PK)             │
│ name                │     │ medicine_id (FK)     │
│ salt_name           │     │ pharmacy_id (FK)     │
│ therapeutic_class   │     │ price                │
│ prescription_req    │     │ branded_price        │
│ batch_inspection    │     │ discount_percent     │
│ strengths (JSON)    │     │ delivery_time        │
│ forms (JSON)        │     │ stock_status         │
│ pack_sizes (JSON)   │     │ verified_partner     │
│ brand_equivalents   │     │ nabl_certified       │
│ created_at          │     │ updated_at           │
└─────────────────────┘     └─────────────────────┘

┌─────────────────────┐     ┌─────────────────────┐
│       users         │     │       orders         │
├─────────────────────┤     ├─────────────────────┤
│ id (PK)             │────▶│ id (PK)             │
│ full_name           │     │ user_id (FK)         │
│ email (unique)      │     │ pharmacy_id (FK)     │
│ phone               │     │ items (JSON)         │
│ role (enum)         │     │ subtotal             │
│ abha_id             │     │ delivery_fee         │
│ pincode             │     │ total_amount         │
│ is_verified         │     │ status (enum)        │
│ password_hash       │     │ delivery_address     │
│ created_at          │     │ payment_method       │
└─────────────────────┘     │ idempotency_key      │
                            │ created_at           │
┌─────────────────────┐     └─────────────────────┘
│    pharmacies       │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ type (enum)         │
│ rating              │
│ review_count        │
│ drug_license_number │
│ nabl_certified      │
│ location_lat        │
│ location_lng        │
│ created_at          │
└─────────────────────┘
```

### Enums

- **User Roles:** `patient`, `doctor`, `pharmacist`
- **Pharmacy Types:** `retail`, `govt`, `chain`, `online`
- **Stock Status:** `in_stock`, `low_stock`, `out_of_stock`
- **Order Status:** `placed`, `pharmacy_accepted`, `packed`, `out_for_delivery`, `delivered`, `cancelled`

---

## Important Business Logic

### 💊 Price Calculation

```
Savings % = ((brandedPrice - genericPrice) / brandedPrice) × 100
Price per unit = packPrice / packSize.count
Total savings = Σ (brandedPrice - genericPrice) × quantity for each cart item
```

- Prices are in **INR (₹)**.
- The **"Best Value"** badge is assigned to the pack size with the lowest price per unit.
- Delivery fee is pharmacy-specific; some offers include **free delivery** (`isFreeDelivery`).

### 🧪 Bioequivalence Verification

- Each medicine displays **dissolution rate** (generic vs. branded) to show therapeutic equivalence.
- **Bioavailability match** percentage shows how closely the generic matches the branded drug's absorption.
- Batch inspection data includes: assay test, disintegration time, impurity index, manufacture/expiry dates.
- **NABL certification** is the trust badge for lab-verified quality.

### 🔐 Authentication & Roles

| Role        | Capabilities                                                  |
|-------------|---------------------------------------------------------------|
| `patient`   | Browse medicines, compare prices, place orders, track orders  |
| `doctor`    | All patient capabilities + prescription features              |
| `pharmacist`| Partner portal access, manage offers, view order fulfillment  |

- **ABHA ID** (Ayushman Bharat Health Account) integration is planned for identity verification.
- Currently using mock authentication with a hardcoded user profile.

### 🛒 Cart & Order Logic

- Cart supports **single item** currently (one medicine + pharmacy offer at a time).
- Order placement generates a unique `idempotencyKey` to prevent duplicate orders.
- Order status follows a linear progression: `placed` → `pharmacy_accepted` → `packed` → `out_for_delivery` → `delivered`.
- Orders can be `cancelled` at any stage before `out_for_delivery`.

### 📦 Canonical Variant Matrix

The "canonical variant matrix" is the core product concept:
- Each medicine has multiple **strengths** (e.g., 500mg, 650mg, 1000mg ER).
- Each medicine has multiple **dosage forms** (e.g., Tablet, Syrup, Suppository).
- Each combination has multiple **pack sizes** (e.g., Strip of 10, Strip of 15, Box of 100).
- Each variant can be compared across multiple **pharmacy offers**.

This creates a multi-dimensional selection matrix: **Medicine → Strength → Form → Pack Size → Pharmacy Offer**.

---

## Known Issues

| ID     | Severity | Description                                                    | Status   |
|--------|----------|----------------------------------------------------------------|----------|
| BUG-001| Medium   | Browser back button does not work (no URL-based routing)       | Known    |
| BUG-002| Low      | Cart supports only single item; adding new item replaces old   | Known    |
| BUG-003| Low      | No form validation on checkout delivery address                | Known    |
| BUG-004| Info     | Mock user is hardcoded; login/register screens are non-functional| Known  |
| BUG-005| Info     | `package.json` name is `react-example` instead of `genericmed-help` | Known |

---

## Future Roadmap

### Phase 1 — Backend Foundation (Next)

- [ ] Set up Express.js server with proper routing.
- [ ] Integrate PostgreSQL database with the planned schema.
- [ ] Implement real authentication (JWT + bcrypt).
- [ ] Create REST API endpoints for medicines, offers, cart, and orders.
- [ ] Connect frontend to real API (replace mock data imports with `fetch`).

### Phase 2 — AI Features

- [ ] Integrate Gemini AI for smart medicine search.
- [ ] Build drug interaction checker.
- [ ] Add AI-powered dosage recommendation assistant.
- [ ] Implement prescription OCR with Gemini Vision.

### Phase 3 — Production Readiness

- [ ] Add comprehensive error handling and loading states.
- [ ] Implement React Router for URL-based navigation.
- [ ] Add unit tests (Vitest) and integration tests.
- [ ] Set up CI/CD pipeline.
- [ ] Performance optimization (code splitting, lazy loading).
- [ ] PWA support.

### Phase 4 — Scale & Localization

- [ ] Multi-language support (Hindi, Marathi, Tamil, Telugu).
- [ ] Dark mode theme.
- [ ] Real pharmacy partner onboarding.
- [ ] Insurance integration.
- [ ] Mobile app (React Native).

---

> **Last Updated:** 2026-09-09
