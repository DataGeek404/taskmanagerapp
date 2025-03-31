
import { useState } from 'react';
import { executeGraphQL } from '../graphql/client';
import { useAuth } from '../lib/auth-context';

export function useGraphQL() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { session } = useAuth();
  
  async function query<T>(
    queryString: string, 
    variables: Record<string, any> = {}
  ): Promise<T | null> {
    try {
      setLoading(true);
      setError(null);
      
      const token = session?.access_token;
      const data = await executeGraphQL(queryString, variables, token);
      
      return data as T;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  }
  
  return { query, loading, error };
}
