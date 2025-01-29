import { Department, Nurse, Bed, Patient } from "../database/index.js";
import { graphql, GraphQLError } from "graphql";

const BedResolver = {
	// Done :chek:
	Query: {
		getBeds: async(_,{ departmentId, available } ) => {
			try {
				let beds = await Bed.find({departmentId});
			
				if (!beds || beds.length === 0) {
					throw new GraphQLError("Beds not found")
				}

				if (available != undefined) {
					if(available === true ){
						beds = beds.filter(bed => !bed?.patientId )
						
					}else{
						beds = beds.filter(bed => bed?.patientId )
					}
				}
				return beds
			} catch (error) {
				console.log(error)
				throw new GraphQLError("Server error")
			}
		}
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
		 * * Verification and creation logic ✅
		 * * Authentication for nurses (JWT verify) ✅
		 */
		assignPatientToBed: async (_, { bedId, patientId }, context) => {
			try {
				const nurse = await context.verifyNurse();

				const nurseDepartment = await Department.findOne({
					nurses: { $in: nurse.id },
				});

				if (!nurseDepartment) {
					return {
						success: false,
						message: "Nurse does not belong to any department",
					};
				}

				const bed = await Bed.findById(bedId);

				if (!bed) {
					return { success: false, message: "Bed not found" };
				}

				if (bed?.departmentId != nurseDepartment.id) {
					return {
						success: false,
						message: "Bed does not belong to the nurse's department",
					};
				}

				if (bed.patientId) {
					return {
						success: false,
						message: "Patient is already assigned to a bed",
					};
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
		 * * Deletion logic ✅
		 * * Authentication for nurses (JWT verify) ✅
		 */
		unassignPatientFromBed: async (_, { bedId }, context) => {
			try {
				const nurse = await context.verifyNurse();

				const nurseDepartment = await Department.findOne({
					nurses: { $in: nurse.id },
				});

				if (!nurseDepartment) {
					return {
						success: false,
						message: "Nurse does not belong to any department",
					};
				}

				const bed = await Bed.findById(bedId);

				if (bed.departmentId != nurseDepartment.id) {
					return {
						success: false,
						message: "Bed does not belong to the nurse's department",
					};
				}

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
	},
};

export default BedResolver;
