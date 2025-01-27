import { Department, Nurse, Bed, Patient } from "../database/index.js";
import { GraphQLError } from 'graphql'

const NurseResolver = {
    Query: {
        

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
    }
}

export default NurseResolver