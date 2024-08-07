import express from 'express';
import { getAllListing, createListing} from '../controllers/listing.controller.js';
import { verifyUser } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/views', getAllListing);

router.post('/create', createListing);

export default router;

