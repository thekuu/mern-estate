import express from 'express';
import {
  getListings,
  createListing,
  deleteListing,
  updateListing,
  updateSeedPrices,
  getListing,
} from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();
router.post('/create', verifyToken, createListing)
router.delete('/delete/:id', verifyToken, deleteListing)
router.post('/update/:id', verifyToken, updateListing)
router.post('/update-seed-prices', verifyToken, updateSeedPrices)
router.get('/get/:id', getListing)
router.get('/get', getListings)
export default router