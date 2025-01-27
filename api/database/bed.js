import mongoose from "mongoose";

/**
 *  """Department beds and the patient assigned to it"""
    type Bed {
        id: ID!
        location: String!
        patientId: ID!
        departmentId: ID!
    }
 * 
 */

const bedSchema = mongoose.Schema({
	location: { type: String , required: true},
	patientId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Patient",
		required: false,
	},
	departmentId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Department",
		required: true,
		unique: true,
	},
});

export default mongoose.model("Bed", bedSchema);
