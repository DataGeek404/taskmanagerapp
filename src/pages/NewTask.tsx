
import TaskForm from '@/components/tasks/TaskForm';
import { AppLayout } from '@/components/layout/AppLayout';

const NewTask = () => {
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
