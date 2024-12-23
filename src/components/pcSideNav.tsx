import Link from 'next/link';

export default function PcSideNav() {
  return (
    <nav className="h-full p-4">
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="block px-2 py-2 rounded hover:bg-gray-100">
            ダッシュボード
          </Link>
        </li>
        <li>
          <Link href="/recommend" className="block px-2 py-2 rounded hover:bg-gray-100">
            おすすめ一覧
          </Link>
        </li>
        <li>
          <Link href="/mybooks" className="block px-2 py-2 rounded hover:bg-gray-100">
            本棚
          </Link>
        </li>
        <li>
          <Link href="/search" className="block px-2 py-2 rounded hover:bg-gray-100">
            設定
          </Link>
        </li>
        {/* 必要に応じて他のリンクも追加 */}
      </ul>
    </nav>
  );
}
