import mongoose, { mongo } from "mongoose";

/**
 * """Patient details"""
    type Patient{
        citizenCardNumber: ID!
        name: String!
        age: Int
        address: String!
        gender: String
        phone: String!
        healthRecords: [HealthRecord]
    }

    """
        Health Record is the list of parameters of each user 
        A User has multiple health records
    """
    type HealthRecord {
        dateTime: ID!
        heartRate: Int
        bloodPressure: BloodPressure
        glucoseLevel: Float
        cholesterolLevel: Float
        weight: Float
    }
 */

const HealthRecordSchema = mongoose.Schema({
	dateTime: { type: mongoose.SchemaTypes.Date, required: true },
	heartRate: mongoose.SchemaTypes.Int32,
	bloodPressure: {
		systolic: Number,
		diastolic: Number,
	},
	glucoseLevel: Number,
	cholesterolLevel: Number,
	weight: Number,
});

const patientSchema = mongoose.Schema({
	citizenCardNumber: {
		type: mongoose.SchemaTypes.Int32,
		required: true,
		unique: true,
	},
	name: { type: String, required: true },
	age: Number,
	address: String,
	gender: String,
	phone: mongoose.SchemaTypes.Int32,
	healthRecords: [HealthRecordSchema],
});

export default mongoose.model("Patient", patientSchema);
