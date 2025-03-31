//app routing

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./lib/auth-context";
import { TaskProvider } from "./lib/task-context";
import AppRoutes from "./components/routes/AppRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
