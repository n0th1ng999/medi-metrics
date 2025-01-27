import { Department, Nurse, Bed, Patient } from "../database/index.js";
import { graphql, GraphQLError } from 'graphql'

const NurseResolver = {
    Query: {
        // done :check:
        getNurseById: async(_, {nurseId}) => {
            try {
                console.log(nurseId);
                const nurse = await Nurse.findById(nurseId); 
                if (!nurse) {
                    throw new GraphQLError("Nurse not found")
                }
                return nurse
            } catch (error) {
                console.log(error)
                throw new GraphQLError("Server error")
            }
        }
        
        /**
		 * "" Get Nurse information by ID"""
        getNurseById(nurseId: ID!): Nurse 
		*/
	},
	Mutation: {
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
		loginNurse: async (_, { password, email }) => {
			try {
				const nurse = await Nurse.findOne({
					email,
				});

				if (!nurse) {
					throw new Error("Nurse email does not exist");
				}

				const isValidPassword = await nurse.verifyPassword(password);

				if (!isValidPassword) {
					throw new Error("Invalid password");
				}

				return jwt.sign({ id: nurse._id }, "secretKey", { expiresIn: "1h" });
			} catch (error) {
                throw new Error(error.message);
            }
		},
	},
};

export default NurseResolver;
