import mongoose, { Document, Schema, Model } from "mongoose";

export interface FriendRequest extends Document {
    requestTo?: mongoose.Types.ObjectId;
    requestFrom?: mongoose.Types.ObjectId;
    requestStatus: string;
    createdAt: Date;
    updatedAt: Date;
}

const requestSchema = new Schema<FriendRequest>({
    requestTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    requestFrom: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    requestStatus: {
        type: String,
        default: "pending"
    },
}, { timestamps: true });

export const FriendRequestModel: Model<FriendRequest> = mongoose.model<FriendRequest>('FriendRequest', requestSchema);
export { FriendRequestModel as FriendRequest };
