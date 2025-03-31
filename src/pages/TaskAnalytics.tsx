//Nalytics e.g in summary charts

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTask } from '@/lib/task-context';
import TaskStats from '@/components/tasks/TaskStats';
import { Button } from '@/components/ui/button';
import { ChartBar, RotateCcw, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

const TaskAnalytics = () => {
  const { tasks, isLoading, refreshTasks } = useTask();
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Task Analytics</h1>
              <p className="text-muted-foreground mt-1">
                Visual insights into your task management
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="hidden md:flex group transition-all hover:shadow-md"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform" />
              Back to Tasks
            </Button>
            <Button 
              onClick={refreshTasks}
              variant="outline"
              className="group transition-all hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
              Refresh Data
            </Button>
          </div>
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
