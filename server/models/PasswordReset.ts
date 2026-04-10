import mongoose, { Document, Schema, Model } from "mongoose";

export interface PasswordReset extends Document {
    userId: string;
    email: string;
    token?: string;
    createdAt?: Date;
    expiresAt?: Date;
}

const passwordResetSchema = new Schema<PasswordReset>({
    userId: { type: String, required: true },
    email: { type: String, required: true },
    token: String,
    createdAt: Date,
    expiresAt: Date,
});

export const PasswordResetModel: Model<PasswordReset> = mongoose.model<PasswordReset>('PasswordReset', passwordResetSchema);
export { PasswordResetModel as PasswordReset };
