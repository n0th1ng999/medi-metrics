import { ApolloServer } from "apollo-server";
import typeDefs from "./schemas/index.js";
import resolvers from "./resolvers/index.js";
import mongoDbConnect from "./database/connect.js";

try {
	mongoDbConnect();
} catch (error) {
	console.error("Error connecting to MongoDB:", error);
	process.exit(1);
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
