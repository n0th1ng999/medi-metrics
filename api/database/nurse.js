import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
/**
 *  """Nurse type are the account details of each nurse"""
    type Nurse{
        citizenCardNumber: ID!
        name: String!
        email: String!
        password: String!
    }
*/

const nurseSchema = mongoose.Schema({
	citizenCardNumber: {
		type: mongoose.SchemaTypes.Int32,
		required: true,
		unique: true,
	},
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
});

nurseSchema.method({
	comparePassword: async function (inputPassword) {
		// Compare input password to the encrypted password
		return await bcrypt.compare(inputPassword, this.password);
	},
	generateToken: function () {
		// Generate JWT token
		return jwt.sign(this._id, "secret");
	},
});

export default mongoose.model("Nurse", nurseSchema);
