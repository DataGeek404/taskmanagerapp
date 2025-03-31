

/**
 * Authentication form component for login and registration.
 * Handles form validation and submission for authentication operations.
 */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';

/** Available form types */
type AuthFormType = 'login' | 'register';

/**
 * Zod schema for login form validation
 */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

/**
 * Zod schema for registration form validation
 */
const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

/**
 * Authentication form component that provides login and registration functionality.
 * 
 * @param {Object} props - Component props
 * @param {AuthFormType} props.type - Type of form to display ('login' or 'register')
 * @returns {JSX.Element} The rendered form component
 */
export const AuthForm = ({ type }: { type: AuthFormType }) => {
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const isLogin = type === 'login';
  const schema = isLogin ? loginSchema : registerSchema;
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isLogin 
      ? { email: '', password: '' }
      : { email: '', password: '', confirmPassword: '', name: '' },
  });

  /**
   * Handles form submission for both login and registration.
   * 
   * @param {LoginFormValues | RegisterFormValues} values - Form values
   */
  const onSubmit = async (values: LoginFormValues | RegisterFormValues) => {
    try {
      setLoading(true);
      
      if (isLogin) {
        await signIn(values.email, values.password);
      } else {
        const registerValues = values as RegisterFormValues;
        await signUp(registerValues.email, registerValues.password, registerValues.name);
      }
      
      navigate('/');
    } catch (error) {
      console.error('Auth error:', error);
      // Error is already handled in auth-context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-6 w-full">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{isLogin ? 'Sign In' : 'Create an Account'}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {isLogin 
            ? 'Enter your credentials to sign in to your account' 
            : 'Fill in the form below to create your account'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!isLogin && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading 
              ? (isLogin ? 'Signing in...' : 'Creating account...') 
              : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
      </Form>
      
      <div className="text-center text-sm">
        {isLogin ? (
          <>
            Don't have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
              Sign up
            </Button>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
              Sign in
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
