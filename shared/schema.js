import { pgTable, varchar, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  username: varchar('username').notNull().unique(),
  email: varchar('email').notNull().unique(),
  password: varchar('password').notNull(),
  avatar: text('avatar').default('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const listings = pgTable('listings', {
  id: varchar('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  address: text('address').notNull(),
  regularPrice: integer('regular_price').notNull(),
  discountPrice: integer('discount_price').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  bedrooms: integer('bedrooms').notNull(),
  furnished: boolean('furnished').notNull(),
  parking: boolean('parking').notNull(),
  type: varchar('type').notNull(),
  offer: boolean('offer').notNull(),
  imageUrls: jsonb('image_urls').notNull(),
  userRef: varchar('user_ref').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
