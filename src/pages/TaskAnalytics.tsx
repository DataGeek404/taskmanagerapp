
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTask } from '@/lib/task-context';
import TaskStats from '@/components/tasks/TaskStats';
import { Button } from '@/components/ui/button';
import { ChartBar, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const TaskAnalytics = () => {
  const { tasks, isLoading, refreshTasks } = useTask();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Task Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Visual insights into your task management
            </p>
          </div>
          <Button 
            onClick={refreshTasks}
            variant="outline"
            className="group transition-all hover:shadow-md"
          >
            <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
            Refresh Data
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            <div className="h-[400px] space-y-4 animate-pulse">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-[350px]" />
            </div>
            <div className="h-[400px] space-y-4 animate-pulse">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-[350px]" />
            </div>
          </div>
        ) : (
          <TaskStats tasks={tasks} />
        )}
      </div>
    </AppLayout>
  );
};

export default TaskAnalytics;
