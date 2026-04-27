import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../db.js';
import { users, listings } from '../../shared/schema.js';
import { errorHandler } from '../utils/error.js';
import { withId, withIds } from '../utils/withId.js';

export const test = (req, res) => {
  res.json({ message: 'Api is working!' });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your account!'));
  try {
    const updates = {};
    if (req.body.username !== undefined) updates.username = req.body.username;
    if (req.body.email !== undefined) updates.email = req.body.email;
    if (req.body.avatar !== undefined) updates.avatar = req.body.avatar;
    if (req.body.password) {
      updates.password = bcryptjs.hashSync(req.body.password, 10);
    }
    updates.updatedAt = new Date();

    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, req.params.id))
      .returning();

    if (!updatedUser) return next(errorHandler(404, 'User not found!'));
    const { password, ...rest } = updatedUser;
    res.status(200).json(withId(rest));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await db.delete(users).where(eq(users.id, req.params.id));
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const userListings = await db
        .select()
        .from(listings)
        .where(eq(listings.userRef, req.params.id));
      res.status(200).json(withIds(userListings));
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, req.params.id));
    if (!user) return next(errorHandler(404, 'User not found!'));
    const { password: pass, ...rest } = user;
    res.status(200).json(withId(rest));
  } catch (error) {
    next(error);
  }
};
