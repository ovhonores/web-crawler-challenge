# Web Crawler — Frontend

Minimal Next.js frontend to interact with the HN Crawler API.

## Why

The challenge asks for a crawler with filters and usage logging. This frontend
demonstrates how a real consumer would use the API: apply filters, see results,
inspect usage history.

## Features

- **Quick filters**: one-click access to the two filters from the challenge
- **Custom filter form**: words, operator, sortBy, order
- **Entry table**: number, title, points, comments
- **Usage table**: timestamp, filter, entries returned, execution time
- **Loading and error states**
- **Responsive layout** with Tailwind

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
Open http://localhost:3001.

Environment variables
Variable	Default	Description
NEXT_PUBLIC_API_URL	http://localhost:3000	Backend API URL
Structure
text
src/
├── app/                # Next.js App Router
├── components/         # UI components
├── lib/                # API client
└── types/              # Shared TypeScript types
