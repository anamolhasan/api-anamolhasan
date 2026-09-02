# api-anamolhasan

Backend REST API for the [Anamol Hasan portfolio](https://github.com/) frontend.
It was extracted out of the Next.js portfolio project so the frontend only renders UI and calls this API over HTTP.

## Overview

The API serves portfolio **projects** data and handles **image uploads** to Cloudinary:

- Public read endpoints for projects used by the portfolio pages.
- Protected CRUD endpoints for managing projects from the admin dashboard.
- Protected image upload / delete endpoints backed by Cloudinary.

## Technologies

- Node.js
- Express.js 5
- TypeScript
- MongoDB with Mongoose (ODM)
- Clerk (`@clerk/express`) — authentication & role-based authorization
- Zod (request validation)
- Multer (multipart file uploads)
- Cloudinary SDK (image hosting)
- tsx (dev runner)

## Installation

```bash
pnpm install
```

## Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
| --- | --- |
| `PORT` | Port the server listens on (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Allowed CORS origin(s) of the Next.js frontend, comma-separated for multiple |
| `MONGODB_URI` | MongoDB connection string (`mongodb://127.0.0.1:27017/anamolhasan` or MongoDB Atlas URI) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLERK_PUBLISHABLE_KEY` | Publishable key from dashboard.clerk.com (`pk_test_...` / `pk_live_...`) |
| `CLERK_SECRET_KEY` | Secret key from dashboard.clerk.com (`sk_test_...` / `sk_live_...`) |

Never expose `MONGODB_URI`, `CLOUDINARY_API_SECRET`, `CLERK_SECRET_KEY` or any other backend secrets to the frontend.

The app validates required variables at boot and refuses to start when one is missing — misconfiguration is never silently ignored.

## Authentication & roles

Authentication is powered by **Clerk**:

- `clerkMiddleware()` runs globally and populates `req.auth`.
- The reusable `checkAuth(...roles)` guard protects mutating endpoints:
  - unauthenticated requests → `401`
  - authenticated but missing role → `403`
- Roles are resolved from the user's Clerk profile (`publicMetadata.role`),
  falling back to the session claims when present.
- Supported roles: `SUPER_ADMIN`, `ADMIN`, `USER`.

To make yourself an admin, set `publicMetadata.role = "ADMIN"` (or `SUPER_ADMIN`)
for your user in the Clerk Dashboard. For zero-latency role checks you can also
add the role to your session token template
(`Customize session token` → `publicMetadata.role`).

## MongoDB configuration

The server connects to MongoDB through a single centralized connection in
`src/app/config/database.ts` using Mongoose. The app refuses to start when the
connection fails, so misconfiguration is never silently ignored.

No database name is hardcoded anywhere else — everything comes from `MONGODB_URI`.

## Commands

```bash
# development (watch mode)
pnpm dev

# type-check & build to dist/
pnpm build

# run compiled build
pnpm start
```

## API documentation (Swagger)

Interactive OpenAPI 3.0 documentation is served by Swagger UI:

- Swagger UI: `http://localhost:5000/api-docs`
- Raw OpenAPI JSON: `http://localhost:5000/api-docs/openapi.json`

Protected endpoints can be tested from the UI via the **Authorize** button:
paste a Clerk session token and it will be sent as `Authorization: Bearer <token>`.

The docs mount path and availability are configurable:

| Variable | Default | Description |
| --- | --- | --- |
| `SWAGGER_ENABLED` | `true` in development, `false` in production | Set to `true` to expose docs in production |
| `SWAGGER_PATH` | `/api-docs` | Base path where Swagger UI is mounted |

`API_BASE_URL` (and optionally `PRODUCTION_API_BASE_URL`) control the server URL(s)
advertised in the OpenAPI document. Swagger is mounted before the API router and is
fully disabled (not mounted) when `SWAGGER_ENABLED=false`, so existing routes and
middleware are unaffected.

## API base URL

```text
http://localhost:5000/api/v1
```

Configure the frontend to call it through `NEXT_PUBLIC_API_URL` on the Next.js side.

## Available endpoints

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | API health check |

### Projects — `/api/v1/projects`

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/projects` | public | Paginated list, newest first (see query params below) |
| POST | `/api/v1/projects` | ADMIN / SUPER_ADMIN | Create a project (Zod-validated) |
| GET | `/api/v1/projects/:id` | public | Single project by id |
| PUT | `/api/v1/projects/:id` | ADMIN / SUPER_ADMIN | Update a project (Zod-validated) |
| DELETE | `/api/v1/projects/:id` | ADMIN / SUPER_ADMIN | Delete a project (also removes its images/thumbnail from Cloudinary) |

Supported list query params:

| Param | Example | Description |
| --- | --- | --- |
| `searchTerm` | `?searchTerm=shoes` | Case-insensitive search across title, short description, description, category and technologies |
| `status` | `?status=published` | Filter by status (`published`, `draft`, `archived`) |
| `featured` | `?featured=true` | Filter featured projects |
| `category` | `?category=Frontend` | Filter by category |
| `page` / `limit` | `?page=2&limit=9` | Pagination (max limit 100) |
| `sortBy` | `?sortBy=-createdAt` | Sort field(s), `-` prefix = descending |

### Media — uploads

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/upload` | public | Cloudinary connectivity check (`api.ping`) |
| POST | `/api/v1/upload` | ADMIN / SUPER_ADMIN | Upload an image (`multipart/form-data`, field `file`) |
| POST | `/api/v1/cloudinary/delete` | ADMIN / SUPER_ADMIN | Delete a Cloudinary asset by `{ publicId }` |
| GET | `/api/v1/upload-test` | ADMIN / SUPER_ADMIN | Test upload of a Cloudinary demo image |

### Response format

```jsonc
// success
{
  "success": true,
  "message": "Projects fetched successfully",
  "data": [ /* ... */ ],
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 } // list endpoints only
}

// error
{
  "success": false,
  "message": "You are not authorized",
  "errorSources": [{ "path": "", "message": "You are not authorized" }],
  "stack": "..." // non-production only
}
```

Validation errors return HTTP 400 with per-field entries in `errorSources`;
duplicate keys map to HTTP 409; invalid Mongo ids map to HTTP 400.

## Project structure

```text
src/
├── app.ts                     # Express app: parsers, CORS, clerkMiddleware, routes, errors
├── server.ts                  # MongoDB connection + HTTP server bootstrap
├── constants/
│   └── roles.ts               # Role registry + TRole type
├── config/
│   ├── env.ts                 # Validated environment variable access
│   ├── database.ts            # Mongoose connection
│   └── cloudinary.ts          # Cloudinary configuration
├── errorHelpers/
│   ├── AppError.ts            # Typed application error (statusCode)
│   ├── handleZodError.ts      # ZodError -> unified envelope
│   └── handleMongooseError.ts # Validation/Cast/duplicate-key mapping
├── middlewares/
│   ├── check-auth.ts          # Clerk-powered role guard: checkAuth(...roles)
│   ├── validate-request.ts    # Zod validation middleware
│   ├── error-handler.ts       # Centralized error envelope w/ errorSources
│   └── not-found.ts
├── modules/
│   ├── project/
│   │   ├── project.interface.ts
│   │   ├── project.model.ts        # Mongoose schema/model
│   │   ├── project.constant.ts     # Searchable/filterable fields
│   │   ├── project.validation.ts   # Zod schemas
│   │   ├── project.service.ts      # Business logic (+ QueryBuilder usage)
│   │   ├── project.controller.ts   # Thin request handlers
│   │   └── project.route.ts        # checkAuth -> validateRequest -> controller
│   └── upload/
│       ├── upload.service.ts       # Cloudinary operations
│       ├── upload.controller.ts
│       └── upload.route.ts
├── routes/
│   └── index.ts               # Mounts all module routers under /api/v1
├── types/                     # Shared interfaces + Express Request.user augmentation
└── utils/
    ├── api-error.ts           # Deprecated re-export of AppError
    ├── catch-async.ts
    ├── send-response.ts       # Unified success envelope
    └── query-builder.ts       # Search/filter/paginate/sort/fields for Mongoose
```
