# Gemini Context: Bookstore API (Express + TypeScript)

## Project Overview

This project is a comprehensive RESTful API for a bookstore application, built with **Express 5** and **TypeScript**. It follows a modular architecture, uses **Prisma** for database interactions with **PostgreSQL**, and leverages **Tsyringe** for dependency injection.

## Tech Stack

| Component                | Technology                  |
| ------------------------ | --------------------------- |
| **Runtime**              | Node.js 20+                 |
| **Framework**            | Express 5.x                 |
| **Language**             | TypeScript 5.x              |
| **Database**             | PostgreSQL 15 (via Docker)  |
| **ORM**                  | Prisma                      |
| **Dependency Injection** | Tsyringe                    |
| **Validation**           | Zod                         |
| **Testing**              | Vitest                      |
| **Documentation**        | Scalar (OpenAPI)            |
| **Containerization**     | Docker & Docker Compose     |
| **Authentication**       | JWT with bcrypt             |
| **Image Upload**         | Cloudinary                  |
| **Security**             | Helmet, CORS, Rate Limiting |

## Architecture & Conventions

### Directory Structure

```
src/
├── core/                    # Core application setup
│   ├── config/              # Environment & DI configuration
│   ├── routes.ts            # Global routes aggregator
│   └── server.ts            # Server bootstrap
│
├── modules/                 # Business logic by domain
│   ├── auth/                # Authentication module
│   ├── books/               # Book management module
│   ├── categories/          # Category management module
│   └── users/               # User management module
│   Each module contains:
│   ├── *.controller.ts      # HTTP handlers
│   ├── *.service.ts         # Business logic
│   ├── *.repository.ts      # Database access
│   ├── *.routes.ts          # Route definitions
│   ├── dtos/                # Validation schemas (Zod)
│   ├── interfaces/          # TypeScript contracts
│   └── specs/               # Test files
│
├── shared/                  # Shared components
│   ├── constants/           # App constants
│   ├── errors/              # Custom error classes
│   ├── middlewares/         # Express middlewares
│   ├── utils/               # Utility functions
│   └── validators/          # Input validators
│
├── database/                # Database configuration
│   ├── prisma.ts            # Prisma client instance
│   └── seed.ts              # Database seeder
│
├── docs/                    # API documentation
│   ├── openapi.generator.ts # OpenAPI spec generator
│   └── openapi.registry.ts  # Registry configuration
│
├── services/                # Cross-cutting services
│   ├── cloudinary-upload.service.ts
│   └── token.service.ts
│
├── tests/                   # Test infrastructure
│   ├── factories/           # Test data factories
│   ├── helpers/             # Test utilities
│   ├── setup.ts             # Test environment setup
│   └── global-setup.ts      # Global test configuration
│
└── types/                   # Type extensions
    └── express.d.ts         # Express type augmentations

prisma/
├── schema.prisma            # Database schema definition
└── migrations/              # Database migrations
```

### Dependency Injection Pattern

The project uses `tsyringe` for dependency injection throughout:

- Classes decorated with `@singleton()` for single instances
- Classes decorated with `@injectable()` for injection support
- Dependencies injected via constructor using `@inject(Token)`

````

### Request Validation & Typing
**Zod** is used for request validation with custom middleware:
- `req.safeBody` - Validated request body
- `req.safeParams` - Validated URL parameters
- `req.safeQuery` - Validated query parameters

### Error Handling
Centralized error handling via `src/shared/middlewares/error-handler.middleware.ts`:

| Error Class | HTTP Status | Usage |
|-------------|-------------|-------|
| `BadRequestError` | 400 | Invalid input data |
| `UnauthorizedError` | 401 | Authentication required |
| `ForbiddenError` | 403 | Insufficient permissions |
| `NotFoundError` | 404 | Resource not found |
| `ConflictError` | 409 | Resource conflict |

## Database Schema (Prisma)

