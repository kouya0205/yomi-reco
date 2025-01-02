'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; // ここがポイント
import {
  Home,
  Search,
  ScanLine,
  Bell,
  Settings,
  LibraryBig,
  BookHeart,
  SquarePlus,
} from 'lucide-react';
import { JSX } from 'react';
import SideNavFooter from '@/components/sideNavFooter';

interface SideNavItem {
  href: string;
  icon: JSX.Element;
  label: string;
}

export default function PcSideNav() {
  // 現在のパス (例: "/search", "/settings" など)
  const pathname = usePathname();

  // パスを比較するための関数
  const isActive = (itemHref: string) => {
    // 完全一致でもよいが、下位パスを含めたい場合は startsWith も考慮
    // return pathname === itemHref;
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };

  const sideNavItems: SideNavItem[] = [
    { href: '/', icon: <Home />, label: 'ホーム' },
    { href: '/mybooks', icon: <LibraryBig />, label: 'My本棚' },
    { href: '/search', icon: <Search />, label: '検索' },
    { href: '/scan', icon: <SquarePlus />, label: '本の登録' },
    { href: '/recommend', icon: <BookHeart />, label: 'おすすめ' },
    { href: '/notifications', icon: <Bell />, label: 'お知らせ' },
    { href: '/settings', icon: <Settings />, label: '設定' },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between  h-screen w-[240px] bg-[#FFF3EC] border-r border-[#f3e4da] pt-8 pb-6">
      <div className="w-full">
        <div className="flex flex-col items-center mb-8">
          {/* <Image src="/yondako-logo.svg" alt="yondako logo" width={120} height={40} /> */}
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="w-full">
          <ul className="flex flex-col gap-4">
            {sideNavItems.map(({ href, icon, label }) => {
              const active = isActive(href);

              return (
                <li key={href}>
                  <Link href={href} className="group">
                    {/* アクティブな場合に背景色や文字色を変更 */}
                    <div
                      className={`flex gap-4 pl-6 pr-8 py-2 rounded-r-full transition-colors
                    ${active ? 'bg-[#dc935cee] text-white font-semibold' : 'text-gray-700 hover:bg-[#f9eae5]'}
                    `}>
                      <span
                        className={`h-5 w-5 transition-colors ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        {icon}
                      </span>
                      <p>{label}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <SideNavFooter />
    </aside>
  );
}
