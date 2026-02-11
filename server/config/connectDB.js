import mongoose from 'mongoose';

async function connectDB() {
    try {
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected:', connection.connection.host);
    } catch (error) {
        console.error('Error connecting MongoDB:', error.message);
        throw error;
    }
}

export default connectDB;
