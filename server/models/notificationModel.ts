import mongoose, { Document, Schema, Model } from "mongoose";

export interface Notification extends Document {
    userId?: mongoose.Types.ObjectId;
    message: string;
    media?: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const notificationSchema = new Schema<Notification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    message: {
        type: String,
        required: true
    },
    media: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const NotificationModel: Model<Notification> = mongoose.model<Notification>("Notification", notificationSchema);
export { NotificationModel as Notification };
