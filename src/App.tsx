
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/auth-context";
import { TaskProvider } from "./lib/task-context";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewTask from "./pages/NewTask";
import EditTask from "./pages/EditTask";
import NotFound from "./pages/NotFound";
import DatabaseSetup from "./pages/DatabaseSetup";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public route - Landing page */}
          <Route path="/" element={<Index />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/new-task" 
            element={
              <ProtectedRoute>
                <NewTask />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-task/:id" 
            element={
              <ProtectedRoute>
                <EditTask />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            } 
          />
          
          <Route 
            path="/db-setup" 
            element={
              <ProtectedRoute>
                <DatabaseSetup />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
