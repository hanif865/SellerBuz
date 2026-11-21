#!/usr/bin/env bash
# SellerBuz — VPS আপডেট/রি-ডেপলয় স্ক্রিপ্ট
# ব্যবহার: bash deploy/update.sh
set -euo pipefail

APP_DIR="/var/www/sellerbuz-src"   # যেখানে git clone করা আছে
WEB_ROOT="/var/www/sellerbuz"      # nginx যেখান থেকে সার্ভ করে

cd "$APP_DIR"
echo "==> Pulling latest code"
git pull

echo "==> Installing deps"
npm ci

echo "==> Building"
npm run build

echo "==> Publishing to $WEB_ROOT"
sudo mkdir -p "$WEB_ROOT"
sudo rsync -a --delete dist/ "$WEB_ROOT/"

echo "==> Done. Reloading nginx"
sudo nginx -t && sudo systemctl reload nginx
echo "✅ Deployed."
