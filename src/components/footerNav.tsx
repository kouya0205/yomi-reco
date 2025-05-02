'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Settings, BookHeart, LibraryBig, SquarePlus, Bell, User } from 'lucide-react';
import { JSX, useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface NavItem {
  href: string;
  icon: JSX.Element;
  key: string;
}

export default function FooterNav() {
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

  // 必要に応じて好きな順番・アイコン・パスに変更してください。
  const navItems: NavItem[] = [
    { href: '/bookshelf', icon: <LibraryBig />, key: 'bookshelf' },
    { href: '/search', icon: <Search />, key: 'search' },
    { href: '/timeline', icon: <BookHeart />, key: 'timeline' },
    { href: userId ? `/profile/${userId}` : '/settings', icon: <User />, key: 'profile' },
    { href: '/settings', icon: <Settings />, key: 'settings' },
  ];

  // アクティブ判定用
  const isActive = (href: string) =>
    pathname === href || (pathname?.startsWith(href) && href !== '/');
  // ↑ "/search/*" や "/settings/*" などサブルートも含めたい場合は startsWith などで調整

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
        {navItems.map(({ href, icon, key }) => {
          const active = isActive(href);
          return (
            <Link key={key} href={href}>
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
