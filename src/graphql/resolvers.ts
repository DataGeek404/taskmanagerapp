
import { supabase } from '../lib/supabase';
import type { Task } from '../lib/supabase';

export const resolvers = {
  Query: {
    tasks: async (_: any, __: any, context: { userId: string }) => {
      if (!context.userId) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', context.userId);
      
      if (error) throw error;
      return data;
    },
    
    task: async (_: any, { id }: { id: string }, context: { userId: string }) => {
      if (!context.userId) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .eq('user_id', context.userId)
        .single();
      
      if (error) throw error;
      return data;
    }
  },
  
  Mutation: {
    createTask: async (_: any, { title, description, status = 'pending' }: { title: string, description?: string, status?: string }, context: { userId: string }) => {
      if (!context.userId) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          status,
          user_id: context.userId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    updateTask: async (_: any, { id, ...updates }: { id: string, [key: string]: any }, context: { userId: string }) => {
      if (!context.userId) throw new Error('Authentication required');
      
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', context.userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    
    deleteTask: async (_: any, { id }: { id: string }, context: { userId: string }) => {
      if (!context.userId) throw new Error('Authentication required');
      
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', context.userId);
      
      if (error) throw error;
      return true;
    }
  }
};
