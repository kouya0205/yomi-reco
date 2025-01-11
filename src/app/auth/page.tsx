import { AuthForm } from '@/components/auth/authForm';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ログイン/新規登録',
};

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: Id } = await supabase.from('users').select('id').eq('user_id', user?.id);
  if (user && Id?.[0]?.id !== user.id) {
    redirect('/bookshelf');
  }
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between pt-10 lg:pt-20">
        <AuthForm Id={Id?.[0]?.id} />
      </div>
    </>
  );
}
