//user registration

import { AuthForm } from '@/components/auth/AuthForm';

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2">James Task Manager</h1>
          <p className="text-gray-500">Your personal task management solution</p>
        </div>
        <AuthForm type="register" />
      </div>
    </div>
  );
};

export default Register;
