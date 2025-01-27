import { Department, Nurse, Bed, Patient } from "../database/index.js";

import DepartmentResolver from "./department.resolver.js";
import BedResolver from "./bed.resolver.js";
import NurseResolver from "./nurse.resolver.js";
import PatientResolver from "./patient.resolver.js";

import { mergeResolvers } from "@graphql-tools/merge";

//resolvers = mergeResolvers([DepartmentResolver, BedResolver, NurseResolver, PatientResolver])

export default {
	Query: {
		/**

        """Get Available Beds"""
        getAvailableBeds(departmentID: ID!): [Bed]

		
		getBeds(departmentID: ID)

       """ Get Patient information by ID"""
        getPatientById(patientId: ID!): Patient

        """ Get Patient Health records """
        getPatientHealthRecords(patientId: ID!, startDate: String, endDate: String ): [HealthRecord]
		 

		*/
	},
	Mutation: {
		// * Nurses ✅
		/**
		 * * Done ✅
		 * @param {*} _
		 * @param {{nurseInput: {
		 * citizenCard: String
		 * name: String
		 * email: String
		 * password: String
		 * assignedDepartmentId: String
		 * }}} input
		 * @returns {{success: Boolean, message: String}}
		 */
		createNurse: async (_, { nurseInput }) => {
			try {
				const {
					citizenCardNumber,
					name,
					email,
					password,
					assignedDepartmentId,
				} = nurseInput;

				const newNurse = new Nurse({
					citizenCardNumber,
					name,
					email,
					password,
				});

				// if assignedDepartment Id is provided then try to assign Nurse
				if (assignedDepartmentId) {
					// the Department
					const departmentToAssign = await Department.findById(
						assignedDepartmentId
					);

					// if department exists and is not already full
					if (departmentToAssign) {
						departmentToAssign.nurses.push(newNurse._id);
						await departmentToAssign.save();
					} else {
						return {
							success: false,
							message:
								"Department does not exist, Nurse account was not created",
						};
					}
				}

				await newNurse.save();
				return { success: true, message: "Nurse created successfully" };
			} catch (error) {
				return { success: false, message: error.message };
			}
		},
		/**
		 * * Done ✅
		 * @param {*} _
		 * @param {{id:String}} input
		 * @returns {success: Boolean, message: String}}
		 */
		deleteNurse: async (_, { id }) => {
			try {
				const deletedNurse = await Nurse.findByIdAndDelete(id);

				if (!deletedNurse) {
					return { success: false, message: "Nurse not found" };
				}

				return { success: true, message: "Deletion Successful" };
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},

		// * Patients ✅
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

		// todo Health Records ❌
		/**
		 * * Done ✅
		 *   type HealthRecord {
				dateTime: ID!
				heartRate: Int
				bloodPressure: BloodPressure
				glucoseLevel: Float
				cholesterolLevel: Float
				weight: Float
			}
		 * @param {*} _ 
		 * @param {{patientId: String, healthRecordInput:{
		 * dateTime: String
		 * heartRate: Number
		 * bloodPressure: {systolic: Number, diastolic:Number}
		 * glucoseLevel: Number
		 * cholesterolLevel: Number
		 * weight: Number
		 * }}} param1 
		 */
		addHealthRecord: async (_, { patientId, healthRecordInput }) => {
			try {
				const {
					dateTime = Date.now(),
					heartRate,
					bloodPressure,
					glucoseLevel,
					clipboardLevel,
					weight,
				} = healthRecordInput;

				const patient = await Patient.findById(patientId);

				if (!patient) {
					return { success: false, message: "Patient not found" };
				}

				if (!patient.healthRecords) {
					patient.healthRecords = [];
				}

				patient.healthRecords.push({
					dateTime,
					heartRate,
					bloodPressure,
					glucoseLevel,
					clipboardLevel,
					weight,
				});

				await patient.save();

				return { success: true, message: "Health record added" };
			} catch (error) {
				return { success: false, message: error.message };
			}
		},
		// Delete Health Record ✅
		deleteHealthRecord: async (_, { patientId, dateTime }) => {
			try {
				const patient = await Patient.findById(patientId);

				if (!patient) {
					return { success: false, message: "Patient not found" };
				}

				const healthRecordIndex = patient.healthRecords.findIndex(
					(record) => record.dateTime.getTime() === new Date(dateTime).getTime()
				);

				if (healthRecordIndex === -1) {
					return { success: false, message: "Health record not found" };
				}

				patient.healthRecords.splice(healthRecordIndex, 1);

				await patient.save();

				return { success: true, message: "Health record deleted" };
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},

		// * Departments ✅
		/**
		 * * Done ✅
		 * @param {*} _
		 * @param {{name:String}} input
		 */
		createDepartment: async (_, { name }) => {
			try {
				const newDepartment = new Department({ name });

				await newDepartment.save();

				return { success: true, message: "Department created successfully" };
			} catch (error) {
				return { success: false, message: error.message };
			}
		},
		/**
		 * * Done ✅
		 * @param {*} _
		 * @param {{id:String}} input
		 */
		deleteDepartment: async (_, { id }) => {
			try {
				const deletedDepartment = await Department.findByIdAndDelete(id);

				if (!deletedDepartment) {
					return { success: false, message: "Department not found" };
				}

				return { success: true, message: "Deletion Successful" };
			} catch (error) {
				return { success: false, message: `Error: ${error}` };
			}
		},

		// Todo Beds ❌
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
	},
};
