import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
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
    friends: [{type: Schema.Types.ObjectId, ref: "Users"} ],
    views: [{type: String} ],
    verified: { type: Boolean, default: false },
},
{ timestamps: true }
);

export const User = mongoose.model('User', userSchema);