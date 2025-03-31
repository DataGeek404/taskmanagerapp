import { useState } from 'react';
import { Task, TaskStatus } from '@/lib/supabase';
import { useTask } from '@/lib/task-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { deleteTask, updateTask } = useTask();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusClass = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return 'task-status-pending';
      case 'in-progress':
        return 'task-status-in-progress';
      case 'completed':
        return 'task-status-completed';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'in-progress':
        return <Clock className="h-3 w-3 mr-1" />;
      case 'completed':
        return <CheckCircle2 className="h-3 w-3 mr-1" />;
      default:
        return null;
    }
  };

  const getNextStatus = (currentStatus: TaskStatus): TaskStatus => {
    switch (currentStatus) {
      case 'pending':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };

  const handleStatusChange = async () => {
    const nextStatus = getNextStatus(task.status);
    try {
      setIsUpdatingStatus(true);
      await updateTask(task.id, { status: nextStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setIsDeleting(true);
      await deleteTask(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = () => {
    navigate(`/edit-task/${task.id}`);
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-t-4 group" style={{ borderTopColor: task.status === 'completed' ? 'var(--green-500)' : task.status === 'in-progress' ? 'var(--blue-500)' : 'var(--amber-500)' }}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{task.title}</CardTitle>
          <Badge className={`${getStatusClass(task.status)} flex items-center`}>
            {getStatusIcon(task.status)}
            {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </Badge>
        </div>
        <CardDescription>Created on {formatDate(task.created_at)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleStatusChange}
          disabled={isUpdatingStatus}
          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          {isUpdatingStatus ? (
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-primary animate-pulse mr-2"></span>
              Updating...
            </span>
          ) : (
            <>Change Status</>
          )}
        </Button>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={handleEditTask}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                size="icon" 
                variant="ghost" 
                className="text-destructive hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="animate-scale-in">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteTask}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
