import { AuthForm } from '@/app/auth/authpage';

export default function AuthPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between pt-20">
        <AuthForm />
      </div>
    </>
  );
}
