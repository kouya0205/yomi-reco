import SearchClient from '@/components/search/searchClient';
import { createClient } from '@/utils/supabase/server';

export default async function SearchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: user_book } = await supabase
    .from('user_book')
    .select(`book_id, status`)
    .eq('user_id', user?.id);

  return (
    <div>
      {/* サーバーコンポーネントは、クライアントコンポーネントを呼び出すだけ */}
      <SearchClient user_book={user_book} user={user} />
    </div>
  );
}