### Enums
```prisma
enum Role {
  USER
  ADMIN
}
````

### Models

#### User

| Field          | Type   | Constraints           |
| -------------- | ------ | --------------------- |
| `id`           | String | @id @default(uuid())  |
| `email`        | String | @unique               |
| `name`         | String |                       |
| `passwordHash` | String | @map("password_hash") |
| `role`         | Role   | @default(USER)        |

**Table:** `users`

#### Category

| Field         | Type   | Constraints          |
| ------------- | ------ | -------------------- |
| `id`          | String | @id @default(uuid()) |
| `name`        | String | @unique              |
| `slug`        | String | @unique              |
| `description` | String | @db.VarChar(100)     |

**Relations:** Has many Books
**Indexes:** `@@index([slug])`
**Table:** `categories`

#### Book

| Field           | Type      | Constraints                        |
| --------------- | --------- | ---------------------------------- |
| `id`            | String    | @id @default(uuid())               |
| `author`        | String    |                                    |
| `title`         | String    |                                    |
| `description`   | String    | @db.VarChar(255)                   |
| `price`         | Decimal   | @db.Decimal(10, 2)                 |
| `stock`         | Int       | @default(0)                        |
| `coverUrl`      | String?   | @map("cover_url")                  |
| `coverThumbUrl` | String?   | @map("cover_thumb_url")            |
| `categoryId`    | String?   | @map("category_id")                |
| `createdAt`     | DateTime  | @default(now()) @map("created_at") |
| `deletedAt`     | DateTime? | @map("deleted_at")                 |

**Relations:** Belongs to Category
**Indexes:** `@@index([title])`, `@@index([author])`, `@@index([categoryId])`
**Table:** `books`

## Modules Overview

### Auth Module

**Files:**

- `auth.controller.ts` - Login, register, refresh token, logout
- `auth.service.ts` - JWT generation, password hashing
- `auth.routes.ts` - `/auth/*` endpoints
- `auth.doc.ts` - OpenAPI documentation
- `dto/` - Login, create-user, response DTOs
- `interface/auth.interface.ts` - Auth contracts
- `specs/` - Unit & integration tests

**Endpoints:**

- `POST /auth/login` - Authenticate user
- `POST /auth/register` - Register new user
- `POST /auth/logout` - Logout user

### Books Module

**Files:**

- `books.controller.ts` - CRUD operations, file upload
- `books.service.ts` - Business logic with soft delete
- `books.repository.ts` - Prisma data access
- `books.routes.ts` - `/books/*` endpoints
- `dtos/` - Book, params, query DTOs
- `interface/books.interface.ts` - Book contracts
- `specs/` - Integration tests with fixtures

**Endpoints:**

- `GET /books` - List books (with pagination, filters)
- `GET /books/:id` - Get single book
- `POST /books` - Create book (Admin only)
- `PUT /books/:id` - Update book (Admin only)
- `DELETE /books/:id` - Soft delete book (Admin only)
- `POST /books/:id/cover` - Upload book cover

**Features:**

- Soft delete (sets `deletedAt` timestamp)
- Image upload to Cloudinary
- Category association
- Search by title, author
- Pagination & sorting

### Categories Module

**Files:**

- `categories.controller.ts` - CRUD operations
- `categories.service.ts` - Business logic
- `categories.repository.ts` - Data access
- `categories.routes.ts` - `/categories/*` endpoints
- `dtos/` - Category DTOs
- `interface/categories.interface.ts` - Contracts
- `specs/` - Integration tests

**Endpoints:**

- `GET /categories` - List all categories
- `POST /categories` - Create category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Users Module

**Files:**

- `users.controller.ts` - User CRUD
- `users.service.ts` - Business logic
- `users.repository.ts` - Data access
- `users.routes.ts` - `/users/*` endpoints
- `interfaces/user.interface.ts` - User contracts

**Endpoints:**

- `GET /users/me` - Get current user profile

## Middlewares

| Middleware        | File                          | Purpose                       |
| ----------------- | ----------------------------- | ----------------------------- |
| **Auth**          | `auth.middleware.ts`          | Verify JWT token from cookies |
| **Admin Only**    | `admin-only.middleware.ts`    | Restrict to ADMIN role        |
| **Error Handler** | `error-handler.middleware.ts` | Global error response handler |
| **Validate**      | `validate.middleware.ts`      | Zod request validation        |
| **Upload**        | `upload.middleware.ts`        | Multer file upload handling   |
| **File Type**     | `file-type.middleware.ts`     | Validate uploaded file types  |

## Services

### CloudinaryUploadService

Handles image uploads to Cloudinary:

- Upload book covers
- Generate thumbnails
- Delete images

### TokenService

Manages JWT operations:

- Generate access tokens
- Generate refresh tokens
- Verify tokens
- Set HTTP-only cookies

## Development Setup

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- Git

### Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

## Testing

### Test Structure

```
src/
├── modules/*/specs/
│   ├── *.integration.spec.ts   # Integration tests
│   └── *.unit.spec.ts          # Unit tests
└── tests/
    ├── factories/              # Test data factories
    ├── helpers/                # Test utilities
    ├── setup.ts                # Test environment
    └── health-check.integration.spec.ts
```

### Test Factories

- `book.factory.ts` - Generate book test data
- `categorie.factory.ts` - Generate category test data

## API Documentation

- **Interactive Docs:** `/api-docs` (Scalar UI)

The OpenAPI spec is auto-generated from Zod schemas and route decorators.

## Security Features

- **Helmet:** HTTP security headers
- **CORS:** Configurable cross-origin requests
- **Rate Limiting:** Express-rate-limit
- **Password Hashing:** bcrypt with configurable salt
- **JWT:** HTTP-only cookies, configurable expiration
- **File Upload:** File type validation, size limits
- **Input Validation:** Zod schemas for all inputs

## Common Tasks

### Create New Module

1. Create directory: `src/modules/<module>/`
2. Create files: controller, service, repository, routes
3. Create DTOs: `dtos/*.dto.ts`
4. Create interfaces: `interfaces/*.interface.ts`
5. Create tests: `specs/*.spec.ts`
6. Register routes in `src/core/routes.ts`
7. Add OpenAPI docs

### Add New Endpoint

1. Define route in `*.routes.ts`
2. Add controller method in `*.controller.ts`
3. Implement service logic in `*.service.ts`
4. Create Zod DTO in `dtos/*.dto.ts`
5. Add integration tests
6. Update OpenAPI documentation
