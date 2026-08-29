import { eq, and, ilike, inArray, asc, desc } from 'drizzle-orm';
import { db } from '../db.js';
import { listings } from '../../shared/schema.js';
import { errorHandler } from '../utils/error.js';
import { withId, withIds } from '../utils/withId.js';

const SEED_PRICE_UPDATES = {
  'The Obsidian Penthouse': [1850000, 1690000, 27750000, 25350000],
  'Lumina Garden Villa': [1250000, 1175000, 18750000, 17625000],
  'Atlas Plaza Residence': [6800, 5900, 102000, 88500],
  'Skyline Loft at CMC': [4200, 3850, 63000, 57750],
  'Riverstone Modern Estate': [2100000, 1995000, 31500000, 29925000],
  'Kazanchis Executive Suite': [5400, 4900, 81000, 73500],
  'Bole Lake Townhome': [980000, 935000, 14700000, 14025000],
  'Entoto Mountain Retreat': [760000, 720000, 11400000, 10800000],
  'Meskel Square Skyhome': [8200, 7600, 123000, 114000],
  'Diplomat Garden Bungalow': [690000, 655000, 10350000, 9825000],
  'Sarbet Studio Loft': [1850, 1700, 27750, 25500],
  'Hilltop Glass Pavilion': [2750000, 2595000, 41250000, 38925000],
};

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

export const updateSeedPrices = async (req, res, next) => {
  try {
    const multiplier = Number(req.body?.multiplier);
    if (multiplier !== 15) {
      return next(errorHandler(400, 'This migration requires a multiplier of 15.'));
    }

    const ownedListings = await db
      .select()
      .from(listings)
      .where(eq(listings.userRef, req.user.id));

    const listingsToUpdate = ownedListings.filter((listing) => {
      const priceUpdate = SEED_PRICE_UPDATES[listing.name];
      return (
        priceUpdate &&
        listing.regularPrice === priceUpdate[0] &&
        listing.discountPrice === priceUpdate[1]
      );
    });

    if (listingsToUpdate.length === 0) {
      return res.status(200).json({
        message: 'Seed prices are already up to date.',
        listings: [],
      });
    }

    const updatedListings = await db.transaction(async (tx) => {
      const results = [];

      for (const listing of listingsToUpdate) {
        const [, , regularPrice, discountPrice] = SEED_PRICE_UPDATES[listing.name];
        const [updatedListing] = await tx
          .update(listings)
          .set({
            regularPrice,
            discountPrice,
            updatedAt: new Date(),
          })
          .where(eq(listings.id, listing.id))
          .returning();

        results.push(withId(updatedListing));
      }

      return results;
    });

    return res.status(200).json({
      message: `Updated ${updatedListings.length} listing prices.`,
      listings: updatedListings,
    });
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
