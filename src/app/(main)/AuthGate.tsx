import { useAuth } from '@/auth/AuthProvider';
import { LoginForm } from '@/auth/LoginForm';
import { SignUpForm } from '@/auth/SignUpForm';
import { LogoutButton } from '@/auth/LogoutButton';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user)
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Sign Up or Login</h2>
        <SignUpForm />
        <hr className="my-6" />
        <LoginForm />
      </div>
    );
  return (
    <div>
      <div className="flex justify-end p-4">
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
