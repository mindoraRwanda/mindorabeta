# Mindora Beta Documentation

Welcome to the Mindora Beta documentation. Mindora is a mental health platform that connects patients with therapists, providing mood tracking, exercises, community support, and more.

## 📚 Quick Navigation

| Section | Description |
|---------|-------------|
| [**🔓 Public API**](api/public-api.md) | Endpoints requiring no authentication |
| [API Overview](api/README.md) | Complete API documentation |
| [Architecture](architecture/README.md) | System architecture & design |
| [Development](development/setup.md) | Setup & contribution guides |

---

## 🔓 Public API (No Authentication)

These endpoints are publicly accessible:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register` | POST | Register new user |
| `/api/v1/auth/login` | POST | Login |
| `/api/v1/auth/forgot-password` | POST | Request password reset |
| `/api/v1/auth/reset-password` | POST | Reset password with token |
| `/api/v1/auth/verify-email` | POST | Verify email address |
| `/api/v1/emergency-contacts` | GET | Get emergency contacts |
| `/api/v1/resources` | GET | Browse public resources |

👉 **[Full Public API Documentation](api/public-api.md)**

---

## API by User Role

| Role | Endpoints | Documentation |
|------|-----------|---------------|
| 🔓 Public | 7 | [Public API](api/public-api.md) |
| 👤 Patient | 68 | [Patient API](api/patient-api.md) |
| 👨‍⚕️ Therapist | +32 | [Therapist API](api/therapist-api.md) |
| 👑 Admin | +54 | [Admin API](api/admin-api.md) |

**Total: 161 unique endpoints**

---

## Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (access + refresh tokens)
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary
- **Email**: Resend

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/mindoraRwanda/mindorabeta.git
cd mindorabeta

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Run development server
npm run dev
```

👉 **[Full Setup Guide](development/setup.md)**

---

## Project Structure

```
mindorabeta/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── database/       # Schema & migrations
│   ├── middleware/     # Auth, validation, etc.
│   ├── routes/         # API route definitions
│   ├── services/       # Business logic
│   ├── socket/         # WebSocket handlers
│   ├── utils/          # Utility functions
│   └── validators/     # Request validation
├── tests/              # Test suites
├── docs/               # Documentation (you are here)
└── public/             # Static files
```

---

## License

See [LICENSE](../LICENSE) for details.
