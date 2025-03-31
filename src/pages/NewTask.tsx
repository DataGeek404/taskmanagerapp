
import TaskForm from '@/components/tasks/TaskForm';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTask } from '@/lib/task-context';

const NewTask = () => {
  // Try to access the task context to verify it's available or not
  // This is just to ensure the component is properly wrapped in TaskProvider
  useTask();
  
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
        <TaskForm />
      </div>
    </AppLayout>
  );
};

export default NewTask;
