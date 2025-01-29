import { Department, Nurse, Bed, Patient } from "../database/index.js";
import { graphql, GraphQLError } from 'graphql'
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

const PatientResolver = {
  Query: {

        getPatientById: async(_, {patientId}) => {
          try {
            const patient = await Patient.findById(patientId);
            if (!patient) {
              throw new GraphQLError("Patient not found")
            }
            return patient
          } catch (error) {
            console.log(error)
            throw new GraphQLError("Server error")
          }
        }
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

        const patients = await Patient.find();

        const currentHealthRecords = [];
        patients.forEach((patient) => {
          currentHealthRecords.push({
            patientId: patient._id,
            healthRecord:
              patient.healthRecords[patient.healthRecords.length - 1],
          });
        });

        console.log(currentHealthRecords);

        pubsub.publish("CURRENT_HEALTH_RECORDS", currentHealthRecords);

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
  },
  Subscription: {
    currentHealthRecords: {
      subscribe: () => pubsub.asyncIterableIterator("CURRENT_HEALTH_RECORDS"),
      resolve: (payload) => {
        return payload;
      },
    },
  },
};

export default PatientResolver;
