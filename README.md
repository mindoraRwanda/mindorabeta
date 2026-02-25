# Mindora Beta Backend

Welcome to the Mindora Beta backend repository. Mindora is a mental health platform that connects patients with therapists, providing mood tracking, exercises, community support, and more.

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- [**API Overview**](docs/api/README.md) - Complete API documentation
- [**Architecture**](docs/architecture/README.md) - System architecture & design
- [**Development Setup**](docs/development/setup.md) - Setup & contribution guides
- [**Public API**](docs/api/public-api.md) - Endpoints requiring no authentication

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18 or higher
- **PostgreSQL**: v14 or higher (or a hosted PostgreSQL instance)
- **npm**: v9 or higher

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/mindoraRwanda/mindorabeta.git
    cd mindorabeta
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    Copy `.env.example` to `.env` and update the values:
    ```bash
    cp .env.example .env
    ```
    
    Update `DATABASE_URL` in `.env` with your PostgreSQL connection string:
    ```ini
    DATABASE_URL="postgresql://user:password@localhost:5432/mindora_db"
    ```
    
    Make sure to also set up other required variables like `JWT_SECRET`, `CLOUDINARY_*`, and `RESEND_API_KEY`.

4.  **Database Setup**
    Generate migration files and push schema to the database:
    ```bash
    # Generate migration files
    npm run db:generate
    
    # Run migrations
    npm run db:migrate
    ```

5.  **Run the Server**
    ```bash
    # Development mode (with hot reload)
    npm run dev
    
    # Production build
    npm run build
    npm start
    ```

    The server will start at `http://localhost:5000` by default.

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📖 API Documentation

The API documentation is available via Swagger UI when the server is running:

- **Swagger UI**: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- **OpenAPI JSON**: [http://localhost:5000/api-docs.json](http://localhost:5000/api-docs.json)

See `docs/api/` for detailed Markdown documentation of specific modules.

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT (access + refresh tokens)
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary
- **Email**: Resend
- **Validation**: Zod

## 📝 License

This project is licensed under the ISC License.
