import mongoose, { Document, Schema, Model } from "mongoose";

export interface EmailVerification extends Document {
    userId?: string;
    token?: string;
    createdAt?: Date;
    expiresAt?: Date;
}

const emailVerificationSchema = new Schema<EmailVerification>({
    userId: String,
    token: String,
    createdAt: Date,
    expiresAt: Date,
});

export const VerificationModel: Model<EmailVerification> = mongoose.model<EmailVerification>('Verification', emailVerificationSchema);
export { VerificationModel as Verification };
