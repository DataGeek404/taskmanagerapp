

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { supabase } from '../lib/supabase';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument, getGraphQLOperationsDoc } from './swagger';

// Create an Express application
const app = express();
const httpServer = http.createServer(app);

// Setup Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Start the server and setup middleware
async function startServer() {
  await server.start();

  // Set up Swagger UI
  const fullSwaggerDoc = {
    ...swaggerDocument,
    ...getGraphQLOperationsDoc(),
  };
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(fullSwaggerDoc, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'James Task Manager API Documentation',
  }));

  // Apply middleware - fixing the type error by using individual middleware calls
  app.use('/graphql', cors<cors.CorsRequest>());
  app.use('/graphql', bodyParser.json());
  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.replace('Bearer ', '') || '';
      
      if (!token) return { userId: null };
      
      // Verify the token with Supabase
      const { data, error } = await supabase.auth.getUser(token);
      
      if (error || !data.user) return { userId: null };
      
      return { userId: data.user.id };
    },
  }));

  // Add health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).send('GraphQL server is running');
  });

  // Start the server
  await new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 GraphQL Server ready at http://localhost:4000/graphql`);
  console.log(`📚 API Documentation available at http://localhost:4000/api-docs`);
}

// Handle server startup
if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start GraphQL server:', err);
  });
}

export { startServer };
