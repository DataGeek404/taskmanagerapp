
/**
 * Login page component.
 * Displays the login form and application branding.
 */
import { AuthForm } from '@/components/auth/AuthForm';

/**
 * Login page component that renders the login form with application branding.
 * 
 * @returns {JSX.Element} The rendered login page
 */
const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">James Task Manager</h1>
          <p className="text-gray-500 text-lg">Your personal task management solution</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <AuthForm type="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
