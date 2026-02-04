#!/bin/bash

# Configuration
ENV=$1

if [ "$ENV" == "prod" ]; then
    if [ ! -f ".env.prod" ]; then
        echo "❌ .env.prod not found."
        exit 1
    fi
    # Source the file to get variables
    source .env.prod
    
    # Extract project ref from URL if not explicitly provided as SUPABASE_PROJECT_ID
    # URL format: https://[PROJECT_ID].supabase.co
    PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed -E 's/https:\/\/([^.]+)\.supabase\.co/\1/')

    echo "🚀 Switching to PRODUCTION ($PROJECT_ID)..."
    npx supabase link --project-ref $PROJECT_ID
    cp .env.prod .env.local
    echo "✅ .env.local updated with PRODUCTION keys."

elif [ "$ENV" == "dev" ]; then
    if [ ! -f ".env.dev" ]; then
        echo "❌ .env.dev not found."
        exit 1
    fi
    source .env.dev
    
    PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed -E 's/https:\/\/([^.]+)\.supabase\.co/\1/')

    echo "🛠️ Switching to DEVELOPMENT ($PROJECT_ID)..."
    npx supabase link --project-ref $PROJECT_ID
    cp .env.dev .env.local
    echo "✅ .env.local updated with DEVELOPMENT keys."
else
    echo "❓ Usage: npm run dbenv [prod|dev]"
    exit 1
fi
