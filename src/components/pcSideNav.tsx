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
  User,
} from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import SideNavFooter from '@/components/sideNavFooter';
import { createClient } from '@/utils/supabase/client';

interface SideNavItem {
  href: string;
  icon: JSX.Element;
  label: string;
  key: string; // キーを追加
}

export default function PcSideNav() {
  // 現在のパス (例: "/search", "/settings" など)
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        // ユーザーIDを取得
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('user_id', data.user.id)
          .single();

        if (userData) {
          setUserId(userData.id);
        }
      }
    };

    fetchUser();
  }, []);

  // パスを比較するための関数
  const isActive = (itemHref: string) => {
    // 完全一致でもよいが、下位パスを含めたい場合は startsWith も考慮
    // return pathname === itemHref;
    return pathname === itemHref || pathname.startsWith(itemHref + '/');
  };

  // 各項目に一意のキーを設定
  const sideNavItems: SideNavItem[] = [
    {
      href: userId ? `/profile/${userId}` : '/settings',
      icon: <User />,
      label: 'プロフィール',
      key: 'profile',
    },
    { href: '/bookshelf', icon: <LibraryBig />, label: 'My本棚', key: 'bookshelf' },
    { href: '/search', icon: <Search />, label: '検索', key: 'search' },
    { href: '/timeline', icon: <BookHeart />, label: 'タイムライン', key: 'timeline' },
    { href: '/settings', icon: <Settings />, label: '設定', key: 'settings' },
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
            {sideNavItems.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.key}>
                  <Link href={item.href} className="group">
                    {/* アクティブな場合に背景色や文字色を変更 */}
                    <div
                      className={`flex gap-4 pl-6 pr-8 py-2 rounded-r-full transition-colors
                    ${active ? 'bg-[#dc935cee] text-white font-semibold' : 'text-gray-700 hover:bg-[#f9eae5]'}
                    `}>
                      <span
                        className={`h-5 w-5 transition-colors ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
                        {item.icon}
                      </span>
                      <p>{item.label}</p>
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
