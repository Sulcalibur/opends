#!/bin/bash

# OpenDS Coolify Deployment Helper
# This script helps prepare OpenDS for Coolify deployment

set -e

echo "🚀 OpenDS Coolify Deployment Helper"
echo "===================================="
echo ""

# Check if .env.example exists
if [ ! -f ".env.example" ]; then
    echo "❌ Error: .env.example not found"
    exit 1
fi

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo "⚠️  IMPORTANT: Edit .env and update these values:"
    echo "   - DATABASE_URL (PostgreSQL connection string)"
    echo "   - JWT_SECRET (run: openssl rand -base64 32)"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🐳 Testing Docker Build (Optional)"
echo "=================================="
echo ""
echo "To test the Docker build locally:"
echo "  docker build -t opends-test ."
echo ""
echo "To test the full stack with Docker Compose:"
echo "  docker-compose up -d"
echo "  docker-compose ps"
echo "  curl http://localhost:3000/api/health"
echo "  docker-compose logs -f opends"
echo "  docker-compose down"
echo ""

echo "📋 Coolify Deployment Checklist:"
echo "================================="
echo ""
echo "1. ⏳ Log in to your Coolify instance"
echo "2. ⏳ Create new Application from GitHub"
echo "3. ⏳ Select repository: Sulcalibur/opends"
echo "4. ⏳ Create PostgreSQL database (or use existing)"
echo "5. ⏳ Configure environment variables (see .env.example)"
echo "6. ⏳ Set build command: pnpm install && pnpm build"
echo "7. ⏳ Set start command: node .output/server/index.mjs"
echo "8. ⏳ Set port: 3000"
echo "9. ⏳ Deploy and monitor logs"
echo ""

echo "🔧 Required Environment Variables:"
echo "==================================="
echo ""
echo "DATABASE_URL=postgresql://user:pass@host:5432/opends"
echo "JWT_SECRET=<generate-with-openssl-rand-base64-32>"
echo "NODE_ENV=production"
echo "ALLOW_REGISTRATION=true"
echo ""
echo "Optional:"
echo "ADMIN_EMAIL=admin@opends.local"
echo "ADMIN_PASSWORD=ChangeMe123!"
echo ""

echo "📚 Documentation:"
echo "================="
echo ""
echo "For detailed Coolify deployment instructions:"
echo "  • docs/COOLIFY.md"
echo "  • https://github.com/Sulcalibur/opends"
echo ""

echo "✨ Ready for Coolify deployment!"
echo ""

# Generate a secure JWT secret suggestion
echo "💡 Generate JWT_SECRET with:"
echo "   openssl rand -base64 32"
echo ""