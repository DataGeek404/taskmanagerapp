
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';
import { initializeDatabase, createCustomFunction, setupTasksTable, executeDirectSQL } from '@/lib/supabase-migrations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const DatabaseSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sqlQuery, setSqlQuery] = useState<string>(`
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own tasks
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own tasks
DROP POLICY IF EXISTS "Users can insert their own tasks" ON public.tasks;
CREATE POLICY "Users can insert their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own tasks
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own tasks
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = user_id);
  `);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInitializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try all available methods to create the database
      await initializeDatabase();
      
      // Try the direct SQL execution approach
      const success = await executeDirectSQL();
      
      if (success) {
        setSuccess(true);
        toast({
          title: 'Database initialized',
          description: 'Your database has been set up successfully!',
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // If all automated methods fail, we'll let the user know they need to set up manually
        setError('Automated database initialization failed. Please use the SQL editor in Supabase to run the SQL queries manually.');
        toast({
          title: 'Database setup error',
          description: 'Could not set up the database automatically. Please try the manual approach.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error initializing database:', error);
      setError(error.message || 'An unexpected error occurred');
      toast({
        title: 'Database setup error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            Initialize your database to start using the task manager
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                Database initialized successfully. Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              This will create the necessary tables and set up row-level security for your tasks.
              You only need to do this once.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Manual Setup Instructions:</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If the automatic setup fails, you can copy the SQL below and run it in the Supabase SQL Editor:
              </p>
              
              <Textarea 
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="font-mono text-xs h-80"
              />
              
              <ol className="list-decimal pl-5 text-sm space-y-1 text-gray-500 dark:text-gray-400">
                <li>Go to your Supabase dashboard</li>
                <li>Navigate to the SQL Editor</li>
                <li>Create a new query</li>
                <li>Paste the SQL above</li>
                <li>Run the query</li>
                <li>Return to this app and refresh the page</li>
              </ol>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleInitializeDatabase} 
            disabled={isLoading || success}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : success ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Initialized
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Try Automatic Setup
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseSetup;
