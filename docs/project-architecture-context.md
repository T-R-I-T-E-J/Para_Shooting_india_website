# Project Context and Architecture Handbook

## 1. Project Overview
**Project Name:** Para Shooting India
**Purpose:** A full‑stack monorepo delivering a secure, content‑driven website and admin dashboard for Para Shooting India.
**Core Problem It Solves:** Provides a centralized, secure platform for managing shooters, news, events, match results, and media uploads, while presenting a modern public-facing site and a secure administrative dashboard. 
**Tech Stack:**
- **Frontend:** Next.js (App Router), React, TailwindCSS, `lucide-react`
- **Backend:** NestJS, class-validator/transformer, Multer 
- **Database:** PostgreSQL
- **APIs:** RESTful APIs built with NestJS
- **Architecture Style:** Monorepo containing a separated Client App (Next.js) and API Service (NestJS), following an MVC-inspired and service-oriented controller/provider pattern on the backend.

## 2. Folder & File Structure

```text
/project-root
  /apps
    /web                      # Next.js Frontend App
      /src
        /app                  # Next.js App Router (pages & server/client components)
          /(public)           # Public-facing routes
          /(dashboard)        # Admin dashboard routes
          /(auth)             # Authentication routes
        /components           # UI components (e.g., /ui/* primitives)
        /lib                  # Client utilities (API wrappers, helpers)
      /public                 # Static assets
      middleware.ts           # Next.js edge middleware
    /api                      # NestJS Backend API
      /src
        /auth                 # Authentication, JWT, roles, permissions, guards
        /common               # Global guards, interceptors, encryption, auditing
        /config               # Configuration files and schemas
        /events               # Events domain module
        /news                 # News domain module
        /results              # Results domain module
        /shooters             # Shooters domain module
        /media                # Media and secure file upload domain 
        /users                # Users domain module
      /migrations             # SQL definitions for database scheme
      /uploads                # Local server upload directory
  /packages                   # Shared libraries (shared-types, ui, database)
  /infrastructure/database    # PostgreSQL setup scripts and configs
  /docs                       # Architecture, setup, security, and environment docs
```

**Explanation of Each Folder:**
- `/apps/web/src/app` → Route-level views for Next.js App Router.
- `/apps/web/src/components` → Reusable UI pieces, including Tailwind primitives.
- `/apps/api/src/*` → The NestJS backend separated by domain (users, events, auth). Each folder has controllers, services, and entities.
- `/apps/api/src/common` → Universal logic like audit interceptors, request encryption, and query protection.

## 3. File-Level Documentation (VERY IMPORTANT)

**File:** `apps/api/src/auth/auth.service.ts`
- **Purpose:** Handles core authentication, user verification, and token generation.
- **Exports:** `login(dto)`, `validateUser(email, password)`
- **Dependencies:** `UsersService`, `JwtService`, Encryption utilities.
- **Used By:** `auth.controller.ts`, local strategy guards.
- **Side Effects:** Hashes/verifies passwords, generates JWT tokens.

**File:** `apps/api/src/auth/auth.controller.ts`
- **Purpose:** Exposes auth endpoints to the frontend.
- **Functions:** `login()`, `getProfile()`
- **Calls:** `AuthService`
- **Called By:** Client-side login forms.

**File:** `apps/api/src/common/guards/roles.guard.ts`
- **Purpose:** Secures endpoints by verifying if the active user token possesses the required role.
- **Dependencies:** `Reflector`
- **Used By:** Applied globally or dynamically on controllers/routes.
- **Side Effects:** Throws `403 Forbidden` if role constraints are not met.

**File:** `apps/web/middleware.ts`
- **Purpose:** Edge-level access control on the frontend before pages render.
- **Functions:** `middleware(req)`
- **Dependencies:** Next.js `NextRequest`, `NextResponse`.
- **Side Effects:** Redirects unauthenticated users attempting to access `/(dashboard)` back to `/(auth)/login`.

**File:** `apps/web/src/lib/api.ts` (Example Standard Wrapper)
- **Purpose:** Wrapper around `fetch` or Axios for centralized API calls.
- **Exports:** Abstract HTTP methods (`get`, `post`, etc.).
- **Dependencies:** Native fetch API.
- **Side Effects:** Automatically attaches JWT tokens to outgoing requests and handles global 401 redirects.

## 4. Data Flow (How Things Talk)

**Example: File Upload Flow (Media)**
1. **User action:** Admin user submits an image in an upload form via the Next.js `(dashboard)`.
2. **Frontend request:** Form data is sent via `fetch/axios` to `POST /api/upload`. Token is attached in headers.
3. **Backend ingress:** Route is intercepted by `auth.guard.ts` to verify JWT and `roles.guard.ts` to verify Admin role.
4. **Backend controller:** `UploadController` handles the request, applying Multer configurations (file size/mime type limits).
5. **Backend service:** `UploadService` processes the file, saves it securely to the `/uploads` directory (or cloud), and creates a database record.
6. **Response:** Returns the file URL or metadata.
7. **Frontend update:** State is updated to reflect the newly uploaded file in the UI.

