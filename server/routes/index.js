import express from 'express';
import authRoute from './authRoutes.js';
import userRoutes from './userRoutes.js';
import postRoute from './postRoutes.js';
import serviceRoute  from './serviceRoutes.js';
import notificationRoutes from './notificationRoutes.js';
const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoutes);
router.use('/posts', postRoute);
router.use('/service', serviceRoute);
router.use('/notification', notificationRoutes);

export default router;