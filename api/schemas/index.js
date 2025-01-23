export default `#graphql
    """
       User type are the account details of each user of the platform. 
       Its used for authentication and keeping the record of each users health record information. 
    """
    type User {
        id: ID!
        name: String!
        email: String!
        password: String!
        age: Int
        gender: String
        healthRecords: [HealthRecord]
        goals: [HealthGoal]
    }

    """
        Health Record is the list of parameters of each user 
        A User has multiple health records
    """
    type HealthRecord {
        id: ID!
        userId: ID!
        date: String!
        heartRate: Int
        bloodPressure: BloodPressure
        glucoseLevel: Float
        weight: Float
        sleepHours: Float
    }

    """
        Blood Pressure is a simple object to represent systolic and diastolic blood pressure.
    """
    type BloodPressure {
        systolic: Int!
        diastolic: Int!
    }

    type HealthGoal {
        id: ID!
        userId: ID!
        type: String! # e.g., "weight", "sleep", "glucose", "bloodPressure"
        targetValue: Float
        currentValue: Float
        progress: Float
    }

    type Query {
        """ Get user information by ID"""
        getUserById(id: ID!): User 

        """ Get Health Records of User between two dates"""
        getUserHealthRecords(userId: ID!, startDate: String!, endDate: String!): [HealthRecord]
    }

    "Result object determines the success status of a mutation or query operation [success, message]"
    type Result {
        success: Boolean!
        message: String
    }

    "Input for User Account creation. [name, email and password] are required but [age, gender] are optional." 
    input userRegisterInput {
        name: String!
        email: String!
        password: String!
        age: Int
        gender: String

    }

    "Input for User Account Update. All fields are optional [name, email, password, age, gender]" 
    input updateUserInput {
        name: String
        email: String
        password: String
        age: Int
        gender: String
    }

    type UserCreateResponse
    {
        user: User
        jwt: String
    }

    input loginUserInput {
        email: String
        password: String
    }

    type Mutation {
        # Users 
        createUser(userRegisterInput: userRegisterInput): UserCreateResponse
        updateUser(id: ID!, updateUserInput: updateUserInput): User
        deleteUser(id: ID!): Result
        
        "Retrieve JWT token"
        loginUser(loginUserInput: loginUserInput!): String
    }
`;