## 5. Interaction Mapping (CRITICAL)

**Frontend → Backend**
| Frontend Context | Calls API | Backend Module | Controller / Service |
|------------------|-----------|-----------------|----------------------|
| Dashboard Login  | `POST /auth/login` | `auth` | `AuthController.login` / `AuthService` |
| Admin Shooters   | `GET /shooters` | `shooters` | `ShootersController.findAll` / `ShootersService` |
| Media Upload     | `POST /upload` | `media` | `UploadController.upload` / `UploadService` |

**Backend Internal Flow (Standard Endpoint)**
`Router Ingress` → `Global Guards (JWT/Role)` → `Audit/Security Interceptors` → `Controller Endpoint` → `DTO Validation Pipe` → `Service Logic` → `Repository / Database`.

## 6. API Documentation (Key Examples)

**POST /auth/login**
- **Input:**
  ```json
  {
    "email": "admin@example.com",
    "password": "securepassword"
  }
  ```
- **Output:**
  ```json
  {
    "access_token": "eyJhbG...",
    "user": { "id": 1, "email": "admin@example.com", "role": "ADMIN" }
  }
  ```
- **Errors:**
  - `401 Unauthorized`: Invalid credentials.
  - `400 Bad Request`: Validation failure (missing email/password).

**GET /api/shooters**
- **Output:** Array of Shooter entities.
- **Errors:**
  - `403 Forbidden`: User does not have adequate roles to view this data.

## 7. State Management
- **Global state:** Server State usually managed by Next.js Server Components, fetched strictly when needed.
- **Client state:** React Context or Zustand (if heavily required by Admin Dashboard forms).
- **What is stored:** `user`, UI toggles (sidebar state).
- **Who updates it:** Auth forms / API clients.
- **Who consumes it:** Protected routes, layout components (conditional rendering for Admin Nav).

## 8. Environment Variables

**Backend (`apps/api/.env.example`)**
- `DATABASE_URL=` → Connection string for PostgreSQL.
- `JWT_SECRET=` → Cryptographic secret used to sign and verify user sessions.
- `PORT=` → Internal port for NestJS to listen on.

**Frontend (`apps/web/.env.example`)**
- `NEXT_PUBLIC_API_URL=` → The public-facing or local URL of the NestJS API used by frontend forms.

## 9. Key Logic / Business Rules
- **Authentication:** All `/api/*` endpoints except strictly public ones (like `/api/news/public`) are protected. Admin dashboard pages on the frontend use Next middleware to bounce non-authenticated users.
- **Data Protection:** Passwords and sensitive PII are subjected to hashing or the custom Encryption Service. 
- **Upload Safety:** Exact MIME types and strict size limits are enforced on all file uploads gracefully. Unverified files are rejected gracefully.

## 10. Dependencies
- **Next.js (App Router):** Chosen for efficient SEO (SSR) on public pages and dynamic capabilities in the dashboard.
- **NestJS:** Enterprise-grade structural framework chosen to enforce strict typing, DI mapping, and easily testable controllers/services.
- **PostgreSQL / SQL Migrations:** Relational data stability.
- **class-validator / class-transformer:** Request sanitization and rigorous incoming request payload validation.
- **TailwindCSS:** For flexible, utility-first rapid UI creation.

## 11. Known Issues / Constraints
- Relies heavily on exact DTO typings; mismatch between Front-End requests and Back-End DTOs leads to strict 400 Bad Request errors.
- Test environments generally require standard Dockerized postgres instances. 

## 12. How to Run

**Database (Ensure Docker is running):**
```bash
docker-compose up -d
```

**Backend (API):**
```bash
cd apps/api
npm install
npm run start:dev
```

**Frontend (Web):**
```bash
cd apps/web
npm install
npm run dev
```

## 13. Sequence Diagram: Protected Resource Request
`User` → `Browser (Next.js Dashboard)` → `Middleware checks Local Storage/Cookies for Auth`
`Browser` → `GET /api/secure-data (with JWT)` → `NestJS Guard verifies JWT`
`NestJS Controller` → `NestJS Service` → `Postgres Database`
`Database` → `NestJS Service` → `NestJS Interceptor (Audit logs activity)` → `Browser`
`Browser` → `User (Renders Data UI)`

## 14. What You Should Provide to Another AI

When handing off or instructing an AI based on this project context, include:
✅ This Architecture Documentation 
✅ Reference to `README.md` and `docs/` folder
✅ Specifically any context about **NestJS Guards/Interceptors** when building new backend features.
✅ Notice to utilize `packages/shared-types` rather than declaring types linearly in applications.
✅ `.env.example` configurations.
