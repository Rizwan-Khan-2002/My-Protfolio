# Portfolio — Setup & Deployment Guide

This MERN portfolio (React + Vite client, Express API, MongoDB Atlas, Cloudinary storage)
deploys as a single project on Vercel.

## 1. Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** (and in a local
`.env` at the repo root for local dev). See `.env.example`.

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string used to sign auth tokens |
| `ADMIN_EMAIL` | Your email. This account is auto-promoted to admin on login. |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard → Account Details |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard → Account Details |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard → Account Details |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail + App Password for the contact form |

> The client talks to Cloudinary via a **server-signed direct upload**, so no Cloudinary
> keys are needed on the client and large files bypass Vercel's ~4.5MB body limit.

## 2. Becoming the admin

Pick **one**:

- **Recommended:** set `ADMIN_EMAIL` to your account's email. Log in once → you're admin.
- The **first** user to ever sign up automatically becomes admin.
- Manual promote (run from `server/` with `.env` present):
  ```bash
  node scripts/make-admin.js you@example.com
  ```

Only the admin sees: resume upload/replace/delete, project add/edit/delete, and the
Dashboard/Admin links. Visitors only see the **Download Resume** button.

## 3. Cloudinary (free) — 2 minutes

1. Create a free account at https://cloudinary.com
2. Copy **Cloud name**, **API Key**, **API Secret** from the dashboard.
3. Paste them into the env vars above.

That's it — uploads are signed server-side; you do **not** need an upload preset.

## 4. Local development

```bash
# Terminal 1 — API
cd server && npm install && npm run dev      # http://localhost:5000

# Terminal 2 — client
cd client && npm install && npm run dev      # http://localhost:5173 (proxies /api → 5000)
```

## 5. What changed (feature summary)

- **Filtering fix:** projects now filter correctly by Beginner / Intermediate / Advanced
  (was comparing the wrong field). Filtering is instant.
- **Resume management:** admin can upload / replace / delete / preview / download a PDF
  resume (Cloudinary). The public "Download Resume" button uses the latest upload.
- **Cloudinary images:** project images upload to Cloudinary with preview, format/size
  validation (JPG/PNG/WEBP, ≤5MB), auto-optimization (`f_auto,q_auto`) and a graceful
  fallback when an image is missing/broken (fixes the School ERP blank image).
- **Admin dashboard:** project table with image, category, status (Published/Draft),
  created/updated dates, and Edit / Delete / Preview actions + a confirmation modal.
- **Security:** login returns the user role; `/dashboard` and `/admin` are admin-only;
  project create/update/delete and resume routes require admin (JWT + role check).
- **Validation:** title, description, category, image, live link and GitHub link are all
  required with inline error messages before submit.
- **Themes:** Dark / Light / Cyberpunk / Glassmorphism switcher, persisted to localStorage.
- **Animations:** GSAP scroll reveals, canvas particle field, 3D tilt cards, parallax,
  micro-interactions, skeleton loaders, code-split routes for faster loads.

## 6. Migrating existing project images to Cloudinary

Older projects may have non-Cloudinary image URLs (or broken ones). Open the Dashboard →
Edit the project → re-upload the image. The new Cloudinary URL + `publicId` are saved,
enabling auto-optimization and clean deletion.
