
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, ListTodo } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col gap-8 md:flex-row items-center">
          <div className="flex-1 space-y-6 text-left">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent animate-fade-in">
                James Task Manager
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-xl animate-fade-in animation-delay-100">
                Your personal productivity solution for managing tasks efficiently
              </p>
            </div>
            
            <div className="space-y-4 animate-fade-in animation-delay-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-gray-700 dark:text-gray-200">Simple and intuitive task management</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <p className="text-gray-700 dark:text-gray-200">Track progress and stay organized</p>
              </div>
              <div className="flex items-center gap-2">
                <ListTodo className="h-5 w-5 text-purple-500" />
                <p className="text-gray-700 dark:text-gray-200">Customize task categories and status</p>
              </div>
            </div>
            
            <div className="pt-4 space-x-4 animate-fade-in animation-delay-300">
              <Button 
                onClick={() => navigate('/login')}
                className="group relative overflow-hidden px-6 py-3 transition-all duration-300 hover:shadow-xl"
                size="lg"
              >
                <span className="relative z-10">Get Started</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-80 group-hover:opacity-100 transition-opacity"></span>
                <ArrowRight className="ml-2 h-5 w-5 inline transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/register')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800"
                size="lg"
              >
                Sign Up
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end animate-scale-in">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-lg blur-lg"></div>
              <div className="relative rounded-lg bg-white dark:bg-gray-800 shadow-xl overflow-hidden p-5 md:p-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Task Dashboard</h3>
                  <span className="text-xs text-gray-500">Preview</span>
                </div>
                
                {/* Task Preview Cards */}
                <div className="space-y-3">
                  {[
                    { title: 'Design project', status: 'in-progress', color: 'bg-blue-100 dark:bg-blue-900/30' },
                    { title: 'Client meeting', status: 'pending', color: 'bg-amber-100 dark:bg-amber-900/30' },
                    { title: 'Review wireframes', status: 'completed', color: 'bg-green-100 dark:bg-green-900/30' },
                  ].map((task, i) => (
                    <div 
                      key={i} 
                      className={`${task.color} p-3 rounded-md animate-fade-in`}
                      style={{ animationDelay: `${(i + 5) * 100}ms` }}
                    >
                      <div className="flex justify-between">
                        <p className="font-medium">{task.title}</p>
                        <span className="text-xs uppercase">{task.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
