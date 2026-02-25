# Use Node.js 18 LTS based on Alpine Linux for a small image size
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the TypeScript code
RUN npm run build

# --- Production Stage ---
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist
# Copy other necessary files if any (e.g. migrations folder if needed at runtime)
COPY --from=builder /app/src/database/migrations ./src/database/migrations
COPY --from=builder /app/drizzle.config.ts ./

# Expose the application port
EXPOSE 5000

# Start the application
CMD ["node", "dist/server.js"]
