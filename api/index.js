import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRouter from './routes/user.route.js';
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from 'cookie-parser';
import path from 'path';
import { pool } from './db.js';
dotenv.config();

pool
  .query('SELECT 1')
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.log('PostgreSQL connection error:', err));

const __dirname = path.resolve();

const app = express();

const allowedOrigins = [
  'https://homi-estate.onrender.com',
  'https://homiestate.netlify.app',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /\.netlify\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000, () => {
    console.log('server is running on port 3000');
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  // Don't expose raw DB query errors to the client
  const isDbError = !err.statusCode && (err.message?.startsWith('Failed query') || err.cause?.code);
  const message = isDbError ? 'Something went wrong. Please try again.' : (err.message || 'Internal Server Error');
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
