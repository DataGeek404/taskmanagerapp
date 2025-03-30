
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lzljzjmhtoyrthcfitjp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bGp6am1odG95cnRoY2ZpdGpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjU3NjYsImV4cCI6MjA1ODkwMTc2Nn0.4coR_AKPhFz5CuEtj5817bVJ-CyYrC5XMcVDwPWRpt4';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  user_id: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}
