
import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CircleUser, List, LogOut, Plus, LayoutDashboard, Clock, CheckCircle2, AlertCircle, BarChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TaskStatus } from '@/lib/supabase';
import { useTask } from '@/lib/task-context';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { signOut, user } = useAuth();
  const { setFilter, filter } = useTask();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleStatusChange = (status: TaskStatus | 'all') => {
    setFilter(status);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          onStatusChange={handleStatusChange} 
          activeFilter={filter} 
          onLogout={handleLogout} 
          userEmail={user?.email || ''}
        />
        <main className="flex-1 overflow-auto p-6 md:p-8">
          <div className="md:hidden flex items-center mb-6">
            <SidebarTrigger className="mr-2">
              <List className="h-5 w-5" />
            </SidebarTrigger>
            <h1 className="text-xl font-semibold">James Task Manager</h1>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

interface AppSidebarProps {
  onStatusChange: (status: TaskStatus | 'all') => void;
  activeFilter: TaskStatus | 'all';
  onLogout: () => void;
  userEmail: string;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ onStatusChange, activeFilter, onLogout, userEmail }) => {
  const navigate = useNavigate();

  return (
    <Sidebar className="border-r border-border bg-gray-50 dark:bg-gray-900/50">
      <SidebarHeader className="px-6 py-4 border-b border-border/50">
        <h1 className="text-2xl font-bold text-primary">James Task Manager</h1>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <div className="space-y-4 mb-6">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 mb-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate('/new-task')}
          >
            <Plus className="h-5 w-5 text-primary" />
            <span>New Task</span>
          </Button>
          
          <div className="px-3 py-2">
            <h3 className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-2">TASK FILTERS</h3>
            <div className="space-y-1">
              <Button
                variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 group"
                onClick={() => onStatusChange('all')}
              >
                <LayoutDashboard className={`h-5 w-5 ${activeFilter === 'all' ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'} transition-colors`} />
                <span>All Tasks</span>
              </Button>
              <Button
                variant={activeFilter === 'pending' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 group"
                onClick={() => onStatusChange('pending')}
              >
                <AlertCircle className={`h-5 w-5 ${activeFilter === 'pending' ? 'text-white' : 'text-amber-500 group-hover:text-amber-600'} transition-colors`} />
                <span>Pending</span>
              </Button>
              <Button
                variant={activeFilter === 'in-progress' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 group"
                onClick={() => onStatusChange('in-progress')}
              >
                <Clock className={`h-5 w-5 ${activeFilter === 'in-progress' ? 'text-white' : 'text-blue-500 group-hover:text-blue-600'} transition-colors`} />
                <span>In Progress</span>
              </Button>
              <Button
                variant={activeFilter === 'completed' ? 'secondary' : 'ghost'}
                className="w-full justify-start gap-3 group"
                onClick={() => onStatusChange('completed')}
              >
                <CheckCircle2 className={`h-5 w-5 ${activeFilter === 'completed' ? 'text-white' : 'text-green-500 group-hover:text-green-600'} transition-colors`} />
                <span>Completed</span>
              </Button>
            </div>
          </div>
          
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 mt-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => navigate('/analytics')}
          >
            <BarChart className="h-5 w-5 text-purple-500 group-hover:text-purple-600" />
            <span>Analytics</span>
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4 border-t mt-auto">
        <div className="flex items-center gap-3 mb-4 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-800">
          <CircleUser className="h-8 w-8 text-primary" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userEmail}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Active now</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full group hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2 group-hover:text-red-500 transition-colors" />
          <span className="group-hover:text-red-500 transition-colors">Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppLayout;
