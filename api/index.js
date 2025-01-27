import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from
    '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';

import typeDefs from "./schemas/index.js";
import resolvers from "./resolvers/index.js";
import context from "./context/index.js";

import mongoDbConnect from "./database/connect.js";

import 'dotenv/config';
import cors from 'cors';

// Criar o esquema executável
const schema = makeExecutableSchema({ typeDefs, resolvers })

// Configurar o servidor Express
const app = express();
const httpServer = http.createServer(app);

app.use(express.json());
// NEW: adicionar o middleware CORS
app.use(cors());

try {
	mongoDbConnect();
} catch (error) {
	console.error("Error connecting to MongoDB:", error);
	process.exit(1);
}

const server = new ApolloServer({
    schema,
    plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
});

const startServer = async () => {
	await server.start()
	app.use('/',
		expressMiddleware(server, {
			context
		})
	)
	const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
    });
    useServer({ schema }, wsServer);
    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`Servidor pronto em http://localhost:${PORT}/`);
    });
}

startServer();
