import mongoose from "mongoose";

/**
 *  """Department details, they harbor patients and
        Nurses are responsible for it's maintenance"""
    type Department{
        id: ID!
        name: String!
        nurses: [Nurse]
        beds: [Bed]
    }
   
 */


const departmentSchema = mongoose.Schema({
	name: String,
	nurses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Nurse" }],
});

export default mongoose.model("Department", departmentSchema);
