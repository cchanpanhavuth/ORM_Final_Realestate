import express from 'express';
import { getAllListing, createListing, getListingType, deleteListing, updateListing, getListing, getListings} from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();



router.get('/type',  getListingType);
router.get('/getListings',verifyUser,  getAllListing);
router.post('/create', verifyUser, createListing);
router.delete('/delete/:id', verifyUser, deleteListing);
router.patch('/update/:id', verifyUser, updateListing);
router.get('/getListing/:id',  getListing);
router.get('/get',  getListings);

export default router;

