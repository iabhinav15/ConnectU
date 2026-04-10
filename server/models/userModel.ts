import mongoose, { Document, Schema, Model } from "mongoose";

export interface User extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    location?: string;
    profession?: string;
    profileUrl?: string;
    friends: mongoose.Types.ObjectId[];
    views: string[];
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<User>({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    location: { type: String },
    profession: { type: String },
    profileUrl: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
    views: [{ type: String }],
    verified: { type: Boolean, default: false },
}, { timestamps: true });

export const UserModel: Model<User> = mongoose.model<User>('User', userSchema);
// Export as User for backward compatibility if needed, but it's better to stick to the previous naming
export { UserModel as User };
