# Architecture Overview

Mindora Beta follows a layered architecture pattern with clear separation of concerns.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Layer                               │
│              (Web App, Mobile App, Third-party)                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API Gateway                                  │
│     (Express.js with authentication, rate limiting, validation)      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │    Routes     │   │   Socket.IO   │   │   Scheduled   │
    │   (REST API)  │   │  (Real-time)  │   │    (Cron)     │
    └───────┬───────┘   └───────┬───────┘   └───────┬───────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Controller Layer                              │
│               (Request handling, response formatting)                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Service Layer                                │
│                    (Business logic, validation)                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
    ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
    │   PostgreSQL  │   │   Cloudinary  │   │    Resend     │
    │  (Drizzle ORM)│   │   (Storage)   │   │    (Email)    │
    └───────────────┘   └───────────────┘   └───────────────┘
```

---

## Directory Structure

```
src/
├── config/          # Configuration & environment
├── controllers/     # Request handlers
├── database/        # Schema, migrations, seeds
├── middleware/      # Express middleware
├── routes/          # API route definitions
├── services/        # Business logic
├── socket/          # WebSocket handlers
├── utils/           # Utilities & helpers
└── validators/      # Request validation schemas
```

---

## Layer Responsibilities

### Routes Layer

- Define API endpoints
- Apply middleware chains
- Swagger documentation annotations

### Controller Layer

- Handle HTTP requests
- Parse request parameters
- Format responses
- Error handling

### Service Layer

- Business logic implementation
- Database operations
- External service integration
- Transaction management

### Middleware Layer

- Authentication
- Authorization (role-based)
- Request validation
- Rate limiting
- Logging

---

## Key Design Decisions

### 1. TypeScript First

All code is written in TypeScript for type safety and better developer experience.

### 2. Drizzle ORM

Lightweight ORM with type-safe queries and migrations.

### 3. JWT Authentication

Stateless authentication with access/refresh token pattern.

### 4. Role-Based Access Control

Three roles: PATIENT, THERAPIST, ADMIN with hierarchical permissions.

### 5. Real-time with Socket.IO

Bi-directional communication for messages and notifications.

---

## Documentation Sections

- [Database Schema](database.md)
- [Services](services.md)
- [Middleware](middleware.md)
