# Viaz — Logistics Operations Frontend

![React 18](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-brightgreen?style=flat-square)

> **Portfolio Project:** Production-ready Web Client for the Viaz Logistics Management Platform. Built with React 18, TypeScript, and Vite to digitize manual Excel workflows into an interactive, real-time dashboard for shipment lifecycle tracking, carrier analytics, and role-gated UI workflows.

---

## Overview

The application provides a high-performance web interface designed for freight operators and logistics managers:

- **Shipment Control Center:** Multi-field loose search, status filtering, column customization, and inline shipment edits.
- **Multi-Leg Cross-Border Tracking:** Variant duplication workflows (`A`, `B`, `C`...) for international routes (e.g., US & MX freight legs).
- **Incident & Charge Management:** Color-coded tracking (reports vs. incidents) with automated UI state locking upon shipment closure.
- **Operational Analytics:** Interactive Recharts visual analytics covering carrier performance ratings, client statistics, and open/closed load ratios.
- **Granular Access Controls:** Dynamic, permission-aware UI routing and component rendering based on authenticated JWT user roles.

---

## Key Technical Highlights

* **Server State Management:** Integrated **TanStack Query (React Query)** for efficient API caching, background refetching, and optimistic UI updates for shipment status toggles.
* **Granular UI Permission Gating:** Custom Auth Context and dynamic permission hooks that strip or disable actions (e.g., dropdowns, shipment closure actions, admin settings) based on backend RBAC tokens.
* **Component System & Styling:** Engineered with **Tailwind CSS** and modular **shadcn/ui** primitives for responsive, accessible UI layouts across desktop and mobile browsers.
* **Type Safety & Data Integrity:** Strict TypeScript DTO and model definitions matching the Spring Boot REST API domain objects to ensure end-to-end data safety.

---

## Tech Stack

* **Core Framework:** React 18, TypeScript, Vite
* **Routing & State:** React Router v6, TanStack Query (React Query)
* **Styling & UI:** Tailwind CSS, shadcn/ui, Lucide Icons
* **Data Visualization:** Recharts
* **Build & Tooling:** Vite, ESLint, npm

---

## Project Structure

```text
.
├── src/
│   ├── components/       # Reusable UI & business domain components
│   │   ├── ui/           # Primitive shadcn/ui components
│   │   ├── dashboard/    # Analytics widgets & Recharts views
│   │   └── shipments/    # Tables, filter bars, and modal forms
│   ├── contexts/         # Auth, session, and global app state
│   ├── hooks/            # Custom React hooks (permissions, queries)
│   ├── layouts/          # Navigation sidebars, shell wrappers
│   ├── pages/            # Application view pages
│   ├── services/         # Axios / Fetch API integrations
│   ├── types/            # TypeScript models & API DTO contracts
│   ├── App.tsx           # Route declarations & auth guards
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
# Backend REST API endpoint
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
   The application will be served at `http://localhost:5173`.

### Scripts

* `npm run dev` — Launch Vite dev server
* `npm run build` — Compile production build
* `npm run preview` — Locally preview production build
* `npm run lint` — Run ESLint code quality checks

---

## License

This project is licensed under the [MIT License](LICENSE).
