#!/bin/bash

# Configuration
PROD_ID="onbnlgcmbvabidwcnqsh"
DEV_ID="dbuschibakqzequzfynl"

ENV=$1

if [ "$ENV" == "prod" ]; then
    echo "🚀 Switching to PRODUCTION ($PROD_ID)..."
    npx supabase link --project-ref $PROD_ID
    if [ -f ".env.prod" ]; then
        cp .env.prod .env.local
        echo "✅ .env.local updated with PRODUCTION keys."
    else
        echo "⚠️ .env.prod not found. Skipping .env.local update."
    fi
elif [ "$ENV" == "dev" ]; then
    echo "🛠️ Switching to DEVELOPMENT ($DEV_ID)..."
    npx supabase link --project-ref $DEV_ID
    if [ -f ".env.dev" ]; then
        cp .env.dev .env.local
        echo "✅ .env.local updated with DEVELOPMENT keys."
    else
        echo "⚠️ .env.dev not found. Skipping .env.local update."
    fi
else
    echo "❓ Usage: npm run dbenv [prod|dev]"
    exit 1
fi
