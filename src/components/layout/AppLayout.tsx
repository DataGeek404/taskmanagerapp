
import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { CircleUser, List, LogOut, Plus } from 'lucide-react';
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
            <SidebarTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <List className="h-5 w-5" />
              </Button>
            </SidebarTrigger>
            <h1 className="text-xl font-semibold">Taskoriq</h1>
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
    <Sidebar className="border-r border-border">
      <SidebarHeader className="px-6 py-4">
        <h1 className="text-2xl font-bold">Taskoriq</h1>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <div className="space-y-1 mb-6">
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={() => navigate('/new-task')}
          >
            <Plus className="h-5 w-5 mr-2" />
            New Task
          </Button>
          <h3 className="font-semibold text-sm px-3 py-2">Filter By Status</h3>
          <Button
            variant={activeFilter === 'all' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onStatusChange('all')}
          >
            All Tasks
          </Button>
          <Button
            variant={activeFilter === 'pending' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onStatusChange('pending')}
          >
            <span className="h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
            Pending
          </Button>
          <Button
            variant={activeFilter === 'in-progress' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onStatusChange('in-progress')}
          >
            <span className="h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
            In Progress
          </Button>
          <Button
            variant={activeFilter === 'completed' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => onStatusChange('completed')}
          >
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Completed
          </Button>
        </div>
      </SidebarContent>
      <SidebarFooter className="px-4 py-4 border-t">
        <div className="flex items-center gap-2 mb-4 px-3">
          <CircleUser className="h-6 w-6" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{userEmail}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={onLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppLayout;
