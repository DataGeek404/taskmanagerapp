
import { gql } from 'graphql-tag';

// Define GraphQL schema using SDL (Schema Definition Language)
export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    user_id: String!
    created_at: String!
    updated_at: String
  }

  type Query {
    tasks: [Task]
    task(id: ID!): Task
  }

  type Mutation {
    createTask(title: String!, description: String, status: String): Task
    updateTask(id: ID!, title: String, description: String, status: String): Task
    deleteTask(id: ID!): Boolean
  }
`;
