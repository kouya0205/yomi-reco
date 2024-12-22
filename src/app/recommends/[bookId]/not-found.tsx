import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-gray-50 p-4">
      {/* アイコン部分：たとえばヒューマン風の絵文字などを使用 */}
      <div className="text-6xl mb-4">📚❓</div>

      <h2 className="text-2xl font-bold mb-2 text-gray-700">
        指定された本が見つかりませんでした。
      </h2>

      <p className="text-gray-500 mb-6">URLが間違っているか、すでに削除された可能性があります。</p>

      <Link
        href="/recommends"
        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded">
        おすすめ本一覧に戻る
      </Link>
    </div>
  );
}
