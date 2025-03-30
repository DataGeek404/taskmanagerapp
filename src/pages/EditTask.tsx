
import { useParams } from 'react-router-dom';
import TaskForm from '@/components/tasks/TaskForm';
import { AppLayout } from '@/components/layout/AppLayout';
import { useTask } from '@/lib/task-context';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditTask = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks } = useTask();
  const navigate = useNavigate();
  const [taskExists, setTaskExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (tasks.length > 0) {
      const exists = tasks.some(task => task.id === id);
      setTaskExists(exists);
      
      if (!exists) {
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    }
  }, [tasks, id, navigate]);

  if (taskExists === false) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="text-gray-500 mb-6">This task either doesn't exist or you don't have permission to edit it.</p>
          <p className="text-gray-500">Redirecting to dashboard...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
        {id && <TaskForm taskId={id} />}
      </div>
    </AppLayout>
  );
};

export default EditTask;
