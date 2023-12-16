import express from 'express';
import { deleteVerification } from '../controllers/serviceController.js';
const router = express.Router();

router.delete('/delete-verification', deleteVerification);

export default router;