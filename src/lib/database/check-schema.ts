
import { supabase } from '../supabase';

/**
 * Checks if the database has been initialized
 * @returns Promise<boolean> indicating if database is initialized
 */
export async function initializeDatabase() {
  try {
    // Try to check if tasks table exists
    const { error } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist, which is what we expect initially
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
