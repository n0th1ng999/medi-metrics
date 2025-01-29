import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const context = async ({ req, res }) => {
	return {
		verifyNurse: async () => {
			if (!req.headers.authorization) {
				throw new GraphQLError("Authentication token is required");
			}

			const token = req.headers.authorization;

			try {
				jwt.verify(token, "secret");
			} catch (error) {
				throw new GraphQLError("Invalid or expired authentication token");
			}

			const decodedToken = jwt.decode(token, "secret");

			return decodedToken;
		},
	};
};

export default context;
