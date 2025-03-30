
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from './supabase';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  initializeTaskDatabase, 
  checkTasksTableExists 
} from './db-initializer';
import { 
  fetchUserTasks, 
  createUserTask, 
  updateUserTask, 
  deleteUserTask 
} from './task-service';
import { useTaskFilter } from './use-task-filter';
import { useTaskSubscription } from './use-task-subscription';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  filter: TaskStatus | 'all';
  setFilter: (filter: TaskStatus | 'all') => void;
  createTask: (title: string, description: string, dueDate?: string | null) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const defaultFilter: TaskStatus | 'all' = 'all';
const emptyTasks: Task[] = [];

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(emptyTasks);
  const [isLoading, setIsLoading] = useState(true);
  const [dbInitialized, setDbInitialized] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { filteredTasks, filter, setFilter } = useTaskFilter(tasks);

  // Database initialization
  useEffect(() => {
    async function initDB() {
      if (!user) return;
      
      const isInitialized = await initializeTaskDatabase(user.id, toast);
      setDbInitialized(isInitialized);
    }
    
    initDB();
  }, [user, toast]);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const tasksData = await fetchUserTasks(user.id, toast);
      setTasks(tasksData);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  // Initial fetch
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, dbInitialized]);

  // Set up real-time subscription
  useTaskSubscription(user?.id, fetchTasks);

  const refreshTasks = async () => {
    await fetchTasks();
  };

  const createTask = async (
    title: string, 
    description: string, 
    dueDate: string | null = null
  ) => {
    if (!user) throw new Error('You must be logged in to create tasks');
    
    await createUserTask(
      { title, description, dueDate },
      user.id,
      dbInitialized,
      toast
    );
    
    await fetchTasks();
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    if (!user) throw new Error('You must be logged in to update tasks');
    
    await updateUserTask(id, data, user.id, toast);
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('You must be logged in to delete tasks');
    
    await deleteUserTask(id, user.id, toast);
    await fetchTasks();
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
