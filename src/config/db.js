import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not set");
        }

        const isProduction = process.env.NODE_ENV === "production";
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
            retryWrites: true,
            tls: true,
            tlsAllowInvalidCertificates: !isProduction
        });
        console.log("MongoDB connected");
    }
    catch(error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}   

export default connectDB;