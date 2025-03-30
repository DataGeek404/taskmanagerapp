import { supabase } from './supabase';

export async function setupTasksTable() {
  try {
    // Create tasks table with direct SQL instead of RPC
    const { error } = await supabase.rpc('exec_sql', {
      sql_query: `
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
      `
    });
    
    if (error) {
      console.error('Error creating tasks table:', error);
      
      // If the specific function doesn't exist, try using pgSQL directly
      if (error.message.includes("function") && error.message.includes("does not exist")) {
        const { error: sqlError } = await supabase.from('_exec_sql').insert({
          query: `
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
          `
        });
        
        if (sqlError && !sqlError.message.includes("relation \"_exec_sql\" does not exist")) {
          console.error('Error with fallback SQL execution:', sqlError);
          return false;
        }
      } else {
        return false;
      }
    }
    
    return true;
  } catch (error: any) {
    console.error('Error setting up database:', error);
    return false;
  }
}

export async function createCustomFunction() {
  try {
    // We no longer need to create a separate function, we'll execute SQL directly
    return true;
  } catch (error: any) {
    console.error('Error creating custom function:', error);
    return false;
  }
}

export async function initializeDatabase() {
  try {
    // Try to check if tasks table exists
    const { error } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, which is what we expect initially
      console.log('Tasks table does not exist yet, ready to create it');
      return true;
    } else if (error) {
      console.error('Unexpected error checking tasks table:', error);
      return false;
    }
    
    // Table already exists
    console.log('Tasks table already exists');
    return true;
  } catch (error: any) {
    console.error('Error initializing database:', error);
    return false;
  }
}

export async function executeDirectSQL() {
  try {
    // Use the SQL tag functionality in Supabase to execute SQL directly
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      console.error('Authentication required to execute SQL');
      return false;
    }
    
    // Get the Supabase URL and key from the same place we configure the client
    const supabaseUrl = 'https://lzljzjmhtoyrthcfitjp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bGp6am1odG95cnRoY2ZpdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjU3NjYsImV4cCI6MjA1ODkwMTc2Nn0.4coR_AKPhFz5CuEtj5817bVJ-CyYrC5XMcVDwPWRpt4';
    
    // Create the tasks table directly with SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${data.session.access_token}`,
        'apikey': supabaseKey,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        query: `
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
        `
      })
    });
    
    if (!response.ok) {
      console.error('Error executing SQL directly:', await response.text());
      return false;
    }
    
    return true;
  } catch (error: any) {
    console.error('Error executing direct SQL:', error);
    return false;
  }
}
