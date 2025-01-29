export default `#graphql
    """Nurse type are the account details of each nurse"""
    type Nurse{
        citizenCardNumber: ID!
        name: String!
        email: String!
        password: String!
    }

    """Department details, they harbor patients and
     Nurses are responsible for it's maintenance"""
    type Department{
        id: ID!
        name: String!
        nurses: [Nurse]
        beds: [Bed]
    }
    
    """Department beds and the patient assigned to it"""
    type Bed {
        id: ID!
        location: String!
        patientId: ID!
        departmentId: ID!
    }
   
    #   type SensorAvailability {
    #       heartRateSensor: Boolean
    #       bloodPressureSensor: Boolean
    #       temperatureSensor: Boolean
    #       glucoseSensor: Boolean
    #       weightSensor: Boolean
    #       oxygenSaturationSensor: Boolean
    #       sleepSensor: Boolean
    #   }

    """Patient details"""
    type Patient{
        citizenCardNumber: ID!
        name: String!
        age: Int
        address: String!
        gender: String
        phone: String!
        healthRecords: [HealthRecord]
    }

    """
        Health Record is the list of parameters of each user 
        A User has multiple health records
    """
    type HealthRecord {
        dateTime: ID! #? Para quê se é preenchida de forma automática?
        heartRate: Int
        bloodPressure: BloodPressure
        glucoseLevel: Float
        cholesterolLevel: Float
        weight: Float
    }

    type PatientHealthRecord{
        patientId: ID!
        healthRecord: HealthRecord
    }

    """
        Blood Pressure is a simple object to represent systolic and diastolic blood pressure.
    """
    type BloodPressure {
        systolic: Int!
        diastolic: Int!
    }

    ########################################################################
    type Query {
        """ Get Nurse information by ID"""
        getNurseById(nurseId: ID!): Nurse # ✅

        """Get Available Beds"""
        getAvailableBeds(departmentID: ID!): [Bed] # ❌

       """ Get Patient information by ID"""
        getPatientById(patientId: ID!): Patient # ❌

        """ Get Patient Health records """
        getPatientHealthRecords(patientId: ID!, startDate: String, endDate: String ): [HealthRecord] # ❌
    }

    "Result object determines the success status of a mutation or query operation [success, message]"
    type Result {
        success: Boolean!
        message: String
    }

    input NurseInput {
        citizenCardNumber: ID
        name: String
        email: String
        password: String
        assignedDepartmentId: ID
    }

    input PatientInput {
        citizenCardNumber: ID
        name: String
        age: Int
        address: String
        gender: String
        phone: Int
    }

    input BloodPressureInput {
        systolic: Int!
        diastolic: Int!
    }

    input HealthRecordInput {
        dateTime: ID
        heartRate: Int
        bloodPressure: BloodPressureInput
        glucoseLevel: Float
        cholesterolLevel: Float
        weight: Float
    }

    type Mutation {
        # Nurse 
        createNurse(nurseInput: NurseInput): Result # ✅
        # updateNurse(id: ID!, nurseInput: NurseInput ): Result
        deleteNurse(id: ID!): Result # ✅

        """ Login Nurse """
        loginNurse(email: String!, password: String!): String # JWT TOKEN ✅

        # Patient ✅
        createPatient(patientInput: PatientInput): Result
        # updatePatient(id: ID!, patientInput: PatientInput ): Result ✅
        deletePatient(id: ID!): Result

        # add Health Record ✅
        addHealthRecord(patientId: ID!, healthRecordInput: HealthRecordInput): Result
        # delete Health Record ✅
        deleteHealthRecord(patientId: ID!, dateTime: ID!): Result

        # Department ✅
        createDepartment(name: String!): Result
        # updateDepartment(id: ID!, name: String!): Result ✅
        deleteDepartment(id: ID!): Result

        # Bed ✅
        createBed(departmentId: ID!, location: String!): Result
        # updateBed(id: ID!, departmentId: ID,  location: String): Result
        deleteBed(id: ID!): Result

        # Assign Patient to Bed ✅
        assignPatientToBed(patientId: ID!, bedId: ID!): Result
        unassignPatientFromBed(bedId: ID!): Result
    }

    type Subscription{
        currentHealthRecord(patientId: ID): PatientHealthRecord # ✅
    }
`;
