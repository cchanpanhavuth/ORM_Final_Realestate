import express from 'express';
import { getAllListing, getListings, createListing, getListingType, deleteListing, updateListing, getListings} from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();



router.get('/type',  getListingType);
router.get('/getListings',verifyUser,  getAllListing);
router.get('/getListing/:id',  getListings);
router.post('/create', verifyUser, createListing);
router.delete('/delete/:id', verifyUser, deleteListing);
router.patch('/update/:id', verifyUser, updateListing);



export default router;

