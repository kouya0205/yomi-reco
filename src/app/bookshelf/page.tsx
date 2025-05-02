import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import BookshelfClient from '@/components/bookShelfClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My本棚',
  description: '読んだ本、読みたい本、読んでいる本を管理できます。',
};

export default async function BookshelfPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  const { data: books, error } = await supabase
    .from('user_book')
    .select(`*, books(*)`)
    .eq('user_id', user?.id);

  if (error) {
    console.error('Error fetching books:', error);
    // 必要に応じてエラーハンドリング
    return notFound();
  }

  // 取得したデータをクライアントコンポーネントへ渡す
  return (
    <main className="p-4">
      {/* 取得した書籍データを BookshelfClient に渡す */}
      <BookshelfClient books={books ?? []} user={user} />
    </main>
  );
}
