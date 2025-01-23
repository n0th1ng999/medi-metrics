import mongoose from "mongoose";
import { SchemaTypes } from "mongoose";
import jwt from "jsonwebtoken";

/**
 *  type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        age: Int
        gender: String
        healthRecords: [HealthRecord]
        goals: [HealthGoal]
    }
		
	 type HealthRecord {
        date: String!
        heartRate: Int
        bloodPressure: BloodPressure
        glucoseLevel: Float
        weight: Float
        sleepHours: Float
    }

    """
        Blood Pressure is a simple object to represent systolic and diastolic blood pressure.
    """
    type BloodPressure {
        systolic: Int!
        diastolic: Int!
    }
	*/

const UserSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	age: SchemaTypes.Int32,
	gender: String,
	healthRecords: [
		{
			date: String,
			heartRate: SchemaTypes.Int32,
			bloodPressure: {
				diastolic: SchemaTypes.Int32,
				systolic: SchemaTypes.Int32,
			},
			glucoseLevel: Number,
			weight: Number,
			sleepHours: Number,
		},
	],
	goals: [{ type: String }],
});

UserSchema.method({
	comparePassword: function (inputPassword) {
		return this.password === inputPassword;
	},
	generateToken: function () {
		// Generate JWT token

		return jwt.sign(this.id, "secret");
	},
});

export default mongoose.model("User", UserSchema);
