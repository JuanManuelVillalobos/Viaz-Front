# UserFlux Tracker

UserFlux Tracker is a logistics and shipment operations dashboard built with React, TypeScript, and Vite. It helps teams monitor shipment activity, track open and closed loads, review carrier performance, manage incidents and charges, and keep operational data organized in a single interface.

## Overview

This project is designed for freight and logistics workflows, with a focus on:

- dashboard visibility for shipment volume and operational KPIs
- shipment search, filtering, and status management
- carrier and client tracking
- open-vs-closed shipment monitoring
- incident and charge tracking
- completion/progress indicators for each shipment record
- authenticated access for different user roles

## Features

- Shipment dashboard with summary cards and analytics
- Shipment list with search, filtering, and column customization
- Shipment status updates directly from the table
- Detailed shipment views and record tracking
- Carrier rating charting and operational metrics
- Incident and charge monitoring
- Role-based access restrictions and authentication flow
- Responsive UI built with Tailwind CSS and shadcn/ui components

## Tech Stack

- TypeScript
- React 18
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui
- Recharts
- Lucide React

## Project Structure

```text
.
├── src/
│   ├── components/       # Reusable UI and business components
│   ├── contexts/         # Auth and shared application state
│   ├── hooks/            # Custom hooks
│   ├── layouts/          # Shell layouts and navigation wrappers
│   ├── pages/            # Application pages
│   ├── services/         # API and service layer
│   ├── types/            # TypeScript models and DTOs
│   ├── App.tsx           # App routing and auth guards
│   └── main.tsx          # Application entry point
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── README.md
└── index.html
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

The application will be available in the browser through the Vite dev server.

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Scripts

```json
{
  "dev": "vite",
  "build": "vite build",
  "build:dev": "vite build --mode development",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## Notes

This repository appears to be the frontend application for a shipment-tracking and operations workflow. It integrates with backend services for shipment data, authentication, and operational analytics, so a matching API or environment configuration is expected depending on your deployment setup.

## License

This project does not currently declare a license in the repository.
