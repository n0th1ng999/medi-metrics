import { Department, Nurse, Bed, Patient } from "../database/index.js";

const DepartmentResolver = {
    Query: {

    },
    Mutation: {
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
    }
}

export default DepartmentResolver