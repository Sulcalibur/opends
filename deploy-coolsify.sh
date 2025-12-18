#!/bin/bash

# OpenDS Coolify Deployment Helper
# This script helps deploy OpenDS to Coolify

set -e

echo "🚀 OpenDS Coolify Deployment Helper"
echo "===================================="

# Check if we have the necessary files
if [ ! -f "deploy/coolify/stack.yml" ]; then
    echo "❌ Error: stack.yml not found in deploy/coolify/"
    exit 1
fi

if [ ! -f "deploy/coolify/.env.production" ]; then
    echo "❌ Error: .env.production not found in deploy/coolify/"
    echo "Creating from template..."
    cp deploy/coolify/.env.example deploy/coolify/.env.production
    echo "✅ Created .env.production from template"
    echo "⚠️  Please edit deploy/coolify/.env.production with your configuration"
fi

echo ""
echo "📋 Deployment Checklist:"
echo "1. ✅ Documentation deployed to Cloudflare Pages"
echo "2. ⏳ Set up Coolify account at https://coolify.io"
echo "3. ⏳ Create new project in Coolify"
echo "4. ⏳ Add stack configuration from deploy/coolify/stack.yml"
echo "5. ⏳ Configure environment variables from deploy/coolify/.env.production"
echo "6. ⏳ Set up custom domains: app.opends.dev and api.opends.dev"
echo "7. ⏳ Configure DNS records"
echo "8. ⏳ Test deployment"
echo ""
echo "📁 Files ready for deployment:"
echo "  • deploy/coolify/stack.yml - Docker Compose stack"
echo "  • deploy/coolify/.env.production - Environment variables"
echo "  • backend/Dockerfile - Backend Docker image"
echo "  • frontend/Dockerfile - Frontend Docker image"
echo ""
echo "🔧 Environment variables to set in Coolify:"
echo ""
cat deploy/coolify/.env.production | grep -v "^#" | grep -v "^$"
echo ""
echo "📚 For detailed instructions, see:"
echo "  • DEPLOYMENT_GUIDE.md"
echo "  • https://cbe5d64a.opends-docs.pages.dev/guides/deployment"
echo ""
echo "🌐 Documentation URL: https://cbe5d64a.opends-docs.pages.dev"
echo ""
echo "🚀 Ready for Coolify deployment!"