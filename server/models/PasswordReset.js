import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema({
    userId: {type:String, required: true},
    email: {type:String, required: true},
    token: String,
    createdAt: Date,
    expiresAt: Date,
});

export const PasswordReset = mongoose.model('PasswordReset',passwordResetSchema);