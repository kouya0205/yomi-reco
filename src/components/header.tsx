import { createClient } from '@/utils/supabase/server';
import { Bell, Heart, LogIn } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="bg-[#fff3e9] text-gray-500">
      <div className="relative flex items-center justify-center p-3 lg:hidden">
        <Image src="/logo.svg" alt="logo" width={200} height={30} />
        {user ? (
          <div></div>
        ) : (
          // <Link href="/favorites" className="absolute right-4 top-1/2 -translate-y-1/2">
          //   <span
          //     className={`
          //     flex h-10 w-10 items-center justify-center
          //     rounded-full
          //     transition-colors
          //   `}>
          //     <Bell />
          //   </span>
          // </Link>
          <Link href="/login" className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <LogIn />
            <p>log in</p>
          </Link>
        )}
      </div>
    </header>
  );
}
