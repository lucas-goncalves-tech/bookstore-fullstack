# Gemini Context: Bookstore API (Express + TypeScript)

## Project Overview
This project is a RESTful API for a bookstore application, built with **Express 5** and **TypeScript**. It follows a modular architecture, uses **Prisma** for database interactions with **PostgreSQL**, and leverages **Tsyringe** for dependency injection.

## Tech Stack
*   **Runtime:** Node.js
*   **Framework:** Express 5.x
*   **Language:** TypeScript 5.x
*   **Database:** PostgreSQL 15 (via Docker)
*   **ORM:** Prisma
*   **Dependency Injection:** Tsyringe
*   **Validation:** Zod
*   **Testing:** Vitest
*   **Documentation:** Scalar (OpenAPI)
*   **Containerization:** Docker & Docker Compose

## Architecture & Conventions

### Directory Structure
The application code is located in `src/` and follows a modular structure:
*   `src/modules/`: Contains business logic grouped by domain (e.g., `auth`, `books`, `categories`).
    *   Each module typically contains: `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.routes.ts`, `dtos/`, and `specs/`.
*   `src/core/`: Core application setup (Server, App class, Global Routes, Config).
*   `src/shared/`: Shared utilities, middlewares, errors, and base classes.
*   `src/database/`: Database configuration and seeds.
*   `prisma/`: Database schema and migrations.

### Dependency Injection
The project uses `tsyringe` for DI.
*   Classes are decorated with `@singleton()` or `@injectable()`.
*   Dependencies are injected via constructor using `@inject(Token)`.

### Request Validation & Typing
*   **Zod** is likely used for validation (inferred from `safeBody`, `safeParams`).
*   Controllers access validated data via strictly typed properties on the request object:
    *   `req.safeBody`
    *   `req.safeParams`
    *   `req.safeQuery`

### Error Handling
*   Centralized error handling middleware is used (`src/shared/middlewares/error-handler.middleware.ts`).
*   Custom error classes exist in `src/shared/errors/` (e.g., `BadRequestError`, `NotFoundError`).

### Database
*   **Prisma** is the source of truth for the database schema (`prisma/schema.prisma`).
*   Migrations are managed via Prisma Migrate.

## Development Setup

### Prerequisites
*   Node.js (v20+ recommended)
*   Docker & Docker Compose

### Environment Variables
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```
Key variables include database credentials (`DB_USER`, `DB_PASS`), JWT settings, and Cloudinary keys.

### Running the Project
1.  **Start Infrastructure (DB):**
    ```bash
    docker compose up -d db
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Migrations:**
    ```bash
    npm run db:migrate # runs via docker compose exec
    # OR if running locally without docker wrapper for api:
    npx prisma migrate dev
    ```
4.  **Start Development Server:**
    ```bash
    npm run dev
    ```

## Key Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with watch mode (`tsx`). |
| `npm run build` | Compiles TypeScript to JavaScript. |
| `npm start` | Runs the compiled production server. |
| `npm test` | Runs tests using **Vitest** (inside Docker container `api`). |
| `npm run db:migrate` | Applies database migrations (inside Docker). |
| `npm run db:generate` | Generates Prisma client (inside Docker). |
| `npm run db:seed` | Seeds the database (inside Docker). |

## Testing
*   Tests are located in `src/modules/*/specs/` or `src/tests/`.
*   Run tests with `npm test`.

## API Documentation
*   OpenAPI spec is generated automatically.
*   Interactive documentation is likely available at `/api-docs` (via Scalar) when the server is running.
