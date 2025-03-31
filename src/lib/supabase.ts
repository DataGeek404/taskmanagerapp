//Supabase client configuration
/**
 * Supabase client configuration and database types for the application.
 * This module initializes the Supabase client and defines types for database entities.
 */
import { createClient } from '@supabase/supabase-js';

/** Supabase project URL */
const supabaseUrl = 'https://lzljzjmhtoyrthcfitjp.supabase.co';
/** Supabase anon key - safe to use in browser */
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bGp6am1odG95cnRoY2ZpdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjU3NjYsImV4cCI6MjA1ODkwMTc2Nn0.4coR_AKPhFz5CuEtj5817bVJ-CyYrC5XMcVDwPWRpt4';

/**
 * Initialized Supabase client with project credentials
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Available task status values
 */
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

/**
 * Task entity structure in the database
 */
export interface Task {
  /** Unique task identifier */
  id: string;
  /** Task title */
  title: string;
  /** Task description */
  description: string;
  /** Current task status */
  status: TaskStatus;
  /** User ID who owns this task */
  user_id: string;
  /** Task creation timestamp */
  created_at: string;
}

/**
 * User entity structure in the database
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User email address */
  email: string;
  /** Optional user display name */
  name?: string;
}
