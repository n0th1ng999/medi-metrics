import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";
const context = async ({ req, res }) => {
	return {
		verifyToken: () => {
			if (!req.headers.authorization) {
				throw new GraphQLError("Authentication token is required");
			}

			const token = req.headers.authorization.split(" ")[1];

			const isValid = jwt.verify(token, "secret");

			if (!isValid) {
				throw new GraphQLError("Invalid token", {
					code: "Unauthorized",
					http: {
						status: 401,
					},
				});
			}

			const decodedToken = jwt.decode(token, "secret");

			return decodedToken;
		},
	};
};

export default context;
