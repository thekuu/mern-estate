import 'dotenv/config';
import bcryptjs from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db, pool } from '../api/db.js';
import { users, listings } from '../shared/schema.js';

const PIXABAY_AVATAR =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

async function seed() {
  console.log('Seeding test user...');
  const hashedPassword = bcryptjs.hashSync('password123', 10);

  let [testUser] = await db.select().from(users).where(eq(users.email, 'test@test.com'));
  if (!testUser) {
    [testUser] = await db
      .insert(users)
      .values({
        username: 'test',
        email: 'test@test.com',
        password: hashedPassword,
        avatar: PIXABAY_AVATAR,
      })
      .returning();
    console.log('Created test user:', testUser.id);
  } else {
    [testUser] = await db
      .update(users)
      .set({ password: hashedPassword, avatar: PIXABAY_AVATAR })
      .where(eq(users.id, testUser.id))
      .returning();
    console.log('Updated test user:', testUser.id);
  }

  const userRef = testUser.id;

  console.log('Clearing existing listings for test user...');
  await db.delete(listings).where(eq(listings.userRef, userRef));

  const premiumListings = [
    {
      name: 'The Obsidian Penthouse',
      description:
        'A statement penthouse perched above the city skyline with floor-to-ceiling glass, a private rooftop terrace, and curated Italian finishes throughout.',
      address: 'Bole Atlas Avenue, Addis Ababa, Ethiopia',
      regularPrice: 1850000,
      discountPrice: 1690000,
      bathrooms: 4,
      bedrooms: 4,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600',
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600',
      ],
    },
    {
      name: 'Lumina Garden Villa',
      description:
        'Tranquil villa wrapped in landscaped gardens, featuring a heated pool, private cinema, and chef-grade open kitchen designed for entertaining.',
      address: 'Old Airport Road, Addis Ababa, Ethiopia',
      regularPrice: 1250000,
      discountPrice: 1175000,
      bathrooms: 5,
      bedrooms: 6,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600',
      ],
    },
    {
      name: 'Atlas Plaza Residence',
      description:
        'Sophisticated downtown residence overlooking Atlas Plaza, with concierge services, on-site spa, and panoramic city views from every room.',
      address: 'Atlas Square, Bole, Addis Ababa, Ethiopia',
      regularPrice: 6800,
      discountPrice: 5900,
      bathrooms: 3,
      bedrooms: 3,
      furnished: true,
      parking: true,
      type: 'rent',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1600',
      ],
    },
    {
      name: 'Skyline Loft at CMC',
      description:
        'A bright industrial loft with double-height ceilings, exposed beams, and a private terrace overlooking the Entoto hills.',
      address: 'CMC Michael, Addis Ababa, Ethiopia',
      regularPrice: 4200,
      discountPrice: 3850,
      bathrooms: 2,
      bedrooms: 2,
      furnished: true,
      parking: true,
      type: 'rent',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1600',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1600',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1600',
      ],
    },
    {
      name: 'Riverstone Modern Estate',
      description:
        'A modern estate carved into the hillside, with cantilevered terraces, infinity pool, and spa-style bathrooms finished in travertine.',
      address: 'Sululta Hills, Addis Ababa, Ethiopia',
      regularPrice: 2100000,
      discountPrice: 1995000,
      bathrooms: 6,
      bedrooms: 5,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1600',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1600',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=1600',
      ],
    },
    {
      name: 'Kazanchis Executive Suite',
      description:
        'Polished executive suite in the diplomatic quarter, finished with walnut joinery, Smart-home automation, and a curated art collection.',
      address: 'Kazanchis, Addis Ababa, Ethiopia',
      regularPrice: 5400,
      discountPrice: 4900,
      bathrooms: 2,
      bedrooms: 2,
      furnished: true,
      parking: true,
      type: 'rent',
      offer: false,
      imageUrls: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1600',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1600',
      ],
    },
    {
      name: 'Bole Lake Townhome',
      description:
        'A four-story townhome along the lake promenade, complete with rooftop garden, private elevator, and quiet study overlooking the water.',
      address: 'Bole Lake District, Addis Ababa, Ethiopia',
      regularPrice: 980000,
      discountPrice: 935000,
      bathrooms: 4,
      bedrooms: 4,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1600',
        'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=1600',
        'https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1600',
      ],
    },
    {
      name: 'Entoto Mountain Retreat',
      description:
        'An alpine-style retreat surrounded by eucalyptus forest, with stone fireplaces, vaulted timber ceilings, and a sun-drenched yoga studio.',
      address: 'Entoto Park Ridge, Addis Ababa, Ethiopia',
      regularPrice: 760000,
      discountPrice: 720000,
      bathrooms: 3,
      bedrooms: 4,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: false,
      imageUrls: [
        'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1600',
        'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=1600',
      ],
    },
    {
      name: 'Meskel Square Skyhome',
      description:
        'A bold corner skyhome with wraparound terrace, private gym, and curated views of Meskel Square at sunset.',
      address: 'Meskel Square, Addis Ababa, Ethiopia',
      regularPrice: 8200,
      discountPrice: 7600,
      bathrooms: 3,
      bedrooms: 3,
      furnished: true,
      parking: true,
      type: 'rent',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1600',
      ],
    },
    {
      name: 'Diplomat Garden Bungalow',
      description:
        'A serene single-level bungalow tucked behind manicured hedges, featuring a koi pond, library lounge, and private wine room.',
      address: 'Old Airport Diplomatic Zone, Addis Ababa, Ethiopia',
      regularPrice: 690000,
      discountPrice: 655000,
      bathrooms: 3,
      bedrooms: 4,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1600',
        'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=1600',
        'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=1600',
      ],
    },
    {
      name: 'Sarbet Studio Loft',
      description:
        'A compact, design-led studio loft for professionals, with reclaimed-oak flooring, smart lighting, and a co-working lounge downstairs.',
      address: 'Sarbet, Addis Ababa, Ethiopia',
      regularPrice: 1850,
      discountPrice: 1700,
      bathrooms: 1,
      bedrooms: 1,
      furnished: true,
      parking: false,
      type: 'rent',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1600',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1600',
        'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1600',
      ],
    },
    {
      name: 'Hilltop Glass Pavilion',
      description:
        'An award-winning glass pavilion balanced on a rocky escarpment, with a cantilevered pool that floats above the city.',
      address: 'Yeka Hills, Addis Ababa, Ethiopia',
      regularPrice: 2750000,
      discountPrice: 2595000,
      bathrooms: 5,
      bedrooms: 5,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
        'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=1600',
        'https://images.unsplash.com/photo-1600573472556-e636c2acda88?w=1600',
      ],
    },
  ];

  console.log(`Seeding ${premiumListings.length} listings...`);
  await db
    .insert(listings)
    .values(premiumListings.map((l) => ({ ...l, userRef })));

  console.log('Seed complete.');
  await pool.end();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await pool.end();
  process.exit(1);
});
