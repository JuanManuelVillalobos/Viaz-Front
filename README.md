# Viaz — Logistics Operations Frontend

![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=flat-square)

> **Portfolio Project:** Production-ready web client for the Viaz Logistics Management Platform. Built with React 18, TypeScript, and Vite to replace a 5-person team's Excel-based workflow with an interactive, real-time dashboard for shipment lifecycle tracking, incident reporting, and permission-gated user management.

---

## Overview

The application provides a responsive UI engineered across three primary permission-gated views:

- **1. Dashboard View:** Multi-field loose search, status/client/carrier filtering, inline shipment edits, and multi-leg cross-border duplication (`A`, `B`, `C`...) to track international freight legs (e.g., US + MX legs).
- **2. Statistics View:** Operational KPIs, open/closed shipment balances, and interactive monthly carrier/client rating visual charts.
- **3. User Management View:** Dynamic RBAC administration for custom role creation, multi-role assignment, and cosmetic UI access controls.

---

## Key Technical Highlights

* **Incident & Report Visual System:** Custom color-coded shipment table row formatting (**Yellow** = Report, **Red** = Incident, **Purple** = Both) with backend-synchronized permission locking that freezes edits on closed shipments unless explicitly reopened.
* **Dual-Token Client Auth Architecture:** Configured for dual JWT token handling—storing 15-minute access tokens in `localStorage` with automated retry/refresh handling via httpOnly cookies and 15-minute expiry token password reset flows.
* **Server State & UI Performance:** Utilizes **TanStack Query (React Query)** for API caching, background refetching, and optimistic status updates.
* **Component Architecture:** Built with **Tailwind CSS** and modular **shadcn/ui** components, combined with **Recharts** for logistics performance analytics.

---

## Tech Stack

* **Core Framework:** React 18, TypeScript, Vite
* **State & Data Fetching:** React Router v6, TanStack Query (React Query)
* **Styling & UI Components:** Tailwind CSS, shadcn/ui, Lucide React Icons
* **Data Visualization:** Recharts
* **Build Tooling:** Vite, ESLint, npm

---

## Project Structure

```text
.
├── src/
│   ├── components/       # Reusable UI and business domain components
│   │   ├── dashboard/    # Shipment tables, filters, and color-coded rows
│   │   ├── stats/        # Recharts analytics and KPI widgets
│   │   ├── user/         # Role & permission assignment components
│   │   └── ui/           # Primitive shadcn/ui design components
│   ├── contexts/         # Auth, session storage, and dynamic permission state
│   ├── hooks/            # Custom hooks (e.g., usePermissions, useShipments)
│   ├── layouts/          # Navigation sidebars, shell layouts, and route guards
│   ├── pages/            # Dashboard, Statistics, User Management, and Auth pages
│   ├── services/         # Axios / Fetch API service integration layer
│   ├── types/            # TypeScript models & REST DTO interfaces
│   ├── App.tsx           # Application routing & permission guards
│   └── main.tsx          # Application entry point
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## Environment Configuration

Create a `.env` file in the root directory:

```bash
# Backend REST API URL
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Local Setup

### Prerequisites
* Node.js 18+
* npm 9+

### Installation

1. **Clone repository:**
   ```bash
   git clone [https://github.com/JuanManuelVillalobos/viaz-frontend.git](https://github.com/JuanManuelVillalobos/viaz-frontend.git)
   cd viaz-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local development server:**
   ```bash
   npm run dev
   ```
   The web application will be served at `http://localhost:5173`.

### Available Scripts

* `npm run dev` — Launch Vite dev server
* `npm run build` — Compile production build
* `npm run preview` — Locally preview production build
* `npm run lint` — Run ESLint code quality checks

---

## License

Copyright © 2025–2026 Juan Manuel Villalobos. All Rights Reserved.

This repository is published strictly for portfolio display and code review. Unlawful copying, distribution, modification, or commercial deployment of this software is strictly prohibited.
