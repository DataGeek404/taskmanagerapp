
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Clock, ListTodo, Briefcase, BarChart3, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div 
          className="flex flex-col gap-8 md:flex-row items-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="flex-1 space-y-6 text-left" variants={itemVariants}>
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-foreground bg-clip-text text-transparent">
                James Task Manager
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-xl">
                Your personal productivity solution for managing tasks efficiently
              </p>
            </div>
            
            <div className="space-y-4">
              <motion.div className="flex items-center gap-2" variants={itemVariants}>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-gray-700 dark:text-gray-200">Simple and intuitive task management</p>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={itemVariants}>
                <Clock className="h-5 w-5 text-blue-500" />
                <p className="text-gray-700 dark:text-gray-200">Track progress and stay organized</p>
              </motion.div>
              <motion.div className="flex items-center gap-2" variants={itemVariants}>
                <ListTodo className="h-5 w-5 text-purple-500" />
                <p className="text-gray-700 dark:text-gray-200">Customize task categories and status</p>
              </motion.div>
            </div>
            
            <motion.div className="pt-4 space-x-4" variants={itemVariants}>
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
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 flex justify-center md:justify-end"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
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
                    { title: 'Design project', status: 'in-progress', color: 'bg-blue-100 dark:bg-blue-900/30', icon: <Briefcase className="h-4 w-4 text-blue-500" /> },
                    { title: 'Client meeting', status: 'pending', color: 'bg-amber-100 dark:bg-amber-900/30', icon: <Clock className="h-4 w-4 text-amber-500" /> },
                    { title: 'Review wireframes', status: 'completed', color: 'bg-green-100 dark:bg-green-900/30', icon: <CheckCircle2 className="h-4 w-4 text-green-500" /> },
                  ].map((task, i) => (
                    <motion.div 
                      key={i} 
                      className={`${task.color} p-3 rounded-md`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (i * 0.1) }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          {task.icon}
                          <p className="font-medium">{task.title}</p>
                        </div>
                        <span className="text-xs uppercase">{task.status}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div 
        className="bg-white dark:bg-gray-800 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to stay organized and productive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 className="h-10 w-10 text-primary" />,
                title: "Track Progress",
                description: "Monitor your productivity and track task completion with intuitive visualizations."
              },
              {
                icon: <Star className="h-10 w-10 text-yellow-500" />,
                title: "Priority Management",
                description: "Easily set and adjust priorities to focus on what matters most to you."
              },
              {
                icon: <Briefcase className="h-10 w-10 text-blue-500" />,
                title: "Project Organization",
                description: "Group related tasks into projects to keep your workflow structured."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + (i * 0.1) }}
                whileHover={{ y: -5 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to boost your productivity?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their task management experience.
          </p>
          <Button 
            onClick={() => navigate('/register')}
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md text-lg font-medium transition-all hover:shadow-lg"
          >
            Get Started for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 dark:text-gray-400">© 2023 James Task Manager. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Terms</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
