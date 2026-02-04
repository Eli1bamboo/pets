#!/bin/bash

# Configuration
PROD_ID="onbnlgcmbvabidwcnqsh"
DEV_ID="dbuschibakqzequzfynl"

ENV=$1

if [ "$ENV" == "prod" ]; then
    echo "🚀 Switching to PRODUCTION ($PROD_ID)..."
    npx supabase link --project-ref $PROD_ID
elif [ "$ENV" == "dev" ]; then
    echo "🛠️ Switching to DEVELOPMENT ($DEV_ID)..."
    npx supabase link --project-ref $DEV_ID
else
    echo "❓ Usage: npm run dbenv [prod|dev]"
    exit 1
fi
