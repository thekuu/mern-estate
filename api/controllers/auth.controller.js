import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { users } from '../../shared/schema.js';
import { errorHandler } from '../utils/error.js';
import { withId } from '../utils/withId.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    await db.insert(users).values({ username, email, password: hashedPassword });
    res.status(201).json("User created successfully");
  } catch (error) {
    // PostgreSQL unique constraint violation code is 23505
    const cause = error?.cause ?? error;
    if (cause?.code === '23505') {
      const detail = cause?.detail ?? '';
      if (detail.includes('username')) return next(errorHandler(409, 'Username is already taken.'));
      if (detail.includes('email')) return next(errorHandler(409, 'An account with this email already exists.'));
      return next(errorHandler(409, 'Username or email is already taken.'));
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const [validUser] = await db.select().from(users).where(eq(users.email, email));
    if (!validUser) return next(errorHandler(404, 'user not found!'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!'));
    const token = jwt.sign({ id: validUser.id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(withId(rest));
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, req.body.email));
    if (user) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(withId(rest));
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const [newUser] = await db
        .insert(users)
        .values({
          username:
            req.body.name.split(" ").join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          password: hashedPassword,
          avatar: req.body.photo,
        })
        .returning();
      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(withId(rest));
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out');
  } catch (error) {
    next(error);
  }
};
