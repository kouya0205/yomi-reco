import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import BookshelfClient from '@/components/bookShelfClient';

export default async function BookshelfPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 例: user_book / books テーブルを結合して書籍情報を取得
  const { data: books, error } = await supabase.from('user_book').select(`*, books(*)`);

  console.log('books:', books);

  if (error) {
    console.error('Error fetching books:', error);
    // 必要に応じてエラーハンドリング
    return notFound();
  }

  // 取得したデータをクライアントコンポーネントへ渡す
  return (
    <main className="p-4">
      {/* 取得した書籍データを BookshelfClient に渡す */}
      <BookshelfClient books={books ?? []} />
    </main>
  );
}
