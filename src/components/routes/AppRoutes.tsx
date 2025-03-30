
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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      {/* Guest routes (accessible only when not logged in) */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      
      {/* Protected routes (accessible only when logged in) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/new-task" element={<NewTask />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
        <Route path="/db-setup" element={<DatabaseSetup />} />
        <Route path="/analytics" element={<TaskAnalytics />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
