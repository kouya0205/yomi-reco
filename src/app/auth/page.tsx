import { AuthForm } from '@/components/auth/authForm';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase.from('users').select('id').eq('user_id', user?.id);
  // アカウントはあるが、usersテーブルのidにデータがない場合は、usernameとidを登録するページに飛ばしたい。step = 1
  if (data) {
    redirect('/bookshelf');
  }
  console.log('data:', data);
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between pt-10 lg:pt-20">
        <AuthForm />
      </div>
    </>
  );
}
