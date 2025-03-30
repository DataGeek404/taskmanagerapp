
import { createClient } from '@supabase/supabase-js';

/**
 * Supabase connection URL
 * @constant
 */
const supabaseUrl = 'https://lzljzjmhtoyrthcfitjp.supabase.co';

/**
 * Supabase anonymous key for client-side operations
 * This is a public key that can be exposed in the client
 * @constant
 */
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bGp6am1odG95cnRoY2ZpdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjU3NjYsImV4cCI6MjA1ODkwMTc2Nn0.4coR_AKPhFz5CuEtj5817bVJ-CyYrC5XMcVDwPWRpt4';

/**
 * Initialized Supabase client for database operations
 * @constant
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Available task statuses
 * @typedef {'pending' | 'in-progress' | 'completed'} TaskStatus
 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

/**
 * Task interface representing the structure of a task in the database
 * @interface Task
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Title of the task */
  title: string;
  /** Detailed description of the task */
  description: string;
  /** Current status of the task */
  status: TaskStatus;
  /** ID of the user who owns the task */
  user_id: string;
  /** Timestamp when the task was created */
  created_at: string;
}

/**
 * User interface representing the structure of a user in the database
 * @interface User
 */
export interface User {
  /** Unique identifier for the user */
  id: string;
  /** Email address of the user */
  email: string;
  /** Optional name of the user */
  name?: string;
}
