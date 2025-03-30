
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Task, TaskStatus } from './supabase';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { initializeDatabase, createCustomFunction, setupTasksTable } from './supabase-migrations';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  filter: TaskStatus | 'all';
  setFilter: (filter: TaskStatus | 'all') => void;
  createTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Initialize database when the app loads
  useEffect(() => {
    async function initDB() {
      if (!user) return;
      
      try {
        // Initialize database structure
        await initializeDatabase();
        await createCustomFunction();
        const success = await setupTasksTable();
        
        if (success) {
          setDbInitialized(true);
        } else {
          toast({
            title: 'Database initialization error',
            description: 'Could not set up the database. Some features might not work properly.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Database initialization error:', error);
        toast({
          title: 'Database initialization error',
          description: error.message || 'Could not set up the database.',
          variant: 'destructive',
        });
      }
    }
    
    initDB();
  }, [user, toast]);

  // Fetch tasks when user changes
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setFilteredTasks([]);
      setIsLoading(false);
      return;
    }

    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          // If the error is because the table doesn't exist, show a more user-friendly message
          if (error.code === '42P01') {
            console.warn('Tasks table does not exist yet. It will be created when you add your first task.');
            setTasks([]);
          } else {
            throw error;
          }
        } else {
          setTasks(data || []);
        }
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        // Only show toast for errors that are not related to the table not existing
        if (error.code !== '42P01') {
          toast({
            title: 'Error fetching tasks',
            description: error.message || 'Please try again later',
            variant: 'destructive',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    // Subscribe to changes
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${user.id}`
        }, 
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [user, toast, dbInitialized]);

  // Filter tasks when filter or tasks change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  }, [filter, tasks]);

  const createTask = async (title: string, description: string) => {
    try {
      if (!user) throw new Error('You must be logged in to create tasks');

      // Check if the database has been initialized
      if (!dbInitialized) {
        // Try to initialize it again
        await initializeDatabase();
        await createCustomFunction();
        await setupTasksTable();
      }

      const { error } = await supabase.from('tasks').insert({
        title,
        description,
        status: 'pending' as TaskStatus,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Task created',
        description: 'Your task has been created successfully',
      });
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

  const updateTask = async (id: string, data: Partial<Task>) => {
    try {
      if (!user) throw new Error('You must be logged in to update tasks');

      const { error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully',
      });
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

  const deleteTask = async (id: string) => {
    try {
      if (!user) throw new Error('You must be logged in to delete tasks');

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully',
      });
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

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        isLoading,
        filter,
        setFilter,
        createTask,
        updateTask,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
