import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useTask } from '@/lib/task-context';
import { TaskStatus } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDays } from 'date-fns';

const taskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().min(3, 'Description must be at least 3 characters').max(500),
  status: z.enum(['pending', 'in-progress', 'completed']),
  due_date: z.string().optional(),
  notifications_enabled: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  taskId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskId }) => {
  const { createTask, updateTask, tasks } = useTask();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!taskId;

  const task = isEditing ? tasks.find(t => t.id === taskId) : null;

  const defaultDueDate = () => {
    const date = addDays(new Date(), 3);
    return date.toISOString().split('T')[0];
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'pending',
      due_date: task?.due_date ? task.due_date.split('T')[0] : defaultDueDate(),
      notifications_enabled: task?.notifications_enabled || false,
    },
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        status: task.status,
        due_date: task.due_date ? task.due_date.split('T')[0] : defaultDueDate(),
        notifications_enabled: task.notifications_enabled || false,
      });
    }
  }, [task, form]);

  const onSubmit = async (values: TaskFormValues) => {
    try {
      setIsSubmitting(true);
      
      let formattedDueDate = null;
      if (values.due_date) {
        const dueDate = new Date(values.due_date);
        dueDate.setHours(23, 59, 59);
        formattedDueDate = dueDate.toISOString();
      }
      
      if (isEditing && taskId) {
        await updateTask(taskId, {
          ...values,
          due_date: formattedDueDate,
        });
      } else {
        await createTask(
          values.title, 
          values.description, 
          formattedDueDate, 
          values.notifications_enabled
        );
      }
      
      navigate('/');
    } catch (error) {
      console.error('Error submitting task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</CardTitle>
        <CardDescription>
          {isEditing 
            ? 'Update your existing task details below' 
            : 'Enter the details of your new task below'}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter task description" 
                      className="resize-none min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notifications_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Email Notifications</FormLabel>
                    <FormDescription>
                      Receive an email reminder 12 hours before the task is due
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {isEditing && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Task' : 'Create Task')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default TaskForm;
