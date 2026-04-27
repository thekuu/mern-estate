import { eq, and, ilike, inArray, asc, desc } from 'drizzle-orm';
import { db } from '../db.js';
import { listings } from '../../shared/schema.js';
import { errorHandler } from '../utils/error.js';
import { withId, withIds } from '../utils/withId.js';

export const createListing = async (req, res, next) => {
  try {
    const [listing] = await db.insert(listings).values(req.body).returning();
    return res.status(201).json(withId(listing));
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const [listing] = await db.select().from(listings).where(eq(listings.id, req.params.id));
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only delete your own listings!'));
    }
    await db.delete(listings).where(eq(listings.id, req.params.id));
    return res.status(200).json({ message: 'Listing deleted successfully!' });
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const [listing] = await db.select().from(listings).where(eq(listings.id, req.params.id));
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
    const updates = { ...req.body, updatedAt: new Date() };
    delete updates.id;
    delete updates._id;
    delete updates.createdAt;

    const [updatedListing] = await db
      .update(listings)
      .set(updates)
      .where(eq(listings.id, req.params.id))
      .returning();
    res.status(200).json(withId(updatedListing));
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const [listing] = await db.select().from(listings).where(eq(listings.id, req.params.id));
    if (!listing) {
      return next(errorHandler(404, 'Listing not found'));
    }
    res.status(200).json(withId(listing));
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = (req.query.order || 'desc').toLowerCase();

    const filters = [ilike(listings.name, `%${searchTerm}%`)];

    const offerParam = req.query.offer;
    if (offerParam !== undefined && offerParam !== 'false') {
      filters.push(eq(listings.offer, true));
    }

    const furnishedParam = req.query.furnished;
    if (furnishedParam !== undefined && furnishedParam !== 'false') {
      filters.push(eq(listings.furnished, true));
    }

    const parkingParam = req.query.parking;
    if (parkingParam !== undefined && parkingParam !== 'false') {
      filters.push(eq(listings.parking, true));
    }

    const typeParam = req.query.type;
    if (typeParam !== undefined && typeParam !== 'all') {
      filters.push(eq(listings.type, typeParam));
    } else {
      filters.push(inArray(listings.type, ['sale', 'rent']));
    }

    const sortColumn = listings[sort] || listings.createdAt;
    const orderFn = order === 'asc' ? asc : desc;

    const result = await db
      .select()
      .from(listings)
      .where(and(...filters))
      .orderBy(orderFn(sortColumn))
      .limit(limit)
      .offset(startIndex);

    return res.status(200).json(withIds(result));
  } catch (error) {
    next(error);
  }
};
