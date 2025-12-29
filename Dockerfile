# Build stage
FROM node:18-alpine as builder

WORKDIR /app

RUN npm install -g pnpm

# Copy all manifests and workspace configuration first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY simplified/package.json ./simplified/
COPY opends-penpot-plugin/package.json ./opends-penpot-plugin/

# Now, install ALL dependencies for the entire workspace
RUN pnpm install --prod=false

# Copy the rest of the source code
COPY . .

# Build the specific package using a filter
RUN pnpm --filter opends-simplified run build

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/simplified/dist /usr/share/nginx/html

# Create directory for SQLite database and design system data
RUN mkdir -p /app/data /app/design-system-data && \
    chown -R nginx:nginx /app

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
