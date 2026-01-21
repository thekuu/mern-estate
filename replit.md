# HomiEstate - Real Estate Application

## Overview
A MERN stack real estate application that allows users to browse, search, and list properties. Features user authentication via Firebase/Google OAuth and MongoDB for data storage.

## Project Structure
```
├── api/                    # Express.js backend
│   ├── controllers/        # Route handlers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   └── utils/             # Utilities (auth, error handling)
├── client/                # React frontend (Vite)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── redux/         # Redux state management
│   └── public/            # Static assets
└── package.json           # Root package.json
```

## Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Redux Toolkit
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: Firebase (Google OAuth), JWT

## Required Environment Variables

### Backend (secrets)
- `MONGO` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing

### Frontend (secrets)
- `VITE_FIREBASE_API_KEY` - Firebase API key for Google OAuth

## Running Locally
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 3000 (Express)

## Deployment
- Build: `npm run build` (builds both frontend and backend)
- Start: `npm start` (runs the production server)
