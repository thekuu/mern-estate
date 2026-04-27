# HomiEstate - Real Estate Application

## Overview
A MERN-style real estate application (now Postgres-backed) that allows users to browse, search, and list properties. Branded as "Homi Portfolio" — a portfolio piece showcasing full-stack development, Redux, JWT auth, and modern architecture.

## Project Structure
```
├── api/                    # Express.js backend
│   ├── controllers/        # Route handlers (Drizzle ORM)
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (auth, error handling, withId)
│   ├── db.js               # Postgres connection (Drizzle + node-postgres)
│   └── index.js            # Express server entry
├── shared/
│   └── schema.js           # Drizzle schema (users, listings)
├── scripts/
│   └── seed.js             # Seed test user + premium listings
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── redux/
│   └── public/
├── drizzle.config.js
└── package.json
```

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Redux Toolkit
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (via Drizzle ORM, node-postgres). Hosted on Neon by default.
- **Authentication**: Firebase (Google OAuth) on the client, JWT (HTTP-only cookie) on the server, bcryptjs for password hashing.

## Database Schema (Drizzle, `shared/schema.js`)
- `users`: `id (uuid)`, `username`, `email`, `password`, `avatar`, `createdAt`, `updatedAt`
- `listings`: `id (uuid)`, `name`, `description`, `address`, `regularPrice`, `discountPrice`, `bathrooms`, `bedrooms`, `furnished`, `parking`, `type`, `offer`, `imageUrls (jsonb)`, `userRef`, `createdAt`, `updatedAt`

API responses include both `id` and `_id` (alias) so the existing frontend code continues to work without changes.

## Required Environment Variables

### Backend (secrets)
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Secret key for JWT token signing

### Frontend (secrets)
- `VITE_FIREBASE_API_KEY` — Firebase API key for Google OAuth

> The legacy `MONGO` secret is no longer used.

## Running Locally
- Frontend: port 5000 (Vite dev server)
- Backend: port 3000 (Express)
- Workflows: `Backend Server` (`npm run dev`) and `Development Server` (`cd client && npm run dev`)

## Database Commands
- `npm run db:push` — Sync Drizzle schema to the Postgres database
- `node scripts/seed.js` — Seed/refresh the test user and 12 premium listings

## Test User
- Email: `test@test.com`
- Password: `password123`

## Deployment
- Build: `npm run build` (installs deps and builds the client)
- Start: `npm start`
- For Render: ensure `DATABASE_URL` and `JWT_SECRET` are set in the Render dashboard, then redeploy.
