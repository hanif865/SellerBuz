# SellerBuz — Auto Deploy (GitHub Actions → VPS)

`main` ব্রাঞ্চে push করলেই GitHub Actions অ্যাপটা build করে `dist/` আপনার VPS-এ
rsync করে দেয়। ওয়ার্কফ্লো: [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)

একবারই নিচের সেটআপ করতে হবে।

---

## 1. VPS: nginx + web root (একবার)

```bash
sudo apt update && sudo apt install -y nginx rsync
sudo mkdir -p /var/www/sellerbuz
sudo chown -R $USER:$USER /var/www/sellerbuz
```

nginx site config (`your-domain.com` বদলান) — `/etc/nginx/sites-available/sellerbuz`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/sellerbuz;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/sellerbuz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

HTTPS (DNS পয়েন্ট করার পর):

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 2. Deploy এর জন্য SSH key (একবার)

CI যেন VPS-এ লগইন করতে পারে, তার জন্য একটা আলাদা keypair:

```bash
# নিজের ল্যাপটপে বা VPS-এ চালান
ssh-keygen -t ed25519 -C "github-actions-sellerbuz" -f ./deploy_key -N ""
```

Public key টা VPS-এর deploy ইউজারে authorize করুন:

```bash
# deploy_key.pub এর কনটেন্ট VPS-এর ~/.ssh/authorized_keys এ যোগ করুন
cat deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Private key (`deploy_key` ফাইলের **পুরো** কনটেন্ট) পরের ধাপে GitHub secret-এ বসবে।
> ⚠️ private key (`deploy_key`) কখনো রিপোতে commit করবেন না।

---

## 3. GitHub Secrets (একবার)

রিপোতে: **Settings → Secrets and variables → Actions → New repository secret**

| Secret name | মান (উদাহরণ) |
|-------------|--------------|
| `VPS_HOST`    | VPS-এর IP বা হোস্টনেম, যেমন `203.0.113.10` |
| `VPS_PORT`    | SSH পোর্ট, সাধারণত `22` |
| `VPS_USER`    | যে ইউজার দিয়ে লগইন, যেমন `deploy` বা `root` |
| `VPS_SSH_KEY` | `deploy_key` ফাইলের পুরো কনটেন্ট (`-----BEGIN ... END-----` সহ) |
| `VPS_TARGET`  | web root, যেমন `/var/www/sellerbuz` |

> `VPS_USER` যদি `root` না হয়, তাহলে ওই ইউজারের `VPS_TARGET` ফোল্ডারে লেখার permission থাকতে হবে
> (ধাপ ১-এ `chown` করা হয়েছে)।

---

## 4. ব্যস — এবার push করলেই deploy

```bash
git add . && git commit -m "deploy" && git push origin main
```

GitHub রিপোর **Actions** ট্যাবে build/deploy লাইভ দেখা যাবে। শেষ হলে সাইট আপডেট।
ম্যানুয়ালি চালাতে চাইলে: Actions → "Build & Deploy to VPS" → **Run workflow**।
