//using task filters

import { useState, useEffect } from 'react';
import { Task, TaskStatus } from './supabase';

/**
 * Hook to filter tasks based on status
 * @param tasks The array of tasks to filter
 * @returns Filtered tasks and filter state controls
 */
export const useTaskFilter = (tasks: Task[]) => {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  
  useEffect(() => {
    if (filter === 'all') {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter));
    }
  }, [filter, tasks]);
  
  return {
    filteredTasks,
    filter,
    setFilter
  };
};
