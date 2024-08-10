import express from 'express';
import { getAllListing, createListing, getListingType} from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/views',verifyUser,  getAllListing);
router.get('/type',  getListingType);
router.post('/create', verifyUser, createListing);

export default router;

