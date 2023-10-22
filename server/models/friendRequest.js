import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
    requestTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    requestStatus: {
        type: String,
        default: "pending"
    },
},
{ timestamps: true });

export const FriendRequest = mongoose.model('FriendRequest',requestSchema);