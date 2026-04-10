import { Request, Response } from 'express';
import { Notification } from '../models/notificationModel.js';

export const getAllNotification = async (req: Request, res: Response) => {
  res.send("Notification Route");
};

export const sendNotification = async (req: Request, res: Response) => {
  res.send("Notification Route");
};

export const countNotification = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.user;

    const count = await Notification.find({ userId: userId, read: false }).countDocuments();

    res.status(200).json({
      success: true,
      message: "Notification count fetched successfully",
      data: count
    });

  } catch (error: any) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const readNotification = async (req: Request, res: Response) => {
  res.send("Notification Route");
};

export const readAllNotification = async (req: Request, res: Response) => {
  res.send("Notification Route");
};
