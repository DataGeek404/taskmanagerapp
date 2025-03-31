//using real-time subscription to task changes

import { useEffect } from 'react';
import { supabase } from './supabase';

/**
 * Sets up a real-time subscription to task changes for a user
 * @param userId The user's ID
 * @param onDataChange Callback function when data changes
 * @returns A cleanup function for the subscription
 */
export const useTaskSubscription = (
  userId: string | undefined,
  onDataChange: () => void
) => {
  useEffect(() => {
    if (!userId) return;
    
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Database change detected:', payload);
          onDataChange();
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [userId, onDataChange]);
};
