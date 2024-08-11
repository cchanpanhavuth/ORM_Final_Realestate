import express from 'express';
import {test, updateUser, deleteUser, getUserProperty} from '../controllers/user.controller.js'
import { verifyUser } from '../utils/verifyUser.js';
const router = express.Router();

router.get('/test', test);
router.patch('/update/:id',verifyUser, updateUser)
router.delete('/delete/:id',verifyUser, deleteUser)
router.get('/property/:id', verifyUser, getUserProperty)


export default router;