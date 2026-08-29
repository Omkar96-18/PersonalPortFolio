# 🚀 devil37 — Cybernetic Portfolio & Control Matrix

A full-stack portfolio platform: **React 19 + Vite** frontend on GitHub Pages and a **Django REST Framework** backend on Render. Featuring a live Admin Control Center, deep-space visuals, smooth animations, SEO management, and PDF resume delivery.

---

## 📑 Table of Contents

1. [Project Architecture](#-project-architecture)
2. [API Endpoint Map](#-api-endpoint-map)
3. [Admin Dashboard Access](#-admin-dashboard-access)
4. [Local Development Setup](#-local-development-setup)
5. [Deploying the Backend to Render](#-deploying-the-backend-to-render)
6. [Deploying the Frontend to GitHub Pages](#-deploying-the-frontend-to-github-pages)
7. [How to Change / Link URLs](#-how-to-change--link-urls)
8. [Deployment Tips, Do's & Don'ts](#-deployment-tips-dos--donts)
9. [Troubleshooting Common Issues](#-troubleshooting-common-issues)

---

## 🏛 Project Architecture

```
personalWebsite/
├── backend/                      ← Django REST Framework API
│   ├── main/
│   │   ├── app/                  ← Models, Views, Serializers, Migrations
│   │   ├── settings.py           ← CORS, Database, Media, Email Config
│   │   └── urls.py               ← All API routes registered here
│   ├── media/                    ← Uploaded files (resume PDFs, favicons)
│   ├── build.sh                  ← Render build script
│   ├── requirements.txt          ← Python dependencies
│   └── .env.example              ← Environment variable template
│
├── frontend/                     ← Vite + React 19 SPA
│   ├── public/
│   │   ├── 404.html              ← GitHub Pages SPA redirect fix
│   │   └── favicon.svg           ← Custom "37" branded favicon
│   ├── src/
│   │   ├── services/api.js       ← All API calls + base URL config
│   │   ├── pages/AdminLogin.jsx  ← Admin login page
│   │   ├── pages/AdminDashboard.jsx ← Full CMS control panel
│   │   └── App.jsx               ← React Router with basename
│   ├── vite.config.js            ← Base path: /PersonalPortFolio/
│   └── .env.example              ← Frontend env template
│
└── README.md                     ← This file
```

---

## 🔌 API Endpoint Map

| Endpoint | Method(s) | Description | Auth |
|---|---|---|---|
| `/api/profiles/` | GET, PUT, POST | Bio, SEO data, resume URL, favicon | Read-free / Admin write |
| `/api/skills/` | GET, POST, PUT, DELETE | Skills with % and category | Read-free / Admin write |
| `/api/projects/` | GET, POST, PUT, DELETE | Featured projects with stack | Read-free / Admin write |
| `/api/blogs/` | GET, POST, PUT, DELETE | Tech blog articles (Markdown) | Read-free / Admin write |
| `/api/experiences/` | GET, POST, PUT, DELETE | Career history entries | Read-free / Admin write |
| `/api/terminal-commands/` | GET, POST, PUT, DELETE | Interactive terminal simulation | Read-free / Admin write |
| `/api/contact/` | POST | Public contact form → SMTP email | Public |
| `/api/messages/` | GET, DELETE | Visitor inbox | Admin |
| `/api/upload-resume/` | POST | Upload resume PDF (multipart) | Admin |
| `/api/upload-favicon/` | POST | Upload site favicon (multipart) | Admin |
| `/api/resume/download/` | GET | Binary PDF download (attachment) | Public |
| `/api/resume/view/` | GET | Inline PDF view in browser | Public |
| `/api/token-auth/` | POST | Login → returns auth token | Public |
| `/api/me/` | GET | Validate current auth token | Authenticated |

---

## 🛡 Admin Dashboard Access

4 ways to reach the Admin Control Center:

| Method | How |
|---|---|
| **Direct URL** | Go to `/admin/login` or `/admin/dashboard` |
| **Keyboard Shortcut** | Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac) |
| **Footer** | Click the ⚙️ Settings icon in the bottom-right footer |
| **Mobile Menu** | Open hamburger menu → tap **Admin Portal** |

> **Create credentials:** run `python manage.py createsuperuser` in the backend directory.

---

## 💻 Local Development Setup

### 1. Backend (Django)

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate it
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template and fill in values
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux

# Run migrations
python manage.py migrate

# Create your admin account
python manage.py createsuperuser

# (Optional) Seed sample data
python seed_data.py

# Start the dev server
python manage.py runserver
```

Backend is now live at: `http://127.0.0.1:8000/api/`

---

### 2. Frontend (Vite + React)

```bash
cd frontend

# Install Node dependencies
npm install

# Copy environment template
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux

# Edit .env and set VITE_API_BASE_URL=http://127.0.0.1:8000/api

# Start Vite dev server
npm run dev
```

Frontend is at: `http://localhost:5173/PersonalPortFolio/`

---

## ☁️ Deploying the Backend to Render

### Step-by-Step

**1. Create a free Render account** at [render.com](https://render.com)

**2. Connect your GitHub repository**
- Go to **New → Web Service**
- Connect your GitHub repo (`personalWebsite`)
- Set **Root Directory**: `backend`

**3. Configure the service:**

| Field | Value |
|---|---|
| **Name** | `personalportfolio-api` (or your choice) |
| **Runtime** | Python 3 |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn main.wsgi:application` |
| **Instance Type** | Free (or Starter) |

**4. Set Environment Variables** in Render Dashboard → Your Service → Environment:

| Variable | Value |
|---|---|
| `DEBUG` | `False` |
| `SECRET_KEY` | A long random string (e.g. from [djecrety.ir](https://djecrety.ir)) |
| `ALLOWED_HOSTS` | `*` |
| `CORS_ALLOWED_ORIGINS` | `https://Omkar96-18.github.io,http://localhost:5173` |
| `DATABASE_URL` | Your PostgreSQL URI (Supabase / Render Postgres / Neon) |
| `EMAIL_ADDRESS` | Your Gmail address |
| `EMAIL_PASS` | Your [Google App Password](https://myaccount.google.com/apppasswords) |
| `RENDER` | `true` |
| `RENDER_EXTERNAL_HOSTNAME` | `personalportfolio-1u0r.onrender.com` (Render sets this automatically) |

> **Get a PostgreSQL URL:** Go to Render Dashboard → New → PostgreSQL. Copy the **External Database URL** and paste it as `DATABASE_URL`.

**5. Deploy!** — Render will run `build.sh`, migrate the database, and start Gunicorn.

**6. Note your backend URL** — it will look like:
```
https://personalportfolio-1u0r.onrender.com
```

---

## 📄 Deploying the Frontend to GitHub Pages

### Step-by-Step

**1. Verify your base URL** in `frontend/vite.config.js`:
```js
export default defineConfig({
  plugins: [react()],
  base: '/PersonalPortFolio/',  // Must match your exact repo name (case-sensitive!)
});
```

**2. Set your backend API URL** in `frontend/.env` (create if not present):
```env
VITE_API_BASE_URL=https://personalportfolio-1u0r.onrender.com/api
```

**3. Build the production bundle:**
```bash
cd frontend
npm run build
```
Output goes to `frontend/dist/`

**4. Deploy to GitHub Pages using `gh-pages`:**

Install the deployment tool:
```bash
npm install --save-dev gh-pages
```

Add this to `frontend/package.json` under `"scripts"`:
```json
"deploy": "gh-pages -d dist"
```

Then run:
```bash
npm run deploy
```

This pushes `dist/` to the `gh-pages` branch of your repository.

**5. Enable GitHub Pages:**
- Go to your repo on GitHub → **Settings → Pages**
- Set **Source** to `gh-pages` branch, root `/`
- Your site will be live at: `https://Omkar96-18.github.io/PersonalPortFolio/`

> **Important:** The `public/404.html` file is already included to fix direct navigation to routes like `/admin/dashboard`. It redirects through the SPA so React Router handles the URL correctly.

---

### Alternative: Deploy via GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install and Build
        working-directory: frontend
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        run: |
          npm install
          npm run build

      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: frontend/dist
```

Add the secret in GitHub → Repo Settings → Secrets → Actions:
- `VITE_API_BASE_URL` = `https://personalportfolio-1u0r.onrender.com/api`

---

## 🔗 How to Change / Link URLs

### Change the Backend API URL (frontend side)

**Option A — `.env` file (recommended):**
```env
# frontend/.env
VITE_API_BASE_URL=https://your-new-backend.onrender.com/api
```

**Option B — Direct code edit:**
Open [`frontend/src/services/api.js`](frontend/src/services/api.js) and update:
```js
const DEFAULT_DEV_URL = "http://127.0.0.1:8000/api";     // local
const DEFAULT_PROD_URL = "https://your-new-backend.onrender.com/api"; // production
```

### Change the Frontend Base Path (if renaming repo)

Update `frontend/vite.config.js`:
```js
base: '/YourNewRepoName/',
```

Also update the `404.html` `segmentCount` if your repo depth changes.

### Change the GitHub Pages Domain (custom domain)

1. Add a `CNAME` file in `frontend/public/` containing your domain:
   ```
   yourdomain.com
   ```
2. Set `base: '/'` in `vite.config.js` (no sub-path needed).
3. Update `CORS_ALLOWED_ORIGINS` in the backend to include `https://yourdomain.com`.

---

## 🎯 Deployment Tips, Do's & Don'ts

### ✅ DO

- **Use HTTPS everywhere** — mix of HTTP/HTTPS triggers browser mixed-content blocking. Render and GitHub Pages both provide HTTPS automatically.
- **Add `https://Omkar96-18.github.io` to `CORS_ALLOWED_ORIGINS`** in Render environment variables.
- **Use PostgreSQL** for production (Render Postgres / Supabase) — SQLite data is wiped on every Render deployment restart.
- **Use Google App Passwords** for SMTP — regular Gmail passwords won't work with 2FA enabled.
- **Rebuild and redeploy frontend** after any change to `VITE_API_BASE_URL`.
- **Run `python manage.py createsuperuser`** via Render's Shell tab after first deploy to create admin credentials.

### ❌ DON'T

- **Never commit `.env`** to git. It contains secrets. Add it to `.gitignore`.
- **Never leave `DEBUG=True` in production** — it exposes stack traces, settings, and DB info to the public internet.
- **Don't use `localhost` URLs** in environment variables deployed to production. Use the actual deployed URL.
- **Don't skip the `migrate` step** in `build.sh` — without it, the database tables won't exist and all API calls will 500.
- **Don't forget the trailing slash** in Django endpoint paths: `/api/blogs/` not `/api/blogs`.
- **Don't set `base: '/'`** in `vite.config.js` when deploying to a GitHub Pages sub-path like `/PersonalPortFolio/` — assets won't load.

---

## 🔧 Troubleshooting Common Issues

| Issue | Cause | Fix |
|---|---|---|
| **Admin dashboard shows 404 on direct open/refresh** | GitHub Pages doesn't support SPA routing natively | Already fixed with `public/404.html` redirect + `index.html` receiver script |
| **"CORS policy blocked" error in browser console** | Frontend domain not allowed by backend | Add your GitHub Pages URL to `CORS_ALLOWED_ORIGINS` in Render environment variables |
| **Login returns "Invalid username or password"** | Superuser not created or wrong database | Run `python manage.py createsuperuser` via Render's Shell tab |
| **API calls returning 404** | Wrong `VITE_API_BASE_URL` (missing `/api`, double slash, trailing slash) | Set exactly: `https://domain.com/api` — no trailing slash |
| **Data lost after Render restart** | Using SQLite on Render (ephemeral filesystem) | Provide a `DATABASE_URL` pointing to PostgreSQL |
| **Resume won't download** | Browser blocking cross-origin blob fetch | Already fixed — uses server-side `/api/resume/download/` endpoint |
| **Static files 404 after deploy** | `collectstatic` not run or `STATIC_ROOT` misconfigured | `build.sh` runs `collectstatic`; ensure WhiteNoise is in `MIDDLEWARE` above `CommonMiddleware` |
| **Favicon not updating** | Browser cache | Hard refresh with `Ctrl + Shift + R`, or clear cache |
| **Render build failing** | Missing env var, bad `requirements.txt`, or Python version mismatch | Check Render logs; ensure `requirements.txt` is complete and Python 3.11+ is used |
