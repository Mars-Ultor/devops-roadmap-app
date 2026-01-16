# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV PORT=8080
ENV HOST=0.0.0.0

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client, build the application, and remove dev dependencies
RUN npm run prisma:generate && npm run build && npm prune --omit=dev

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]