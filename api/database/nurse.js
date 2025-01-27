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
	email: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
});

nurseSchema.pre("save", async function (next) {
	// Only hash the password if it has been modified (or is new)
	if (this.isModified("password")) {
		this.password = bcrypt.hash(this.password, 10);
	}

	next();
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
