import { Department, Nurse, Bed, Patient } from "../database/index.js";

const PatientResolver = {
    Query: {
        /* 
        """ Get Patient information by ID"""
        getPatientById(patientId: ID!): Patient

        """ Get Patient Health records """
        getPatientHealthRecords(patientId: ID!, startDate: String, endDate: String ): [HealthRecord]
         */
    },
    Mutation: {
        /**
		 * * Done ✅
		 * @param {*} _ 
		 * @param {{patientInput: {
				citizenCardNumber: String
				name: String
				age: Number
				address: String
				gender: String
				phone: String
			}}} param1 
		 * @returns 
		 */
		createPatient: async (_, { patientInput }) => {
			try {
				const newPatient = new Patient(patientInput);

				await newPatient.save();

				return { success: true, message: "Patient created" };
			} catch (error) {
				return { success: false, message: error.message };
			}
		},
		/**
		 * * Done ✅
		 * @param {*} _
		 * @param {{id:String}} param1
		 * @returns
		 */
		deletePatient: async (_, { id }) => {
			try {
				const res = await Patient.findByIdAndDelete(id);

				if (!res) {
					return { success: false, message: "Patient not found" };
				}
				return { success: true, message: "Deletion Successful" };
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},
    }
}

export default PatientResolver