#!/bin/bash
# scripts/verify-deployment.sh

set -e

echo "🔍 Verifying OpenDS Deployment..."

# Check environment
echo "Checking environment variables..."
required_vars=("DATABASE_URL" "NUXT_SESSION_PASSWORD")
missing_vars=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing_vars+=("$var")
  fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
  echo "❌ Missing required environment variables:"
  for var in "${missing_vars[@]}"; do
    echo "  - $var"
  done
  exit 1
fi
echo "✅ Environment variables set"

# Test database connection
echo "Testing database connection..."
if command -v pg-isready &> /dev/null; then
  if pg-isready -d "$DATABASE_URL" > /dev/null 2>&1; then
    echo "✅ Database connection successful"
  else
    echo "❌ Database connection failed"
    exit 1
  fi
else
  echo "⚠️  pg-isready not found, skipping database connection test"
fi

# Check docker-compose.yml exists
echo "Checking docker-compose.yml..."
if [ ! -f "docker-compose.yml" ]; then
  echo "❌ docker-compose.yml not found"
  exit 1
fi
echo "✅ docker-compose.yml found"

# Start application
echo "Starting application with docker-compose..."
docker-compose up -d

# Wait for startup
echo "Waiting for application to start..."
sleep 10

# Health check
echo "Performing health check..."
max_attempts=5
attempt=1

while [ $attempt -le $max_attempts ]; do
  if curl -f -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ Application is healthy"
    break
  else
    if [ $attempt -eq $max_attempts ]; then
      echo "❌ Health check failed after $max_attempts attempts"
      echo "Application logs:"
      docker-compose logs --tail=50 opends
      exit 1
    fi
    echo "⚠️  Health check attempt $attempt/$max_attempts failed, retrying..."
    sleep 5
    attempt=$((attempt + 1))
  fi
done

echo "✅ Deployment verification complete!"
