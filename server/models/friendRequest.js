import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requestTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    requestFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    requestStatus: {
        type: String,
        default: "pending"
    },
},
{ timestamps: true });

export const FriendRequest = mongoose.model('FriendRequest',requestSchema);