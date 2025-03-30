
import { render, screen } from '@testing-library/react';
import Login from './Login';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock the AuthForm component
vi.mock('@/components/auth/AuthForm', () => ({
  AuthForm: ({ type }: { type: string }) => (
    <div data-testid={`auth-form-${type}`}>Mocked Auth Form</div>
  ),
}));

describe('Login Page', () => {
  it('renders correctly with title and form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Check for the title
    expect(screen.getByText('James Task Manager')).toBeInTheDocument();
    
    // Check for the subtitle
    expect(screen.getByText('Your personal task management solution')).toBeInTheDocument();
    
    // Check that the auth form is rendered with login type
    expect(screen.getByTestId('auth-form-login')).toBeInTheDocument();
  });

  it('has proper responsive styling classes', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    // Check for responsive styling classes
    const mainContainer = screen.getByText('James Task Manager').closest('div');
    expect(mainContainer?.parentElement).toHaveClass('min-h-screen');
    expect(mainContainer?.parentElement).toHaveClass('flex');
    
    // Check for max width constraint
    expect(mainContainer).toHaveClass('max-w-md');
  });
});
