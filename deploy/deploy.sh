#!/usr/bin/env bash
# SellerBuz — build & publish (run by the webhook listener, or manually)
set -euo pipefail

SRC="${DEPLOY_SRC:-/var/www/sellerbuz-src}"   # git checkout
WEB="${DEPLOY_WEB:-/var/www/sellerbuz}"       # nginx web root
BRANCH="${DEPLOY_BRANCH:-main}"

cd "$SRC"
echo "==> Fetching latest ($BRANCH)"
git fetch --all --prune
git reset --hard "origin/$BRANCH"

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

echo "==> Publishing to $WEB"
mkdir -p "$WEB"
rsync -a --delete dist/ "$WEB/"

echo "==> Reloading nginx"
nginx -t && systemctl reload nginx

echo "✅ Deployed at $(date -u +%FT%TZ)"
