
import { useTask } from '@/lib/task-context';
import TaskCard from '@/components/tasks/TaskCard';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Skeleton } from '@/components/ui/skeleton';

const Dashboard = () => {
  const { filteredTasks, isLoading, filter } = useTask();
  const navigate = useNavigate();

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

  return (
    <AppLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{getFilterTitle()}</h1>
          <p className="text-muted-foreground mt-1">
            {isLoading 
              ? 'Loading tasks...' 
              : `You have ${filteredTasks.length} ${filter === 'all' ? 'tasks in total' : `${filter} tasks`}`}
          </p>
        </div>
        <Button onClick={() => navigate('/new-task')}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-[250px] space-y-4">
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
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-muted-foreground text-lg">No tasks found</p>
          <Button onClick={() => navigate('/new-task')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default Dashboard;
