# Deployment Guide

Deploy Mindora Beta to production.

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Domain with SSL certificate
- Cloud provider account (Cloudinary, Resend)

---

## Build

### 1. Build TypeScript

```bash
npm run build
```

Output: `dist/` directory

### 2. Verify Build

```bash
npm start
```

---

## Production Configuration

### Environment Variables

```env
# Required production env vars
NODE_ENV=production
PORT=5000

# Database (use connection pooling)
DATABASE_URL=postgres://user:pass@db.host:5432/mindora?sslmode=require

# Security
JWT_SECRET=<strong-random-secret>
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# External Services
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
RESEND_API_KEY=xxx
EMAIL_FROM=noreply@mindora.com

# Frontend
FRONTEND_URL=https://mindora.com
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Deployment Options

### Option 1: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]
```

Build and run:

```bash
docker build -t mindora-api .
docker run -p 5000:5000 --env-file .env mindora-api
```

### Option 2: PM2 (VPS)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/server.js --name mindora-api

# Enable startup on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

### Option 3: Railway/Render

1. Connect GitHub repository
2. Set environment variables
3. Configure build command: `npm run build`
4. Configure start command: `npm start`

---

## Database Migration

### Production Schema Push

```bash
# Careful: this can drop data
npm run db:push
```

### Safe Migrations

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

---

## Health Checks

### Endpoint

```
GET /health
```

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:00:00Z",
  "version": "1.0.0"
}
```

### Database Check

```
GET /admin/system-health
```

(Requires admin auth)

---

## Logging

Logs are written using Winston:

- **Console**: Development
- **File**: Production (`logs/` directory)

### Log Levels

| Level | Usage                      |
| ----- | -------------------------- |
| error | Errors that need attention |
| warn  | Warning conditions         |
| info  | General information        |
| debug | Debug information          |

---

## Monitoring

### Recommended Tools

- **Uptime monitoring**: Uptime Robot, Pingdom
- **APM**: New Relic, Datadog
- **Error tracking**: Sentry
- **Logging**: LogDNA, Papertrail

### Key Metrics

- Response time (p50, p95, p99)
- Error rate
- Active connections
- Memory usage
- CPU usage

---

## Security Checklist

- [ ] Use HTTPS only
- [ ] Set secure HTTP headers (Helmet)
- [ ] Enable rate limiting
- [ ] Use strong JWT secret
- [ ] Validate all inputs
- [ ] Sanitize database queries
- [ ] Keep dependencies updated
- [ ] Enable CORS for specific origins
- [ ] Use environment variables for secrets
- [ ] Regular security audits

---

## Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name api.mindora.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.mindora.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Rollback

### Revert Deployment

```bash
# If using PM2
pm2 reload ecosystem.config.js --update-env

# If using Docker
docker pull mindora-api:previous
docker-compose up -d
```

### Database Rollback

Keep migration history and create rollback scripts for each migration.

---

## Troubleshooting

### Application Won't Start

1. Check logs: `pm2 logs mindora-api`
2. Verify env vars are set
3. Test database connection

### High Memory Usage

1. Check for memory leaks with heap snapshots
2. Increase Node.js memory: `--max-old-space-size=4096`
3. Add swap on server

### Slow Responses

1. Check database query performance
2. Add caching (Redis)
3. Optimize queries with indexes
