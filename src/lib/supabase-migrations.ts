
import { supabase } from './supabase';
import { useToast } from '@/hooks/use-toast';

export async function setupTasksTable() {
  const { toast } = useToast();
  
  try {
    // Create tasks table if it doesn't exist
    const { error } = await supabase.rpc('create_tasks_table');
    
    if (error && error.message !== 'function "create_tasks_table" does not exist') {
      console.error('Error creating tasks table:', error);
      toast({
        title: 'Database setup error',
        description: 'Could not set up the tasks table. Please try again later.',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error setting up database:', error);
    return false;
  }
}

export async function createCustomFunction() {
  try {
    // First, we'll create the function to set up the tasks table
    const { error: functionError } = await supabase.rpc('create_function_if_not_exists');
    
    if (functionError && !functionError.message.includes('does not exist')) {
      console.error('Error creating custom function:', functionError);
      return false;
    }
    
    // Create the function to set up the tasks table
    const { error } = await supabase.from('_exec').select('*').eq('query', `
      CREATE OR REPLACE FUNCTION create_tasks_table() RETURNS void AS $$
      BEGIN
        CREATE TABLE IF NOT EXISTS public.tasks (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          status TEXT NOT NULL DEFAULT 'pending',
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Create RLS policies
        ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
        
        -- Create policy to allow users to select their own tasks
        DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
        CREATE POLICY "Users can view their own tasks" 
          ON public.tasks 
          FOR SELECT 
          USING (auth.uid() = user_id);
        
        -- Create policy to allow users to insert their own tasks
        DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
        CREATE POLICY "Users can insert their own tasks" 
          ON public.tasks 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
        
        -- Create policy to allow users to update their own tasks
        DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
        CREATE POLICY "Users can update their own tasks" 
          ON public.tasks 
          FOR UPDATE 
          USING (auth.uid() = user_id);
        
        -- Create policy to allow users to delete their own tasks
        DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
        CREATE POLICY "Users can delete their own tasks" 
          ON public.tasks 
          FOR DELETE 
          USING (auth.uid() = user_id);
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    if (error) {
      console.error('Error creating database function:', error);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error creating custom function:', error);
    return false;
  }
}

// Helper function to create the _exec function if it doesn't exist
export async function initializeDatabase() {
  try {
    // Create the _exec function if it doesn't exist
    const { error } = await supabase.from('_exec').select('*').eq('query', `
      CREATE OR REPLACE FUNCTION public.create_function_if_not_exists() RETURNS void AS $$
      BEGIN
        -- Create the _exec table if it doesn't exist
        CREATE TABLE IF NOT EXISTS public._exec (
          id SERIAL PRIMARY KEY,
          query TEXT,
          result TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      END;
      $$ LANGUAGE plpgsql;
    `);
    
    if (error && !error.message.includes('relation "_exec" does not exist')) {
      console.error('Error initializing database:', error);
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return false;
  }
}
