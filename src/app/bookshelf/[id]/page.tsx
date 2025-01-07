import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import BookshelfClient from '@/components/bookShelfClient';

export default async function UserBookshelfPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/auth');
  }

  // 他人の本棚データを取得
  const { data: books, error } = await supabase
    .from('user_book')
    .select(`*, books(*)`)
    .eq('user_id', id);

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
