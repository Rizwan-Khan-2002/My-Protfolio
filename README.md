<div align="center">

# 🚀 Rizwan Khan — Developer Portfolio

### A modern, animated, full-stack MERN portfolio with a secure admin panel, Cloudinary media management, and multi-theme support.

[![Live Site](https://img.shields.io/badge/Live-rizwankhan--portfolio.vercel.app-06b6d4?style=for-the-badge&logo=vercel&logoColor=white)](https://rizwankhan-portfolio.vercel.app)
&nbsp;
![MERN](https://img.shields.io/badge/Stack-MERN-8b5cf6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-22d3ee?style=for-the-badge)

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat&logo=greensock&logoColor=white)

</div>

---

## ✨ Features

### 🎨 Frontend
- **Premium animations** — GSAP scroll-triggered reveals, canvas particle field, 3D tilt cards, parallax & micro-interactions
- **4 themes** — Dark, Light, Cyberpunk, Glassmorphism — with **localStorage persistence**
- **Instant project filtering** by category: Beginner · Intermediate · Advanced
- **Fully responsive** with skeleton loaders and lazy-loaded, code-split routes
- **Smart images** — auto-optimized Cloudinary delivery (`f_auto, q_auto`) with graceful fallback for broken/missing images

### 🔐 Admin Panel (owner only)
- **JWT auth + role-based access control** — the admin (first user / `ADMIN_EMAIL`) is the only one who can manage content
- **Resume management** — upload / replace / delete / preview / download a PDF (Cloudinary)
- **Project CRUD** — add / edit / delete / preview with a table view (image, category, status, created & updated dates)
- **Confirmation modals** before any destructive action
- **Form validation** — required title, description, category, image, live link & GitHub link with inline errors

### ⚙️ Backend
- REST API (Express 5) with MongoDB Atlas
- **Server-signed Cloudinary direct uploads** — keeps the API secret server-side *and* bypasses Vercel's ~4.5MB serverless body limit (supports 10MB resumes)
- Cloudinary assets are automatically deleted when a project/resume is removed
- Contact form via Nodemailer

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4, Framer Motion, GSAP, lucide-react |
| Backend | Node.js, Express 5, Mongoose |
| Database | MongoDB Atlas |
| Media | Cloudinary (signed uploads) |
| Auth | JWT + bcrypt |
| Hosting | Vercel (monorepo: client + serverless API) |

---

## 📁 Project Structure

```
My-Protfolio/
├── api/            # Vercel serverless entry → re-exports the Express app
├── client/         # React + Vite front-end
│   └── src/
│       ├── components/   # Navbar, Projects, ProjectModal, ResumeManager, ThemeSwitcher, ...
│       ├── context/      # AuthContext, ThemeContext
│       ├── hooks/        # useScrollReveal
│       ├── pages/        # Home, Dashboard (admin), ProjectDetail, Login, Signup
│       └── utils/        # cloudinary upload helpers
├── server/         # Express API (routes, models, middleware, scripts)
├── vercel.json     # Build + routing config
└── SETUP.md        # Full setup & deployment guide
```

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/Rizwan-Khan-2002/My-Protfolio.git
cd My-Protfolio

# 2. Configure env (see .env.example) — create a .env in the root
#    MONGODB_URI, JWT_SECRET, ADMIN_EMAIL,
#    CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET,
#    EMAIL_USER, EMAIL_PASS

# 3. Run the API
cd server && npm install && npm run dev      # http://localhost:5000

# 4. Run the client (new terminal)
cd client && npm install && npm run dev      # http://localhost:5173
```

> 📖 Full deployment & admin setup instructions are in **[SETUP.md](./SETUP.md)**.

---

## 🔑 Becoming the Admin

Set `ADMIN_EMAIL` to your email — you're auto-promoted to admin on login.
(Alternatively, the first registered user becomes admin, or run `node server/scripts/make-admin.js you@email.com`.)

Only the admin sees the resume manager and project add/edit/delete controls; visitors only see **Download Resume**.

---

## 📬 Contact

**Rizwan Khan** — Full Stack (MERN) Developer
[Portfolio](https://rizwankhan-portfolio.vercel.app) · [GitHub](https://github.com/Rizwan-Khan-2002) · [LinkedIn](https://www.linkedin.com/in/rizwankhan8756)

<div align="center">

⭐ If you like this project, give it a star!

</div>
