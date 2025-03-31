
import { supabase } from '../supabase';

/**
 * Creates a custom function for SQL execution (legacy)
 * @returns Promise<boolean> indicating success
 */
export async function createCustomFunction() {
  try {
    // We no longer need to create a separate function, we'll execute SQL directly//
    return true;
  } catch (error: any) {
    console.error('Error creating custom function:', error);
    return false;
  }
}

/**
 * Executes SQL directly to create the tasks table
 * @returns Promise<boolean> indicating success or failure
 */
export async function executeDirectSQL() {
  try {
    // Use the SQL tag functionality in Supabase to execute SQL directly
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error('Authentication required to execute SQL');
      return false;
    }
    
    // Use our direct SQL script
    const supabaseUrl = 'https://lzljzjmhtoyrthcfitjp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bGp6am1odG95cnRoY2ZpdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjU3NjYsImV4cCI6MjA1ODkwMTc2Nn0.4coR_AKPhFz5CuEtj5817bVJ-CyYrC5XMcVDwPWRpt4';
    
    // First try a simple query to check if the table exists
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/tasks?select=id&limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.session.access_token}`,
        'apikey': supabaseKey,
      }
    });
    
    // If the table exists, no need to create it
    if (checkResponse.ok) {
      console.log('Tasks table already exists');
      return true;
    }
    
    console.log('Tasks table not found, creating it...');
    
    // Create the table via SQL
    const sqlQuery = `
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
    `;
    
    // Try using the SQL API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.session.access_token}`,
        'apikey': supabaseKey,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({ query: sqlQuery })
    });
    
    if (!response.ok) {
      console.error('Error executing SQL directly:', await response.text());
      
      // Try using RPC as a fallback
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        sql_query: sqlQuery
      });
      
      if (rpcError) {
        console.error('Error with RPC fallback:', rpcError);
        return false;
      }
    }
    
    console.log('Tasks table created successfully');
    return true;
  } catch (error: any) {
    console.error('Error executing direct SQL:', error);
    return false;
  }
}
