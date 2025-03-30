
# James Task Manager

A modern task management application built with React, TypeScript, and Supabase. This application allows users to create, manage, and organize tasks with a clean, responsive UI.

![James Task Manager Screenshot](https://via.placeholder.com/800x450.png?text=James+Task+Manager)

## Features

- 🔒 User authentication (sign up, login, logout)
- 📋 Create, read, update, and delete tasks
- 🏷️ Task categorization by status (pending, in-progress, completed)
- 📱 Responsive design for all devices
- 🌙 Dark mode support
- ⚡ Realtime updates via Supabase

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **State Management**: React Context API, Tanstack Query
- **Routing**: React Router
- **Build Tool**: Vite

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account (for database and authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/james-task-manager.git
   cd james-task-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Database Setup

The application will attempt to set up the necessary database tables automatically. If you encounter any issues, you can manually create the required tables using the SQL scripts provided in the `/db-setup` page of the application (accessible to authenticated users).

## Database Schema

### Tasks Table

```sql
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('pending', 'in-progress', 'completed')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Add row level security (RLS) policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own tasks
CREATE POLICY "Users can only access their own tasks" 
  ON public.tasks 
  FOR ALL 
  USING (auth.uid() = user_id);
```

## API Documentation

This application uses Supabase as the backend, which provides a RESTful API interface.

### Authentication API

#### Sign Up

```typescript
// Register a new user
const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  // Handle result
};
```

#### Sign In

```typescript
// Sign in an existing user
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  // Handle result
};
```

#### Sign Out

```typescript
// Sign out the current user
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  // Handle result
};
```

### Tasks API

#### Get Tasks

```typescript
// Fetch all tasks for the current user
const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  // Handle result
};
```

#### Create Task

```typescript
// Create a new task
const createTask = async (title: string, description: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      description,
      status: 'pending',
      user_id: user.id,
    })
    .select();
  // Handle result
};
```

#### Update Task

```typescript
// Update an existing task
const updateTask = async (id: string, data: Partial<Task>) => {
  const { error } = await supabase
    .from('tasks')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.id);
  // Handle result
};
```

#### Delete Task

```typescript
// Delete a task
const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);
  // Handle result
};
```

## Deployment

The application is deployed and available at the following URL:

- [Production](https://james-task-manager.lovable.app)
- [Staging](https://dev.james-task-manager.lovable.app)

### Deployment Process

1. Push changes to the main branch to trigger a production build
2. Push changes to the development branch to trigger a staging build
3. The CI/CD pipeline will automatically build and deploy the application

## Best Practices

### Code Structure

- Component-based architecture
- Separation of concerns (business logic, UI components, state management)
- Custom hooks for reusable logic
- Context API for global state management

### Error Handling

- Comprehensive error handling for all API calls
- User-friendly error messages with toast notifications
- Console logging for debugging purposes

### Security

- Authentication with Supabase Auth
- Row Level Security (RLS) policies in Supabase
- Environment variables for sensitive information
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
