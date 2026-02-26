# Project Context: Bookstore Frontend

This project is a modern bookstore web application built with Next.js 15, focused on a modular architecture, robust state management, and enterprise-grade performance.

## Important Directives for AI Agents

- **DO NOT** Create new components before checking `/src/components/**`
- **DO NOT** edit `../backend/**` unless explicitly requested; it is READ-ONLY for reference.
- **ALWAYS** use the actual project files in `src/` as the source of truth for the project structure.
- **ALWAYS** use `lucide-react` icons and `shadcn/ui` components. (if not installed use `npx shadcn@latest add <component-name>`)
- **ALWAYS** Implement Server-Side Rendering (SSR) in `/src/app`.
- **ALWAYS** Use `/src/modules` for feature-specific client components. Example:
  - `/src/modules/[module]/components/`
  - `/src/modules/[module]/hooks/`
  - `/src/modules/[module]/schemas/`
  - `/src/modules/[module]/store/`
- **ALWAYS** Use `query-keys.ts` for TanStack query keys.
- **ALWAYS** Use Zod to parse returning API response payloads on TanStack query hooks.
- **ALWAYS** Use `fetch` (via `serverGet`) on SSR first and pass `initialData` into TanStack Query for fast initial loads (Hydration).
- **ALWAYS** Keep React Server Components (RSC) as default. Only attach `"use client"` when necessary (e.g., using `useState`, `useEffect`, or `onClick`).

## Frontend Architecture & Best Practices

The frontend is driven by the following architectural skills and principles. Future agents must respect these paradigms:

### 1. Next.js & React Best Practices (`@nextjs-best-practices` / `@react-best-practices`)

- **Hydration Fidelity**: Timezones mismatch between Server (UTC) and Client (Local) can crash React Hydration. Add `suppressHydrationWarning` to date-sensitive elements (e.g., `isToday(new Date())`).
- **Waterfalls & Image Optimization**: Avoid `style={{ backgroundImage }}` for remote assets. Always use the Next.js native `<Image />` component with properly defined `sizes` attributes (`sizes="(max-width: 1024px) 0vw, 50vw"`, `sizes="40px"`) to prevent payload bloat.
- **Smart Data Prefetching**: Route segments (e.g., `app/admin/books/page.tsx`) must fetch data via `await serverGet('/api')` and pass it down as `initialData` to Client Components tracking state via `react-query`.

### 2. Frontend Design & UX Tokens (`@frontend-design` / `@tailwind-patterns`)

- **Responsive Piling**: Use fluid flex/grid constraints (e.g., `flex-1 w-full min-w-0` on wrappers, `max-w-[200px] truncate` on texts) to prevent element overflow or X-axis scrolling on smaller viewports.
- **Accessibility**: Avoid nesting interactive logic (`e.stopPropagation()`) inside `<Link>` tags. Wrap `<Button>` actions safely outside navigation links. Avoid raw HTML `<select>` in favor of accessible Radix/Shadcn UI `<Select>` dropdowns.
- **Cognitive Clarity**: Prefer hidden actions behind `<DropdownMenu>` (Meatball menus) over cluttered inline table buttons. Map status states to semantic `<Badge>` components (Active/Inactive, Disponível/Arquivado).

### 3. Senior Fullstack Security Paradigms (`@senior-fullstack`)

- **Backend-First Security**: Never trust Client-Side `useEffect` guards for Role-Based Access Control (RBAC). Always validate authorization inside the top-level Next.js layout (`app/admin/layout.tsx`) as a Server Component, intercepting unauthorized renders natively at the edge before JSON payloads are dispatched.

### 4. Code Quality & Integration Assurances (`@lint-and-validate`)

- **MANDATORY VERIFICATION**: After significant edits or component logic changes, you **MUST** ensure the frontend compiles gracefully.
- Run the following terminal verification chain without exceptions:
  `npm run lint && npm run build && npx tsc --noEmit`
- Only consider a task stabilized if the Next.js `build` phase exits with status Code 0 (meaning zero TypeScript and CSS collision errors).

## Tech Stack Overview

- **Framework:** Next.js 15 (App Router - Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Shadcn UI (Radix UI + Lucide Icons)
- **Data Fetching:** TanStack Query (React Query) + Custom `serverGet` for SSR
- **State Management:** Zustand (Client-side localized states like Cart)
- **Form Handling:** React Hook Form + Zod mapping exactly backend DTO signatures
- **Authentication:** HttpOnly Session Cookies. Current session state retrieved via `useUser` hook.

## Building and Verification Commands

### Development

```bash
npm run dev
```

### CI / Quality Gates (Agent Verification Routine)

```bash
npm run lint && npm run build && npx tsc --noEmit
```

## Backend Integration Details

- Authentication is handled via cookies (`withCredentials: true`).
- **Protected Routes (Middleware)**:
  - `/orders` - Order history and details
  - `/checkout` - Checkout flow
  - `/admin` - Admin panel
  - `/my-reviews` - User reviews page
- Reference `../backend/src/modules/**/{*.spec.ts, *.routes.ts}` to observe the API contracts when bridging new Frontend services.
