# Admin Panel Specifications

## Overview

The Admin Panel provides management capabilities for the Bookstore application. It is restricted to users with the `ADMIN` role.

### Tech Stack & Standards (Strict Adherence)

- **Framework:** Next.js 15.5.10 (App Router)
- **Library:** React 19.1.0
- **UI Component:** Shadcn UI (Style: `new-york`, Base: `stone`)
- **Styling:** Tailwind CSS 4
  - **Font:** `Libre Baskerville` (configured as `font-sans` in `globals.css`)
  - **Radius:** `0.25rem` (Rounded-sm)
  - **Theme:** Warm/Paper aesthetic (Light: `hsl(44 42% 93%)`, Primary: `hsl(30 33% 48%)`)
- **State Management:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Architecture:** Feature-based Modularization (`src/modules/*`)

---

## Layout Structure

### 1. Global Layout (`/admin/layout.tsx`)

A persistent layout wrapper using `SidebarProvider` (if available in Shadcn) or custom responsive layout.

- **Theme Compliance:**
  - **Background:** Use `bg-sidebar` for the sidebar container.
  - **Foreground:** Use `text-sidebar-foreground`.
  - **Accent:** Use `bg-sidebar-accent` for active states.
  - **Border:** Use `border-sidebar-border`.
- **Sidebar (Navigation):**
  - **Mobile:** Collapsible Drawer (Sheet).
  - **Desktop:** Fixed Sidebar.
  - **Menu Items:**
    - `Dashboard` (Home) - `/admin`
    - `Livros` (Book) - `/admin/books`
    - `Categorias` (Tags) - `/admin/categories`
    - `Usuários` (Users) - `/admin/users`
    - `Pedidos` (ShoppingBag) - `/admin/orders` (Future)

- **Header:**
  - Must align with `src/components/header.tsx` aesthetics but tailored for Admin context.
  - Breadcrumbs.

---

## Features & Modules

### 1. Dashboard (`src/modules/admin/dashboard/`)

- **Route:** `/admin/page.tsx`
- **Components:** `DashboardMetrics`, `RecentActivity`.
- **Data:**
  - `useDashboardStats()` hook.

### 2. Books Management (`src/modules/admin/books/`)

- **Route:** `/admin/books/`
- **CRUD Operations:**
  - **List:** `useAdminBooks()` - Table with `coverUrl` (Avatar/Image), `title`, `stock` (Badge), `price`.
  - **Create/Edit:** `BookForm` using `zod` schema from `@/modules/home/schemas/book.schema.ts` (or extended admin version).
  - **Image Upload:** Must use the existing Cloudinary upload pattern.

### 3. Categories Management (`src/modules/admin/categories/`)

- **Route:** `/admin/categories/`
- **CRUD Operations:**
  - **List:** `useAdminCategories()` - Table with `name`, `slug`, `relatedBooks`.
  - **Create/Edit:** `CategoryForm` (Name, Slug, Description).

### 4. Users Management (`src/modules/admin/users/`)

- **Route:** `/admin/users/`
- **CRUD Operations:**
  - **List:** `useAdminUsers()` - Table with `name`, `email`, `role`.
  - **Actions:** Promote/Demote Role (Admin/User).

---

## Detailed Data Models (Prisma aligned)

### Book Form

- **Fields:**
  - `title` (String)
  - `author` (String)
  - `description` (String, Max 255)
  - `price` (Decimal -> specific handling for currency input)
  - `stock` (Int)
  - `categoryId` (Relation)
  - `coverUrl` (String, URL)
- **Validation:** Use `zod` validators from `src/validators/zod.validators.ts` where applicable.

### UI Guidelines

- **Typography:** Headlines in `Libre Baskerville`.
- **Cards:** Usage of `Card`, `CardHeader`, `CardContent` with `bg-card` and `shadow-sm`.
- **Tables:** `Table`, `TableHeader`, `TableRow`, `TableCell` (Shadcn).
- **Buttons:** `Button` (Primary for main actions, Outline for cancels).
- **Toasts:** `sonner` for all success/error feedback (in Portuguese).

## Implementation Steps

1.  **Scaffold**: Create `src/modules/admin` folder structure.
2.  **Layout**: Implement `AdminLayout` with Sidebar themes.
3.  **Components**: Build shared admin components (DataTable, PageHeader).
4.  **Pages**: Implement features sequentially (Dashboard -> Categories -> Books -> Users).
