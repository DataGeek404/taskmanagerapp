
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { executeDirectSQL, setupTasksTable } from '@/lib/supabase-migrations';
import { useToast } from '@/hooks/use-toast';

const DatabaseSetup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSetupDatabase = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try direct SQL approach first
      const directSuccess = await executeDirectSQL();
      
      if (directSuccess) {
        console.log("Database initialized with direct SQL");
        setSetupComplete(true);
        toast({
          title: 'Database setup complete',
          description: 'Your database has been set up successfully',
        });
        return;
      }
      
      // If direct approach fails, try RPC method
      const setupSuccess = await setupTasksTable();
      
      if (setupSuccess) {
        console.log("Database initialized with RPC method");
        setSetupComplete(true);
        toast({
          title: 'Database setup complete',
          description: 'Your database has been set up successfully',
        });
      } else {
        throw new Error("Could not set up the database automatically. Please try again later.");
      }
    } catch (error: any) {
      console.error('Database setup error:', error);
      setError(error.message || 'An unknown error occurred');
      toast({
        title: 'Database setup error',
        description: error.message || 'Could not set up the database automatically.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center mb-6">
          <Database className="h-6 w-6 mr-2 text-primary" />
          <h1 className="text-2xl font-bold">Database Setup</h1>
        </div>
        
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-medium">Database initialization required</AlertTitle>
            <AlertDescription>
              <p className="mb-4">
                Your database needs to be set up before you can start creating tasks. 
                This only needs to be done once.
              </p>
              <p>
                Click the button below to automatically set up your database tables 
                with the proper structure and security policies.
              </p>
            </AlertDescription>
          </Alert>
          
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Setup failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {setupComplete ? (
            <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Setup Complete!</h2>
              <p className="text-center mb-6">
                Your database has been set up successfully. You can now start creating tasks.
              </p>
              <Button onClick={goToDashboard}>
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button 
                size="lg"
                onClick={handleSetupDatabase}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Set Up Database
                  </>
                )}
              </Button>
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-8">
            <p className="font-semibold mb-2">What this will do:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create a "tasks" table with the proper structure</li>
              <li>Set up row-level security policies to protect your data</li>
              <li>Configure relationships between your user account and your tasks</li>
              <li>Set up necessary database functions for the application</li>
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DatabaseSetup;
