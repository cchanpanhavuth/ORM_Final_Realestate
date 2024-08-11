import express from 'express';
import { getAllListing, createListing, getListingType, deleteListing} from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/views',verifyUser,  getAllListing);
router.get('/type',  getListingType);
router.post('/create', verifyUser, createListing);
router.delete('/delete/:id', verifyUser, deleteListing);


export default router;

