# Project Context: Bookstore Frontend

This project is a modern bookstore web application built with Next.js 15, focused on a modular architecture and robust state management.

## Important Note for AI Agents

- **DO NOT** Create new components before check /src/components/\*\*
- **DO NOT** edit ../backend/\*\* this is READ-ONLY for reference.
- **ALWAYS** use the actual project files in `src/` as the source of truth for the project structure and implementation details.
- **ALWAYS**: Use lucide icons and shadcn components. (if not installed use npx shadcn@latest add <component-name>)
- **ALWAYS**: Implement SSR in /src/app
- **ALWAYS**: Use /src/modules for client components for example:
  - /src/modules/example/components/
  - /src/modules/example/hooks/
  - /src/modules/example/schemas/
  - /src/modules/example/store/
- **ALWAYS**: Use query-keys.ts for SST query keys for tanstack query;
- **ALWAYS**: Check ../backend/src/modules/**/dto/** for create schemas for frontend;
- **ALWAYS**: Check ../backend/src/modules/**/\*.repository.ts/** for create schemas response for frontend;
- **ALWAYS**: user zod parse on return response.data on tanstack query hooks.
- **ALWAYS**: use @ai-files for design reference.
- **ALWAYS**: use ../backend/src/modules/**/\*.spec.ts/** for know how API works.
- **ALWAYS**: use FrontEnd skills and MCPs for help.
- **ALWAYS**: use fetch on SSR first and push to tanstack query with initial data.
- **ALWAYS**: use "use client" for client components.
- **ALWAYS**: use useRouter or Link from next/navigation for navigation.

## Project Overview

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4, Shadcn UI (Radix UI + Lucide Icons)
- **Data Fetching:** TanStack Query (React Query) with Axios
- **State Management:** Zustand (Client-side state, specifically for the Shopping Cart)
- **Form Handling:** React Hook Form with Zod validation
- **Authentication:** Session-based (Cookies) with a centralized `useUser` hook.

## Architecture and Directory Structure

The project follows a modular, feature-based structure located in `src/modules`.

- `src/app/`: Next.js App Router routes and layouts.
- `src/components/`:
  - `ui/`: Base UI components (mostly Shadcn UI).
  - Shared components like `header.tsx` and `footer.tsx`.
- `src/modules/`: Feature-specific logic. Each module (e.g., `book`, `cart`, `admin`) typically contains:
  - `components/`: UI components specific to the feature.
  - `hooks/`: React Query hooks for data operations.
  - `schemas/`: Zod schemas for type safety and validation.
  - `store/`: Zustand stores if needed (e.g., `cart`).
- `src/lib/`: Shared utility libraries (e.g., Axios instance in `axios.ts`).
- `src/hooks/`: Global React hooks (e.g., `use-user.ts`).
- `src/providers/`: React Context providers (Query, Theme).
- `ai-files/`: Contains design mockups and reference HTML/CSS for implementation.

## Building and Running

### Development

```bash
npm run dev
```

Starts the development server with Turbopack.

### Production

```bash
npm run build
npm run start
```

Builds the application for production and starts the server.

### Linting

```bash
npm run lint
```

Runs ESLint for code quality checks.

## Development Conventions

- **Modular Design:** Always group feature-specific logic within `src/modules`. Avoid cluttering `src/components` with domain-specific components.
- **Type Safety:** Use Zod schemas in `src/modules/[module]/schemas` to define domain entities and validate API responses.
- **Data Fetching:** Prefer TanStack Query hooks for all server state. Use the `api` instance from `@/lib/axios`.
- **UI Components:** Use and extend existing Shadcn UI components in `src/components/ui`.
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL`: The base URL for the backend API (accessible on client and server).
  - `API_URL`: The internal URL for the backend API (server-side only, used for SSR/ISR).

## Backend Integration

The frontend communicates with a REST API. Authentication is handled via cookies (`withCredentials: true`). The `useUser` hook provides the current user's state and logout functionality.
