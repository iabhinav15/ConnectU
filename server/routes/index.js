import express from 'express';
import authRoute from './authRoutes.js';
import userRoutes from './userRoutes.js';
import postRoute from './postRoutes.js';
const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoutes);
router.use('/posts', postRoute);

export default router;