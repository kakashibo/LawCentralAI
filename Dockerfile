# -------------------
# Stage 1: Frontend build (Vite React)
# -------------------
FROM node:20 AS frontend-build

# Set working directory for frontend
WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Use official npm registry
RUN npm config set registry https://registry.npmjs.org/

# Install frontend dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend for production
RUN npm run build

# -------------------
# Stage 2: Backend + static frontend
# -------------------
FROM node:20-slim AS production

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./

# Use official npm registry
RUN npm config set registry https://registry.npmjs.org/

# Install backend dependencies (production only)
RUN npm install --only=production && npm cache clean --force

# Copy backend source code
COPY backend/ ./

# Copy built frontend bundle into a predictable path
# If your frontend dev server expects `dist` in a different place, adjust this path.
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

# Create non-root user for security
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m lawcentral

# Change ownership of the app directory
RUN chown -R lawcentral:nodejs /app

# Switch to non-root user
USER lawcentral

# Expose backend port
EXPOSE 4000

# Container health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:4000/api/health || exit 1

# Start the backend
CMD ["node", "server.js"]
