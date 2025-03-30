
import { supabase } from './supabase';
import { 
  executeDirectSQL, 
  initializeDatabase, 
  createCustomFunction, 
  setupTasksTable 
} from './database';
import { useToast } from '@/hooks/use-toast';

/**
 * Initializes the database for tasks
 * @param userId The current user's ID
 * @param toast Toast notification function
 * @returns Whether database initialization was successful
 */
export const initializeTaskDatabase = async (userId: string, toast: ReturnType<typeof useToast>['toast']): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    console.log("Initializing database...");
    const directSuccess = await executeDirectSQL();
    
    if (directSuccess) {
      console.log("Database initialized with direct SQL");
      return true;
    }
    
    const initSuccess = await initializeDatabase();
    
    if (initSuccess) {
      await createCustomFunction();
      const setupSuccess = await setupTasksTable();
      
      if (setupSuccess) {
        console.log("Database initialized with RPC method");
        return true;
      } else {
        console.error("Failed to set up tasks table");
        toast({
          title: 'Database initialization warning',
          description: 'Could not set up the database automatically. Some features might require manual setup.',
          variant: 'destructive',
        });
        return false;
      }
    } else {
      console.error("Failed to initialize database");
      toast({
        title: 'Database initialization warning',
        description: 'Could not initialize the database. Some features might require manual setup.',
        variant: 'destructive',
      });
      return false;
    }
  } catch (error: any) {
    console.error('Database initialization error:', error);
    toast({
      title: 'Database initialization error',
      description: error.message || 'Could not set up the database automatically.',
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Checks if the tasks table exists in the database
 * @returns Promise<boolean> indicating if the table exists
 */
export const checkTasksTableExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    return !error || error.code !== '42P01';
  } catch (error) {
    console.error('Error checking tasks table:', error);
    return false;
  }
};
