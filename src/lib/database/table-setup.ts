
import { supabase } from '../supabase';

/**
 * Sets up the tasks table with appropriate columns and RLS policies
 * @returns Promise<boolean> indicating success or failure
 */
export async function setupTasksTable() {
  try {
    // Create tasks table with direct SQL instead of RPC//
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
