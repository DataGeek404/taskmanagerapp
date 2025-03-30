
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { initializeDatabase, createCustomFunction, setupTasksTable } from '@/lib/supabase-migrations';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const DatabaseSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInitializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize database
      await initializeDatabase();
      await createCustomFunction();
      const success = await setupTasksTable();
      
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
        setError('Database initialization failed. Please try again.');
        toast({
          title: 'Database setup error',
          description: 'Could not set up the database. Please try again.',
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
      <Card className="w-full max-w-md">
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
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This will create the necessary tables and set up row-level security for your tasks.
            You only need to do this once.
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleInitializeDatabase} 
            disabled={isLoading || success}
            className="w-full"
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
              'Initialize Database'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseSetup;
