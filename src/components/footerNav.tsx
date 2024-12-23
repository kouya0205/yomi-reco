'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Search,
  Settings,
  BookHeart,
  LibraryBig,
  Upload,
  SquarePlus,
  CircleUserRound,
} from 'lucide-react';
import { JSX } from 'react';

interface NavItem {
  href: string;
  icon: JSX.Element;
}

export default function FooterNav() {
  const pathname = usePathname();

  // 必要に応じて好きな順番・アイコン・パスに変更してください。
  const navItems: NavItem[] = [
    { href: '/mybooks', icon: <LibraryBig /> }, // ブックマーク/本棚
    { href: '/search', icon: <Search /> }, // 検索
    { href: '/scan', icon: <SquarePlus /> }, // スキャン (バーコード読み取りなど)
    { href: '/recommend', icon: <BookHeart /> }, // おすすめ
    { href: '/settings', icon: <CircleUserRound /> }, // 設定
  ];

  // アクティブ判定用
  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(href) && href !== '/');
  // ↑ “/search/*” や “/settings/*” などサブルートも含めたい場合は startsWith などで調整

  return (
    <nav className="z-50 fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md">
      <div
        className="
        flex items-center justify-around
        bg-[#ffd19d]     /* お好みのクリーム色に */
        rounded-full
        shadow
        px-3 py-2
      ">
        {navItems.map(({ href, icon }) => {
          const active = isActive(href);
          return (
            <Link key={href} href={href}>
              <span
                className={`
                  flex h-10 w-10 items-center justify-center
                  rounded-full
                  transition-colors
                  ${active ? 'bg-[#dc935cee] text-white' : 'text-gray-500 hover:text-gray-700'}
                `}>
                {icon}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}