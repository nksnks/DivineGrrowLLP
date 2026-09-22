#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

: "${SUPABASE_ACCESS_TOKEN:?Set SUPABASE_ACCESS_TOKEN before running this script}"
: "${SUPABASE_PROJECT_REF:?Set SUPABASE_PROJECT_REF before running this script}"
: "${SUPABASE_DB_PASSWORD:?Set SUPABASE_DB_PASSWORD before running this script}"

SUPABASE_CLI="npx --yes supabase@latest"

echo "Linking Supabase project ${SUPABASE_PROJECT_REF}..."
$SUPABASE_CLI link \
  --project-ref "$SUPABASE_PROJECT_REF" \
  --password "$SUPABASE_DB_PASSWORD"

echo "Applying pending database migrations..."
$SUPABASE_CLI db push --linked --yes

echo "Supabase database is up to date."
