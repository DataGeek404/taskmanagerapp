
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Task, TaskStatus } from './supabase';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { initializeDatabase, createCustomFunction, setupTasksTable, executeDirectSQL } from './supabase-migrations';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  filter: TaskStatus | 'all';
  setFilter: (filter: TaskStatus | 'all') => void;
  createTask: (title: string, description: string) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
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
        console.log("Initializing database...");
        // First try using executeDirectSQL which directly creates the table
        const directSuccess = await executeDirectSQL();
        
        if (directSuccess) {
          console.log("Database initialized with direct SQL");
          setDbInitialized(true);
          return;
        }
        
        // If direct SQL fails, try the other methods
        const initSuccess = await initializeDatabase();
        
        if (initSuccess) {
          await createCustomFunction();
          const setupSuccess = await setupTasksTable();
          
          if (setupSuccess) {
            console.log("Database initialized with RPC method");
            setDbInitialized(true);
          } else {
            console.error("Failed to set up tasks table");
            toast({
              title: 'Database initialization warning',
              description: 'Could not set up the database automatically. Some features might require manual setup.',
              variant: 'destructive',
            });
          }
        } else {
          console.error("Failed to initialize database");
          toast({
            title: 'Database initialization warning',
            description: 'Could not initialize the database. Some features might require manual setup.',
            variant: 'destructive',
          });
        }
      } catch (error: any) {
        console.error('Database initialization error:', error);
        toast({
          title: 'Database initialization error',
          description: error.message || 'Could not set up the database automatically.',
          variant: 'destructive',
        });
      }
    }
    
    initDB();
  }, [user, toast]);

  // Function to fetch tasks
  const fetchTasks = async () => {
    if (!user) {
      setTasks([]);
      setFilteredTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log("Fetching tasks for user:", user.id);
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
        console.log("Tasks fetched:", data?.length || 0);
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

  // Fetch tasks when user changes or database is initialized
  useEffect(() => {
    fetchTasks();

    // Only set up subscription if user exists
    if (user) {
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
          (payload) => {
            console.log('Database change detected:', payload);
            fetchTasks();
          }
        )
        .subscribe();

      return () => {
        tasksSubscription.unsubscribe();
      };
    }
  }, [user, dbInitialized]);

  // Filter tasks when filter or tasks change
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  }, [filter, tasks]);

  // Public method to refresh tasks
  const refreshTasks = async () => {
    await fetchTasks();
  };

  const createTask = async (title: string, description: string) => {
    try {
      if (!user) throw new Error('You must be logged in to create tasks');

      console.log("Creating task:", { title, description });
      
      // Attempt to initialize database if not already done
      if (!dbInitialized) {
        await executeDirectSQL();
      }

      const { data, error } = await supabase.from('tasks').insert({
        title,
        description,
        status: 'pending' as TaskStatus,
        user_id: user.id,
      }).select();

      if (error) throw error;

      console.log("Task created:", data);
      
      // Fetch tasks to update the list
      fetchTasks();
      
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

      console.log("Updating task:", id, data);
      
      const { error } = await supabase
        .from('tasks')
        .update(data)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Fetch tasks to update the list
      fetchTasks();

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

      console.log("Deleting task:", id);
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Fetch tasks to update the list
      fetchTasks();

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
        refreshTasks,
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
