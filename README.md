
# James Task Manager

A personal task management application built with React, TypeScript, and Supabase.

![James Task Manager](https://i.imgur.com/8db90c00.png)

## Project Overview

James Task Manager is a responsive web application that helps users manage their tasks efficiently. It offers features such as:

- User authentication (sign up, login, logout)
- Task creation, editing, and deletion
- Task status management (pending, in-progress, completed)
- Responsive design for mobile and desktop

## Live Deployment

**Live URL**: [https://preview--taskoriq.lovable.app](https://preview--taskoriq.lovable.app)

## Technology Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn-ui, Tailwind CSS
- **State Management**: React Context API, React Query
- **Backend & Database**: Supabase (Authentication, PostgreSQL)
- **Routing**: React Router

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

## Project Structure

```
src/
├── components/       # UI components
│   ├── auth/         # Authentication components
│   ├── layout/       # Layout components
│   ├── routes/       # Routing components
│   ├── tasks/        # Task-related components
│   └── ui/           # UI components from shadcn
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries and contexts
├── pages/            # Page components
└── main.tsx          # Application entry point
```

## API Documentation

### Authentication API

James Task Manager uses Supabase Authentication for user management.

#### Authentication Endpoints:

- **Sign Up**:
  ```typescript
  const { error } = await supabase.auth.signUp({
    email: string,
    password: string,
    options: {
      data: { name: string }
    }
  });
  ```

- **Sign In**:
  ```typescript
  const { error } = await supabase.auth.signInWithPassword({
    email: string,
    password: string
  });
  ```

- **Sign Out**:
  ```typescript
  const { error } = await supabase.auth.signOut();
  ```

- **Get Session**:
  ```typescript
  const { data: { session }, error } = await supabase.auth.getSession();
  ```

### Tasks API

Tasks are stored in the Supabase database and accessed through the client SDK.

#### Task Object Structure:

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  user_id: string;
  created_at: string;
}
```

#### Task Endpoints:

- **Fetch Tasks**:
  ```typescript
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);
  ```

- **Create Task**:
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

- **Update Task**:
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

- **Delete Task**:
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
