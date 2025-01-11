import SearchClient from '@/components/search/searchClient';
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: '本検索',
  description: '読みたい本を検索して追加しましょう。',
};

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
      <Suspense fallback={<div>Loading...</div>}>
        <SearchClient user_book={user_book} user={user} />
      </Suspense>
    </div>
  );
}
