import mongoose, { Schema } from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User" 
    },  
    description: {
        type: String,
        required: [true, 'Please enter your description'],
    },
    image: {
        type: String,
    },
    likes: [{type: String} ],
    comments: [{type: Schema.Types.ObjectId, ref:"Comment"}],
    },
    { timestamps: true }
);
  
export const Post = mongoose.model('Post',postSchema);