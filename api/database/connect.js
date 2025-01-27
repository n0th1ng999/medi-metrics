import mongoose from "mongoose";
import * as dotenv from 'dotenv'

dotenv.config()

// Mongoose connection options
const options = {};

export default async () => {
	//console.log(process.env.CON_STRING_MONGODB)
	try {
		await mongoose.connect(process.env.CON_STRING_MONGODB, options);
	} catch (error) {
		throw new Error(`Error connecting to MongoDB: ${error}`);
	}
};
