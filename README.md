
# James Task Manager

A personal task management application built with Next.js Express.js, React, TypeScript, and Supabase.

## Project Overview

James Task Manager is a responsive web application that helps users manage their tasks efficiently. It offers features such as:

- User authentication (sign up, login, logout)
- Task creation, editing, and deletion
- Task status management (pending, in-progress, completed)
- Responsive design for mobile and desktop

## Live Deployment

**Live URL**: https://taskmanagerapp-iota.vercel.app/

## Technology Stack

- **Frontend**: React, TypeScript, Vite, Next.js
- **UI Components**: shadcn-ui, Tailwind CSS
- **State Management**: GraphQL API, React Query
- **Backend & Database**:Express.js Supabase (Authentication, PostgreSQL)
- **Routing**: React Router
- **API Documentation**: Swagger UI

## Project Setup

### Prerequisites

- Node.js (v16+)
- npm (v7+)

### Installation

1. Clone the repository:
```sh
git clone <repository-url>
cd james-task-manager
```

2. Install dependencies:
```sh
npm install
```

3. Start the development server:
```sh
npm run dev
```

This will start the application on http://localhost:5173 (or another port if 5173 is in use).

### Starting the GraphQL Server

Run the GraphQL server separately using:

```sh
node scripts/start-graphql-server.js
```

The GraphQL server will be available at http://localhost:4000/graphql

## API Documentation

API documentation is available via Swagger UI at http://localhost:4000/api-docs when the GraphQL server is running.

### GraphQL API Examples

#### Authentication API Endpoints

- **Sign Up**: `POST /auth/signup`
  ```typescript
  const { error } = await supabase.auth.signUp({
    email: string,
    password: string,
    options: {
      data: { name: string }
    }
  });
  ```

- **Sign In**: `POST /auth/login`
  ```typescript
  const { error } = await supabase.auth.signInWithPassword({
    email: string,
    password: string
  });
  ```

- **Sign Out**: `POST /auth/logout`
  ```typescript
  const { error } = await supabase.auth.signOut();
  ```

- **Get Current Session**: `GET /auth/session`
  ```typescript
  const { data: { session }, error } = await supabase.auth.getSession();
  ```

### Tasks API Endpoints

- **Fetch Tasks**: `GET /tasks`
  ```typescript
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);
  ```

- **Create Task**: `POST /tasks`
  ```typescript
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title: string,
      description: string,
      status: 'pending' | 'in-progress' | 'completed',
      user_id: string
    });
  ```

- **Update Task**: `PATCH /tasks/{taskId}`
  ```typescript
  const { data, error } = await supabase
    .from('tasks')
    .update({
      title: string,
      description: string,
      status: 'pending' | 'in-progress' | 'completed'
    })
    .eq('id', taskId);
  ```

- **Delete Task**: `DELETE /tasks/{taskId}`
  ```typescript
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  ```

## Security Considerations

- Authentication is handled by Supabase which provides secure token-based authentication
- Row Level Security (RLS) is enabled in Supabase to ensure users can only access their own tasks
- Environment variables are used for storing sensitive information
- Input validation is performed using Zod schema validation
- HTTPS is used for all communications with the Supabase backend

## Best Practices

- Component-based architecture for better maintainability
- TypeScript for type safety and improved developer experience
- Context API for state management
- React Query for efficient data fetching and caching
- Tailwind CSS for responsive design
- Shadcn/UI for consistent component styling
- JSDoc documentation for better code readability

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.
