
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from './TaskCard';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { TaskStatus } from '@/lib/supabase';

// Mock the task context
vi.mock('@/lib/task-context', () => ({
  useTask: () => ({
    deleteTask: vi.fn(),
    updateTask: vi.fn(),
  }),
}));
// Mock the task context
describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'This is a test task',
    status: 'pending' as TaskStatus,
    user_id: 'user123',
    created_at: '2023-01-01T00:00:00Z',
  };

  it('renders task details correctly', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText(/created on/i)).toBeInTheDocument();
  });

  it('renders correct status badge for pending task', () => {
    render(
      <BrowserRouter>
        <TaskCard task={mockTask} />
      </BrowserRouter>
    );
    
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
  });

  it('renders correct status badge for in-progress task', () => {
    const inProgressTask = { ...mockTask, status: 'in-progress' as TaskStatus };
    render(
      <BrowserRouter>
        <TaskCard task={inProgressTask} />
      </BrowserRouter>
    );
    
    const badge = screen.getByText('In Progress');
    expect(badge).toBeInTheDocument();
  });

  it('renders correct status badge for completed task', () => {
    const completedTask = { ...mockTask, status: 'completed' as TaskStatus };
    render(
      <BrowserRouter>
        <TaskCard task={completedTask} />
      </BrowserRouter>
    );
    
    const badge = screen.getByText('Completed');
    expect(badge).toBeInTheDocument();
  });
});
