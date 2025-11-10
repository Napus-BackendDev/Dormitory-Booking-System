 # Backend API Documentation

 This document describes the backend HTTP API for the Dormitory-Booking-System (NestJS + Prisma).

 Base URL (development):

 - http://localhost:3000

 Authentication
 --------------
 - Authentication uses JWT. On successful login the server sets an HTTP-only cookie named `access_token` (1 day expiry). You can also send the token in the `Authorization: Bearer <token>` header for API clients.
 - Protected endpoints require the `AuthGuard`. Some endpoints also require role checks (`Roles` decorator). Roles available: `USER`, `STAFF`, `ADMIN`.

 Common response format
 ----------------------
 - Most endpoints return JSON. Common status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 500 (Server Error).

 Controllers and endpoints
 -------------------------

 Auth
 ~~~~

 - POST /auth/register
   - Body: `src/modules/auth/dtos/register.dto.ts` (email, name, password, role?)
   - Response: { message, user }

 - POST /auth/login
   - Body: `src/modules/auth/dtos/login.dto.ts` (email, password)
   - Sets cookie `access_token` and returns { message, user }

 - GET /auth/profile
   - Auth required
   - Returns user profile

 - POST /auth/logout
   - Auth required
   - Invalidates JWT (server stores in Redis blacklist) and clears cookie

 Tickets
 ~~~~~~~

 - GET /ticket
   - Roles: ADMIN
   - Returns list of tickets

 - GET /ticket/:id
   - Roles: STAFF, ADMIN
   - Returns single ticket

 - POST /ticket
   - Roles: USER
   - Body: `src/modules/ticket/dto/create-ticket.dto.ts` (title, description, priority, dueAt, repairTypeId?, locationId?, ...)

 - PATCH /ticket/:id
   - Roles: USER, STAFF
   - Body: `src/modules/ticket/dto/update-ticket.dto.ts`

 - DELETE /ticket/:id
   - Roles: ADMIN

 Ticket Events
 ~~~~~~~~~~~~~

 - POST /ticket-event
   - Roles: USER, STAFF, ADMIN
   - Body: `src/modules/ticket_event/dto/create-ticket_event.dto.ts` (ticketId, type, note)

 - GET /ticket-event
   - Roles: STAFF, ADMIN, USER

 - GET /ticket-event/:id
   - Roles: STAFF, ADMIN

 - PATCH /ticket-event/:id
   - Roles: STAFF, ADMIN

 - DELETE /ticket-event/:id
   - Roles: ADMIN

 Users
 ~~~~~

 - GET /user
   - Roles: USER, STAFF, ADMIN
   - Returns all users

 - GET /user/admin-user
   - Roles: ADMIN
   - Returns admin user

 - DELETE /user/delete-all
   - Roles: ADMIN

 - PUT /user/manage-access/:id
   - Roles: USER
   - Body: `src/modules/user/dtos/update.access.dto.ts` (role: Role)

 Attachments
 ~~~~~~~~~~~

 - POST /attachment
   - Roles: ADMIN
   - Body: `src/modules/attachment/dto/create-attachment.dto.ts`

 - GET /attachment
   - Returns all attachments

 - GET /attachment/:id

 - PATCH /attachment/:id

 - DELETE /attachment/:id

 Locations
 ~~~~~~~~~

 - GET /location
 - GET /location/:id
 - POST /location  (ADMIN)
 - PATCH /location/:id (ADMIN)
 - DELETE /location/:id (ADMIN)

 Repair Types
 ~~~~~~~~~~~~

 - GET /repairtype
 - GET /repairtype/:id
 - POST /repairtype (ADMIN)
 - PATCH /repairtype/:id (ADMIN)
 - DELETE /repairtype/:id (ADMIN)

 Roles
 ~~~~~

 - GET /role
 - GET /role/:id
 - POST /role
 - PATCH /role/:id
 - DELETE /role/:id

 Surveys
 ~~~~~~~

 - GET /survey
 - GET /survey/:id
 - POST /survey
 - PATCH /survey/:id
 - DELETE /survey/:id

 Other notes
 -----------

 - LINE integration: messages are sent to LINE users via `src/modules/line/Line.service.ts`. LINE requires `LINE_ACCESS_TOKEN` environment variable.
 - Redis is used for token blacklist — ensure `REDIS_HOST` and `REDIS_PORT` are configured.

 OpenAPI / Swagger
 ------------------

 - An OpenAPI skeleton is provided in `backend/openapi.yaml` (minimal). You can serve it with any OpenAPI UI (Swagger UI or Redoc).

 How to use
 ----------

 1. Start backend locally:

 ```bash
 cd backend
 npm install
 npm run dev
 ```

 2. Use Postman / HTTP client, and for protected endpoints either log in to get cookie or set `Authorization: Bearer <token>` header.

 3. To view OpenAPI in Swagger UI (example):

 ```bash
 npx http-server -c-1 . -p 8000 # serve repo root or backend folder
 # then open http://localhost:8000/backend/openapi.yaml using a Swagger UI viewer
 ```

 If you'd like, I can:

 - Expand `openapi.yaml` with full schemas based on DTO files.
 - Integrate NestJS Swagger module into `src/main.ts` to auto-generate docs at runtime (e.g., /docs).
