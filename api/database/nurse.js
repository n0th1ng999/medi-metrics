import mongoose from "mongoose";
import jwt from "jsonwebtoken";
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
	email: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
});

nurseSchema.method({
	comparePassword: function (inputPassword) {
		return this.password === inputPassword;
	},
	generateToken: function () {
		// Generate JWT token
		return jwt.sign(this._id, "secret");
	},
});

export default mongoose.model("Nurse", nurseSchema);
