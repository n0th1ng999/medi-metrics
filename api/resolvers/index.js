import { User } from "../../database/index.js";
import { GraphQLError } from "graphql";
/* User{
			id: ID!
		   name: String!
		   email: String!
		   password: String!
		   age: Int
		   gender: String
		   healthRecords: [HealthRecord]
		   goals: [HealthGoal]
}
*/

export default {
	Query: {
		// User Read
		getUserById: async (_, { id }) => {
			try {
				console.log(id);
				const user = await User.findById(id);

				if (!user) {
					throw new GraphQLError(
						"User not found, Id does not appear to exist in the database"
					);
				}

				return user;
			} catch (error) {
				return new GraphQLError(`${error}`);
			}
		},
	},
	Mutation: {
		// User Create, Update, Delete
		createUser: async (_, { userRegisterInput }) => {
			try {
				const userExists = await User.findOne({
					email: userRegisterInput.email,
				});

				if (userExists) {
					throw new GraphQLError("Email already exists in the database");
				}

				const newUser = new User(userRegisterInput);

				const savedUser = await newUser.save();

				return savedUser;
			} catch (error) {
				throw new GraphQLError(`${error}`);
			}
		},
		updateUser: async (_, { id, updateUserInput }) => {
			try {
				const updatedUser = await User.findByIdAndUpdate(
					id,
					{ ...updateUserInput },
					{
						new: true,
					}
				);

				return updatedUser;
			} catch (error) {
				throw new GraphQLError(`${error}`);
			}
		},
		deleteUser: async (_, { id }) => {
			const result = { success: true, message: "Successfully Deleted" };

			try {
				const res = await User.findByIdAndDelete(id);

				if (!res) {
					result.success = false;
					result.message = `User not found, Id (${id}) does not appear to exist in the database`;
				}

				return result;
			} catch (error) {
				throw new GraphQLError(`${error}`);
			}
		},

		// Retrieve JWT token for authentication purposes
		loginUser: async (_, { loginUserInput }) => {
			const { password, email } = loginUserInput;

			try {
				const user = await User.findOne({ email });

				if (!user) {
					throw new GraphQLError("User not found");
				}

				const isMatch = await user.comparePassword(password);

				if (!isMatch) {
					throw new GraphQLError("Invalid password");
				}

				const token = user.generateToken();
				return token;
			} catch (error) {
				throw new GraphQLError(`${error}`);
			}
		},

		// Create a Health Record

		


	
	},
};
