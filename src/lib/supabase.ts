
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wrboofbntzwwcdbojyfw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyYm9vZmJudHp3d2NkYm9qeWZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzMjMzNjYsImV4cCI6MjA1ODg5OTM2Nn0.lHVWroUy2hwJ_6jdHWNFWvtob11j4wncmUJk4ojPm1k';

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
