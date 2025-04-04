
import { useTask } from '@/lib/task-context';
import TaskCard from '@/components/tasks/TaskCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Database, LineChart, AlertCircle, BarChart } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const { filteredTasks, isLoading, filter } = useTask();
  const navigate = useNavigate();
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  
  
  // Check if the tasks table exists
  useEffect(() => {
    const checkTable = async () => {
      try {
        const { error } = await supabase
          .from('tasks')
          .select('id')
          .limit(1);
        
        setTableExists(error?.code !== '42P01');
      } catch (error) {
        console.error('Error checking tasks table:', error);
        setTableExists(false);
      }
    };
    
    checkTable();
  }, []);

  const getFilterTitle = () => {
    switch (filter) {
      case 'pending':
        return 'Pending Tasks';
      case 'in-progress':
        return 'In Progress Tasks';
      case 'completed':
        return 'Completed Tasks';
      default:
        return 'All Tasks';
    }
  };

  const getTasksCount = () => {
    if (isLoading) return 'Loading...';
    
    const count = filteredTasks.length;
    return `${count} ${count === 1 ? 'task' : 'tasks'} ${filter !== 'all' ? `with ${filter} status` : 'in total'}`;
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {getFilterTitle()}
            </h1>
            <p className="text-muted-foreground mt-1">
              {getTasksCount()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/analytics')}
              className="group transition-all hover:shadow-md"
            >
              <BarChart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Analytics
            </Button>
            <Button 
              onClick={() => navigate('/new-task')}
              className="group transition-all hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              New Task
            </Button>
          </div>
        </div>

        {tableExists === false && (
          <Alert className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-900 animate-fade-in">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-medium">Database setup required</AlertTitle>
            <AlertDescription className="flex flex-col gap-4">
              <p>Your database is not set up yet. You need to create the tasks table before you can use the app.</p>
              <Button 
                variant="outline" 
                className="w-fit hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors" 
                onClick={() => navigate('/db-setup')}
              >
                <Database className="h-4 w-4 mr-2" />
                Set up database
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-[250px] space-y-4 animate-pulse">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-32" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-full mb-4">
              <LineChart className="h-12 w-12 text-primary/70" />
            </div>
            <p className="text-muted-foreground text-lg mb-4">No tasks found</p>
            <Button 
              onClick={() => navigate('/new-task')}
              className="hover:scale-105 transition-transform"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="animate-fade-in opacity-0" 
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
              >
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
