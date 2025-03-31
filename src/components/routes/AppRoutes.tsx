
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import NewTask from '@/pages/NewTask';
import EditTask from '@/pages/EditTask';
import NotFound from '@/pages/NotFound';
import DatabaseSetup from '@/pages/DatabaseSetup';
import TaskAnalytics from '@/pages/TaskAnalytics';
import GuestRoute from '@/components/auth/GuestRoute';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

//defining app routes

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Guest routes (accessible only when not logged in) */}
      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />
      <Route path="/register" element={
        <GuestRoute>
          <Register />
        </GuestRoute>
      } />
      
      {/* Protected routes (accessible only when logged in) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/new-task" element={
        <ProtectedRoute>
          <NewTask />
        </ProtectedRoute>
      } />
      <Route path="/edit-task/:id" element={
        <ProtectedRoute>
          <EditTask />
        </ProtectedRoute>
      } />
      <Route path="/db-setup" element={
        <ProtectedRoute>
          <DatabaseSetup />
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <TaskAnalytics />
        </ProtectedRoute>
      } />
      
      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
