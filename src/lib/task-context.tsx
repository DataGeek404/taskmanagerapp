
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Task, TaskStatus } from './supabase';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { initializeDatabase, createCustomFunction, setupTasksTable, executeDirectSQL } from './supabase-migrations';
import { sendTaskReminderEmail } from './email-service';
import { addHours } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  filter: TaskStatus | 'all';
  setFilter: (filter: TaskStatus | 'all') => void;
  createTask: (title: string, description: string, dueDate?: string | null, notificationsEnabled?: boolean) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  checkDueTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultFilter: TaskStatus | 'all' = 'all';
const emptyTasks: Task[] = [];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(emptyTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(emptyTasks);
  const [filter, setFilter] = useState<TaskStatus | 'all'>(defaultFilter);
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Database initialization
  useEffect(() => {
    async function initDB() {
      if (!user) return;
      
      try {
        console.log("Initializing database...");
        const directSuccess = await executeDirectSQL();
        
        if (directSuccess) {
          console.log("Database initialized with direct SQL");
          setDbInitialized(true);
          return;
        }
        
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

  // Initial fetch and subscription setup
  useEffect(() => {
    fetchTasks();

    if (user) {
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

  // Apply filters to tasks
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  }, [filter, tasks]);

  // Check for tasks due soon to send email notifications
  const checkDueTasks = async () => {
    if (!user) return;

    try {
      // Find tasks that:
      // 1. Have notifications enabled
      // 2. Are not completed
      // 3. Have a due date
      // 4. Due within 12 hours
      const now = new Date();
      const twelveHoursFromNow = addHours(now, 12);
      
      const tasksToNotify = tasks.filter(task => {
        if (!task.due_date || !task.notifications_enabled || task.status === 'completed') {
          return false;
        }
        
        const dueDate = new Date(task.due_date);
        // Check if the task is due in around 12 hours (within a 5-minute window)
        const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursDiff > 11.9 && hoursDiff < 12.1;
      });
      
      if (tasksToNotify.length > 0) {
        console.log(`Found ${tasksToNotify.length} tasks due soon`);
        
        // Send email notifications
        for (const task of tasksToNotify) {
          if (user.email) {
            await sendTaskReminderEmail(user.email, task.title, task.due_date!);
            
            // Update the task to mark that a notification was sent
            await supabase
              .from('tasks')
              .update({ notification_sent: true })
              .eq('id', task.id)
              .eq('user_id', user.id);
          }
        }
      }
    } catch (error: any) {
      console.error('Error checking due tasks:', error);
    }
  };

  // Check for due tasks every 5 minutes
  useEffect(() => {
    if (!user) return;
    
    // Initial check
    checkDueTasks();
    
    // Set up interval
    const interval = setInterval(checkDueTasks, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, [user, tasks]);

  const refreshTasks = async () => {
    await fetchTasks();
  };

  const createTask = async (
    title: string, 
    description: string, 
    dueDate: string | null = null, 
    notificationsEnabled: boolean = false
  ) => {
    try {
      if (!user) throw new Error('You must be logged in to create tasks');

      console.log("Creating task:", { title, description, dueDate, notificationsEnabled });
      
      if (!dbInitialized) {
        await executeDirectSQL();
      }

      const { data, error } = await supabase.from('tasks').insert({
        title,
        description,
        status: 'pending' as TaskStatus,
        user_id: user.id,
        due_date: dueDate,
        notifications_enabled: notificationsEnabled,
      }).select();

      if (error) throw error;

      console.log("Task created:", data);
      
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

  const contextValue: TaskContextType = {
    tasks,
    filteredTasks,
    isLoading,
    filter,
    setFilter,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
    checkDueTasks,
  };

  return (
    <TaskContext.Provider value={contextValue}>
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
