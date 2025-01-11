import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { ScrollBar } from '@/components/ui/scroll-area';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import Image from 'next/image';
import Link from 'next/link';
import { User } from 'types';

interface AvatarListProps {
  users: User[];
}

export const AvatarList: React.FC<AvatarListProps> = ({ users }: AvatarListProps) => {
  return (
    // アバターリスト
    <div className="w-full flex flex-row gap-2 m-4">
      <ScrollArea className="w-full rounded-md overflow-x-auto">
        <div className="flex gap-4 p-4">
          {users.map((user, index) => (
            <div key={index} className="gap-4 flex flex-col items-center">
              <Link href={`/bookshelf/${user.id}`}>
                <div className="w-20 h-20 ring-2 ring-offset-2 ring-blue-500 hover:ring-offset-blue-300 transition-all rounded-full cursor-pointer overflow-hidden">
                  <Image
                    src={user.avatar_url ?? '/images/default-user-icon.webp'}
                    alt={user.name ?? 'avatar'}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                </div>
              </Link>
              <span className="text-xs md:text-sm font-medium text-gray-700">{user.name}</span>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
