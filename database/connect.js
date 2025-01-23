import mongoose from "mongoose";

// Mongoose connection options
const options = {};

export default async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/MediMetrics", options);
	} catch (error) {
		throw new Error(`Error connecting to MongoDB: ${error}`);
	}
};
