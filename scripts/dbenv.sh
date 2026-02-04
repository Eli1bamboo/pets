#!/bin/bash

# Configuration
PROD_ID="onbnlgcmbvabidwcnqsh"
DEV_ID="REEMPLAZAR_CON_TU_NUEVO_ID_DE_DEV"

ENV=$1

if [ "$ENV" == "prod" ]; then
    echo "🚀 Switching to PRODUCTION ($PROD_ID)..."
    npx supabase link --project-ref $PROD_ID
elif [ "$ENV" == "dev" ]; then
    if [ "$DEV_ID" == "REEMPLAZAR_CON_TU_NUEVO_ID_DE_DEV" ]; then
        echo "❌ Error: Please update DEV_ID in scripts/dbenv.sh with your new project reference ID."
        exit 1
    fi
    echo "🛠️ Switching to DEVELOPMENT ($DEV_ID)..."
    npx supabase link --project-ref $DEV_ID
else
    echo "❓ Usage: npm run dbenv [prod|dev]"
    exit 1
fi
