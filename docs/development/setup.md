# Development Setup

Get started with Mindora Beta development.

## Prerequisites

- **Node.js** v18+ ([download](https://nodejs.org/))
- **PostgreSQL** v14+ ([download](https://www.postgresql.org/download/))
- **npm** v9+ (included with Node.js)

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/mindoraRwanda/mindorabeta.git
cd mindorabeta
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgres://user:password@localhost:5432/mindora

# JWT
JWT_SECRET=your-super-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend (for emails)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=noreply@yourdomain.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

### 4. Setup Database

Push schema to database:

```bash
npm run db:push
```

Or generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:5000`

---

## Available Scripts

| Script                  | Description                      |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Start dev server with hot reload |
| `npm run build`         | Build for production             |
| `npm start`             | Run production build             |
| `npm test`              | Run tests                        |
| `npm run test:watch`    | Run tests in watch mode          |
| `npm run test:coverage` | Run tests with coverage          |
| `npm run lint`          | Lint code                        |
| `npm run lint:fix`      | Fix lint errors                  |
| `npm run format`        | Format code                      |
| `npm run db:push`       | Push schema to DB                |
| `npm run db:studio`     | Open Drizzle Studio              |

---

## Project Structure

```
mindorabeta/
├── src/
│   ├── config/         # Configuration
│   │   ├── index.ts    # Main config
│   │   ├── database.ts # DB config
│   │   ├── jwt.ts      # JWT config
│   │   └── swagger.ts  # API docs config
│   ├── controllers/    # Request handlers
│   ├── database/       # DB schema & seeds
│   ├── middleware/     # Express middleware
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── socket/         # WebSocket handlers
│   ├── utils/          # Utilities
│   ├── validators/     # Validation schemas
│   ├── app.ts          # Express app
│   └── server.ts       # Server entry
├── tests/              # Test suites
├── docs/               # Documentation
├── public/             # Static files
└── uploads/            # File uploads
```

---

## API Documentation

Swagger UI available at:

```
http://localhost:5000/api-docs
```

---

## Database Management

### View Database

```bash
npm run db:studio
```

Opens Drizzle Studio at `https://local.drizzle.studio`

### Reset Database

```bash
# Drop and recreate (development only)
npm run db:push -- --force
```

---

## Environment Variables

| Variable             | Required | Description                        |
| -------------------- | -------- | ---------------------------------- |
| `PORT`               | No       | Server port (default: 5000)        |
| `NODE_ENV`           | No       | development, production, test      |
| `DATABASE_URL`       | Yes      | PostgreSQL connection string       |
| `JWT_SECRET`         | Yes      | Secret for JWT signing             |
| `JWT_ACCESS_EXPIRY`  | No       | Access token expiry (default: 15m) |
| `JWT_REFRESH_EXPIRY` | No       | Refresh token expiry (default: 7d) |
| `CLOUDINARY_*`       | Yes      | Cloudinary credentials             |
| `RESEND_API_KEY`     | Yes      | Resend email API key               |
| `EMAIL_FROM`         | Yes      | Sender email address               |
| `FRONTEND_URL`       | Yes      | Frontend URL for links             |

---

## IDE Setup

### VS Code Extensions

- ESLint
- Prettier
- TypeScript
- REST Client (for API testing)

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED
```

- Ensure PostgreSQL is running
- Check `DATABASE_URL` format
- Verify database exists

### Port Already in Use

```
Error: EADDRINUSE
```

```bash
# Find process
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <pid> /F
```

### TypeScript Errors

```bash
# Rebuild
npm run build
```
