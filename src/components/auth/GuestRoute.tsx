
/**
 * GuestRoute component for protecting routes that should only be accessible to guests.
 * Redirects authenticated users to the dashboard.
 */
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

interface GuestRouteProps {
  /** Child component to render if the user is not authenticated */
  children: ReactNode;
}

/**
 * A route wrapper that only allows unauthenticated users to access.
 * If user is authenticated, redirects to dashboard.
 * 
 * @param {GuestRouteProps} props - Component props
 * @param {ReactNode} props.children - Child component to render for guests
 * @returns {JSX.Element} The child component or redirect
 */
const GuestRoute = ({ children }: GuestRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // If still loading, show nothing (or a loading indicator)
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Return the child component directly
  return children;
};

export default GuestRoute;
