import { createClient } from '@/utils/supabase/server';
import { error } from 'console';
import Image from 'next/image';
import Link from 'next/link';
import { RecommendRow } from 'types';

export default async function RecommendsPage() {
  const supabase = await createClient();
  //   const { data, error } = await supabase
  //     .from('recommends')
  //     .select(
  //       `
  //       id,
  //       book_id,
  //       recommended_by,
  //       comment,
  //       category,
  //       created_at,
  //       updated_at,
  //       user:recommended_by (
  //         id,
  //         name,
  //         avatar_url
  //       ),
  //       book:book_id (
  //         id,
  //         title,
  //         author,
  //         cover_url
  //       )
  //     `,
  //     )
  //     .order('created_at', { ascending: false });

  // ダミーデータを返却する
  const data = [
    {
      id: '1',
      book_id: '01208ed7-db71-46c8-bd89-d555711c9837',
      recommended_by: '1',
      comment: '面白かったです！',
      category: '小説',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z',
      user: [
        {
          id: '01208ed7-db71-46c8-bd89-d555711c9837',
          name: 'user1',
          avatar_url: '/avatar1.png',
        },
      ],
      book: [
        {
          id: '01208ed7-db71-46c8-bd89-d555711c9837',
          title: '本のタイトル',
          author: '著者名',
          cover_url: '/cover1.png',
        },
      ],
    },
    {
      id: '2',
      book_id: '01208ed7-db71-46c8-bd89-d555711c9836',
      recommended_by: '2',
      comment: '感動しました！',
      category: 'ビジネス',
      created_at: '2022-01-01T00:00:00Z',
      updated_at: '2022-01-01T00:00:00Z',
      user: [
        {
          id: '01208ed7-db71-46c8-bd89-d555711c9836',
          name: 'user2',
          avatar_url: '/avatar2.png',
        },
      ],
      book: [
        {
          id: '01208ed7-db71-46c8-bd89-d555711c9836',
          title: '本のタイトル2',
          author: '著者名2',
          cover_url: '/cover2.png',
        },
      ],
    },
  ];
  const error = null;

  if (error) {
    console.error('Failed to fetch recommends:', error);
    return <div>データの取得に失敗しました</div>;
  }

  // 配列で返却されるため、型定義を合わせている
  const recommends = data as RecommendRow[] | null;

  if (!recommends || recommends.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">おすすめされた本はまだありません</h1>
          <p className="text-gray-600">新しいおすすめが登録されるのをお待ちください。</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-4 md:p-8">
      {/* ページヘッダー */}
      <div className="max-w-screen-lg mx-auto mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">みんなのおすすめ本一覧</h1>
        <p className="text-gray-600 mt-2">みなさんが紹介してくれた書籍をピックアップしました！</p>
      </div>

      {/* おすすめ本リスト */}
      <ul className="max-w-screen-lg mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommends.map((rec) => {
          const user = rec.user?.[0];
          const book = rec.book?.[0];

          return (
            <li
              key={rec.id}
              className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-lg p-4 flex flex-col">
              {/* 書籍画像 */}
              {book?.cover_url && (
                <div className="relative w-full h-56 mb-3">
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    className="rounded"
                  />
                </div>
              )}

              {/* タイトル・著者情報 */}
              {book && (
                <>
                  <h2 className="text-lg font-semibold text-gray-800">{book.title}</h2>
                  {book.author && <p className="text-sm text-gray-600 mt-1">著者: {book.author}</p>}
                </>
              )}

              {/* 推薦者情報 */}
              {user && (
                <div className="mt-3 flex items-center gap-2">
                  {user.avatar_url && (
                    <Image
                      src={user.avatar_url}
                      alt="user avatar"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-700 font-medium">{user.name}</span>
                </div>
              )}

              {/* コメントやカテゴリ */}
              {rec.comment && (
                <p className="mt-2 text-gray-700 text-sm line-clamp-3">{rec.comment}</p>
              )}
              {rec.category && (
                <span className="mt-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full w-fit">
                  {rec.category}
                </span>
              )}

              {/* 詳細ページへのリンク */}
              <div className="mt-auto pt-4">
                <Link
                  href={`/recommends/${rec.book_id}`}
                  className="text-blue-600 text-sm font-medium hover:underline">
                  詳細を見る
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
