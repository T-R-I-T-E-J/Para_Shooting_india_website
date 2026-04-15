# CLAUDE.md — Para Shooting India

## Project Overview
**Para Shooting India** — Full-stack monorepo: public website + admin dashboard for managing shooters, results, news, events, media, and certificates.

## Monorepo Structure
```
/
  apps/
    web/          → Next.js 14 (App Router) frontend
    api/          → NestJS 11 backend
  packages/       → shared-types, ui, database libs (prefer these over duplicating types)
  docs/           → Architecture, deployment, setup guides
  infrastructure/ → PostgreSQL setup scripts
```

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 App Router, React 18, TailwindCSS, lucide-react, react-hook-form |
| Backend | NestJS 11, class-validator, class-transformer, Multer |
| Database | PostgreSQL, TypeORM, SQL migrations (`apps/api/migrations/`) |
| Auth | JWT (`@nestjs/jwt` on API, `jose` on web), bcrypt, RolesGuard |
| Deployment | PM2 (API), Netlify (Web) |

## Dev Commands
```bash
# Backend
cd apps/api && npm install && npm run start:dev   # port from .env PORT=
npm run migrate:sql                               # run SQL migrations

# Frontend
cd apps/web && npm install && npm run dev         # port 3000

# Database (requires Docker)
docker-compose up -d
```

## Environment Variables
**`apps/api/.env`**
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — signs/verifies JWT tokens
- `PORT` — NestJS listen port

**`apps/web/.env`**
- `NEXT_PUBLIC_API_URL` — NestJS API base URL (used by all frontend fetch calls)

## Backend Architecture (NestJS)

### Request Pipeline
```
Router → JWT Guard → RolesGuard → Audit Interceptor → Controller → DTO Validation Pipe → Service → TypeORM / PostgreSQL
```

### Domain Modules
| Module | Folder | Purpose |
|---|---|---|
| auth | `src/auth/` | Login, JWT generation, password hashing |
| users | `src/users/` | User accounts and profiles |
| shooters | `src/shooters/` | Shooter profiles, classification, admin ops |
| results | `src/results/` | Match results, certificate PDF generation |
| news | `src/news/` | News/content (has public endpoints) |
| events | `src/events/` | Event scheduling |
| media | `src/media/` | File uploads (strict MIME + size validation) |
| certificates | `src/certificates/` | Certificate generation and verification |
| downloads | `src/downloads/` | Downloadable files management |
| categories | `src/categories/` | Event categories |
| disability-categories | `src/disability-categories/` | Classification categories |
| states | `src/states/` | Geographic state data |
| venues | `src/venues/` | Venue management |
| upload | `src/upload/` | Multer-based file upload handler |
| health | `src/health/` | Health check endpoints |
| common | `src/common/` | Global guards, interceptors, encryption, audit logs |

### Key Entities (TypeORM)
`User`, `Shooter`, `ShooterClassification`, `Result`, `Certificate`, `Download`, `News`, `Event`, `Media`, `Venue`, `Category`, `DisabilityCategory`, `State`, `Role`, `AuditLog`, `StoredFile`

### Auth Rules
- All `/api/*` endpoints are JWT-protected **except** explicitly public ones (e.g. `/api/news/public`, `/api/verify/*`)
- Role-based access: `ADMIN` role required for admin operations
- Throws `403 Forbidden` when role constraint fails, `401 Unauthorized` when token is missing/invalid

## Frontend Architecture (Next.js)

### Route Groups
```
app/
  (public)/     → Home, About, Awards, Classification, Contact, Media, News, Results, Policies, Verify
  (auth)/       → /login, /register
  (dashboard)/
    admin/      → classification, results-import, scores, shooters
    shooter/    → profile, certificates, id-card, page (dashboard home)
```

### Middleware (`apps/web/src/middleware.ts`)
Edge-level guard — redirects unauthenticated users accessing `/(dashboard)` to `/login`.

### API Calls
- All API calls go through a centralized wrapper in `apps/web/src/lib/api.ts`
- JWT token auto-attached to outgoing requests
- Global 401 redirect handled centrally

## Key Business Rules
1. **Type sharing** — Always use `packages/shared-types` instead of re-declaring types in `apps/web` or `apps/api`
2. **DTO strictness** — Frontend request shape must exactly match backend DTOs or you get `400 Bad Request`
3. **Upload safety** — Exact MIME type + strict file size limits enforced on all uploads; never bypass Multer config
4. **Password/PII** — bcrypt for passwords, custom `EncryptionService` (`src/common/`) for sensitive PII fields
5. **SQL migrations** — Schema changes go in `apps/api/migrations/` as `.sql` files, never edit DB directly
6. **Public vs protected** — Before adding a new API endpoint, decide if it's public or protected and apply guards accordingly

## Useful File Locations
| File | Purpose |
|---|---|
| `apps/api/src/common/guards/roles.guard.ts` | Role enforcement — apply with `@Roles()` decorator |
| `apps/api/src/auth/auth.service.ts` | Login logic, token generation |
| `apps/web/src/middleware.ts` | Frontend route protection |
| `apps/api/src/config/multer.config.ts` | Upload configuration |
| `apps/api/src/results/services/certificate-pdf.service.ts` | PDF certificate generation |
| `docs/project-architecture-context.md` | Full architecture handbook |
| `docs/server-deployment-guide.md` | Production deployment steps |

## Docs to Read Before Working
- `docs/project-architecture-context.md` — full data flow, interaction maps, sequence diagrams
- `docs/server-deployment-guide.md` — PM2, Nginx, environment setup
- `docs/classification-deployment-summary.md` — classification feature context

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
|------|----------|
| `detect_changes` | Reviewing code changes � gives risk-scored analysis |
| `get_review_context` | Need source snippets for review � token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
