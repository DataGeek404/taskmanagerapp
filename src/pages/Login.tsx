
import { AuthForm } from '@/components/auth/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">Taskoriq</h1>
          <p className="text-gray-500">Your simple task management solution</p>
        </div>
        <AuthForm type="login" />
      </div>
    </div>
  );
};

export default Login;
