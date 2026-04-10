import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const url = process.env.MONGODB_URL;
        if (!url) throw new Error("MONGODB_URL is missing in environment variables");
        
        await mongoose.connect(url); // Mongoose 6+ has useUnifiedTopology/useNewUrlParser by default
        console.log('MongoDB Connected');
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

export default dbConnection;
