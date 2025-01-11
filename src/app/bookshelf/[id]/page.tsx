import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import BookshelfClient from '@/components/bookShelfClient';
import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const id = (await params).id;
  const supabasea = await createClient();

  // fetch data
  const { data } = await supabasea.from('users').select('*').eq('id', id).single();

  return {
    title: data?.name + 'さんの本棚',
    description:
      data?.id +
      'さんの本棚です。' +
      data?.name +
      'さんが読みたい本、よんでいる本、よんだ本を確認し自身の本棚に追加することができます。',
  };
}

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
  const { data: user_data } = await supabase.from('users').select('user_id').eq('id', id).single();
  const { data: books, error } = await supabase
    .from('user_book')
    .select(`*, books(*)`)
    .eq('user_id', user_data?.user_id);

  if (error) {
    console.error('Error fetching books:', error);
    // 必要に応じてエラーハンドリング
    return notFound();
  }

  // 取得したデータをクライアントコンポーネントへ渡す
  return (
    <main className="p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <BookshelfClient books={books ?? []} user={user} />
      </Suspense>
    </main>
  );
}
