import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URL}`, {
      dbName: process.env.DB_NAME,
    });
    return connection.connection;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
