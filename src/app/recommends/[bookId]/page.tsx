import { notFound } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { RecommendRow } from 'types';

export default async function RecommendDetailPage({ params }: { params: { bookId: string } }) {
  const supabase = await createClient();
  const bookId = (await params).bookId;

  // const { data, error } = await supabase
  //   .from('recommends')
  //   .select(
  //     `
  //     id,
  //     book_id,
  //     recommended_by,
  //     comment,
  //     category,
  //     created_at,
  //     updated_at,
  //     user:recommended_by (
  //       id,
  //       name,
  //       avatar_url
  //     ),
  //     book:book_id (
  //       id,
  //       title,
  //       author,
  //       cover_url
  //     )
  //   `
  //   )
  //   .eq('book_id', bookId);

  // ダミーデータ
  const data = [
    {
      id: '1',
      book_id: '01208ed7-db71-46c8-bd89-d555711c9836',
      recommended_by: '1',
      comment:
        '物語の世界観にぐいぐい引き込まれました。読んでいてページをめくる手が止まらない最高の一冊です。ぜひみなさんにも読んでもらいたい！',
      category: '小説',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z',
      user: [
        {
          id: '01208ed7-db71-46c8-bd89-d555711c9836',
          name: 'user1',
          avatar_url: '/avatar1.png',
        },
      ],
      book: [
        {
          id: '01208ed7-db71-46c8-bd89-d555711c9836',
          title: '本のタイトル',
          author: '著者名',
          cover_url: '/cover1.png',
        },
      ],
    },
  ];
  const error = null;

  if (error) {
    console.error('Failed to fetch recommend detail:', error);
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-xl text-red-500 font-semibold">データ取得エラーが発生しました</p>
      </main>
    );
  }

  if (!data || data.length === 0) {
    // 指定の bookId に対応する recommends が存在しない場合
    notFound();
  }

  const recommends = data as RecommendRow[];

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-screen-md mx-auto px-4">
        {/* ページタイトル */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-gray-800">
          おすすめ本の詳細
        </h1>

        {recommends.map((rec) => {
          const user = rec.user?.[0];
          const book = rec.book?.[0];

          return (
            <section key={rec.id} className="bg-white rounded-xl shadow p-6 sm:p-8 mb-8">
              {/* カバー & タイトル */}
              {book && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
                  {/* カバー画像 */}
                  {book.cover_url && (
                    <div className="relative w-full sm:w-40 md:w-48 h-60 mx-auto sm:mx-0 border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                      <Image
                        src={book.cover_url}
                        alt={book.title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  )}

                  {/* タイトル・著者 */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-800">{book.title}</h2>
                    {book.author && <p className="text-gray-600 mt-1">著者: {book.author}</p>}
                  </div>
                </div>
              )}

              {/* 推薦者情報 */}
              {user && (
                <div className="flex items-center gap-2 mb-4">
                  {user.avatar_url && (
                    <Image
                      src={user.avatar_url}
                      alt="user avatar"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-gray-700 text-sm sm:text-base">推薦者: {user.name}</span>
                </div>
              )}

              {/* コメント */}
              {rec.comment && (
                <div className="mt-2 text-gray-700 text-sm sm:text-base leading-relaxed">
                  {rec.comment}
                </div>
              )}

              {/* カテゴリ */}
              {rec.category && (
                <div className="mt-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                    {rec.category}
                  </span>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
