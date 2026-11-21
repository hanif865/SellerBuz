# SellerBuz — Auto Deploy (VPS webhook)

`main` ব্রাঞ্চে push করলে GitHub আপনার VPS-এর একটা endpoint-এ POST পাঠায়;
VPS-এর ছোট্ট listener সিগনেচার যাচাই করে `deploy.sh` চালায় →
`git pull → npm ci → npm run build → publish → nginx reload`।
কোনো GitHub Actions/বিলিং লাগে না।

ফাইলসমূহ:
- `deploy/webhook.js` — Node listener (built-in মডিউল, কোনো dependency নেই)
- `deploy/deploy.sh` — build ও publish স্ক্রিপ্ট
- `deploy/sellerbuz-webhook.service` — systemd service
- `deploy/nginx.conf` — nginx সাইট কনফিগ (রেফারেন্স)

---

## VPS one-time setup

```bash
# Node আছে কিনা
node -v || { curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs; }
apt install -y git rsync nginx

# কোড + স্ক্রিপ্ট
git clone https://github.com/hanif865/SellerBuz.git /var/www/sellerbuz-src
mkdir -p /opt/sellerbuz
cp /var/www/sellerbuz-src/deploy/webhook.js /opt/sellerbuz/
cp /var/www/sellerbuz-src/deploy/deploy.sh /opt/sellerbuz/
chmod +x /opt/sellerbuz/deploy.sh

# secret (GitHub webhook-এর secret-এর সাথে হুবহু মিলতে হবে)
echo "WEBHOOK_SECRET=PASTE_SECRET_HERE" > /opt/sellerbuz/webhook.env
chmod 600 /opt/sellerbuz/webhook.env

# systemd service
cp /var/www/sellerbuz-src/deploy/sellerbuz-webhook.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now sellerbuz-webhook

# firewall (ufw সক্রিয় থাকলে)
ufw allow 9777/tcp || true

# প্রথম deploy ম্যানুয়ালি
bash /opt/sellerbuz/deploy.sh
```

লগ দেখা: `journalctl -u sellerbuz-webhook -f`

---

## GitHub webhook

Repo → **Settings → Webhooks → Add webhook**
- Payload URL: `http://<VPS_IP>:9777/deploy`
- Content type: `application/json`
- Secret: উপরের `WEBHOOK_SECRET`
- Events: Just the `push` event

(অথবা `gh api` দিয়ে স্ক্রিপ্টেড তৈরি — মূল সেটআপ চ্যাটে দেখুন।)

---

## HTTPS + ডোমেইন (ঐচ্ছিক, পরে)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com -d www.your-domain.com
```
