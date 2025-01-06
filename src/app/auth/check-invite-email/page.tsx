import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function CheckInviteEmailPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // if (user) {
  //   redirect('/bookshelf');
  // }
  return (
    <div>
      <h1>Check Invite Email</h1>
    </div>
  );
}
