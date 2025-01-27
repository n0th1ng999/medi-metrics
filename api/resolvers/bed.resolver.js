import { Department, Nurse, Bed, Patient } from "../database/index.js";

const BedResolver = {
    Query: {
        /* 
        """Get Available Beds"""
        getAvailableBeds(departmentID: ID!): [Bed]

		
		getBeds(departmentID: ID)
        */
    },
    Mutation: {
        /**
		 * * Done ✅
		 * @param {*} _
		 * @param {{departmentId:String, location:String}} input
		 */
		createBed: async (_, { departmentId, location }) => {
			try {
				// Check if bed already exists in the specified department location
				const bedExistenceCheck = await Bed.findOne({
					departmentId,
					location,
				});

				if (bedExistenceCheck) {
					return {
						success: false,
						message: "The bed already exists in the department",
					};
				}

				const department = await Department.findById(departmentId);

				if (!department) {
					return { success: false, message: "Department not found" };
				}

				const newBed = new Bed({ location, departmentId: department._id });

				await newBed.save();

				return { success: true, message: "Bed created successfully" };
			} catch (error) {
				return { success: false, message: error.message };
			}
		},
		/**
		 * * Done ✅
		 * @param {*} _
		 * @param {{departmentId:String, bedId:String}} input
		 */
		deleteBed: async (_, { id }) => {
			try {
				const res = await Bed.findByIdAndDelete(id);

				if (!res) {
					return { success: false, message: "Bed not found" };
				}

				return { success: true, message: "Bed deleted successfully" };
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},

		/**
		 * Todo assign a patient to a bed
		 * * Verification and creation logic ✅
		 * ! Authentication for nurses (JWT verify) ❌
		 */
		assignPatientToBed: async (_, { bedId, patientId }) => {
			try {
				const checkPatientBed = await Bed.findOne({ patientId: patientId });

				if (checkPatientBed) {
					return {
						success: false,
						message: "Patient is already assigned to a bed",
					};
				}

				const bed = await Bed.findById(bedId);

				if (!bed) {
					return { success: false, message: "Bed not found" };
				}

				if (bed.patientId) {
					return { success: false, message: "Bed is already occupied" };
				}

				const patient = await Patient.findById(patientId);

				if (!patient) {
					return { success: false, message: "Patient does not exist" };
				}

				bed.patientId = patientId;

				await bed.save();

				return {
					success: true,
					message: "Patient assigned to bed successfully",
				};
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},

		/**
		 * Todo unassign a patient from a bed
		 *  * Deletion logic ✅
		 * ! Authentication for nurses (JWT verify) ❌
		 */
		unassignPatientFromBed: async (_, { bedId }) => {
			try {
				const bed = await Bed.findById(bedId);

				if (!bed) {
					return { success: false, message: "Bed not found" };
				}

				if (!bed.patientId) {
					return { success: false, message: "Bed is not occupied" };
				}

				bed.patientId = null;

				await bed.save();

				return {
					success: true,
					message: "Patient unassigned from bed successfully",
				};
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},
    }
}

export default BedResolver