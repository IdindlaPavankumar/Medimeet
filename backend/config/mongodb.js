import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/prescripto`);
    console.log(' MongoDB connected successfully');
  } catch (error) {
    console.error(' MongoDB connection failed:', error.message);
    process.exit(1); // Exit if DB connection fails
  }
};

export default connectDB;
