import express from "express";
import userAuth from "../middleware/authMiddleware.js";
const router = express.Router();
import { sendNotification, countNotification, readNotification, readAllNotification, getAllNotification } from "../controllers/notificationController.js";

router.post("/get-all", userAuth, getAllNotification);
router.post("/send", userAuth, sendNotification);
router.post("/count", userAuth, countNotification);
router.post("/read", userAuth, readNotification);
router.post("/read-all", userAuth, readAllNotification);

export default router;