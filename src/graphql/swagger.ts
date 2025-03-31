//import OpenAPIV3

import { OpenAPIV3 } from 'openapi3-ts';

// Define the OpenAPI specification
export const swaggerDocument: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'James Task Manager API',
    version: '1.0.0',
    description: 'API documentation for James Task Manager GraphQL API',
  },
  servers: [
    {
      url: 'http://localhost:4000',
      description: 'Development server',
    },
  ],
  paths: {
    '/graphql': {
      post: {
        summary: 'GraphQL endpoint',
        description: 'Send GraphQL queries and mutations to this endpoint',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['query'],
                properties: {
                  query: {
                    type: 'string',
                    description: 'GraphQL query/mutation string',
                  },
                  variables: {
                    type: 'object',
                    description: 'Variables for the GraphQL query/mutation',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
    '/health': {
      get: {
        summary: 'Health check endpoint',
        description: 'Use this endpoint to check if the server is running',
        responses: {
          '200': {
            description: 'Server is running',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'GraphQL server is running',
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Task: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the task',
          },
          title: {
            type: 'string',
            description: 'Title of the task',
          },
          description: {
            type: 'string',
            description: 'Description of the task',
            nullable: true,
          },
          status: {
            type: 'string',
            description: 'Current status of the task',
            enum: ['pending', 'in-progress', 'completed'],
          },
          user_id: {
            type: 'string',
            description: 'ID of the user who owns the task',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'When the task was created',
          },
          updated_at: {
            type: 'string',
            format: 'date-time',
            description: 'When the task was last updated',
            nullable: true,
          },
        },
        required: ['id', 'title', 'status', 'user_id', 'created_at'],
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer {token}',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export const getGraphQLOperationsDoc = () => {
  return {
    tags: [
      {
        name: 'Tasks',
        description: 'Operations related to tasks',
      },
    ],
    paths: {
      '/graphql': {
        post: {
          tags: ['Tasks'],
          summary: 'Query: Get all tasks',
          description: 'Example query to fetch all tasks for the authenticated user',
          requestBody: {
            content: {
              'application/json': {
                examples: {
                  getAllTasks: {
                    summary: 'Get all tasks',
                    value: {
                      query: `
                        query {
                          tasks {
                            id
                            title
                            description
                            status
                            created_at
                            updated_at
                          }
                        }
                      `,
                    },
                  },
                  getTaskById: {
                    summary: 'Get task by ID',
                    value: {
                      query: `
                        query($id: ID!) {
                          task(id: $id) {
                            id
                            title
                            description
                            status
                            created_at
                            updated_at
                          }
                        }
                      `,
                      variables: {
                        id: "task-id-here",
                      },
                    },
                  },
                  createTask: {
                    summary: 'Create a new task',
                    value: {
                      query: `
                        mutation($title: String!, $description: String, $status: String) {
                          createTask(title: $title, description: $description, status: $status) {
                            id
                            title
                            description
                            status
                          }
                        }
                      `,
                      variables: {
                        title: "New Task",
                        description: "Task description",
                        status: "pending"
                      },
                    },
                  },

                  updateTask: {
                    summary: 'Update an existing task',
                    value: {
                      query: `
                        mutation($id: ID!, $title: String, $description: String, $status: String) {
                          updateTask(id: $id, title: $title, description: $description, status: $status) {
                            id
                            title
                            description
                            status
                          }
                        }
                      `,
                      variables: {
                        id: "task-id-here",
                        title: "Updated Task Title",
                        status: "completed"
                      },
                    },
                  },
                  deleteTask: {
                    summary: 'Delete a task',
                    value: {
                      query: `
                        mutation($id: ID!) {
                          deleteTask(id: $id)
                        }
                      `,
                      variables: {
                        id: "task-id-here"
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
};
