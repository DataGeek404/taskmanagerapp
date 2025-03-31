//tasks services implementation

import { supabase, Task, TaskStatus } from './supabase';
import { useToast } from '@/hooks/use-toast';
import { executeDirectSQL } from './database';

/**
 * Fetches all tasks for a user
 * @param userId The user's ID
 * @param toast Toast notification function
 * @returns Array of tasks or empty array
 */
export const fetchUserTasks = async (
  userId: string | undefined,
  toast: ReturnType<typeof useToast>['toast']
): Promise<Task[]> => {
  if (!userId) {
    return [];
  }

  try {
    console.log("Fetching tasks for user:", userId);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (error.code === '42P01') {
        console.warn('Tasks table does not exist yet. It will be created when you add your first task.');
        return [];
      } else {
        throw error;
      }
    } else {
      console.log("Tasks fetched:", data?.length || 0);
      return data || [];
    }
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    if (error.code !== '42P01') {
      toast({
        title: 'Error fetching tasks',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    }
    return [];
  }
};

/**
 * Creates a new task
 * @param task The task to create
 * @param userId The user's ID
 * @param dbInitialized Whether the database is initialized
 * @param toast Toast notification function
 * @returns Whether the operation was successful
 */
export const createUserTask = async (
  taskData: { title: string, description: string },
  userId: string,
  dbInitialized: boolean,
  toast: ReturnType<typeof useToast>['toast']
): Promise<boolean> => {
  try {
    if (!userId) throw new Error('You must be logged in to create tasks');

    console.log("Creating task:", taskData);
    
    if (!dbInitialized) {
      await executeDirectSQL();
    }

    const { data, error } = await supabase.from('tasks').insert({
      title: taskData.title,
      description: taskData.description,
      status: 'pending' as TaskStatus,
      user_id: userId,
    }).select();

    if (error) throw error;

    console.log("Task created:", data);
    
    toast({
      title: 'Task created',
      description: 'Your task has been created successfully',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error creating task:', error);
    toast({
      title: 'Error creating task',
      description: error.message || 'Please try again later',
      variant: 'destructive',
    });
    throw error;
  }
};

/**
 * Updates an existing task
 * @param id The task ID
 * @param data The task data to update
 * @param userId The user's ID
 * @param toast Toast notification function
 * @returns Whether the operation was successful
 */
export const updateUserTask = async (
  id: string,
  data: Partial<Task>,
  userId: string,
  toast: ReturnType<typeof useToast>['toast']
): Promise<boolean> => {
  try {
    if (!userId) throw new Error('You must be logged in to update tasks');

    console.log("Updating task:", id, data);
    
    const { error } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    toast({
      title: 'Task updated',
      description: 'Your task has been updated successfully',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error updating task:', error);
    toast({
      title: 'Error updating task',
      description: error.message || 'Please try again later',
      variant: 'destructive',
    });
    throw error;
  }
};

/**
 * Deletes a task
 * @param id The task ID
 * @param userId The user's ID
 * @param toast Toast notification function
 * @returns Whether the operation was successful
 */
export const deleteUserTask = async (
  id: string,
  userId: string,
  toast: ReturnType<typeof useToast>['toast']
): Promise<boolean> => {
  try {
    if (!userId) throw new Error('You must be logged in to delete tasks');

    console.log("Deleting task:", id);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;

    toast({
      title: 'Task deleted',
      description: 'Your task has been deleted successfully',
    });
    
    return true;
  } catch (error: any) {
    console.error('Error deleting task:', error);
    toast({
      title: 'Error deleting task',
      description: error.message || 'Please try again later',
      variant: 'destructive',
    });
    throw error;
  }
};
