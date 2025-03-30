
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, Task, TaskStatus } from './supabase';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const { toast } = useToast();

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

        if (error) throw error;

        setTasks(data || []);
      } catch (error: any) {
        console.error('Error fetching tasks:', error);
        toast({
          title: 'Error fetching tasks',
          description: error.message || 'Please try again later',
          variant: 'destructive',
        });
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
  }, [user, toast]);

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
